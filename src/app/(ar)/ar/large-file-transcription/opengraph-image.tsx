import { createOpenGraphImage, OPEN_GRAPH_IMAGE_SIZE } from "@/components/seo/open-graph-image";

export const dynamic = "force-static";
export const alt = "نسخ ملف صوتي أو فيديو كبير داخل المتصفح";
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

/**
 * 生成阿拉伯语大文件工具页的 Open Graph 分享图。
 */
export default function OpenGraphImage() {
  return createOpenGraphImage({
    eyebrow: "Up to 1 GB · Local processing",
    title: "Large-file transcription in your browser",
    description: "Process a large audio or video file in sections on your device.",
  });
}
