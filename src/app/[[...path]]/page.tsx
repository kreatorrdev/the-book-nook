import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { readerSession } from "@/lib/auth";
import { snapshot } from "@/lib/data";
import type { Reader } from "@/lib/types";
import { BookNook } from "@/components/book-nook";
import { getDb } from "@/db";
import { books } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { publicMetadata, siteDescription } from "@/lib/site";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
type Props = { params: Promise<{ path?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props) {
  const { path = [] } = await params;
  if (path[0] === "books" && path.length === 2) {
    const [book] = await (await getDb()).select().from(books).where(and(eq(books.slug, path[1]), eq(books.available, true)));
    if (book) return publicMetadata(`${book.title} by ${book.author}`, book.description, `/books/${book.slug}`);
  }
  const name = ({ discover: "Discover", "my-shelves": "My Library", journal: "Private Journal", "sign-in": "Sign in", "sign-up": "Create an account", profile: "Your profile", settings: "Settings", admin: "Content & moderation" } as Record<string, string>)[path[0]];
  if (["my-shelves", "journal", "profile", "settings", "admin", "sign-in", "sign-up"].includes(path[0])) return { title: name, robots: { index: false, follow: false } };
  if (!path.length) return { ...publicMetadata("The Book Nook — A little space for your reading life", siteDescription, "/"), title: { absolute: "The Book Nook — A little space for your reading life" } };
  return publicMetadata(name || "The Book Nook", siteDescription, path[0] === "discover" ? "/discover" : "/");
}
export default async function Page({ params, searchParams }: Props) {
  const { path = [] } = await params; const query = await searchParams;
  const route = "/" + path.join("/");
  const valid = ["/", "/discover", "/my-shelves", "/journal", "/sign-in", "/sign-up", "/profile", "/settings", "/admin"].includes(route) || (path[0] === "books" && path.length === 2) || (path[0] === "journal" && path.length === 2);
  if (!valid) notFound();
  const session = await readerSession(await headers()); const reader = session?.user as Reader | undefined;
  const returnQuery = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => { if (typeof value === "string") returnQuery.set(key, value); });
  if (["my-shelves", "journal", "profile", "settings", "admin"].includes(path[0]) && !reader) redirect(`/sign-in?returnTo=${encodeURIComponent(route + (returnQuery.size ? "?" + returnQuery : ""))}`);
  if (path[0] === "admin" && reader?.role !== "admin") notFound();
  const data = await snapshot(reader || null);
  if (path[0] === "books" && !data.books.some(b => b.slug === path[1])) notFound();
  if (path[0] === "journal" && path[1] && path[1] !== "new" && !data.journals.some(j => j.id === path[1])) notFound();
  return <BookNook initial={data} route={route} query={query} />;
}
