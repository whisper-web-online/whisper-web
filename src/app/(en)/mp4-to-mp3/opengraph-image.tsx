import { createOpenGraphImage, OPEN_GRAPH_IMAGE_SIZE } from "@/components/seo/open-graph-image";
import { SEO_PAGES } from "@/lib/seo/site";

export const dynamic = "force-static";
export const alt = "Convert MP4 to MP3 privately in the browser";
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

/** 生成英语 MP4 to MP3 工具页的 Open Graph 分享图。 */
export default function OpenGraphImage() {
  return createOpenGraphImage({
    eyebrow: "No upload · Local conversion",
    title: "Convert MP4 to MP3 in your browser",
    description: SEO_PAGES.mp4ToMp3.openGraphDescription,
    footer: "whisperwebfree.com · Local browser media tools",
  });
}
