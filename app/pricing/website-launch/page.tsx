import SitePage from "../../site-page";
import { JsonLd } from "../../json-ld";
import { platformOffers, services, websiteFaqs } from "../../content";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "../../seo";
// The description quotes live prices from app/content.ts, so it never goes stale.
const offers = services.flatMap((s) => s.offers);
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const websitePrices = (services.find((s) => s.name === "Websites & Digital Experiences")?.offers ?? [])
  .filter(([name, , unit]) => unit === "project" && !platformOffers.includes(name))
  .map(([, price]) => price);
const platformPrices = offers.filter(([name]) => platformOffers.includes(name)).map(([, price]) => price);
export const metadata = pageMetadata(
  "Website Design Cost in India: Every Website Type & Price (₹) | Visionpact",
  `Websites from ${inr(Math.min(...websitePrices))} to ${inr(Math.max(...websitePrices))}: landing pages, business websites, online stores, booking, course and real estate websites. AI dashboards and business platforms from ${inr(Math.min(...platformPrices))} to ${inr(Math.max(...platformPrices))}.`,
  "/pricing/website-launch",
  ["website design cost in India", "website development price India", "ecommerce website cost India", "AI dashboard development India", "business management software India"],
);
export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Website pricing", "/pricing/website-launch")} />
      <JsonLd data={faqJsonLd(websiteFaqs)} />
      <SitePage view="pricing" subpage="website-launch" />
    </>
  );
}
