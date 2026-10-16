"use client";
import { useId } from "react";
import { clients, type Client } from "./content";

// Single-colour logo marks drawn with currentColor so they follow the
// site's warm grey / orange palette instead of each brand's own colours.
function Mark({ name, uid }: { name: Client; uid: string }) {
  switch (name) {
    case "Google":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      );
    case "Microsoft":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="1.5" y="1.5" width="9.75" height="9.75" />
          <rect x="12.75" y="1.5" width="9.75" height="9.75" />
          <rect x="1.5" y="12.75" width="9.75" height="9.75" />
          <rect x="12.75" y="12.75" width="9.75" height="9.75" />
        </svg>
      );
    case "Meta":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M12 12c-2-3-4-5-6.5-5S1 9.2 1 12s2 5 4.5 5S10 15 12 12s4.5-5 6.5-5S23 9.2 23 12s-2 5-4.5 5S14 15 12 12z" />
        </svg>
      );
    case "Adobe":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm6.232 0H24v21.248z" />
        </svg>
      );
    case "Spotify":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <mask id={`${uid}-spotify`}>
            <rect width="24" height="24" fill="#fff" />
            <g fill="none" stroke="#000" strokeLinecap="round">
              <path d="M6 9.4c4-1.3 8.6-.9 12 1.2" strokeWidth="2.1" />
              <path d="M7 12.8c3.3-1 6.8-.6 9.6 1" strokeWidth="1.8" />
              <path d="M8 16c2.6-.7 5.2-.4 7.3.8" strokeWidth="1.5" />
            </g>
          </mask>
          <circle cx="12" cy="12" r="11" mask={`url(#${uid}-spotify)`} />
        </svg>
      );
    case "Flipkart":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.5 7.5h15l-1.3 13.1a1.5 1.5 0 0 1-1.5 1.4H7.3a1.5 1.5 0 0 1-1.5-1.4z" />
          <path d="M8.5 7.5V6a3.5 3.5 0 0 1 7 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "Swiggy":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 1.5a8 8 0 0 0-8 8c0 5.8 8 13 8 13s8-7.2 8-13a8 8 0 0 0-8-8zm0 4.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4z" />
        </svg>
      );
    default:
      return null;
  }
}

function Logo({ name, uid }: { name: Client; uid: string }) {
  return (
    <span className={`client-logo logo-${name.toLowerCase()}`} role="img" aria-label={name}>
      <Mark name={name} uid={uid} />
      <span aria-hidden="true">{name === "Amazon" ? "amazon" : name === "Zomato" ? "zomato" : name}</span>
      {name === "Amazon" && (
        <svg className="amazon-smile" viewBox="0 0 64 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4.5c15 8.5 37 9.5 54 1.5" />
          <path d="M51 2.4l7 2.8-3.4 6" />
        </svg>
      )}
    </span>
  );
}

export function ClientMarquee({ label = "Brands we work with" }: { label?: string }) {
  const uid = "c" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div className="client-marquee">
      <div className="client-track">
        <ul className="client-list" aria-label={label}>
          {clients.map((name) => (
            <li key={name}>
              <Logo name={name} uid={`${uid}a`} />
            </li>
          ))}
        </ul>
        <ul className="client-list" aria-hidden="true">
          {clients.map((name) => (
            <li key={name}>
              <Logo name={name} uid={`${uid}b`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Shown instead of the brand logos when `clients` in app/content.ts is empty:
// the same moving line, naming the platforms the studio actually works on
// (every one appears in the service list). Plain text, no brand logos.
const platforms = [
  "Google Ads",
  "Meta Ads",
  "Instagram",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "X (Twitter)",
  "Amazon Ads",
];

export function PlatformMarquee({ label = "Platforms we work on" }: { label?: string }) {
  const list = (hidden: boolean) => (
    <ul className="client-list" aria-label={hidden ? undefined : label} aria-hidden={hidden || undefined}>
      {platforms.map((name) => (
        <li key={name}>
          <span className="client-logo platform-item">
            <i aria-hidden="true">✳</i>
            <span>{name}</span>
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="client-marquee">
      <div className="client-track">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
