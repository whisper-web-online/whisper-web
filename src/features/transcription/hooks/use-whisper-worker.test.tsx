import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WorkerRequest, WorkerResponse } from "../contracts";
import { DEFAULT_SETTINGS } from "../model-options";
import { useWhisperWorker } from "./use-whisper-worker";

class FakeWorker {
  static instances: FakeWorker[] = [];

  readonly listeners = new Map<string, Set<EventListener>>();
  readonly messages: WorkerRequest[] = [];
  readonly terminate = vi.fn();

  /**
   * 记录新建实例，便于验证取消后是否真正重建 Worker。
   */
  constructor() {
    FakeWorker.instances.push(this);
  }

  /**
   * 注册测试所需的 Worker 事件监听器。
   */
  addEventListener(type: string, listener: EventListener): void {
    const listeners = this.listeners.get(type) ?? new Set<EventListener>();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  /**
   * 移除测试所需的 Worker 事件监听器。
   */
  removeEventListener(type: string, listener: EventListener): void {
    this.listeners.get(type)?.delete(listener);
  }

  /**
   * 记录主线程发给 Worker 的请求。
   */
  postMessage(message: WorkerRequest): void {
    this.messages.push(message);
  }

  /**
   * 向 Hook 模拟一条 Worker 响应。
   */
  emit(message: WorkerResponse): void {
    const event = new MessageEvent("message", { data: message });
    this.listeners.get("message")?.forEach((listener) => listener(event));
  }
}

describe("useWhisperWorker", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    FakeWorker.instances = [];
  });

  /**
   * 高速桌面设备必须先等待页面稳定，再在浏览器空闲时预热默认模型。
   */
  it("延迟十秒后才空闲预热默认模型", () => {
    vi.useFakeTimers();
    vi.stubGlobal("Worker", FakeWorker);
    vi.stubGlobal("requestIdleCallback", vi.fn((callback: IdleRequestCallback) => {
      callback({ didTimeout: false, timeRemaining: () => 50 });
      return 1;
    }));
    vi.stubGlobal("cancelIdleCallback", vi.fn());
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
    const { unmount } = renderHook(() => useWhisperWorker());
    const worker = FakeWorker.instances[0];

    act(() => worker.emit({ type: "booted" }));
    act(() => vi.advanceTimersByTime(9_999));
    expect(worker.messages).not.toContainEqual(expect.objectContaining({ type: "preload" }));

    act(() => vi.advanceTimersByTime(1));
    expect(worker.messages).toContainEqual({
      type: "preload",
      settings: { ...DEFAULT_SETTINGS },
    });
    unmount();
  });

  /**
   * 用户明确选择媒体时应立即准备当前设置，并取消后续默认模型自动预热。
   */
  it("用户意图触发时立即预热当前模型且不重复自动预热", () => {
    vi.useFakeTimers();
    vi.stubGlobal("Worker", FakeWorker);
    vi.stubGlobal("requestIdleCallback", vi.fn((callback: IdleRequestCallback) => {
      callback({ didTimeout: false, timeRemaining: () => 50 });
      return 1;
    }));
    vi.stubGlobal("cancelIdleCallback", vi.fn());
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
    const { result, unmount } = renderHook(() => useWhisperWorker());
    const worker = FakeWorker.instances[0];
    const selectedSettings = {
      ...DEFAULT_SETTINGS,
      model: "onnx-community/whisper-base" as const,
    };

    act(() => worker.emit({ type: "booted" }));
    act(() => result.current.prepareModel(selectedSettings));
    act(() => result.current.prepareModel({ ...selectedSettings, language: "es" }));
    expect(worker.messages).toEqual([{ type: "preload", settings: selectedSettings }]);

    act(() => vi.advanceTimersByTime(20_000));
    expect(worker.messages).toHaveLength(1);
    unmount();
  });

  /**
   * 3G 网络不得因为页面空闲而自动消耗模型下载流量。
   */
  it("3G 网络跳过自动后台预热", () => {
    vi.useFakeTimers();
    vi.stubGlobal("Worker", FakeWorker);
    vi.stubGlobal("navigator", {
      connection: { effectiveType: "3g", saveData: false },
    });
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
    const { unmount } = renderHook(() => useWhisperWorker());
    const worker = FakeWorker.instances[0];

    act(() => worker.emit({ type: "booted" }));
    act(() => vi.advanceTimersByTime(30_000));

    expect(worker.messages).not.toContainEqual(expect.objectContaining({ type: "preload" }));
    unmount();
  });

  /**
   * 暂停或停止必须终止当前推理，并准备一个可从头重跑的新 Worker。
   */
  it("取消转录时终止并重建 Worker", async () => {
    vi.stubGlobal("Worker", FakeWorker);
    const { result, unmount } = renderHook(() => useWhisperWorker());
    const firstWorker = FakeWorker.instances[0];

    act(() => firstWorker.emit({ type: "booted" }));

    let transcription: Promise<unknown>;
    act(() => {
      transcription = result.current.transcribe(new Float32Array(16_000), { ...DEFAULT_SETTINGS });
    });
    const rejection = expect(transcription!).rejects.toMatchObject({ name: "AbortError" });

    act(() => result.current.cancelTranscription("Transcription paused"));

    await rejection;
    expect(firstWorker.terminate).toHaveBeenCalledOnce();
    expect(FakeWorker.instances).toHaveLength(2);
    expect(FakeWorker.instances[1]).not.toBe(firstWorker);
    expect(result.current.transcriptionProgress).toEqual({ completedChunks: 0, totalChunks: 0 });
    unmount();
  });

  /**
   * 真实分块事件只允许进度前进，并在任务完成后清空当前锚点。
   */
  it("合并分块进度且忽略重复和乱序消息", async () => {
    vi.stubGlobal("Worker", FakeWorker);
    const { result, unmount } = renderHook(() => useWhisperWorker());
    const worker = FakeWorker.instances[0];

    act(() => worker.emit({ type: "booted" }));
    let transcription: Promise<unknown>;
    const onProgress = vi.fn();
    act(() => {
      transcription = result.current.transcribe(
        new Float32Array(16_000),
        { ...DEFAULT_SETTINGS },
        undefined,
        onProgress,
      );
    });
    act(() => worker.emit({ type: "transcription-started", backend: "wasm", totalChunks: 4 }));
    expect(result.current.transcriptionProgress).toEqual({ completedChunks: 0, totalChunks: 4 });

    act(() => worker.emit({ type: "transcription-progress", completedChunks: 2, totalChunks: 4 }));
    expect(result.current.transcriptionProgress).toEqual({ completedChunks: 2, totalChunks: 4 });
    expect(onProgress).toHaveBeenCalledWith({ completedChunks: 2, totalChunks: 4 });

    act(() => {
      worker.emit({ type: "transcription-progress", completedChunks: 2, totalChunks: 4 });
      worker.emit({ type: "transcription-progress", completedChunks: 1, totalChunks: 4 });
    });
    expect(result.current.transcriptionProgress).toEqual({ completedChunks: 2, totalChunks: 4 });

    act(() => worker.emit({
      type: "complete",
      text: "Done",
      chunks: [],
      backend: "wasm",
    }));
    await expect(transcription!).resolves.toMatchObject({ text: "Done" });
    expect(result.current.transcriptionProgress).toEqual({ completedChunks: 0, totalChunks: 0 });
    unmount();
  });
});
