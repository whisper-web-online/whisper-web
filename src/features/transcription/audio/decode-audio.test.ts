import { describe, expect, it } from "vitest";
import { validateMediaFormat } from "./decode-audio";

describe("validateMediaFormat", () => {
  /**
   * 产品列出的九种格式应全部通过，且扩展名大小写不敏感。
   */
  it.each(["mp3", "mp4", "m4a", "wav", "ogg", "opus", "webm", "aac", "flac"])(
    "接受 %s 文件",
    (extension) => {
      expect(() => validateMediaFormat(`sample.${extension.toUpperCase()}`)).not.toThrow();
    },
  );

  /**
   * 未列出的扩展名应在媒体解码前给出明确错误。
   */
  it("拒绝未支持的文件扩展名", () => {
    expect(() => validateMediaFormat("sample.mov")).toThrow(
      "Unsupported media format. Choose MP3, MP4, M4A, WAV, OGG, OPUS, WebM, AAC, FLAC.",
    );
  });
});
