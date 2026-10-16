import SitePage from "../site-page";
import { JsonLd } from "../json-ld";
import { breadcrumbJsonLd, pageMetadata } from "../seo";
export const metadata = pageMetadata(
  "Contact Us for a Quote | Branding & Digital Marketing Agency in India | Visionpact",
  "Get a quote for logo design, a website, social media marketing or AI content. Email visionpactflamingomedia@gmail.com or call +91 76890 03646.",
  "/contact",
  ["get a website quote", "hire branding agency", "hire digital marketing agency India"],
);
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Contact", "/contact")} />
      <SitePage view="contact" />
    </>
  );
}