import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { EditorialPage } from "@/features/transcription/components/editorial-page";
import { BLOG_POSTS, getBlogPost } from "@/lib/seo/content-pages";
import { createPageMetadata } from "@/lib/seo/site";
import { createEditorialPageJsonLd } from "@/lib/seo/structured-data";

interface BlogRouteProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

/**
 * 在构建时声明所有允许公开访问的 Blog slug。
 */
export function generateStaticParams() {
  return BLOG_POSTS.map((page) => ({ slug: page.slug }));
}

/**
 * 为当前 Blog 文章生成唯一 metadata；未知 slug 由页面返回 404。
 */
export async function generateMetadata({ params }: BlogRouteProps): Promise<Metadata> {
  const page = getBlogPost((await params).slug);
  return page ? createPageMetadata(page.seo) : {};
}

/**
 * 渲染指定 Blog 文章的答案、比较、FAQ 和相关内链。
 */
export default async function BlogDetailPage({ params }: BlogRouteProps) {
  const page = getBlogPost((await params).slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={createEditorialPageJsonLd(page)} />
      <EditorialPage page={page} />
    </>
  );
}
