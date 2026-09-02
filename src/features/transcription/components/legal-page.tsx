import { JsonLd } from "@/components/seo/json-ld";
import { UI_COPY } from "@/i18n/ui-copy";
import type { LegalDocument } from "@/lib/legal/legal-content";
import type { SeoPageConfig } from "@/lib/seo/site";
import { SEO_PAGES } from "@/lib/seo/site";
import { createLegalPageJsonLd } from "@/lib/seo/structured-data";
import { PublicHeader } from "./public-header";
import { SiteFooter } from "./site-footer";

interface LegalPageProps {
  document: LegalDocument;
  seo: SeoPageConfig;
}

/**
 * 渲染法律文档的摘要、目录、分节正文和站点级法律入口。
 */
export function LegalPage({ document, seo }: LegalPageProps) {
  return (
    <div className="sonora-app">
      <JsonLd data={createLegalPageJsonLd(seo, document.title)} />
      <PublicHeader />
      <main className="content-shell legal-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={SEO_PAGES.home.path}>Whisper Web</a>
          <span aria-hidden="true">/</span>
          <span>{document.title}</span>
        </nav>

        <header className="content-hero legal-hero">
          <span className="guide-eyebrow">{document.eyebrow}</span>
          <h1>{document.title}</h1>
          <p>{document.summary}</p>
          <small>Effective and last updated: {document.effectiveDate}</small>
        </header>

        <div className="legal-layout">
          <nav className="legal-toc" aria-label={`${document.title} sections`}>
            <strong>On this page</strong>
            {document.sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>{section.title}</a>
            ))}
          </nav>

          <article className="legal-document">
            {document.sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </main>
      <SiteFooter copy={UI_COPY.en} locale="en" />
    </div>
  );
}
