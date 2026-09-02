import type { Metadata } from "next";
import { LegalPage } from "@/features/transcription/components/legal-page";
import { TERMS_OF_USE } from "@/lib/legal/legal-content";
import { createPageMetadata, SEO_PAGES } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata(SEO_PAGES.terms);

/**
 * 渲染 Whisper Web 英文使用条款。
 */
export default function TermsPage() {
  return <LegalPage document={TERMS_OF_USE} seo={SEO_PAGES.terms} />;
}
