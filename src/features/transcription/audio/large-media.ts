import type { TranscriptChunk } from "../contracts";
import {
  LARGE_DURATION_LIMIT_SECONDS,
  LARGE_FILE_LIMIT_BYTES,
  LARGE_SEGMENT_CONTEXT_SECONDS,
  LARGE_SEGMENT_CORE_SECONDS,
} from "../model-options";
import { validateMediaFormat } from "./decode-audio";

const WHISPER_SAMPLE_RATE = 16_000;

export interface LargeMediaSegment {
  coreStart: number;
  coreEnd: number;
  decodeStart: number;
  decodeEnd: number;
  isLast: boolean;
}

export interface LargeMediaDecoder {
  durationSeconds: number;
  decodeSegment: (segment: LargeMediaSegment) => Promise<Float32Array>;
  dispose: () => void;
}

export interface WaitEstimate {
  lowerSeconds: number;
  upperSeconds: number;
}

/**
 * 检查大文件入口允许的扩展名和 1GB 文件大小上限。
 */
export function validateLargeMediaFile(file: Pick<File, "name" | "size">): void {
  validateMediaFormat(file.name);
  if (file.size > LARGE_FILE_LIMIT_BYTES) {
    throw new Error("LARGE_FILE_TOO_LARGE");
  }
}

/**
 * 将媒体时长拆为带上下文重叠的五分钟主体片段。
 */
export function createLargeMediaSegments(durationSeconds: number): LargeMediaSegment[] {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return [];

  const segments: LargeMediaSegment[] = [];
  for (let coreStart = 0; coreStart < durationSeconds; coreStart += LARGE_SEGMENT_CORE_SECONDS) {
    const coreEnd = Math.min(durationSeconds, coreStart + LARGE_SEGMENT_CORE_SECONDS);
    const isLast = coreEnd >= durationSeconds;
    segments.push({
      coreStart,
      coreEnd,
      decodeStart: Math.max(0, coreStart - LARGE_SEGMENT_CONTEXT_SECONDS),
      decodeEnd: Math.min(durationSeconds, coreEnd + LARGE_SEGMENT_CONTEXT_SECONDS),
      isLast,
    });
  }
  return segments;
}

/**
 * 将单段 Whisper 时间戳换算到整份媒体，并按主体区间去除重叠结果。
 */
export function mergeLargeMediaSegment(
  current: TranscriptChunk[],
  incoming: TranscriptChunk[],
  fallbackText: string,
  segment: LargeMediaSegment,
): TranscriptChunk[] {
  const normalized = incoming.length > 0
    ? incoming.map((chunk) => ({
        text: chunk.text,
        timestamp: [
          chunk.timestamp[0] === null ? null : chunk.timestamp[0] + segment.decodeStart,
          chunk.timestamp[1] === null ? null : chunk.timestamp[1] + segment.decodeStart,
        ] satisfies [number | null, number | null],
      }))
    : fallbackText.trim()
      ? [{ text: fallbackText.trim(), timestamp: [segment.coreStart, segment.coreEnd] as [number, number] }]
      : [];

  const owned = normalized.filter((chunk) => {
    const start = chunk.timestamp[0];
    const end = chunk.timestamp[1] ?? start;
    if (start === null || end === null) return true;
    const midpoint = start + (end - start) / 2;
    return midpoint >= segment.coreStart
      && (segment.isLast ? midpoint <= segment.coreEnd : midpoint < segment.coreEnd);
  });

  return [...current, ...owned];
}

/**
 * 根据本机已经完成的音频与活跃处理时间计算带误差范围的剩余时间。
 */
export function estimateRemainingTime(
  activeProcessingSeconds: number,
  processedAudioSeconds: number,
  totalAudioSeconds: number,
): WaitEstimate | null {
  if (
    activeProcessingSeconds <= 0
    || processedAudioSeconds < 30
    || totalAudioSeconds <= processedAudioSeconds
  ) {
    return null;
  }

  const remainingSeconds = totalAudioSeconds - processedAudioSeconds;
  const estimate = (activeProcessingSeconds / processedAudioSeconds) * remainingSeconds;
  return {
    lowerSeconds: Math.max(1, Math.round(estimate * 0.75)),
    upperSeconds: Math.max(1, Math.round(estimate * 1.25)),
  };
}

/**
 * 将多声道 AudioBuffer 的指定帧范围混合成单声道。
 */
function downmixBufferRange(buffer: AudioBuffer, startFrame: number, endFrame: number): Float32Array {
  const length = Math.max(0, endFrame - startFrame);
  const mono = new Float32Array(length);
  const normalization = 1 / Math.sqrt(buffer.numberOfChannels);

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let index = 0; index < length; index += 1) {
      mono[index] += data[startFrame + index] * normalization;
    }
  }
  return mono;
}

/**
 * 使用线性插值把完整片段重采样为 Whisper 需要的 16kHz PCM。
 */
function resampleSegment(samples: Float32Array, sourceRate: number): Float32Array {
  if (sourceRate === WHISPER_SAMPLE_RATE) return samples;
  const ratio = sourceRate / WHISPER_SAMPLE_RATE;
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
 * 合并同一媒体片段内逐包解码得到的单声道数组。
 */
function concatenateSamples(chunks: Float32Array[]): Float32Array {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Float32Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

/**
 * 按需加载 Mediabunny，读取主音轨元数据并创建可逐段解码的本地会话。
 */
export async function openLargeMediaDecoder(file: File): Promise<LargeMediaDecoder> {
  validateLargeMediaFile(file);
  const { ALL_FORMATS, AudioBufferSink, BlobSource, Input } = await import("mediabunny");
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });

  try {
    if (!(await input.canRead())) throw new Error("LARGE_FORMAT_UNREADABLE");
    const track = await input.getPrimaryAudioTrack();
    if (!track) throw new Error("LARGE_NO_AUDIO_TRACK");
    if (!(await track.canDecode())) throw new Error("LARGE_CODEC_UNSUPPORTED");

    const firstTimestamp = await input.getFirstTimestamp([track]);
    const metadataEnd = await input.getDurationFromMetadata([track]);
    if (metadataEnd !== null && metadataEnd - firstTimestamp > LARGE_DURATION_LIMIT_SECONDS) {
      throw new Error("LARGE_MEDIA_TOO_LONG");
    }

    const preciseEnd = await input.computeDuration([track]);
    const durationSeconds = preciseEnd - firstTimestamp;
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      throw new Error("LARGE_DURATION_UNAVAILABLE");
    }
    if (durationSeconds > LARGE_DURATION_LIMIT_SECONDS) {
      throw new Error("LARGE_MEDIA_TOO_LONG");
    }

    const sampleRate = await track.getSampleRate();
    const sink = new AudioBufferSink(track);

    return {
      durationSeconds,
      decodeSegment: async (segment) => {
        const absoluteStart = firstTimestamp + segment.decodeStart;
        const absoluteEnd = firstTimestamp + segment.decodeEnd;
        const chunks: Float32Array[] = [];

        for await (const item of sink.buffers(absoluteStart, absoluteEnd)) {
          const overlapStart = Math.max(absoluteStart, item.timestamp);
          const overlapEnd = Math.min(absoluteEnd, item.timestamp + item.duration);
          if (overlapEnd <= overlapStart) continue;
          const startFrame = Math.max(0, Math.floor((overlapStart - item.timestamp) * item.buffer.sampleRate));
          const endFrame = Math.min(
            item.buffer.length,
            Math.ceil((overlapEnd - item.timestamp) * item.buffer.sampleRate),
          );
          chunks.push(downmixBufferRange(item.buffer, startFrame, endFrame));
        }

        const mono = concatenateSamples(chunks);
        if (mono.length === 0) throw new Error("LARGE_SEGMENT_EMPTY");
        return resampleSegment(mono, sampleRate);
      },
      dispose: () => input.dispose(),
    };
  } catch (error) {
    input.dispose();
    throw error;
  }
}
