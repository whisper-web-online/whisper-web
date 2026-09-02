import type { UiCopy, UiLocale } from "@/i18n/ui-copy";
import { SEO_PAGES, SUPPORT_EMAIL } from "@/lib/seo/site";
import { LARGE_FILE_LANGUAGE_PATHS } from "@/lib/seo/site";
import { CONVERTER_PAGE_COPY } from "@/i18n/converter-page-copy";
import { CONVERTER_PATHS } from "@/features/converter/routes";
import { Brand } from "./brand";

interface SiteFooterProps {
  copy: UiCopy;
  locale: UiLocale;
}

const LEGAL_LINK_LABELS: Record<UiLocale, { heading: string; privacy: string; terms: string }> = {
  en: { heading: "Legal", privacy: "Privacy Policy", terms: "Terms of Use" },
  es: { heading: "Legal", privacy: "Privacidad (en inglés)", terms: "Términos (en inglés)" },
  ar: { heading: "معلومات قانونية", privacy: "الخصوصية (بالإنجليزية)", terms: "الشروط (بالإنجليزية)" },
};

/**
 * 渲染跨工具页与指南页共用的品牌、价值说明和支持邮箱。
 */
export function SiteFooter({ copy, locale }: SiteFooterProps) {
  return (
    <footer className="site-footer has-links">
      <div className="footer-brand-block">
        <Brand />
        <span>{copy.footer}</span>
      </div>
      {copy.footerLinks && locale === "en" ? (
        <nav className="footer-links" aria-label="Footer navigation">
          <strong>{copy.footerLinks.heading}</strong>
          <a href={SEO_PAGES.useCases.path}>{copy.footerLinks.useCases}</a>
          <a href={SEO_PAGES.blog.path}>{copy.footerLinks.blog}</a>
          <a href={SEO_PAGES.speechRecognition.path}>{copy.footerLinks.guide}</a>
        </nav>
      ) : null}
      <nav className="footer-links footer-tool-links" aria-label={CONVERTER_PAGE_COPY[locale].toolsMenu.label}>
        <strong>{CONVERTER_PAGE_COPY[locale].nav.tools}</strong>
        <a href={CONVERTER_PATHS[locale]}>{CONVERTER_PAGE_COPY[locale].toolsMenu.converter}</a>
        <a href={LARGE_FILE_LANGUAGE_PATHS[locale]}>{CONVERTER_PAGE_COPY[locale].toolsMenu.largeFile}</a>
      </nav>
      <nav className="footer-links footer-legal-links" aria-label={LEGAL_LINK_LABELS[locale].heading}>
        <strong>{LEGAL_LINK_LABELS[locale].heading}</strong>
        <a href={SEO_PAGES.privacy.path}>{LEGAL_LINK_LABELS[locale].privacy}</a>
        <a href={SEO_PAGES.terms.path}>{LEGAL_LINK_LABELS[locale].terms}</a>
      </nav>
      <a className="footer-support" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
    </footer>
  );
}
