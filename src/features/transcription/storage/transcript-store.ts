import type { TranscriptRecord } from "../contracts";
import { TRANSCRIPT_STORE_NAME, withObjectStore } from "./local-database";

/**
 * 保存或覆盖一条本地转写记录。
 */
export async function saveTranscript(record: TranscriptRecord): Promise<void> {
  await withObjectStore(TRANSCRIPT_STORE_NAME, "readwrite", (store) => store.put(record));
}

/**
 * 按创建时间倒序读取全部本地转写记录。
 */
export async function listTranscripts(): Promise<TranscriptRecord[]> {
  const records = await withObjectStore<TranscriptRecord[]>(
    TRANSCRIPT_STORE_NAME,
    "readonly",
    (store) => store.getAll(),
  );
  return records.toSorted((left, right) => right.createdAt - left.createdAt);
}

/**
 * 从浏览器本地数据库删除指定记录。
 */
export async function deleteTranscript(id: string): Promise<void> {
  await withObjectStore(TRANSCRIPT_STORE_NAME, "readwrite", (store) => store.delete(id));
}
