import type { CatalogBook } from "./catalog";
export type Book = CatalogBook;
export type Edition = { id: string; bookId: string; label: string; format: string; language: string; identifier: string | null; pages: number | null };
export type Shelf = { id: string; bookId: string; status: string; favorite: boolean; paused: boolean; editionId: string | null; progress: number; progressMode: string; updatedAt: string };
export type Journal = { id: string; bookId: string | null; title: string; body: string; createdAt: string; updatedAt: string };
export type Review = { id: string; bookId: string; body: string; rating: number; spoiler: boolean; name: string; mine: boolean; hidden: boolean; createdAt: string };
export type Collection = { id: string; title: string; subtitle: string; description: string; books: string[]; color: string };
export type Reader = { id: string; name: string; email: string; role: string };
export type Snapshot = { books: Book[]; editions: Edition[]; collections: Collection[]; reviews: Review[]; reader: Reader | null; shelves: Shelf[]; journals: Journal[]; profile: { bio: string; view: string }; reviewPublishingEnabled: boolean };
