import { createOpenGraphImage, OPEN_GRAPH_IMAGE_SIZE } from "@/components/seo/open-graph-image";
import { SEO_PAGES } from "@/lib/seo/site";

export const dynamic = "force-static";
export const alt = "Speech recognition in the browser guide";
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

/**
 * 生成 speech recognition 指南页的 Open Graph 分享图。
 */
export default function OpenGraphImage() {
  return createOpenGraphImage({
    eyebrow: "Browser speech recognition",
    title: "How local processing works",
    description: SEO_PAGES.speechRecognition.openGraphDescription,
  });
}
