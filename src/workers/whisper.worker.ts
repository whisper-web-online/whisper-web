/// <reference lib="webworker" />

import type { WhisperTextStreamer, WhisperTokenizer } from "@huggingface/transformers";
import type {
  ComputeBackend,
  TranscriptChunk,
  TranscriptionSettings,
  WorkerRequest,
  WorkerResponse,
} from "@/features/transcription/contracts";
import { calculateWhisperChunkCount } from "@/features/transcription/transcription-progress";

type ActiveBackend = Exclude<ComputeBackend, "auto">;
interface PipelineResult {
  chunks?: unknown;
  text: string;
}

interface Transcriber {
  (
    audio: Float32Array,
    options: {
      chunk_length_s: number;
      language?: string;
      return_timestamps: boolean;
      stride_length_s: number;
      streamer?: WhisperTextStreamer;
      task: TranscriptionSettings["task"];
    },
  ): Promise<PipelineResult | PipelineResult[]>;
  dispose?: () => Promise<void> | void;
  tokenizer: WhisperTokenizer;
}

type PipelineLoader = (
  task: "automatic-speech-recognition",
  model: string,
  options: {
    device: ActiveBackend;
    dtype: "fp16" | "q8";
    progress_callback: (progress: unknown) => void;
  },
) => Promise<Transcriber>;

let transcriber: Transcriber | null = null;
let activeKey = "";
let activeBackend: ActiveBackend = "wasm";
let transformersPromise: Promise<typeof import("@huggingface/transformers")> | null = null;
let pendingModel: { key: string; promise: Promise<Transcriber> } | null = null;

send({ type: "booted" });

/**
 * 向主线程发送类型安全的 Worker 消息。
 */
function send(message: WorkerResponse): void {
  self.postMessage(message);
}

/**
 * 按需加载 Transformers.js，让 Worker 先完成消息监听并可报告初始化状态。
 */
async function loadTransformers(): Promise<typeof import("@huggingface/transformers")> {
  transformersPromise ??= import("@huggingface/transformers").then((module) => {
    module.env.allowLocalModels = false;
    module.env.useBrowserCache = true;
    return module;
  });
  return transformersPromise;
}

/**
 * 将 Transformers.js 的时间块规范化为应用合同。
 */
function normalizeChunks(value: unknown): TranscriptChunk[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || !("text" in item) || !("timestamp" in item)) {
      return [];
    }

    const timestamp = Array.isArray(item.timestamp) ? item.timestamp : [null, null];
    return [
      {
        text: String(item.text),
        timestamp: [
          typeof timestamp[0] === "number" ? timestamp[0] : null,
          typeof timestamp[1] === "number" ? timestamp[1] : null,
        ],
      },
    ];
  });
}

/**
 * 根据浏览器能力和用户设置决定首选计算后端。
 */
function resolveBackend(requested: ComputeBackend): ActiveBackend {
  if (requested === "wasm") {
    return "wasm";
  }

  if (requested === "webgpu") {
    return "webgpu";
  }

  return "gpu" in navigator ? "webgpu" : "wasm";
}

/**
 * 释放当前模型，防止切换模型或后端后继续占用显存和内存。
 */
async function disposeTranscriber(): Promise<void> {
  if (transcriber && "dispose" in transcriber && typeof transcriber.dispose === "function") {
    await transcriber.dispose();
  }
  transcriber = null;
  activeKey = "";
}

/**
 * 生成模型、后端和量化精度共同组成的缓存键。
 */
function createModelKey(model: string, backend: ActiveBackend): string {
  const dtype = backend === "webgpu" ? "fp16" : "q8";
  return `${model}:${backend}:${dtype}`;
}

/**
 * 加载单个计算后端对应的 Whisper 管线，并持续报告缓存进度。
 */
async function loadPipeline(
  settings: TranscriptionSettings,
  backend: ActiveBackend,
): Promise<Transcriber> {
  const { pipeline } = await loadTransformers();
  const pipelineLoader = pipeline as unknown as PipelineLoader;
  const dtype = backend === "webgpu" ? "fp16" : "q8";
  return pipelineLoader("automatic-speech-recognition", settings.model, {
    device: backend,
    dtype,
    progress_callback: (progress) => {
      const item = progress as {
        file?: string;
        progress?: number;
        status?: string;
      };
      send({
        type: "progress",
        item: {
          file: item.file ?? "Whisper model",
          progress: item.progress ?? 0,
          status: item.status ?? "loading",
        },
      });
    },
  });
}

/**
 * 加载指定模型；WebGPU 初始化失败时自动回退到 WASM。
 */
async function getTranscriber(settings: TranscriptionSettings): Promise<Transcriber> {
  const preferredBackend = resolveBackend(settings.backend);
  const key = createModelKey(settings.model, preferredBackend);

  if (transcriber && activeKey === key) {
    return transcriber;
  }

  if (pendingModel?.key === key) {
    return pendingModel.promise;
  }

  if (pendingModel) {
    try {
      await pendingModel.promise;
    } catch {
      // 上一个模型失败不应阻止用户加载刚刚选择的新模型。
    }
  }

  if (transcriber && activeKey === key) {
    return transcriber;
  }

  await disposeTranscriber();

  const modelPromise = (async () => {
    let backend = preferredBackend;
    let instance: Transcriber;
    try {
      instance = await loadPipeline(settings, backend);
    } catch (error) {
      if (backend !== "webgpu") throw error;
      backend = "wasm";
      instance = await loadPipeline(settings, backend);
    }

    activeBackend = backend;
    activeKey = createModelKey(settings.model, backend);
    transcriber = instance;
    return instance;
  })();

  pendingModel = { key, promise: modelPromise };
  try {
    return await modelPromise;
  } finally {
    if (pendingModel?.promise === modelPromise) pendingModel = null;
  }
}

/**
 * 执行 Whisper 转写并将最终文本和时间块发送回主线程。
 */
async function transcribe(audio: Float32Array, settings: TranscriptionSettings): Promise<void> {
  const instance = await getTranscriber(settings);
  const totalChunks = calculateWhisperChunkCount(audio.length);
  let completedChunks = 0;
  const { WhisperTextStreamer: Streamer } = await loadTransformers();
  const streamer = new Streamer(instance.tokenizer, {
    skip_prompt: true,
    callback_function: () => undefined,
    on_finalize: () => {
      completedChunks = Math.min(totalChunks, completedChunks + 1);
      send({ type: "transcription-progress", completedChunks, totalChunks });
    },
  });

  send({ type: "transcription-started", backend: activeBackend, totalChunks });
  const result = await instance(audio, {
    chunk_length_s: 30,
    stride_length_s: 5,
    return_timestamps: true,
    language: settings.language,
    streamer,
    task: settings.task,
  });
  const firstResult = Array.isArray(result) ? result[0] : result;
  const text = "text" in firstResult ? String(firstResult.text).trim() : "";
  const chunks = normalizeChunks("chunks" in firstResult ? firstResult.chunks : []);
  send({ type: "complete", text, chunks, backend: activeBackend });
}

/**
 * 处理主线程发来的转写和资源释放请求。
 */
self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  if (request.type === "dispose") {
    void disposeTranscriber();
    return;
  }

  if (request.type === "preload") {
    void getTranscriber(request.settings)
      .then(() => send({ type: "model-ready", backend: activeBackend }))
      .catch((error: unknown) => {
        send({
          type: "error",
          operation: "preload",
          message: error instanceof Error ? error.message : "Whisper model preload failed.",
        });
      });
    return;
  }

  send({
    type: "progress",
    item: { file: "Whisper engine", progress: 1, status: "loading" },
  });
  void transcribe(request.audio, request.settings).catch((error: unknown) => {
    send({
      type: "error",
      operation: "transcribe",
      message: error instanceof Error ? error.message : "Whisper transcription failed.",
    });
  });
});
