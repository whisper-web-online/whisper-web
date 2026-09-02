"use client";

import {
  CheckCircle,
  Copy,
  DownloadSimple,
  FileText,
  MagnifyingGlass,
  Trash,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { UiCopy, UiLocale } from "@/i18n/ui-copy";
import {
  getPlausibleDurationBucket,
  getPlausibleModelName,
  PLAUSIBLE_EVENTS,
  trackPlausibleEvent,
} from "@/lib/analytics/plausible";
import type { TranscriptRecord } from "../contracts";
import { downloadTranscript, type ExportFormat, formatTimestamp } from "../export-transcript";
import { MODEL_OPTIONS } from "../model-options";

interface HistoryWorkspaceProps {
  copy: UiCopy;
  locale: UiLocale;
  records: TranscriptRecord[];
  selectedId: string | null;
  activeMediaUrl: string;
  onSelect: (id: string) => void;
  onUpdate: (record: TranscriptRecord) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

/**
 * 将时长格式化为适合记录列表的 mm:ss 文本。
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

/**
 * 将旧版自动语言记录按其实际使用的英语回退行为展示。
 */
function formatLanguage(language: string): string {
  return language === "auto" ? "EN" : language.toUpperCase();
}

/**
 * 渲染本地历史、可编辑转写结果、时间轴和导出操作。
 */
export function HistoryWorkspace({
  copy,
  locale,
  records,
  selectedId,
  activeMediaUrl,
  onSelect,
  onUpdate,
  onDelete,
}: HistoryWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"text" | "timeline">("timeline");
  const [exportOpen, setExportOpen] = useState(false);
  const selected = records.find((record) => record.id === selectedId) ?? records[0];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? records.filter((record) => `${record.title} ${record.text}`.toLowerCase().includes(normalized))
      : records;
  }, [query, records]);

  /**
   * 复制当前转录文本，并记录不含文本内容的结果使用事件。
   */
  function copyTranscript(record: TranscriptRecord): void {
    void navigator.clipboard.writeText(record.text);
    trackPlausibleEvent(PLAUSIBLE_EVENTS.transcriptCopied, {
      locale,
      source: record.source,
      model: getPlausibleModelName(record.model),
      duration: getPlausibleDurationBucket(record.durationSeconds),
    });
  }

  /**
   * 下载当前转录结果，并记录导出格式等低敏枚举属性。
   */
  function exportTranscript(record: TranscriptRecord, format: ExportFormat): void {
    downloadTranscript(record, format);
    trackPlausibleEvent(PLAUSIBLE_EVENTS.transcriptExported, {
      locale,
      format,
      source: record.source,
      model: getPlausibleModelName(record.model),
      duration: getPlausibleDurationBucket(record.durationSeconds),
    });
  }

  if (!selected) {
    return (
      <main className="empty-history">
        <FileText aria-hidden="true" />
        <h1>{copy.history.title}</h1>
        <p>{copy.history.empty}</p>
      </main>
    );
  }

  return (
    <main className="history-shell">
      <aside className="history-rail">
        <h2>{copy.history.title}</h2>
        <label className="history-search">
          <MagnifyingGlass aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.history.search} />
        </label>
        <div className="history-list">
          {filtered.map((record) => (
            <button
              className={record.id === selected.id ? "history-row is-selected" : "history-row"}
              type="button"
              onClick={() => onSelect(record.id)}
              key={record.id}
            >
              <FileText aria-hidden="true" />
              <span><strong>{record.title}</strong><small>{new Date(record.createdAt).toLocaleDateString(locale)} · {formatDuration(record.durationSeconds)}</small></span>
            </button>
          ))}
        </div>
      </aside>

      <section className="transcript-editor-section">
        <header className="record-header">
          <div>
            <h1>{selected.title}</h1>
            <p className="success-line"><CheckCircle aria-hidden="true" weight="fill" /> {copy.history.complete}</p>
            <span>{formatDuration(selected.durationSeconds)} · {formatLanguage(selected.language)} · {MODEL_OPTIONS.find((item) => item.id === selected.model)?.label}</span>
          </div>
          <div className="record-actions">
            <button type="button" onClick={() => copyTranscript(selected)}><Copy aria-hidden="true" /> {copy.history.copy}</button>
            <div className="export-control">
              <button className="accent-outline" type="button" onClick={() => setExportOpen((current) => !current)}><DownloadSimple aria-hidden="true" /> {copy.history.download}</button>
              {exportOpen ? (
                <div className="export-menu">
                  {(["txt", "json", "srt", "vtt"] as ExportFormat[]).map((format) => (
                    <button type="button" onClick={() => exportTranscript(selected, format)} key={format}>{format.toUpperCase()}</button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="editor-tabs" role="tablist">
          <button
            className={tab === "timeline" ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={tab === "timeline"}
            onClick={() => setTab("timeline")}
          >
            {copy.history.timeline}
          </button>
          <button
            className={tab === "text" ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={tab === "text"}
            onClick={() => setTab("text")}
          >
            {copy.history.text}
          </button>
        </div>

        {tab === "text" ? (
          <textarea
            className="transcript-textarea"
            value={selected.text}
            onChange={(event) => void onUpdate({ ...selected, text: event.target.value })}
            aria-label={copy.history.editableTranscript}
          />
        ) : (
          <div className="timeline-list">
            {selected.chunks.length > 0 ? selected.chunks.map((chunk, index) => (
              <div className="timeline-row" key={`${chunk.timestamp[0]}-${index}`}>
                <time>{formatTimestamp(chunk.timestamp[0], ".").slice(3, -4)}</time>
                <p>{chunk.text.trim()}</p>
              </div>
            )) : <p>{copy.history.noTimestamps}</p>}
          </div>
        )}

        {activeMediaUrl ? <audio className="audio-player" src={activeMediaUrl} controls /> : null}
      </section>

      <aside className="record-inspector">
        <h2>{copy.history.details}</h2>
        <dl>
          <div><dt>{copy.history.model}</dt><dd>{MODEL_OPTIONS.find((item) => item.id === selected.model)?.label}</dd></div>
          <div><dt>{copy.history.language}</dt><dd>{formatLanguage(selected.language)}</dd></div>
          <div>
            <dt>{copy.input.output}</dt>
            <dd>{selected.task === "translate" ? copy.input.translateToEnglish : copy.input.originalLanguage}</dd>
          </div>
          <div><dt>{copy.history.compute}</dt><dd>{selected.backend.toUpperCase()}</dd></div>
        </dl>
        <button
          className="delete-button"
          type="button"
          onClick={() => {
            if (window.confirm(copy.history.deleteConfirm)) void onDelete(selected.id);
          }}
        >
          <Trash aria-hidden="true" /> {copy.history.delete}
        </button>
      </aside>
    </main>
  );
}
