import type {
  AnalyzedVideo,
  ConversionBitrate,
  ConversionInputFormat,
  ConversionOutput,
} from "./contracts";
import {
  CONVERTER_DURATION_LIMIT_SECONDS,
  CONVERTER_FILE_LIMIT_BYTES,
  ConverterError,
} from "./contracts";

const INPUT_EXTENSION_PATTERN = /\.([^.]+)$/;
const MP3_COMPATIBLE_SAMPLE_RATES = [
  8_000,
  11_025,
  12_000,
  16_000,
  22_050,
  24_000,
  32_000,
  44_100,
  48_000,
] as const;

/**
 * 从文件名提取并验证 v1 支持的容器扩展名。
 */
export function getInputFormatFromFileName(fileName: string): ConversionInputFormat {
  const extension = INPUT_EXTENSION_PATTERN.exec(fileName.trim())?.[1]?.toLowerCase();
  if (extension === "mp4" || extension === "mov" || extension === "webm") return extension;
  throw new ConverterError(
    "unsupported_extension",
    "Only MP4, MOV and WebM video files are supported.",
  );
}

/**
 * 生成去除最后一个扩展名后的 MP3 输出文件名。
 */
export function createOutputFileName(sourceFileName: string): string {
  const trimmedName = sourceFileName.trim();
  const baseName = trimmedName.replace(/\.[^.]*$/, "").trim();
  return `${baseName || "converted-audio"}.mp3`;
}

/**
 * 在读取媒体内容前执行零字节、扩展名和 300 MiB 门禁。
 */
export function validateVideoFile(file: File): ConversionInputFormat {
  if (file.size === 0) {
    throw new ConverterError("empty_file", "The selected file is empty.");
  }
  const inputFormat = getInputFormatFromFileName(file.name);
  if (file.size > CONVERTER_FILE_LIMIT_BYTES) {
    throw new ConverterError(
      "file_too_large",
      "This video is larger than the 300 MB local limit.",
    );
  }
  return inputFormat;
}

/**
 * 为 MP3 编码器选择最接近输入、且受 LAME 支持的采样率。
 */
export function getCompatibleMp3SampleRate(inputSampleRate: number): number {
  let closest: number = MP3_COMPATIBLE_SAMPLE_RATES[0];
  for (const sampleRate of MP3_COMPATIBLE_SAMPLE_RATES) {
    if (Math.abs(sampleRate - inputSampleRate) < Math.abs(closest - inputSampleRate)) {
      closest = sampleRate;
    }
  }
  return closest;
}

/**
 * 将 Mediabunny 识别到的容器映射为产品合同中的格式。
 */
function mapDetectedFormat(formatName: string): ConversionInputFormat | null {
  if (formatName === "MP4") return "mp4";
  if (formatName === "QuickTime File Format") return "mov";
  if (formatName === "WebM") return "webm";
  return null;
}

/**
 * 验证扩展名与运行时探测到的真实容器一致。
 */
function assertMatchingContainer(
  expected: ConversionInputFormat,
  detectedName: string,
): ConversionInputFormat {
  const detected = mapDetectedFormat(detectedName);
  if (!detected) {
    throw new ConverterError("unreadable_container", "The video container could not be read.");
  }
  if (detected !== expected) {
    throw new ConverterError(
      "container_mismatch",
      "The file extension does not match the detected video container.",
    );
  }
  return detected;
}

/**
 * 使用 Mediabunny 读取容器、时长和主音轨，不保留源视频或解码缓冲。
 */
export async function analyzeVideoFile(file: File, signal?: AbortSignal): Promise<AnalyzedVideo> {
  const expectedFormat = validateVideoFile(file);
  if (signal?.aborted) throw new ConverterError("cancelled", "The analysis was cancelled.");
  const { BlobSource, Input, MP4, QTFF, WEBM } = await import("mediabunny");
  const input = new Input({
    source: new BlobSource(file),
    formats: [MP4, QTFF, WEBM],
  });
  /** 在分析期间释放输入，让 Mediabunny 中止后续读取。 */
  const handleAbort = () => input.dispose();
  signal?.addEventListener("abort", handleAbort, { once: true });

  try {
    if (!(await input.canRead())) {
      throw new ConverterError("unreadable_container", "The video container could not be read.");
    }
    const detectedFormat = assertMatchingContainer(expectedFormat, (await input.getFormat()).name);
    const audioTrack = await input.getPrimaryAudioTrack();
    if (!audioTrack) {
      throw new ConverterError("no_audio_track", "No audio track was found in this video.");
    }

    const [metadataDuration, audioCodec, numberOfChannels, sampleRate, canDecode] = await Promise.all([
      input.getDurationFromMetadata([audioTrack]),
      audioTrack.getCodec(),
      audioTrack.getNumberOfChannels(),
      audioTrack.getSampleRate(),
      audioTrack.canDecode(),
    ]);
    const durationSeconds = metadataDuration ?? await input.computeDuration([audioTrack]);
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      throw new ConverterError("unreadable_container", "The video duration could not be read.");
    }
    if (durationSeconds > CONVERTER_DURATION_LIMIT_SECONDS) {
      throw new ConverterError(
        "duration_too_long",
        "This video is longer than the 20 minute local limit.",
      );
    }
    if (!audioCodec || !canDecode) {
      throw new ConverterError(
        "unsupported_audio_codec",
        "This browser cannot decode the video's primary audio track.",
      );
    }

    return {
      file,
      sourceFileName: file.name,
      outputFileName: createOutputFileName(file.name),
      inputFormat: detectedFormat,
      inputSizeBytes: file.size,
      durationSeconds,
      audioCodec,
      numberOfChannels,
      sampleRate,
    };
  } catch (reason) {
    if (signal?.aborted) {
      throw new ConverterError("cancelled", "The analysis was cancelled.", { cause: reason });
    }
    if (reason instanceof ConverterError) throw reason;
    throw new ConverterError(
      "unreadable_container",
      "The video container could not be read.",
      { cause: reason },
    );
  } finally {
    signal?.removeEventListener("abort", handleAbort);
    input.dispose();
  }
}

interface ConvertVideoOptions {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

/**
 * 仅转换主音轨为固定码率 MP3，并在取消或失败时释放输入和编码资源。
 */
export async function convertVideoToMp3(
  analyzed: AnalyzedVideo,
  bitrateKbps: ConversionBitrate,
  options: ConvertVideoOptions = {},
): Promise<ConversionOutput> {
  if (options.signal?.aborted) {
    throw new ConverterError("cancelled", "The conversion was cancelled.");
  }

  const mediabunny = await import("mediabunny");
  let registerMp3Encoder: (() => void) | null = null;
  try {
    if (!(await mediabunny.canEncodeAudio("mp3"))) {
      ({ registerMp3Encoder } = await import("@mediabunny/mp3-encoder"));
      registerMp3Encoder();
    }
  } catch (reason) {
    throw new ConverterError(
      "encoder_load_failed",
      "The local MP3 conversion engine could not be prepared.",
      { cause: reason },
    );
  }

  const input = new mediabunny.Input({
    source: new mediabunny.BlobSource(analyzed.file),
    formats: [mediabunny.MP4, mediabunny.QTFF, mediabunny.WEBM],
  });
  const target = new mediabunny.BufferTarget();
  const output = new mediabunny.Output({
    format: new mediabunny.Mp3OutputFormat(),
    target,
  });
  let conversion: Awaited<ReturnType<typeof mediabunny.Conversion.init>> | null = null;
  let lastProgress = 0;

  /**
   * 将 AbortSignal 映射为 Mediabunny 的资源取消操作。
   */
  const handleAbort = () => {
    void conversion?.cancel();
  };
  options.signal?.addEventListener("abort", handleAbort, { once: true });

  try {
    const audioTrack = await input.getPrimaryAudioTrack();
    if (!audioTrack) {
      throw new ConverterError("no_audio_track", "No audio track was found in this video.");
    }
    const numberOfChannels = Math.min(await audioTrack.getNumberOfChannels(), 2);
    const sampleRate = getCompatibleMp3SampleRate(await audioTrack.getSampleRate());
    conversion = await mediabunny.Conversion.init({
      input,
      output,
      tracks: "primary",
      video: { discard: true },
      audio: {
        codec: "mp3",
        forceTranscode: true,
        numberOfChannels,
        sampleRate,
        quality: new mediabunny.Quality({
          bitrate: bitrateKbps * 1_000,
          bitrateMode: "constant",
        }),
      },
      tags: {},
      showWarnings: false,
    });
    if (!conversion.isValid || !conversion.utilizedTracks.includes(audioTrack)) {
      throw new ConverterError(
        "unsupported_audio_codec",
        "This browser cannot convert the video's primary audio track.",
      );
    }
    conversion.onProgress = (progress: number) => {
      const nextProgress = Math.max(lastProgress, Math.min(1, progress));
      lastProgress = nextProgress;
      options.onProgress?.(nextProgress);
    };
    await conversion.execute();
    if (options.signal?.aborted) {
      throw new ConverterError("cancelled", "The conversion was cancelled.");
    }
    if (!target.buffer) {
      throw new ConverterError("conversion_failed", "No MP3 output was generated.");
    }

    const audioBlob = new Blob([target.buffer], { type: "audio/mpeg" });
    return {
      audioBlob,
      outputFileName: analyzed.outputFileName,
      outputSizeBytes: audioBlob.size,
      durationSeconds: analyzed.durationSeconds,
      bitrateKbps,
    };
  } catch (reason) {
    if (
      reason instanceof ConverterError
      || reason instanceof mediabunny.ConversionCanceledError
      || options.signal?.aborted
    ) {
      if (reason instanceof ConverterError) throw reason;
      throw new ConverterError("cancelled", "The conversion was cancelled.", { cause: reason });
    }
    throw new ConverterError(
      "conversion_failed",
      "The video could not be converted to MP3.",
      { cause: reason },
    );
  } finally {
    options.signal?.removeEventListener("abort", handleAbort);
    if (conversion && conversion.state !== "done" && conversion.state !== "canceled") {
      await conversion.cancel().catch(() => undefined);
    }
    input.dispose();
  }
}
