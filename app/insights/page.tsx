import SitePage from "../site-page";
import { JsonLd } from "../json-ld";
import { breadcrumbJsonLd, pageMetadata } from "../seo";
export const metadata = pageMetadata(
  "Branding, Web Design & AI Marketing Insights | Visionpact Flamingo Media",
  "Practical notes on brand identity systems, websites that make the next step clear, and using AI in marketing with a human point of view.",
  "/insights",
  ["branding tips", "website design tips", "AI in marketing"],
);
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Insights", "/insights")} />
      <SitePage view="insights" />
    </>
  );
}