import type { Metadata } from "next";
import { ToolPage } from "@/features/transcription/components/tool-page";
import { createPageMetadata, SEO_PAGES, TOOL_LANGUAGE_ALTERNATES } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata(SEO_PAGES.home, TOOL_LANGUAGE_ALTERNATES);

/**
 * 渲染主推 Whisper Web 品牌词的英文核心工具页。
 */
export default function HomePage() {
  return <ToolPage locale="en" />;
}
