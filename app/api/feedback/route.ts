import { after } from "next/server";
import { getDB, isRateLimited } from "@/lib/db";
import { sendToSheet, shortReference, sourcePage } from "@/lib/sheets";
import { z } from "zod";
const schema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  service: z.string().trim().min(1).max(160),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().min(1).max(2000),
  allowQuote: z.literal("yes").optional(),
  consent: z.literal("yes"),
  website: z.string().max(0).optional(),
});
// Same protections as /api/inquiries: same-origin JSON only, size limit,
// validation, honeypot and a per-visitor rate limit.
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json(
      { error: "Please send feedback from this website." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json({ error: "Unsupported request." }, { status: 415 });
  try {
    const text = await request.text();
    if (text.length > 8000)
      return Response.json({ error: "Your feedback is too long." }, { status: 413 });
    const result = schema.safeParse(JSON.parse(text));
    if (!result.success)
      return Response.json(
        {
          error:
            "Please add your name, email, the service you used, a rating and your feedback, and accept the privacy notice.",
        },
        { status: 400 },
      );
    const d = result.data;
    const db = await getDB();
    if (await isRateLimited(db, request, "feedback"))
      return Response.json(
        { error: "Too much feedback from this connection. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    const saved = await db
      .prepare(
        "INSERT INTO feedback (id,name,email,service,rating,message,allow_quote,created_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
      )
      .bind(
        d.id,
        d.name,
        d.email,
        d.service,
        d.rating,
        d.message,
        d.allowQuote ? 1 : 0,
        new Date().toISOString(),
      )
      .run();
    // A retried submission (same id) is already in the sheet.
    if (saved.meta.changes > 0)
      after(() =>
        sendToSheet({
          type: "feedback",
          data: {
            reference: shortReference(d.id),
            name: d.name,
            email: d.email,
            service: d.service,
            rating: d.rating,
            message: d.message,
            allowQuote: Boolean(d.allowQuote),
            page: sourcePage(request),
          },
        }),
      );
    return Response.json(
      { reference: d.id },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof SyntaxError)
      return Response.json({ error: "Invalid feedback format." }, { status: 400 });
    console.error("Feedback storage operation failed");
    return Response.json(
      { error: "We couldn’t save your feedback. Please try again shortly." },
      { status: 503 },
    );
  }
}
