import type { Metadata } from "next";
import { LargeFileToolPage } from "@/features/transcription/components/large-file-tool-page";
import {
  createPageMetadata,
  LARGE_FILE_LANGUAGE_ALTERNATES,
  SEO_PAGES,
} from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata(
  SEO_PAGES.largeFileTranscription,
  LARGE_FILE_LANGUAGE_ALTERNATES,
);

/**
 * 渲染承接 large file transcription 意图的英文分段转录页。
 */
export default function LargeFileTranscriptionRoute() {
  return <LargeFileToolPage locale="en" />;
}
