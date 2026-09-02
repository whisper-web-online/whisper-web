import { afterEach, describe, expect, it, vi } from "vitest";
import { waitForCompletionFeedback } from "./sonora-app";

describe("waitForCompletionFeedback", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * 百分百完成状态应完整停留 400 毫秒后才允许继续切换结果页。
   */
  it("等待完成反馈展示时间", async () => {
    vi.useFakeTimers();
    let completed = false;
    const waiting = waitForCompletionFeedback().then(() => {
      completed = true;
    });

    await vi.advanceTimersByTimeAsync(399);
    expect(completed).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await waiting;
    expect(completed).toBe(true);
  });
});
