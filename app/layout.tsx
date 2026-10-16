import { PageTransitions } from "./page-transitions";
import type { Metadata, Viewport } from "next";
import {
  googleVerification,
  metadataBase,
  organizationJsonLd,
  pageMetadata,
  SITE_NAME,
} from "./seo";
import { JsonLd } from "./json-ld";
import "./globals.css";
export const metadata: Metadata = {
  ...pageMetadata(
    "Branding, Website Design & Digital Marketing Agency in India | Visionpact Flamingo Media",
    "Visionpact Flamingo Media is a creative agency in India for logo design, branding, website development, social media marketing, video and AI content. Clear INR pricing.",
    "/",
  ),
  metadataBase,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Design and marketing services",
  icons: { icon: "/favicon.svg" },
  // Let search results show large image previews and full text snippets.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  ...(googleVerification && { verification: { google: googleVerification } }),
};
export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark light",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <head>
        <link
          rel="preload"
          href="/fonts/manrope.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <JsonLd data={organizationJsonLd} />
      </head>
      <body>
        <PageTransitions>{children}</PageTransitions>
      </body>
    </html>
  );
}
