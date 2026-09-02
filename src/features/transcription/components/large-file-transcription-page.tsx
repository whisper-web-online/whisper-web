"use client";

import {
  CheckCircle,
  FileAudio,
  Flame,
  Pause,
  StopCircle,
  Waveform,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { LARGE_FILE_COPY } from "@/i18n/large-file-copy";
import { directionForLocale, UI_COPY, type UiLocale } from "@/i18n/ui-copy";
import {
  getPlausibleDurationBucket,
  getPlausibleModelName,
  PLAUSIBLE_EVENTS,
  trackPlausibleEvent,
} from "@/lib/analytics/plausible";
import { LOCALE_PATHS } from "@/lib/seo/site";
import type { TranscriptChunk, TranscriptRecord, TranscriptionSettings } from "../contracts";
import {
  createLargeMediaSegments,
  estimateRemainingTime,
  mergeLargeMediaSegment,
  openLargeMediaDecoder,
  type LargeMediaDecoder,
  type WaitEstimate,
} from "../audio/large-media";
import {
  ADDITIONAL_LANGUAGE_OPTIONS,
  DEFAULT_SETTINGS,
  MODEL_OPTIONS,
  POPULAR_LANGUAGE_OPTIONS,
  SUPPORTED_MEDIA_ACCEPT,
} from "../model-options";
import { saveTranscript } from "../storage/transcript-store";
import { useWhisperWorker } from "../hooks/use-whisper-worker";
import { LocalToolHeader } from "./local-tool-header";
import { SiteFooter } from "./site-footer";

type LargeRunState =
  | "idle"
  | "analyzing"
  | "decoding"
  | "loading"
  | "transcribing"
  | "pausing"
  | "paused"
  | "saving"
  | "complete";

interface SelectedLargeFile {
  file: File;
  durationSeconds: number;
}

interface LargeSession {
  decoder: LargeMediaDecoder;
  file: File;
  chunks: TranscriptChunk[];
  nextSegmentIndex: number;
  activeProcessingSeconds: number;
  backend: "webgpu" | "wasm" | null;
}

interface LargeFileTranscriptionPageProps {
  locale: UiLocale;
}

const subscribeToHydration = () => () => undefined;
const getHydratedSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

/**
 * 生成可供 IndexedDB 使用的本地记录 ID。
 */
function createRecordId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `record-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * 将大文件解码与校验错误映射为当前语言的可恢复提示。
 */
function localizeLargeFileError(reason: unknown, locale: UiLocale): string {
  const copy = LARGE_FILE_COPY[locale];
  const message = reason instanceof Error ? reason.message : "";
  if (message.startsWith("Unsupported media format.")) return copy.errors.unsupportedFormat;
  if (message === "LARGE_FILE_TOO_LARGE") return copy.errors.fileTooLarge;
  if (message === "LARGE_MEDIA_TOO_LONG") return copy.errors.mediaTooLong;
  if (message === "LARGE_FORMAT_UNREADABLE") return copy.errors.unreadable;
  if (message === "LARGE_NO_AUDIO_TRACK") return copy.errors.noAudio;
  if (message === "LARGE_CODEC_UNSUPPORTED") return copy.errors.codec;
  if (message === "LARGE_DURATION_UNAVAILABLE") return copy.errors.duration;
  if (message === "LARGE_SEGMENT_EMPTY") return copy.errors.emptySegment;
  return copy.errors.generic;
}

/**
 * 按当前语言显示文件大小。
 */
function formatFileSize(bytes: number, locale: UiLocale): string {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: bytes >= 1024 ** 3 ? "gigabyte" : "megabyte",
    unitDisplay: "short",
    maximumFractionDigits: 1,
  }).format(bytes / (bytes >= 1024 ** 3 ? 1024 ** 3 : 1024 ** 2));
}

/**
 * 按当前语言显示媒体或等待时长。
 */
function formatDuration(seconds: number, locale: UiLocale): string {
  const totalMinutes = Math.max(1, Math.ceil(seconds / 60));
  if (totalMinutes < 60) {
    return new Intl.NumberFormat(locale, { style: "unit", unit: "minute", unitDisplay: "short" })
      .format(totalMinutes);
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourText = new Intl.NumberFormat(locale, { style: "unit", unit: "hour", unitDisplay: "short" })
    .format(hours);
  return minutes === 0
    ? hourText
    : `${hourText} ${new Intl.NumberFormat(locale, { style: "unit", unit: "minute", unitDisplay: "short" }).format(minutes)}`;
}

/**
 * 显示已选媒体的实际时长，短于一分钟时保留秒级信息。
 */
function formatMediaDuration(seconds: number, locale: UiLocale): string {
  if (seconds < 60) {
    return new Intl.NumberFormat(locale, { style: "unit", unit: "second", unitDisplay: "short" })
      .format(Math.max(1, Math.round(seconds)));
  }
  return formatDuration(seconds, locale);
}

/**
 * 返回水合后可用的本地化语言名称格式器。
 */
function useLanguageNames(locale: UiLocale): Intl.DisplayNames | null {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
  return useMemo(
    () => hydrated ? new Intl.DisplayNames([locale], { type: "language" }) : null,
    [hydrated, locale],
  );
}

/**
 * 渲染大文件的本地分段转录流程，并把完成结果写入现有本地历史。
 */
export function LargeFileTranscriptionPage({ locale }: LargeFileTranscriptionPageProps) {
  const copy = LARGE_FILE_COPY[locale];
  const uiCopy = UI_COPY[locale];
  const direction = directionForLocale(locale);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectionIdRef = useRef(0);
  const runIdRef = useRef(0);
  const pauseRequestedRef = useRef(false);
  const sessionRef = useRef<LargeSession | null>(null);
  const [selected, setSelected] = useState<SelectedLargeFile | null>(null);
  const [settings, setSettings] = useState<TranscriptionSettings>(() => ({
    ...DEFAULT_SETTINGS,
    language: locale,
  }));
  const [runState, setRunState] = useState<LargeRunState>("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [segmentLabel, setSegmentLabel] = useState("");
  const [estimate, setEstimate] = useState<WaitEstimate | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasProcessedSegments, setHasProcessedSegments] = useState(false);
  const languageNames = useLanguageNames(locale);
  const {
    cancelTranscription,
    prepareModel,
    transcribe,
    warmupProgress,
    warmupState,
  } = useWhisperWorker();

  useEffect(() => {
    return () => sessionRef.current?.decoder.dispose();
  }, []);

  const historyHref = `${LOCALE_PATHS[locale]}#history`;
  const isRunning = ["decoding", "loading", "transcribing", "pausing", "saving"].includes(runState);
  const settingsLocked = isRunning || hasProcessedSegments;

  /**
   * 校验新文件、读取主音轨和时长，并创建仅驻留当前标签页的解码会话。
   */
  const selectFile = useCallback(async (file: File): Promise<void> => {
    const selectionId = selectionIdRef.current + 1;
    selectionIdRef.current = selectionId;
    runIdRef.current += 1;
    pauseRequestedRef.current = false;
    setRunState("analyzing");
    setError("");
    setProgress(0);
    setEstimate(null);
    setSegmentLabel("");
    setHasProcessedSegments(false);

    try {
      const decoder = await openLargeMediaDecoder(file);
      if (selectionIdRef.current !== selectionId) {
        decoder.dispose();
        return;
      }
      sessionRef.current?.decoder.dispose();
      sessionRef.current = {
        decoder,
        file,
        chunks: [],
        nextSegmentIndex: 0,
        activeProcessingSeconds: 0,
        backend: null,
      };
      prepareModel(settings);
      setSelected({ file, durationSeconds: decoder.durationSeconds });
      setRunState("idle");
      trackPlausibleEvent(PLAUSIBLE_EVENTS.largeFileMediaSelected, {
        workflow: "large_file",
        locale,
        source: "file",
        duration: getPlausibleDurationBucket(decoder.durationSeconds),
      });
    } catch (reason) {
      if (selectionIdRef.current !== selectionId) return;
      sessionRef.current = null;
      setSelected(null);
      setRunState("idle");
      setError(localizeLargeFileError(reason, locale));
      trackPlausibleEvent(PLAUSIBLE_EVENTS.largeFileTranscriptionFailed, {
        workflow: "large_file",
        locale,
        stage: "selection",
      });
    }
  }, [locale, prepareModel, settings]);

  /**
   * 更新大文件转录设置，并预热对应模型与计算后端。
   */
  const updateSettings = useCallback((nextSettings: TranscriptionSettings): void => {
    setSettings(nextSettings);
    prepareModel(nextSettings);
  }, [prepareModel]);

  /**
   * 从会话中的下一主体片段继续处理，暂停只在当前片段完成后生效。
   */
  const processFile = useCallback(async (): Promise<void> => {
    const session = sessionRef.current;
    if (!session || !selected) return;
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    pauseRequestedRef.current = false;
    setError("");
    trackPlausibleEvent(PLAUSIBLE_EVENTS.largeFileTranscriptionStarted, {
      workflow: "large_file",
      locale,
      source: "file",
      model: getPlausibleModelName(settings.model),
      language: settings.language,
      task: settings.task,
      requested_backend: settings.backend,
      duration: getPlausibleDurationBucket(selected.durationSeconds),
      attempt: session.nextSegmentIndex > 0 ? "resume" : "initial",
    });

    try {
      const plannedSegments = createLargeMediaSegments(selected.durationSeconds);
      for (let index = session.nextSegmentIndex; index < plannedSegments.length; index += 1) {
        if (runIdRef.current !== runId) return;
        const segment = plannedSegments[index];
        const coreDuration = segment.coreEnd - segment.coreStart;
        setSegmentLabel(copy.progress.segment
          .replace("{current}", String(index + 1))
          .replace("{total}", String(plannedSegments.length)));
        setRunState("decoding");
        const decodeStartedAt = performance.now();
        const samples = await session.decoder.decodeSegment(segment);
        const decodeSeconds = (performance.now() - decodeStartedAt) / 1000;
        if (runIdRef.current !== runId) return;

        let transcriptionStartedAt = 0;
        setRunState("loading");
        const output = await transcribe(
          samples,
          settings,
          () => {
            transcriptionStartedAt = performance.now();
            setRunState(pauseRequestedRef.current ? "pausing" : "transcribing");
          },
          ({ completedChunks, totalChunks }) => {
            if (runIdRef.current !== runId || transcriptionStartedAt === 0) return;
            const fraction = Math.min(1, completedChunks / Math.max(1, totalChunks));
            const processedSeconds = Math.min(
              selected.durationSeconds,
              segment.coreStart + coreDuration * fraction,
            );
            const activeSeconds = session.activeProcessingSeconds
              + decodeSeconds
              + (performance.now() - transcriptionStartedAt) / 1000;
            setProgress(processedSeconds / selected.durationSeconds);
            setEstimate(estimateRemainingTime(
              activeSeconds,
              processedSeconds,
              selected.durationSeconds,
            ));
          },
        );
        if (runIdRef.current !== runId) return;

        const inferenceSeconds = transcriptionStartedAt > 0
          ? (performance.now() - transcriptionStartedAt) / 1000
          : 0;
        session.activeProcessingSeconds += decodeSeconds + inferenceSeconds;
        session.chunks = mergeLargeMediaSegment(
          session.chunks,
          output.chunks,
          output.text,
          segment,
        );
        session.backend = output.backend;
        session.nextSegmentIndex = index + 1;
        setHasProcessedSegments(true);
        setProgress(segment.coreEnd / selected.durationSeconds);
        setEstimate(estimateRemainingTime(
          session.activeProcessingSeconds,
          segment.coreEnd,
          selected.durationSeconds,
        ));

        if (pauseRequestedRef.current && session.nextSegmentIndex < plannedSegments.length) {
          pauseRequestedRef.current = false;
          setRunState("paused");
          return;
        }
      }

      setRunState("saving");
      const text = session.chunks.map((chunk) => chunk.text.trim()).filter(Boolean).join(" ").trim();
      const record: TranscriptRecord = {
        id: createRecordId(),
        title: session.file.name,
        text,
        chunks: session.chunks,
        createdAt: Date.now(),
        durationSeconds: selected.durationSeconds,
        source: "file",
        model: settings.model,
        language: settings.language,
        task: settings.task,
        backend: session.backend ?? "wasm",
      };
      await saveTranscript(record);
      if (runIdRef.current !== runId) return;
      setProgress(1);
      setEstimate(null);
      trackPlausibleEvent(PLAUSIBLE_EVENTS.largeFileTranscriptionCompleted, {
        workflow: "large_file",
        locale,
        source: "file",
        model: getPlausibleModelName(record.model),
        language: record.language,
        task: record.task,
        backend: record.backend,
        duration: getPlausibleDurationBucket(record.durationSeconds),
      });
      setRunState("complete");
    } catch (reason) {
      if (runIdRef.current !== runId || (reason instanceof DOMException && reason.name === "AbortError")) return;
      setRunState(session.nextSegmentIndex > 0 ? "paused" : "idle");
      setError(localizeLargeFileError(reason, locale));
      trackPlausibleEvent(PLAUSIBLE_EVENTS.largeFileTranscriptionFailed, {
        workflow: "large_file",
        locale,
        stage: "processing",
      });
    }
  }, [copy.progress.segment, locale, selected, settings, transcribe]);

  /**
   * 请求在当前五分钟主体片段完成后暂停。
   */
  const requestPause = useCallback((): void => {
    pauseRequestedRef.current = true;
    setRunState("pausing");
  }, []);

  /**
   * 取消当前 Worker，并清空局部结果但保留已选择文件供重新开始。
   */
  const cancelRun = useCallback((): void => {
    if (!window.confirm(copy.controls.cancelConfirm)) return;
    runIdRef.current += 1;
    pauseRequestedRef.current = false;
    cancelTranscription("Large-file transcription cancelled");
    const session = sessionRef.current;
    if (session) {
      session.chunks = [];
      session.nextSegmentIndex = 0;
      session.activeProcessingSeconds = 0;
      session.backend = null;
    }
    setRunState("idle");
    setProgress(0);
    setEstimate(null);
    setSegmentLabel("");
    setHasProcessedSegments(false);
  }, [cancelTranscription, copy.controls.cancelConfirm]);

  /**
   * 丢弃当前会话并重新打开文件选择器。
   */
  const chooseAnotherFile = useCallback((): void => {
    runIdRef.current += 1;
    selectionIdRef.current += 1;
    sessionRef.current?.decoder.dispose();
    sessionRef.current = null;
    setSelected(null);
    setRunState("idle");
    setProgress(0);
    setEstimate(null);
    setSegmentLabel("");
    setError("");
    setHasProcessedSegments(false);
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="sonora-app large-file-app" dir={direction}>
      <LocalToolHeader locale={locale} activeTool="large-file" />

      <main className="large-file-main">
        <section className="large-file-hero">
          <div className="large-file-intro">
            <span>{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
            <strong>{copy.limit}</strong>
          </div>

          <section className="large-file-workspace" aria-label={copy.workspaceLabel}>
            <input
              ref={fileInputRef}
              type="file"
              accept={SUPPORTED_MEDIA_ACCEPT}
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void selectFile(file);
                event.target.value = "";
              }}
            />

            {!selected ? (
              <button
                className={isDragging ? "large-drop-zone is-dragging" : "large-drop-zone"}
                type="button"
                disabled={runState === "analyzing"}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  const file = event.dataTransfer.files[0];
                  if (file) void selectFile(file);
                }}
              >
                <span className="upload-icon"><FileAudio aria-hidden="true" /></span>
                <strong>{runState === "analyzing" ? copy.analyzing : copy.dropTitle}</strong>
                <span>{copy.dropHint}</span>
                <small>{copy.supportedFormats}</small>
                <b>{copy.chooseFile}</b>
              </button>
            ) : (
              <>
                <div className="large-selected-file">
                  <FileAudio aria-hidden="true" />
                  <div><small>{copy.selectedFile}</small><strong>{selected.file.name}</strong></div>
                  <dl>
                    <div><dt>{copy.duration}</dt><dd>{formatMediaDuration(selected.durationSeconds, locale)}</dd></div>
                    <div><dt>{copy.size}</dt><dd>{formatFileSize(selected.file.size, locale)}</dd></div>
                  </dl>
                </div>

                <div className="settings-grid large-settings-grid">
                  <label>
                    <span>{uiCopy.input.model}</span>
                    <select
                      value={settings.model}
                      disabled={settingsLocked}
                      onChange={(event) => updateSettings({ ...settings, model: event.target.value as TranscriptionSettings["model"] })}
                    >
                      {MODEL_OPTIONS.map((model, index) => (
                        <option value={model.id} key={model.id}>{model.label} — {uiCopy.input.modelHints[index]}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>{uiCopy.input.language}</span>
                    <select
                      value={settings.language}
                      disabled={settingsLocked}
                      onChange={(event) => updateSettings({ ...settings, language: event.target.value })}
                    >
                      <optgroup label={uiCopy.input.popularLanguages}>
                        {POPULAR_LANGUAGE_OPTIONS.map((language) => (
                          <option value={language.value} key={language.value}>
                            {languageNames?.of(language.value) ?? language.fallbackLabel}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label={uiCopy.input.moreLanguages}>
                        {ADDITIONAL_LANGUAGE_OPTIONS.map((language) => (
                          <option value={language.value} key={language.value}>
                            {languageNames?.of(language.value) ?? language.fallbackLabel}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </label>
                  <label>
                    <span>{uiCopy.input.output}</span>
                    <select
                      value={settings.task}
                      disabled={settingsLocked}
                      onChange={(event) => updateSettings({ ...settings, task: event.target.value as TranscriptionSettings["task"] })}
                    >
                      <option value="transcribe">{uiCopy.input.originalLanguage}</option>
                      <option value="translate">{uiCopy.input.translateToEnglish}</option>
                    </select>
                  </label>
                  <label>
                    <span>{uiCopy.input.backend}</span>
                    <select
                      value={settings.backend}
                      disabled={settingsLocked}
                      onChange={(event) => updateSettings({ ...settings, backend: event.target.value as TranscriptionSettings["backend"] })}
                    >
                      <option value="wasm">{uiCopy.input.backendOptions.wasm}</option>
                      <option value="webgpu">{uiCopy.input.backendOptions.webgpu}</option>
                      <option value="auto">{uiCopy.input.backendOptions.auto}</option>
                    </select>
                  </label>
                </div>

                {runState !== "complete" ? (
                  <div className="large-controls">
                    {runState === "idle" || runState === "paused" ? (
                      <button className="start-button" type="button" onClick={() => void processFile()}>
                        <Waveform aria-hidden="true" />
                        {runState === "paused" ? copy.controls.resume : copy.controls.start}
                      </button>
                    ) : null}
                    {isRunning && runState !== "saving" ? (
                      <button
                        className="pause-button"
                        type="button"
                        disabled={runState === "pausing"}
                        onClick={requestPause}
                      >
                        <Pause aria-hidden="true" weight="fill" />
                        {runState === "pausing" ? copy.controls.pausePending : copy.controls.pause}
                      </button>
                    ) : null}
                    {(isRunning || runState === "paused") && runState !== "saving" ? (
                      <button className="stop-button" type="button" onClick={cancelRun}>
                        <StopCircle aria-hidden="true" /> {copy.controls.cancel}
                      </button>
                    ) : null}
                    {runState === "idle" ? (
                      <button className="secondary-button" type="button" onClick={chooseAnotherFile}>
                        {copy.controls.chooseAnother}
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {runState !== "idle" && runState !== "complete" ? (
                  <div className="large-progress" role="status" aria-live="polite">
                    <div>
                      <strong>{copy.status[runState]}</strong>
                      <span>{segmentLabel}</span>
                    </div>
                    <div className="progress-track"><span style={{ width: `${Math.round(progress * 100)}%` }} /></div>
                    <b>{copy.progress.complete.replace("{percent}", String(Math.round(progress * 100)))}</b>
                    {runState === "loading" && warmupState === "loading" ? (
                      <small>{uiCopy.input.warmup.preparing} · {Math.round(warmupProgress)}%</small>
                    ) : null}
                    <p>
                      {estimate
                        ? copy.progress.estimate
                            .replace("{lower}", formatDuration(estimate.lowerSeconds, locale))
                            .replace("{upper}", formatDuration(estimate.upperSeconds, locale))
                        : copy.progress.calibrating}
                    </p>
                    <small>{copy.progress.reference}</small>
                  </div>
                ) : null}

                {runState === "complete" ? (
                  <div className="large-complete" role="status">
                    <CheckCircle aria-hidden="true" weight="fill" />
                    <div><h2>{copy.completed.title}</h2><p>{copy.completed.description}</p></div>
                    <a href={historyHref}>{copy.completed.openHistory}</a>
                    <button type="button" onClick={chooseAnotherFile}>{copy.controls.chooseAnother}</button>
                  </div>
                ) : null}
              </>
            )}

            {error ? <p className="error-message" role="alert">{error}</p> : null}
            <p className="large-session-notice">{copy.sessionNotice}</p>
          </section>
        </section>

        <section className="large-heat-warning" aria-labelledby="large-heat-title">
          <Flame aria-hidden="true" />
          <div><h2 id="large-heat-title">{copy.heat.title}</h2><p>{copy.heat.description}</p></div>
          <ul>{copy.heat.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </section>

        <section className="large-file-faq" aria-labelledby="large-faq-title">
          <h2 id="large-faq-title">{copy.faqTitle}</h2>
          <div>
            {copy.faq.map((item) => (
              <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter copy={uiCopy} locale={locale} />
    </div>
  );
}
