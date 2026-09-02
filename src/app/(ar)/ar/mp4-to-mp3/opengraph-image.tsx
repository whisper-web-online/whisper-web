import { createOpenGraphImage, OPEN_GRAPH_IMAGE_SIZE } from "@/components/seo/open-graph-image";

export const dynamic = "force-static";
export const alt = "تحويل MP4 إلى MP3 بخصوصية في المتصفح";
export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

/** 生成阿语 MP4 إلى MP3 工具页的 Open Graph 分享图。 */
export default function OpenGraphImage() {
  return createOpenGraphImage({
    eyebrow: "No upload · Local conversion",
    title: "Convert MP4 to MP3 in your browser",
    description: "Extract the main audio track on your device and download an MP3 without uploading the video.",
    footer: "whisperwebfree.com · Arabic MP4 to MP3 tool",
  });
}
