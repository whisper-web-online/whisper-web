import { JsonLd } from "@/components/seo/json-ld";
import { CONVERTER_PAGE_COPY } from "@/i18n/converter-page-copy";
import type { UiLocale } from "@/i18n/ui-copy";
import { createConverterPageJsonLd } from "@/lib/seo/structured-data";
import { ConverterApp } from "./converter-app";

interface ConverterPageProps {
  locale: UiLocale;
}

/**
 * 在服务端输出与可见转换器内容一致的 JSON-LD，再挂载本地交互应用。
 */
export function ConverterPage({ locale }: ConverterPageProps) {
  return (
    <>
      <JsonLd data={createConverterPageJsonLd(locale, CONVERTER_PAGE_COPY[locale])} />
      <ConverterApp locale={locale} />
    </>
  );
}
