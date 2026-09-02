export const PLAUSIBLE_EVENTS = {
  standardMediaSelected: "Standard Transcription Media Selected",
  standardTranscriptionStarted: "Standard Transcription Started",
  standardTranscriptionCompleted: "Standard Transcription Completed",
  standardTranscriptionFailed: "Standard Transcription Failed",
  largeFileMediaSelected: "Large File Transcription Media Selected",
  largeFileTranscriptionStarted: "Large File Transcription Started",
  largeFileTranscriptionCompleted: "Large File Transcription Completed",
  largeFileTranscriptionFailed: "Large File Transcription Failed",
  transcriptCopied: "Transcript Copied",
  transcriptExported: "Transcript Exported",
  converterMediaSelected: "Converter Media Selected",
  conversionStarted: "Conversion Started",
  conversionCompleted: "Conversion Completed",
  conversionFailed: "Conversion Failed",
  convertedAudioDownloaded: "Converted Audio Downloaded",
  conversionDeleted: "Conversion Deleted",
} as const;

type PlausibleEventName = (typeof PLAUSIBLE_EVENTS)[keyof typeof PLAUSIBLE_EVENTS];
type PlausibleProperty = string | number | boolean;
type PlausibleFunction = ((
  eventName: PlausibleEventName,
  options?: { props: Record<string, PlausibleProperty> },
) => void) & { q?: unknown[][] };

interface PlausibleWindow extends Window {
  plausible?: PlausibleFunction;
}

/**
 * 向 Plausible 发送不含媒体名称、地址或转录内容的产品事件。
 */
export function trackPlausibleEvent(
  eventName: PlausibleEventName,
  props?: Record<string, PlausibleProperty>,
): void {
  if (typeof window === "undefined") return;

  const plausibleWindow = window as PlausibleWindow;
  if (!plausibleWindow.plausible) {
    const queuedPlausible = ((...args: unknown[]) => {
      queuedPlausible.q = queuedPlausible.q ?? [];
      queuedPlausible.q.push(args);
    }) as PlausibleFunction;
    plausibleWindow.plausible = queuedPlausible;
  }

  plausibleWindow.plausible(eventName, props ? { props } : undefined);
}

/**
 * 把完整模型标识转换为稳定、低基数的统计属性。
 */
export function getPlausibleModelName(model: string): string {
  return model.split("/").at(-1)?.replace("whisper-", "") || "unknown";
}

/**
 * 把媒体时长归入低基数区间，避免上报精确媒体信息。
 */
export function getPlausibleDurationBucket(durationSeconds: number): string {
  if (durationSeconds < 5 * 60) return "under_5m";
  if (durationSeconds <= 20 * 60) return "5_to_20m";
  if (durationSeconds <= 40 * 60) return "20_to_40m";
  return "40_to_60m";
}

/**
 * 把转换输入大小归入稳定区间，避免上报精确文件大小。
 */
export function getPlausibleSizeBucket(sizeBytes: number): string {
  const sizeMiB = sizeBytes / (1024 * 1024);
  if (sizeMiB < 50) return "under_50mb";
  if (sizeMiB < 150) return "50_to_150mb";
  return "150_to_300mb";
}
