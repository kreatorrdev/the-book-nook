"use client";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { Book } from "@/lib/types";
import { Cover } from "./book-cover";

type Phase = "idle" | "lifting" | "placing" | "waiting" | "opening" | "docking";
type Flight = { book: Book; href: string; source?: HTMLElement; rect?: DOMRect };
const Journey = createContext<{ openBook: (book: Book, source?: HTMLElement) => void; travelling: boolean; phase: Phase; skippedBook: string | null }>({ openBook: () => {}, travelling: false, phase: "idle", skippedBook: null });
export const useBookJourney = () => useContext(Journey);
const REST = "rotateX(56deg) rotateZ(-11deg)";
const abortError = () => new DOMException("Motion cancelled", "AbortError");

function pause(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(abortError()); return; }
    const cancel = () => { clearTimeout(timer); reject(abortError()); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", cancel); resolve(); }, ms);
    signal.addEventListener("abort", cancel, { once: true });
  });
}

function animate(element: Element, frames: Keyframe[], options: KeyframeAnimationOptions, signal: AbortSignal) {
  const animation = element.animate(frames, { fill: "forwards", ...options });
  const cancel = () => animation.cancel();
  signal.addEventListener("abort", cancel, { once: true });
  return animation.finished.finally(() => signal.removeEventListener("abort", cancel));
}

function waitForDesk(slug: string, signal: AbortSignal): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    let frame = 0;
    const clean = () => { cancelAnimationFrame(frame); observer.disconnect(); signal.removeEventListener("abort", cancel); };
    const cancel = () => { clean(); reject(abortError()); };
    const check = () => {
      const scene = document.querySelector<HTMLElement>(`.reading-desk[data-book-slug="${CSS.escape(slug)}"] .desk-scene`);
      if (!scene || location.pathname !== `/books/${slug}` || !scene.clientWidth) return;
      // Route effects must finish scrolling before the destination is measured.
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => { clean(); resolve(scene); }); });
    };
    const observer = new MutationObserver(() => { cancelAnimationFrame(frame); check(); });
    if (signal.aborted) { reject(abortError()); return; }
    observer.observe(document.body, { childList: true, subtree: true });
    signal.addEventListener("abort", cancel, { once: true }); check();
  });
}

async function placeVolume(root: HTMLElement, signal: AbortSignal, source?: DOMRect, replay = false) {
  const solid = root.querySelector<HTMLElement>(".volume-solid")!;
  const shadow = root.querySelector<HTMLElement>(".volume-shadow")!;
  const contact = root.querySelector<HTMLElement>(".volume-contact-shadow")!;
  const r = root.getBoundingClientRect();
  const dx = source ? source.left + source.width / 2 - r.left - r.width / 2 : 0;
  const dy = source ? source.top + source.height / 2 - r.top - r.height / 2 : -Math.min(310, innerHeight * .4);
  const scale = source ? source.width / r.width : 1.15;
  const duration = replay ? 1650 : 1750;
  await Promise.all([
    animate(solid, [
      { transform: replay ? REST : `translate3d(${dx}px,${dy}px,0) rotateX(0) rotateZ(0) scale(${scale})`, opacity: source || replay ? 1 : 0, offset: 0, easing: "cubic-bezier(.2,.75,.25,1)" },
      { transform: `translate3d(${dx * .12}px,-${Math.min(165, innerHeight * .21)}px,85px) rotateX(14deg) rotateZ(-5deg) scale(1.08)`, opacity: 1, offset: .27, easing: "cubic-bezier(.45,0,.55,1)" },
      { transform: "translate3d(0,-34px,20px) rotateX(48deg) rotateZ(-12deg) scale(1.015)", offset: .72, easing: "cubic-bezier(.2,.7,.35,1)" },
      { transform: "translate3d(0,1px,0) rotateX(57deg) rotateZ(-11deg)", offset: .91, easing: "ease-out" },
      { transform: REST, opacity: 1, offset: 1 },
    ], { duration }, signal),
    animate(shadow, [
      { opacity: replay ? .6 : 0, filter: replay ? "blur(8px)" : "blur(30px)", scale: replay ? "1" : "1.4", offset: 0 },
      { opacity: .1, filter: "blur(27px)", scale: "1.3", offset: .3 },
      { opacity: .25, filter: "blur(16px)", scale: "1.1", offset: .72 },
      { opacity: .65, filter: "blur(7px)", scale: "1", offset: 1 },
    ], { duration, easing: "ease-in-out" }, signal),
    animate(contact, [{ opacity: 0, offset: 0 }, { opacity: 0, offset: .78 }, { opacity: .75, offset: 1 }], { duration }, signal),
  ]);
}

export function CathedralMark({ className = "" }: { className?: string }) {
  return <svg className={className} width="36" height="48" viewBox="0 0 36 48" fill="none" aria-hidden="true"><path d="M3 45V23C3 13 11 6 18 2c7 4 15 11 15 21v22H3Z" stroke="currentColor" strokeWidth="1.2"/><path d="M7 41V24c0-8 5-14 11-18 6 4 11 10 11 18v17H7Z" stroke="currentColor" strokeWidth=".6"/><circle cx="18" cy="20" r="7" stroke="currentColor" strokeWidth=".8"/><path d="M18 13v14m-7-7h14m-12-5 10 10m0-10L13 25M12 41V30l6-5 6 5v11m-6-16v16M7 35h22" stroke="currentColor" strokeWidth=".7"/><circle cx="18" cy="20" r="2.5" stroke="currentColor" strokeWidth=".6"/></svg>;
}

// Both scenes share their geometry, materials and cover hinge.
function Volume({ book, opened, volumeRef, toggle, disabled = false }: { book: Book; opened: boolean; volumeRef: RefObject<HTMLDivElement | null>; toggle?: () => void; disabled?: boolean }) {
  const jacket = <><Cover book={book} eager/><span className="jacket-lining"/></>;
  return <div ref={volumeRef} className={`desk-volume ${opened ? "volume-open" : ""}`}>
    <div className="volume-shadow"/><div className="volume-contact-shadow"/>
    <div className="volume-solid"><div className="volume-backboard"/><div className="volume-pages"/><div className="volume-edge-fore"/><div className="volume-edge-bottom"/>
      <div className="volume-title-page"><span>THE BOOK NOOK</span><div><i>✦</i><strong>{book.title}</strong><em>{book.author}</em></div><small>A STORY WORTH YOUR TIME</small></div>
      {toggle ? <button className="volume-jacket" disabled={disabled} onClick={toggle} aria-label={`${opened ? "Close" : "Open"} the cover of ${book.title}`} aria-pressed={opened}>{jacket}</button> : <div className="volume-jacket">{jacket}</div>}
    </div>
  </div>;
}

function DeskBackdrop({ decorative = false }: { decorative?: boolean }) {
  return <><img className="desk-room" src="/images/reading-desk.webp" alt={decorative ? "" : "An antique walnut reading desk, a green banker’s lamp, and Gothic library shelves"} fetchPriority="high"/><div className="desk-vignette"/><div className="desk-imprint"><CathedralMark/><span>YOUR PLACE IN THE READING ROOM</span></div><span className="desk-scene-note">Settle in. The world can wait.</span></>;
}

export function BookJourney({ children }: { children: ReactNode }) {
  const router = useRouter(); const [flight, setFlight] = useState<Flight | null>(null); const [phase, setPhase] = useState<Phase>("idle");
  const [skippedBook, setSkippedBook] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null); const stage = useRef<HTMLDivElement>(null); const room = useRef<HTMLDivElement>(null); const volume = useRef<HTMLDivElement>(null); const scrim = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false); const skipRef = useRef<() => void>(() => {});
  useEffect(() => { const img = new Image(); img.src = "/images/reading-desk.webp"; }, []);

  const openBook = useCallback((book: Book, source?: HTMLElement) => {
    if (inFlight.current) return;
    const href = `/books/${book.slug}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { router.push(href); return; }
    const cover = source?.querySelector<HTMLElement>(".book-cover,.cover-fallback") || source?.closest("article")?.querySelector<HTMLElement>(".book-cover,.cover-fallback") || source;
    const rect = cover?.getBoundingClientRect();
    inFlight.current = true; setSkippedBook(null); setPhase("lifting");
    cover?.setAttribute("data-journey-source", "true");
    setFlight({ book, href, source: cover, rect });
    router.prefetch(href);
  }, [router]);

  useLayoutEffect(() => {
    if (!flight) return;
    const controller = new AbortController(); const emergency = new AbortController();
    const { signal } = controller; let alive = true; let skipping = false;
    const scene = stage.current!; const background = room.current!; const model = volume.current!; const shade = scrim.current!;
    const oldOverflow = document.body.style.overflow; const oldPadding = document.body.style.paddingRight;
    const gutter = innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gutter}px`;
    dialog.current?.showModal();
    scene.style.width = `${innerWidth}px`; scene.style.height = `${innerHeight}px`;
    model.style.width = `${Math.max(145, Math.min(250, innerWidth * .2))}px`;

    const finish = () => {
      if (!alive) return;
      dialog.current?.close(); flight.source?.removeAttribute("data-journey-source"); inFlight.current = false;
      setFlight(null); setPhase("idle");
      requestAnimationFrame(() => document.querySelector<HTMLElement>(".detail-intro h1")?.focus({ preventScroll: true }));
    };
    const safety = setTimeout(finish, 12000);
    const skip = async () => {
      if (skipping || !alive) return;
      skipping = true; setSkippedBook(flight.book.slug); setPhase("waiting"); controller.abort();
      router.push(flight.href, { scroll: false });
      try { await waitForDesk(flight.book.slug, emergency.signal); finish(); } catch { /* cleaned up on unmount */ }
    };
    skipRef.current = () => { void skip(); };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => { if (reduced.matches) void skip(); };
    window.addEventListener("resize", skipRef.current); reduced.addEventListener("change", preference);

    void (async () => {
      try {
        const reveal = animate(background, [{ opacity: 0 }, { opacity: 1 }], { duration: 650, delay: 100, easing: "ease-in-out" }, signal);
        const dim = animate(shade, [{ opacity: 0 }, { opacity: 1 }], { duration: 700 }, signal);
        const placement = placeVolume(model, signal, flight.rect);
        const phaseChange = pause(460, signal).then(() => { if (alive) setPhase("placing"); });
        const navigation = pause(750, signal).then(() => router.push(flight.href, { scroll: false }));
        await Promise.all([placement, reveal, dim, phaseChange, navigation]);
        setPhase("waiting");
        const target = await waitForDesk(flight.book.slug, signal);
        setPhase("opening"); await pause(1150, signal);
        if (signal.aborted) return;
        setPhase("docking");
        const rect = target.getBoundingClientRect();
        const targetVolume = target.querySelector<HTMLElement>(".desk-volume")!;
        // Match actual destination bounds and book size, avoiding a second camera cut.
        await Promise.all([
          animate(scene, [{ left: "0px", top: "0px", width: `${innerWidth}px`, height: `${innerHeight}px`, borderRadius: "0px" }, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: getComputedStyle(target).borderRadius }], { duration: 720, easing: "cubic-bezier(.22,.8,.25,1)" }, signal),
          animate(model, [{ width: model.style.width }, { width: `${targetVolume.clientWidth}px` }], { duration: 720, easing: "cubic-bezier(.22,.8,.25,1)" }, signal),
          animate(shade, [{ opacity: 1 }, { opacity: 0 }], { duration: 720 }, signal),
        ]);
        finish();
      } catch { if (!signal.aborted) finish(); }
    })();
    return () => {
      alive = false; clearTimeout(safety); controller.abort(); emergency.abort();
      scene.getAnimations().forEach(a => a.cancel()); shade.getAnimations().forEach(a => a.cancel());
      scene.querySelectorAll("*").forEach(el => el.getAnimations().forEach(a => a.cancel()));
      window.removeEventListener("resize", skipRef.current); reduced.removeEventListener("change", preference);
      document.body.style.overflow = oldOverflow; document.body.style.paddingRight = oldPadding;
      flight.source?.removeAttribute("data-journey-source");
    };
  }, [flight, router]);

  const opened = phase === "opening" || phase === "docking";
  return <Journey.Provider value={{ openBook, travelling: !!flight, phase, skippedBook }}>{children}{flight && <dialog ref={dialog} className={`book-journey journey-v2 journey-${phase}`} data-phase={phase} aria-label={`Bringing ${flight.book.title} to your reading desk`} onCancel={e => { e.preventDefault(); skipRef.current(); }}>
    <div ref={scrim} className="journey-scrim"/>
    <div ref={stage} className="desk-scene journey-stage"><div ref={room} className="journey-room-layer"><DeskBackdrop decorative/></div><Volume book={flight.book} opened={opened} volumeRef={volume}/></div>
    <div className="journey-caption" role="status">{phase === "opening" || phase === "docking" ? "Let the story unfold." : phase === "waiting" ? "A quiet moment, just for you." : "A story worth slowing down for."}<span>{flight.book.title}</span></div>
    <button className="journey-skip" onClick={() => skipRef.current()}>Skip animation <ArrowRight size={15}/></button>
  </dialog>}</Journey.Provider>;
}

export function interceptBookLink(event: MouseEvent<HTMLElement>, books: Book[], openBook: (book: Book, source?: HTMLElement) => void) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
  const url = new URL(anchor.href); if (url.origin !== location.origin || url.pathname === location.pathname) return;
  const slug = /^\/books\/([^/]+)\/?$/.exec(url.pathname)?.[1]; const book = books.find(b => b.slug === slug);
  if (!book) return;
  event.preventDefault(); event.stopPropagation(); openBook(book, anchor);
}

export function ReadingDesk({ book }: { book: Book }) {
  const { travelling, phase, skippedBook } = useBookJourney(); const cameFromJourney = useRef(travelling);
  const volume = useRef<HTMLDivElement>(null); const [opened, setOpened] = useState(false); const [replay, setReplay] = useState(0); const [running, setRunning] = useState(!travelling);
  useEffect(() => {
    if (!cameFromJourney.current || replay) return;
    if (phase === "opening" || phase === "docking" || phase === "idle" || skippedBook === book.slug) setOpened(true);
  }, [phase, replay, skippedBook, book.slug]);
  useEffect(() => {
    if (cameFromJourney.current && !replay) return;
    const controller = new AbortController(); const { signal } = controller;
    const root = volume.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) { setOpened(true); setRunning(false); return; }
    const preference = () => { if (reduced.matches) { controller.abort(); setOpened(true); setRunning(false); } };
    reduced.addEventListener("change", preference);
    void (async () => {
      try {
        setRunning(true); setOpened(false);
        if (replay) await pause(950, signal);
        await placeVolume(root, signal, undefined, !!replay);
        await pause(100, signal); setOpened(true); setRunning(false);
      } catch { /* A new replay or navigation owns the volume now. */ }
    })();
    return () => { controller.abort(); reduced.removeEventListener("change", preference); root.querySelectorAll("*").forEach(el => el.getAnimations().forEach(a => a.cancel())); };
  }, [replay]);
  return <section className={`reading-desk ${travelling ? "desk-awaiting-handoff" : ""} ${skippedBook === book.slug ? "desk-motion-skipped" : ""}`} data-book-slug={book.slug} aria-label={`The reading desk — ${book.title}`}>
    <div className="desk-scene"><DeskBackdrop/><Volume book={book} opened={opened} volumeRef={volume} toggle={() => setOpened(!opened)} disabled={running || travelling}/></div>
    <div className="desk-controls"><span><span className="desk-indicator"/> The reading desk <i>·</i> {running ? "Making room for your story" : opened ? "An open invitation" : "A story waiting"}</span><div><button disabled={running || travelling} onClick={() => setOpened(!opened)}>{opened ? "Close the cover" : "Open the cover"}</button><button disabled={running || travelling} aria-label="Replay placing the book on the desk" title="Place the book again" onClick={() => setReplay(n => n + 1)}><RotateCcw size={15}/></button></div></div>
  </section>;
}
