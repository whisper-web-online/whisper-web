import { ConverterPage } from "@/features/converter/converter-page";
import { CONVERTER_LANGUAGE_ALTERNATES, createPageMetadata, SEO_PAGES } from "@/lib/seo/site";

export const metadata = createPageMetadata(SEO_PAGES.arabicMp4ToMp3, CONVERTER_LANGUAGE_ALTERNATES);

/** 渲染阿拉伯语 MP4 إلى MP3 本地转换工具页。 */
export default function ArabicMp4ToMp3Page() {
  return <ConverterPage locale="ar" />;
}
