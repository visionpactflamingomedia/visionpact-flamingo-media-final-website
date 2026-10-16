// Built per request so the absolute URLs always match the domain being served.
const SITE_ROUTES = [
  "/",
  "/services",
  "/work",
  "/process",
  "/pricing",
  "/pricing/website-launch",
  "/studio",
  "/technology",
  "/insights",
  "/contact",
];
export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const urls = SITE_ROUTES.map(
    (path) =>
      `  <url><loc>${origin}${path === "/" ? "" : path}</loc><changefreq>monthly</changefreq><priority>${path === "/" ? "1.0" : "0.8"}</priority></url>`,
  ).join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
