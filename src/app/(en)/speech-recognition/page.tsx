import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { SpeechRecognitionGuide } from "@/features/transcription/components/speech-recognition-guide";
import { createPageMetadata, SEO_PAGES } from "@/lib/seo/site";
import { createSpeechRecognitionJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata(SEO_PAGES.speechRecognition);

/**
 * 渲染唯一承接 speech recognition 信息意图的英文指南页。
 */
export default function SpeechRecognitionPage() {
  return (
    <>
      <JsonLd data={createSpeechRecognitionJsonLd()} />
      <SpeechRecognitionGuide />
    </>
  );
}
