"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Filter, Search, X } from "lucide-react";
import { useNook } from "./context";
import { BookCard, Empty, Modal } from "./common";
import { moodOptions } from "@/lib/catalog";
export { GothicHome as Home } from "./gothic-home";
export function Discover({ query }: { query: Record<string, string | string[] | undefined> }) {
  const { data } = useNook(); const router = useRouter();
  const str = (key: string) => typeof query[key] === "string" ? query[key] as string : "";
  const q = str("q"), genre = str("genre"), mood = str("mood"), collectionId = str("collection"), sort = str("sort");
  const [search, setSearch] = useState(q); const [filters, setFilters] = useState(false);
  const [draft, setDraft] = useState({ genre, mood });
  const filterToggle = useRef<HTMLButtonElement>(null);
  function closeFilters() {
    setFilters(false);
    requestAnimationFrame(() => filterToggle.current?.focus());
  }
  useEffect(() => setSearch(q), [q]);
  const genres = [...new Set(data.books.filter(b => b.available).map(b => b.genre))].sort();
  const collection = data.collections.find(c => c.id === collectionId);
  function update(values: Record<string, string>) { const p = new URLSearchParams(); Object.entries({ q, genre, mood, collection: collectionId, sort, ...values }).forEach(([key, value]) => { if (value) p.set(key, value); }); router.push(`/discover${p.size ? "?" + p : ""}`, { scroll: false }); }
  const filtered = data.books.filter(b => b.available && (!q || `${b.title} ${b.author}`.toLowerCase().includes(q.toLowerCase())) && (!genre || b.genre === genre) && (!mood || b.moods.includes(mood)) && (!collectionId || !!collection?.books.includes(b.id))).sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : sort === "author" ? a.author.localeCompare(b.author) : sort === "oldest" ? a.year - b.year : sort === "newest" ? b.year - a.year : Number(b.featured) - Number(a.featured));
  const filterControls = (mobile = false) => <><label>Genre<select value={mobile ? draft.genre : genre} onChange={e => mobile ? setDraft({ ...draft, genre: e.target.value }) : update({ genre: e.target.value })}><option value="">All genres</option>{genres.map(g => <option key={g}>{g}</option>)}</select></label><label>Mood<select value={mobile ? draft.mood : mood} onChange={e => mobile ? setDraft({ ...draft, mood: e.target.value }) : update({ mood: e.target.value })}><option value="">Every mood</option>{[...new Set([...moodOptions, ...data.books.filter(b=>b.available).flatMap(b=>b.moods)])].map(m => <option key={m}>{m}</option>)}</select></label></>;
  return <div className="page-width page-content"><div className="page-intro"><span className="eyebrow">FOLLOW YOUR CURIOSITY</span><h1>{collection ? collection.title : "Your next chapter starts here."}</h1><p>{collection ? collection.description : "Old favorites. Unexpected discoveries. A whole world between the covers."}</p></div>
    <form className="catalog-search" onSubmit={e => { e.preventDefault(); update({ q: search }); }}><Search size={21} strokeWidth={1.5} /><input aria-label="Search by title or author" placeholder="A title, an author, a story on your mind…" value={search} onChange={e => setSearch(e.target.value)} maxLength={200} />{search && <button type="button" className="icon-button" aria-label="Clear search" onClick={() => { setSearch(""); update({ q: "" }); }}><X size={17} /></button>}<button className="button primary" type="submit">Find a book <ArrowRight size={16} /></button></form>
    <div className="catalog-toolbar"><div className="desktop-filters">{filterControls()}</div><button ref={filterToggle} className="button secondary mobile-filter" aria-expanded={filters} onClick={() => { setDraft({ genre, mood }); setFilters(true); }}><Filter size={16} /> Filters</button><label className="sort-control">Sort by<select aria-label="Sort books" value={sort} onChange={e => update({ sort: e.target.value })}><option value="">Our selections</option><option value="title">Title: A–Z</option><option value="author">Author: A–Z</option><option value="oldest">First published: oldest</option><option value="newest">First published: newest</option></select></label></div>
    <div className="catalog-results"><span>{filtered.length} {filtered.length === 1 ? "story" : "stories"} to discover</span>{(q || genre || mood || collectionId) && <div className="filter-chips">{[["q", q], ["genre", genre], ["mood", mood], ["collection", collection?.title || (collectionId ? "Unknown collection" : "")]].map(([key, value]) => value && <button key={key} onClick={() => update({ [key]: "" })}>{value}<X size={12} /></button>)}<Link href="/discover" className="reset-link">Reset all</Link></div>}</div>
    {filtered.length ? <div className="book-grid catalog-grid">{filtered.map((book, i) => <BookCard book={book} key={book.id} index={i} />)}</div> : <Empty icon={<Search size={30} />} title="A different story is waiting." text="We couldn't find a match. Try a different title, author, or a little less filtering." href="/discover" action="See all books" />}
    <div className="catalog-end"><span>✦</span> {filtered.length ? "No algorithms. Just good books, chosen with care." : "Your next favorite might be one search away."}</div>
    {filters && <Modal title="Find your kind of story" close={closeFilters}><div className="form-stack">{filterControls(true)}<div className="form-actions"><button className="button secondary" onClick={() => setDraft({ genre: "", mood: "" })}>Clear filters</button><button className="button primary" onClick={() => { update(draft); closeFilters(); }}>Apply filters <CheckIcon /></button></div></div></Modal>}
  </div>;
}
function CheckIcon() { return <ArrowRight size={16} />; }
