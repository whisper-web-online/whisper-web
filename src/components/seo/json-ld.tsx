interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * 安全输出与页面可见内容一致的 JSON-LD 数据。
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
