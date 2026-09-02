import { createOpenGraphImage, OPEN_GRAPH_IMAGE_SIZE } from "@/components/seo/open-graph-image";
import { SEO_PAGES } from "@/lib/seo/site";

export const dynamic = "force-static";
export const alt = "Convertir MP4 a MP3 de forma privada en el navegador";
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

/** 生成西语 MP4 a MP3 工具页的 Open Graph 分享图。 */
export default function OpenGraphImage() {
  return createOpenGraphImage({
    eyebrow: "Sin subir el vídeo · Conversión local",
    title: "Convertir MP4 a MP3 en tu navegador",
    description: SEO_PAGES.spanishMp4ToMp3.openGraphDescription,
    footer: "whisperwebfree.com · Herramientas multimedia locales",
  });
}
