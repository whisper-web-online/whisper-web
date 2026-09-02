import type { UiCopy, UiLocale } from "@/i18n/ui-copy";
import type { LargeFileCopy } from "@/i18n/large-file-copy";
import type { ConverterPageCopy } from "@/i18n/converter-page-copy";
import type { EditorialPage } from "./content-pages";
import type { SeoPageConfig } from "./site";
import {
  absoluteUrl,
  GITHUB_ORGANIZATION_URL,
  ORGANIZATION_ID,
  SEO_PAGES,
  SITE_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
} from "./site";

const ORGANIZATION_REFERENCE = { "@id": ORGANIZATION_ID };
const ORGANIZATION_AUTHOR = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
};

/**
 * 将当前语言工具页的可见能力和 FAQ 组装为 WebApplication 结构化数据。
 */
export function createToolPageJsonLd(locale: UiLocale, copy: UiCopy): Record<string, unknown> {
  const page = locale === "es"
    ? SEO_PAGES.spanishTool
    : locale === "ar"
      ? SEO_PAGES.arabicTool
      : SEO_PAGES.home;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        url: SITE_URL,
        email: SUPPORT_EMAIL,
        description:
          "Whisper Web develops privacy-first browser tools for local speech-to-text and media conversion.",
        sameAs: [GITHUB_ORGANIZATION_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: ["en", "es", "ar"],
        publisher: ORGANIZATION_REFERENCE,
      },
      {
        "@type": "WebApplication",
        "@id": `${absoluteUrl(page.path)}#application`,
        name: SITE_NAME,
        url: absoluteUrl(page.path),
        description: page.description,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any operating system with a modern web browser",
        browserRequirements: "JavaScript, WebAssembly, and browser audio decoding",
        inLanguage: locale,
        isAccessibleForFree: true,
        publisher: ORGANIZATION_REFERENCE,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          copy.schema.features.local,
          copy.schema.features.inputs,
          copy.schema.features.exports,
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${absoluteUrl(page.path)}#faq`,
        mainEntity: copy.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

/**
 * 将大文件页面的真实限制、导出能力和可见 FAQ 组装为结构化数据。
 */
export function createLargeFilePageJsonLd(
  locale: UiLocale,
  copy: LargeFileCopy,
): Record<string, unknown> {
  const page = locale === "es"
    ? SEO_PAGES.spanishLargeFileTranscription
    : locale === "ar"
      ? SEO_PAGES.arabicLargeFileTranscription
      : SEO_PAGES.largeFileTranscription;
  const pageUrl = absoluteUrl(page.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#application`,
        name: SITE_NAME,
        url: pageUrl,
        description: page.description,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any operating system with a modern web browser",
        browserRequirements: "JavaScript, WebAssembly, WebCodecs audio decoding, and IndexedDB",
        inLanguage: locale,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: copy.schemaFeatures,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: copy.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

/**
 * 将转换器可见限制、功能、FAQ 和面包屑组装为三语结构化数据。
 */
export function createConverterPageJsonLd(
  locale: UiLocale,
  copy: ConverterPageCopy,
): Record<string, unknown> {
  const page = locale === "es"
    ? SEO_PAGES.spanishMp4ToMp3
    : locale === "ar"
      ? SEO_PAGES.arabicMp4ToMp3
      : SEO_PAGES.mp4ToMp3;
  const pageUrl = absoluteUrl(page.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#application`,
        name: copy.toolsMenu.converter,
        url: pageUrl,
        description: page.description,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any operating system with a modern web browser",
        browserRequirements: "JavaScript, WebAssembly, WebCodecs audio decoding, and IndexedDB",
        inLanguage: locale,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          copy.trust[1],
          copy.limit,
          copy.bitrateOptions["128"],
          copy.bitrateOptions["192"],
          copy.bitrateOptions["320"],
          copy.historySaved,
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: copy.toolsMenu.converter, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: copy.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

/**
 * 生成与 speech recognition 指南可见正文一致的 Article、面包屑和 FAQ 数据。
 */
export function createSpeechRecognitionJsonLd(): Record<string, unknown> {
  const page = SEO_PAGES.speechRecognition;
  const pageUrl = absoluteUrl(page.path);
  const questions = [
    {
      question: "Does browser speech recognition upload my audio?",
      answer:
        "Not in Whisper Web local mode. The browser decodes the selected media and runs Whisper on the device, although it still downloads the application and model files.",
    },
    {
      question: "Is WebGPU required for local speech recognition?",
      answer:
        "No. Whisper Web offers WebAssembly for broad compatibility and WebGPU as an optional faster backend on supported browsers and hardware.",
    },
    {
      question: "What happens after the transcript is created?",
      answer:
        "The transcript is stored in the current browser using IndexedDB until the user exports or deletes it.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Speech Recognition in the Browser: How Local Processing Works",
        description: page.description,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        inLanguage: "en",
        datePublished: page.datePublished,
        dateModified: page.lastModified,
        author: ORGANIZATION_AUTHOR,
        publisher: ORGANIZATION_REFERENCE,
        about: ["Speech recognition", "Whisper", "WebGPU", "WebAssembly"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Speech Recognition", item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: questions.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

/**
 * 为 Use Cases 或 Blog 目录生成 CollectionPage、面包屑和可见条目列表。
 */
export function createContentHubJsonLd(
  page: SeoPageConfig,
  items: EditorialPage[],
  label: string,
): Record<string, unknown> {
  const pageUrl = absoluteUrl(page.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        name: page.openGraphTitle,
        description: page.description,
        url: pageUrl,
        inLanguage: "en",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            url: absoluteUrl(item.seo.path),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: label, item: pageUrl },
        ],
      },
    ],
  };
}

/**
 * 为隐私政策和使用条款生成 WebPage 与面包屑结构化数据。
 */
export function createLegalPageJsonLd(
  page: SeoPageConfig,
  title: string,
): Record<string, unknown> {
  const pageUrl = absoluteUrl(page.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: title,
        description: page.description,
        url: pageUrl,
        inLanguage: "en",
        dateModified: page.lastModified,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: title, item: pageUrl },
        ],
      },
    ],
  };
}

/**
 * 为场景页或 Blog 文章生成与可见正文一致的页面、面包屑和 FAQ 数据。
 */
export function createEditorialPageJsonLd(page: EditorialPage): Record<string, unknown> {
  const pageUrl = absoluteUrl(page.seo.path);
  const pageEntity = page.kind === "article"
    ? {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: page.title,
        description: page.summary,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        inLanguage: "en",
        datePublished: page.seo.datePublished,
        dateModified: page.seo.lastModified,
        author: ORGANIZATION_AUTHOR,
        publisher: ORGANIZATION_REFERENCE,
        about: page.seo.primaryKeyword,
      }
    : {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: page.title,
        description: page.summary,
        url: pageUrl,
        inLanguage: "en",
        dateModified: page.seo.lastModified,
        about: page.seo.primaryKeyword,
      };
  const hub = page.kind === "article" ? SEO_PAGES.blog : SEO_PAGES.useCases;

  return {
    "@context": "https://schema.org",
    "@graph": [
      pageEntity,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: page.kind === "article" ? "Blog" : "Use Cases",
            item: absoluteUrl(hub.path),
          },
          { "@type": "ListItem", position: 3, name: page.title, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
