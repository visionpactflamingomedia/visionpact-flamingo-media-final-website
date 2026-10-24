import { env } from "cloudflare:workers";
// Temporary check of the Google Sheet connection, to remove once rows arrive.
// Reports only yes/no facts; the URL and secret are never shown. The test
// request uses an unknown record type, so the Apps Script checks the secret
// and then rejects it without writing a row.
type SheetEnv = { SHEETS_WEBHOOK_URL?: string; SHEETS_WEBHOOK_SECRET?: string };

async function readJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { notJson: text.slice(0, 120).replace(/\s+/g, " ") };
  }
}

export async function GET() {
  const { SHEETS_WEBHOOK_URL: url = "", SHEETS_WEBHOOK_SECRET: secret = "" } =
    env as unknown as SheetEnv;
  const report: Record<string, unknown> = {
    workerUrlSet: Boolean(url),
    workerSecretSet: Boolean(secret),
    urlLooksLikeWebApp: /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url.trim()),
    urlHasExtraSpaces: url !== url.trim(),
    secretHasExtraSpaces: secret !== secret.trim(),
  };
  if (url) {
    try {
      const res = await fetch(url.trim(), { signal: AbortSignal.timeout(20000) });
      report.webAppStatus = res.status;
      report.webAppAnswer = await readJson(res);
    } catch (error) {
      report.webAppError = error instanceof Error ? error.message : "unknown error";
    }
  }
  if (url && secret) {
    try {
      const res = await fetch(url.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, type: "connection-check", data: {} }),
        signal: AbortSignal.timeout(20000),
      });
      const answer = await readJson(res);
      report.secretCheckAnswer = answer;
      report.secretAccepted = answer.error === "Unknown type";
    } catch (error) {
      report.secretCheckError = error instanceof Error ? error.message : "unknown error";
    }
  }
  return Response.json(report, { headers: { "Cache-Control": "no-store" } });
}
