import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  LANGUAGE_OPTIONS,
  POPULAR_LANGUAGE_OPTIONS,
} from "./model-options";

describe("DEFAULT_SETTINGS", () => {
  /**
   * 锁定首次访问所需下载量较小的默认模型和计算后端。
   */
  it("默认使用 Whisper Tiny Q8 WASM 和英语", () => {
    expect(DEFAULT_SETTINGS).toMatchObject({
      model: "onnx-community/whisper-tiny",
      backend: "wasm",
      language: "en",
    });
  });

  /**
   * 语言清单应覆盖当前 Whisper 运行时的 99 个语言代码，且常用语言优先。
   */
  it("提供 99 种 Whisper 语言并优先排列常用语言", () => {
    expect(LANGUAGE_OPTIONS).toHaveLength(99);
    expect(new Set(LANGUAGE_OPTIONS.map((language) => language.value)).size).toBe(99);
    expect(POPULAR_LANGUAGE_OPTIONS.slice(0, 5).map((language) => language.value))
      .toEqual(["en", "zh", "es", "ar", "hi"]);
  });
});
