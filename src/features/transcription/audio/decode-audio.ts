import {
  FREE_DURATION_LIMIT_SECONDS,
  FREE_FILE_LIMIT_BYTES,
  SUPPORTED_MEDIA_FORMATS,
} from "../model-options";

export interface DecodedAudio {
  samples: Float32Array;
  durationSeconds: number;
}

/**
 * 检查本地媒体文件扩展名是否属于产品明确支持的格式。
 */
export function validateMediaFormat(fileName: string): void {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension || !SUPPORTED_MEDIA_FORMATS.some((format) => format.extension === extension)) {
    throw new Error(
      `Unsupported media format. Choose ${SUPPORTED_MEDIA_FORMATS.map((format) => format.label).join(", ")}.`,
    );
  }
}

/**
 * 检查媒体文件是否满足免费本地模式的大小限制。
 */
export function validateMediaSize(size: number): void {
  if (size > FREE_FILE_LIMIT_BYTES) {
    throw new Error("This file is larger than the 300 MB local limit.");
  }
}

/**
 * 将多声道 AudioBuffer 混合成单声道 PCM。
 */
function downmixToMono(buffer: AudioBuffer): Float32Array {
  if (buffer.numberOfChannels === 1) {
    return new Float32Array(buffer.getChannelData(0));
  }

  const mono = new Float32Array(buffer.length);
  const normalization = 1 / Math.sqrt(buffer.numberOfChannels);

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let index = 0; index < buffer.length; index += 1) {
      mono[index] += data[index] * normalization;
    }
  }

  return mono;
}

/**
 * 使用线性插值将 PCM 重采样到 Whisper 所需的 16kHz。
 */
function resampleTo16Khz(samples: Float32Array, sourceRate: number): Float32Array {
  if (sourceRate === 16_000) {
    return samples;
  }

  const ratio = sourceRate / 16_000;
  const output = new Float32Array(Math.round(samples.length / ratio));

  for (let index = 0; index < output.length; index += 1) {
    const sourceIndex = index * ratio;
    const left = Math.floor(sourceIndex);
    const right = Math.min(left + 1, samples.length - 1);
    const weight = sourceIndex - left;
    output[index] = samples[left] * (1 - weight) + samples[right] * weight;
  }

  return output;
}

/**
 * 在浏览器中解码媒体并返回 16kHz 单声道 PCM，不上传原始文件。
 */
export async function decodeMedia(arrayBuffer: ArrayBuffer): Promise<DecodedAudio> {
  const AudioContextClass = window.AudioContext;
  const context = new AudioContextClass();

  try {
    const decoded = await context.decodeAudioData(arrayBuffer.slice(0));
    if (decoded.duration > FREE_DURATION_LIMIT_SECONDS) {
      throw new Error("This media is longer than the 20 minute local limit.");
    }

    const mono = downmixToMono(decoded);
    return {
      samples: resampleTo16Khz(mono, decoded.sampleRate),
      durationSeconds: decoded.duration,
    };
  } finally {
    await context.close();
  }
}
