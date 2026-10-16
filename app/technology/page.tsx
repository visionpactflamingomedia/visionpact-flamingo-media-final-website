import SitePage from "../site-page";
import { JsonLd } from "../json-ld";
import { breadcrumbJsonLd, pageMetadata } from "../seo";
export const metadata = pageMetadata(
  "AI Content Creation, AI Video & Marketing Automation | Visionpact Flamingo Media",
  "AI-assisted social posts, product visuals, presenter videos, dubbing, website chatbots and workflow automation, guided by people and reviewed before delivery.",
  "/technology",
  ["AI content creation services", "AI video production India", "AI chatbot for website", "marketing automation services"],
);
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("AI & Technology", "/technology")} />
      <SitePage view="technology" />
    </>
  );
}