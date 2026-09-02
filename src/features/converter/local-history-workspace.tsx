"use client";

import { useState } from "react";
import { HistoryWorkspace } from "@/features/transcription/components/history-workspace";
import type { TranscriptRecord } from "@/features/transcription/contracts";
import { CONVERTER_HISTORY_COPY } from "@/i18n/converter-copy";
import type { UiCopy, UiLocale } from "@/i18n/ui-copy";
import { ConversionHistoryWorkspace } from "./conversion-history-workspace";

type HistoryTab = "transcripts" | "conversions";

interface LocalHistoryWorkspaceProps {
  copy: UiCopy;
  locale: UiLocale;
  records: TranscriptRecord[];
  selectedId: string | null;
  activeMediaUrl: string;
  targetConversionId?: string;
  onSelect: (id: string) => void;
  onUpdate: (record: TranscriptRecord) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

/** 读取当前会话最后使用的 History 分栏；无记录时默认转录。 */
function getInitialHistoryTab(targetConversionId?: string): HistoryTab {
  if (targetConversionId) return "conversions";
  if (typeof window === "undefined") return "transcripts";
  return sessionStorage.getItem("whisperweb-history-tab") === "conversions"
    ? "conversions"
    : "transcripts";
}

/** 组合 Transcripts 与 Conversions 分栏，并保留当前会话选择。 */
export function LocalHistoryWorkspace({
  copy,
  locale,
  records,
  selectedId,
  activeMediaUrl,
  targetConversionId,
  onSelect,
  onUpdate,
  onDelete,
}: LocalHistoryWorkspaceProps) {
  const historyCopy = CONVERTER_HISTORY_COPY[locale];
  const [tab, setTab] = useState<HistoryTab>(() => getInitialHistoryTab(targetConversionId));
  const activeTab = tab;

  /** 切换分栏并同步当前会话与可直达的地址片段。 */
  function selectTab(nextTab: HistoryTab): void {
    setTab(nextTab);
    sessionStorage.setItem("whisperweb-history-tab", nextTab);
    window.history.replaceState(null, "", nextTab === "conversions" ? "#history/conversions" : "#history");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  return (
    <section className="local-history">
      <div className="history-type-tabs" role="tablist" aria-label={historyCopy.tabsLabel}>
        <button className={activeTab === "transcripts" ? "is-active" : ""} type="button" role="tab" aria-selected={activeTab === "transcripts"} onClick={() => selectTab("transcripts")}>{historyCopy.transcriptsTab}</button>
        <button className={activeTab === "conversions" ? "is-active" : ""} type="button" role="tab" aria-selected={activeTab === "conversions"} onClick={() => selectTab("conversions")}>{historyCopy.conversionsTab}</button>
      </div>
      {activeTab === "conversions" ? (
        <ConversionHistoryWorkspace locale={locale} targetId={targetConversionId} />
      ) : (
        <HistoryWorkspace copy={copy} locale={locale} records={records} selectedId={selectedId} activeMediaUrl={activeMediaUrl} onSelect={onSelect} onUpdate={onUpdate} onDelete={onDelete} />
      )}
    </section>
  );
}
