export const CONVERTER_FILE_LIMIT_BYTES = 300 * 1024 * 1024;
export const CONVERTER_DURATION_LIMIT_SECONDS = 20 * 60;
export const CONVERSION_BITRATES = [128, 192, 320] as const;
export const DEFAULT_CONVERSION_BITRATE = 192;
export const CONVERTER_ACCEPT = ".mp4,.mov,.webm";

export type ConversionBitrate = (typeof CONVERSION_BITRATES)[number];
export type ConversionInputFormat = "mp4" | "mov" | "webm";

export interface AnalyzedVideo {
  file: File;
  sourceFileName: string;
  outputFileName: string;
  inputFormat: ConversionInputFormat;
  inputSizeBytes: number;
  durationSeconds: number;
  audioCodec: string;
  numberOfChannels: number;
  sampleRate: number;
}

export interface ConversionOutput {
  audioBlob: Blob;
  outputFileName: string;
  outputSizeBytes: number;
  durationSeconds: number;
  bitrateKbps: ConversionBitrate;
}

export interface ConversionRecord {
  id: string;
  sourceFileName: string;
  outputFileName: string;
  inputFormat: ConversionInputFormat;
  inputSizeBytes: number;
  outputSizeBytes: number;
  durationSeconds: number;
  bitrateKbps: ConversionBitrate;
  createdAt: number;
  expiresAt: number;
  audioBlob: Blob;
}

export type ConverterErrorCode =
  | "empty_file"
  | "unsupported_extension"
  | "file_too_large"
  | "unreadable_container"
  | "container_mismatch"
  | "no_audio_track"
  | "duration_too_long"
  | "unsupported_audio_codec"
  | "encoder_load_failed"
  | "conversion_failed"
  | "cancelled";

/**
 * 为转换流程提供可稳定本地化和统计分桶的错误类型。
 */
export class ConverterError extends Error {
  constructor(
    public readonly code: ConverterErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ConverterError";
  }
}
