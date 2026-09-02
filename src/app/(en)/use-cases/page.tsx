import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { ContentHub } from "@/features/transcription/components/content-hub";
import { USE_CASE_PAGES } from "@/lib/seo/content-pages";
import { createPageMetadata, SEO_PAGES } from "@/lib/seo/site";
import { createContentHubJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata(SEO_PAGES.useCases);

/**
 * 渲染英语转录场景目录，并连接所有可索引场景页。
 */
export default function UseCasesPage() {
  return (
    <>
      <JsonLd data={createContentHubJsonLd(SEO_PAGES.useCases, USE_CASE_PAGES, "Use Cases")} />
      <ContentHub
        active="use-cases"
        eyebrow="Choose by recording type"
        title="Local transcription workflows for the recordings you already have"
        summary="Meetings, voice memos, interviews and podcasts need different review steps. Choose a workflow that matches the recording, the output and the privacy boundary."
        directAnswer="Start with the recording you have and the result you need. Whisper Web creates an editable transcript with timestamped segments; it does not identify speakers, summarize conversations or join live calls."
        pages={USE_CASE_PAGES}
      />
    </>
  );
}
