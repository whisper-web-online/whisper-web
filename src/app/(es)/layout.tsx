import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/seo/root-document";
import { BASE_METADATA } from "@/lib/seo/site";
import "../globals.css";

export const metadata: Metadata = BASE_METADATA;

/**
 * 为西班牙语工具页提供西语根文档。
 */
export default function SpanishRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
