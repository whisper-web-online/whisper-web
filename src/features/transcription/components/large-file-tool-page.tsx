import { JsonLd } from "@/components/seo/json-ld";
import { LARGE_FILE_COPY } from "@/i18n/large-file-copy";
import type { UiLocale } from "@/i18n/ui-copy";
import { createLargeFilePageJsonLd } from "@/lib/seo/structured-data";
import { LargeFileTranscriptionPage } from "./large-file-transcription-page";

interface LargeFileToolPageProps {
  locale: UiLocale;
}

/**
 * 输出指定语言的大文件工具及与可见 FAQ 一致的结构化数据。
 */
export function LargeFileToolPage({ locale }: LargeFileToolPageProps) {
  return (
    <>
      <JsonLd data={createLargeFilePageJsonLd(locale, LARGE_FILE_COPY[locale])} />
      <LargeFileTranscriptionPage locale={locale} />
    </>
  );
}
