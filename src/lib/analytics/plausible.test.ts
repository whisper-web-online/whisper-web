import { afterEach, describe, expect, it } from "vitest";
import {
  getPlausibleDurationBucket,
  getPlausibleModelName,
  getPlausibleSizeBucket,
  PLAUSIBLE_EVENTS,
  trackPlausibleEvent,
} from "./plausible";

interface PlausibleTestWindow extends Window {
  plausible?: ((eventName: string, options?: { props: Record<string, string> }) => void) & {
    q?: unknown[][];
  };
}

describe("Plausible 自定义事件", () => {
  afterEach(() => {
    delete (window as PlausibleTestWindow).plausible;
  });

  it("使用独立事件名区分标准转录和大文件转录漏斗", () => {
    expect([
      PLAUSIBLE_EVENTS.standardMediaSelected,
      PLAUSIBLE_EVENTS.standardTranscriptionStarted,
      PLAUSIBLE_EVENTS.standardTranscriptionCompleted,
      PLAUSIBLE_EVENTS.standardTranscriptionFailed,
      PLAUSIBLE_EVENTS.largeFileMediaSelected,
      PLAUSIBLE_EVENTS.largeFileTranscriptionStarted,
      PLAUSIBLE_EVENTS.largeFileTranscriptionCompleted,
      PLAUSIBLE_EVENTS.largeFileTranscriptionFailed,
    ]).toEqual([
      "Standard Transcription Media Selected",
      "Standard Transcription Started",
      "Standard Transcription Completed",
      "Standard Transcription Failed",
      "Large File Transcription Media Selected",
      "Large File Transcription Started",
      "Large File Transcription Completed",
      "Large File Transcription Failed",
    ]);
  });

  it("保留转换漏斗要求的六个精确事件名", () => {
    expect([
      PLAUSIBLE_EVENTS.converterMediaSelected,
      PLAUSIBLE_EVENTS.conversionStarted,
      PLAUSIBLE_EVENTS.conversionCompleted,
      PLAUSIBLE_EVENTS.conversionFailed,
      PLAUSIBLE_EVENTS.convertedAudioDownloaded,
      PLAUSIBLE_EVENTS.conversionDeleted,
    ]).toEqual([
      "Converter Media Selected",
      "Conversion Started",
      "Conversion Completed",
      "Conversion Failed",
      "Converted Audio Downloaded",
      "Conversion Deleted",
    ]);
  });

  /**
   * 脚本尚未加载时也应将事件排入 Plausible 官方兼容队列。
   */
  it("在 Plausible 加载前保存事件和属性", () => {
    trackPlausibleEvent(PLAUSIBLE_EVENTS.standardTranscriptionStarted, {
      workflow: "standard",
      locale: "en",
    });

    expect((window as PlausibleTestWindow).plausible?.q).toEqual([[
      "Standard Transcription Started",
      { props: { workflow: "standard", locale: "en" } },
    ]]);
  });

  /**
   * 统计属性只保留稳定的模型短名和媒体时长区间。
   */
  it("生成低基数统计属性", () => {
    expect(getPlausibleModelName("onnx-community/whisper-tiny")).toBe("tiny");
    expect(getPlausibleDurationBucket(120)).toBe("under_5m");
    expect(getPlausibleDurationBucket(600)).toBe("5_to_20m");
    expect(getPlausibleDurationBucket(1_800)).toBe("20_to_40m");
    expect(getPlausibleDurationBucket(3_000)).toBe("40_to_60m");
    expect(getPlausibleSizeBucket(10 * 1024 * 1024)).toBe("under_50mb");
    expect(getPlausibleSizeBucket(100 * 1024 * 1024)).toBe("50_to_150mb");
    expect(getPlausibleSizeBucket(250 * 1024 * 1024)).toBe("150_to_300mb");
  });
});
