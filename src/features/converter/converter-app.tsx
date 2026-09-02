"use client";

import {
  ArrowRight,
  CheckCircle,
  DownloadSimple,
  FileVideo,
  LockKey,
  MusicNotes,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { LocalToolHeader } from "@/features/transcription/components/local-tool-header";
import { SiteFooter } from "@/features/transcription/components/site-footer";
import { UI_COPY, directionForLocale, type UiLocale } from "@/i18n/ui-copy";
import { CONVERTER_PAGE_COPY } from "@/i18n/converter-page-copy";
import { LARGE_FILE_LANGUAGE_PATHS, LOCALE_PATHS } from "@/lib/seo/site";
import {
  getPlausibleDurationBucket,
  getPlausibleSizeBucket,
  PLAUSIBLE_EVENTS,
  trackPlausibleEvent,
} from "@/lib/analytics/plausible";
import {
  CONVERTER_ACCEPT,
  CONVERSION_BITRATES,
  DEFAULT_CONVERSION_BITRATE,
  ConverterError,
  type AnalyzedVideo,
  type ConversionBitrate,
  type ConversionOutput,
  type ConversionRecord,
} from "./contracts";
import { analyzeVideoFile, convertVideoToMp3, validateVideoFile } from "./conversion-engine";
import { deleteExpiredConversions, getConversionExpiry, saveConversion } from "./conversion-store";

type ConverterRunState = "idle" | "analyzing" | "ready" | "converting" | "saving" | "complete" | "error" | "cancelled";

interface ConverterAppProps {
  locale: UiLocale;
}

interface CompletedConversion extends ConversionOutput {
  recordId: string;
  historySaved: boolean;
  expiresAt: number;
}

/** 把秒数格式化为用户可快速读取的 mm:ss。 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

/** 把字节数格式化为本地化的 MB 文本。 */
function formatFileSize(bytes: number, locale: UiLocale): string {
  const megabytes = bytes / (1024 * 1024);
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: megabytes >= 10 ? 1 : 2 }).format(megabytes)} MB`;
}

/** 生成浏览器兼容的转换记录 ID。 */
function createConversionId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `conversion-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** 将稳定错误代码映射为当前语言的恢复文案。 */
function localizeConverterError(reason: unknown, locale: UiLocale): string {
  const copy = CONVERTER_PAGE_COPY[locale];
  if (reason instanceof ConverterError) return copy.errors[reason.code];
  return copy.errors.conversion_failed;
}

/** 将选择门禁与媒体分析错误归入稳定、低基数的统计阶段。 */
function getSelectionFailureStage(reason: unknown): "selection" | "analysis" {
  if (!(reason instanceof ConverterError)) return "analysis";
  return ["unsupported_extension", "empty_file", "file_too_large"].includes(reason.code)
    ? "selection"
    : "analysis";
}

/** 创建完成态播放器所需对象 URL，并在组件卸载时释放。 */
function CompletedAudioPlayer({ output }: { output: CompletedConversion }) {
  const [audioUrl] = useState(() => URL.createObjectURL(output.audioBlob));
  useEffect(() => () => URL.revokeObjectURL(audioUrl), [audioUrl]);
  return <audio className="audio-player" src={audioUrl} controls />;
}

/** 创建一次性对象 URL，触发浏览器下载并立即释放。 */
function downloadCompletedConversion(output: CompletedConversion, locale: UiLocale): void {
  const url = URL.createObjectURL(output.audioBlob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = output.outputFileName;
  anchor.click();
  URL.revokeObjectURL(url);
  trackPlausibleEvent(PLAUSIBLE_EVENTS.convertedAudioDownloaded, {
    locale,
    source: "completion",
    bitrate: output.bitrateKbps,
  });
}

/** 渲染 MP4 to MP3 的本地文件分析、转换、保存和完成流程。 */
export function ConverterApp({ locale }: ConverterAppProps) {
  const copy = CONVERTER_PAGE_COPY[locale];
  const [runState, setRunState] = useState<ConverterRunState>("idle");
  const [analyzed, setAnalyzed] = useState<AnalyzedVideo | null>(null);
  const [bitrate, setBitrate] = useState<ConversionBitrate>(DEFAULT_CONVERSION_BITRATE);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<CompletedConversion | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const operationIdRef = useRef(0);
  const isBusy = runState === "analyzing" || runState === "converting" || runState === "saving";

  useEffect(() => {
    void deleteExpiredConversions().catch(() => undefined);
    return () => abortRef.current?.abort();
  }, []);

  /** 重置当前结果并分析一份通过初始门禁的视频。 */
  async function selectFile(file: File): Promise<void> {
    const operationId = operationIdRef.current + 1;
    operationIdRef.current = operationId;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAnalyzed(null);
    setCompleted(null);
    setProgress(0);
    setError("");
    setRunState("analyzing");
    try {
      const inputFormat = validateVideoFile(file);
      trackPlausibleEvent(PLAUSIBLE_EVENTS.converterMediaSelected, {
        locale,
        input_format: inputFormat,
        size_bucket: getPlausibleSizeBucket(file.size),
      });
      const next = await analyzeVideoFile(file, controller.signal);
      if (operationIdRef.current !== operationId) return;
      setAnalyzed(next);
      setRunState("ready");
    } catch (reason) {
      if (operationIdRef.current !== operationId) return;
      if (reason instanceof ConverterError && reason.code === "cancelled") {
        setRunState("cancelled");
        return;
      }
      trackPlausibleEvent(PLAUSIBLE_EVENTS.conversionFailed, {
        locale,
        stage: getSelectionFailureStage(reason),
        reason_bucket: reason instanceof ConverterError ? reason.code : "unknown",
      });
      setError(localizeConverterError(reason, locale));
      setRunState("error");
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  /** 开始主音轨 MP3 编码，并在成功后尝试保存完整本地记录。 */
  async function startConversion(): Promise<void> {
    if (!analyzed || isBusy) return;
    const operationId = operationIdRef.current + 1;
    operationIdRef.current = operationId;
    const controller = new AbortController();
    abortRef.current = controller;
    setCompleted(null);
    setError("");
    setNotice("");
    setProgress(0);
    setRunState("converting");
    trackPlausibleEvent(PLAUSIBLE_EVENTS.conversionStarted, {
      locale,
      input_format: analyzed.inputFormat,
      bitrate,
    });
    try {
      const output = await convertVideoToMp3(analyzed, bitrate, {
        signal: controller.signal,
        onProgress: (value) => {
          if (operationIdRef.current === operationId) setProgress(value);
        },
      });
      if (operationIdRef.current !== operationId) return;
      setProgress(1);
      setRunState("saving");
      const createdAt = Date.now();
      const recordId = createConversionId();
      const expiresAt = getConversionExpiry(createdAt);
      const record: ConversionRecord = {
        id: recordId,
        sourceFileName: analyzed.sourceFileName,
        outputFileName: output.outputFileName,
        inputFormat: analyzed.inputFormat,
        inputSizeBytes: analyzed.inputSizeBytes,
        outputSizeBytes: output.outputSizeBytes,
        durationSeconds: output.durationSeconds,
        bitrateKbps: output.bitrateKbps,
        createdAt,
        expiresAt,
        audioBlob: output.audioBlob,
      };
      let historySaved = true;
      try {
        await saveConversion(record);
      } catch {
        historySaved = false;
        trackPlausibleEvent(PLAUSIBLE_EVENTS.conversionFailed, {
          locale,
          stage: "saving",
          reason_bucket: "storage",
        });
      }
      if (operationIdRef.current !== operationId) return;
      setCompleted({ ...output, recordId, historySaved, expiresAt });
      setRunState("complete");
      trackPlausibleEvent(PLAUSIBLE_EVENTS.conversionCompleted, {
        locale,
        input_format: analyzed.inputFormat,
        bitrate: output.bitrateKbps,
        duration_bucket: getPlausibleDurationBucket(output.durationSeconds),
        history_saved: historySaved,
      });
    } catch (reason) {
      if (operationIdRef.current !== operationId) return;
      if (reason instanceof ConverterError && reason.code === "cancelled") {
        setRunState("cancelled");
        setNotice(copy.cancelled);
        return;
      }
      trackPlausibleEvent(PLAUSIBLE_EVENTS.conversionFailed, {
        locale,
        stage: "encoding",
        reason_bucket: reason instanceof ConverterError ? reason.code : "unknown",
      });
      setError(localizeConverterError(reason, locale));
      setRunState("error");
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  /** 取消正在进行的分析或转换，不保留半成品和历史记录。 */
  function cancelCurrentOperation(): void {
    operationIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setProgress(0);
    setRunState("cancelled");
    setNotice(copy.cancelled);
  }

  /** 清除当前选择和完成结果，并重新打开文件选择器。 */
  function chooseAnotherFile(): void {
    operationIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setAnalyzed(null);
    setCompleted(null);
    setProgress(0);
    setNotice("");
    setError("");
    setRunState("idle");
    fileInputRef.current?.click();
  }

  /** 接收拖入文件；多文件时只处理第一份并显示 v1 边界。 */
  function handleDroppedFiles(files: FileList): void {
    if (files.length === 0) return;
    setNotice(files.length > 1 ? copy.batchNotice : "");
    void selectFile(files[0]);
  }

  return (
    <div className="sonora-app converter-app" dir={directionForLocale(locale)}>
      <LocalToolHeader locale={locale} activeTool="converter" />
      <main>
        <section className="converter-hero">
          <div className="converter-intro">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href={LOCALE_PATHS[locale]}>Whisper Web</a>
              <span aria-hidden="true">/</span>
              <span>{copy.toolsMenu.converter}</span>
            </nav>
            <span className="guide-eyebrow">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
            <ul className="converter-trust-list">
              {copy.trust.map((item) => <li key={item}><CheckCircle aria-hidden="true" /> {item}</li>)}
            </ul>
            <strong className="converter-limit"><LockKey aria-hidden="true" /> {copy.limit}</strong>
          </div>

          <section className="converter-workspace" aria-label={copy.workspaceLabel}>
            <input
              ref={fileInputRef}
              type="file"
              accept={CONVERTER_ACCEPT}
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void selectFile(file);
                event.target.value = "";
              }}
            />

            {!analyzed && runState !== "analyzing" ? (
              <button
                className="converter-drop-zone"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDroppedFiles(event.dataTransfer.files);
                }}
              >
                <UploadSimple aria-hidden="true" />
                <strong>{copy.dropTitle}</strong>
                <span>{copy.dropHint}</span>
                <b>{copy.chooseFile}</b>
              </button>
            ) : null}

            {runState === "analyzing" ? (
              <div className="converter-status-card" role="status">
                <FileVideo aria-hidden="true" />
                <strong>{copy.analyzing}</strong>
                <button type="button" onClick={cancelCurrentOperation}><X aria-hidden="true" /> {copy.cancel}</button>
              </div>
            ) : null}

            {analyzed && runState !== "complete" ? (
              <div className="converter-ready-card">
                <header>
                  <FileVideo aria-hidden="true" />
                  <div><small>{copy.selectedFile}</small><strong dir="auto">{analyzed.sourceFileName}</strong></div>
                  <button type="button" onClick={chooseAnotherFile} disabled={isBusy}>{copy.replaceFile}</button>
                </header>
                <dl className="converter-file-facts">
                  <div><dt>{copy.inputFormat}</dt><dd>{analyzed.inputFormat.toUpperCase()}</dd></div>
                  <div><dt>{copy.fileSize}</dt><dd>{formatFileSize(analyzed.inputSizeBytes, locale)}</dd></div>
                  <div><dt>{copy.duration}</dt><dd>{formatDuration(analyzed.durationSeconds)}</dd></div>
                  <div><dt>{copy.outputName}</dt><dd dir="auto">{analyzed.outputFileName}</dd></div>
                </dl>
                <details className="converter-audio-details">
                  <summary>{copy.audioDetails}</summary>
                  <dl>
                    <div><dt>{copy.channels}</dt><dd>{analyzed.numberOfChannels}</dd></div>
                    <div><dt>{copy.sampleRate}</dt><dd>{analyzed.sampleRate.toLocaleString(locale)} Hz</dd></div>
                  </dl>
                </details>
                <fieldset className="bitrate-options" disabled={isBusy}>
                  <legend>{copy.bitrateLabel}</legend>
                  {CONVERSION_BITRATES.map((value) => (
                    <label className={bitrate === value ? "is-selected" : ""} key={value}>
                      <input type="radio" name="bitrate" value={value} checked={bitrate === value} onChange={() => setBitrate(value)} />
                      <span>{copy.bitrateOptions[String(value) as "128" | "192" | "320"]}</span>
                    </label>
                  ))}
                </fieldset>

                {runState === "converting" || runState === "saving" ? (
                  <div className="converter-progress" role="status">
                    <div><strong>{runState === "saving" ? copy.saving : copy.converting}</strong><span aria-hidden="true">{Math.round(progress * 100)}%</span></div>
                    <div className="converter-progress-track" role="progressbar" aria-label={copy.progressLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ width: `${progress * 100}%` }} /></div>
                    {runState === "converting" ? <button type="button" onClick={cancelCurrentOperation}><X aria-hidden="true" /> {copy.cancel}</button> : null}
                  </div>
                ) : (
                  <div className="converter-actions">
                    <button className="primary-button" type="button" onClick={() => void startConversion()}>{runState === "error" ? copy.retry : copy.start}<ArrowRight aria-hidden="true" /></button>
                  </div>
                )}
              </div>
            ) : null}

            {completed && runState === "complete" ? (
              <div className="converter-complete-card" role="status">
                <CheckCircle aria-hidden="true" weight="fill" />
                <div><small>{copy.complete}</small><h2 dir="auto">{completed.outputFileName}</h2><p>{formatDuration(completed.durationSeconds)} · {completed.bitrateKbps} kbps · {formatFileSize(completed.outputSizeBytes, locale)}</p></div>
                <CompletedAudioPlayer output={completed} />
                <p className={completed.historySaved ? "history-save-status" : "history-save-status is-warning"}>
                  {completed.historySaved
                    ? `${copy.historySaved} ${copy.expires.replace("{date}", new Date(completed.expiresAt).toLocaleDateString(locale))}`
                    : copy.historyNotSaved}
                </p>
                <button className="primary-button" type="button" onClick={() => downloadCompletedConversion(completed, locale)}><DownloadSimple aria-hidden="true" /> {copy.download}</button>
                <div className="converter-secondary-actions">
                  <button type="button" onClick={chooseAnotherFile}>{copy.convertAnother}</button>
                  {completed.historySaved ? <a href={`${LOCALE_PATHS[locale]}#history/conversions/${encodeURIComponent(completed.recordId)}`}>{copy.openHistory}</a> : null}
                </div>
              </div>
            ) : null}

            {notice ? <p className="converter-notice" role="status">{notice}</p> : null}
            {error ? <p className="converter-error" role="alert">{error}</p> : null}
          </section>
        </section>

        <section className="converter-steps" aria-labelledby="converter-steps-heading">
          <h2 id="converter-steps-heading">{copy.stepsHeading}</h2>
          <ol>{copy.steps.map((step, index) => <li key={step.title}><b>0{index + 1}</b><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
        </section>

        <section className="converter-information">
          <div className="converter-info-heading"><MusicNotes aria-hidden="true" /><h2>{copy.limitsHeading}</h2></div>
          <div className="converter-limit-grid">{copy.limits.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
          <article className="converter-wide-card"><LockKey aria-hidden="true" /><div><h2>{copy.privacyHeading}</h2><p>{copy.privacyBody}</p></div></article>
          <article className="converter-wide-card"><FileVideo aria-hidden="true" /><div><h2>{copy.compatibilityHeading}</h2><p>{copy.compatibilityBody}</p></div></article>
        </section>

        <section className="converter-faq">
          <h2>{copy.faqHeading}</h2>
          <div>{copy.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
        </section>

        <section className="converter-related">
          <h2>{copy.relatedHeading}</h2>
          <div>
            <article><h3>{copy.transcribeTitle}</h3><p>{copy.transcribeBody}</p><a href={LOCALE_PATHS[locale]}>{copy.transcribeAction}<ArrowRight aria-hidden="true" /></a></article>
            <article><h3>{copy.largeFileTitle}</h3><p>{copy.largeFileBody}</p><a href={LARGE_FILE_LANGUAGE_PATHS[locale]}>{copy.largeFileAction}<ArrowRight aria-hidden="true" /></a></article>
          </div>
        </section>
      </main>
      <SiteFooter copy={UI_COPY[locale]} locale={locale} />
    </div>
  );
}
