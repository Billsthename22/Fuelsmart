"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Fuel, LayoutDashboard, MapPin, Menu, MessageSquare, Settings, X } from "lucide-react";

const links = [
  { href: "/Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/stations", label: "Stations", icon: MapPin },
  { href: "/Community", label: "Community", icon: MessageSquare },
  { href: "/Profile", label: "Settings", icon: Settings },
];

export default function DriverNavigation({ activeHref, username }: { activeHref: string; username?: string | null }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [open]);

  return <>
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800 bg-[#020617]/95 px-4 backdrop-blur lg:hidden"><Brand /><button onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="driver-navigation" className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-slate-100">{open ? <X size={20} /> : <Menu size={20} />}</button></header>
    {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}
    <aside id="driver-navigation" data-testid="driver-navigation-drawer" className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-slate-800 bg-[#020617] p-6 pt-20 shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:max-w-none lg:translate-x-0 lg:p-6 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="hidden lg:block"><Brand /></div>
      <nav aria-label="Driver navigation" className="mt-4 space-y-2 lg:mt-10">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${activeHref === href ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}><Icon size={18} />{label}</Link>)}</nav>
      <div className="mt-auto border-t border-slate-800 pt-5">{username ? <><p className="font-bold">{username}</p><p className="text-xs text-emerald-400">Driver account</p></> : <><p className="text-sm text-slate-400">Viewing as guest</p><Link href="/login" className="mt-3 block rounded-xl bg-emerald-500 px-4 py-2 text-center text-sm font-black text-slate-950">Log in</Link></>}</div>
    </aside>
  </>;
}

function Brand() { return <Link href="/" className="flex items-center gap-2 text-xl font-black italic"><span className="rounded-lg bg-emerald-500 p-2 text-slate-950"><Fuel size={18} /></span>FUEL<span className="text-emerald-400 not-italic">SMART</span></Link>; }
