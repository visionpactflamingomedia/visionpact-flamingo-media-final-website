"use client";
import { useId } from "react";
import type { Concept } from "./content";

// Waveform bar heights (0-1); delays are derived from the index.
const wave = [
  0.35, 0.6, 0.9, 0.5, 0.75, 1, 0.45, 0.8, 0.55, 0.95, 0.4, 0.7, 0.85, 0.5,
  0.65, 1, 0.45, 0.75, 0.6, 0.9, 0.4, 0.7, 0.55, 0.85, 0.5, 0.35,
];
const languages = [
  ["EN", "English", "Meet the new collection."],
  ["HI", "Hindi", "नए कलेक्शन से मिलिए।"],
  ["ES", "Spanish", "Conoce la nueva colección."],
  ["FR", "French", "Découvrez la nouvelle collection."],
] as const;

function PresenterConcept() {
  return (
    <div className="presenter-concept" aria-hidden="true">
      <span className="pc-chip pc-live">
        <i /> Live preview
      </span>
      <div className="pc-card pc-langs">
        <small>Languages</small>
        {languages.map(([code, name], n) => (
          <span key={code} style={{ "--n": n } as React.CSSProperties}>
            <b>{code}</b> {name}
            <em>✓</em>
          </span>
        ))}
      </div>
      <div className="pc-card pc-settings">
        <small>Presenter</small>
        {["Lip-sync", "Subtitles", "Brand voice"].map((label) => (
          <span key={label}>
            {label}
            <i className="pc-toggle" />
          </span>
        ))}
        <strong>✦ Export all</strong>
      </div>
      <div className="pc-stage">
        <span className="pc-ring" />
        <span className="pc-ring" />
        <div className="pc-avatar">
          <span className="pc-head" />
          <span className="pc-body" />
        </div>
        <span className="pc-spark">✦</span>
        <span className="pc-spark small">✦</span>
      </div>
      <div className="pc-wave">
        {wave.map((h, i) => (
          <i
            key={i}
            style={{ "--h": h, "--d": `${-i * 0.09}s` } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="pc-subtitle">
        <span className="pc-cc">CC</span>
        {languages.map(([code, , line], n) => (
          <span key={code} className="pc-line" style={{ "--n": n } as React.CSSProperties}>
            {line}
          </span>
        ))}
      </div>
      <span className="pc-orb" />
      <span className="pc-orb dark" />
      <span className="pc-chip pc-done">
        <i>✦</i> Dubbed in 4 languages
      </span>
    </div>
  );
}

const palette = [
  ["Saffron", "#FFA45F"],
  ["Ember", "#D9541E"],
  ["Masala", "#2A1A12"],
  ["Milk", "#FFF4E6"],
] as const;

function BrandBoardConcept() {
  // Unique id: the visual can appear twice at once (card and dialog).
  const ring = "ring" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div className="brand-board" aria-hidden="true">
      <span className="bb-chip bb-guide">Brand guidelines · v1.0</span>
      <div className="bb-book">
        <span className="bb-mark">S&amp;</span>
        <strong>SAFFRON &amp; CO.</strong>
        <small>Modern chai house</small>
        <span className="bb-dots">
          {palette.map(([name, hex]) => (
            <i key={name} style={{ background: hex }} />
          ))}
        </span>
      </div>
      <div className="bb-palette">
        {palette.map(([name, hex], n) => (
          <span
            key={name}
            style={{ background: hex, "--n": n } as React.CSSProperties}
          >
            <b>{name}</b>
            {hex}
          </span>
        ))}
      </div>
      <div className="bb-type">
        <strong>Aa</strong>
        <span>Manrope</span>
        <small>Bold · Medium · Regular</small>
      </div>
      <div className="bb-cup">
        <span className="bb-steam" />
        <span className="bb-steam" />
        <span className="bb-steam" />
        <span className="bb-lid" />
        <span className="bb-body">
          <i>S</i>
        </span>
      </div>
      <div className="bb-seal">
        <svg viewBox="0 0 100 100">
          <defs>
            <path
              id={ring}
              d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
            />
          </defs>
          <text>
            <textPath href={`#${ring}`} textLength="236" lengthAdjust="spacing">
              MODERN CHAI HOUSE · FRESHLY BREWED · SAFFRON &amp; CO ·
            </textPath>
          </text>
        </svg>
        <span>S</span>
      </div>
      <span className="bb-orb" />
      <span className="bb-orb dark" />
      <span className="bb-chip bb-scope">
        <i>✦</i> Logo · Colour · Type · Packaging
      </span>
    </div>
  );
}

// Illustrative figures for a concept screen, not real business data.
const kpis = [
  ["Revenue", "₹4.8L", "+12%"],
  ["Orders", "1,284", "+8%"],
  ["Conversion", "3.6%", "+0.4"],
] as const;
const dayBars = [0.45, 0.62, 0.38, 0.8, 0.56, 0.92, 0.7];
const orders = [
  ["#1042", "Asha R.", "Paid"],
  ["#1041", "Kunal M.", "Shipped"],
  ["#1040", "Neha S.", "Pending"],
] as const;
const trend =
  "M0,55 C20,50 30,40 50,42 S80,30 100,34 S130,18 150,22 S180,8 200,10";

function DashboardConcept() {
  const fill = "fill" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div className="dash-concept" aria-hidden="true">
      <span className="dc-chip dc-live">
        <i /> Live data
      </span>
      <div className="dc-app">
        <div className="dc-side">
          <b>
            <i /> Pulse
          </b>
          {["Overview", "Orders", "Customers", "Reports", "Settings"].map(
            (item, k) => (
              <span key={item} className={k === 0 ? "on" : undefined}>
                {item}
              </span>
            ),
          )}
        </div>
        <div className="dc-main">
          <div className="dc-top">
            <strong>Sales overview</strong>
            <span>This month ▾</span>
            <i className="dc-avatar" />
          </div>
          <div className="dc-kpis">
            {kpis.map(([label, value, change]) => (
              <div key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
                <em>{change}</em>
              </div>
            ))}
          </div>
          <div className="dc-charts">
            <div className="dc-card">
              <small>Revenue trend</small>
              <svg viewBox="0 0 200 70" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={fill} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#ffa45f" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#ffa45f" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${trend} L200,70 L0,70 Z`} fill={`url(#${fill})`} />
                <path className="dc-path" d={trend} pathLength={400} />
              </svg>
            </div>
            <div className="dc-card">
              <small>Orders by day</small>
              <div className="dc-bars">
                {dayBars.map((h, n) => (
                  <i
                    key={n}
                    style={{ "--h": h, "--n": n } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="dc-table">
            {orders.map(([id, name, status]) => (
              <div key={id}>
                <span>{id}</span>
                <span>{name}</span>
                <em className={status.toLowerCase()}>{status}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="dc-chip dc-scope">
        <i>✦</i> Responsive admin dashboard
      </span>
    </div>
  );
}

function InteractionConcept() {
  return (
    <div className="digital-concept">
      <span>VISIONPACT / INTERACTION STUDY</span>
      <strong>
        Make
        <br />
        your next
        <br />
        <i>move ↗</i>
      </strong>
      <span>DESIGN THAT TAKES YOU FORWARD</span>
    </div>
  );
}

export function ConceptVisual({ concept }: { concept: Concept }) {
  if (concept.image)
    return (
      <img
        src={concept.image}
        alt={concept.label}
        width="900"
        height="600"
        loading="lazy"
      />
    );
  if (concept.visual === "presenter") return <PresenterConcept />;
  if (concept.visual === "brandboard") return <BrandBoardConcept />;
  if (concept.visual === "dashboard") return <DashboardConcept />;
  return <InteractionConcept />;
}
