"use client";

import { CheckCircle, DownloadSimple, FileAudio, MagnifyingGlass, Trash } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { CONVERTER_HISTORY_COPY } from "@/i18n/converter-copy";
import { PLAUSIBLE_EVENTS, trackPlausibleEvent } from "@/lib/analytics/plausible";
import type { UiLocale } from "@/i18n/ui-copy";
import type { ConversionRecord } from "./contracts";
import { deleteConversion, listConversions } from "./conversion-store";

interface ConversionHistoryWorkspaceProps {
  locale: UiLocale;
  targetId?: string;
}

/** 将秒数格式化为历史列表和详情共用的 mm:ss 文本。 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

/** 把字节数格式化为便于比较的本地化文件大小。 */
function formatFileSize(bytes: number, locale: UiLocale): string {
  const megabytes = bytes / (1024 * 1024);
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: megabytes >= 10 ? 1 : 2 }).format(megabytes)} MB`;
}

/** 按 30 天合同显示剩余整天数，最后一天使用明确提醒。 */
function formatExpiry(record: ConversionRecord, locale: UiLocale, now: number): string {
  const copy = CONVERTER_HISTORY_COPY[locale];
  const remaining = record.expiresAt - now;
  if (remaining < 24 * 60 * 60 * 1_000) return copy.expiresWithinDay;
  const days = Math.ceil(remaining / (24 * 60 * 60 * 1_000));
  return copy.expiresInDays.replace("{days}", String(days));
}

/** 创建一次性对象 URL 并触发 MP3 下载，随后释放该 URL。 */
function downloadConversion(record: ConversionRecord, locale: UiLocale): void {
  const url = URL.createObjectURL(record.audioBlob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = record.outputFileName;
  anchor.click();
  URL.revokeObjectURL(url);
  trackPlausibleEvent(PLAUSIBLE_EVENTS.convertedAudioDownloaded, {
    locale,
    source: "history",
    bitrate: record.bitrateKbps,
  });
}

/** 为当前记录创建播放器对象 URL，并在切换记录或卸载时释放。 */
function ConversionAudioPlayer({ record }: { record: ConversionRecord }) {
  const [audioUrl] = useState(() => URL.createObjectURL(record.audioBlob));
  useEffect(() => () => URL.revokeObjectURL(audioUrl), [audioUrl]);
  return <audio className="audio-player" src={audioUrl} controls />;
}

/** 渲染可搜索、播放、下载和删除的本地 MP3 转换历史。 */
export function ConversionHistoryWorkspace({ locale, targetId }: ConversionHistoryWorkspaceProps) {
  const copy = CONVERTER_HISTORY_COPY[locale];
  const [records, setRecords] = useState<ConversionRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(targetId ?? null);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");
  const [now] = useState(() => Date.now());
  const selected = records.find((record) => record.id === selectedId) ?? records[0];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? records.filter((record) => record.outputFileName.toLowerCase().includes(normalized))
      : records;
  }, [query, records]);

  useEffect(() => {
    let active = true;
    void listConversions().then((storedRecords) => {
      if (!active) return;
      setRecords(storedRecords);
      setSelectedId((current) => {
        if (targetId && storedRecords.some((record) => record.id === targetId)) return targetId;
        if (current && storedRecords.some((record) => record.id === current)) return current;
        return storedRecords[0]?.id ?? null;
      });
    }).catch(() => {
      if (active) setLoadError(copy.loadFailed);
    });
    return () => {
      active = false;
    };
  }, [copy.loadFailed, targetId]);

  /** 删除所选记录，并把焦点记录移动到剩余列表首项。 */
  async function handleDelete(id: string): Promise<void> {
    await deleteConversion(id);
    trackPlausibleEvent(PLAUSIBLE_EVENTS.conversionDeleted, { locale });
    setRecords((current) => {
      const next = current.filter((record) => record.id !== id);
      setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }

  if (loadError) return <p className="history-error" role="alert">{loadError}</p>;

  if (!selected) {
    return (
      <main className="empty-history">
        <FileAudio aria-hidden="true" />
        <h1>{copy.emptyTitle}</h1>
        <p>{copy.empty}</p>
        <p className="history-storage-notice">{copy.storageNotice}</p>
      </main>
    );
  }

  return (
    <main className="history-shell conversion-history-shell">
      <aside className="history-rail">
        <h2>{copy.title}</h2>
        <label className="history-search">
          <MagnifyingGlass aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} />
        </label>
        <p className="history-storage-notice">{copy.storageNotice}</p>
        <div className="history-list">
          {filtered.map((record) => (
            <button
              className={record.id === selected.id ? "history-row is-selected" : "history-row"}
              type="button"
              onClick={() => setSelectedId(record.id)}
              key={record.id}
            >
              <FileAudio aria-hidden="true" />
              <span>
                <strong>{record.outputFileName}</strong>
                <small>{new Date(record.createdAt).toLocaleDateString(locale)} · {formatDuration(record.durationSeconds)}</small>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="transcript-editor-section conversion-player-section">
        <header className="record-header">
          <div>
            <h1 dir="auto">{selected.outputFileName}</h1>
            <p className="success-line"><CheckCircle aria-hidden="true" weight="fill" /> {copy.complete}</p>
            <span>{formatDuration(selected.durationSeconds)} · {selected.bitrateKbps} kbps · {formatFileSize(selected.outputSizeBytes, locale)}</span>
          </div>
          <button className="accent-outline" type="button" onClick={() => downloadConversion(selected, locale)}>
            <DownloadSimple aria-hidden="true" /> {copy.download}
          </button>
        </header>
        <div className="conversion-audio-card">
          <FileAudio aria-hidden="true" />
          <ConversionAudioPlayer key={selected.id} record={selected} />
          <p>{formatExpiry(selected, locale, now)}</p>
        </div>
      </section>

      <aside className="record-inspector">
        <h2>{copy.details}</h2>
        <dl>
          <div><dt>{copy.bitrate}</dt><dd>{selected.bitrateKbps} kbps</dd></div>
          <div><dt>{copy.format}</dt><dd>{selected.inputFormat.toUpperCase()}</dd></div>
          <div><dt>{copy.size}</dt><dd>{formatFileSize(selected.outputSizeBytes, locale)}</dd></div>
          <div><dt>{copy.duration}</dt><dd>{formatDuration(selected.durationSeconds)}</dd></div>
          <div><dt>{copy.created}</dt><dd>{new Date(selected.createdAt).toLocaleDateString(locale)}</dd></div>
          <div><dt>{copy.expires}</dt><dd>{new Date(selected.expiresAt).toLocaleDateString(locale)}</dd></div>
        </dl>
        <button
          className="delete-button"
          type="button"
          onClick={() => {
            if (window.confirm(copy.deleteConfirm)) void handleDelete(selected.id);
          }}
        >
          <Trash aria-hidden="true" /> {copy.delete}
        </button>
      </aside>
    </main>
  );
}
