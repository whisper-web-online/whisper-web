import { SEO_PAGES } from "@/lib/seo/site";
import { CONVERTER_PATHS } from "@/features/converter/routes";
import { Brand } from "./brand";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNavigation } from "./mobile-navigation";
import { ToolsMenu } from "./tools-menu";

export type PublicNavItem = "transcribe" | "use-cases" | "blog" | "guide";

interface PublicHeaderProps {
  active?: PublicNavItem;
}

/**
 * 渲染英语公开内容页共用的可抓取导航。
 */
export function PublicHeader({ active }: PublicHeaderProps) {
  const links = [
    { id: "transcribe", href: SEO_PAGES.home.path, label: "Transcribe" },
    { id: "use-cases", href: SEO_PAGES.useCases.path, label: "Use Cases" },
    { id: "blog", href: SEO_PAGES.blog.path, label: "Blog" },
    { id: "guide", href: SEO_PAGES.speechRecognition.path, label: "Guide" },
  ] as const;
  const mobileLinks = [
    links[0],
    { id: "large-file", href: SEO_PAGES.largeFileTranscription.path, label: "Large-file transcription" },
    { id: "converter", href: CONVERTER_PATHS.en, label: "MP4 to MP3" },
    ...links.slice(1),
  ];

  return (
    <header className="site-header">
      <a className="brand-button" href={SEO_PAGES.home.path}>
        <Brand />
      </a>
      <nav className="primary-navigation public-navigation" aria-label="Primary navigation">
        {links.map((link) => (
          <a
            className={active === link.id ? "nav-link is-active" : "nav-link"}
            href={link.href}
            key={link.id}
          >
            {link.label}
          </a>
        ))}
        <ToolsMenu locale="en" />
      </nav>
      <div className="header-actions">
        <LocaleSwitcher locale="en" />
        <MobileNavigation
          items={mobileLinks.map((link) => ({
            active: active === link.id,
            href: link.href,
            label: link.label,
          }))}
          locale="en"
        />
      </div>
      <div className="header-wave" aria-hidden="true" />
    </header>
  );
}
