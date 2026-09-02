import { CheckCircle, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import type { UiCopy } from "@/i18n/ui-copy";
import type {
  ModelWarmupState,
  TranscriptionProgressPoint,
  TranscriptionRunState,
} from "../contracts";

const PROGRESS_TICK_MS = 500;
const WAITING_HINT_INTERVAL_MS = 6_000;

interface ModelProgressProps {
  copy: UiCopy["input"]["progress"];
  downloadProgress: number;
  state: Exclude<TranscriptionRunState, "idle">;
  transcriptionProgress: TranscriptionProgressPoint;
}

interface ModelWarmupStatusProps {
  backend: "webgpu" | "wasm" | null;
  copy: UiCopy["input"]["warmup"];
  error: string;
  onRetry: () => void;
  progress: number;
  state: ModelWarmupState;
}

interface ProgressBounds {
  cap: number;
  floor: number;
}

/**
 * 将下载和推理的真实进度锚点映射到全过程的阶段区间。
 */
function calculateProgressBounds(
  state: Exclude<TranscriptionRunState, "idle">,
  downloadProgress: number,
  transcriptionProgress: TranscriptionProgressPoint,
): ProgressBounds {
  if (state === "paused") return { floor: 0, cap: 0 };
  if (state === "complete") return { floor: 100, cap: 100 };
  if (state === "decoding") return { floor: 1, cap: 9 };
  if (state === "saving") return { floor: 96, cap: 99 };

  if (state === "loading") {
    const normalizedDownload = Math.max(0, Math.min(100, downloadProgress));
    const floor = 10 + normalizedDownload * 0.25;
    return { floor, cap: Math.min(35, floor + 3) };
  }

  const totalChunks = Math.max(1, transcriptionProgress.totalChunks);
  const completedChunks = Math.min(
    totalChunks,
    Math.max(0, transcriptionProgress.completedChunks),
  );
  const floor = 35 + (completedChunks / totalChunks) * 60;
  if (completedChunks >= totalChunks) return { floor: 95, cap: 95 };

  const nextCheckpoint = 35 + ((completedChunks + 1) / totalChunks) * 60;
  return {
    floor,
    cap: Math.min(94, floor + (nextCheckpoint - floor) * 0.8),
  };
}

/**
 * 在真实进度锚点之间缓慢推进显示值，并保证除暂停外永不倒退。
 */
function useDisplayedProgress(
  state: Exclude<TranscriptionRunState, "idle">,
  downloadProgress: number,
  transcriptionProgress: TranscriptionProgressPoint,
): number {
  const { cap, floor } = calculateProgressBounds(state, downloadProgress, transcriptionProgress);
  const [displayedProgress, setDisplayedProgress] = useState(floor);

  useEffect(() => {
    if (state === "paused" || state === "complete") return;

    const intervalId = window.setInterval(() => {
      setDisplayedProgress((current) => {
        const currentFloor = Math.max(current, floor);
        if (currentFloor >= cap) return currentFloor;
        const increment = Math.max(0.15, (cap - currentFloor) * 0.08);
        return Math.min(cap, currentFloor + increment);
      });
    }, PROGRESS_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [cap, floor, state]);

  if (state === "paused" || state === "complete") return floor;
  return Math.max(displayedProgress, floor);
}

/**
 * 在当前阶段说明和等待提示之间循环，暂停或完成时保持固定说明。
 */
function useRotatingHint(
  phaseHint: string,
  waitingHints: UiCopy["input"]["progress"]["waitingHints"],
  shouldRotate: boolean,
): string {
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    if (!shouldRotate) return;
    const intervalId = window.setInterval(() => {
      setHintIndex((current) => (current + 1) % (waitingHints.length + 1));
    }, WAITING_HINT_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [shouldRotate, waitingHints.length]);

  if (!shouldRotate || hintIndex === 0) return phaseHint;
  return waitingHints[hintIndex - 1] ?? phaseHint;
}

/**
 * 用低干扰状态提示后台模型预热，不阻塞用户浏览或选择文件。
 */
export function ModelWarmupStatus({ backend, copy, error, onRetry, progress, state }: ModelWarmupStatusProps) {
  if (state === "idle" || state === "skipped") return null;

  const isReady = state === "ready";
  const label = isReady
    ? `${copy.ready}${backend ? ` · ${backend.toUpperCase()}` : ""}`
    : state === "error"
      ? copy.deferred
      : copy.preparing;

  return (
    <div className={`warmup-status is-${state}`} role="status" aria-live="polite">
      {isReady ? (
        <CheckCircle aria-hidden="true" weight="fill" />
      ) : (
        <CircleNotch className={state === "loading" ? "spin" : ""} aria-hidden="true" />
      )}
      <span>{label}</span>
      {state === "loading" ? <b>{Math.max(1, Math.min(99, progress))}%</b> : null}
      {state === "error" ? (
        <button type="button" onClick={onRetry} title={error || undefined}>{copy.retry}</button>
      ) : null}
    </div>
  );
}

/**
 * 展示模型下载和本地推理阶段，避免用户将首次下载误认为卡死。
 */
export function ModelProgress({ copy, downloadProgress, state, transcriptionProgress }: ModelProgressProps) {
  const activeStep = state === "decoding" ? 0 : state === "loading" ? 1 : state === "saving" || state === "complete" ? 3 : 2;
  const isPaused = state === "paused";
  const isComplete = state === "complete";
  const label = copy[state];
  const phaseHint = copy[`${state}Hint`];
  const hint = useRotatingHint(phaseHint, copy.waitingHints, !isPaused && !isComplete);
  const displayedProgress = useDisplayedProgress(state, downloadProgress, transcriptionProgress);
  const roundedProgress = isComplete ? 100 : Math.min(99, Math.floor(displayedProgress));

  return (
    <div className={isPaused ? "model-progress is-paused" : "model-progress"}>
      <div className="progress-heading">
        {isComplete ? (
          <CheckCircle aria-hidden="true" weight="fill" />
        ) : isPaused ? (
          <CircleNotch aria-hidden="true" />
        ) : (
          <CircleNotch className="spin" aria-hidden="true" />
        )}
        <div>
          <strong role="status" aria-live="polite">{label}</strong>
          <span className="progress-hint" key={hint} aria-live="off">{hint}</span>
        </div>
        <b aria-hidden="true">{roundedProgress}%</b>
      </div>
      <ol className="progress-steps" aria-label={label}>
        {copy.steps.map((step, index) => (
          <li className={isComplete || index < activeStep ? "is-complete" : index === activeStep ? "is-active" : ""} key={step}>
            <span>{index + 1}</span>{step}
          </li>
        ))}
      </ol>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={roundedProgress}
      >
        <span aria-hidden="true" style={{ width: `${displayedProgress}%` }} />
      </div>
    </div>
  );
}
