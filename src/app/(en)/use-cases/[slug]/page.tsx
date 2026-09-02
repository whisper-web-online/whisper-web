import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { EditorialPage } from "@/features/transcription/components/editorial-page";
import { getUseCasePage, USE_CASE_PAGES } from "@/lib/seo/content-pages";
import { createPageMetadata } from "@/lib/seo/site";
import { createEditorialPageJsonLd } from "@/lib/seo/structured-data";

interface UseCaseRouteProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

/**
 * 在构建时声明所有允许公开访问的场景页 slug。
 */
export function generateStaticParams() {
  return USE_CASE_PAGES.map((page) => ({ slug: page.slug }));
}

/**
 * 为当前场景页生成唯一 metadata；未知 slug 由页面返回 404。
 */
export async function generateMetadata({ params }: UseCaseRouteProps): Promise<Metadata> {
  const page = getUseCasePage((await params).slug);
  return page ? createPageMetadata(page.seo) : {};
}

/**
 * 渲染指定场景的独立任务、限制、FAQ 和相关内链。
 */
export default async function UseCaseDetailPage({ params }: UseCaseRouteProps) {
  const page = getUseCasePage((await params).slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={createEditorialPageJsonLd(page)} />
      <EditorialPage page={page} />
    </>
  );
}
