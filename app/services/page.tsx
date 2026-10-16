import SitePage from "../site-page";
import { services } from "../content";
import { JsonLd } from "../json-ld";
import { breadcrumbJsonLd, pageMetadata } from "../seo";
const offerCount = services.reduce((n, s) => n + s.offers.length, 0);
export const metadata = pageMetadata(
  "Logo Design, Website Development & Social Media Marketing Services in India | Visionpact",
  `${offerCount} services across ${services.length} disciplines: logo and brand identity design, website and dashboard development, social media marketing, video editing and AI content.`,
  "/services",
  [
    "logo design services in India",
    "website development services",
    "social media management services",
    "video editing services",
    "AI content creation services",
    "ecommerce website development",
    "dashboard development",
  ],
);
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Services", "/services")} />
      <SitePage view="services" />
    </>
  );
}
