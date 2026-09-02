"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ModelWarmupState,
  ProgressItem,
  TranscriptChunk,
  TranscriptionProgressPoint,
  TranscriptionSettings,
  WorkerRequest,
  WorkerResponse,
} from "../contracts";
import { DEFAULT_SETTINGS } from "../model-options";

const EMPTY_TRANSCRIPTION_PROGRESS: TranscriptionProgressPoint = {
  completedChunks: 0,
  totalChunks: 0,
};

const BACKGROUND_WARMUP_DELAY_MS = 10_000;
const BACKGROUND_WARMUP_IDLE_TIMEOUT_MS = 5_000;
const BACKGROUND_WARMUP_FALLBACK_MS = 2_000;

export interface TranscriptionOutput {
  text: string;
  chunks: TranscriptChunk[];
  backend: "webgpu" | "wasm";
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
  deviceMemory?: number;
}

/**
 * 在浏览器空闲时安排一次任务，并为不支持空闲回调的浏览器提供延迟回退。
 */
function scheduleIdleTask(task: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const requestId = window.requestIdleCallback(task, { timeout: BACKGROUND_WARMUP_IDLE_TIMEOUT_MS });
    return () => window.cancelIdleCallback(requestId);
  }

  const timeoutId = setTimeout(task, BACKGROUND_WARMUP_FALLBACK_MS);
  return () => clearTimeout(timeoutId);
}

/**
 * 仅允许前台、高速、非触控且内存充足的设备执行自动后台预热。
 */
function shouldSkipBackgroundWarmup(): boolean {
  const connection = (navigator as NavigatorWithConnection).connection;
  const deviceMemory = (navigator as NavigatorWithConnection).deviceMemory;
  const isCoarsePointer = typeof window.matchMedia === "function"
    && window.matchMedia("(pointer: coarse)").matches;
  return Boolean(
    document.visibilityState !== "visible" ||
    connection?.saveData ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g" ||
    isCoarsePointer ||
    (typeof deviceMemory === "number" && deviceMemory < 4),
  );
}

/**
 * 生成模型与计算后端共同组成的预热请求键，忽略不影响模型文件的语言和输出设置。
 */
function createPreparationKey(settings: TranscriptionSettings): string {
  return `${settings.model}:${settings.backend}`;
}

/**
 * 汇总 Transformers.js 多个模型文件的平均下载进度。
 */
function calculateProgress(items: ProgressItem[]): number {
  if (items.length === 0) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.progress, 0) / items.length);
}

/**
 * 管理 Whisper Worker 的生命周期、进度状态和单次转写 Promise。
 */
export function useWhisperWorker() {
  const workerRef = useRef<Worker | null>(null);
  const resolveRef = useRef<((output: TranscriptionOutput) => void) | null>(null);
  const rejectRef = useRef<((error: Error) => void) | null>(null);
  const startedRef = useRef<(() => void) | null>(null);
  const progressCallbackRef = useRef<((progress: TranscriptionProgressPoint) => void) | null>(null);
  const restartWorkerRef = useRef<(() => void) | null>(null);
  const skipNextWarmupRef = useRef(false);
  const hasPreparationStartedRef = useRef(false);
  const preparationKeyRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchdogCallbackRef = useRef<(() => void) | null>(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [warmupState, setWarmupState] = useState<ModelWarmupState>("idle");
  const [warmupBackend, setWarmupBackend] = useState<"webgpu" | "wasm" | null>(null);
  const [warmupError, setWarmupError] = useState("");
  const [phase, setPhase] = useState("Ready for local transcription");
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [transcriptionProgress, setTranscriptionProgress] = useState<TranscriptionProgressPoint>(
    EMPTY_TRANSCRIPTION_PROGRESS,
  );

  /**
   * 重新启动十分钟无进度看门狗；正常的模型下载或转写进度都会延长等待窗口。
   */
  const resetNoProgressWatchdog = useCallback((): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = watchdogCallbackRef.current
      ? setTimeout(watchdogCallbackRef.current, 10 * 60 * 1000)
      : null;
  }, []);

  useEffect(() => {
    /**
     * 将 Worker 消息同步到 React 状态，并完成当前转写 Promise。
     */
    const handleMessage = (event: MessageEvent<WorkerResponse>): void => {
      const message = event.data;
      if (rejectRef.current && message.type !== "booted") resetNoProgressWatchdog();
      if (message.type === "booted") {
        setIsWorkerReady(true);
        return;
      }
      if (message.type === "progress") {
        setWarmupState("loading");
        setWarmupError("");
        if (rejectRef.current) {
          setPhase(message.item.status === "progress" ? "Preparing local engine" : "Starting local engine");
        }
        setProgressItems((current) => {
          const next = current.filter((item) => item.file !== message.item.file);
          return [...next, message.item];
        });
        return;
      }
      if (message.type === "model-ready") {
        setWarmupState("ready");
        setWarmupBackend(message.backend);
        setWarmupError("");
        return;
      }
      if (message.type === "transcription-started") {
        setWarmupState("ready");
        setWarmupBackend(message.backend);
        setTranscriptionProgress({ completedChunks: 0, totalChunks: message.totalChunks });
        setPhase(`Transcribing locally with ${message.backend.toUpperCase()}`);
        startedRef.current?.();
        return;
      }
      if (message.type === "transcription-progress") {
        const totalChunks = Math.max(1, Math.floor(message.totalChunks));
        const completedChunks = Math.min(
          totalChunks,
          Math.max(0, Math.floor(message.completedChunks)),
        );
        progressCallbackRef.current?.({ completedChunks, totalChunks });
        setTranscriptionProgress((current) => {
          const currentRatio = current.totalChunks > 0
            ? current.completedChunks / current.totalChunks
            : 0;
          const nextRatio = completedChunks / totalChunks;
          if (nextRatio <= currentRatio) return current;
          return { completedChunks, totalChunks };
        });
        return;
      }
      if (message.type === "error") {
        if (message.operation === "preload") {
          preparationKeyRef.current = "";
          setWarmupState("error");
          setWarmupError(message.message);
          console.warn("[Whisper Web] Background model warmup failed:", message.message);
          return;
        }
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsBusy(false);
        setTranscriptionProgress(EMPTY_TRANSCRIPTION_PROGRESS);
        setPhase("Transcription failed");
        rejectRef.current?.(new Error(message.message));
        resolveRef.current = null;
        rejectRef.current = null;
        startedRef.current = null;
        progressCallbackRef.current = null;
        watchdogCallbackRef.current = null;
        return;
      }
      if (message.type === "complete") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsBusy(false);
        setTranscriptionProgress(EMPTY_TRANSCRIPTION_PROGRESS);
        setPhase("Transcription complete");
        resolveRef.current?.({
          text: message.text,
          chunks: message.chunks,
          backend: message.backend,
        });
        resolveRef.current = null;
        rejectRef.current = null;
        startedRef.current = null;
        progressCallbackRef.current = null;
        watchdogCallbackRef.current = null;
      }
    };

    /**
     * 将 Worker 的脚本加载和运行时错误转成用户可见的转写失败。
     */
    const handleWorkerError = (event: ErrorEvent): void => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const error = new Error(event.message || "The local Whisper worker could not start.");
      setIsBusy(false);
      setWarmupState("error");
      preparationKeyRef.current = "";
      setWarmupError(error.message);
      setTranscriptionProgress(EMPTY_TRANSCRIPTION_PROGRESS);
      setPhase("Transcription failed");
      rejectRef.current?.(error);
      resolveRef.current = null;
      rejectRef.current = null;
      startedRef.current = null;
      progressCallbackRef.current = null;
      watchdogCallbackRef.current = null;
    };

    /**
     * 创建并绑定一个新的 Whisper Worker。
     */
    const createWorker = (): Worker => {
      const worker = new Worker(new URL("../../../workers/whisper.worker.ts", import.meta.url), {
        type: "module",
      });
      worker.addEventListener("message", handleMessage);
      worker.addEventListener("error", handleWorkerError);
      workerRef.current = worker;
      return worker;
    };

    /**
     * 解除监听并立即终止指定 Worker。
     */
    const terminateWorker = (worker: Worker): void => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleWorkerError);
      worker.terminate();
    };

    const worker = createWorker();
    restartWorkerRef.current = () => {
      if (workerRef.current) terminateWorker(workerRef.current);
      preparationKeyRef.current = "";
      setIsWorkerReady(false);
      setWarmupState("idle");
      setWarmupBackend(null);
      setWarmupError("");
      setProgressItems([]);
      setTranscriptionProgress(EMPTY_TRANSCRIPTION_PROGRESS);
      createWorker();
    };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      restartWorkerRef.current = null;
      if (workerRef.current) {
        workerRef.current.postMessage({ type: "dispose" } satisfies WorkerRequest);
        terminateWorker(workerRef.current);
      } else {
        terminateWorker(worker);
      }
      workerRef.current = null;
    };
  }, [resetNoProgressWatchdog]);

  /**
   * 根据当前用户设置请求 Worker 预先缓存模型；用户意图触发时立即执行。
   */
  const prepareModel = useCallback((settings: TranscriptionSettings = DEFAULT_SETTINGS): void => {
    if (!workerRef.current) return;
    const preparationKey = createPreparationKey(settings);
    if (preparationKeyRef.current === preparationKey) return;
    preparationKeyRef.current = preparationKey;
    hasPreparationStartedRef.current = true;
    setWarmupState("loading");
    setWarmupError("");
    workerRef.current.postMessage({
      type: "preload",
      settings: { ...settings },
    } satisfies WorkerRequest);
  }, []);

  useEffect(() => {
    if (!isWorkerReady) return;
    if (skipNextWarmupRef.current) {
      skipNextWarmupRef.current = false;
      return;
    }
    if (shouldSkipBackgroundWarmup()) return;

    let cancelIdleTask: (() => void) | undefined;
    const delayId = setTimeout(() => {
      if (hasPreparationStartedRef.current || shouldSkipBackgroundWarmup()) return;
      cancelIdleTask = scheduleIdleTask(() => {
        if (!hasPreparationStartedRef.current && !shouldSkipBackgroundWarmup()) {
          prepareModel(DEFAULT_SETTINGS);
        }
      });
    }, BACKGROUND_WARMUP_DELAY_MS);

    return () => {
      clearTimeout(delayId);
      cancelIdleTask?.();
    };
  }, [isWorkerReady, prepareModel]);

  /**
   * 将 PCM 发送给 Worker，并等待唯一的最终转写结果。
   */
  const transcribe = useCallback(
    (
      samples: Float32Array,
      settings: TranscriptionSettings,
      onStarted?: () => void,
      onProgress?: (progress: TranscriptionProgressPoint) => void,
    ): Promise<TranscriptionOutput> => {
      if (!workerRef.current) {
        return Promise.reject(new Error("The local Whisper worker is not ready yet."));
      }
      if (isBusy) {
        return Promise.reject(new Error("Another transcription is already running."));
      }

      setIsBusy(true);
      setTranscriptionProgress(EMPTY_TRANSCRIPTION_PROGRESS);
      setPhase(warmupState === "ready" ? "Starting local transcription" : "Preparing local engine");
      if (warmupState !== "loading") setProgressItems([]);

      return new Promise((resolve, reject) => {
        resolveRef.current = resolve;
        rejectRef.current = reject;
        startedRef.current = onStarted ?? null;
        progressCallbackRef.current = onProgress ?? null;
        watchdogCallbackRef.current = () => {
          setIsBusy(false);
          setTranscriptionProgress(EMPTY_TRANSCRIPTION_PROGRESS);
          setPhase("Transcription failed");
          reject(new Error("The local model made no progress for 10 minutes. Reload and try the WASM backend."));
          resolveRef.current = null;
          rejectRef.current = null;
          startedRef.current = null;
          progressCallbackRef.current = null;
          watchdogCallbackRef.current = null;
          skipNextWarmupRef.current = true;
          restartWorkerRef.current?.();
        };
        resetNoProgressWatchdog();
        const request: WorkerRequest = { type: "transcribe", audio: samples, settings };
        workerRef.current?.postMessage(request, [samples.buffer]);
      });
    },
    [isBusy, resetNoProgressWatchdog, warmupState],
  );

  /**
   * 立即终止当前转写并创建干净 Worker；再次开始时会从头执行。
   */
  const cancelTranscription = useCallback((nextPhase: string): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const reject = rejectRef.current;
    resolveRef.current = null;
    rejectRef.current = null;
    startedRef.current = null;
    progressCallbackRef.current = null;
    watchdogCallbackRef.current = null;
    setIsBusy(false);
    setTranscriptionProgress(EMPTY_TRANSCRIPTION_PROGRESS);
    setPhase(nextPhase);
    skipNextWarmupRef.current = true;
    restartWorkerRef.current?.();
    reject?.(new DOMException(nextPhase, "AbortError"));
  }, []);

  return {
    cancelTranscription,
    isBusy,
    isWorkerReady,
    phase,
    progressItems,
    prepareModel,
    transcriptionProgress,
    transcribe,
    warmupBackend,
    warmupError,
    warmupProgress: calculateProgress(progressItems),
    warmupState,
  };
}
