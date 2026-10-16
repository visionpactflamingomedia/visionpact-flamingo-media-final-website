"use client";
import { ArrowLeft, ArrowUpRight, Check, Clock3, Plus, Sparkles } from "lucide-react";
import {
  packages,
  platformOffers,
  services,
  websiteFaqs,
  websiteIncluded,
  websiteSeparate,
  websiteTypeDetails,
} from "./content";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

// Every website offer and AI platform from the price list, merged with its
// brief details from app/content.ts.
const allOffers = services
  .flatMap((s) => s.offers)
  .filter(([name]) => websiteTypeDetails[name])
  .map(([name, price, unit, scope]) => ({
    name,
    price,
    unit,
    scope,
    ...websiteTypeDetails[name],
  }));
// Website types: one-time builds, cheapest first.
const builds = allOffers
  .filter((o) => o.unit === "project" && !platformOffers.includes(o.name))
  .sort((a, b) => a.price - b.price);
// AI dashboards & platforms, in the order set in content.ts.
const platforms = platformOffers.flatMap((name) =>
  allOffers.filter((o) => o.name === name),
);
const care = allOffers.filter((o) => o.unit !== "project");
const launch = packages.find((p) => p.name === "Website launch")!;
// The size most local businesses need; highlighted as the suggested start.
const recommended = "Business website design & development";

type Offer = (typeof allOffers)[number];

function OfferCard({
  offer,
  onChoose,
  badge,
  className = "",
}: {
  offer: Offer;
  onChoose: () => void;
  badge?: string;
  className?: string;
}) {
  return (
    <article className={`web-type spotlight ${className}`}>
      <div className="web-type-head">
        <h4>{offer.title}</h4>
        {badge && <span className="web-badge">{badge}</span>}
      </div>
      <p className="web-type-for">{offer.bestFor}</p>
      <div className="rate-price">
        <small>From</small>
        <strong>{money(offer.price)}</strong>
        <span>/ {offer.unit}</span>
      </div>
      <ul>
        {offer.includes.map((item) => (
          <li key={item}>
            <Check size={15} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <p className="web-type-time">
        <Clock3 size={14} aria-hidden="true" /> Typical timeline: {offer.timeline}
      </p>
      <button className="button" onClick={onChoose}>
        Discuss this {platformOffers.includes(offer.name) ? "project" : "website"}{" "}
        <ArrowUpRight size={16} />
      </button>
    </article>
  );
}

export function WebsitePricing({
  onSelect,
}: {
  onSelect: (selection: string) => void;
}) {
  const choose = (name: string, price: number, unit: string) =>
    onSelect(`${name} — from ${money(price)} / ${unit}`);
  const low = builds[0];
  const high = builds[builds.length - 1];
  const pLow = platforms[0];
  const pHigh = platforms[platforms.length - 1];
  return (
    <section
      className="section pricing light web-pricing"
      aria-labelledby="web-pricing-title"
    >
      <a className="web-back" href="/pricing">
        <ArrowLeft size={16} aria-hidden="true" /> All packages & rates
      </a>
      <div className="section-heading reveal">
        <p className="eyebrow">Pricing / Website launch</p>
        <h1 className="page-title" id="web-pricing-title">
          Website launch.
          <br />
          <span>Every website, priced.</span>
        </h1>
        <p>
          Websites from {money(low.price)} to {money(high.price)}, and AI
          dashboards and business platforms from {money(pLow.price)} to{" "}
          {money(pHigh.price)}. Each card shows who it suits, what is included,
          how long it usually takes and the starting price.
        </p>
      </div>

      <div className="web-summary">
        <div className="web-summary-main">
          <p className="package-label">{launch.label}</p>
          <h2>The Website launch package</h2>
          <p>{launch.description}</p>
          <div className="package-price">
            <span>Starting at</span>
            <strong>{money(launch.price)}</strong>
            <span>{launch.unit}</span>
          </div>
        </div>
        <div className="web-summary-list">
          <ul>
            {launch.items.map((item) => (
              <li key={item}>
                <Check size={17} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="package-note">{launch.note}</p>
          <button
            className="button pink"
            onClick={() => choose(launch.name, launch.price, launch.unit)}
          >
            Discuss this package <ArrowUpRight size={17} />
          </button>
        </div>
        <dl className="web-summary-range">
          <div>
            <dt>Websites</dt>
            <dd>
              {money(low.price)} – {money(high.price)}
            </dd>
          </div>
          <div>
            <dt>AI dashboards & platforms</dt>
            <dd>
              {money(pLow.price)} – {money(pHigh.price)}
            </dd>
          </div>
          {care[0] && (
            <div>
              <dt>Care after launch</dt>
              <dd>
                {money(care[0].price)} / {care[0].unit}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="rate-heading">
        <div>
          <p className="eyebrow">Types of websites we build</p>
          <h3>
            {builds.length} website types, {money(low.price)} to{" "}
            {money(high.price)}.
          </h3>
          <p>Sorted from the smallest build to the largest.</p>
        </div>
      </div>
      <div className="web-types">
        {builds.map((t) => (
          <OfferCard
            key={t.name}
            offer={t}
            badge={t.name === recommended ? "Recommended" : undefined}
            className={t.name === recommended ? "is-launch" : ""}
            onChoose={() => choose(t.name, t.price, t.unit)}
          />
        ))}
        <article className="web-type web-type-custom">
          <h4>Need something different?</h4>
          <p>
            Multi-language sites, membership areas or a mix of the types above.
            Tell us what the website must do and we’ll quote it.
          </p>
          <button
            className="button pink"
            onClick={() => onSelect("Website — custom website quote")}
          >
            Request a custom quote <ArrowUpRight size={16} />
          </button>
        </article>
      </div>

      <div className="web-platforms">
        <div className="web-platforms-head">
          <div>
            <p className="eyebrow">
              <Sparkles size={14} aria-hidden="true" /> AI dashboards & platforms
            </p>
            <h3>
              Software for running your business, {money(pLow.price)} to{" "}
              {money(pHigh.price)}.
            </h3>
          </div>
          <p>
            When a website is not enough: dashboards that explain your numbers,
            AI features for your visitors, and platforms your team works in
            every day.
          </p>
        </div>
        <div className="web-platform-grid">
          {platforms.map((t) => (
            <OfferCard
              key={t.name}
              offer={t}
              className="is-platform"
              onChoose={() => choose(t.name, t.price, t.unit)}
            />
          ))}
        </div>
      </div>

      {care.map((c) => (
        <div className="web-care" key={c.name}>
          <div>
            <p className="eyebrow">After launch</p>
            <h4>{c.title}</h4>
            <p>{c.includes.join(" · ")}</p>
          </div>
          <div className="rate-price">
            <small>From</small>
            <strong>{money(c.price)}</strong>
            <span>/ {c.unit}</span>
          </div>
          <button
            className="button"
            onClick={() => choose(c.name, c.price, c.unit)}
          >
            Add a care plan <ArrowUpRight size={16} />
          </button>
        </div>
      ))}

      <div className="web-basics">
        <div>
          <h4>Included with every website</h4>
          <ul>
            {websiteIncluded.map((x) => (
              <li key={x}>
                <Check size={16} aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Paid separately</h4>
          <ul>
            {websiteSeparate.map((x) => (
              <li key={x}>
                <Plus size={16} aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pricing-details">
        {websiteFaqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <Plus size={18} aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>

      <div className="custom-brief">
        <p>
          Not sure which type fits?
          <br />
          <strong>Tell us what the website must do. We’ll suggest the right build.</strong>
        </p>
        <button
          className="button"
          onClick={() => onSelect("Website — help me choose the right type")}
        >
          Request a website quote <ArrowUpRight size={18} />
        </button>
      </div>
    </section>
  );
}
