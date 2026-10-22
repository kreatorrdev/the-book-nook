"use client";
import Link from "next/link";
import { ArrowDown, ArrowRight, Coffee, Compass, Feather, Heart, Sparkles } from "lucide-react";
import { useNook } from "./context";
import { BookCard, Cover, SectionTitle } from "./common";
import { CathedralMark } from "./book-journey";
import { percentage } from "@/lib/progress";

const moods = [
  { name: "Comforting", note: "A familiar kind of magic", icon: Coffee, image: "reading-desk", position: "12% 50%" },
  { name: "Adventurous", note: "Beyond the familiar", icon: Compass, image: "gothic-cathedral", position: "70% 50%" },
  { name: "Reflective", note: "A little room to wonder", icon: Feather, image: "gothic-archive", position: "55% 50%" },
  { name: "Romantic", note: "For the heart to remember", icon: Heart, image: "reading-desk", position: "85% 15%" },
  { name: "Atmospheric", note: "Lose yourself completely", icon: Sparkles, image: "gothic-archive", position: "15% 50%" },
];

export function GothicHome() {
  const { data } = useNook();
  const collection = data.collections.find(c => c.id === "the-art-of-slow-living") || data.collections[0];
  const active = data.shelves.filter(e => e.status === "reading" && !e.paused).slice(0, 2);
  return <>
    <section className="cathedral-hero">
      <picture><source media="(max-width: 430px)" srcSet="/images/gothic-cathedral-game-mobile.webp"/><img className="cathedral-image" src="/images/gothic-cathedral-game.webp" width={1672} height={941} fetchPriority="high" alt="An immersive Gothic library with weathered stone vaults, carved walnut shelves, warm reading lamps and daylight falling through a tall stained-glass window" /></picture>
      <div className="cathedral-overlay"/>
      <div className="cathedral-hero-inner page-width"><div className="cathedral-copy"><span className="eyebrow"><span className="gold-rule"/> A SANCTUARY FOR THE WRITTEN WORD</span><h1>Some doors lead<br/>to <em>other worlds.</em></h1><p>Beyond the noise, beneath the vaulted ceilings.<br/>Find a story to disappear into.<br/>And a little space to call your own.</p><div className="cathedral-actions"><Link className="button primary" href="/discover">Enter the library <ArrowRight size={17}/></Link><a className="hero-shelf-link" href="#curated-shelf">Explore the shelves <ArrowDown size={15}/></a></div></div>
        <div className="reading-seal" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="reading-seal-ring" d="M60 13a47 47 0 1 1-.1 0"/></defs><text><textPath href="#reading-seal-ring" textLength="291">FOR THE LOVE OF STORIES · EST. 2026 · </textPath></text></svg><span><span>just one</span>more<br/><em>chapter.</em></span><i>✦</i></div>
        <div className="hero-colophon"><span>I <i/> THE READING ROOM</span><p>Come in. Stay a little longer.</p><a href="#curated-shelf" aria-label="Scroll to the curated shelf"><ArrowDown size={18}/></a></div>
      </div>
    </section>
    <div className="inscription-strip"><span>Discover the extraordinary</span><span aria-hidden="true">✦</span><span>Keep what moves you</span><span aria-hidden="true">✦</span><span>Return to yourself</span></div>
    <div className="page-width gothic-home-sections">
      {!!active.length && <section className="continue-section"><SectionTitle eyebrow="YOUR BOOKMARK IS STILL HERE" title="Right where you left off" href="/my-shelves" link="Your library"/><div className="continue-grid">{active.map(entry => { const book = data.books.find(b => b.id === entry.bookId); if (!book) return null; const edition = data.editions.find(e => e.id === entry.editionId); const progress = percentage(entry, edition?.pages); return <Link key={entry.id} className="continue-card" href={`/books/${book.slug}`}><Cover book={book}/><div><span className="eyebrow">CURRENTLY READING</span><h3>{book.title}</h3><p>{book.author}</p><div className="progress-track"><span style={{ width: `${progress}%` }}/></div><small>{progress}% of the way there</small></div><ArrowRight size={18}/></Link>; })}</div></section>}
      {collection && <section className="curated-gallery" id="curated-shelf"><div className="curated-portrait"><img src="/images/gothic-archive.webp" alt="Carved oak bookshelves framing an ancient pointed library window" loading="lazy"/><div className="portrait-caption"><span>THE CURATED SHELF</span><span>VOL. I</span></div><div className="curated-copy"><span className="eyebrow">FOR THE UNHURRIED READER</span><h2>{collection.title}</h2><p>{collection.description}</p><Link className="text-link" href={`/discover?collection=${collection.id}`}>Wander through the collection <ArrowRight size={16}/></Link></div></div><div className="curated-volumes"><div className="curated-intro"><span className="eyebrow">BOUND TO STAY WITH YOU</span><p>Good books. Long evenings.<br/><em>No need to hurry.</em></p></div><div className="curated-books">{collection.books.slice(0, 4).map(id => { const book = data.books.find(b => b.id === id && b.available); return book ? <Link key={id} href={`/books/${book.slug}`} className="curated-book"><Cover book={book}/><h3>{book.title}</h3><p>{book.author}</p></Link> : null; })}</div><div className="shelf-rule"><span>CHOSEN WITH CARE</span><span>✦</span><span>KEPT CLOSE</span></div></div></section>}
      <section className="gothic-moods"><SectionTitle eyebrow="LET CURIOSITY BE YOUR COMPASS" title="A story for your state of mind."/><div className="gothic-mood-grid">{moods.map(({ name, note, icon: Icon, image, position }, i) => <Link key={name} href={`/discover?mood=${name}`} className="gothic-mood-card"><img src={`/images/${image}.webp`} alt="" loading="lazy" style={{objectPosition: position}}/><span className="mood-numeral">0{i+1}</span><Icon className="gothic-mood-icon" size={23} strokeWidth={1.2}/><div><h3>{name}</h3><p>{note}</p><ArrowRight size={17}/></div></Link>)}</div></section>
      <section className="gothic-editors"><SectionTitle eyebrow="VOICES THAT ECHO THROUGH TIME" title="Stories worth getting lost in." href="/discover" link="All the books"/><div className="book-grid home-book-grid">{data.books.filter(b => b.available && b.featured).slice(0, 6).map((book, i) => <BookCard key={book.id} book={book} index={i+4}/>)}</div></section>
      <section className="gothic-journal-invite"><img src="/images/reading-desk.webp" alt="A quiet antique writing desk in a wood-panelled library, lit by a green banker’s lamp" loading="lazy"/><div className="journal-invite-shade"/><div className="gothic-journal-copy"><span className="eyebrow"><Feather size={16}/> IN THE MARGINS</span><h2>Some stories end.<br/><em>Some stay with you.</em></h2><p>A thought. A passage. A feeling without a name.<br/>Leave a little of yourself between the lines,<br/>in a journal that is only yours.</p><Link className="button secondary" href="/journal">Take a seat. Write a little. <ArrowRight size={16}/></Link><span className="journal-private-note">YOUR WORDS. YOUR PRIVATE SANCTUARY.</span></div></section>
      <div className="gothic-closing"><span/><CathedralMark/><span/><p>There is always room for one more story.</p><small>THE DOOR IS ALWAYS OPEN.</small></div>
    </div>
  </>;
}
