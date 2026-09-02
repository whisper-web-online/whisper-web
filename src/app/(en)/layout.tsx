import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/seo/root-document";
import { BASE_METADATA } from "@/lib/seo/site";
import "../globals.css";

export const metadata: Metadata = BASE_METADATA;

/**
 * 为英文首页和指南提供英文根文档。
 */
export default function EnglishRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
