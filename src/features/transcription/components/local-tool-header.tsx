import type { UiLocale } from "@/i18n/ui-copy";
import { CONVERTER_PAGE_COPY } from "@/i18n/converter-page-copy";
import { LARGE_FILE_LANGUAGE_PATHS, LOCALE_PATHS, SEO_PAGES } from "@/lib/seo/site";
import { CONVERTER_PATHS } from "@/features/converter/routes";
import { Brand } from "./brand";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNavigation } from "./mobile-navigation";
import { ToolsMenu } from "./tools-menu";

interface LocalToolHeaderProps {
  locale: UiLocale;
  activeTool: "converter" | "large-file";
}

/**
 * 渲染转换器和大文件工具共用的四项导航与语言切换。
 */
export function LocalToolHeader({ locale, activeTool }: LocalToolHeaderProps) {
  const copy = CONVERTER_PAGE_COPY[locale];
  const localePaths = activeTool === "converter" ? CONVERTER_PATHS : LARGE_FILE_LANGUAGE_PATHS;
  const historySuffix = activeTool === "converter" ? "#history/conversions" : "#history";

  return (
    <header className="site-header">
      <a className="brand-button" href={LOCALE_PATHS[locale]}><Brand /></a>
      <nav className="primary-navigation tool-page-navigation" aria-label={copy.toolsMenu.label}>
        <a className="nav-link" href={LOCALE_PATHS[locale]}>{copy.nav.transcribe}</a>
        <ToolsMenu locale={locale} active={activeTool} />
        <a className="nav-link" href={`${LOCALE_PATHS[locale]}${historySuffix}`}>{copy.nav.history}</a>
        <a className="nav-link" href={SEO_PAGES.speechRecognition.path}>{copy.nav.guide}</a>
      </nav>
      <div className="header-actions">
        <LocaleSwitcher locale={locale} paths={localePaths} />
        <MobileNavigation
          items={[
            { href: LOCALE_PATHS[locale], label: copy.nav.transcribe },
            { active: activeTool === "large-file", href: LARGE_FILE_LANGUAGE_PATHS[locale], label: copy.toolsMenu.largeFile },
            { active: activeTool === "converter", href: CONVERTER_PATHS[locale], label: copy.toolsMenu.converter },
            { href: `${LOCALE_PATHS[locale]}${historySuffix}`, label: copy.nav.history },
            { href: SEO_PAGES.speechRecognition.path, label: copy.nav.guide },
          ]}
          locale={locale}
        />
      </div>
      <div className="header-wave" aria-hidden="true" />
    </header>
  );
}
