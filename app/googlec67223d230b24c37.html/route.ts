// Google Search Console ownership file. Served by a route rather than from
// public/, because Cloudflare redirects static .html files to the address
// without the extension, which Google's check does not accept. Keep it, or
// the site loses its verified status.
export function GET() {
  return new Response("google-site-verification: googlec67223d230b24c37.html", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
