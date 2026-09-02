import type { UiLocale } from "@/i18n/ui-copy";
import { SEO_PAGES } from "@/lib/seo/site";

export const CONVERTER_PATHS: Record<UiLocale, string> = {
  en: SEO_PAGES.mp4ToMp3.path,
  es: SEO_PAGES.spanishMp4ToMp3.path,
  ar: SEO_PAGES.arabicMp4ToMp3.path,
};
