import { IDBFactory, IDBKeyRange as FakeIDBKeyRange } from "fake-indexeddb";
import { beforeEach, describe, expect, it } from "vitest";
import type { TranscriptRecord } from "@/features/transcription/contracts";
import {
  LOCAL_DATABASE_NAME,
  TRANSCRIPT_STORE_NAME,
} from "@/features/transcription/storage/local-database";
import { listTranscripts } from "@/features/transcription/storage/transcript-store";
import type { ConversionRecord } from "./contracts";
import {
  deleteConversion,
  deleteExpiredConversions,
  getConversionExpiry,
  listConversions,
  saveConversion,
} from "./conversion-store";

const EXISTING_TRANSCRIPT: TranscriptRecord = {
  id: "transcript-1",
  title: "existing.mp4",
  text: "Existing transcript",
  chunks: [],
  createdAt: 10,
  durationSeconds: 1,
  source: "file",
  model: "onnx-community/whisper-tiny",
  language: "en",
  task: "transcribe",
  backend: "wasm",
};

/**
 * 创建包含完整 MP3 Blob 和到期合同的转换记录测试数据。
 */
function createConversion(id: string, createdAt: number): ConversionRecord {
  return {
    id,
    sourceFileName: `${id}.mp4`,
    outputFileName: `${id}.mp3`,
    inputFormat: "mp4",
    inputSizeBytes: 100,
    outputSizeBytes: 3,
    durationSeconds: 2,
    bitrateKbps: 192,
    createdAt,
    expiresAt: getConversionExpiry(createdAt),
    audioBlob: new Blob([new Uint8Array([1, 2, 3])], { type: "audio/mpeg" }),
  };
}

/**
 * 模拟升级前的 v1 数据库和一条既有转录记录。
 */
function seedVersionOneDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCAL_DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(TRANSCRIPT_STORE_NAME, { keyPath: "id" });
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction(TRANSCRIPT_STORE_NAME, "readwrite");
      transaction.objectStore(TRANSCRIPT_STORE_NAME).put(EXISTING_TRANSCRIPT);
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    };
  });
}

describe("本地转换历史", () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory();
    globalThis.IDBKeyRange = FakeIDBKeyRange;
  });

  it("从 v1 升级到 v2 后保留原有转录并新增独立转换记录", async () => {
    await seedVersionOneDatabase();
    await saveConversion(createConversion("conversion-1", 1_000));

    expect(await listTranscripts()).toEqual([EXISTING_TRANSCRIPT]);
    const conversions = await listConversions(1_001);
    expect(conversions).toHaveLength(1);
    expect(conversions[0]).toHaveProperty("audioBlob");
    expect(conversions[0]?.outputSizeBytes).toBe(3);
  });

  it("按创建时间倒序读取，并同时清理到期记录和 Blob", async () => {
    await saveConversion(createConversion("expired", 0));
    await saveConversion(createConversion("newer", 5_000));
    await saveConversion(createConversion("newest", 6_000));

    const now = getConversionExpiry(0);
    expect(await deleteExpiredConversions(now)).toBe(1);
    expect((await listConversions(now)).map((record) => record.id)).toEqual(["newest", "newer"]);
  });

  it("支持手动删除完整转换记录", async () => {
    await saveConversion(createConversion("delete-me", 10_000));
    await deleteConversion("delete-me");
    expect(await listConversions(10_001)).toEqual([]);
  });
});
