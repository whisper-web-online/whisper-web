import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UI_COPY } from "@/i18n/ui-copy";
import { ModelProgress } from "./model-progress";

describe("ModelProgress", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  /**
   * 返回当前进度条对外暴露的整数百分比。
   */
  function readProgress(): number {
    return Number(screen.getByRole("progressbar").getAttribute("aria-valuenow"));
  }

  /**
   * 各阶段应单调推进，并且真实完成前不得出现 100%。
   */
  it("在阶段范围内模拟增长并只在完成态到达百分百", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <ModelProgress
        copy={UI_COPY.en.input.progress}
        downloadProgress={0}
        state="decoding"
        transcriptionProgress={{ completedChunks: 0, totalChunks: 0 }}
      />,
    );

    expect(readProgress()).toBe(1);
    act(() => vi.advanceTimersByTime(1_500));
    const decodingProgress = readProgress();
    expect(decodingProgress).toBeGreaterThan(1);
    expect(decodingProgress).toBeLessThanOrEqual(9);

    rerender(
      <ModelProgress
        copy={UI_COPY.en.input.progress}
        downloadProgress={100}
        state="transcribing"
        transcriptionProgress={{ completedChunks: 0, totalChunks: 1 }}
      />,
    );
    expect(readProgress()).toBeGreaterThanOrEqual(35);
    act(() => vi.advanceTimersByTime(2_000));
    expect(readProgress()).toBeLessThanOrEqual(94);

    rerender(
      <ModelProgress
        copy={UI_COPY.en.input.progress}
        downloadProgress={100}
        state="saving"
        transcriptionProgress={{ completedChunks: 1, totalChunks: 1 }}
      />,
    );
    expect(readProgress()).toBeGreaterThanOrEqual(96);
    act(() => vi.advanceTimersByTime(20_000));
    expect(readProgress()).toBe(99);

    rerender(
      <ModelProgress
        copy={UI_COPY.en.input.progress}
        downloadProgress={100}
        state="complete"
        transcriptionProgress={{ completedChunks: 1, totalChunks: 1 }}
      />,
    );
    expect(readProgress()).toBe(100);
  });

  /**
   * 暂停会从头重跑，因此百分比必须归零且定时器不能继续推进。
   */
  it("暂停后归零并停止模拟增长", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <ModelProgress
        copy={UI_COPY.en.input.progress}
        downloadProgress={100}
        state="transcribing"
        transcriptionProgress={{ completedChunks: 1, totalChunks: 4 }}
      />,
    );

    expect(readProgress()).toBe(50);
    rerender(
      <ModelProgress
        copy={UI_COPY.en.input.progress}
        downloadProgress={100}
        state="paused"
        transcriptionProgress={{ completedChunks: 0, totalChunks: 0 }}
      />,
    );
    expect(readProgress()).toBe(0);
    act(() => vi.advanceTimersByTime(5_000));
    expect(readProgress()).toBe(0);
  });

  /**
   * 运行阶段应循环展示等待提示，暂停后则固定显示暂停说明。
   */
  it("每六秒轮换安抚提示并在暂停时停止", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <ModelProgress
        copy={UI_COPY.en.input.progress}
        downloadProgress={100}
        state="transcribing"
        transcriptionProgress={{ completedChunks: 1, totalChunks: 4 }}
      />,
    );

    expect(screen.getByText("Whisper is processing your media on this device.")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(6_000));
    expect(screen.getByText(/Large files can take longer to decode/)).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(6_000));
    expect(screen.getByText(/Local transcription uses your CPU or GPU/)).toBeInTheDocument();

    rerender(
      <ModelProgress
        copy={UI_COPY.en.input.progress}
        downloadProgress={100}
        state="paused"
        transcriptionProgress={{ completedChunks: 0, totalChunks: 0 }}
      />,
    );
    expect(screen.getByText("No processing is running. Resume starts again from the beginning.")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(12_000));
    expect(screen.getByText("No processing is running. Resume starts again from the beginning.")).toBeInTheDocument();
  });
});
