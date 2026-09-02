import { describe, expect, it } from "vitest";
import { calculateWhisperChunkCount } from "./transcription-progress";

describe("calculateWhisperChunkCount", () => {
  /**
   * 不超过一个 30 秒窗口的音频只需要一个真实推理分块。
   */
  it("短音频和 30 秒边界返回单分块", () => {
    expect(calculateWhisperChunkCount(0)).toBe(1);
    expect(calculateWhisperChunkCount(16_000 * 30)).toBe(1);
  });

  /**
   * 超出窗口后应按每次前进 20 秒的真实重叠规则增加分块。
   */
  it("长音频按窗口与双侧重叠计算分块", () => {
    expect(calculateWhisperChunkCount(16_000 * 30 + 1)).toBe(2);
    expect(calculateWhisperChunkCount(16_000 * 50)).toBe(2);
    expect(calculateWhisperChunkCount(16_000 * 50 + 1)).toBe(3);
    expect(calculateWhisperChunkCount(16_000 * 60 * 20)).toBe(60);
  });
});
