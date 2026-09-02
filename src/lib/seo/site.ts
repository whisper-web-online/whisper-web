import type { Metadata } from "next";

export const SITE_NAME = "Whisper Web";
export const SITE_URL = "https://whisperwebfree.com";
export const SUPPORT_EMAIL = "support@whisperwebfree.com";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const GITHUB_ORGANIZATION_URL = "https://github.com/whisper-web-online";
export const SOURCE_REPOSITORY_URL = `${GITHUB_ORGANIZATION_URL}/whisper-web`;
export const PRODUCT_HUNT_PRODUCT_URL =
  "https://www.producthunt.com/products/whisper-web-4?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-whisper-web-3";
export const PRODUCT_HUNT_BADGE_URL =
  "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1238964&theme=light&t=1788320994581";

export type SeoLocale = "en" | "es" | "ar";

export interface SeoPageConfig {
  path: string;
  locale: SeoLocale;
  primaryKeyword: string | null;
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  indexable: boolean;
  pageType: "website" | "article";
  datePublished?: string;
  lastModified?: string;
}

export const SEO_PAGES = {
  home: {
    path: "/",
    locale: "en",
    primaryKeyword: "Whisper Web",
    title: "Transcribe audio and video privately with Whisper Web.",
    description:
      "Transcribe audio, video and recordings in 99+ languages locally with Whisper Web. Free, private, with no media upload or account.",
    openGraphTitle: "Whisper Web: Private Speech-to-Text in Your Browser",
    openGraphDescription:
      "Transcribe audio and video locally with Whisper. Your media stays on your device.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-02",
  },
  useCases: {
    path: "/use-cases",
    locale: "en",
    primaryKeyword: "browser transcription use cases",
    title: "Private Transcription Use Cases | Whisper Web",
    description:
      "Choose a local browser transcription workflow for meetings, voice memos, interviews or podcasts, with clear limits and no media upload.",
    openGraphTitle: "Private Browser Transcription by Use Case",
    openGraphDescription:
      "Find the right local workflow for meetings, voice memos, interviews and podcasts.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-08-30",
  },
  meetingTranscription: {
    path: "/use-cases/meeting-transcription-without-bots",
    locale: "en",
    primaryKeyword: "meeting transcription without bots",
    title: "Meeting Transcription Without Bots | Whisper Web",
    description:
      "Transcribe a saved Zoom, Teams or Meet recording locally in your browser. No meeting bot joins the call, and the recording is not uploaded.",
    openGraphTitle: "Meeting Transcription Without Bots or Uploads",
    openGraphDescription:
      "A practical local workflow for turning saved meeting recordings into editable text.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  voiceMemoToText: {
    path: "/use-cases/voice-memo-to-text",
    locale: "en",
    primaryKeyword: "voice memo to text",
    title: "Voice Memo to Text in Your Browser | Whisper Web",
    description:
      "Turn a voice memo into editable text locally in your browser. Import a supported recording, review timestamps and export TXT, SRT, VTT or JSON.",
    openGraphTitle: "Turn a Voice Memo into Text Locally",
    openGraphDescription:
      "Convert supported voice recordings to editable text without sending the audio to Whisper Web.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  interviewTranscription: {
    path: "/use-cases/private-interview-transcription",
    locale: "en",
    primaryKeyword: "private interview transcription",
    title: "Private Interview Transcription | Whisper Web",
    description:
      "Transcribe a recorded research, journalism or user interview on your device. Review the text locally and export only the result you choose to share.",
    openGraphTitle: "Private Interview Transcription in the Browser",
    openGraphDescription:
      "A local workflow for recorded interviews, quote review and timestamped exports.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  podcastTranscription: {
    path: "/use-cases/private-podcast-transcription",
    locale: "en",
    primaryKeyword: "private podcast transcription",
    title: "Private Podcast Transcription | Whisper Web",
    description:
      "Turn a podcast recording into editable text and subtitle files in your browser. Use timestamps for review, show notes and caption preparation.",
    openGraphTitle: "Private Podcast Transcription for Show Notes and Captions",
    openGraphDescription:
      "Process a supported episode locally, then export text, timestamps or subtitle files.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  blog: {
    path: "/blog",
    locale: "en",
    primaryKeyword: "speech to text guides",
    title: "Speech-to-Text Guides and Comparisons | Whisper Web",
    description:
      "Practical guides to private transcription, large-file workflows, MP4-to-MP3 conversion, browser compute and subtitle exports.",
    openGraphTitle: "Whisper Web Speech-to-Text Guides",
    openGraphDescription:
      "Clear answers about local transcription, long recordings, MP4-to-MP3 conversion, browser compute and subtitle formats.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  transcribeWithoutUploading: {
    path: "/blog/transcribe-audio-without-uploading",
    locale: "en",
    primaryKeyword: "transcribe audio without uploading",
    title: "How to Transcribe Audio Without Uploading It | Whisper Web",
    description:
      "Learn how local browser transcription removes the media-upload step, what still downloads over the network and how to review the result safely.",
    openGraphTitle: "How to Transcribe Audio Without Uploading It",
    openGraphDescription:
      "A precise local workflow, including network boundaries, browser storage and export choices.",
    indexable: true,
    pageType: "article",
    datePublished: "2026-08-30",
    lastModified: "2026-09-01",
  },
  localVsCloud: {
    path: "/blog/local-vs-cloud-transcription",
    locale: "en",
    primaryKeyword: "local vs cloud transcription",
    title: "Local vs Cloud Transcription: Privacy and Limits | Whisper Web",
    description:
      "Compare where audio is processed, what must be uploaded, how speed is determined and which transcription workflow fits sensitive or long recordings.",
    openGraphTitle: "Local vs Cloud Transcription",
    openGraphDescription:
      "Compare privacy boundaries, compute, file limits, collaboration and recovery before choosing a workflow.",
    indexable: true,
    pageType: "article",
    datePublished: "2026-08-30",
    lastModified: "2026-09-01",
  },
  webgpuVsWebassembly: {
    path: "/blog/webgpu-vs-webassembly-whisper",
    locale: "en",
    primaryKeyword: "WebGPU vs WebAssembly transcription",
    title: "WebGPU vs WebAssembly for Local Whisper | Whisper Web",
    description:
      "Compare WebGPU and WebAssembly for local Whisper transcription, including compatibility, model loading, device load and when to use the fallback.",
    openGraphTitle: "WebGPU vs WebAssembly for Local Whisper",
    openGraphDescription:
      "Choose a browser compute backend based on compatibility and device behavior, not marketing claims.",
    indexable: true,
    pageType: "article",
    datePublished: "2026-08-30",
    lastModified: "2026-09-01",
  },
  srtVsVtt: {
    path: "/blog/srt-vs-vtt-subtitle-format",
    locale: "en",
    primaryKeyword: "SRT vs VTT",
    title: "SRT vs VTT: Which Subtitle Format Should You Export? | Whisper Web",
    description:
      "Compare SRT and WebVTT structure, player support and web features, then choose the right subtitle export for video editing or the browser.",
    openGraphTitle: "SRT vs VTT: Choose the Right Subtitle Export",
    openGraphDescription:
      "A practical format comparison for editors, web players and transcript workflows.",
    indexable: true,
    pageType: "article",
    datePublished: "2026-08-30",
    lastModified: "2026-09-01",
  },
  transcribeLargeFilesGuide: {
    path: "/blog/how-to-transcribe-large-audio-files",
    locale: "en",
    primaryKeyword: "how to transcribe large audio files",
    title: "How to Transcribe Large Audio and Video Files | Whisper Web",
    description:
      "Plan a reliable large-file transcription: choose the right Whisper Web tool, prepare the device, understand local processing and recover from common interruptions.",
    openGraphTitle: "How to Transcribe a Large Audio or Video File",
    openGraphDescription:
      "Choose between standard and large-file transcription, prepare for a long local job and review the saved result.",
    indexable: true,
    pageType: "article",
    datePublished: "2026-09-01",
    lastModified: "2026-09-01",
  },
  convertMp4ToMp3Guide: {
    path: "/blog/how-to-convert-mp4-to-mp3",
    locale: "en",
    primaryKeyword: "how to convert MP4 to MP3",
    title: "How to Convert MP4 to MP3 in Your Browser | Whisper Web",
    description:
      "Convert MP4, MOV or WebM video to MP3 locally in your browser. Compare 128, 192 and 320 kbps, understand codec limits and save the result safely.",
    openGraphTitle: "How to Convert MP4 to MP3 in Your Browser",
    openGraphDescription:
      "A detailed local workflow for choosing MP3 quality, checking compatibility, protecting privacy and troubleshooting conversion errors.",
    indexable: true,
    pageType: "article",
    datePublished: "2026-09-01",
    lastModified: "2026-09-01",
  },
  privacy: {
    path: "/privacy",
    locale: "en",
    primaryKeyword: "Whisper Web privacy policy",
    title: "Privacy Policy | Whisper Web",
    description:
      "Read how Whisper Web handles local media, browser transcripts, model downloads, direct media URLs, support emails and ordinary website requests.",
    openGraphTitle: "Whisper Web Privacy Policy",
    openGraphDescription:
      "A clear account of what stays on your device, what crosses the network and the choices available to you.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  terms: {
    path: "/terms",
    locale: "en",
    primaryKeyword: "Whisper Web terms of use",
    title: "Terms of Use | Whisper Web",
    description:
      "Read the terms for using Whisper Web, including local processing, user responsibilities, transcription accuracy, third-party resources and liability limits.",
    openGraphTitle: "Whisper Web Terms of Use",
    openGraphDescription:
      "The rules, responsibilities and service limits that apply when you use Whisper Web.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  mp4ToMp3: {
    path: "/mp4-to-mp3",
    locale: "en",
    primaryKeyword: "mp4 to mp3 converter",
    title: "MP4 to MP3 Converter: Private and Local | Whisper Web",
    description:
      "Convert an MP4, MOV or WebM video to MP3 in your browser. No account or media upload, with 128, 192 or 320 kbps output and local 30-day history.",
    openGraphTitle: "Convert MP4 to MP3 Privately in Your Browser",
    openGraphDescription:
      "Extract the main audio track locally and download a 128, 192 or 320 kbps MP3 without uploading the video.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  spanishMp4ToMp3: {
    path: "/es/convertir-mp4-a-mp3",
    locale: "es",
    primaryKeyword: "convertir mp4 a mp3",
    title: "Convertir MP4 a MP3 gratis y en privado | Whisper Web",
    description:
      "Convierte vídeos MP4, MOV o WebM a MP3 en tu navegador. Sin cuenta ni subida, con salida a 128, 192 o 320 kbps e historial local de 30 días.",
    openGraphTitle: "Convertir MP4 a MP3 de forma privada",
    openGraphDescription:
      "Extrae el audio principal en tu dispositivo y descarga un MP3 sin subir el vídeo.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  arabicMp4ToMp3: {
    path: "/ar/mp4-to-mp3",
    locale: "ar",
    primaryKeyword: "تحويل MP4 إلى MP3",
    title: "تحويل MP4 إلى MP3 بخصوصية في المتصفح | Whisper Web",
    description:
      "حوّل فيديو MP4 أو MOV أو WebM إلى MP3 داخل متصفحك، من دون حساب أو رفع الوسائط، وبجودة 128 أو 192 أو 320 kbps.",
    openGraphTitle: "تحويل MP4 إلى MP3 محليًا وبخصوصية",
    openGraphDescription:
      "استخرج المسار الصوتي الرئيسي على جهازك ونزّل MP3 من دون رفع الفيديو.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-01",
  },
  largeFileTranscription: {
    path: "/large-file-transcription",
    locale: "en",
    primaryKeyword: "large file transcription",
    title: "Large File Transcription in Your Browser | Whisper Web",
    description:
      "Transcribe a local audio or video file up to 1 GB and 1 hour in browser-sized sections, with device heat guidance and a live reference time estimate.",
    openGraphTitle: "Transcribe a Large File Locally with Whisper Web",
    openGraphDescription:
      "Process a large audio or video file in sections on your device, then edit or export the saved transcript.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-08-30",
  },
  spanishLargeFileTranscription: {
    path: "/es/transcribir-audios-largos",
    locale: "es",
    primaryKeyword: "transcribir audios largos",
    title: "Transcribir audios largos y archivos grandes | Whisper Web",
    description:
      "Transcribe en tu navegador un archivo local de audio o vídeo de hasta 1 GB y 1 hora, con procesamiento por secciones y una estimación orientativa del tiempo.",
    openGraphTitle: "Transcribir audios largos en tu dispositivo",
    openGraphDescription:
      "Procesa archivos grandes por secciones, sin subirlos, y guarda el resultado en el historial local.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-08-30",
  },
  arabicLargeFileTranscription: {
    path: "/ar/large-file-transcription",
    locale: "ar",
    primaryKeyword: "تحويل ملف صوتي طويل إلى نص",
    title: "تحويل ملف صوتي طويل إلى نص محليًا | Whisper Web",
    description:
      "حوّل ملفًا صوتيًا أو فيديو طويلًا إلى نص محليًا حتى 1 غيغابايت وساعة واحدة، مع تقسيم المعالجة وتقدير استرشادي للوقت.",
    openGraphTitle: "تحويل ملف صوتي طويل إلى نص محليًا",
    openGraphDescription:
      "معالجة ملف صوتي أو فيديو كبير على جهازك مع تقدير استرشادي للوقت.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-02",
  },
  spanishTool: {
    path: "/es/transcribir-audio-a-texto",
    locale: "es",
    primaryKeyword: "transcribir audio a texto",
    title: "Transcribir audio a texto gratis y en privado | Whisper Web",
    description:
      "Transcribe audio, vídeo y grabaciones en 99+ idiomas de forma local con Whisper Web. Gratis, privado, sin subir archivos ni crear una cuenta.",
    openGraphTitle: "Transcribir audio a texto gratis en tu navegador",
    openGraphDescription:
      "Convierte audio y vídeo en texto con procesamiento local y privado.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-02",
  },
  speechRecognition: {
    path: "/speech-recognition",
    locale: "en",
    primaryKeyword: "speech recognition",
    title: "Speech Recognition in the Browser: How It Works | Whisper Web",
    description:
      "Learn how browser speech recognition turns audio into text locally, how Whisper uses WebGPU or WebAssembly, and where privacy and compatibility limits apply.",
    openGraphTitle: "Speech Recognition in the Browser: How It Works",
    openGraphDescription:
      "A practical guide to local Whisper processing, privacy, browser compute and model choices.",
    indexable: true,
    pageType: "article",
    datePublished: "2026-08-30",
    lastModified: "2026-09-01",
  },
  arabicTool: {
    path: "/ar",
    locale: "ar",
    primaryKeyword: "تحويل الصوت إلى نص",
    title: "تحويل الصوت إلى نص محليًا | Whisper Web",
    description:
      "حوّل الصوت والفيديو والتسجيلات إلى نص بـ99+ لغة محليًا مع Whisper Web. مجانًا وبخصوصية، دون رفع الوسائط أو إنشاء حساب.",
    openGraphTitle: "تحويل الصوت إلى نص داخل المتصفح",
    openGraphDescription: "نسخ محلي وخاص باستخدام Whisper دون رفع ملفات الوسائط.",
    indexable: true,
    pageType: "website",
    lastModified: "2026-09-02",
  },
} as const satisfies Record<string, SeoPageConfig>;

export const LOCALE_PATHS: Record<SeoLocale, string> = {
  en: SEO_PAGES.home.path,
  es: SEO_PAGES.spanishTool.path,
  ar: SEO_PAGES.arabicTool.path,
};

export const TOOL_LANGUAGE_ALTERNATES = {
  en: SEO_PAGES.home.path,
  es: SEO_PAGES.spanishTool.path,
  ar: SEO_PAGES.arabicTool.path,
  "x-default": SEO_PAGES.home.path,
};

export const LARGE_FILE_LANGUAGE_PATHS: Record<SeoLocale, string> = {
  en: SEO_PAGES.largeFileTranscription.path,
  es: SEO_PAGES.spanishLargeFileTranscription.path,
  ar: SEO_PAGES.arabicLargeFileTranscription.path,
};

export const LARGE_FILE_LANGUAGE_ALTERNATES = {
  en: SEO_PAGES.largeFileTranscription.path,
  es: SEO_PAGES.spanishLargeFileTranscription.path,
  ar: SEO_PAGES.arabicLargeFileTranscription.path,
  "x-default": SEO_PAGES.largeFileTranscription.path,
};

export const CONVERTER_LANGUAGE_ALTERNATES = {
  en: SEO_PAGES.mp4ToMp3.path,
  es: SEO_PAGES.spanishMp4ToMp3.path,
  ar: SEO_PAGES.arabicMp4ToMp3.path,
  "x-default": SEO_PAGES.mp4ToMp3.path,
};

export const BASE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: SITE_NAME,
  description: SEO_PAGES.home.description,
  category: "technology",
};

const OPEN_GRAPH_LOCALES: Record<SeoLocale, string> = {
  en: "en_US",
  es: "es_ES",
  ar: "ar_AR",
};

/**
 * 将站内路径转换为生产域名下的绝对规范 URL。
 */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * 根据页面矩阵生成一致的 canonical、robots、Open Graph 与 Twitter 元数据。
 */
export function createPageMetadata(
  page: SeoPageConfig,
  languageAlternates?: Record<string, string>,
): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
      languages: languageAlternates,
    },
    robots: page.indexable
      ? { index: true, follow: true }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      title: page.openGraphTitle,
      description: page.openGraphDescription,
      url: page.path,
      siteName: SITE_NAME,
      locale: OPEN_GRAPH_LOCALES[page.locale],
      type: page.pageType,
    },
    twitter: {
      card: "summary_large_image",
      title: page.openGraphTitle,
      description: page.openGraphDescription,
    },
  };
}
