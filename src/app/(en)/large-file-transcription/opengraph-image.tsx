import { createOpenGraphImage, OPEN_GRAPH_IMAGE_SIZE } from "@/components/seo/open-graph-image";
import { SEO_PAGES } from "@/lib/seo/site";

export const dynamic = "force-static";
export const alt = "Large file transcription in the browser";
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

/**
 * 生成英文大文件工具页的 Open Graph 分享图。
 */
export default function OpenGraphImage() {
  return createOpenGraphImage({
    eyebrow: "Up to 1 GB · Local processing",
    title: "Transcribe a large file in sections",
    description: SEO_PAGES.largeFileTranscription.openGraphDescription,
  });
}
