import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UI_COPY } from "@/i18n/ui-copy";
import { DEFAULT_SETTINGS, SUPPORTED_MEDIA_ACCEPT } from "../model-options";
import { TranscriptionWorkspace } from "./transcription-workspace";

/**
 * 模拟指定宽度下的媒体查询结果。
 */
function mockMobileViewport(matches = true): void {
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

/**
 * 为测试环境补充浏览器滚动方法并返回调用记录。
 */
function mockScrollIntoView() {
  const scrollIntoView = vi.fn();
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: scrollIntoView,
  });
  return scrollIntoView;
}

/**
 * 使用空闲状态渲染转录输入区，便于验证纯交互行为。
 */
function renderWorkspace(overrides: Partial<ComponentProps<typeof TranscriptionWorkspace>> = {}) {
  return render(
    <TranscriptionWorkspace
      copy={UI_COPY.en}
      locale="en"
      settings={{ ...DEFAULT_SETTINGS }}
      runState="idle"
      transcriptionProgress={{ completedChunks: 0, totalChunks: 0 }}
      selectedMediaName=""
      notice=""
      warmupBackend={null}
      warmupError=""
      warmupProgress={0}
      warmupState="idle"
      onRetryWarmup={vi.fn()}
      error=""
      onStart={vi.fn()}
      onPause={vi.fn()}
      onStop={vi.fn()}
      onSettingsChange={vi.fn()}
      onMediaSelected={vi.fn(async () => undefined)}
      onUrlSelected={vi.fn(async () => undefined)}
      {...overrides}
    />,
  );
}

describe("TranscriptionWorkspace", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
  });

  /**
   * 文件模式的主区域应支持点击打开系统文件选择器。
   */
  it("点击默认文件区域时打开文件选择器", () => {
    const inputClick = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => undefined);
    renderWorkspace();

    fireEvent.click(screen.getByRole("button", { name: /drop a media file here/i }));
    fireEvent.click(screen.getByRole("button", { name: "Choose file" }));

    expect(inputClick).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: "Start transcription" })).toBeDisabled();
  });

  /**
   * 选择媒体后才允许显式开始转录。
   */
  it("选择媒体后启用开始转录按钮", () => {
    const onStart = vi.fn();
    renderWorkspace({ selectedMediaName: "meeting.mp3", onStart });

    expect(screen.getByText("meeting.mp3")).toBeInTheDocument();
    const start = screen.getByRole("button", { name: "Start transcription" });
    expect(start).toBeEnabled();
    fireEvent.click(start);

    expect(onStart).toHaveBeenCalledOnce();
  });

  /**
   * 移动端首次开始前应确认参数，确认后才触发真实转录。
   */
  it("移动端开始转录前打开设置确认层", () => {
    mockMobileViewport();
    const onStart = vi.fn();
    const onSettingsChange = vi.fn();
    renderWorkspace({
      selectedMediaName: "meeting.mp3",
      onStart,
      onSettingsChange,
    });

    fireEvent.click(screen.getByRole("button", { name: "Start transcription" }));

    const dialog = screen.getByRole("dialog", { name: "Confirm transcription settings" });
    expect(dialog).toBeInTheDocument();
    expect(onStart).not.toHaveBeenCalled();
    expect(dialog).toHaveTextContent("Review these settings before Whisper starts processing");

    fireEvent.change(within(dialog).getByRole("combobox", { name: "Model" }), {
      target: { value: "onnx-community/whisper-base" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm and start" }));

    expect(onSettingsChange).toHaveBeenCalledWith(expect.objectContaining({
      model: "onnx-community/whisper-base",
    }));
    expect(onStart).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  /**
   * 移动端出现已选媒体后应自动把开始按钮带入视口。
   */
  it("移动端选择媒体后自动定位到开始按钮", async () => {
    mockMobileViewport();
    const scrollIntoView = mockScrollIntoView();
    const { rerender } = renderWorkspace();

    rerender(
      <TranscriptionWorkspace
        copy={UI_COPY.en}
        locale="en"
        settings={{ ...DEFAULT_SETTINGS }}
        runState="idle"
        transcriptionProgress={{ completedChunks: 0, totalChunks: 0 }}
        selectedMediaName="meeting.mp3"
        notice=""
        warmupBackend={null}
        warmupError=""
        warmupProgress={0}
        warmupState="idle"
        onRetryWarmup={vi.fn()}
        error=""
        onStart={vi.fn()}
        onPause={vi.fn()}
        onStop={vi.fn()}
        onSettingsChange={vi.fn()}
        onMediaSelected={vi.fn(async () => undefined)}
        onUrlSelected={vi.fn(async () => undefined)}
      />,
    );

    await vi.waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    });
  });

  /**
   * 运行中提供真实暂停、停止和阶段进度入口。
   */
  it("运行中显示暂停停止与阶段进度", () => {
    const onPause = vi.fn();
    const onStop = vi.fn();
    renderWorkspace({
      runState: "transcribing",
      selectedMediaName: "meeting.mp3",
      onPause,
      onStop,
    });

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));

    expect(onPause).toHaveBeenCalledOnce();
    expect(onStop).toHaveBeenCalledOnce();
    expect(screen.getByText("Transcribing locally")).toBeInTheDocument();
    expect(screen.getByText("Whisper is processing your media on this device.")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "35");
  });

  /**
   * 完成态应展示 100%，并在结果页切换前隐藏所有转录控制按钮。
   */
  it("完成态显示百分百并隐藏转录控制", () => {
    renderWorkspace({
      runState: "complete",
      selectedMediaName: "meeting.mp3",
      transcriptionProgress: { completedChunks: 1, totalChunks: 1 },
    });

    expect(screen.getByText("Transcription complete")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.queryByRole("button", { name: "Start transcription" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Stop" })).not.toBeInTheDocument();
  });

  /**
   * 暂停态明确说明继续会从头开始。
   */
  it("暂停后显示从头继续提示", () => {
    renderWorkspace({
      runState: "paused",
      selectedMediaName: "meeting.mp3",
      notice: UI_COPY.en.input.pausedHint,
    });

    expect(screen.getByRole("button", { name: "Resume transcription" })).toBeEnabled();
    expect(screen.getByText(/restart this transcription from the beginning/i)).toBeInTheDocument();
    expect(screen.getByText(/resume starts again from the beginning/i)).toBeInTheDocument();
  });

  /**
   * 拖拽区应展示完整格式清单，文件选择器也只声明这些格式。
   */
  it("展示并限制为明确支持的媒体格式", () => {
    const { container } = renderWorkspace();

    expect(screen.getByText(
      "Supported formats: MP3, MP4, M4A, WAV, OGG, OPUS, WebM, AAC, FLAC",
    )).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toHaveAttribute(
      "accept",
      SUPPORTED_MEDIA_ACCEPT,
    );
  });

  /**
   * 标准上传区应提前提供大文件入口，触发限制后继续保留并强调恢复路径。
   */
  it("提供当前语言的大文件转录入口并在超限后强调", () => {
    const { rerender } = renderWorkspace();

    const link = screen.getByRole("link", { name: /use large-file transcription/i });
    expect(link).toHaveAttribute("href", "/large-file-transcription");
    expect(link.closest("aside")).not.toHaveClass("is-emphasized");

    rerender(
      <TranscriptionWorkspace
        copy={UI_COPY.en}
        locale="en"
        settings={{ ...DEFAULT_SETTINGS }}
        runState="idle"
        transcriptionProgress={{ completedChunks: 0, totalChunks: 0 }}
        selectedMediaName=""
        notice=""
        warmupBackend={null}
        warmupError=""
        warmupProgress={0}
        warmupState="idle"
        onRetryWarmup={vi.fn()}
        error={UI_COPY.en.errors.fileTooLarge}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onStop={vi.fn()}
        onSettingsChange={vi.fn()}
        onMediaSelected={vi.fn(async () => undefined)}
        onUrlSelected={vi.fn(async () => undefined)}
      />,
    );

    expect(screen.getByRole("link", { name: /use large-file transcription/i }).closest("aside"))
      .toHaveClass("is-emphasized");
    expect(screen.getByRole("alert")).toHaveTextContent("large-file page accepts local files up to 1 GB");
  });

  /**
   * 西语和阿语标准上传区应链接到各自的大文件页面。
   */
  it.each([
    ["es", UI_COPY.es, "/es/transcribir-audios-largos", /transcribir un archivo grande/i],
    ["ar", UI_COPY.ar, "/ar/large-file-transcription", /استخدم نسخ الملفات الكبيرة/],
  ] as const)("%s 界面使用本地化的大文件入口", (locale, copy, href, name) => {
    renderWorkspace({ locale, copy });

    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  });

  /**
   * 三个模式按钮只切换上方操作区，不直接触发 URL 导入或麦克风授权。
   */
  it("在上方主区域切换 URL 与录音操作", () => {
    renderWorkspace();

    fireEvent.click(screen.getByRole("button", { name: "Paste URL" }));
    expect(screen.getByRole("textbox", { name: "Paste a direct media URL" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /drop a media file here/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Record" }));
    expect(screen.getByRole("button", { name: "Start recording" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Paste a direct media URL" })).not.toBeInTheDocument();
  });

  /**
   * 直链导入失败应在当前视口显示可关闭弹窗，而不是落在工作区底部。
   */
  it("以弹窗展示直链导入错误", () => {
    renderWorkspace({ error: UI_COPY.en.errors.urlFailed });

    const dialog = screen.getByRole("alertdialog", { name: "Check your media URL" });
    expect(dialog).toHaveTextContent(UI_COPY.en.errors.urlFailed);
    expect(dialog).toHaveTextContent("https://media.example.com/interview.mp3");
    expect(dialog).toHaveTextContent("It opens without signing in or requesting access.");
    expect(dialog).not.toHaveTextContent("CORS");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  /**
   * URL 返回 HTTP 错误时也应使用相同弹窗反馈。
   */
  it("以弹窗展示直链 HTTP 错误", () => {
    renderWorkspace({ error: UI_COPY.en.errors.urlHttp.replace("{status}", "404") });

    expect(screen.getByRole("alertdialog", { name: "Check your media URL" }))
      .toHaveTextContent("HTTP 404");
  });

  /**
   * 手机端切换输入方式后应把新出现的操作区定位到视口顶部。
   */
  it("移动端切换输入方式后自动定位操作区", async () => {
    mockMobileViewport();
    const scrollIntoView = mockScrollIntoView();
    renderWorkspace();

    fireEvent.click(screen.getByRole("button", { name: "Paste URL" }));

    expect(screen.getByRole("textbox", { name: "Paste a direct media URL" })).toBeInTheDocument();
    await vi.waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    });
  });

  /**
   * 四项转写设置都应显示，并用结果导向的文案描述输出方式。
   */
  it("显示模型、音频语言、输出与计算方式设置", () => {
    renderWorkspace();

    const model = screen.getByRole("combobox", { name: "Model" });
    const audioLanguage = screen.getByRole("combobox", { name: "Audio language" });
    const output = screen.getByRole("combobox", { name: "Output language" });

    expect(model).toHaveValue("onnx-community/whisper-tiny");
    expect(model).toHaveTextContent("Whisper Tiny — Smallest download");
    expect(model).toHaveTextContent("Whisper Base — Balance of speed and detail");
    expect(model).toHaveTextContent("Whisper Small — More detail, higher device load");
    expect(output).toHaveValue("transcribe");
    expect(output).toHaveTextContent("Same as audio");
    expect(output).toHaveTextContent("English translation");
    expect(audioLanguage.querySelectorAll("option")).toHaveLength(99);
    expect(Array.from(audioLanguage.querySelectorAll("option")).slice(0, 5).map((option) => option.value))
      .toEqual(["en", "zh", "es", "ar", "hi"]);
    expect(audioLanguage.querySelectorAll("optgroup")[0]).toHaveAttribute("label", "Popular languages");
    expect(audioLanguage.querySelectorAll("optgroup")[1]).toHaveAttribute("label", "More languages");
    expect(screen.getByRole("combobox", { name: "Compute" })).toBeInTheDocument();
  });

  /**
   * 西语工具页的设置、后台准备状态和设备处理说明不得回退为英语。
   */
  it("在西语界面显示本地化的设置和模型准备状态", () => {
    renderWorkspace({
      copy: UI_COPY.es,
      locale: "es",
      warmupBackend: "wasm",
      warmupState: "ready",
    });

    expect(screen.getByRole("region", { name: "Área de transcripción local" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Procesamiento" })).toHaveTextContent(
      "WebAssembly · descarga más pequeña",
    );
    expect(screen.getByText("Motor local listo · WASM")).toBeInTheDocument();
    expect(screen.getByText(/El procesamiento se realiza en este dispositivo/)).toBeInTheDocument();
    expect(screen.queryByText(/Smaller download|Local engine ready|All inference happens/)).not.toBeInTheDocument();
  });
});
