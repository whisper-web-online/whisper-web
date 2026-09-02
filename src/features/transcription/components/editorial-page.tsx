import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { EditorialPage as EditorialPageData } from "@/lib/seo/content-pages";
import { SEO_PAGES } from "@/lib/seo/site";
import { UI_COPY } from "@/i18n/ui-copy";
import { ArticleByline } from "./article-byline";
import { PublicHeader } from "./public-header";
import { SiteFooter } from "./site-footer";

interface EditorialPageProps {
  page: EditorialPageData;
}

/**
 * 渲染场景页或 Blog 文章的答案、步骤、比较、FAQ 与相关内链。
 */
export function EditorialPage({ page }: EditorialPageProps) {
  const hub = page.kind === "article" ? SEO_PAGES.blog : SEO_PAGES.useCases;
  const active = page.kind === "article" ? "blog" : "use-cases";
  const callToAction = page.callToAction ?? {
    eyebrow: "Transcribe on this device",
    title: "Choose a supported audio or video file.",
    primary: {
      href: SEO_PAGES.home.path,
      label: "Choose an audio or video file",
    },
  };

  return (
    <div className="sonora-app">
      <PublicHeader active={active} />
      <main className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={SEO_PAGES.home.path}>Whisper Web</a>
          <span aria-hidden="true">/</span>
          <a href={hub.path}>{page.kind === "article" ? "Blog" : "Use Cases"}</a>
          <span aria-hidden="true">/</span>
          <span>{page.title}</span>
        </nav>

        <article>
          <header className="content-hero">
            <span className="guide-eyebrow">{page.eyebrow}</span>
            <h1>{page.title}</h1>
            <p>{page.summary}</p>
            {page.kind === "article" ? <ArticleByline page={page.seo} /> : null}
            <div className="direct-answer">
              <strong>Short answer</strong>
              <p>{page.directAnswer}</p>
            </div>
            <div className="editorial-actions">
              <a className="guide-cta" href={callToAction.primary.href}>
                {callToAction.primary.label} <ArrowRight aria-hidden="true" />
              </a>
              {callToAction.secondary ? (
                <a className="guide-cta is-secondary" href={callToAction.secondary.href}>
                  {callToAction.secondary.label} <ArrowRight aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </header>

          {page.sections.map((section, index) => (
            <section className="guide-section editorial-section" id={section.id} key={section.id}>
              <div className="guide-section-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h2>{section.title}</h2></div>
              </div>

              {section.paragraphs ? (
                <div className="editorial-prose">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              ) : null}

              {section.steps ? (
                <ol className="editorial-steps">
                  {section.steps.map((step, stepIndex) => (
                    <li key={step.title}>
                      <span>{stepIndex + 1}</span>
                      <div><h3>{step.title}</h3><p>{step.description}</p></div>
                    </li>
                  ))}
                </ol>
              ) : null}

              {section.bullets ? (
                <ul className="editorial-points">
                  {section.bullets.map((item) => (
                    <li key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.table ? (
                <div className="guide-table-wrap">
                  <table>
                    <caption>{section.table.caption ?? section.title}</caption>
                    <thead><tr>{section.table.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")}>
                          {row.map((cell, cellIndex) => cellIndex === 0
                            ? <th key={cell} scope="row">{cell}</th>
                            : <td key={`${cellIndex}-${cell}`}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {section.sources?.length ? (
                <aside className="editorial-sources" aria-label={`Sources for ${section.title}`}>
                  <strong>{section.sources.length === 1 ? "Source" : "Sources"}</strong>
                  <ul>
                    {section.sources.map((source) => (
                      <li key={source.href}><a href={source.href}>{source.label}</a></li>
                    ))}
                  </ul>
                </aside>
              ) : null}
            </section>
          ))}

          <section className="guide-section guide-faq editorial-faq" aria-labelledby="content-faq-heading">
            <div className="guide-section-heading">
              <span>{String(page.sections.length + 1).padStart(2, "0")}</span>
              <div><h2 id="content-faq-heading">{page.kind === "article" ? "Questions about this guide" : "Questions about this workflow"}</h2></div>
            </div>
            <div>
              {page.faq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="guide-section related-content" aria-labelledby="related-content-heading">
            <div className="guide-section-heading">
              <span>{String(page.sections.length + 2).padStart(2, "0")}</span>
              <div><h2 id="related-content-heading">Related guides and workflows</h2></div>
            </div>
            <div className="related-content-grid">
              {page.relatedLinks.map((link) => (
                <a href={link.href} key={link.href}>
                  <strong>{link.label}</strong>
                  <span>{link.description}</span>
                  <ArrowRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>

          <section className="guide-final-cta content-final-cta">
            <div>
              <span>{callToAction.eyebrow}</span>
              <h2>{callToAction.title}</h2>
            </div>
            <div className="editorial-actions">
              <a className="guide-cta" href={callToAction.primary.href}>
                {callToAction.primary.label} <ArrowRight aria-hidden="true" />
              </a>
              {callToAction.secondary ? (
                <a className="guide-cta is-secondary" href={callToAction.secondary.href}>
                  {callToAction.secondary.label} <ArrowRight aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter copy={UI_COPY.en} locale="en" />
    </div>
  );
}
