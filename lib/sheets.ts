import { env } from "cloudflare:workers";
// Copies form submissions to the studio's Google Sheet through the Apps Script
// web app in integrations/google-sheets/Code.gs. Optional: without
// SHEETS_WEBHOOK_URL and SHEETS_WEBHOOK_SECRET nothing is sent, and every
// submission is still saved in the database and emailed as before.
type SheetEnv = { SHEETS_WEBHOOK_URL?: string; SHEETS_WEBHOOK_SECRET?: string };

export type InquiryRow = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  type: string;
  service: string;
  selectedPackage: string;
  packagePrice: number | null;
  message: string;
  page: string;
};
export type FeedbackRow = {
  reference: string;
  name: string;
  email: string;
  service: string;
  rating: number;
  message: string;
  allowQuote: boolean;
  page: string;
};
type SheetRecord =
  | { type: "inquiry"; data: InquiryRow }
  | { type: "feedback"; data: FeedbackRow };

// The short reference shown to the visitor and in the studio's emails.
export const shortReference = (id: string) => id.slice(0, 8).toUpperCase();

// Path of the page the form was sent from, e.g. "/contact". Referer is only
// trusted when it points at this site.
export function sourcePage(request: Request) {
  try {
    const referer = new URL(request.headers.get("referer") ?? "");
    return referer.origin === new URL(request.url).origin ? referer.pathname : "";
  } catch {
    return "";
  }
}

export async function sendToSheet(record: SheetRecord) {
  const { SHEETS_WEBHOOK_URL: url, SHEETS_WEBHOOK_SECRET: secret } =
    env as unknown as SheetEnv;
  if (!url || !secret) {
    console.warn(
      `Google Sheet sync skipped for ${record.type} ${record.data.reference}: SHEETS_WEBHOOK_URL or SHEETS_WEBHOOK_SECRET is not set on the Worker.`,
    );
    return;
  }
  try {
    // Apps Script answers with a redirect to the script's output; fetch
    // follows it. Its replies are always HTTP 200, so read the body for errors.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        receivedAt: new Date().toISOString(),
        ...record,
      }),
      signal: AbortSignal.timeout(20000),
    });
    const result = (await res.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
      result?: string;
    } | null;
    if (!res.ok || !result?.ok)
      console.error(
        `Google Sheet sync failed for ${record.type} ${record.data.reference}: ${result?.error ?? `HTTP ${res.status}`}`,
      );
    else
      console.log(
        `Google Sheet sync ok for ${record.type} ${record.data.reference}: ${result.result ?? "added"}`,
      );
  } catch (error) {
    console.error(
      `Google Sheet sync failed for ${record.type} ${record.data.reference}: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }
}
