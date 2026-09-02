import { describe, expect, it } from "vitest";
import type { TranscriptChunk } from "../contracts";
import {
  createLargeMediaSegments,
  estimateRemainingTime,
  mergeLargeMediaSegment,
  validateLargeMediaFile,
} from "./large-media";

describe("大文件分段规划", () => {
  it("为一小时媒体生成十二个带五秒上下文的主体片段", () => {
    const segments = createLargeMediaSegments(3600);

    expect(segments).toHaveLength(12);
    expect(segments[0]).toEqual({
      coreStart: 0,
      coreEnd: 300,
      decodeStart: 0,
      decodeEnd: 305,
      isLast: false,
    });
    expect(segments[1]).toEqual({
      coreStart: 300,
      coreEnd: 600,
      decodeStart: 295,
      decodeEnd: 605,
      isLast: false,
    });
    expect(segments.at(-1)).toEqual({
      coreStart: 3300,
      coreEnd: 3600,
      decodeStart: 3295,
      decodeEnd: 3600,
      isLast: true,
    });
  });

  it("保留不足五分钟的最后一段", () => {
    expect(createLargeMediaSegments(601).at(-1)).toEqual({
      coreStart: 600,
      coreEnd: 601,
      decodeStart: 595,
      decodeEnd: 601,
      isLast: true,
    });
  });
});

describe("大文件结果合并", () => {
  it("换算绝对时间并丢弃上下文中的重复时间块", () => {
    const incoming: TranscriptChunk[] = [
      { text: " duplicate", timestamp: [1, 3] },
      { text: " keep", timestamp: [7, 11] },
      { text: " next", timestamp: [308, 310] },
    ];
    const segment = createLargeMediaSegments(700)[1];

    expect(mergeLargeMediaSegment([], incoming, "", segment)).toEqual([
      { text: " keep", timestamp: [302, 306] },
    ]);
  });

  it("没有时间块时使用主体区间保存回退文本", () => {
    const segment = createLargeMediaSegments(120)[0];
    expect(mergeLargeMediaSegment([], [], " fallback ", segment)).toEqual([
      { text: "fallback", timestamp: [0, 120] },
    ]);
  });
});

describe("大文件限制与时间估算", () => {
  it("接受恰好 1GB 并拒绝超过 1GB 的文件", () => {
    expect(() => validateLargeMediaFile({ name: "audio.mp3", size: 1024 ** 3 })).not.toThrow();
    expect(() => validateLargeMediaFile({ name: "audio.mp3", size: 1024 ** 3 + 1 }))
      .toThrow("LARGE_FILE_TOO_LARGE");
  });

  it("首个 30 秒块完成后返回正负约百分之二十五的参考范围", () => {
    expect(estimateRemainingTime(20, 29, 600)).toBeNull();
    expect(estimateRemainingTime(60, 120, 600)).toEqual({
      lowerSeconds: 180,
      upperSeconds: 300,
    });
  });
});
