export const LOCAL_DATABASE_NAME = "sonora-local-transcripts";
export const TRANSCRIPT_STORE_NAME = "transcripts";
export const CONVERSION_STORE_NAME = "conversions";
export const LOCAL_DATABASE_VERSION = 2;

/**
 * 打开本地数据库，并以只新增 object store 的方式无损升级旧转录数据。
 */
export function openLocalDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCAL_DATABASE_NAME, LOCAL_DATABASE_VERSION);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("The local history database upgrade was blocked."));
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      resolve(database);
    };
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(TRANSCRIPT_STORE_NAME)) {
        database.createObjectStore(TRANSCRIPT_STORE_NAME, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(CONVERSION_STORE_NAME)) {
        const conversions = database.createObjectStore(CONVERSION_STORE_NAME, { keyPath: "id" });
        conversions.createIndex("expiresAt", "expiresAt");
      }
    };
  });
}

/**
 * 在指定 object store 上执行请求，等待事务真正提交后再返回结果并关闭连接。
 */
export async function withObjectStore<T>(
  storeName: typeof TRANSCRIPT_STORE_NAME | typeof CONVERSION_STORE_NAME,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openLocalDatabase();

  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(storeName, mode);
      const request = operation(transaction.objectStore(storeName));
      let result: T;
      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error ?? new Error("The local history transaction was aborted."));
    });
  } finally {
    database.close();
  }
}
