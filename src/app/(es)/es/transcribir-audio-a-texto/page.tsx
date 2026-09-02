import type { Metadata } from "next";
import { ToolPage } from "@/features/transcription/components/tool-page";
import { createPageMetadata, SEO_PAGES, TOOL_LANGUAGE_ALTERNATES } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata(SEO_PAGES.spanishTool, TOOL_LANGUAGE_ALTERNATES);

/**
 * 渲染唯一承接 transcribir audio a texto 任务意图的西语工具页。
 */
export default function SpanishTranscriptionPage() {
  return <ToolPage locale="es" />;
}
