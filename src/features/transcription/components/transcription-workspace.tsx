"use client";

import {
  ArrowUp,
  FileAudio,
  LinkSimple,
  Microphone,
  Pause,
  StopCircle,
  Waveform,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { UiCopy, UiLocale } from "@/i18n/ui-copy";
import { LARGE_FILE_LANGUAGE_PATHS } from "@/lib/seo/site";
import type {
  ModelWarmupState,
  TranscriptionProgressPoint,
  TranscriptionRunState,
  TranscriptionSettings,
} from "../contracts";
import {
  ADDITIONAL_LANGUAGE_OPTIONS,
  MODEL_OPTIONS,
  POPULAR_LANGUAGE_OPTIONS,
  SUPPORTED_MEDIA_ACCEPT,
  SUPPORTED_MEDIA_FORMATS,
} from "../model-options";
import { ModelProgress, ModelWarmupStatus } from "./model-progress";

type InputMode = "file" | "url" | "recording";

/**
 * 提供无需监听外部事件的水合状态订阅器。
 */
const subscribeToHydration = () => () => undefined;

/**
 * 返回浏览器完成水合后的快照。
 */
const getHydratedSnapshot = () => true;

/**
 * 返回服务端和浏览器首帧共享的未水合快照。
 */
const getServerHydrationSnapshot = () => false;

interface TranscriptionWorkspaceProps {
  copy: UiCopy;
  locale: UiLocale;
  settings: TranscriptionSettings;
  runState: TranscriptionRunState;
  transcriptionProgress: TranscriptionProgressPoint;
  selectedMediaName: string;
  notice: string;
  warmupBackend: "webgpu" | "wasm" | null;
  warmupError: string;
  warmupProgress: number;
  warmupState: ModelWarmupState;
  onRetryWarmup: () => void;
  error: string;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onSettingsChange: (settings: TranscriptionSettings) => void;
  onMediaSelected: (file: File, source: "file" | "recording") => Promise<void>;
  onUrlSelected: (url: string) => Promise<void>;
}

interface TranscriptionSettingsFieldsProps {
  copy: UiCopy;
  settings: TranscriptionSettings;
  isRunning: boolean;
  languageNames: Intl.DisplayNames | null;
  onSettingsChange: (settings: TranscriptionSettings) => void;
}

interface UrlImportErrorDialogProps {
  copy: UiCopy;
  error: string;
}

/**
 * 返回浏览器支持的首个录音 MIME 类型。
 */
function findRecordingMimeType(): string {
  return ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((type) =>
    MediaRecorder.isTypeSupported(type),
  ) ?? "";
}

/**
 * 仅在浏览器完成水合后启用本地化语言名称，保证服务端与首帧文本一致。
 */
function useHasHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
}

/**
 * 返回可读的本地化语言名称，并在浏览器缺少名称时使用稳定回退值。
 */
function formatLanguageLabel(
  displayNames: Intl.DisplayNames | null,
  language: { value: string; fallbackLabel: string },
): string {
  const localizedLabel = displayNames?.of(language.value);
  return localizedLabel && localizedLabel.toLowerCase() !== language.value.toLowerCase()
    ? localizedLabel
    : language.fallbackLabel;
}

/**
 * 判断当前交互是否发生在移动端布局中。
 */
function isMobileViewport(): boolean {
  return typeof window.matchMedia === "function"
    && window.matchMedia("(max-width: 760px)").matches;
}

/**
 * 在移动端平滑定位到用户下一步需要操作的区域。
 */
function scrollToNextAction(target: HTMLElement | null, block: ScrollLogicalPosition = "center"): void {
  if (!isMobileViewport()) return;

  window.requestAnimationFrame(() => {
    target?.scrollIntoView?.({ behavior: "smooth", block });
  });
}

/**
 * 判断错误是否来自直链导入流程。
 */
function isUrlImportError(error: string, copy: UiCopy): boolean {
  if (error === copy.errors.urlFailed) return true;

  const [prefix, suffix = ""] = copy.errors.urlHttp.split("{status}");
  return Boolean(error && error.startsWith(prefix) && error.endsWith(suffix));
}

/**
 * 在当前视口中展示可关闭的直链导入错误。
 */
function UrlImportErrorDialog({ copy, error }: UrlImportErrorDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  if (!isOpen) return null;

  return (
    <div
      className="url-error-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="url-error-dialog-title"
      aria-describedby="url-error-dialog-description"
      onClick={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIsOpen(false);
      }}
    >
      <div className="url-error-dialog-card">
        <span className="url-error-dialog-icon"><LinkSimple aria-hidden="true" /></span>
        <div className="url-error-dialog-copy">
          <h2 id="url-error-dialog-title">{copy.input.errorDialog.title}</h2>
          <p className="url-error-reason">{error}</p>
          <p id="url-error-dialog-description">{copy.input.errorDialog.description}</p>
          <div className="url-error-example">
            <span>{copy.input.errorDialog.exampleLabel}</span>
            <code dir="ltr">{copy.input.errorDialog.example}</code>
          </div>
          <ul>
            {copy.input.errorDialog.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={() => setIsOpen(false)} autoFocus>
          {copy.input.errorDialog.close}
        </button>
      </div>
    </div>
  );
}

/**
 * 渲染模型、语言、输出方式和计算后端四项转录设置。
 */
function TranscriptionSettingsFields({
  copy,
  settings,
  isRunning,
  languageNames,
  onSettingsChange,
}: TranscriptionSettingsFieldsProps) {
  return (
    <>
      <label>
        <span>{copy.input.model}</span>
        <select
          value={settings.model}
          disabled={isRunning}
          onChange={(event) => onSettingsChange({
            ...settings,
            model: event.target.value as TranscriptionSettings["model"],
          })}
        >
          {MODEL_OPTIONS.map((model, index) => (
            <option value={model.id} key={model.id}>
              {model.label} — {copy.input.modelHints[index]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{copy.input.language}</span>
        <select
          value={settings.language}
          disabled={isRunning}
          onChange={(event) => onSettingsChange({ ...settings, language: event.target.value })}
        >
          <optgroup label={copy.input.popularLanguages}>
            {POPULAR_LANGUAGE_OPTIONS.map((language) => (
              <option value={language.value} key={language.value}>
                {formatLanguageLabel(languageNames, language)}
              </option>
            ))}
          </optgroup>
          <optgroup label={copy.input.moreLanguages}>
            {ADDITIONAL_LANGUAGE_OPTIONS.map((language) => (
              <option value={language.value} key={language.value}>
                {formatLanguageLabel(languageNames, language)}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
      <label>
        <span>{copy.input.output}</span>
        <select
          value={settings.task}
          disabled={isRunning}
          onChange={(event) => onSettingsChange({
            ...settings,
            task: event.target.value as TranscriptionSettings["task"],
          })}
        >
          <option value="transcribe">{copy.input.originalLanguage}</option>
          <option value="translate">{copy.input.translateToEnglish}</option>
        </select>
      </label>
      <label>
        <span>{copy.input.backend}</span>
        <select
          value={settings.backend}
          disabled={isRunning}
          onChange={(event) =>
            onSettingsChange({ ...settings, backend: event.target.value as TranscriptionSettings["backend"] })
          }
        >
          <option value="wasm">{copy.input.backendOptions.wasm}</option>
          <option value="webgpu">{copy.input.backendOptions.webgpu}</option>
          <option value="auto">{copy.input.backendOptions.auto}</option>
        </select>
      </label>
    </>
  );
}

/**
 * 渲染可切换的文件、直链和麦克风输入区以及必要的本地转写设置。
 */
export function TranscriptionWorkspace({
  copy,
  locale,
  settings,
  runState,
  transcriptionProgress,
  selectedMediaName,
  notice,
  warmupBackend,
  warmupError,
  warmupProgress,
  warmupState,
  onRetryWarmup,
  error,
  onStart,
  onPause,
  onStop,
  onSettingsChange,
  onMediaSelected,
  onUrlSelected,
}: TranscriptionWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeInputPanelRef = useRef<HTMLDivElement>(null);
  const startControlsRef = useRef<HTMLDivElement>(null);
  const previousSelectedMediaNameRef = useRef(selectedMediaName);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSettingsConfirmationOpen, setIsSettingsConfirmationOpen] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [url, setUrl] = useState("");
  const isRunning = runState === "decoding"
    || runState === "loading"
    || runState === "transcribing"
    || runState === "saving"
    || runState === "complete";
  const hasHydrated = useHasHydrated();
  const isLargeFileLimitError = error === copy.errors.fileTooLarge || error === copy.errors.mediaTooLong;
  const hasUrlImportError = isUrlImportError(error, copy);
  const languageNames = useMemo(
    () => hasHydrated ? new Intl.DisplayNames([locale], { type: "language" }) : null,
    [hasHydrated, locale],
  );

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    const previousSelectedMediaName = previousSelectedMediaNameRef.current;
    previousSelectedMediaNameRef.current = selectedMediaName;
    if (!selectedMediaName || selectedMediaName === previousSelectedMediaName) return;

    scrollToNextAction(startControlsRef.current);
  }, [selectedMediaName]);

  /**
   * 切换输入方式，并在移动端把新出现的操作区带入视口。
   */
  function selectInputMode(mode: InputMode): void {
    setInputMode(mode);
    scrollToNextAction(activeInputPanelRef.current, "start");
  }

  /**
   * 桌面端直接开始，移动端首次开始前先展示设置确认层。
   */
  function requestTranscriptionStart(): void {
    if (runState === "paused" || !isMobileViewport()) {
      onStart();
      return;
    }

    setIsSettingsConfirmationOpen(true);
  }

  /**
   * 关闭移动端设置确认层并开始本地转录。
   */
  function confirmTranscriptionStart(): void {
    setIsSettingsConfirmationOpen(false);
    onStart();
  }

  /**
   * 开始或结束录音，并把本地 Blob 交给统一转写入口。
   */
  async function toggleRecording(): Promise<void> {
    if (isRecording) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    chunksRef.current = [];
    const mimeType = findRecordingMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = recorder;
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    });
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      const extension = recorder.mimeType.includes("mp4") ? "m4a" : "webm";
      const file = new File([blob], `recording-${Date.now()}.${extension}`, { type: recorder.mimeType });
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      void onMediaSelected(file, "recording");
    });
    recorder.start(500);
    setIsRecording(true);
  }

  /**
   * 校验拖入内容并转交第一个媒体文件。
   */
  function handleDrop(event: React.DragEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void onMediaSelected(file, "file");
  }

  return (
    <section
      className={isSettingsConfirmationOpen || hasUrlImportError
        ? "transcription-panel has-settings-confirmation"
        : "transcription-panel"}
      aria-label={copy.input.workspaceLabel}
    >
      <div className="input-mode-anchor" ref={activeInputPanelRef}>
        {inputMode === "file" ? (
        <>
          <button
            className={isDragging ? "drop-zone is-dragging" : "drop-zone"}
            type="button"
            disabled={isRunning}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <span className="upload-icon"><ArrowUp aria-hidden="true" /></span>
            <strong>{copy.input.dropTitle}</strong>
            <span className="formats-hint">
              {copy.input.formats}: {SUPPORTED_MEDIA_FORMATS.map((format) => format.label).join(", ")}
            </span>
            <span>{copy.input.dropHint}</span>
          </button>
          <aside
            className={isLargeFileLimitError ? "large-file-entry is-emphasized" : "large-file-entry"}
            aria-label={copy.input.largeFile.prompt}
          >
            <span>{copy.input.largeFile.prompt}</span>
            <Link href={LARGE_FILE_LANGUAGE_PATHS[locale]}>{copy.input.largeFile.action}</Link>
          </aside>
        </>
        ) : inputMode === "url" ? (
        <div className="input-mode-panel url-mode-panel">
          <span className="upload-icon"><LinkSimple aria-hidden="true" /></span>
          <strong>{copy.input.urlTitle}</strong>
          <span>{copy.input.urlHint}</span>
          <form
            className="url-form"
            onSubmit={(event) => {
              event.preventDefault();
              void onUrlSelected(url);
            }}
          >
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/audio.mp3"
              aria-label={copy.input.urlTitle}
              required
              autoFocus
            />
            <button type="submit" disabled={isRunning}>{copy.input.import}</button>
          </form>
        </div>
        ) : (
        <div className="input-mode-panel record-mode-panel">
          <span className={isRecording ? "upload-icon is-recording" : "upload-icon"}>
            <Microphone aria-hidden="true" />
          </span>
          <strong>{copy.input.recordTitle}</strong>
          <span>{copy.input.recordHint}</span>
          <button
            className={isRecording ? "record-button is-recording" : "record-button"}
            type="button"
            onClick={() => void toggleRecording()}
            disabled={isRunning}
          >
            {isRecording ? <StopCircle aria-hidden="true" /> : <Microphone aria-hidden="true" />}
            {isRecording ? copy.input.stop : copy.input.startRecording}
          </button>
        </div>
        )}
      </div>

      <div className="input-actions">
        <button
          className={inputMode === "file" ? "is-active" : undefined}
          type="button"
          aria-pressed={inputMode === "file"}
          onClick={() => {
            setInputMode("file");
            fileInputRef.current?.click();
          }}
          disabled={isRunning || isRecording}
        >
          <FileAudio aria-hidden="true" /> {copy.input.file}
        </button>
        <button
          className={inputMode === "url" ? "is-active" : undefined}
          type="button"
          aria-pressed={inputMode === "url"}
          onClick={() => selectInputMode("url")}
          disabled={isRunning || isRecording}
        >
          <LinkSimple aria-hidden="true" /> {copy.input.url}
        </button>
        <button
          className={inputMode === "recording" ? "is-active" : undefined}
          type="button"
          aria-pressed={inputMode === "recording"}
          onClick={() => selectInputMode("recording")}
          disabled={isRunning}
        >
          <Microphone aria-hidden="true" /> {copy.input.record}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED_MEDIA_ACCEPT}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onMediaSelected(file, "file");
          event.target.value = "";
        }}
      />

      {selectedMediaName ? (
        <div className="selected-media" role="status">
          <FileAudio aria-hidden="true" />
          <span><small>{copy.input.selectedMedia}</small><strong>{selectedMediaName}</strong></span>
          <b>{copy.input.readyToStart}</b>
        </div>
      ) : null}

      <div className="settings-grid desktop-settings-grid">
        <TranscriptionSettingsFields
          copy={copy}
          settings={settings}
          isRunning={isRunning}
          languageNames={languageNames}
          onSettingsChange={onSettingsChange}
        />
      </div>

      {isRunning && runState !== "saving" && runState !== "complete" ? (
        <div className="transcription-controls" ref={startControlsRef}>
          <button className="pause-button" type="button" onClick={onPause}>
            <Pause aria-hidden="true" weight="fill" /> {copy.input.pause}
          </button>
          <button className="stop-button" type="button" onClick={onStop}>
            <StopCircle aria-hidden="true" /> {copy.input.stopTranscription}
          </button>
        </div>
      ) : !isRunning ? (
        <div className="transcription-controls" ref={startControlsRef}>
          <button
            className="start-button"
            type="button"
            onClick={requestTranscriptionStart}
            disabled={!selectedMediaName}
          >
            <Waveform aria-hidden="true" weight="bold" />
            {runState === "paused" ? copy.input.resume : copy.input.start}
          </button>
          {runState === "paused" ? (
            <button className="stop-button" type="button" onClick={onStop}>
              <StopCircle aria-hidden="true" /> {copy.input.stopTranscription}
            </button>
          ) : null}
        </div>
      ) : null}

      {runState !== "idle" ? (
        <ModelProgress
          key={`${runState}-progress`}
          copy={copy.input.progress}
          downloadProgress={warmupProgress}
          state={runState}
          transcriptionProgress={transcriptionProgress}
        />
      ) : null}
      {runState === "idle" ? (
        <ModelWarmupStatus
          backend={warmupBackend}
          copy={copy.input.warmup}
          error={warmupError}
          onRetry={onRetryWarmup}
          progress={warmupProgress}
          state={warmupState}
        />
      ) : null}
      {notice ? <p className="status-notice" role="status">{notice}</p> : null}
      {error && !hasUrlImportError ? <p className="error-message" role="alert">{error}</p> : null}
      <p className="privacy-caption">{copy.input.privacyCaption}</p>

      {hasUrlImportError ? (
        <UrlImportErrorDialog key={error} copy={copy} error={error} />
      ) : null}

      {isSettingsConfirmationOpen ? (
        <div
          className="settings-confirmation"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-confirmation-title"
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsSettingsConfirmationOpen(false);
          }}
        >
          <div className="settings-confirmation-card">
            <div className="settings-confirmation-header">
              <span>{copy.input.settingsDialog.eyebrow}</span>
              <h2 id="settings-confirmation-title">{copy.input.settingsDialog.title}</h2>
              <p>{copy.input.settingsDialog.description}</p>
            </div>
            <div className="settings-grid settings-confirmation-grid">
              <TranscriptionSettingsFields
                copy={copy}
                settings={settings}
                isRunning={isRunning}
                languageNames={languageNames}
                onSettingsChange={onSettingsChange}
              />
            </div>
            <div className="settings-confirmation-actions">
              <button type="button" onClick={() => setIsSettingsConfirmationOpen(false)}>
                {copy.input.settingsDialog.cancel}
              </button>
              <button className="confirm-button" type="button" onClick={confirmTranscriptionStart} autoFocus>
                <Waveform aria-hidden="true" weight="bold" />
                {copy.input.settingsDialog.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
