import SitePage from "../site-page";
import { JsonLd } from "../json-ld";
import { breadcrumbJsonLd, pageMetadata } from "../seo";
export const metadata = pageMetadata(
  "Branding, Website & AI Design Portfolio | Visionpact Flamingo Media",
  "Studio concepts in brand identity, social media design, dashboards, websites and AI video, and the clients we design for, from startups to restaurants.",
  "/work",
  ["branding portfolio", "website design portfolio", "brand identity examples", "dashboard UI design", "social media design"],
);
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Work", "/work")} />
      <SitePage view="work" />
    </>
  );
}