"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, Check, LockKeyhole, Plus, X } from "lucide-react";
import type { Book, Shelf } from "@/lib/types";
import { useNook } from "./context";
import { Cover } from "./book-cover";
import { useBookJourney } from "./book-journey";
export { Cover } from "./book-cover";
export function PrivateLabel() { return <span className="private-label"><LockKeyhole size={12} /> Only you</span>; }
export function SectionTitle({ eyebrow, title, href, link = "Explore all books" }: { eyebrow?: string; title: string; href?: string; link?: string }) { return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{href && <Link className="text-link" href={href}>{link}<ArrowRight size={16} /></Link>}</div>; }
export function StatusLabel({ entry }: { entry?: Shelf }) {
  return entry ? <span className={`status-label ${entry.status}`}>{entry.paused ? "On pause" : ({ want: "Want to read", reading: "Currently reading", read: "Read" } as Record<string,string>)[entry.status]}</span> : null;
}
export function BookCard({ book, index = 10, compact = false }: { book: Book; index?: number; compact?: boolean }) {
  const { data, mutate, busy, signIn } = useNook(); const entry = data.shelves.find(s => s.bookId === book.id); const { openBook } = useBookJourney();
  return <article className={`book-card ${compact ? "compact" : ""}`}>
    <div className="cover-wrap"><Link href={`/books/${book.slug}`} aria-label={`Read about ${book.title}`}><Cover book={book} eager={index < 3} /></Link><button className={`save-book ${entry ? "saved" : ""}`} disabled={busy} aria-label={entry ? `${book.title} is in your library; view book` : `Add ${book.title} to Want to read`} title={entry ? "In your library" : "Want to read"} onClick={e => { if (!data.reader) signIn(); else if (!entry) void mutate({ action: "library", bookId: book.id, status: "want" }, "A new story on your shelf."); else openBook(book, e.currentTarget); }}>{entry ? <Check size={17} /> : <Plus size={17} />}</button></div>
    <span className="book-genre">{book.genre}</span><h3><Link href={`/books/${book.slug}`}>{book.title}</Link></h3><p className="book-author">{book.author}</p>{entry && <StatusLabel entry={entry} />}
  </article>;
}
export function Empty({ icon = <Bookmark size={30} strokeWidth={1.2} />, title, text, href, action }: { icon?: React.ReactNode; title: string; text: string; href?: string; action?: string }) {
  return <div className="empty-state"><div className="empty-icon">{icon}</div><h2>{title}</h2><p>{text}</p>{href && <Link href={href} className="button primary">{action || "Discover a book"}<ArrowRight size={16} /></Link>}</div>;
}
export function Modal({ title, children, close }: { title: string; children: React.ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const opener = document.activeElement;
    el.showModal();
    return () => {
      el.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  return <dialog className="modal" ref={ref} aria-labelledby="dialog-title" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === ref.current) { const r = ref.current.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } }}><div className="modal-heading"><h2 id="dialog-title">{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={close}><X size={20} /></button></div>{children}</dialog>;
}
