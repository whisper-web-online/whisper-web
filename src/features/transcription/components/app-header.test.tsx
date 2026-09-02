import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UI_COPY } from "@/i18n/ui-copy";
import { AppHeader } from "./app-header";

describe("AppHeader 本地导航", () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState(null, "", "/");
    vi.restoreAllMocks();
  });

  /**
   * replaceState 后必须通知 hash 订阅者，避免 URL 与当前视图分离。
   */
  it("在 History 与 Transcribe 之间切换时派发地址片段事件", () => {
    const onHashChange = vi.fn();
    const onViewChange = vi.fn();
    window.addEventListener("hashchange", onHashChange);
    render(
      <AppHeader
        copy={UI_COPY.en}
        locale="en"
        view="transcribe"
        onViewChange={onViewChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "History" }));
    expect(window.location.hash).toBe("#history");
    expect(onViewChange).toHaveBeenLastCalledWith("history");

    const primaryNavigation = screen.getByRole("navigation", { name: "Primary navigation" });
    fireEvent.click(within(primaryNavigation).getByRole("link", { name: "Transcribe" }));
    expect(window.location.hash).toBe("");
    expect(onViewChange).toHaveBeenLastCalledWith("transcribe");
    expect(onHashChange).toHaveBeenCalledTimes(2);
    window.removeEventListener("hashchange", onHashChange);
  });

  /**
   * Tools 触发器必须支持 Enter、Space 与 Escape，并在关闭后保留焦点。
   */
  it("支持键盘展开和关闭 Tools 菜单", () => {
    render(
      <AppHeader
        copy={UI_COPY.en}
        locale="en"
        view="transcribe"
        onViewChange={vi.fn()}
      />,
    );
    const tools = screen.getByRole("button", { name: "Tools" });

    fireEvent.keyDown(tools, { key: "Enter" });
    expect(tools).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(tools).toHaveAttribute("aria-expanded", "false");
    expect(tools).toHaveFocus();

    fireEvent.keyDown(tools, { key: " " });
    expect(tools).toHaveAttribute("aria-expanded", "true");
  });

  /**
   * 移动端功能菜单应覆盖主要入口，并在用户选择入口后自动收起。
   */
  it("展开移动端功能菜单并在选择入口后关闭", () => {
    const { container } = render(
      <AppHeader
        copy={UI_COPY.en}
        locale="en"
        view="transcribe"
        onViewChange={vi.fn()}
      />,
    );

    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(container.querySelector(".locale-label-short")).toHaveTextContent("EN");
    const details = container.querySelector<HTMLDetailsElement>(".mobile-navigation");
    const trigger = details?.querySelector("summary");
    if (!details || !trigger) throw new Error("移动端功能菜单未渲染");
    fireEvent.click(trigger);

    expect(details).toHaveAttribute("open");
    expect(within(mobileNavigation).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Transcribe",
      "Large-file transcription",
      "MP4 to MP3",
      "History",
      "Guide",
    ]);
    expect(within(mobileNavigation).getByRole("link", { name: "MP4 to MP3" })).toHaveAttribute("href", "/mp4-to-mp3");

    fireEvent.click(within(mobileNavigation).getByRole("link", { name: "History" }));
    expect(details).not.toHaveAttribute("open");
    expect(trigger).toHaveAttribute("aria-label", "Navigation menu");
  });
});
