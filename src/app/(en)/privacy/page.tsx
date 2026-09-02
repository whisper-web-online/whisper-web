import type { Metadata } from "next";
import { LegalPage } from "@/features/transcription/components/legal-page";
import { PRIVACY_POLICY } from "@/lib/legal/legal-content";
import { createPageMetadata, SEO_PAGES } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata(SEO_PAGES.privacy);

/**
 * 渲染 Whisper Web 英文隐私政策。
 */
export default function PrivacyPage() {
  return <LegalPage document={PRIVACY_POLICY} seo={SEO_PAGES.privacy} />;
}
