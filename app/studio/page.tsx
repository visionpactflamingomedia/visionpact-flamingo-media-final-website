import SitePage from "../site-page";
import { JsonLd } from "../json-ld";
import { breadcrumbJsonLd, pageMetadata } from "../seo";
export const metadata = pageMetadata(
  "About Us | Creative & Digital Marketing Agency in India | Visionpact Flamingo Media",
  "A creative and digital marketing agency in India bringing design, websites, social media and AI together, with transparent pricing and human-reviewed work.",
  "/studio",
  ["about Visionpact Flamingo Media", "design studio India", "creative team"],
);
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("About", "/studio")} />
      <SitePage view="studio" />
    </>
  );
}