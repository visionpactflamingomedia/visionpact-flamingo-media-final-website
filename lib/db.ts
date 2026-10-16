import { env } from "cloudflare:workers";
// Mirror the drizzle/ migrations so a fresh local database works without
// running migrations first.
const SCHEMA = [
  "CREATE TABLE IF NOT EXISTS inquiries (id text PRIMARY KEY NOT NULL, name text NOT NULL, email text NOT NULL, company text NOT NULL, type text NOT NULL, message text NOT NULL, created_at text NOT NULL)",
  "CREATE TABLE IF NOT EXISTS inquiry_rate_limits (key text PRIMARY KEY NOT NULL, count integer NOT NULL, window_start integer NOT NULL)",
  "CREATE TABLE IF NOT EXISTS feedback (id text PRIMARY KEY NOT NULL, name text NOT NULL, email text NOT NULL, service text NOT NULL, rating integer NOT NULL, message text NOT NULL, allow_quote integer NOT NULL, created_at text NOT NULL)",
];
let ready: Promise<unknown> | null = null;
export async function getDB() {
  const db = (env as unknown as { DB: D1Database }).DB;
  if (!db) throw new Error("Inquiry storage unavailable");
  ready ??= db
    .batch(SCHEMA.map((sql) => db.prepare(sql)))
    .catch((error) => {
      ready = null;
      throw error;
    });
  await ready;
  return db;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
// True when this visitor has sent too many submissions of one kind (`scope`,
// e.g. "inquiry" or "feedback") in the current window. Cloudflare sets
// cf-connecting-ip; without it (local dev) all requests share one bucket.
export async function isRateLimited(
  db: D1Database,
  request: Request,
  scope = "inquiry",
) {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${scope}:${ip}:${day}`),
  );
  const key = Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  const now = Date.now();
  const row = await db
    .prepare("SELECT count, window_start FROM inquiry_rate_limits WHERE key = ?")
    .bind(key)
    .first<{ count: number; window_start: number }>();
  if (!row || now - row.window_start > WINDOW_MS) {
    await db.batch([
      db
        .prepare(
          "INSERT INTO inquiry_rate_limits (key, count, window_start) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = 1, window_start = excluded.window_start",
        )
        .bind(key, now),
      // Housekeeping: drop counters older than a day.
      db
        .prepare("DELETE FROM inquiry_rate_limits WHERE window_start < ?")
        .bind(now - 24 * 60 * 60 * 1000),
    ]);
    return false;
  }
  if (row.count >= MAX_PER_WINDOW) return true;
  await db
    .prepare("UPDATE inquiry_rate_limits SET count = count + 1 WHERE key = ?")
    .bind(key)
    .run();
  return false;
}
