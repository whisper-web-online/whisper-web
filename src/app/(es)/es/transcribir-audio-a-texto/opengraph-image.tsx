import { createOpenGraphImage, OPEN_GRAPH_IMAGE_SIZE } from "@/components/seo/open-graph-image";
import { SEO_PAGES } from "@/lib/seo/site";

export const dynamic = "force-static";
export const alt = "Transcribir audio a texto gratis en el navegador";
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

/**
 * 生成西语工具页的 Open Graph 分享图。
 */
export default function OpenGraphImage() {
  return createOpenGraphImage({
    eyebrow: "Gratis · Local · Privado",
    title: "Transcribir audio a texto",
    description: SEO_PAGES.spanishTool.openGraphDescription,
  });
}
