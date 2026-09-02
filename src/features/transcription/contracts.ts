export type ModelId =
  | "onnx-community/whisper-tiny"
  | "onnx-community/whisper-base"
  | "onnx-community/whisper-small";

export type TranscriptionTask = "transcribe" | "translate";
export type ComputeBackend = "auto" | "webgpu" | "wasm";
export type InputSource = "file" | "url" | "recording";

export interface TranscriptChunk {
  text: string;
  timestamp: [number | null, number | null];
}

export interface TranscriptRecord {
  id: string;
  title: string;
  text: string;
  chunks: TranscriptChunk[];
  createdAt: number;
  durationSeconds: number;
  source: InputSource;
  model: ModelId;
  language: string;
  task: TranscriptionTask;
  backend: Exclude<ComputeBackend, "auto">;
}

export interface TranscriptionSettings {
  model: ModelId;
  language: string;
  task: TranscriptionTask;
  backend: ComputeBackend;
}

export interface ProgressItem {
  file: string;
  progress: number;
  status: string;
}

export interface TranscriptionProgressPoint {
  completedChunks: number;
  totalChunks: number;
}

export type ModelWarmupState = "idle" | "loading" | "ready" | "error" | "skipped";
export type TranscriptionRunState =
  | "idle"
  | "decoding"
  | "loading"
  | "transcribing"
  | "saving"
  | "complete"
  | "paused";

export type WorkerRequest =
  | {
      type: "preload";
      settings: TranscriptionSettings;
    }
  | {
      type: "transcribe";
      audio: Float32Array;
      settings: TranscriptionSettings;
    }
  | { type: "dispose" };

export type WorkerResponse =
  | {
      type: "booted";
    }
  | {
      type: "progress";
      item: ProgressItem;
    }
  | {
      type: "model-ready";
      backend: Exclude<ComputeBackend, "auto">;
    }
  | {
      type: "transcription-started";
      backend: Exclude<ComputeBackend, "auto">;
      totalChunks: number;
    }
  | {
      type: "transcription-progress";
      completedChunks: number;
      totalChunks: number;
    }
  | {
      type: "partial";
      text: string;
      chunks: TranscriptChunk[];
    }
  | {
      type: "complete";
      text: string;
      chunks: TranscriptChunk[];
      backend: Exclude<ComputeBackend, "auto">;
    }
  | {
      type: "error";
      message: string;
      operation: "preload" | "transcribe";
    };
