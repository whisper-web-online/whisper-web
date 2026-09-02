import type { UiLocale } from "@/i18n/ui-copy";
import { UI_COPY } from "@/i18n/ui-copy";
import { JsonLd } from "@/components/seo/json-ld";
import { createToolPageJsonLd } from "@/lib/seo/structured-data";
import { SonoraApp } from "./sonora-app";

interface ToolPageProps {
  locale: UiLocale;
}

/**
 * 输出指定语言的可用转录工具和与可见内容一致的结构化数据。
 */
export function ToolPage({ locale }: ToolPageProps) {
  return (
    <>
      <JsonLd data={createToolPageJsonLd(locale, UI_COPY[locale])} />
      <SonoraApp initialLocale={locale} />
    </>
  );
}
