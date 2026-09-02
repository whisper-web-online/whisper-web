import { createOpenGraphImage, OPEN_GRAPH_IMAGE_SIZE } from "@/components/seo/open-graph-image";

export const dynamic = "force-static";
export const alt = "تحويل الصوت إلى نص مجانًا وبخصوصية داخل المتصفح";
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

/**
 * 生成阿拉伯语核心转录工具页的 Open Graph 分享图。
 */
export default function OpenGraphImage() {
  return createOpenGraphImage({
    eyebrow: "Free · Local · Private",
    title: "Arabic speech to text in your browser",
    description: "Transcribe audio and video on your device without uploading media to Whisper Web.",
    footer: "whisperwebfree.com · Arabic transcription tool",
  });
}
