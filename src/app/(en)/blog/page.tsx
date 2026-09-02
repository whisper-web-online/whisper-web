import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { ContentHub } from "@/features/transcription/components/content-hub";
import { BLOG_POSTS } from "@/lib/seo/content-pages";
import { createPageMetadata, SEO_PAGES } from "@/lib/seo/site";
import { createContentHubJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata(SEO_PAGES.blog);

/**
 * 渲染英语 Blog 目录，并连接所有可索引指南文章。
 */
export default function BlogPage() {
  return (
    <>
      <JsonLd data={createContentHubJsonLd(SEO_PAGES.blog, BLOG_POSTS, "Blog")} />
      <ContentHub
        active="blog"
        eyebrow="Guides and comparisons"
        title="Choose how to process media and use the result"
        summary="Compare local and cloud processing, plan a long transcription, convert video to MP3, choose a browser compute option and prepare the right subtitle format."
        directAnswer="Use these guides to decide where media is processed, whether a recording needs the standard or large-file workflow, how to choose MP3 quality, which browser backend fits the device, and whether the next tool needs SRT or VTT. Each guide puts the relevant limits next to the decision."
        pages={BLOG_POSTS}
      />
    </>
  );
}
