import type { Metadata } from "next";
import { contact, services } from "./content";

export const SITE_NAME = "Visionpact Flamingo Media";
// Set NEXT_PUBLIC_SITE_URL (e.g. https://www.yourdomain.com) when building for
// the live site. Canonical links, breadcrumbs and the social share image need
// an absolute URL; without it they are left out rather than pointing at localhost.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
export const metadataBase = siteUrl ? new URL(siteUrl) : undefined;
// Optional: the content value of Google Search Console's HTML-tag verification.
export const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

// Core search phrases for the whole site. Search engines rank on titles,
// headings and visible text far more than on this list; it is kept short and
// accurate rather than stuffed.
export const SITE_KEYWORDS = [
  "branding agency in India",
  "creative agency India",
  "digital marketing agency India",
  "logo design services",
  "website design company India",
  "social media marketing agency",
  "Visionpact Flamingo Media",
];

const shareImage = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Visionpact Flamingo Media logo beside a digital marketing dashboard",
};

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  keywords: string[] = [],
  { index = true }: { index?: boolean } = {},
): Metadata {
  return {
    title,
    description,
    keywords: [...keywords, ...SITE_KEYWORDS],
    ...(!index && { robots: { index: false, follow: true } }),
    ...(metadataBase && { alternates: { canonical: path } }),
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      ...(metadataBase && { url: path, images: [shareImage] }),
    },
    twitter: {
      card: metadataBase ? "summary_large_image" : "summary",
      title,
      description,
      ...(metadataBase && { images: [shareImage.url] }),
    },
  };
}

const allOffers = services.flatMap((s) => s.offers);
const prices = allOffers.map(([, price]) => price);
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Business details (all confirmed by the owner). sameAs lists the real LinkedIn
// profile; the Instagram URL is still a demo link, so it is left out.
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      ...(siteUrl && { "@id": `${siteUrl}/#organization`, url: siteUrl }),
      name: SITE_NAME,
      alternateName: "Visionpact",
      description:
        "Branding, website design and digital marketing agency in India offering logo design, websites, social media marketing, video editing and AI-powered creative services.",
      email: contact.email,
      telephone: contact.phones.map((p) => p.href.replace("tel:", "")),
      areaServed: { "@type": "Country", name: "India" },
      currenciesAccepted: "INR",
      priceRange: `${inr(Math.min(...prices))} – ${inr(Math.max(...prices))}`,
      knowsAbout: services.map((s) => s.name),
      sameAs: [contact.linkedin],
      ...(siteUrl && {
        logo: `${siteUrl}/images/visionpact-logo.webp`,
        image: `${siteUrl}/images/og-image.jpg`,
      }),
    },
    {
      "@type": "WebSite",
      ...(siteUrl && { "@id": `${siteUrl}/#website`, url: siteUrl }),
      name: SITE_NAME,
      inLanguage: "en-IN",
    },
  ],
};

// Pricing page: every service with its published starting price.
export const offerCatalogJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Creative, digital and AI services with starting prices in India",
  itemListElement: services.map((s) => ({
    "@type": "OfferCatalog",
    name: s.name,
    description: s.detail,
    itemListElement: s.offers.map(([name, price, unit, scope]) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, description: scope },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: "INR",
        unitText: unit,
        description: "Starting price",
      },
      areaServed: { "@type": "Country", name: "India" },
    })),
  })),
};

export function faqJsonLd(faqs: readonly (readonly [string, string])[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

// Home > Page breadcrumbs, shown by Google in results. Needs the live URL.
export function breadcrumbJsonLd(name: string, path: string) {
  if (!siteUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name, item: `${siteUrl}${path}` },
    ],
  };
}
