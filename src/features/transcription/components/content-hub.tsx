import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { EditorialPage } from "@/lib/seo/content-pages";
import { SEO_PAGES } from "@/lib/seo/site";
import { UI_COPY } from "@/i18n/ui-copy";
import { PublicHeader, type PublicNavItem } from "./public-header";
import { SiteFooter } from "./site-footer";

interface ContentHubProps {
  active: PublicNavItem;
  eyebrow: string;
  title: string;
  summary: string;
  directAnswer: string;
  pages: EditorialPage[];
}

/**
 * 渲染 Use Cases 或 Blog 的目录页，并为每个详情页提供真实站内入口。
 */
export function ContentHub({ active, eyebrow, title, summary, directAnswer, pages }: ContentHubProps) {
  return (
    <div className="sonora-app">
      <PublicHeader active={active} />
      <main className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={SEO_PAGES.home.path}>Whisper Web</a>
          <span aria-hidden="true">/</span>
          <span>{active === "blog" ? "Blog" : "Use Cases"}</span>
        </nav>

        <header className="content-hero content-hub-hero">
          <span className="guide-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{summary}</p>
          <div className="direct-answer">
            <strong>What these pages cover</strong>
            <p>{directAnswer}</p>
          </div>
        </header>

        <section className="content-card-grid" aria-label={`${title} pages`}>
          {pages.map((page) => (
            <article className="content-card" key={page.seo.path}>
              <span>{page.eyebrow}</span>
              <h2>{page.title}</h2>
              <p>{page.directAnswer}</p>
              <a href={page.seo.path}>
                {page.kind === "article" ? "Read the guide" : "Open this workflow"}
                <ArrowRight aria-hidden="true" />
              </a>
            </article>
          ))}
        </section>

        <section className="guide-final-cta content-final-cta">
          <div>
            <span>Transcribe on this device</span>
            <h2>Choose a supported audio or video file.</h2>
          </div>
          <a className="guide-cta" href={SEO_PAGES.home.path}>
            Choose a file <ArrowRight aria-hidden="true" />
          </a>
        </section>
      </main>
      <SiteFooter copy={UI_COPY.en} locale="en" />
    </div>
  );
}
