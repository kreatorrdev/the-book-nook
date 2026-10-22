import { and, desc, eq, inArray, or } from "drizzle-orm";
import { getDb } from "../db";
import * as s from "../db/schema";
import type { Reader, Snapshot } from "./types";
export async function snapshot(reader: Reader | null): Promise<Snapshot> {
  const db = await getDb();
  const [books, editions, collections, publicReviews, shelves, journals, profile, administrators] = await Promise.all([
    db.select().from(s.books).where(reader ? or(eq(s.books.available, true), inArray(s.books.id, db.select({ bookId: s.shelves.bookId }).from(s.shelves).where(eq(s.shelves.userId, reader.id))), inArray(s.books.id, db.select({ bookId: s.journals.bookId }).from(s.journals).where(eq(s.journals.userId, reader.id))), inArray(s.books.id, db.select({ bookId: s.reviews.bookId }).from(s.reviews).where(eq(s.reviews.userId, reader.id)))) : eq(s.books.available, true)), db.select().from(s.editions), db.select().from(s.curatedLists),
    db.select({ id: s.reviews.id, bookId: s.reviews.bookId, body: s.reviews.body, rating: s.reviews.rating, spoiler: s.reviews.spoiler, name: s.user.name, userId: s.reviews.userId, hidden: s.reviews.hidden, createdAt: s.reviews.createdAt }).from(s.reviews).innerJoin(s.user, eq(s.reviews.userId, s.user.id)).where(reader ? or(eq(s.reviews.hidden, false), eq(s.reviews.userId, reader.id)) : eq(s.reviews.hidden, false)).orderBy(desc(s.reviews.createdAt)),
    reader ? db.select().from(s.shelves).where(eq(s.shelves.userId, reader.id)).orderBy(desc(s.shelves.updatedAt)) : [],
    reader ? db.select().from(s.journals).where(eq(s.journals.userId, reader.id)).orderBy(desc(s.journals.updatedAt)) : [],
    reader ? db.select().from(s.profiles).where(eq(s.profiles.userId, reader.id)) : [],
    db.select({ id: s.user.id }).from(s.user).where(eq(s.user.role, "admin")).limit(1),
  ]);
  // Explicit projection prevents owner IDs/private data from leaking into public review records.
  return JSON.parse(JSON.stringify({ books, editions, collections, reviews: publicReviews.map(({ userId, ...review }) => ({ ...review, mine: userId === reader?.id })), reader, shelves: shelves.map(({ userId, ...row }) => row), journals: journals.map(({ userId, ...row }) => row), profile: profile[0] ? { bio: profile[0].bio, view: profile[0].view } : { bio: "", view: "grid" }, reviewPublishingEnabled: administrators.length > 0 }));
}
export const owned = (userId: string, id: string) => and(eq(s.journals.userId, userId), eq(s.journals.id, id));
