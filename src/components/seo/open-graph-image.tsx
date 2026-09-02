import { ImageResponse } from "next/og";

export const OPEN_GRAPH_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

interface OpenGraphImageOptions {
  eyebrow: string;
  title: string;
  description: string;
  direction?: "ltr" | "rtl";
  footer?: string;
}

/**
 * 生成与页面主题一致的 Whisper Web 社交分享图片。
 */
export function createOpenGraphImage({
  eyebrow,
  title,
  description,
  direction = "ltr",
  footer = "whisperwebfree.com · Local browser transcription",
}: OpenGraphImageOptions): ImageResponse {
  return new ImageResponse(
    (
      <div
        dir={direction}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#080a09",
          color: "#f4f6f1",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div
            style={{
              width: 50,
              height: 50,
              border: "4px solid #c6f432",
              borderRadius: 25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c6f432",
              fontSize: 26,
            }}
          >
            W
          </div>
          Whisper Web
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 980 }}>
          <div style={{ color: "#c6f432", fontSize: 24, fontWeight: 700, textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.04, letterSpacing: "-2px" }}>
            {title}
          </div>
          <div style={{ color: "#b8bcb5", fontSize: 27, lineHeight: 1.35 }}>{description}</div>
        </div>
        <div style={{ display: "flex", color: "#8d948b", fontSize: 20 }}>
          {footer}
        </div>
      </div>
    ),
    OPEN_GRAPH_IMAGE_SIZE,
  );
}
