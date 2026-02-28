import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { getToken } from "@/lib/auth-server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://quickinfographics.com";
const OG_IMAGE = "https://deifos.github.io/images/quickinfographics-banner.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "QuickInfographics — Turn YouTube Videos into Infographics",
    template: "%s | QuickInfographics",
  },
  description:
    "Paste a YouTube link, pick a style, and get a stunning AI-generated infographic in seconds. 6 visual styles, 3 aspect ratios, powered by Gemini AI.",
  keywords: [
    "youtube to infographic",
    "AI infographic generator",
    "video to infographic",
    "infographic maker",
    "youtube summarizer",
    "AI image generator",
    "quick infographics",
  ],
  authors: [{ name: "Vlad", url: "https://vladpalacio.com" }],
  creator: "Vlad",
  openGraph: {
    title: "QuickInfographics — Turn YouTube Videos into Infographics",
    description:
      "Paste a YouTube link, pick a style, and get a stunning AI-generated infographic in seconds. 6 visual styles, 3 aspect ratios, powered by Gemini AI.",
    url: SITE_URL,
    siteName: "QuickInfographics",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "QuickInfographics — Turn any YouTube video into a beautiful infographic with AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickInfographics — Turn YouTube Videos into Infographics",
    description:
      "Paste a YouTube link, pick a style, and get a stunning AI-generated infographic in seconds. Powered by Gemini AI.",
    images: [OG_IMAGE],
    creator: "@deifosv",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const token = await getToken();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ConvexClientProvider initialToken={token}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
