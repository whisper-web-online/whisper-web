import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { UI_COPY } from "@/i18n/ui-copy";
import { BLOG_POSTS, USE_CASE_PAGES } from "@/lib/seo/content-pages";
import { EditorialPage } from "./editorial-page";
import { LandingSections } from "./landing-sections";
import { SpeechRecognitionGuide } from "./speech-recognition-guide";

describe("GEO 内容语义", () => {
  afterEach(cleanup);

  it("让三语首页使用自然问题、有序步骤和网络边界表", () => {
    for (const locale of ["en", "es", "ar"] as const) {
      const { container, unmount } = render(<LandingSections copy={UI_COPY[locale]} locale={locale} />);
      const table = screen.getByRole("table", { name: UI_COPY[locale].trust.tableCaption });

      expect(UI_COPY[locale].workflowHeading).toMatch(/[?؟]$/);
      expect(UI_COPY[locale].trust.title).toMatch(/[?؟]$/);
      expect(container.querySelectorAll("ol.workflow-strip > li")).toHaveLength(3);
      expect(within(table).getAllByRole("row")).toHaveLength(UI_COPY[locale].trust.tableRows.length + 1);
      const sources = screen.getByRole("complementary", { name: UI_COPY[locale].trust.sources.title });
      expect(sources.querySelectorAll("cite")).toHaveLength(UI_COPY[locale].trust.sources.items.length);
      expect(within(sources).getByRole("link", { name: UI_COPY[locale].trust.sources.items[0].label }))
        .toHaveAttribute("href", "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API");
      expect(within(sources).getByRole("link", {
        name: UI_COPY[locale].trust.sources.items[UI_COPY[locale].trust.sources.items.length - 1].label,
      })).toHaveAttribute("href", "/privacy");
      unmount();
    }
  });

  it("让内容要点使用列表，并为文章显示作者和语义日期", () => {
    const { container, rerender } = render(<EditorialPage page={USE_CASE_PAGES[0]} />);

    expect(container.querySelector("ul.editorial-points")).toBeInTheDocument();

    rerender(<EditorialPage page={BLOG_POSTS[0]} />);
    expect(container.querySelector(".content-byline")).toHaveTextContent("By Whisper Web");
    expect(container.querySelectorAll("time[datetime]")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "MDN: IndexedDB API" })).toHaveAttribute(
      "href",
      "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
    );
  });

  it("让大文件指南在首屏和结尾提供标准与大文件入口", () => {
    const page = BLOG_POSTS.find((item) => item.slug === "how-to-transcribe-large-audio-files");
    if (!page) throw new Error("缺少大文件转录指南测试数据");

    render(<EditorialPage page={page} />);

    expect(screen.getAllByRole("link", { name: /open the large-file tool/i })
      .filter((link) => link.classList.contains("guide-cta"))).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /use standard transcription/i })
      .filter((link) => link.classList.contains("guide-cta"))).toHaveLength(2);
    expect(screen.getByRole("table", {
      name: "Standard and large-file transcription limits in Whisper Web",
    })).toBeInTheDocument();
  });

  it("让 MP4 to MP3 指南输出双位置工具 CTA 和码率决策表", () => {
    const page = BLOG_POSTS.find((item) => item.slug === "how-to-convert-mp4-to-mp3");
    if (!page) throw new Error("缺少 MP4 to MP3 指南测试数据");

    render(<EditorialPage page={page} />);

    expect(screen.getAllByRole("link", { name: /open the mp4 to mp3 converter/i })
      .filter((link) => link.classList.contains("guide-cta"))).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /transcribe audio or video instead/i })
      .filter((link) => link.classList.contains("guide-cta"))).toHaveLength(2);
    expect(screen.getByRole("table", {
      name: "MP3 bitrate choices and approximate output sizes",
    })).toBeInTheDocument();
    expect(screen.getByRole("heading", {
      name: "Why can an MP4 file fail even when the extension is supported?",
    })).toBeInTheDocument();
  });

  it("让 speech recognition 指南输出问句标题、日期、表格语义和就近来源", () => {
    const { container } = render(<SpeechRecognitionGuide />);
    const table = screen.getByRole("table", {
      name: "Local browser and typical cloud speech recognition compared",
    });

    expect(screen.getByRole("heading", { name: "How does local speech recognition work?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What are the privacy and compatibility limits?" })).toBeInTheDocument();
    expect(container.querySelectorAll("time[datetime]")).toHaveLength(2);
    expect(within(table).getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "MDN: WebGPU API" })).toHaveAttribute(
      "href",
      "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API",
    );
  });
});
