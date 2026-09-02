import { Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import type { UiLocale } from "@/i18n/ui-copy";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

interface RootDocumentProps {
  children: ReactNode;
  locale: UiLocale;
}

/**
 * 为不同语言的根路由输出正确的 HTML 语言和文字方向。
 */
export function RootDocument({ children, locale }: RootDocumentProps) {
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={spaceGrotesk.variable} data-clarity-mask="true">{children}</body>
      <AnalyticsScripts />
    </html>
  );
}
