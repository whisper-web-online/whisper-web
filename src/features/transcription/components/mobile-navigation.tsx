"use client";

import { List, X } from "@phosphor-icons/react";
import { useRef } from "react";
import type { UiLocale } from "@/i18n/ui-copy";

export interface MobileNavigationItem {
  href: string;
  label: string;
  active?: boolean;
}

interface MobileNavigationProps {
  items: MobileNavigationItem[];
  locale: UiLocale;
}

const MENU_COPY: Record<UiLocale, { label: string; trigger: string }> = {
  en: { label: "Mobile navigation", trigger: "Navigation menu" },
  es: { label: "Navegación móvil", trigger: "Menú de navegación" },
  ar: { label: "التنقل على الهاتف", trigger: "قائمة التنقل" },
};

/**
 * 渲染移动端顶部折叠菜单，并在选择功能后立即收起菜单。
 */
export function MobileNavigation({ items, locale }: MobileNavigationProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const copy = MENU_COPY[locale];

  /** 用户选择导航链接后关闭原生 details，避免返回页面时菜单仍然遮挡内容。 */
  function handleNavigationClick(): void {
    detailsRef.current?.removeAttribute("open");
  }

  return (
    <details className="mobile-navigation" ref={detailsRef}>
      <summary aria-label={copy.trigger}>
        <List className="mobile-navigation-open-icon" aria-hidden="true" />
        <X className="mobile-navigation-close-icon" aria-hidden="true" />
      </summary>
      <nav className="mobile-navigation-panel" aria-label={copy.label}>
        {items.map((item) => (
          <a
            className={item.active ? "is-active" : undefined}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            onClick={handleNavigationClick}
            key={`${item.href}-${item.label}`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
