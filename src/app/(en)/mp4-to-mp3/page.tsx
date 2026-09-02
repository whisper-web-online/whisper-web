import { ConverterPage } from "@/features/converter/converter-page";
import { CONVERTER_LANGUAGE_ALTERNATES, createPageMetadata, SEO_PAGES } from "@/lib/seo/site";

export const metadata = createPageMetadata(SEO_PAGES.mp4ToMp3, CONVERTER_LANGUAGE_ALTERNATES);

/** 渲染英语 MP4 to MP3 本地转换工具页。 */
export default function Mp4ToMp3Page() {
  return <ConverterPage locale="en" />;
}
