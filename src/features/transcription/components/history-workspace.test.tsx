import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UI_COPY } from "@/i18n/ui-copy";
import type { TranscriptRecord } from "../contracts";
import { HistoryWorkspace } from "./history-workspace";

const record: TranscriptRecord = {
  id: "record-1",
  title: "meeting.mp3",
  text: "Full editable transcript",
  chunks: [{ text: "First timeline segment", timestamp: [0, 2.5] }],
  createdAt: 1_700_000_000_000,
  durationSeconds: 2.5,
  source: "file",
  model: "onnx-community/whisper-tiny",
  language: "en",
  task: "transcribe",
  backend: "wasm",
};

/**
 * 使用一条带时间戳的记录渲染历史工作区。
 */
function renderHistoryWorkspace() {
  return render(
    <HistoryWorkspace
      copy={UI_COPY.en}
      locale="en"
      records={[record]}
      selectedId={record.id}
      activeMediaUrl=""
      onSelect={vi.fn()}
      onUpdate={vi.fn(async () => undefined)}
      onDelete={vi.fn(async () => undefined)}
    />,
  );
}

describe("HistoryWorkspace", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  /**
   * 历史详情默认从时间戳标签进入，并允许切回全文编辑。
   */
  it("默认显示时间戳并允许切换到文本编辑", () => {
    renderHistoryWorkspace();

    const tabs = within(screen.getByRole("tablist")).getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Timestamps", "Edit text"]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("First timeline segment")).toBeInTheDocument();
    expect(screen.getByText("Output language")).toBeInTheDocument();
    expect(screen.getByText("Same as audio")).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Editable transcript" })).not.toBeInTheDocument();

    fireEvent.click(tabs[1]);
    expect(screen.getByRole("textbox", { name: "Editable transcript" })).toHaveValue("Full editable transcript");
  });
});
