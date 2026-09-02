import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { UI_COPY } from "@/i18n/ui-copy";
import { LARGE_FILE_COPY } from "@/i18n/large-file-copy";
import { CONVERTER_PAGE_COPY } from "@/i18n/converter-page-copy";
import { BLOG_POSTS, USE_CASE_PAGES } from "./content-pages";
import {
  absoluteUrl,
  createPageMetadata,
  CONVERTER_LANGUAGE_ALTERNATES,
  LARGE_FILE_LANGUAGE_ALTERNATES,
  SEO_PAGES,
  TOOL_LANGUAGE_ALTERNATES,
} from "./site";
import {
  createEditorialPageJsonLd,
  createConverterPageJsonLd,
  createLargeFilePageJsonLd,
  createSpeechRecognitionJsonLd,
  createToolPageJsonLd,
} from "./structured-data";

/**
 * 返回页面矩阵中允许进入索引的配置。
 */
function indexablePages() {
  return Object.values(SEO_PAGES).filter((page) => page.indexable);
}

describe("SEO 页面矩阵", () => {
  it("使用指定的首页 SEO Title", () => {
    expect(SEO_PAGES.home.title).toBe(
      "Transcribe audio and video privately with Whisper Web.",
    );
    expect(createPageMetadata(SEO_PAGES.home).title).toBe(SEO_PAGES.home.title);
  });

  it("在三种语言的首页 Description 中说明支持 99+ 种语言", () => {
    expect(SEO_PAGES.home.description).toBe(
      "Transcribe audio, video and recordings in 99+ languages locally with Whisper Web. Free, private, with no media upload or account.",
    );
    expect(SEO_PAGES.spanishTool.description).toBe(
      "Transcribe audio, vídeo y grabaciones en 99+ idiomas de forma local con Whisper Web. Gratis, privado, sin subir archivos ni crear una cuenta.",
    );
    expect(SEO_PAGES.arabicTool.description).toBe(
      "حوّل الصوت والفيديو والتسجيلات إلى نص بـ99+ لغة محليًا مع Whisper Web. مجانًا وبخصوصية، دون رفع الوسائط أو إنشاء حساب.",
    );

    for (const page of [SEO_PAGES.home, SEO_PAGES.spanishTool, SEO_PAGES.arabicTool]) {
      expect(page.description.length).toBeLessThanOrEqual(150);
      expect(createPageMetadata(page).description).toBe(page.description);
    }
  });

  it("为二十四个可索引页面分配唯一主关键词和唯一 URL", () => {
    const pages = indexablePages();
    const keywords = pages.map((page) => page.primaryKeyword);
    const paths = pages.map((page) => page.path);

    expect(pages).toHaveLength(24);
    expect(new Set(keywords).size).toBe(keywords.length);
    expect(new Set(paths).size).toBe(paths.length);
    expect(keywords).not.toContain(null);
    expect(keywords).toEqual(expect.arrayContaining([
      "Whisper Web",
      "meeting transcription without bots",
      "voice memo to text",
      "private interview transcription",
      "private podcast transcription",
      "transcribe audio without uploading",
      "local vs cloud transcription",
      "WebGPU vs WebAssembly transcription",
      "SRT vs VTT",
      "how to transcribe large audio files",
      "how to convert MP4 to MP3",
      "transcribir audio a texto",
      "speech recognition",
      "large file transcription",
      "transcribir audios largos",
      "Whisper Web privacy policy",
      "Whisper Web terms of use",
      "mp4 to mp3 converter",
      "convertir mp4 a mp3",
      "تحويل MP4 إلى MP3",
      "تحويل الصوت إلى نص",
      "تحويل ملف صوتي طويل إلى نص",
    ]));
  });

  it("让每个公开页面使用自引用 canonical 和明确的索引状态", () => {
    for (const page of Object.values(SEO_PAGES)) {
      const metadata = createPageMetadata(page);
      expect(metadata.alternates?.canonical).toBe(page.path);
      expect((metadata.robots as { index?: boolean }).index).toBe(page.indexable);
    }

    expect(SEO_PAGES.arabicTool.indexable).toBe(true);
    expect(SEO_PAGES.arabicTool.primaryKeyword).toBe("تحويل الصوت إلى نص");
    expect(SEO_PAGES.arabicLargeFileTranscription.indexable).toBe(true);
    expect(SEO_PAGES.arabicLargeFileTranscription.primaryKeyword).toBe(
      "تحويل ملف صوتي طويل إلى نص",
    );
    expect(SEO_PAGES.arabicMp4ToMp3.indexable).toBe(true);
    expect(SEO_PAGES.arabicMp4ToMp3.primaryKeyword).toBe("تحويل MP4 إلى MP3");
  });

  it("把三种语言的等价工具页放入 hreflang", () => {
    expect(TOOL_LANGUAGE_ALTERNATES).toEqual({
      en: "/",
      es: "/es/transcribir-audio-a-texto",
      ar: "/ar",
      "x-default": "/",
    });
    expect(LARGE_FILE_LANGUAGE_ALTERNATES).toEqual({
      en: "/large-file-transcription",
      es: "/es/transcribir-audios-largos",
      ar: "/ar/large-file-transcription",
      "x-default": "/large-file-transcription",
    });
    expect(CONVERTER_LANGUAGE_ALTERNATES).toEqual({
      en: "/mp4-to-mp3",
      es: "/es/convertir-mp4-a-mp3",
      ar: "/ar/mp4-to-mp3",
      "x-default": "/mp4-to-mp3",
    });
  });

  it("让 sitemap 只包含可索引 canonical URL，且不重复输出页面级 hreflang", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    const spanishToolEntry = entries.find(
      (entry) => entry.url === absoluteUrl(SEO_PAGES.spanishTool.path),
    );
    const arabicToolEntry = entries.find(
      (entry) => entry.url === absoluteUrl(SEO_PAGES.arabicTool.path),
    );

    expect(urls).toEqual(indexablePages().map((page) => absoluteUrl(page.path)));
    expect(entries.every((entry) => entry.alternates === undefined)).toBe(true);
    expect(urls).toContain(absoluteUrl("/ar"));
    expect(urls).toContain(absoluteUrl("/ar/large-file-transcription"));
    expect(urls).toContain(absoluteUrl("/ar/mp4-to-mp3"));
    expect(spanishToolEntry?.lastModified).toBe("2026-09-02");
    expect(arabicToolEntry?.lastModified).toBe("2026-09-02");
    expect(urls).toEqual(expect.arrayContaining([
      absoluteUrl("/privacy"),
      absoluteUrl("/terms"),
    ]));
  });

  it("在 robots 中允许读取公开页面、禁止抓取 Cloudflare 内部路径并声明 sitemap", () => {
    const value = robots();

    expect(value.rules).toEqual([
      { userAgent: "*", allow: "/", disallow: "/cdn-cgi/" },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: "/cdn-cgi/" },
      { userAgent: "GPTBot", allow: "/", disallow: "/cdn-cgi/" },
    ]);
    expect(value.sitemap).toBe(absoluteUrl("/sitemap.xml"));
    expect(value.host).toBeUndefined();
  });
});

describe("本地化 SEO 内容", () => {
  it("为三种语言的工具页输出对应主关键词 H1 文案", () => {
    expect(UI_COPY.en.hero.title).toContain("Whisper Web");
    expect(UI_COPY.es.hero.title.toLowerCase()).toContain("transcribir audio a texto");
    expect(LARGE_FILE_COPY.ar.title).toContain("ملفًا صوتيًا أو فيديو طويلًا");
  });

  it("让三种语言的可见 FAQ 与结构化数据逐项一致", () => {
    for (const locale of ["en", "es", "ar"] as const) {
      const data = createToolPageJsonLd(locale, UI_COPY[locale]);
      const graph = data["@graph"] as Array<Record<string, unknown>>;
      const faq = graph.find((item) => item["@type"] === "FAQPage");

      expect(faq?.mainEntity).toHaveLength(UI_COPY[locale].faq.items.length);
      expect(UI_COPY[locale].faq.items).toHaveLength(5);
      expect(UI_COPY[locale].faq.items.some((item) => item.answer.includes("99"))).toBe(true);
      expect(UI_COPY[locale].faq.items.at(-1)?.link?.href).toBeTruthy();
      expect(UI_COPY[locale].faq.items.every((item) => item.question && item.answer)).toBe(true);
    }
  });

  it("让三种语言的大文件页 FAQ 与结构化数据逐项一致", () => {
    for (const locale of ["en", "es", "ar"] as const) {
      const data = createLargeFilePageJsonLd(locale, LARGE_FILE_COPY[locale]);
      const graph = data["@graph"] as Array<Record<string, unknown>>;
      const faq = graph.find((item) => item["@type"] === "FAQPage");

      expect(LARGE_FILE_COPY[locale].faq).toHaveLength(5);
      expect(faq?.mainEntity).toHaveLength(LARGE_FILE_COPY[locale].faq.length);
    }
  });

  it("让三种语言的转换器 FAQ、WebApplication 和面包屑保持一致", () => {
    for (const locale of ["en", "es", "ar"] as const) {
      const data = createConverterPageJsonLd(locale, CONVERTER_PAGE_COPY[locale]);
      const graph = data["@graph"] as Array<Record<string, unknown>>;
      const application = graph.find((item) => item["@type"] === "WebApplication");
      const faq = graph.find((item) => item["@type"] === "FAQPage");
      const breadcrumbs = graph.find((item) => item["@type"] === "BreadcrumbList");

      expect(application?.inLanguage).toBe(locale);
      expect(faq?.mainEntity).toHaveLength(CONVERTER_PAGE_COPY[locale].faq.length);
      expect(CONVERTER_PAGE_COPY[locale].faq).toHaveLength(5);
      expect(breadcrumbs?.itemListElement).toHaveLength(2);
    }
  });
});

describe("英语内容扩页", () => {
  it("为每个场景页和 Blog 文章提供独立正文、FAQ 与自引用 canonical", () => {
    const contentPages = [...USE_CASE_PAGES, ...BLOG_POSTS];

    expect(contentPages).toHaveLength(10);
    for (const page of contentPages) {
      expect(page.sections.length).toBeGreaterThanOrEqual(3);
      expect(page.faq.length).toBeGreaterThanOrEqual(3);
      expect(createPageMetadata(page.seo).alternates?.canonical).toBe(page.seo.path);
    }
  });

  it("让内容页可见 FAQ 与结构化数据逐项一致", () => {
    for (const page of [...USE_CASE_PAGES, ...BLOG_POSTS]) {
      const data = createEditorialPageJsonLd(page);
      const graph = data["@graph"] as Array<Record<string, unknown>>;
      const faq = graph.find((item) => item["@type"] === "FAQPage");

      expect(faq?.mainEntity).toHaveLength(page.faq.length);
    }
  });

  it("让 Blog 和 speech recognition 的文章作者与日期保持完整", () => {
    const articles = [
      ...BLOG_POSTS.map((page) => ({ data: createEditorialPageJsonLd(page), seo: page.seo })),
      { data: createSpeechRecognitionJsonLd(), seo: SEO_PAGES.speechRecognition },
    ];

    for (const { data, seo } of articles) {
      const graph = data["@graph"] as Array<Record<string, unknown>>;
      const article = graph.find((item) => item["@type"] === "Article");
      const author = article?.author as Record<string, unknown>;

      expect(author).toMatchObject({ "@type": "Organization", name: "Whisper Web" });
      expect(article?.datePublished).toBe(seo.datePublished);
      expect(article?.dateModified).toBe(seo.lastModified);
    }
  });

  it("让大文件指南覆盖两个工具入口和完整决策内容", () => {
    const page = BLOG_POSTS.find((item) => item.seo === SEO_PAGES.transcribeLargeFilesGuide);

    expect(page?.sections).toHaveLength(7);
    expect(page?.faq).toHaveLength(6);
    expect(page?.callToAction?.primary.href).toBe("/large-file-transcription");
    expect(page?.callToAction?.secondary?.href).toBe("/");
  });

  it("让 MP4 to MP3 指南覆盖转换决策、限制和工具入口", () => {
    const page = BLOG_POSTS.find((item) => item.seo === SEO_PAGES.convertMp4ToMp3Guide);

    expect(page?.sections).toHaveLength(8);
    expect(page?.faq).toHaveLength(8);
    expect(page?.callToAction?.primary.href).toBe("/mp4-to-mp3");
    expect(page?.callToAction?.secondary?.href).toBe("/");
    expect(page?.sections.find((section) => section.id === "bitrate")?.table?.rows)
      .toHaveLength(3);
  });

  it("只给相关技术段落配置 HTTPS 一手来源", () => {
    const sourcedSections = BLOG_POSTS.flatMap((page) => page.sections)
      .filter((section) => section.sources?.length);

    expect(sourcedSections.length).toBeGreaterThanOrEqual(3);
    expect(sourcedSections.flatMap((section) => section.sources ?? []).every(
      (source) => source.href.startsWith("https://"),
    )).toBe(true);
  });
});
