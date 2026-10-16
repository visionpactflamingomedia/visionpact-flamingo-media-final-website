import SitePage from "./site-page";
import { pageMetadata } from "./seo";
export const metadata = pageMetadata(
  "Branding, Website Design & Digital Marketing Agency in India | Visionpact Flamingo Media",
  "Creative agency in India for logo design, branding, website development, social media marketing, video editing and AI content. Clear INR pricing, one team.",
  "/",
  ["creative agency", "brand identity design", "website development company", "AI content creation"],
);
export default function Page() {
  return <SitePage view="home" />;
}