const WHISPER_SAMPLE_RATE = 16_000;
const WHISPER_CHUNK_LENGTH_SECONDS = 30;
const WHISPER_STRIDE_LENGTH_SECONDS = 5;

/**
 * 按 Transformers.js 当前的 30 秒窗口和双侧 5 秒重叠规则计算推理分块总数。
 */
export function calculateWhisperChunkCount(sampleCount: number): number {
  const safeSampleCount = Math.max(0, Math.floor(sampleCount));
  const windowSamples = WHISPER_SAMPLE_RATE * WHISPER_CHUNK_LENGTH_SECONDS;
  if (safeSampleCount <= windowSamples) return 1;

  const strideSamples = WHISPER_SAMPLE_RATE * WHISPER_STRIDE_LENGTH_SECONDS;
  const jumpSamples = windowSamples - 2 * strideSamples;
  return 1 + Math.ceil((safeSampleCount - windowSamples) / jumpSamples);
}
