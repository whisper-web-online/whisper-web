import type { SeoPageConfig } from "@/lib/seo/site";
import { SITE_NAME } from "@/lib/seo/site";

interface ArticleBylineProps {
  page: SeoPageConfig;
}

/**
 * 将 ISO 日期格式化为英文文章中可见的完整日期。
 */
function formatArticleDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * 渲染与 Article 结构化数据一致的组织作者、发布日期和更新时间。
 */
export function ArticleByline({ page }: ArticleBylineProps) {
  if (!page.datePublished || !page.lastModified) return null;

  return (
    <p className="content-byline">
      <span>By <strong>{SITE_NAME}</strong></span>
      <span>Published <time dateTime={page.datePublished}>{formatArticleDate(page.datePublished)}</time></span>
      <span>Updated <time dateTime={page.lastModified}>{formatArticleDate(page.lastModified)}</time></span>
    </p>
  );
}
