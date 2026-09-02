import type { Metadata } from "next";
import { ToolPage } from "@/features/transcription/components/tool-page";
import { createPageMetadata, SEO_PAGES, TOOL_LANGUAGE_ALTERNATES } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata(
  SEO_PAGES.arabicTool,
  TOOL_LANGUAGE_ALTERNATES,
);

/**
 * 渲染唯一承接 تحويل الصوت إلى نص 任务意图的阿拉伯语工具页。
 */
export default function ArabicTranscriptionPage() {
  return <ToolPage locale="ar" />;
}
