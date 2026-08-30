"use client";

import { Fuel, LogOut } from "lucide-react";

export type NavItem = { id: string; label: string; icon: React.ReactNode };

export default function RoleSidebar({ title, subtitle, items, active, onSelect }: { title: string; subtitle: string; items: NavItem[]; active: string; onSelect: (id: string) => void }) {
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; }
  return <aside className="flex w-full shrink-0 flex-col border-b border-slate-800 bg-[#07111f] p-5 md:min-h-screen md:w-72 md:border-b-0 md:border-r"><div className="mb-8 flex items-center gap-3"><div className="rounded-xl bg-emerald-500 p-2 text-slate-950"><Fuel size={20} /></div><div><p className="font-black italic text-white">FUEL<span className="text-emerald-400 not-italic">SMART</span></p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{subtitle}</p></div></div><p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">{title}</p><nav className="flex gap-1 overflow-x-auto md:flex-col">{items.map((item) => <button key={item.id} onClick={() => onSelect(item.id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active === item.id ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>{item.icon}{item.label}</button>)}</nav><button onClick={logout} className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 hover:bg-red-500/10 hover:text-red-400 md:mt-auto"><LogOut size={17} />Sign out</button></aside>;
}
