"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Check, Star } from "lucide-react";
import { services } from "./content";
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

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const v = Object.fromEntries(new FormData(f)) as Record<string, string>;
    setSending(true);
    setStatus(null);
    requestId.current ||= newRequestId();
    const reference = requestId.current.slice(0, 8).toUpperCase();
    try {
      // The server saves the feedback and passes it to the studio's Google
      // Sheet, which emails the studio inbox.
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, id: requestId.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok)
        throw new Error(
          data.error ||
            (res.status === 429
              ? "Too much feedback. Please wait a few minutes."
              : "Unable to send your feedback. Please try again."),
        );
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
