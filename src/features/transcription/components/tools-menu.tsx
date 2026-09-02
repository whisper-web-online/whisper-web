"use client";

import { CaretDown, Wrench } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { UiLocale } from "@/i18n/ui-copy";
import { CONVERTER_PAGE_COPY } from "@/i18n/converter-page-copy";
import { CONVERTER_PATHS } from "@/features/converter/routes";
import { LARGE_FILE_LANGUAGE_PATHS } from "@/lib/seo/site";

interface ToolsMenuProps {
  locale: UiLocale;
  active?: "converter" | "large-file";
}

/**
 * 渲染支持键盘、Escape 和点击外部关闭的本地工具菜单。
 */
export function ToolsMenu({ locale, active }: ToolsMenuProps) {
  const copy = CONVERTER_PAGE_COPY[locale];
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    /** 点击菜单外部时关闭当前工具菜单。 */
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    /** 按下 Escape 时关闭菜单并把焦点还给触发按钮。 */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  /** 用显式键盘激活保证 Enter 与 Space 在各浏览器中一致展开菜单。 */
  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>): void {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setOpen((current) => !current);
  }

  return (
    <div className="tools-menu" ref={rootRef}>
      <button
        className={active ? "nav-link is-active" : "nav-link"}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        <Wrench aria-hidden="true" />
        <span>{copy.nav.tools}</span>
        <CaretDown className="tools-menu-caret" aria-hidden="true" />
      </button>
      {open ? (
        <div className="tools-menu-panel" role="menu" aria-label={copy.toolsMenu.label}>
          <a className={active === "converter" ? "is-active" : ""} href={CONVERTER_PATHS[locale]} role="menuitem">
            {copy.toolsMenu.converter}
          </a>
          <a className={active === "large-file" ? "is-active" : ""} href={LARGE_FILE_LANGUAGE_PATHS[locale]} role="menuitem">
            {copy.toolsMenu.largeFile}
          </a>
        </div>
      ) : null}
    </div>
  );
}
