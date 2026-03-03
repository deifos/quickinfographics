import Script from "next/script";

export function Analytics() {
  const websiteId = process.env.ANALYTICS_ID;
  if (!websiteId) return null;

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
