"use client";

import type { MouseEvent } from "react";
import type { UiCopy, UiLocale } from "@/i18n/ui-copy";
import { CONVERTER_PAGE_COPY } from "@/i18n/converter-page-copy";
import { CONVERTER_PATHS } from "@/features/converter/routes";
import { LARGE_FILE_LANGUAGE_PATHS, LOCALE_PATHS, SEO_PAGES } from "@/lib/seo/site";
import { Brand } from "./brand";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNavigation } from "./mobile-navigation";
import { ToolsMenu } from "./tools-menu";

export type AppView = "transcribe" | "history";

interface AppHeaderProps {
  copy: UiCopy;
  locale: UiLocale;
  view: AppView;
  onViewChange: (view: AppView) => void;
}

/**
 * 渲染全站导航和语言切换入口。
 */
export function AppHeader({
  copy,
  locale,
  view,
  onViewChange,
}: AppHeaderProps) {
  const toolCopy = CONVERTER_PAGE_COPY[locale];
  /**
   * 保留可抓取 href，同时让普通点击沿用现有的客户端视图切换。
   */
  const handleTranscribeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.replaceState(null, "", LOCALE_PATHS[locale]);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    onViewChange("transcribe");
  };

  /** 打开可直达的本地 History 视图，并保留客户端切换体验。 */
  const handleHistoryClick = () => {
    window.history.replaceState(null, "", "#history");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    onViewChange("history");
  };

  return (
    <header className="site-header">
      <a className="brand-button" href={LOCALE_PATHS[locale]} onClick={handleTranscribeClick}>
        <Brand />
      </a>
      <nav className="primary-navigation" aria-label="Primary navigation">
        <a
          className={view === "transcribe" ? "nav-link is-active" : "nav-link"}
          href={LOCALE_PATHS[locale]}
          onClick={handleTranscribeClick}
        >
          {copy.nav.transcribe}
        </a>
        <ToolsMenu locale={locale} />
        <button
          className={view === "history" ? "nav-link is-active" : "nav-link"}
          type="button"
          onClick={handleHistoryClick}
        >
          {copy.nav.history}
        </button>
        <a className="nav-link" href={SEO_PAGES.speechRecognition.path}>
          {copy.nav.guide}
        </a>
      </nav>
      <div className="header-actions">
        <LocaleSwitcher locale={locale} />
        <MobileNavigation
          items={[
            { active: view === "transcribe", href: LOCALE_PATHS[locale], label: copy.nav.transcribe },
            { href: LARGE_FILE_LANGUAGE_PATHS[locale], label: toolCopy.toolsMenu.largeFile },
            { href: CONVERTER_PATHS[locale], label: toolCopy.toolsMenu.converter },
            { active: view === "history", href: `${LOCALE_PATHS[locale]}#history`, label: copy.nav.history },
            { href: SEO_PAGES.speechRecognition.path, label: copy.nav.guide },
          ]}
          locale={locale}
        />
      </div>
      <div className="header-wave" aria-hidden="true" />
    </header>
  );
}
