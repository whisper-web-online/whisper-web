import type { MetadataRoute } from "next";
import { absoluteUrl, SEO_PAGES } from "@/lib/seo/site";

export const dynamic = "force-static";

/**
 * 仅输出具备独立意图、独有价值和自引用 canonical 的页面。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(SEO_PAGES)
    .filter((page) => page.indexable)
    .map((page) => ({
      url: absoluteUrl(page.path),
      ...(page.lastModified ? { lastModified: page.lastModified } : {}),
      changeFrequency: page.path === "/" ? "weekly" as const : "monthly" as const,
      priority: page.path === "/" ? 1 : 0.8,
    }));
}
