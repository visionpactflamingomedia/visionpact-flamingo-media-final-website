import SitePage from "../site-page";
import { JsonLd } from "../json-ld";
import { priceForSelection, pricingFaqs, services } from "../content";
import { breadcrumbJsonLd, faqJsonLd, offerCatalogJsonLd, pageMetadata } from "../seo";
// The description quotes live prices from app/content.ts, so it never goes stale.
const inr = (n = 0) => `₹${n.toLocaleString("en-IN")}`;
const websitesFrom = Math.min(
  ...(services.find((s) => s.name === "Websites & Digital Experiences")?.offers ?? [])
    .filter(([, , unit]) => unit === "project")
    .map(([, price]) => price),
);
export const metadata = pageMetadata(
  "Logo Design, Website & Social Media Marketing Prices in India (₹) | Visionpact",
  `Starting prices in rupees: logo design from ${inr(priceForSelection("Logo & visual identity")?.price)}, websites from ${inr(websitesFrom)} and social media management from ${inr(priceForSelection("Social media account management")?.price)} a month. Every scope spelled out.`,
  "/pricing",
  ["logo design price in India", "website design cost in India", "social media marketing packages India", "branding packages India", "website development price"],
);
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Pricing", "/pricing")} />
      <JsonLd data={offerCatalogJsonLd} />
      <JsonLd data={faqJsonLd(pricingFaqs)} />
      <SitePage view="pricing" />
    </>
  );
}