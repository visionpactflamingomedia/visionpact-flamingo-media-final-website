import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});
export const feedback = sqliteTable("feedback", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  rating: integer("rating").notNull(),
  message: text("message").notNull(),
  allowQuote: integer("allow_quote").notNull(),
  createdAt: text("created_at").notNull(),
});
// Per-visitor submission counter for rate limiting. `key` is a SHA-256 hash of
// the client IP and the day, so raw IP addresses are never stored.
export const inquiryRateLimits = sqliteTable("inquiry_rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  windowStart: integer("window_start").notNull(),
});
