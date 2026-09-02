import type { Metadata } from "next";
import { LargeFileToolPage } from "@/features/transcription/components/large-file-tool-page";
import {
  createPageMetadata,
  LARGE_FILE_LANGUAGE_ALTERNATES,
  SEO_PAGES,
} from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata(
  SEO_PAGES.arabicLargeFileTranscription,
  LARGE_FILE_LANGUAGE_ALTERNATES,
);

/**
 * 渲染唯一承接 تحويل ملف صوتي طويل إلى نص 任务意图的阿拉伯语大文件页。
 */
export default function ArabicLargeFileTranscriptionRoute() {
  return <LargeFileToolPage locale="ar" />;
}
