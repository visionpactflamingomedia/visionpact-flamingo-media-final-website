"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Minus,
  Menu,
  X,
  Sparkles,
  Check,
  Play,
  Pause,
  ShieldCheck,
  Clock3,
  Handshake,
  Target,
  RefreshCw,
  FolderOpen,
  Download,
  Palette,
  SpellCheck,
  Ruler,
  MonitorSmartphone,
  MousePointerClick,
  Accessibility,
  Rocket,
  UtensilsCrossed,
  Building2,
  GraduationCap,
  ShoppingBag,
  HeartHandshake,
  UserRound,
  PartyPopper,
  Mail,
  Phone,
} from "lucide-react";

import {
  services,
  steps,
  concepts,
  contact,
  clientNeeds,
  processFaqs,
  clients,
} from "./content";
import { CreativeServices, Pricing } from "./service-pricing";
import { WebsitePricing } from "./website-pricing";
import { ClientMarquee, PlatformMarquee } from "./client-logos";
import { ConceptVisual } from "./concept-visuals";
import { ContactList, SocialLinks } from "./contact-details";
import { sendInquiryEmail } from "./inquiry-email";
import { newRequestId } from "./request-id";
import { FeedbackForm } from "./feedback-form";
import { usePageNavigation } from "./page-transitions";
const OTHER_SERVICE = "Something else / not sure yet";
// Pricing packages that are not individual offers, mapped to their service.
const packageServices: Record<string, string> = {
  "Brand essentials": "Branding & Graphic Design",
  "Social studio": "Social Media & Digital Marketing",
  "Website launch": "Websites & Digital Experiences",
};
// Pre-select the service family for an offer chosen on the pricing page.
function serviceForOffer(offer: string) {
  if (!offer) return "";
  const pkg = Object.keys(packageServices).find((p) => offer.startsWith(p));
  if (pkg) return packageServices[pkg];
  const family = services.find((s) =>
    s.offers.some(([name]) => offer.startsWith(name)),
  );
  return family ? family.name : OTHER_SERVICE;
}
type NavIndicatorPosition = { x: number; w: number } | null;
let navIndicatorFrom: NavIndicatorPosition = null;
const offerCount = services.reduce((n, s) => n + s.offers.length, 0);
const stats: [number, string, string][] = [
  [services.length, "", "Creative disciplines under one roof"],
  [offerCount, "", "Clearly scoped services and packages"],
  [5, "", "Step process, from brief to launch"],
  [100, "%", "Of AI-assisted work reviewed by people"],
];
const trustPoints = [
  [
    ShieldCheck,
    "Transparent from day one",
    "Scope, INR pricing and deliverables are agreed before work begins. No hidden costs, no surprises.",
  ],
  [
    Clock3,
    "Delivered when promised",
    "Realistic timelines, regular check-ins and a clean, organised handover with every project.",
  ],
  [
    Sparkles,
    "AI with human judgement",
    "AI helps us explore faster. People review every detail for accuracy, originality and brand fit.",
  ],
  [
    Handshake,
    "One team, end to end",
    "Strategy, design, content, development and motion: one accountable partner for the whole journey.",
  ],
] as const;
// Work page: what every project includes (restating the Pricing page scope).
const projectIncludes = [
  [Target, "A clear brief", "Goals, scope and schedule are confirmed before design starts."],
  [RefreshCw, "Revision rounds", "Consolidated feedback rounds are built into every scope."],
  [FolderOpen, "Organised files", "Editable source files where your scope includes them."],
  [Download, "Ready-to-use exports", "Final files prepared for the channels you agreed, from print to Reels."],
] as const;
// Work page: client types, each with three real offers from content.ts.
const audiences = [
  [Rocket, "Startups & small businesses", "Look established from day one, without hiring a full team.", ["Logo & identity", "Business website", "Social media management"]],
  [UtensilsCrossed, "Restaurants, cafés & hotels", "Show off the menu or rooms and make booking easy.", ["Restaurant website", "Instagram management", "Reels editing"]],
  [Building2, "Real estate", "Present every property clearly, with an easy way to enquire.", ["Listing website", "Google & Meta Ads", "Promo videos"]],
  [GraduationCap, "Education & coaching", "Explain your courses clearly and make enrolling simple.", ["Course website", "AI explainer videos", "Training presentations"]],
  [ShoppingBag, "E-commerce & D2C brands", "Product pages, visuals and ads that help people buy.", ["E-commerce website", "AI product photos", "Amazon Ads"]],
  [HeartHandshake, "NGOs & events", "Bring people together around your cause or event.", ["Event website", "Posters & flyers", "Event invitations"]],
  [UserRound, "Professionals & creators", "Present your experience and your work with confidence.", ["Resume & CV", "LinkedIn profile", "Portfolio website"]],
  [PartyPopper, "Weddings & celebrations", "Invitations your guests will remember and share.", ["Wedding invitations", "Animated invites", "Birthday cards"]],
] as const;
// Process page: the studio's pre-delivery quality checklist.
const qaChecks = [
  [Palette, "Brand consistency", "Colours, fonts, logo use and tone match your brand."],
  [SpellCheck, "Proofreading", "Spelling, names, prices and contact details checked."],
  [Ruler, "Formats and sizes", "Every export sized and named for its channel."],
  [MonitorSmartphone, "Device testing", "Websites checked on phone, tablet and desktop."],
  [MousePointerClick, "Links and forms", "Every button, link and form tested end to end."],
  [Accessibility, "Accessibility basics", "Readable contrast, image descriptions, keyboard-friendly layouts."],
] as const;

// Work page: the five steps of a website project, named for a website build.
// Timing matches a five-page business website (see /pricing/website-launch).
const websiteJourney = [
  [Target, "Kick-off", "A quick call to understand your business, customers and goals.", "Clear project brief", "Day 1–2"],
  [Ruler, "Wireframe", "We plan every page and sketch the layout before design starts.", "Sitemap & wireframe", "Day 3–5"],
  [Palette, "Design", "Your website takes shape: custom design, built for mobile and desktop.", "Live preview link", "Week 1–2"],
  [MonitorSmartphone, "Testing", "You review, we polish: speed, forms, links and Google-ready titles.", "Approved final site", "Week 2–3"],
  [Rocket, "Go live", "Connected to your domain, with 14 days of bug fixes included.", "Live site + support", "Launch day"],
] as const;

// Feedback section, used on /process and /feedback.
function FeedbackPanel({
  onPrivacy,
  pageHeading = false,
}: {
  onPrivacy: () => void;
  pageHeading?: boolean;
}) {
  const Heading = pageHeading ? "h1" : "h2";
  return (
    <div className="feedback-block" id="feedback">
      <div className="feedback-copy">
        <p className="eyebrow">Client feedback</p>
        <Heading>
          Worked with us?
          <br />
          <em>Tell us how it went.</em>
        </Heading>
        <p>
          Your feedback goes straight to the studio. It helps us improve and,
          only with your permission, helps future clients choose with confidence.
        </p>
        <ul>
          <li>
            <Check size={16} aria-hidden="true" /> Takes about a minute
          </li>
          <li>
            <Check size={16} aria-hidden="true" /> Email is optional
          </li>
          <li>
            <Check size={16} aria-hidden="true" /> Quoted only with your permission
          </li>
        </ul>
      </div>
      <FeedbackForm onPrivacy={onPrivacy} />
    </div>
  );
}
function stillMotion() {
  try {
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("visionpact-motion") === "false"
    );
  } catch {
    return false;
  }
}
// Motion preference: "system" when the OS asks for reduced motion, otherwise
// the visitor's on/off choice for this browser session. Read with
// useSyncExternalStore so server and client renders stay consistent.
type MotionState = "on" | "off" | "system";
const MOTION_KEY = "visionpact-motion";
const motionListeners = new Set<() => void>();
let motionChoice: boolean | null = null; // fallback when storage is blocked
function readMotion(): MotionState {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return "system";
  if (motionChoice !== null) return motionChoice ? "on" : "off";
  try {
    return sessionStorage.getItem(MOTION_KEY) === "false" ? "off" : "on";
  } catch {
    return "on";
  }
}
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  motionListeners.add(onChange);
  return () => {
    query.removeEventListener("change", onChange);
    motionListeners.delete(onChange);
  };
}
function saveMotion(on: boolean) {
  motionChoice = on;
  try {
    sessionStorage.setItem(MOTION_KEY, String(on));
  } catch {
    // Storage blocked (private mode): motionChoice keeps it for this visit.
  }
  motionListeners.forEach((listener) => listener());
}
function subscribeLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || stillMotion()) return;
    const set = (n: number) => {
      if (el.firstChild) el.firstChild.nodeValue = `${n}${suffix}`;
    };
    let frame = 0;
    set(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1600, 1);
          set(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      set(value);
    };
  }, [value, suffix]);
  return <span ref={ref}>{`${value}${suffix}`}</span>;
}
function Brand() {
  return (
    <span className="brand">
      <img className="brand-logo" src="/images/visionpact-logo.webp" alt="Visionpact Flamingo Media" width={666} height={237} />
    </span>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export default function SitePage({
  view = "home",
  subpage,
}: {
  view?: string;
  subpage?: "website-launch";
}) {
  const navigate = usePageNavigation();
  const [menu, setMenu] = useState(false),
    [active, setActive] = useState<number | null>(null),
    [step, setStep] = useState(0),
    [filter, setFilter] = useState("Branding"),
    [modal, setModal] = useState<number | string | null>(null),
    [lab, setLab] = useState("Brand launch"),
    [sending, setSending] = useState(false),
    [formMessage, setFormMessage] = useState(""),
    [success, setSuccess] = useState(false);
  const motionState = useSyncExternalStore(
    subscribeMotion,
    readMotion,
    (): MotionState => "on",
  );
  const motion = motionState === "on";
  // A package chosen on the Pricing page arrives as ?service=… on /contact.
  const search = useSyncExternalStore(
    subscribeLocation,
    () => window.location.search,
    () => "",
  );
  const offerFromUrl =
    view === "contact"
      ? new URLSearchParams(search).get("service")?.slice(0, 300) || ""
      : "";
  const [offerDismissed, setOfferDismissed] = useState(false);
  const selectedOffer = offerDismissed ? "" : offerFromUrl;
  const [serviceChoice, setServiceChoice] = useState<string | null>(null);
  const service = serviceChoice ?? serviceForOffer(selectedOffer);
  const dialog = useRef<HTMLDialogElement>(null);
  const requestId = useRef<string>("");
  const formShownAt = useRef(0);
  useEffect(() => {
    formShownAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (!menu) return;
    // Escape closes the mobile menu and returns focus to its toggle button.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(false);
      document.querySelector<HTMLElement>(".menu-toggle")?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    const stagger =
      ".creative-pair article, .package-card, .principles > div, .service, .insight-grid > button, .stat, .trust-card, .include-card, .audience-card";
    document
      .querySelectorAll<HTMLElement>(`.reveal, .creative-intro, ${stagger}`)
      .forEach((el) => {
        el.classList.add("reveal");
        if (el.matches(stagger) && el.parentElement)
          el.style.setProperty(
            "--i",
            String(Array.prototype.indexOf.call(el.parentElement.children, el)),
          );
        observer.observe(el);
      });
    // Soft glow that follows the pointer across .spotlight cards.
    const spot = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(
        ".spotlight",
      );
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", spot, { passive: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("pointermove", spot);
    };
  }, []);
  useEffect(() => {
    document.body.classList.toggle("paused", !motion);
  }, [motion]);
  useEffect(() => {
    if (modal !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const header = document.querySelector<HTMLElement>(".nav");
    let frame = 0;
    const progress = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { header?.classList.toggle("scrolled", scrollY > 24); }); };
    const move = (e: PointerEvent) => { if (!motion || e.pointerType !== "mouse") return; const r = hero!.getBoundingClientRect(); hero!.style.setProperty("--art-x", ((e.clientX-r.left)/r.width*16-8)+"px"); hero!.style.setProperty("--art-y", ((e.clientY-r.top)/r.height*12-6)+"px"); };
    const reset = () => { hero?.style.setProperty("--art-x","0px"); hero?.style.setProperty("--art-y","0px"); };
    window.addEventListener("scroll", progress, {passive:true}); window.addEventListener("resize",progress); progress();
    hero?.addEventListener("pointermove",move); hero?.addEventListener("pointerleave",reset);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll",progress); window.removeEventListener("resize",progress); hero?.removeEventListener("pointermove",move); hero?.removeEventListener("pointerleave",reset); };
  }, [motion, view]);
  useEffect(() => {
    // One underline that glides between links. The header remounts on every
    // route, so the last position is kept in navIndicatorFrom between pages.
    const links = document.querySelector<HTMLElement>(".navlinks");
    const bar = links?.querySelector<HTMLElement>(".nav-indicator");
    if (!links || !bar) return;
    const current = () =>
      links.querySelector<HTMLElement>('a[aria-current="page"]');
    let pos: NavIndicatorPosition = null;
    const place = (target: HTMLElement | null, animate: boolean) => {
      bar.classList.toggle("instant", !animate);
      if (!target) {
        bar.style.opacity = "0";
        pos = null;
        return;
      }
      pos = { x: target.offsetLeft, w: target.offsetWidth };
      bar.style.opacity = "1";
      bar.style.width = `${pos.w}px`;
      bar.style.transform = `translateX(${pos.x}px)`;
    };
    if (navIndicatorFrom) {
      bar.classList.add("instant");
      bar.style.opacity = "1";
      bar.style.width = `${navIndicatorFrom.w}px`;
      bar.style.transform = `translateX(${navIndicatorFrom.x}px)`;
      // Force a style flush so the move below transitions from the old spot.
      bar.getBoundingClientRect();
      place(current(), true);
    } else place(current(), false);
    const hover = (e: PointerEvent) => {
      const a = (e.target as Element).closest<HTMLElement>("a");
      if (e.pointerType === "mouse" && a) place(a, true);
    };
    const leave = () => place(current(), true);
    const resize = () => place(current(), false);
    links.addEventListener("pointerover", hover);
    links.addEventListener("pointerleave", leave);
    window.addEventListener("resize", resize);
    return () => {
      navIndicatorFrom = pos;
      links.removeEventListener("pointerover", hover);
      links.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", resize);
    };
  }, [view]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setFormMessage("");
    const f = e.currentTarget;
    const values = Object.fromEntries(new FormData(f)) as Record<string, string>;
    requestId.current ||= newRequestId();
    const reference = requestId.current.slice(0, 8).toUpperCase();
    // Bots fill the hidden "website" field or submit within moments of the
    // page loading; never email those.
    const looksAutomated =
      Boolean(values.website) || Date.now() - formShownAt.current < 2000;
    try {
      // Save first, so the server's rate limit also stops email spam. The
      // inquiry counts as sent if either the save or the email succeeds.
      let saveError: unknown = null;
      try {
        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            selectedPackage: selectedOffer,
            id: requestId.current,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.status === 429)
          throw new Error(data.error || "Too many inquiries. Please wait a few minutes.");
        if (!res.ok)
          saveError = new Error(
            data.error || "Unable to send your inquiry. Please try again.",
          );
      } catch (err) {
        if (err instanceof Error && !(err instanceof TypeError)) throw err;
        saveError = err; // network failure: still try the email
      }
      let mailError: unknown = looksAutomated
        ? new Error("Spam check failed.")
        : null;
      if (!mailError)
        await sendInquiryEmail({
          reference,
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          type: values.type,
          service: values.service,
          selectedPackage: selectedOffer,
          message: values.message,
        }).catch((err: unknown) => {
          mailError = err;
          console.warn("Inquiry email not sent:", err);
        });
      if (saveError && mailError) throw saveError;
      setSuccess(true);
      setFormMessage(
        `Thank you, ${values.name.split(" ")[0]}! Your inquiry has been sent. Reference: ${reference}. We’ll reply to ${values.email} soon.`,
      );
      f.reset();
      setOfferDismissed(true);
      setServiceChoice(null);
      requestId.current = "";
    } catch (e) {
      setSuccess(false);
      // fetch() rejects with a TypeError when the network is unreachable.
      setFormMessage(
        e instanceof Error && !(e instanceof TypeError)
          ? e.message
          : "Connection unavailable. Your entries are still here; please try again.",
      );
    } finally {
      setSending(false);
    }
  }
  const nav = [
    ["Home", ""],
    ["Services", "services"],
    ["Work", "work"],
    ["Process", "process"],
    ["Pricing", "pricing"],
    ["About", "studio"],
    ["Test", "test"],
  ];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="nav">
        <Link href="/" aria-label="Visionpact Flamingo Media home">
          <Brand />
        </Link>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={menu ? "navlinks open" : "navlinks"}
        >
          {nav.map(([name, id]) => (
            <a
              key={id}
              href={`/${id}`}
              aria-current={
                (id === "" ? view === "home" : view === id) ? "page" : undefined
              }
              onClick={() => setMenu(false)}
            >
              {name}
            </a>
          ))}
          <span className="nav-indicator" aria-hidden="true" />
        </nav>
        <a className="button nav-cta" href="/contact">
          Let’s talk <ArrowUpRight size={17} />
        </a>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menu}
          aria-controls="main-navigation"
          aria-label={menu ? "Close menu" : "Open menu"}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className={view === "home" ? "home-page" : "route-page"}
      >
        {view === "home" && (
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <Eyebrow>Branding, website design &amp; digital marketing agency in India</Eyebrow>
              <h1 id="hero-title">
                Good ideas.
                <br />
                Unforgettable
                <br />
                <em>identities.</em>
              </h1>
              <div className="hero-bottom">
                <p>
                  Logo design, websites, social media marketing and AI content,
                  <br className="desktop" /> brought together to make your brand
                  impossible to overlook.
                </p>
              </div>
            </div>
            <div className="hero-art">
              <img
                src="/images/dm-hero.webp"
                alt="Digital marketing dashboard and social media campaign designs by Visionpact Flamingo Media"
                fetchPriority="high"
                width="1536"
                height="1024"
              />
              <span className="art-label">VISION × CREATIVITY</span>
            </div>
            <div className="hero-foot">
              <span>Branding. Content. Digital growth.</span>
              <a href="/studio">
                Discover the studio <span aria-hidden="true">→</span>
              </a>
              <button
                type="button"
                onClick={() => saveMotion(!motion)}
                disabled={motionState === "system"}
                aria-pressed={motion}
                title={
                  motionState === "system"
                    ? "Animations are off because your device asks for reduced motion"
                    : undefined
                }
              >
                {motion ? <Pause size={14} /> : <Play size={14} />} Motion{" "}
                {motion ? "on" : "off"}
              </button>
            </div>
          </section>
        )}
        {view === "home" && (
          <div className="discipline-strip" aria-label="Our disciplines">
            <span>STRATEGY</span>
            <i>✳</i>
            <span>DESIGN</span>
            <i>✳</i>
            <span>DIGITAL</span>
            <i>✳</i>
            <span>CONTENT</span>
            <i>✳</i>
            <span>MOTION</span>
            <i>✳</i>
            <span>AI</span>
          </div>
        )}
        {view === "home" && (
          // With no brands listed in `clients` (app/content.ts), the same
          // moving line shows the platforms the studio works on instead.
          <section
            className="client-band"
            aria-label={clients.length ? "Brands we work with" : "Platforms we work on"}
          >
            <p className="client-band-label">
              {clients.length ? (
                <>
                  Trusted by teams at <span>leading brands</span>
                </>
              ) : (
                <>
                  Platforms we <span>work on</span>
                </>
              )}
            </p>
            {clients.length ? <ClientMarquee /> : <PlatformMarquee />}
          </section>
        )}
        {view === "services" && (
          <section className="section expertise light" id="expertise">
            <div className="section-heading reveal">
              <Eyebrow>01 / Our expertise</Eyebrow>
              <h1 className="page-title">
                One creative partner.
                <br />
                <span>More possibilities.</span>
              </h1>
              <p>
                Logo design, website development, social media marketing,
                video editing and AI content for businesses across India.
                <br />
                The right mix of services for your next chapter.
              </p>
            </div>
            <h2 className="sr-only">Service disciplines</h2>
            <div className="service-list">
              {services.map((s, i) => (
                <article
                  className={`service ${active === i ? "expanded" : ""}`}
                  key={s.name}
                >
                  <button
                    className="service-toggle"
                    aria-expanded={active === i}
                    aria-controls={`service-${i}`}
                    onClick={() => setActive(active === i ? null : i)}
                  >
                    <span className="index">0{i + 1}</span>
                    <h3>{s.name}</h3>
                    {active === i ? <Minus /> : <Plus />}
                  </button>
                  <div
                    id={`service-${i}`}
                    hidden={active !== i}
                    className="service-detail"
                  >
                    <div>
                      <h4>{s.short}</h4>
                      <p>{s.detail}</p>
                    </div>
                    <div className="tags">
                      {s.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                      <a href="/pricing">
                        View starting rates <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {(view === "home" || view === "services") && <CreativeServices />}
        {view === "work" && (
          <section className="section work light" id="work">
            <div className="section-heading reveal">
              <Eyebrow>02 / Creative explorations</Eyebrow>
              <h1 className="page-title">
                A point of view.
                <br />
                <span>Made visible.</span>
              </h1>
              <p>
                Original studio concepts that explore
                <br />
                what design can do. Not client case studies.
              </p>
            </div>
            <h2 className="sr-only">Studio concepts</h2>
            <div className="filters" role="group" aria-label="Filter creative work">
              {["Branding", "Digital", "AI & Motion"].map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="projects">
              {concepts
                .filter((p) => p.type === filter)
                .map((p) => {
                  const i = concepts.indexOf(p);
                  return (
                    <article
                      className={`project project-${i}`}
                      key={p.title}
                    >
                      <div className="project-image">
                        <ConceptVisual concept={p} />
                        <span className="project-badge">Studio concept</span>
                        <span className="project-arrow">
                          <ArrowUpRight />
                        </span>
                      </div>
                      <div className="project-caption">
                        <h3>{p.title}</h3>
                        <span>{p.type}</span>
                      </div>
                      <p className="project-label">{p.label}</p>
                      <div className="project-body">
                        <p className="project-desc">{p.desc}</p>
                        <span className="project-highlights">
                          {p.highlights.map((h) => (
                            <span key={h}>
                              <Check size={14} aria-hidden="true" /> {h}
                            </span>
                          ))}
                        </span>
                        <span className="project-tags">
                          {p.tags.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </span>
                        {/* One real button per card; CSS stretches its click
                            area over the whole card. */}
                        <button
                          type="button"
                          className="project-more"
                          onClick={() => setModal(i)}
                        >
                          Explore the concept
                          <span className="sr-only">: {p.title}</span>
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  );
                })}
            </div>
            <div className="page-block">
              <div className="section-heading sub-heading reveal">
                <Eyebrow>Every project includes</Eyebrow>
                <h2>
                  Clear scope.
                  <br />
                  <span>Ready-to-use results.</span>
                </h2>
                <p>Whatever the brief, these come as standard.</p>
              </div>
              <div className="includes-grid">
                {projectIncludes.map(([Icon, title, body]) => (
                  <article className="include-card" key={title}>
                    <span className="include-icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="page-block">
              <div className="section-heading sub-heading reveal">
                <Eyebrow>Who we design for</Eyebrow>
                <h2>
                  Built for businesses
                  <br />
                  <span>of every size.</span>
                </h2>
                <p>What different clients usually start with.</p>
              </div>
              {/* Scrolls sideways on phones, so it is a focusable region. */}
              <div
                className="audience-grid"
                role="region"
                aria-label="Who we design for"
                tabIndex={0}
              >
                {audiences.map(([Icon, title, body, picks]) => (
                  <article className="audience-card" key={title}>
                    <span className="audience-icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <h3>{title}</h3>
                    <p>{body}</p>
                    <ul aria-label={`Popular with ${title.toLowerCase()}`}>
                      {picks.map((pick) => (
                        <li key={pick}>{pick}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <p className="audience-note">
                Don’t see your field?{" "}
                <a href="/contact">
                  Tell us about your project <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </p>
            </div>
            <div className="page-block web-journey reveal">
              <div className="wj-head">
                <div>
                  <Eyebrow>How a website project moves</Eyebrow>
                  <h2>
                    From first call
                    <br />
                    <span>to a live website.</span>
                  </h2>
                </div>
                <div className="wj-intro">
                  <p>
                    A five-page business website usually goes live in two to
                    three weeks. You see progress at every step and approve it
                    before we move on.
                  </p>
                  <div className="wj-actions">
                    <a href="/pricing/website-launch" className="button pink">
                      See website prices <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                    <a href="/process" className="text-link">
                      See the full process <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
              <ol className="wj-steps">
                {websiteJourney.map(([Icon, title, body, gets, time], i) => (
                  <li key={title}>
                    <span className="wj-node" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <span className="wj-time">{time}</span>
                    <h3>
                      <span>0{i + 1}</span> {title}
                    </h3>
                    <p>{body}</p>
                    <p className="wj-gets">
                      <Check size={14} aria-hidden="true" /> {gets}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
        {view === "studio" && (
          <section className="section about" id="about">
            <Eyebrow>03 / The studio</Eyebrow>
            <div className="about-grid">
              <h1 className="page-title">
                Different skills.
                <br />
                Shared vision.
                <br />
                <em>One pact.</em>
              </h1>
              <div className="about-copy reveal">
                <p className="large-copy">
                  Visionpact Flamingo Media is a creative and digital marketing
                  agency in India, and a trusted partner for brands that want
                  design, marketing and AI working as one.
                </p>
                <p>
                  From global technology leaders to fast-growing startups,
                  teams trust us to turn ideas into identities, campaigns and
                  digital experiences people remember, with clear scope,
                  honest timelines and care in every detail.
                </p>
                <p>
                  We work across brand identities, websites, social content,
                  video and personal design. The brief shapes the tools. Your
                  message stays at the centre.
                </p>
                <ul className="trust-points">
                  <li>
                    <Check size={16} aria-hidden="true" /> Transparent INR
                    pricing
                  </li>
                  <li>
                    <Check size={16} aria-hidden="true" /> Human-reviewed AI
                  </li>
                  <li>
                    <Check size={16} aria-hidden="true" /> One dedicated team
                  </li>
                </ul>
              </div>
            </div>
            <div className="client-showcase reveal">
              <div className="client-heading">
                <Eyebrow>Trusted by teams at</Eyebrow>
                <h2>
                  We are the trusted creative company
                  <br />
                  <em>for brands that lead.</em>
                </h2>
                <p>
                  Global leaders and ambitious startups choose Visionpact for
                  work that has to be right: on brand, on brief and on
                  schedule.
                </p>
              </div>
              <ClientMarquee />
            </div>
            <div className="stats">
              {stats.map(([value, suffix, label]) => (
                <div className="stat" key={label}>
                  <strong>
                    <Counter value={value} suffix={suffix} />
                  </strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="trust-section">
              <div className="trust-heading reveal">
                <Eyebrow>Why brands trust us</Eyebrow>
                <h2>
                  Reliable partners.
                  <br />
                  <span>Remarkable work.</span>
                </h2>
              </div>
              <div className="trust-grid">
                {trustPoints.map(([Icon, title, body]) => (
                  <article className="trust-card spotlight" key={title}>
                    <span className="trust-icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="principles">
              <div>
                <span>01 / Clarity</span>
                <h3>Purpose before pixels.</h3>
                <p>Start with what the work needs to communicate.</p>
              </div>
              <div>
                <span>02 / Craft</span>
                <h3>Care in every detail.</h3>
                <p>Make the message and its presentation work together.</p>
              </div>
              <div>
                <span>03 / Partnership</span>
                <h3>Better, together.</h3>
                <p>Keep the process clear and the conversation open.</p>
              </div>
            </div>
            {/* Client feedback sits with the trust content: it is about the
                relationship, and shared feedback can become testimonials. */}
            <div className="page-block about-feedback">
              <FeedbackPanel onPrivacy={() => setModal("privacy")} />
            </div>
          </section>
        )}
        {/* Not id="process": element ids become window globals, and a
            window.process element breaks the dev runtime's process.env. */}
        {view === "process" && (
          <section className="section process light" id="our-process">
            <div className="section-heading reveal">
              <Eyebrow>04 / How we work</Eyebrow>
              <h1 className="page-title">
                From “what if”
                <br />
                <span>to out in the world.</span>
              </h1>
              <p>
                A considered process.
                <br />
                Room for unexpected ideas.
              </p>
            </div>
            <div
              className="process-tabs"
              role="tablist"
              aria-label="Creative process"
            >
              {steps.map((s, i) => (
                <button
                  role="tab"
                  id={`step-tab-${i}`}
                  aria-controls="step-panel"
                  aria-selected={step === i}
                  tabIndex={step === i ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const n = (i + (e.key === "ArrowRight" ? 1 : 4)) % 5;
                      setStep(n);
                      document.getElementById(`step-tab-${n}`)?.focus();
                    }
                  }}
                  key={s.title}
                  onClick={() => setStep(i)}
                >
                  <span>0{i + 1}</span>
                  {s.title}
                  <ArrowRight size={18} />
                </button>
              ))}
            </div>
            <div
              className="process-panel"
              id="step-panel"
              role="tabpanel"
              aria-labelledby={`step-tab-${step}`}
            >
              <span key={`number-${step}`} className="step-number" aria-hidden="true">
                0{step + 1}
              </span>
              <div key={step} className="step-copy">
                <h2>{steps[step].line}</h2>
                <p>{steps[step].body}</p>
                <p className="step-output">
                  <Check size={16} aria-hidden="true" />
                  <span>
                    <strong>You receive:</strong> {steps[step].output}
                  </span>
                </p>
                <div className="tags">
                  {steps[step].tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="page-block">
              <div className="section-heading sub-heading reveal">
                <Eyebrow>A shared effort</Eyebrow>
                <h2>
                  Your part.
                  <br />
                  <span>Our part.</span>
                </h2>
                <p>Great work needs a little from you, and a lot of care from us.</p>
              </div>
              <div className="process-split">
                <div className="need-card reveal">
                  <span className="split-tag">Your part</span>
                  <h3>What we need to get started</h3>
                  <ul>
                    {clientNeeds.map((n) => (
                      <li key={n}>
                        <Check size={17} aria-hidden="true" /> {n}
                      </li>
                    ))}
                  </ul>
                  <p className="need-help">
                    Not sure what you have? We’ll help you gather it.
                    <a href="/contact" className="text-link">
                      Talk to us <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </p>
                </div>
                <div className="qa-board reveal">
                  <div className="qa-head">
                    <span className="split-tag">Our part</span>
                    <h3>Pre-delivery quality checklist</h3>
                    <div className="qa-progress" aria-hidden="true">
                      <i />
                    </div>
                    <small>Every item is checked before anything reaches you.</small>
                  </div>
                  <ul>
                    {qaChecks.map(([Icon, title, body], n) => (
                      <li key={title} style={{ "--n": n } as React.CSSProperties}>
                        <span className="qa-tick" aria-hidden="true">
                          <Check size={14} />
                        </span>
                        <span className="qa-text">
                          <strong>{title}</strong>
                          <small>{body}</small>
                        </span>
                        <Icon className="qa-icon" size={18} aria-hidden="true" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="page-block">
              <div className="section-heading sub-heading reveal">
                <Eyebrow>Good to know</Eyebrow>
                <h2>
                  Questions about
                  <br />
                  <span>the process.</span>
                </h2>
              </div>
              <div className="pricing-details process-faq">
                {processFaqs.map(([q, a]) => (
                  <details key={q}>
                    <summary>
                      {q}
                      <Plus size={18} aria-hidden="true" />
                    </summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
        {view === "feedback" && (
          <section className="section feedback-page" aria-label="Client feedback">
            <FeedbackPanel onPrivacy={() => setModal("privacy")} pageHeading />
          </section>
        )}
        {view === "technology" && (
          <section className="section lab" id="technology">
            <div className="lab-copy reveal">
              <Eyebrow>05 / Human direction. New possibilities.</Eyebrow>
              <h1 className="page-title">
                Creative minds.
                <br />
                <em>Smarter tools.</em>
              </h1>
              <p>
                AI helps explore, produce and adapt. Human judgement shapes the
                idea, checks the details and keeps the work aligned with your
                brand.
              </p>
              <a href="/contact" className="text-link">
                Explore AI-powered services <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="lab-demo">
              <div className="lab-top">
                <span>
                  <Sparkles size={17} /> CREATIVE WORKFLOW
                </span>
                <span className="outline-label">Interactive example</span>
              </div>
              <label htmlFor="lab-select">Choose a creative brief</label>
              <select
                id="lab-select"
                value={lab}
                onChange={(e) => setLab(e.target.value)}
              >
                <option>Brand launch</option>
                <option>Social campaign</option>
                <option>Product story</option>
              </select>
              <div className="workflow">
                <div>
                  <span>01</span>
                  <strong>Your direction</strong>
                  <small>
                    {lab === "Brand launch"
                      ? "Audience + positioning"
                      : lab === "Social campaign"
                        ? "Objective + channel"
                        : "Product + message"}
                  </small>
                </div>
                <i>↓</i>
                <div>
                  <span>02</span>
                  <strong>AI-assisted exploration</strong>
                  <small>
                    {lab === "Brand launch"
                      ? "Visual routes + copy ideas"
                      : lab === "Social campaign"
                        ? "Creative variations + captions"
                        : "Image concepts + storyboards"}
                  </small>
                </div>
                <i>↓</i>
                <div>
                  <span>03</span>
                  <strong>Human review & refinement</strong>
                  <small>Brand fit · Accuracy · Quality</small>
                </div>
              </div>
              <p className="demo-note">
                Process illustration. No AI generation or campaign data is
                running here.
              </p>
            </div>
          </section>
        )}
        {view === "pricing" && !subpage && (
          <Pricing
            onSelect={(selection) =>
              navigate(`/contact?service=${encodeURIComponent(selection)}`)
            }
          />
        )}
        {view === "pricing" && subpage === "website-launch" && (
          <WebsitePricing
            onSelect={(selection) =>
              navigate(`/contact?service=${encodeURIComponent(selection)}`)
            }
          />
        )}
        {view === "insights" && (
          <section className="section insights light" id="insights">
            <div className="section-heading reveal">
              <Eyebrow>07 / Studio notes</Eyebrow>
              <h1 className="page-title">
                Ideas behind
                <br />
                <span>the work.</span>
              </h1>
            </div>
            <h2 className="sr-only">Notes</h2>
            <div className="insight-grid">
              {[
                ["Branding", "A logo is a start. An identity is a system."],
                [
                  "Digital",
                  "A beautiful website should make the next step clear.",
                ],
                [
                  "AI & Creativity",
                  "More possibilities still need a point of view.",
                ],
              ].map(([t, h], i) => (
                <button key={h} onClick={() => setModal(`insight-${i}`)}>
                  <span>{t}</span>
                  <h3>{h}</h3>
                  <span className="read">
                    Read the note <ArrowUpRight size={18} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
        {view === "test" && (
          <section className="section test-page" aria-labelledby="test-title">
            <Eyebrow>Test</Eyebrow>
            <h1 id="test-title" className="page-title">
              Test page
            </h1>
            <p>This page is a placeholder. Its content will be added soon.</p>
          </section>
        )}
        {view === "not-found" && (
          <section className="section not-found" aria-labelledby="not-found-title">
            <Eyebrow>404 / Page not found</Eyebrow>
            <h1 id="not-found-title" className="page-title">
              This page has moved
              <br />
              <em>or never existed.</em>
            </h1>
            <p>The link may be out of date. Try one of these instead:</p>
            <div className="not-found-links">
              {[...nav, ["Contact", "contact"]].map(([name, id]) => (
                <a key={id} href={`/${id}`}>
                  {name} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        )}
        {view === "contact" && (
          <section className="contact section" id="contact">
            <div className="contact-intro reveal">
              <Eyebrow>08 / Start a conversation</Eyebrow>
              <h1 className="page-title">
                Your next
                <br />
                big thing
                <br />
                <em>starts here.</em>
              </h1>
              <p>
                A new brand, a better website, a bold campaign.
                <br />
                Tell us what you have in mind.
              </p>
              <ContactList />
            </div>
            <form onSubmit={submit} className="contact-form">
              {selectedOffer && (
                <div className="selected-offer" role="status">
                  <div>
                    <small>Your selected service</small>
                    <strong>{selectedOffer}</strong>
                  </div>
                  <button
                    type="button"
                    aria-label="Clear selected service"
                    onClick={() => {
                      // Keep the service family that the package implied.
                      setServiceChoice(service);
                      setOfferDismissed(true);
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <div className="form-row">
                <label>
                  Your name
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Full name"
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    required
                    type="email"
                    maxLength={254}
                    autoComplete="email"
                    placeholder="you@company.com"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Phone <span>(optional)</span>
                  <input
                    name="phone"
                    type="tel"
                    maxLength={20}
                    pattern="\+?[0-9][0-9 \-]{6,18}"
                    title="Enter a phone number using digits, spaces, + or -"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                  />
                </label>
                <label>
                  Company / brand <span>(optional)</span>
                  <input
                    name="company"
                    maxLength={160}
                    autoComplete="organization"
                    placeholder="Your company or brand"
                  />
                </label>
              </div>
              <label>
                Which service do you need?
                <select
                  name="service"
                  required
                  value={service}
                  onChange={(e) => setServiceChoice(e.target.value)}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((s) => (
                    <option key={s.name}>{s.name}</option>
                  ))}
                  <option>{OTHER_SERVICE}</option>
                </select>
              </label>
              <label>
                What brings you here?
                <select name="type" required defaultValue="">
                  <option value="" disabled>
                    Select an inquiry type
                  </option>
                  <option>Project inquiry</option>
                  <option>Partnership inquiry</option>
                  <option>Career inquiry</option>
                  <option>General inquiry</option>
                </select>
              </label>
              <label>
                Tell us about your idea
                <textarea
                  name="message"
                  required
                  minLength={20}
                  maxLength={3500}
                  rows={4}
                  placeholder="What would you like to create? Share your goals, scope and timeline."
                />
              </label>
              <label className="honeypot" aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <label className="consent">
                <input type="checkbox" name="consent" required value="yes" />{" "}
                <span>
                  I agree to share these details for this inquiry.{" "}
                  <button type="button" onClick={() => setModal("privacy")}>
                    Privacy notice
                  </button>
                </span>
              </label>
              <button className="button pink" type="submit" disabled={sending}>
                {sending
                  ? "Sending your inquiry…"
                  : "Let’s make something great"}
                <ArrowUpRight size={19} />
              </button>
              {formMessage && (
                <p
                  role="status"
                  className={`form-status ${success ? "success" : "error"}`}
                >
                  {success && <Check size={18} />} {formMessage}
                </p>
              )}
              <p className="form-note">
                Your inquiry goes straight to our inbox. No payment or
                commitment is required.
              </p>
            </form>
          </section>
        )}
        {view !== "contact" && (
          <section className="page-cta">
            <p className="eyebrow">Have something in mind?</p>
            <h2>
              Let’s make your
              <br />
              <em>next move matter.</em>
            </h2>
            <div>
              <a href="/contact" className="button pink">
                Start a conversation <ArrowUpRight size={18} />
              </a>
              <a
                href={view === "pricing" ? "/services" : "/pricing"}
                className="text-link"
              >
                {view === "pricing"
                  ? "Explore our services"
                  : "Explore starting rates"}
                <ArrowUpRight size={18} />
              </a>
            </div>
          </section>
        )}
      </main>
      <footer>
        <Link className="footer-brand" href="/" aria-label="Visionpact Flamingo Media home"><Brand /></Link>
        <div className="footer-top">
          <p>
            Design. Branding.
            <br />
            <strong>Digital growth.</strong>
          </p>
          <div>
            <span>Explore</span>
            {nav.map(([n, id]) => (
              <a key={id} href={`/${id}`}>
                {n}
              </a>
            ))}
          </div>
          <div>
            <span>Capabilities</span>
            <a href="/services">Branding & design</a>
            <a href="/services">Web & digital</a>
            <a href="/services">Social & marketing</a>
            <a href="/technology">Motion & AI</a>
            <a href="/insights">Studio notes</a>
          </div>
          <div className="footer-contact">
            <span>Get in touch</span>
            <a className="footer-contact-line" href={`mailto:${contact.email}`}>
              <Mail size={16} aria-hidden="true" />
              {/* <wbr> lets a narrow column wrap before the "@", never mid-word. */}
              <span>
                {contact.email.split("@")[0]}
                <wbr />@{contact.email.split("@")[1]}
              </span>
            </a>
            {contact.phones.map((p) => (
              <a key={p.href} className="footer-contact-line" href={p.href}>
                <Phone size={16} aria-hidden="true" />
                <span>{p.label}</span>
              </a>
            ))}
            <SocialLinks />
            <a href="/feedback">Share feedback</a>
            <a href="/contact" className="footer-talk">
              Let’s talk <ArrowUpRight />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Visionpact Flamingo Media</span>
          <div>
            <button onClick={() => setModal("privacy")}>Privacy</button>
            <button onClick={() => setModal("terms")}>Website terms</button>
            <a href="#main">Back to top ↑</a>
          </div>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className="detail-dialog"
        aria-label="Studio details"
        onCancel={() => setModal(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setModal(null);
        }}
      >
        <button
          className="close-dialog"
          aria-label="Close dialog"
          onClick={() => setModal(null)}
        >
          <X />
        </button>
        {typeof modal === "number" ? (
          <>
            <Eyebrow>Studio concept / {concepts[modal].type}</Eyebrow>
            <h2>{concepts[modal].title}</h2>
            {concepts[modal].image ? (
              <img src={concepts[modal].image!} alt={concepts[modal].label} />
            ) : (
              <div className="dialog-visual">
                <ConceptVisual concept={concepts[modal]} />
              </div>
            )}
            <p>{concepts[modal].desc}</p>
            <div className="tags">
              {concepts[modal].tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <a
              className="button pink"
              href="/contact"
              onClick={() => setModal(null)}
            >
              Discuss a similar brief <ArrowUpRight size={17} />
            </a>
          </>
        ) : modal === "privacy" ? (
          <>
            <Eyebrow>Website information</Eyebrow>
            <h2>Privacy notice</h2>
            <p>
              The inquiry form collects your name, email, optional phone and
              company, the service you are interested in, inquiry type and
              message. These details are used only to respond to your request.
              Please do not include passwords, identity documents or other
              sensitive information.
            </p>
            <p>
              The feedback form collects your name, optional email, the service
              you used, your rating and comments, and whether we may quote you
              (first name only).
            </p>
            <p>
              When you submit either form, your details are saved for the studio
              and emailed to the studio inbox ({contact.email}) through the
              FormSubmit email service. An on-screen reference confirms your
              submission. Quote it when you contact us to request a correction
              or deletion.
            </p>
            <p>
              The site does not use advertising cookies or analytics tracking.
              Hosting providers may process technical request information to
              operate and protect the service.
            </p>
          </>
        ) : modal === "terms" ? (
          <>
            <Eyebrow>Website information</Eyebrow>
            <h2>Website terms</h2>
            <p>
              Information on this website introduces the studio’s services.
              Submitting an inquiry does not create a service agreement or
              payment obligation. Scope, fees, schedules and usage rights must
              be agreed separately.
            </p>
            <p>
              Work labelled “Studio concept” is illustrative, self-initiated
              work. It is not evidence of a client engagement or a commercial
              result. AI-assisted artwork is identified where used.
            </p>
          </>
        ) : (
          <>
            <Eyebrow>Studio notes</Eyebrow>
            <h2>
              {modal === "insight-0"
                ? "An identity is a system."
                : modal === "insight-1"
                  ? "Make the next step clear."
                  : "A point of view comes first."}
            </h2>
            {(modal === "insight-0"
              ? [
                  "A logo helps people identify you. The type, colours, images and tone around it help them understand you. A consistent identity connects those decisions across your website, social posts, presentations and packaging.",
                  "Start with a clear message and a few rules your team can use. The aim is not to make every piece look identical. It is to make every piece feel like it belongs to the same brand.",
                ]
              : modal === "insight-1"
                ? [
                    "Visitors arrive with questions: what do you offer, is it right for them, and what should they do next? A useful website answers those questions in a natural order.",
                    "Give each page a purpose. Keep navigation understandable, explain the offer in plain language, and make the next action easy to find on a phone as well as a desktop.",
                  ]
                : [
                    "AI tools can help explore image directions, copy variations and production ideas. But a larger number of options does not decide which option serves the brief.",
                    "Start with the audience and intended message. Use the tools to explore, then review outputs for accuracy, originality, brand fit and suitability for their intended use.",
                  ]
            ).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </>
        )}
      </dialog>
    </>
  );
}
