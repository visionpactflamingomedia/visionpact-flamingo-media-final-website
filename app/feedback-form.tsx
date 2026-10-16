"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Star } from "lucide-react";
import { services } from "./content";
import { sendFeedbackEmail } from "./inquiry-email";
import { newRequestId } from "./request-id";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

// Client feedback form: saved to /api/feedback, then emailed to the studio.
export function FeedbackForm({ onPrivacy }: { onPrivacy: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const requestId = useRef("");
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const v = Object.fromEntries(new FormData(f)) as Record<string, string>;
    setSending(true);
    setStatus(null);
    requestId.current ||= newRequestId();
    const reference = requestId.current.slice(0, 8).toUpperCase();
    // Bots fill the hidden field or submit within moments of the page loading.
    const looksAutomated =
      Boolean(v.website) || Date.now() - shownAt.current < 2000;
    try {
      // Save first so the server's rate limit also stops email spam.
      let saveError: unknown = null;
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...v, id: requestId.current }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.status === 429)
          throw new Error(data.error || "Too much feedback. Please wait a few minutes.");
        if (!res.ok)
          saveError = new Error(
            data.error || "Unable to send your feedback. Please try again.",
          );
      } catch (err) {
        if (err instanceof Error && !(err instanceof TypeError)) throw err;
        saveError = err; // network failure: still try the email
      }
      let mailError: unknown = looksAutomated
        ? new Error("Spam check failed.")
        : null;
      if (!mailError)
        await sendFeedbackEmail({
          reference,
          name: v.name,
          email: v.email,
          service: v.service,
          rating: Number(v.rating),
          message: v.message,
          allowQuote: v.allowQuote === "yes",
        }).catch((err: unknown) => {
          mailError = err;
          console.warn("Feedback email not sent:", err);
        });
      if (saveError && mailError) throw saveError;
      setStatus({
        ok: true,
        text: `Thank you, ${v.name.split(" ")[0]}! Your feedback has been sent. Reference: ${reference}.`,
      });
      f.reset();
      setRating(0);
      requestId.current = "";
    } catch (err) {
      setStatus({
        ok: false,
        text:
          err instanceof Error && !(err instanceof TypeError)
            ? err.message
            : "Connection unavailable. Your feedback is still here; please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  const shown = hover || rating;
  return (
    <form className="feedback-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Your name
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Full name" />
        </label>
        <label>
          Email <span>(optional)</span>
          <input name="email" type="email" maxLength={254} autoComplete="email" placeholder="So we can reply" />
        </label>
      </div>
      <label>
        Service you used <span>(optional)</span>
        <select name="service" defaultValue="">
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.name}>{s.name}</option>
          ))}
          <option>Something else</option>
        </select>
      </label>
      <fieldset className="rating">
        <legend>How would you rate working with us?</legend>
        <div className="stars" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className={n <= shown ? "on" : undefined}
              onMouseEnter={() => setHover(n)}
            >
              <input
                type="radio"
                name="rating"
                value={n}
                required
                className="sr-only"
                checked={rating === n}
                onChange={() => setRating(n)}
              />
              <Star size={30} aria-hidden="true" />
              <span className="sr-only">
                {n} out of 5, {RATING_LABELS[n]}
              </span>
            </label>
          ))}
          <span className="rating-label" aria-hidden="true">
            {shown ? RATING_LABELS[shown] : "Choose a rating"}
          </span>
        </div>
      </fieldset>
      <label>
        Your feedback
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          placeholder="What went well, and what could we do better?"
        />
      </label>
      <label className="check">
        <input type="checkbox" name="allowQuote" value="yes" />
        <span>You may quote my feedback on this website (first name only).</span>
      </label>
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="check">
        <input type="checkbox" name="consent" value="yes" required />
        <span>
          I agree to share these details.{" "}
          <button type="button" onClick={onPrivacy}>
            Privacy notice
          </button>
        </span>
      </label>
      <button className="button pink" type="submit" disabled={sending}>
        {sending ? "Sending your feedback…" : "Send feedback"}
        <ArrowUpRight size={18} aria-hidden="true" />
      </button>
      {status && (
        <p role="status" className={`form-status ${status.ok ? "success" : "error"}`}>
          {status.ok && <Check size={18} aria-hidden="true" />} {status.text}
        </p>
      )}
    </form>
  );
}
