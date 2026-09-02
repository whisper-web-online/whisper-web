import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/seo/root-document";
import { BASE_METADATA } from "@/lib/seo/site";
import "../globals.css";

export const metadata: Metadata = BASE_METADATA;

/**
 * 为阿拉伯语页面提供 RTL 根文档；具体索引状态由各页面 metadata 决定。
 */
export default function ArabicRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale="ar">{children}</RootDocument>;
}
