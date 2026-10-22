import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { getDb } from "@/db";
import * as s from "@/db/schema";
import { readerSession } from "@/lib/auth";
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
export async function GET(request: Request) {
  const reader = await readerSession(request.headers);
  if (reader?.user.role !== "admin") return json({ error: "Administrator access is required." }, 403);
  const db = await getDb();
  const [books, collections, reviews, reports, actions] = await Promise.all([
    db.select().from(s.books), db.select().from(s.curatedLists),
    db.select({ id: s.reviews.id, bookId: s.reviews.bookId, body: s.reviews.body, name: s.user.name, hidden: s.reviews.hidden, rating: s.reviews.rating, spoiler: s.reviews.spoiler }).from(s.reviews).innerJoin(s.user, eq(s.reviews.userId, s.user.id)),
    db.select().from(s.reports).orderBy(desc(s.reports.createdAt)), db.select().from(s.moderation).orderBy(desc(s.moderation.createdAt)).limit(50)
  ]);
  return json({ books, collections, reviews, reports, actions });
}
const mutation = z.discriminatedUnion("action", [
  z.object({ action: z.literal("moderate"), id: z.string(), hidden: z.boolean() }),
  z.object({ action: z.literal("resolve"), id: z.string() }),
  z.object({ action: z.literal("book"), id: z.string(), title: z.string().trim().min(1).max(200), author: z.string().trim().min(1).max(200), genre: z.string().trim().min(1).max(80), moods: z.array(z.string().trim().min(1).max(50)).max(12), description: z.string().trim().min(20).max(5000), featured: z.boolean(), available: z.boolean() }),
  z.object({ action: z.literal("collection"), id: z.string(), title: z.string().trim().min(1).max(200), subtitle: z.string().max(200), description: z.string().trim().min(20).max(2000), books: z.array(z.string()).min(1).max(20) })
]);
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(process.env.BETTER_AUTH_URL || request.url).origin) return json({ error: "Invalid request origin." }, 403);
  const reader = await readerSession(request.headers);
  if (reader?.user.role !== "admin") return json({ error: "Administrator access is required." }, 403);
  try {
    const body = mutation.parse(await request.json()); const db = await getDb();
    await db.transaction(async tx => {
      if (body.action === "moderate") {
        const result = await tx.update(s.reviews).set({ hidden: body.hidden, updatedAt: new Date() }).where(eq(s.reviews.id, body.id)).returning();
        if (!result.length) throw new Error("Review not found.");
        await tx.insert(s.moderation).values({ id: randomUUID(), adminId: reader.user.id, reviewId: body.id, action: body.hidden ? "hide" : "restore" });
      } else if (body.action === "resolve") {
        await tx.update(s.reports).set({ resolved: true, updatedAt: new Date() }).where(eq(s.reports.id, body.id));
      } else if (body.action === "book") {
        const { action, id, ...values } = body;
        await tx.update(s.books).set(values).where(eq(s.books.id, id));
      } else {
        const { action, id, ...values } = body;
        for (const bookId of values.books) {
          if (!(await tx.select({ id: s.books.id }).from(s.books).where(eq(s.books.id, bookId))).length) throw new Error("A collection contains an unknown book.");
        }
        await tx.update(s.curatedLists).set(values).where(eq(s.curatedLists.id, id));
      }
    });
    return json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) return json({ error: error.issues[0].message }, 400);
    console.error("Admin write failed", error);
    return json({ error: "The change could not be saved. Check the fields and try again." }, 400);
  }
}
