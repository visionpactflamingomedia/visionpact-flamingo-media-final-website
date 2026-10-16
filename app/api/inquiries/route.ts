import { after } from "next/server";
import { getDB, isRateLimited } from "@/lib/db";
import { sendToSheet, shortReference, sourcePage } from "@/lib/sheets";
import { priceForSelection } from "@/app/content";
import { z } from "zod";
const schema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^(\+?[0-9][0-9 -]{6,18})?$/)
    .default(""),
  company: z.string().trim().max(160).default(""),
  service: z.string().trim().min(1).max(160),
  // A package or service chosen on the Pricing page, if any.
  selectedPackage: z.string().trim().max(300).default(""),
  type: z.enum([
    "Project inquiry",
    "Partnership inquiry",
    "Career inquiry",
    "General inquiry",
  ]),
  message: z.string().trim().min(20).max(3500),
  consent: z.literal("yes"),
  website: z.string().max(0).optional(),
});
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json(
      { error: "Please submit your inquiry from this website." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json({ error: "Unsupported request." }, { status: 415 });
  try {
    const text = await request.text();
    if (text.length > 16000)
      return Response.json(
        { error: "Your inquiry is too long." },
        { status: 413 },
      );
    const result = schema.safeParse(JSON.parse(text));
    if (!result.success)
      return Response.json(
        {
          error:
            "Please check your name, email, phone, service, inquiry type and message (at least 20 characters), and accept the privacy notice.",
        },
        { status: 400 },
      );
    const d = result.data;
    const db = await getDB();
    if (await isRateLimited(db, request))
      return Response.json(
        {
          error:
            "Too many inquiries from this connection. Please wait a few minutes and try again.",
        },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    // The database keeps one message column, so the form's other answers are
    // stored at the top of it.
    const details = [
      `Service: ${d.service}`,
      d.selectedPackage && `Selected package: ${d.selectedPackage}`,
      d.phone && `Phone: ${d.phone}`,
    ]
      .filter(Boolean)
      .join("\n");
    const saved = await db
      .prepare(
        "INSERT INTO inquiries (id,name,email,company,type,message,created_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
      )
      .bind(
        d.id,
        d.name,
        d.email,
        d.company,
        d.type,
        `${details}\n\n${d.message}`,
        new Date().toISOString(),
      )
      .run();
    // A retried submission (same id) is already in the sheet.
    if (saved.meta.changes > 0)
      after(() =>
        sendToSheet({
          type: "inquiry",
          data: {
            reference: shortReference(d.id),
            name: d.name,
            email: d.email,
            phone: d.phone,
            company: d.company,
            type: d.type,
            service: d.service,
            selectedPackage: d.selectedPackage,
            packagePrice: d.selectedPackage
              ? (priceForSelection(d.selectedPackage)?.price ?? null)
              : null,
            message: d.message,
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
      return Response.json(
        { error: "Invalid inquiry format." },
        { status: 400 },
      );
    console.error("Inquiry storage operation failed");
    return Response.json(
      {
        error:
          "We couldn’t save your inquiry. Your entries are still here — please try again shortly.",
      },
      { status: 503 },
    );
  }
}
