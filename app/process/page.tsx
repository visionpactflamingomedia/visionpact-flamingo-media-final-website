import SitePage from "../site-page";
import { JsonLd } from "../json-ld";
import { processFaqs } from "../content";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "../seo";
export const metadata = pageMetadata(
  "Our Branding & Website Design Process | Visionpact Flamingo Media",
  "How we take a branding, website or marketing project from brief to launch in five steps, what we need from you, and the quality checks before delivery.",
  "/process",
  ["website design process", "branding process", "design agency workflow", "website development steps"],
);
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Process", "/process")} />
      <JsonLd data={faqJsonLd(processFaqs)} />
      <SitePage view="process" />
    </>
  );
}