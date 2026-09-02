import { ConverterPage } from "@/features/converter/converter-page";
import { CONVERTER_LANGUAGE_ALTERNATES, createPageMetadata, SEO_PAGES } from "@/lib/seo/site";

export const metadata = createPageMetadata(SEO_PAGES.spanishMp4ToMp3, CONVERTER_LANGUAGE_ALTERNATES);

/** 渲染西班牙语 MP4 a MP3 本地转换工具页。 */
export default function ConvertirMp4AMp3Page() {
  return <ConverterPage locale="es" />;
}
