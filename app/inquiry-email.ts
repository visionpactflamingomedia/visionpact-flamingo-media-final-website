import { contact } from "./content";

export type InquiryEmail = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  type: string;
  service: string;
  selectedPackage: string;
  message: string;
};

export type FeedbackEmail = {
  reference: string;
  name: string;
  email: string;
  service: string;
  rating: number;
  message: string;
  allowQuote: boolean;
};

// Sends form fields to the studio inbox through FormSubmit (formsubmit.co),
// which needs no server code or API key. The first submission makes FormSubmit
// send an "Activate Form" email to the inbox; click it once, and every later
// submission arrives as a formatted email.
async function emailStudio(fields: Record<string, string>) {
  // Strip angle brackets so visitor text cannot inject HTML into the email.
  const clean = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, v.replace(/[<>]/g, "")]),
  );
  const res = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _template: "table",
      _captcha: "false",
      ...clean,
      "Sent from": window.location.href,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };
  if (!res.ok || String(data.success) !== "true")
    throw new Error(data.message || "The email notification could not be sent.");
}

// Reply in the mail client goes to the visitor.
export function sendInquiryEmail(i: InquiryEmail) {
  return emailStudio({
    _subject: `New website inquiry: ${i.service} | ${i.name}`,
    _replyto: i.email,
    Reference: i.reference,
    Name: i.name,
    email: i.email,
    Phone: i.phone || "Not given",
    "Company / brand": i.company || "Not given",
    "Inquiry type": i.type,
    Service: i.service,
    "Selected package": i.selectedPackage || "None",
    Message: i.message,
  });
}

export function sendFeedbackEmail(f: FeedbackEmail) {
  const stars = "★".repeat(f.rating) + "☆".repeat(5 - f.rating);
  return emailStudio({
    _subject: `New client feedback: ${f.rating}/5 | ${f.name}`,
    ...(f.email && { _replyto: f.email, email: f.email }),
    Reference: f.reference,
    Name: f.name,
    ...(!f.email && { Email: "Not given" }),
    "Service used": f.service || "Not specified",
    Rating: `${stars} (${f.rating}/5)`,
    Feedback: f.message,
    "May we quote this?": f.allowQuote ? "Yes, first name only" : "No",
  });
}
