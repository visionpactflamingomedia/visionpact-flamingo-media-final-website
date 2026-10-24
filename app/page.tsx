import SitePage from "./site-page";
import { pageMetadata } from "./seo";
export const metadata = pageMetadata(
  "Visionpact Flamingo Media | Branding, Website Design & Digital Marketing Agency in India",
  "Visionpact Flamingo Media is a creative agency in India for logo design, branding, website development, social media marketing, video editing and AI content.",
  "/",
  ["creative agency", "brand identity design", "website development company", "AI content creation"],
);
export default function Page() {
  return <SitePage view="home" />;
}