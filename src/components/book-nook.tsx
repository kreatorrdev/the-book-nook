"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, ChevronDown, Feather, Menu, Search, X } from "lucide-react";
import type { Snapshot } from "@/lib/types";
import { Nook } from "./context";
import { GothicHome as Home } from "./gothic-home";
import { CathedralMark, interceptBookLink, useBookJourney } from "./book-journey";
const Discover = dynamic(() => import("./discovery").then(module => module.Discover));
const BookDetails = dynamic(() => import("./library").then(module => module.BookDetails));
const Library = dynamic(() => import("./library").then(module => module.Library));
const JournalPage = dynamic(() => import("./journal").then(module => module.JournalPage));
const AccountPage = dynamic(() => import("./account").then(module => module.AccountPage));
const ProfilePage = dynamic(() => import("./account").then(module => module.ProfilePage));
const AdminPage = dynamic(() => import("./admin").then(module => module.AdminPage));
export function BookNook({ initial, route, query }: { initial: Snapshot; route: string; query: Record<string, string | string[] | undefined> }) {
  const [data, setData] = useState(initial); const [busy, setBusy] = useState(false); const [menu, setMenu] = useState(false); const [accountOpen, setAccountOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null); const router = useRouter();
  const journey = useBookJourney();
  const headerRef = useRef<HTMLElement>(null);
  const accountToggle = useRef<HTMLButtonElement>(null);
  const navigationToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setData(initial); setMenu(false); setAccountOpen(false); }, [initial]);
  useEffect(() => { window.scrollTo(0, 0); }, [route]);
  useEffect(() => {
    if (!menu && !accountOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenu(false); setAccountOpen(false);
      (accountOpen ? accountToggle : navigationToggle).current?.focus();
    };
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) { setMenu(false); setAccountOpen(false); }
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, [menu, accountOpen]);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), toast.error ? 9000 : 4200); return () => clearTimeout(timer); } }, [toast]);
  const notify = useCallback((message: string, error = false) => setToast({ message, error }), []);
  const mutate = useCallback(async (body: Record<string, unknown>, message = "Your changes are saved.") => {
    setBusy(true);
    try {
      const response = await fetch("/api/reader", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "That could not be saved. Please try again.");
      setData(result.data); if (message) notify(message); return true;
    } catch (error) { notify(error instanceof Error ? error.message : "We couldn't connect. Your draft is still here. Try again.", true); return false; }
    finally { setBusy(false); }
  }, [notify]);
  const signIn = () => router.push(`/sign-in?returnTo=${encodeURIComponent(location.pathname + location.search)}`);
  const current = route.split("/")[1] || "home";
  const nav = [{ id: "home", href: "/", label: "The Reading Room" }, { id: "discover", href: "/discover", label: "Discover" }, { id: "my-shelves", href: "/my-shelves", label: "My Library" }, { id: "journal", href: "/journal", label: "Journal" }];
  return <Nook.Provider value={{ data, busy, mutate, notify, signIn }}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header" ref={headerRef}><div className="header-inner"><Link href="/" className="brand" aria-label="The Book Nook home"><span className="brand-icon"><CathedralMark /></span><span>The Book Nook<span className="brand-caption">A SANCTUARY FOR STORIES</span></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(n => <Link key={n.id} href={n.href} className={current === n.id ? "active" : ""} aria-current={current === n.id ? "page" : undefined}>{n.label}</Link>)}</nav>
      <div className="header-actions"><Link className="icon-button search-link" href="/discover" aria-label="Search books"><Search size={20} strokeWidth={1.6} /></Link>{data.reader ? <div className="account-menu"><button className="reader-button" ref={accountToggle} aria-label="Account menu" aria-expanded={accountOpen} aria-controls="account-menu" onClick={() => { setAccountOpen(!accountOpen); setMenu(false); }}><span className="avatar">{data.reader.name.slice(0, 1).toUpperCase()}</span><span className="reader-name">{data.reader.name.split(" ")[0]}</span><ChevronDown size={14} /></button>{accountOpen && <div className="dropdown" id="account-menu"><Link href="/profile">Your profile</Link><Link href="/settings">Settings & privacy</Link>{data.reader.role === "admin" && <Link href="/admin">Content & moderation</Link>}<button onClick={async () => { const r = await fetch("/api/auth/sign-out", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); if (r.ok) { for (const key of Object.keys(sessionStorage)) if (key.startsWith("nook-draft:")) sessionStorage.removeItem(key); location.href = "/"; } else notify("We couldn't sign you out. Please try again.", true); }}>Sign out</button></div>}</div> : <Link className="header-signin" href="/sign-in">Sign in <ArrowUpRight size={15} /></Link>}<button className="icon-button mobile-toggle" ref={navigationToggle} aria-controls="mobile-navigation" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => { setMenu(!menu); setAccountOpen(false); }}>{menu ? <X size={22} /> : <Menu size={22} />}</button></div>
    </div>{menu && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">{nav.map(n => <Link key={n.id} href={n.href} aria-current={current === n.id ? "page" : undefined}>{n.label}</Link>)}{data.reader && <><Link href="/profile">Your profile</Link><Link href="/settings">Settings & privacy</Link>{data.reader.role === "admin" && <Link href="/admin">Content & moderation</Link>}</>}</nav>}</header>
    <main id="main-content" tabIndex={-1} data-section={current} onClickCapture={e => interceptBookLink(e, data.books, journey.openBook)}>
      {route === "/" && <Home />}
      {route === "/discover" && <Discover query={query} />}
      {route.startsWith("/books/") && <BookDetails slug={route.split("/")[2]} />}
      {route === "/my-shelves" && <Library />}
      {route.startsWith("/journal") && <JournalPage entryId={route.split("/")[2]} />}
      {["/sign-in", "/sign-up"].includes(route) && <AccountPage signup={route === "/sign-up"} returnTo={typeof query.returnTo === "string" ? query.returnTo : null} />}
      {["/profile", "/settings"].includes(route) && <ProfilePage settings={route === "/settings"} />}
      {route === "/admin" && <AdminPage />}
    </main>
    <footer className="site-footer"><div className="footer-top"><Link href="/" className="brand"><CathedralMark /><span>The Book Nook</span></Link><p>A quiet corner of an endless world.</p><div><Link href="/discover">Find a story</Link><Link href="/settings">Privacy & settings</Link></div></div><div className="footer-bottom"><span>For the love of the written word.</span><span>Original artwork & editorial selections · Est. 2026</span><span className="footer-flourish"><Feather size={14} /> Read. Reflect. Return.</span></div></footer>
    {toast && <div className={`toast ${toast.error ? "error" : ""}`} role={toast.error ? "alert" : "status"}>{!toast.error && <Check size={18} />}<span>{toast.message}</span><button aria-label="Dismiss message" onClick={() => setToast(null)}><X size={16} /></button></div>}
    {busy && <div className="save-indicator" role="status">Saving your place…</div>}
  </Nook.Provider>;
}
