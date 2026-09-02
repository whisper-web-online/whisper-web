"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { directionForLocale, UI_COPY, type UiCopy, type UiLocale } from "@/i18n/ui-copy";
import { LocalHistoryWorkspace } from "@/features/converter/local-history-workspace";
import {
  getPlausibleDurationBucket,
  getPlausibleModelName,
  PLAUSIBLE_EVENTS,
  trackPlausibleEvent,
} from "@/lib/analytics/plausible";
import type {
  InputSource,
  TranscriptRecord,
  TranscriptionRunState,
  TranscriptionSettings,
} from "../contracts";
import { decodeMedia, validateMediaFormat, validateMediaSize } from "../audio/decode-audio";
import { DEFAULT_SETTINGS } from "../model-options";
import { deleteTranscript, listTranscripts, saveTranscript } from "../storage/transcript-store";
import { useWhisperWorker } from "../hooks/use-whisper-worker";
import { AppHeader, type AppView } from "./app-header";
import { LandingSections } from "./landing-sections";
import { TranscriptionWorkspace } from "./transcription-workspace";
import { SiteFooter } from "./site-footer";

const TRANSCRIPTION_COMPLETE_HOLD_MS = 400;

/**
 * 保留短暂的百分百完成反馈，再进入本地历史结果页。
 */
export function waitForCompletionFeedback(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, TRANSCRIPTION_COMPLETE_HOLD_MS));
}

// 从实际单声道录音按时间窗口提取并归一化的峰值，用于生成真实的振幅包络。
const HERO_WAVEFORM_PEAKS = [
  1, 1, 1, 1, 11, 2, 7, 2, 13, 4, 19, 4, 3, 11, 3, 2,
  1, 19, 5, 13, 4, 2, 11, 3, 9, 3, 19, 3, 3, 2, 11, 8,
  3, 4, 2, 20, 3, 6, 3, 10, 4, 2, 1, 1, 18, 3, 8, 2,
  20, 4, 18, 5, 2, 11, 3, 2, 1, 19, 4, 8, 2, 2, 7, 3,
  19, 3, 19, 3, 2, 2, 10, 7, 3, 12, 2, 10, 3, 7, 3, 20,
  4, 3, 2, 1, 14, 3, 7, 2, 19, 4, 8, 5, 2, 13, 3, 2,
  1, 12, 4, 6, 12, 2, 19, 4, 19, 3, 8, 4, 2, 2, 19, 11,
  3, 3, 2, 7, 2, 7, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
] as const;

const HERO_WAVEFORM = (
  <svg
    className="hero-waveform"
    viewBox="0 0 762 44"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <line className="hero-waveform-baseline" x1="0" y1="22" x2="762" y2="22" />
    {HERO_WAVEFORM_PEAKS.map((peak, index) => (
      <line
        key={`${index}-${peak}`}
        x1={index * 6}
        y1={22 - peak}
        x2={index * 6}
        y2={22 + peak}
      />
    ))}
  </svg>
);

interface SonoraAppProps {
  initialLocale: UiLocale;
}

interface PendingMedia {
  blob: Blob;
  source: InputSource;
  title: string;
}

/**
 * 将已知媒体校验错误转换为当前界面的恢复提示，未知错误使用安全的通用文案。
 */
function localizeMediaError(reason: unknown, copy: UiCopy, fallback: string): string {
  const message = reason instanceof Error ? reason.message : "";
  if (message.startsWith("Unsupported media format.")) return copy.errors.unsupportedFormat;
  if (message === "This file is larger than the 300 MB local limit.") return copy.errors.fileTooLarge;
  if (message === "This media is longer than the 20 minute local limit.") return copy.errors.mediaTooLong;
  return fallback;
}

/**
 * 订阅浏览器地址片段变化，让指南页可以直达本地历史视图。
 */
function subscribeToLocationHash(onStoreChange: () => void): () => void {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

/**
 * 返回浏览器当前地址片段。
 */
function getLocationHash(): string {
  return window.location.hash;
}

/**
 * 返回服务端渲染使用的稳定空地址片段。
 */
function getServerLocationHash(): string {
  return "";
}

/**
 * 生成浏览器兼容的本地记录 ID。
 */
function createRecordId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `record-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * 组合 Whisper Web 的输入、Worker 推理、本地历史和结果编辑流程。
 */
export function SonoraApp({ initialLocale }: SonoraAppProps) {
  const locale = initialLocale;
  const [view, setView] = useState<AppView>("transcribe");
  const locationHash = useSyncExternalStore(
    subscribeToLocationHash,
    getLocationHash,
    getServerLocationHash,
  );
  const activeView: AppView = locationHash.startsWith("#history") ? "history" : view;
  const targetConversionId = locationHash.startsWith("#history/conversions/")
    ? decodeURIComponent(locationHash.slice("#history/conversions/".length))
    : undefined;
  const [settings, setSettings] = useState<TranscriptionSettings>({ ...DEFAULT_SETTINGS });
  const [records, setRecords] = useState<TranscriptRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeMediaUrl, setActiveMediaUrl] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingMedia, setPendingMedia] = useState<PendingMedia | null>(null);
  const [runState, setRunState] = useState<TranscriptionRunState>("idle");
  const mediaUrlRef = useRef("");
  const operationIdRef = useRef(0);
  const {
    cancelTranscription,
    prepareModel,
    transcribe,
    warmupBackend,
    warmupError,
    warmupProgress,
    warmupState,
    transcriptionProgress,
  } = useWhisperWorker();
  const copy = UI_COPY[locale];
  const direction = directionForLocale(locale);

  useEffect(() => {
    void listTranscripts().then((storedRecords) => {
      setRecords(storedRecords);
      setSelectedId(storedRecords[0]?.id ?? null);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    };
  }, []);

  /**
   * 替换当前媒体对象 URL，并释放上一段媒体的内存。
   */
  const replaceMediaUrl = useCallback((blob: Blob) => {
    if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    const url = URL.createObjectURL(blob);
    mediaUrlRef.current = url;
    setActiveMediaUrl(url);
  }, []);

  /**
   * 校验并暂存媒体，等待用户显式开始转录。
   */
  const stageMedia = useCallback((
    blob: Blob,
    title: string,
    source: InputSource,
  ): void => {
    setError("");
    try {
      if (source !== "url") validateMediaFormat(title);
      validateMediaSize(blob.size);
      prepareModel(settings);
      operationIdRef.current += 1;
      setPendingMedia({ blob, title, source });
      setRunState("idle");
      setNotice("");
      trackPlausibleEvent(PLAUSIBLE_EVENTS.standardMediaSelected, {
        workflow: "standard",
        locale,
        source,
      });
    } catch (reason) {
      setPendingMedia(null);
      setError(localizeMediaError(reason, copy, copy.errors.selectionFailed));
      trackPlausibleEvent(PLAUSIBLE_EVENTS.standardTranscriptionFailed, {
        workflow: "standard",
        locale,
        stage: "selection",
      });
    }
  }, [copy, locale, prepareModel, settings]);

  /**
   * 从头解码当前媒体、执行 Worker 推理并保存最终记录。
   */
  const processSelectedMedia = useCallback(async (): Promise<void> => {
    if (!pendingMedia) return;
    const operationId = operationIdRef.current + 1;
    operationIdRef.current = operationId;
    setError("");
    setNotice("");
    setRunState("decoding");
    trackPlausibleEvent(PLAUSIBLE_EVENTS.standardTranscriptionStarted, {
      workflow: "standard",
      locale,
      source: pendingMedia.source,
      model: getPlausibleModelName(settings.model),
      language: settings.language,
      task: settings.task,
      requested_backend: settings.backend,
      attempt: runState === "paused" ? "restart" : "initial",
    });
    try {
      const decoded = await decodeMedia(await pendingMedia.blob.arrayBuffer());
      if (operationIdRef.current !== operationId) return;
      setRunState("loading");
      const output = await transcribe(decoded.samples, settings, () => {
        if (operationIdRef.current === operationId) setRunState("transcribing");
      });
      if (operationIdRef.current !== operationId) return;
      setRunState("saving");
      const record: TranscriptRecord = {
        id: createRecordId(),
        title: pendingMedia.title,
        text: output.text,
        chunks: output.chunks,
        createdAt: Date.now(),
        durationSeconds: decoded.durationSeconds,
        source: pendingMedia.source,
        model: settings.model,
        language: settings.language,
        task: settings.task,
        backend: output.backend,
      };
      await saveTranscript(record);
      if (operationIdRef.current !== operationId) return;
      trackPlausibleEvent(PLAUSIBLE_EVENTS.standardTranscriptionCompleted, {
        workflow: "standard",
        locale,
        source: record.source,
        model: getPlausibleModelName(record.model),
        language: record.language,
        task: record.task,
        backend: record.backend,
        duration: getPlausibleDurationBucket(record.durationSeconds),
      });
      setRunState("complete");
      await waitForCompletionFeedback();
      if (operationIdRef.current !== operationId) return;
      replaceMediaUrl(pendingMedia.blob);
      setRecords((current) => [record, ...current]);
      setSelectedId(record.id);
      setPendingMedia(null);
      setRunState("idle");
      setView("history");
    } catch (reason) {
      if (operationIdRef.current !== operationId || (reason instanceof DOMException && reason.name === "AbortError")) {
        return;
      }
      setRunState("idle");
      setError(localizeMediaError(reason, copy, copy.errors.transcriptionFailed));
      trackPlausibleEvent(PLAUSIBLE_EVENTS.standardTranscriptionFailed, {
        workflow: "standard",
        locale,
        stage: "processing",
      });
    }
  }, [copy, locale, pendingMedia, replaceMediaUrl, runState, settings, transcribe]);

  /**
   * 将用户选中的文件交给统一媒体处理链路。
   */
  const handleMediaSelected = useCallback(async (
    file: File,
    source: "file" | "recording",
  ): Promise<void> => {
    stageMedia(file, file.name, source);
  }, [stageMedia]);

  /**
   * 拉取允许跨域访问的直链媒体，再交给本地转写链路。
   */
  const handleUrlSelected = useCallback(async (url: string): Promise<void> => {
    setError("");
    prepareModel(settings);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError(copy.errors.urlHttp.replace("{status}", String(response.status)));
        trackPlausibleEvent(PLAUSIBLE_EVENTS.standardTranscriptionFailed, {
          workflow: "standard",
          locale,
          stage: "url_import",
        });
        return;
      }
      const blob = await response.blob();
      const pathName = new URL(url).pathname;
      stageMedia(blob, pathName.split("/").pop() || "remote-media", "url");
    } catch (reason) {
      console.warn("[Whisper Web] Direct media URL could not be read:", reason);
      setError(copy.errors.urlFailed);
      trackPlausibleEvent(PLAUSIBLE_EVENTS.standardTranscriptionFailed, {
        workflow: "standard",
        locale,
        stage: "url_import",
      });
    }
  }, [copy.errors, locale, prepareModel, settings, stageMedia]);

  /**
   * 更新转录设置，并在已经选择媒体时立即预热对应模型与计算后端。
   */
  const handleSettingsChange = useCallback((nextSettings: TranscriptionSettings): void => {
    setSettings(nextSettings);
    if (pendingMedia) prepareModel(nextSettings);
  }, [pendingMedia, prepareModel]);

  /**
   * 使用当前转录设置重试模型预热。
   */
  const retrySelectedModelWarmup = useCallback((): void => {
    prepareModel(settings);
  }, [prepareModel, settings]);

  /**
   * 暂停当前任务；继续时按已确认语义从头重新转录。
   */
  const handlePause = useCallback((): void => {
    operationIdRef.current += 1;
    cancelTranscription("Transcription paused");
    setRunState("paused");
    setNotice(copy.input.pausedHint);
  }, [cancelTranscription, copy.input.pausedHint]);

  /**
   * 停止当前任务并保留已选媒体，允许用户稍后重新开始。
   */
  const handleStop = useCallback((): void => {
    operationIdRef.current += 1;
    cancelTranscription("Transcription stopped");
    setRunState("idle");
    setNotice(copy.input.stoppedHint);
  }, [cancelTranscription, copy.input.stoppedHint]);

  /**
   * 更新已编辑记录并同步浏览器本地数据库。
   */
  const handleUpdate = useCallback(async (record: TranscriptRecord): Promise<void> => {
    setRecords((current) => current.map((item) => item.id === record.id ? record : item));
    await saveTranscript(record);
  }, []);

  /**
   * 删除本地记录并选择剩余列表中的下一条。
   */
  const handleDelete = useCallback(async (id: string): Promise<void> => {
    await deleteTranscript(id);
    setRecords((current) => {
      const next = current.filter((item) => item.id !== id);
      setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }, []);

  const selectedMediaUrl = useMemo(() => {
    return selectedId === records[0]?.id ? activeMediaUrl : "";
  }, [activeMediaUrl, records, selectedId]);

  return (
    <div className="sonora-app" dir={direction}>
      <AppHeader
        copy={copy}
        locale={locale}
        view={activeView}
        onViewChange={setView}
      />

      {activeView === "history" ? (
        <LocalHistoryWorkspace
          copy={copy}
          locale={locale}
          records={records}
          selectedId={selectedId}
          activeMediaUrl={selectedMediaUrl}
          targetConversionId={targetConversionId}
          onSelect={setSelectedId}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ) : (
        <main>
          <section className="hero-section">
            <div className="hero-copy">
              <h1>{copy.hero.title}</h1>
              <p>{copy.hero.description}</p>
              <strong>
                {copy.hero.localNote}
                {HERO_WAVEFORM}
              </strong>
            </div>
            <TranscriptionWorkspace
              copy={copy}
              locale={locale}
              settings={settings}
              runState={runState}
              transcriptionProgress={transcriptionProgress}
              selectedMediaName={pendingMedia?.title ?? ""}
              notice={notice}
              warmupBackend={warmupBackend}
              warmupError={warmupError}
              warmupProgress={warmupProgress}
              warmupState={warmupState}
              onRetryWarmup={retrySelectedModelWarmup}
              error={error}
              onStart={() => void processSelectedMedia()}
              onPause={handlePause}
              onStop={handleStop}
              onSettingsChange={handleSettingsChange}
              onMediaSelected={handleMediaSelected}
              onUrlSelected={handleUrlSelected}
            />
          </section>
          <LandingSections copy={copy} locale={locale} />
        </main>
      )}

      <SiteFooter copy={copy} locale={locale} />
    </div>
  );
}
