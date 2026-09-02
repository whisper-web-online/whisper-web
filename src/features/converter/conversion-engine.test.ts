import { describe, expect, it } from "vitest";
import {
  createOutputFileName,
  getCompatibleMp3SampleRate,
  getInputFormatFromFileName,
  validateVideoFile,
} from "./conversion-engine";
import { CONVERTER_FILE_LIMIT_BYTES, ConverterError } from "./contracts";

/**
 * 创建带名称和指定大小的浏览器文件测试替身。
 */
function createFile(name: string, size: number): File {
  const file = new File([], name);
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("MP4 to MP3 转换合同", () => {
  it("接受三种大小写不敏感的扩展名，并拒绝其他格式", () => {
    expect(getInputFormatFromFileName("video.MP4")).toBe("mp4");
    expect(getInputFormatFromFileName("clip.mov")).toBe("mov");
    expect(getInputFormatFromFileName("recording.WebM")).toBe("webm");
    expect(() => getInputFormatFromFileName("audio.mp3")).toThrowError(ConverterError);
  });

  it("按最后一个扩展名生成输出名，并对空基础名使用回退值", () => {
    expect(createOutputFileName("interview.final.mp4")).toBe("interview.final.mp3");
    expect(createOutputFileName(".mp4")).toBe("converted-audio.mp3");
    expect(createOutputFileName("   ")).toBe("converted-audio.mp3");
  });

  it("在读取媒体前拒绝零字节和超出 300 MiB 的文件", () => {
    expect(() => validateVideoFile(createFile("empty.mp4", 0))).toThrowError(
      expect.objectContaining({ code: "empty_file" }),
    );
    expect(() => validateVideoFile(createFile("large.mp4", CONVERTER_FILE_LIMIT_BYTES + 1)))
      .toThrowError(expect.objectContaining({ code: "file_too_large" }));
  });

  it("为非标准采样率选择最近的 MP3 兼容值", () => {
    expect(getCompatibleMp3SampleRate(44_100)).toBe(44_100);
    expect(getCompatibleMp3SampleRate(47_000)).toBe(48_000);
    expect(getCompatibleMp3SampleRate(20_000)).toBe(22_050);
  });
});
