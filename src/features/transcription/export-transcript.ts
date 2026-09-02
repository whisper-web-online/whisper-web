import type { TranscriptChunk, TranscriptRecord } from "./contracts";

export type ExportFormat = "txt" | "json" | "srt" | "vtt";

/**
 * 将秒数格式化为字幕时间戳。
 */
export function formatTimestamp(seconds: number | null, separator = ","): string {
  const safeSeconds = Math.max(0, seconds ?? 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const wholeSeconds = Math.floor(safeSeconds % 60);
  const milliseconds = Math.round((safeSeconds % 1) * 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(wholeSeconds).padStart(2, "0")}${separator}${String(milliseconds).padStart(3, "0")}`;
}

/**
 * 将时间块导出为 SRT 内容。
 */
function toSrt(chunks: TranscriptChunk[]): string {
  return chunks
    .map((chunk, index) => {
      const [start, end] = chunk.timestamp;
      return `${index + 1}\n${formatTimestamp(start)} --> ${formatTimestamp(end ?? start)}\n${chunk.text.trim()}`;
    })
    .join("\n\n");
}

/**
 * 将时间块导出为 WebVTT 内容。
 */
function toVtt(chunks: TranscriptChunk[]): string {
  const cues = chunks
    .map((chunk) => {
      const [start, end] = chunk.timestamp;
      return `${formatTimestamp(start, ".")} --> ${formatTimestamp(end ?? start, ".")}\n${chunk.text.trim()}`;
    })
    .join("\n\n");
  return `WEBVTT\n\n${cues}`;
}

/**
 * 根据用户选择生成可下载的转写文件。
 */
export function createTranscriptExport(record: TranscriptRecord, format: ExportFormat): Blob {
  if (format === "json") {
    return new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
  }

  const content =
    format === "srt" ? toSrt(record.chunks) : format === "vtt" ? toVtt(record.chunks) : record.text;
  const type = format === "vtt" ? "text/vtt" : format === "srt" ? "application/x-subrip" : "text/plain";
  return new Blob([content], { type: `${type};charset=utf-8` });
}

/**
 * 触发浏览器下载，并在浏览器接管 Blob 后释放临时对象 URL。
 */
export function downloadTranscript(record: TranscriptRecord, format: ExportFormat): void {
  const blob = createTranscriptExport(record, format);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${record.title.replace(/\.[^/.]+$/, "")}.${format}`;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
