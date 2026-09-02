import { CaretDown, GlobeHemisphereWest } from "@phosphor-icons/react/dist/ssr";
import type { UiLocale } from "@/i18n/ui-copy";
import { LOCALE_PATHS } from "@/lib/seo/site";

const LOCALE_LABELS: Record<UiLocale, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
};

const LOCALE_SHORT_LABELS: Record<UiLocale, string> = {
  en: "EN",
  es: "ES",
  ar: "AR",
};

const LANGUAGE_MENU_LABELS: Record<UiLocale, string> = {
  en: "Language",
  es: "Idioma",
  ar: "اللغة",
};

interface LocaleSwitcherProps {
  locale: UiLocale;
  paths?: Record<UiLocale, string>;
}

/**
 * 渲染单按钮语言切换器，并保留可抓取的多语言页面链接。
 */
export function LocaleSwitcher({ locale, paths = LOCALE_PATHS }: LocaleSwitcherProps) {
  return (
    <details className="locale-switcher">
      <summary aria-label={`Language: ${LOCALE_LABELS[locale]}`}>
        <GlobeHemisphereWest aria-hidden="true" />
        <span className="locale-label-full">{LOCALE_LABELS[locale]}</span>
        <span className="locale-label-short" aria-hidden="true">{LOCALE_SHORT_LABELS[locale]}</span>
        <CaretDown className="locale-switcher-caret" aria-hidden="true" />
      </summary>
      <nav className="locale-menu" aria-label={LANGUAGE_MENU_LABELS[locale]}>
        {(Object.entries(LOCALE_LABELS) as Array<[UiLocale, string]>).map(([item, label]) => (
          <a
            className={locale === item ? "is-active" : undefined}
            href={paths[item]}
            hrefLang={item}
            lang={item}
            aria-current={locale === item ? "page" : undefined}
            key={item}
          >
            <span>{label}</span>
            <small>{item.toUpperCase()}</small>
          </a>
        ))}
      </nav>
    </details>
  );
}
