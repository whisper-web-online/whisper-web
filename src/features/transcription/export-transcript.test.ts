import { describe, expect, it } from "vitest";
import { createTranscriptExport, formatTimestamp } from "./export-transcript";
import type { TranscriptRecord } from "./contracts";

const record: TranscriptRecord = {
  id: "fixture",
  title: "sample.mp4",
  text: "Hello world.",
  chunks: [{ text: "Hello world.", timestamp: [1.25, 3.5] }],
  createdAt: 0,
  durationSeconds: 4,
  source: "file",
  model: "onnx-community/whisper-tiny",
  language: "en",
  task: "transcribe",
  backend: "wasm",
};

/**
 * 通过浏览器 FileReader 读取 jsdom Blob，兼容其缺少 Blob.text 的实现。
 */
function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result));
    reader.readAsText(blob);
  });
}

describe("formatTimestamp", () => {
  it("输出标准字幕时间", () => {
    expect(formatTimestamp(3661.125)).toBe("01:01:01,125");
  });
});

describe("createTranscriptExport", () => {
  it("生成带时间范围的 SRT", async () => {
    const blob = createTranscriptExport(record, "srt");
    await expect(readBlob(blob)).resolves.toContain("00:00:01,250 --> 00:00:03,500");
  });

  it("生成 WEBVTT 文件头", async () => {
    const blob = createTranscriptExport(record, "vtt");
    await expect(readBlob(blob)).resolves.toMatch(/^WEBVTT/);
  });
});
