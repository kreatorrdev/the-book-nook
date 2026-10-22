import { pgTable, text, timestamp, boolean, integer, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
const times = { createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow() };
export const user = pgTable("users", {
  id: text("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false), image: text("image"),
  role: text("role").notNull().default("reader"), ...times,
});
export const session = pgTable("sessions", {
  id: text("id").primaryKey(), token: text("token").notNull().unique(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), ipAddress: text("ip_address"), userAgent: text("user_agent"), ...times,
});
export const account = pgTable("accounts", {
  id: text("id").primaryKey(), accountId: text("account_id").notNull(), providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"), refreshToken: text("refresh_token"), idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }), refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"), password: text("password"), ...times,
});
export const verification = pgTable("verifications", {
  id: text("id").primaryKey(), identifier: text("identifier").notNull(), value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), ...times,
});
export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  bio: text("bio").notNull().default(""), view: text("view").notNull().default("grid"),
});
export const books = pgTable("books", {
  id: text("id").primaryKey(), slug: text("slug").notNull().unique(), title: text("title").notNull(), author: text("author").notNull(), year: integer("year").notNull(),
  genre: text("genre").notNull(), moods: jsonb("moods").$type<string[]>().notNull(), description: text("description").notNull(),
  color: text("color").notNull(), ink: text("ink").notNull(), motif: text("motif").notNull(),
  featured: boolean("featured").notNull().default(false), available: boolean("available").notNull().default(true),
});
export const editions = pgTable("book_editions", {
  id: text("id").primaryKey(), bookId: text("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  label: text("label").notNull(), format: text("format").notNull(), language: text("language").notNull(), identifier: text("identifier"), pages: integer("pages"),
});
export const curatedLists = pgTable("curated_lists", {
  id: text("id").primaryKey(), title: text("title").notNull(), subtitle: text("subtitle").notNull(), description: text("description").notNull(),
  books: jsonb("books").$type<string[]>().notNull(), color: text("color").notNull(),
});
export const shelves = pgTable("shelf_entries", {
  id: text("id").primaryKey(), userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  bookId: text("book_id").notNull().references(() => books.id), status: text("status").notNull(),
  favorite: boolean("favorite").notNull().default(false), paused: boolean("paused").notNull().default(false),
  editionId: text("edition_id").references(() => editions.id), progress: integer("progress").notNull().default(0), progressMode: text("progress_mode").notNull().default("percentage"), ...times,
}, t => [uniqueIndex("shelf_user_work").on(t.userId, t.bookId)]);
export const journals = pgTable("journal_entries", {
  id: text("id").primaryKey(), userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  bookId: text("book_id").references(() => books.id), title: text("title").notNull(), body: text("body").notNull(), ...times,
});
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(), userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  bookId: text("book_id").notNull().references(() => books.id), body: text("body").notNull(), rating: integer("rating").notNull(),
  spoiler: boolean("spoiler").notNull().default(false), hidden: boolean("hidden").notNull().default(false), ...times,
}, t => [uniqueIndex("review_user_work").on(t.userId, t.bookId)]);
export const reports = pgTable("review_reports", {
  id: text("id").primaryKey(), reviewId: text("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), reason: text("reason").notNull(), resolved: boolean("resolved").notNull().default(false), ...times,
}, t => [uniqueIndex("report_user_review").on(t.userId, t.reviewId)]);
export const moderation = pgTable("moderation_actions", {
  id: text("id").primaryKey(), adminId: text("admin_id").references(() => user.id, { onDelete: "set null" }),
  reviewId: text("review_id").references(() => reviews.id, { onDelete: "set null" }), action: text("action").notNull(), ...times,
});
