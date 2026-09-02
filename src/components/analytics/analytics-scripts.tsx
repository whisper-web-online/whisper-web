import Script from "next/script";

/**
 * 读取符合格式的公开环境变量；无效值按未配置处理，避免注入脚本内容。
 */
function readPublicIdentifier(value: string | undefined, pattern: RegExp): string | null {
  const normalized = value?.trim();
  return normalized && pattern.test(normalized) ? normalized : null;
}

/**
 * 读取 HTTPS 统计脚本地址；开源版本默认不连接任何统计服务。
 */
function readHttpsScriptUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * 仅加载部署者通过公开环境变量显式配置的统计脚本。
 */
export function AnalyticsScripts() {
  const googleAnalyticsId = readPublicIdentifier(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    /^G-[A-Z0-9]+$/u,
  );
  const plausibleDomain = readPublicIdentifier(
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    /^[a-z0-9.-]+$/iu,
  );
  const plausibleScriptUrl = readHttpsScriptUrl(
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL,
  );
  const clarityProjectId = readPublicIdentifier(
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
    /^[a-z0-9]+$/iu,
  );

  if (!googleAnalyticsId && !(plausibleDomain && plausibleScriptUrl) && !clarityProjectId) {
    return null;
  }

  return (
    <>
      {googleAnalyticsId ? (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
// 将统计事件写入 Google Analytics 数据层。
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(googleAnalyticsId)});`}
          </Script>
        </>
      ) : null}

      {plausibleDomain && plausibleScriptUrl ? (
        <>
          <Script id="plausible-events" strategy="afterInteractive">
            {`// 在统计脚本加载前建立官方兼容队列，保证早期产品事件不会丢失。
window.plausible = window.plausible || function(){
  (window.plausible.q = window.plausible.q || []).push(arguments);
};`}
          </Script>
          <Script
            defer
            data-domain={plausibleDomain}
            src={plausibleScriptUrl}
            strategy="afterInteractive"
          />
        </>
      ) : null}

      {clarityProjectId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`// 初始化 Microsoft Clarity 并异步加载远程脚本。
(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(clarityProjectId)});`}
        </Script>
      ) : null}
    </>
  );
}
