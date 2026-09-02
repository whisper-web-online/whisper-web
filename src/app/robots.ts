import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";

export const dynamic = "force-static";

/**
 * 允许抓取公开页面，并声明唯一 sitemap 入口。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/cdn-cgi/" },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: "/cdn-cgi/" },
      { userAgent: "GPTBot", allow: "/", disallow: "/cdn-cgi/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
