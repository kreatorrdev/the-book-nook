"use client";
import { useState } from "react";
import type { Book } from "@/lib/types";

export function Cover({ book, eager = false }: { book: Book; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed || book.motif === "fallback" ? <div className="cover-fallback" style={{ background: book.color, color: book.ink }}><span>THE BOOK NOOK</span><strong>{book.title}</strong><span>{book.author}</span></div> : <img className="book-cover" src={`/covers/${book.slug}.svg`} width={360} height={540} alt={`${book.title} — original illustrated cover`} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} />;
}
