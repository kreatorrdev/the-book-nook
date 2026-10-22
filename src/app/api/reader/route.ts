import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { getDb } from "@/db";
import * as s from "@/db/schema";
import { readerSession } from "@/lib/auth";
import { snapshot } from "@/lib/data";
import { validateProgress } from "@/lib/progress";
import type { Reader } from "@/lib/types";
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
const id = z.string().min(1).max(200);
const mutation = z.discriminatedUnion("action", [
  z.object({ action: z.literal("library"), bookId: id, status: z.enum(["want", "reading", "read"]), favorite: z.boolean().optional(), paused: z.boolean().optional(), editionId: id.optional(), progress: z.number().int().optional(), progressMode: z.enum(["percentage", "pages"]).optional(), resetProgress: z.boolean().optional() }),
  z.object({ action: z.literal("remove-book"), bookId: id }),
  z.object({ action: z.literal("save-journal"), id: id.optional(), bookId: id.nullable(), title: z.string().trim().min(1).max(180), body: z.string().trim().min(1).max(50000), version: z.string().optional() }),
  z.object({ action: z.literal("delete-journal"), id }),
  z.object({ action: z.literal("publish-review"), bookId: id, body: z.string().trim().min(20).max(5000), rating: z.number().int().min(1).max(5), spoiler: z.boolean(), publicConsent: z.literal(true) }),
  z.object({ action: z.literal("delete-review"), id }),
  z.object({ action: z.literal("report-review"), id, reason: z.string().trim().min(5).max(1000) }),
  z.object({ action: z.literal("profile"), name: z.string().trim().min(1).max(80), bio: z.string().max(500), view: z.enum(["grid", "shelf"]) }),
]);
export async function GET(request: Request) {
  const session = await readerSession(request.headers);
  return json(await snapshot(session?.user as Reader | null));
}
export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin !== new URL(process.env.BETTER_AUTH_URL || request.url).origin) return json({ error: "This request did not come from this reading room." }, 403);
    const session = await readerSession(request.headers);
    if (!session) return json({ error: "Please sign in to continue." }, 401);
    if (Number(request.headers.get("content-length")) > 100000) return json({ error: "This entry is too large." }, 413);
    const parsed = mutation.safeParse(await request.json());
    if (!parsed.success) return json({ error: parsed.error.issues[0].message }, 400);
    const body = parsed.data;
    const db = await getDb(); const userId = session.user.id; const now = new Date();
    await db.transaction(async tx => {
      if ("bookId" in body && body.bookId) {
        const [book] = await tx.select().from(s.books).where(eq(s.books.id, body.bookId));
        if (!book) throw new Error("This book could not be found.");
      }
      if (body.action === "library") {
        const [old] = await tx.select().from(s.shelves).where(and(eq(s.shelves.userId, userId), eq(s.shelves.bookId, body.bookId)));
        const editionId = body.editionId ?? old?.editionId ?? `${body.bookId}-unspecified`;
        const [edition] = await tx.select().from(s.editions).where(and(eq(s.editions.id, editionId), eq(s.editions.bookId, body.bookId)));
        if (!edition) throw new Error("Choose an edition belonging to this book.");
        const changedEdition = old && old.editionId !== editionId;
        const restarted = old && old.status === "read" && body.status !== "read";
        if ((changedEdition || restarted || (body.status === "want" && old?.status !== "want")) && old && old.progress > 0 && !body.resetProgress) throw new Error("Confirm resetting progress before changing the edition or starting again.");
        let mode = body.progressMode ?? (body.resetProgress ? "percentage" : old?.progressMode) ?? "percentage";
        let progress = body.progress ?? (body.resetProgress ? 0 : old?.progress) ?? 0;
        if (body.status === "want") { progress = 0; mode = "percentage"; }
        if (body.status === "read") { progress = mode === "pages" && edition.pages ? edition.pages : 100; if (!edition.pages) mode = "percentage"; }
        validateProgress(mode, progress, edition.pages);
        const values = { status: body.status, favorite: body.favorite ?? old?.favorite ?? false, paused: body.status === "reading" ? body.paused ?? old?.paused ?? false : false, editionId, progress, progressMode: mode, updatedAt: now };
        await tx.insert(s.shelves).values({ id: randomUUID(), userId, bookId: body.bookId, ...values }).onConflictDoUpdate({ target: [s.shelves.userId, s.shelves.bookId], set: values });
      } else if (body.action === "remove-book") {
        await tx.delete(s.shelves).where(and(eq(s.shelves.userId, userId), eq(s.shelves.bookId, body.bookId)));
      } else if (body.action === "save-journal") {
        if (body.id) {
          const [old] = await tx.select().from(s.journals).where(and(eq(s.journals.id, body.id), eq(s.journals.userId, userId)));
          if (!old) throw new Error("This journal entry could not be found.");
          if (!body.version || old.updatedAt.toISOString() !== body.version) throw new Error("This entry changed in another window. Your draft is safe here; reload the saved entry before trying again.");
          // Compare-and-swap also protects against simultaneous saves in PostgreSQL.
          const result = await tx.update(s.journals).set({ title: body.title, body: body.body, bookId: body.bookId, updatedAt: now }).where(and(eq(s.journals.id, body.id), eq(s.journals.userId, userId), eq(s.journals.updatedAt, old.updatedAt))).returning();
          if (!result.length) throw new Error("Another save arrived first. Your draft is still here.");
        } else await tx.insert(s.journals).values({ id: randomUUID(), userId, bookId: body.bookId, title: body.title, body: body.body });
      } else if (body.action === "delete-journal") {
        const result = await tx.delete(s.journals).where(and(eq(s.journals.id, body.id), eq(s.journals.userId, userId))).returning();
        if (!result.length) throw new Error("This journal entry could not be found.");
      } else if (body.action === "publish-review") {
        if (!(await tx.select({ id: s.user.id }).from(s.user).where(eq(s.user.role, "admin")).limit(1)).length) throw new Error("Public reviews aren't open yet. You can keep a private reflection in your journal.");
        await tx.insert(s.reviews).values({ id: randomUUID(), userId, bookId: body.bookId, body: body.body, rating: body.rating, spoiler: body.spoiler }).onConflictDoUpdate({ target: [s.reviews.userId, s.reviews.bookId], set: { body: body.body, rating: body.rating, spoiler: body.spoiler, updatedAt: now } });
      } else if (body.action === "delete-review") {
        const result = await tx.delete(s.reviews).where(and(eq(s.reviews.id, body.id), eq(s.reviews.userId, userId))).returning();
        if (!result.length) throw new Error("This review could not be found.");
      } else if (body.action === "report-review") {
        const [review] = await tx.select().from(s.reviews).where(and(eq(s.reviews.id, body.id), eq(s.reviews.hidden, false)));
        if (!review || review.userId === userId) throw new Error("This review cannot be reported.");
        await tx.insert(s.reports).values({ id: randomUUID(), userId, reviewId: body.id, reason: body.reason }).onConflictDoNothing();
      } else if (body.action === "profile") {
        await tx.update(s.user).set({ name: body.name, updatedAt: now }).where(eq(s.user.id, userId));
        await tx.insert(s.profiles).values({ userId, bio: body.bio, view: body.view }).onConflictDoUpdate({ target: s.profiles.userId, set: { bio: body.bio, view: body.view } });
      }
    });
    return json({ ok: true, data: await snapshot({ ...session.user, name: body.action === "profile" ? body.name : session.user.name, role: session.user.role || "reader" } as Reader) });
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: "The request could not be read." }, 400);
    const message = error instanceof Error ? error.message : "Your changes could not be saved. Please try again.";
    if (message.includes("query:") || message.includes("connect") || message.includes("constraint")) { console.error("Reader write failed", error); return json({ error: "Your changes could not be saved. Your draft is still here; please try again." }, 500); }
    return json({ error: message }, 400);
  }
}
