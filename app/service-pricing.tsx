"use client";
import { useState } from "react";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { packages, pricingFaqs, services } from "./content";
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
export function CreativeServices() {
  return (
    <section
      className="creative-services section light"
      aria-labelledby="creative-heading"
    >
      <div className="creative-intro">
        <p className="eyebrow">Made for your next chapter</p>
        <h2 id="creative-heading">
          From everyday content
          <br />
          to <span>extraordinary ideas.</span>
        </h2>
      </div>
      <div className="creative-pair">
        <article>
          <div className="creative-image">
            <img
              src="/images/dm-content-calendar.webp"
              alt="A content calendar with coordinated social campaign posts, stories and banners"
              width={1536}
              height={1024}
              loading="lazy"
            />
            <span>Social media & content planning</span>
          </div>
          <div className="creative-caption">
            <span>DESIGN / CONTENT / CELEBRATIONS</span>
            <h3>Your story. Every format.</h3>
            <p>
              Social feeds, professional profiles, print materials and special
              occasions — thoughtful design wherever your story appears.
            </p>
            <a href="/pricing">
              Explore creative services <ArrowUpRight size={18} />
            </a>
          </div>
        </article>
        <article>
          <div className="creative-image">
            <img
              src="/images/dm-ai-automation.webp"
              alt="A marketing automation workflow with email, retargeting, lead scoring and a website chat assistant"
              width={1536}
              height={1024}
              loading="lazy"
            />
            <span>AI marketing automation</span>
          </div>
          <div className="creative-caption">
            <span>AI VISUALS / MOTION / SMART TOOLS</span>
            <h3>New tools. A human point of view.</h3>
            <p>
              Product imagery, digital presenters, content and automation,
              guided by the message and reviewed for the intended use.
            </p>
            <a href="/technology">
              See our AI approach <ArrowUpRight size={18} />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
export function Pricing({
  onSelect,
}: {
  onSelect: (selection: string) => void;
}) {
  const [category, setCategory] = useState(0);
  const selected = category === -1 ? services : [services[category]];
  return (
    <section
      className="section pricing light"
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="section-heading reveal">
        <p className="eyebrow">06 / Services & pricing</p>
        <h1 className="page-title" id="pricing-title">
          Big ambition.
          <br />
          <span>A clear starting point.</span>
        </h1>
        <p>
          Clear starting prices for logo design, websites, social media
          marketing, video and AI services.
          <br />
          Start with a single creative or a focused package.
        </p>
      </div>
      <div className="pricing-notice">
        <span>INDIA PRICING · ₹ INR</span>
        <p>
          All prices below are India starting rates in Indian rupees (₹). Your
          final quote, delivery schedule and scope are confirmed before work
          begins.
        </p>
      </div>
      <h2 className="sr-only">Packages</h2>
      <div className="package-grid">
        {packages.map((p, i) => (
          <article className={`package-card package-${i} spotlight`} key={p.name}>
            <p className="package-label">{p.label}</p>
            <h3>{p.name}</h3>
            <p className="package-description">{p.description}</p>
            <div className="package-price">
              <span>From</span>
              <strong>{money(p.price)}</strong>
              <span>{p.unit}</span>
            </div>
            <ul>
              {p.items.map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="package-note">{p.note}</p>
            {/* A package with a details page opens it; the others go straight to the inquiry form. */}
            {p.details ? (
              <a className="button" href={p.details}>
                Discuss this package <ArrowUpRight size={17} />
              </a>
            ) : (
              <button
                className="button"
                onClick={() =>
                  onSelect(`${p.name} — from ${money(p.price)} / ${p.unit}`)
                }
              >
                Discuss this package <ArrowUpRight size={17} />
              </button>
            )}
          </article>
        ))}
      </div>
      <div className="rate-heading">
        <div>
          <p className="eyebrow">INDIA · INDIVIDUAL SERVICE RATES</p>
          <h3>Build your own brief.</h3>
          <p>Starting prices in ₹ INR, with each service scope spelled out.</p>
        </div>
        <label htmlFor="rate-category">
          Browse service rates
          <select
            id="rate-category"
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
          >
            {services.map((s, i) => (
              <option key={s.name} value={i}>
                {s.name}
              </option>
            ))}
            <option value={-1}>All services</option>
          </select>
        </label>
      </div>
      <div className="rate-results" aria-live="polite" aria-atomic="true">
        {category === -1 ? "All service families" : services[category].name} ·{" "}
        {selected.reduce((n, s) => n + s.offers.length, 0)} options
      </div>
      <div className="rate-menu">
        {selected.map((group) => (
          <div key={group.name} className="rate-group">
            {category === -1 && <h4>{group.name}</h4>}
            {group.offers.map(([name, price, unit, scope]) => (
              <article className="rate-row" key={name}>
                <h4>{name}</h4>
                <p>{scope}</p>
                <div className="rate-price">
                  <small>From</small>
                  <strong>{money(price)}</strong>
                  <span>/ {unit}</span>
                </div>
                <button
                  aria-label={`Request a quote for ${name}`}
                  onClick={() =>
                    onSelect(`${name} — from ${money(price)} / ${unit}`)
                  }
                >
                  <ArrowUpRight size={21} />
                </button>
              </article>
            ))}
          </div>
        ))}
      </div>
      <div className="pricing-details">
        {pricingFaqs.map(([q, a]) => (
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
          Something a little different?
          <br />
          <strong>Let’s shape the right scope together.</strong>
        </p>
        <button
          className="button"
          onClick={() => onSelect("Custom creative, digital or AI project")}
        >
          Request a custom quote <ArrowUpRight size={18} />
        </button>
      </div>
    </section>
  );
}
