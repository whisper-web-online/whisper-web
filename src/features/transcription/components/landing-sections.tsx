import { ArrowDown, Export, FileArrowUp, LockKey, ShieldCheck, Waveform } from "@phosphor-icons/react/dist/ssr";
import type { UiCopy, UiLocale } from "@/i18n/ui-copy";
import { CONVERTER_PAGE_COPY } from "@/i18n/converter-page-copy";
import { CONVERTER_PATHS } from "@/features/converter/routes";
import { SEO_PAGES } from "@/lib/seo/site";

interface LandingSectionsProps {
  copy: UiCopy;
  locale: UiLocale;
}

/**
 * 渲染首屏下方的工作流、隐私说明和常见问题。
 */
export function LandingSections({ copy, locale }: LandingSectionsProps) {
  const trustIcons = [ShieldCheck, Waveform, ArrowDown] as const;
  const useCasePaths = [
    SEO_PAGES.meetingTranscription.path,
    SEO_PAGES.voiceMemoToText.path,
    SEO_PAGES.interviewTranscription.path,
    SEO_PAGES.podcastTranscription.path,
  ];
  const blogPaths = [
    SEO_PAGES.transcribeWithoutUploading.path,
    SEO_PAGES.localVsCloud.path,
    SEO_PAGES.webgpuVsWebassembly.path,
    SEO_PAGES.transcribeLargeFilesGuide.path,
  ];

  return (
    <>
      <section className="workflow-section" aria-labelledby="workflow-heading">
        <h2 id="workflow-heading">{copy.workflowHeading}</h2>
        <ol className="workflow-strip">
          {[
            { icon: FileArrowUp, number: "01", title: copy.workflow[0], text: copy.workflowDetails[0] },
            { icon: Waveform, number: "02", title: copy.workflow[1], text: copy.workflowDetails[1] },
            { icon: Export, number: "03", title: copy.workflow[2], text: copy.workflowDetails[2] },
          ].map(({ icon: Icon, number, title, text }) => (
            <li className="workflow-step" key={number}>
              <span className="step-icon"><Icon aria-hidden="true" /></span>
              <div><b>{number}</b><strong>{title}</strong><span>{text}</span></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="local-tool-card" aria-labelledby="local-tool-card-heading">
        <div>
          <span>{CONVERTER_PAGE_COPY[locale].eyebrow}</span>
          <h2 id="local-tool-card-heading">{CONVERTER_PAGE_COPY[locale].homeToolTitle}</h2>
          <p>{CONVERTER_PAGE_COPY[locale].homeToolBody}</p>
        </div>
        <a href={CONVERTER_PATHS[locale]}>{CONVERTER_PAGE_COPY[locale].homeToolAction}</a>
      </section>

      {copy.discovery ? (
        <section className="discovery-section" aria-labelledby="discovery-heading">
          <div className="discovery-intro">
            <span>{copy.discovery.eyebrow}</span>
            <h2 id="discovery-heading">{copy.discovery.title}</h2>
            <p>{copy.discovery.description}</p>
          </div>
          <div className="discovery-column">
            <div className="discovery-column-heading">
              <h3>{copy.discovery.useCasesTitle}</h3>
              <a href={SEO_PAGES.useCases.path}>View all use cases</a>
            </div>
            {copy.discovery.useCases.map((item, index) => (
              <a className="discovery-link" href={useCasePaths[index]} key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </a>
            ))}
          </div>
          <div className="discovery-column">
            <div className="discovery-column-heading">
              <h3>{copy.discovery.blogTitle}</h3>
              <a href={SEO_PAGES.blog.path}>View all guides</a>
            </div>
            {copy.discovery.blog.map((item, index) => (
              <a className="discovery-link" href={blogPaths[index]} key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="trust-section" id="guide">
        <div className="trust-intro">
          <LockKey aria-hidden="true" />
          <h2>{copy.trust.title}</h2>
          <p>{copy.trust.description}</p>
        </div>
        <ul className="trust-points">
          {copy.trust.points.map((point, index) => {
            const Icon = trustIcons[index];
            return (
              <li key={point.title}>
                <Icon aria-hidden="true" />
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </li>
            );
          })}
        </ul>
        <div className="guide-table-wrap trust-boundary-table">
          <table>
            <caption>{copy.trust.tableCaption}</caption>
            <thead>
              <tr>
                {copy.trust.tableHeaders.map((header) => <th key={header} scope="col">{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {copy.trust.tableRows.map((row) => (
                <tr key={row.question}>
                  <th scope="row">{row.question}</th>
                  <td>{row.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="trust-sources" aria-label={copy.trust.sources.title}>
          <div className="trust-sources-intro">
            <strong>{copy.trust.sources.title}</strong>
            <p>{copy.trust.sources.description}</p>
          </div>
          <ul>
            {copy.trust.sources.items.map((source) => (
              <li key={source.href}>
                <cite><a href={source.href}>{source.label}</a></cite>
              </li>
            ))}
          </ul>
        </aside>
        <div className="faq-list">
          <h2>{copy.faq.title}</h2>
          {copy.faq.items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
              {item.link ? <a className="faq-action" href={item.link.href}>{item.link.label}</a> : null}
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
