import {
  CONVERSION_STORE_NAME,
  openLocalDatabase,
  withObjectStore,
} from "@/features/transcription/storage/local-database";
import type { ConversionRecord } from "./contracts";

export const CONVERSION_RETENTION_MS = 30 * 24 * 60 * 60 * 1_000;

/**
 * 计算转换记录固定 30 天后的到期时间。
 */
export function getConversionExpiry(createdAt: number): number {
  return createdAt + CONVERSION_RETENTION_MS;
}

/**
 * 保存包含 MP3 Blob 的完整转换记录；事务失败时不会留下空壳记录。
 */
export async function saveConversion(record: ConversionRecord): Promise<void> {
  await withObjectStore(CONVERSION_STORE_NAME, "readwrite", (store) => store.put(record));
}

/**
 * 删除到期时间小于等于当前时刻的转换记录和其 Blob。
 */
export async function deleteExpiredConversions(now = Date.now()): Promise<number> {
  const database = await openLocalDatabase();
  try {
    return await new Promise<number>((resolve, reject) => {
      const transaction = database.transaction(CONVERSION_STORE_NAME, "readwrite");
      const index = transaction.objectStore(CONVERSION_STORE_NAME).index("expiresAt");
      const request = index.openCursor(IDBKeyRange.upperBound(now));
      let deletedCount = 0;
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        cursor.delete();
        deletedCount += 1;
        cursor.continue();
      };
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve(deletedCount);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error ?? new Error("Expired conversion cleanup was aborted."));
    });
  } finally {
    database.close();
  }
}

/**
 * 先清理到期记录，再按创建时间倒序读取可用转换历史。
 */
export async function listConversions(now = Date.now()): Promise<ConversionRecord[]> {
  await deleteExpiredConversions(now);
  const records = await withObjectStore<ConversionRecord[]>(
    CONVERSION_STORE_NAME,
    "readonly",
    (store) => store.getAll(),
  );
  return records.toSorted((left, right) => right.createdAt - left.createdAt);
}

/**
 * 手动删除一条转换记录及其 MP3 Blob。
 */
export async function deleteConversion(id: string): Promise<void> {
  await withObjectStore(CONVERSION_STORE_NAME, "readwrite", (store) => store.delete(id));
}
