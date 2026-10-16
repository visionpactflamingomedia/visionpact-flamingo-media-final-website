// Builds the Google Sheet's Apps Script from Code.template.gs and the website's
// own data (services, packages, contact details, client types, page titles),
// so the sheet always matches the site.
//
//   node integrations/google-sheets/build.mjs
//
// Writes two files next to this one:
//   Code.gs        the shareable version, with a placeholder secret
//   Code.ready.gs  the version to paste into Apps Script, with the secret from
//                  .dev.vars (created with a new random secret if missing).
//                  Ignored by git; never share it.
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const content = await import(pathToFileURL(join(root, "app", "content.ts")).href);

// Client types and their three suggested services, from the Work page.
const page = readFileSync(join(root, "app", "site-page.tsx"), "utf8");
const start = page.indexOf("const audiences = [");
const block = page.slice(start, page.indexOf("] as const;", start));
const offers = content.services.flatMap((s) => s.offers.map(([name, price, unit]) => ({ name, price, unit })));
// Work-page labels that are shortened differently from the price list.
const aliases = {
  "Google & Meta Ads": "Google / Meta / LinkedIn / Amazon Ads",
  "AI product photos": "AI product photography & e-commerce mockups",
  "Wedding invitations": "Wedding invitation & digital marriage card",
  "Animated invites": "Animated wedding invitation",
};
const norm = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9 ]/g, "");
const findOffer = (label) => {
  const n = norm(aliases[label] ?? label);
  return (
    offers.find((o) => norm(o.name) === n) ??
    offers.find((o) => norm(o.name).includes(n)) ??
    offers.find((o) => n.split(" ").every((w) => norm(o.name).includes(w)))
  );
};
const money = (n) => `₹${n.toLocaleString("en-IN")}`;
const clientTypes = [...block.matchAll(/\[\w+, "([^"]+)", "([^"]+)", \[([^\]]+)\]\]/g)].map((m) => {
  const picks = [...m[3].matchAll(/"([^"]+)"/g)].map((p) => findOffer(p[1]) ?? { name: p[1] });
  const prices = picks.filter((p) => p.price).map((p) => p.price);
  return [
    m[1],
    m[2],
    picks.map((p) => (p.price ? `${p.name} (from ${money(p.price)} / ${p.unit})` : p.name)).join("\n"),
    prices.length ? Math.min(...prices) : "",
  ];
});
if (clientTypes.length === 0) throw new Error("Client types not found in app/site-page.tsx");

// Page titles and keywords from each route's pageMetadata() call.
const purposes = {
  "/": ["Home", "First impression, services overview, trusted-by logos"],
  "/services": ["Services", "Every discipline and service"],
  "/work": ["Work", "Studio concepts, client types, what every project includes"],
  "/process": ["Process", "Five steps, client and studio responsibilities, quality checks, FAQ"],
  "/pricing": ["Pricing", "Packages and starting prices in rupees"],
  "/pricing/website-launch": ["Website pricing", "Website launch package and every website type with starting prices"],
  "/studio": ["About", "Studio story, trusted-by logos, client feedback form"],
  "/technology": ["AI & Technology", "AI-assisted workflow"],
  "/insights": ["Insights", "Studio notes"],
  "/contact": ["Contact", "Service request form, email, phones, social links"],
  "/feedback": ["Feedback", "Feedback form link to send to past clients"],
};
const pages = Object.entries(purposes).map(([path, [name, purpose]]) => {
  const file = join(root, "app", path === "/" ? "" : path.slice(1), "page.tsx");
  const src = readFileSync(file, "utf8");
  const call = src.slice(src.indexOf("pageMetadata("));
  const title = /"((?:[^"\\]|\\.)*)"/.exec(call)?.[1] ?? "";
  const listStart = call.indexOf("[");
  const listEnd = call.indexOf("]", listStart);
  const keywords = listStart > 0 ? [...call.slice(listStart, listEnd).matchAll(/"([^"]+)"/g)].map((k) => k[1]) : [];
  const indexed = !/index:\s*false/.test(call);
  return [name, path, purpose, title, keywords.join(", "), indexed ? "Yes" : "No (hidden from search)"];
});

const data = {
  contact: content.contact,
  services: content.services.map((s) => ({ name: s.name, offers: s.offers })),
  packages: content.packages.map((p) => [
    p.name,
    p.label,
    p.price,
    p.unit,
    `${p.items.map((i) => i.replace(/ \+ /g, " and ")).join("; ")}. ${p.note}`,
  ]),
  clientTypes,
  pages,
};

// The secret lives in .dev.vars (ignored by git) next to the website settings.
const devVarsPath = join(root, ".dev.vars");
let devVars = existsSync(devVarsPath) ? readFileSync(devVarsPath, "utf8") : "";
let secret = /^SHEETS_WEBHOOK_SECRET=(.+)$/m.exec(devVars)?.[1]?.trim();
if (!secret) {
  secret = randomBytes(32).toString("base64url");
  if (!/^SHEETS_WEBHOOK_URL=/m.test(devVars)) devVars += "SHEETS_WEBHOOK_URL=\n";
  devVars += `SHEETS_WEBHOOK_SECRET=${secret}\n`;
  writeFileSync(devVarsPath, devVars);
  console.log("Created a new SHEETS_WEBHOOK_SECRET in .dev.vars");
}

const template = readFileSync(join(here, "Code.template.gs"), "utf8");
if (!template.includes("/*__DATA__*/") || !template.includes("'__SHARED_SECRET__'"))
  throw new Error("Code.template.gs is missing its placeholders");
const withData = template.replace(
  "/*__DATA__*/",
  `// Website data, generated by build.mjs from app/content.ts and the page files.\nconst DATA = ${JSON.stringify(data, null, 1)};`,
);
writeFileSync(join(here, "Code.gs"), withData.replace("'__SHARED_SECRET__'", "'PASTE_THE_SHEETS_WEBHOOK_SECRET_HERE'"));
writeFileSync(join(here, "Code.ready.gs"), withData.replace("'__SHARED_SECRET__'", JSON.stringify(secret).replace(/"/g, "'")));
console.log(
  `Wrote Code.gs and Code.ready.gs: ${data.services.length} categories, ${offers.length} services, ${data.packages.length} packages, ${clientTypes.length} client types, ${pages.length} pages`,
);
