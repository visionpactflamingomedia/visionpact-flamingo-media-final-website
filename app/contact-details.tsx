import { Mail, Phone } from "lucide-react";
import { contact } from "./content";

// lucide-react no longer ships brand icons, so these are drawn in the same
// 24px outline style as the Mail and Phone icons.
function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// Round email / LinkedIn / Instagram buttons.
export function SocialLinks() {
  return (
    <div className="social-links">
      <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.email}`}>
        <Mail size={18} aria-hidden="true" />
      </a>
      <a href={contact.linkedin} {...external} aria-label="Visionpact on LinkedIn (opens in a new tab)">
        <LinkedinIcon size={18} />
      </a>
      <a href={contact.instagram} {...external} aria-label="Visionpact on Instagram (opens in a new tab)">
        <InstagramIcon size={18} />
      </a>
    </div>
  );
}

// Contact page: direct ways to reach the studio.
export function ContactList() {
  return (
    <div className="contact-direct">
      <p className="contact-direct-title">Prefer to reach us directly?</p>
      <a className="contact-item" href={`mailto:${contact.email}`}>
        <span className="ci-icon">
          <Mail size={20} aria-hidden="true" />
        </span>
        <span>
          <small>Email us</small>
          {/* <wbr> lets a narrow screen wrap the address before the "@". */}
          <strong>
            {contact.email.split("@")[0]}
            <wbr />@{contact.email.split("@")[1]}
          </strong>
        </span>
      </a>
      <div className="contact-item">
        <span className="ci-icon">
          <Phone size={20} aria-hidden="true" />
        </span>
        <span>
          <small>Call us</small>
          <strong>
            {contact.phones.map((p, i) => (
              <span key={p.href}>
                {i > 0 && <i aria-hidden="true"> · </i>}
                <a href={p.href}>{p.label}</a>
              </span>
            ))}
          </strong>
        </span>
      </div>
      <div className="contact-socials">
        <a className="contact-item" href={contact.linkedin} {...external}>
          <span className="ci-icon">
            <LinkedinIcon />
          </span>
          <span>
            <small>Follow us</small>
            <strong>LinkedIn</strong>
          </span>
        </a>
        <a className="contact-item" href={contact.instagram} {...external}>
          <span className="ci-icon">
            <InstagramIcon />
          </span>
          <span>
            <small>Follow us</small>
            <strong>Instagram</strong>
          </span>
        </a>
      </div>
    </div>
  );
}
