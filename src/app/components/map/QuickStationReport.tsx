"use client";

import { FormEvent, useState } from "react";
import { Send, X } from "lucide-react";
import { StationSummary } from "@/app/lib/stations";
import { COMMUNITY_CATEGORIES, COMMUNITY_CATEGORY_LABELS, CommunityCategory } from "@/app/lib/community";

export default function QuickStationReport({ station, automatic = false, onClose, onSubmitted }: { station: StationSummary; automatic?: boolean; onClose: () => void; onSubmitted: () => void }) {
  const [category, setCategory] = useState<CommunityCategory>("FUEL_AVAILABLE");
  const [fuelType, setFuelType] = useState("PMS");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fuelSpecific = category === "FUEL_AVAILABLE" || category === "FUEL_UNAVAILABLE" || category === "PRICE_UPDATE";
  const name = station.branchName ? `${station.brand} — ${station.branchName}` : station.brand;

  async function submit(event: FormEvent) {
    event.preventDefault(); setSubmitting(true); setStatus("");
    try {
      const response = await fetch("/api/community-posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stationId: station._id, station: { brand: station.brand, branchName: station.branchName, address: station.address, verified: station.verified, coordinates: station.coordinates }, category, fuelType, message, reportedPrice: price ? Number(price) : null }) });
      const data = await response.json();
      if (!response.ok) return setStatus(data.error || "Could not publish this report.");
      onSubmitted(); onClose();
    } catch { setStatus("Could not publish this report."); }
    finally { setSubmitting(false); }
  }

  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Station review"><section className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-700 bg-slate-950 p-5 shadow-2xl sm:rounded-3xl sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-400">{automatic ? "You recently visited" : "Live station report"}</p><h2 className="mt-2 text-xl font-black text-white">How was {name}?</h2><p className="mt-1 text-sm text-slate-400">Your update will help nearby drivers for the next 24 hours.</p></div><button onClick={onClose} aria-label="Close station review" className="rounded-full border border-slate-700 p-2 text-slate-400"><X size={18} /></button></div><form onSubmit={submit} className="mt-5 space-y-4"><label className="block text-xs font-bold text-slate-400">What happened?<select aria-label="Quick report category" value={category} onChange={(event) => setCategory(event.target.value as CommunityCategory)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white">{COMMUNITY_CATEGORIES.map((value) => <option key={value} value={value}>{COMMUNITY_CATEGORY_LABELS[value]}</option>)}</select></label>{fuelSpecific && <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-slate-400">Fuel type<select aria-label="Quick report fuel type" value={fuelType} onChange={(event) => setFuelType(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white"><option>PMS</option><option>DIESEL</option><option>LPG</option><option>CNG</option></select></label>{category === "PRICE_UPDATE" && <label className="text-xs font-bold text-slate-400">Price per litre<input aria-label="Quick report price" required min="1" type="number" value={price} onChange={(event) => setPrice(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white" placeholder="₦ e.g. 950" /></label>}</div>}<textarea aria-label="Quick report details" maxLength={280} rows={3} value={message} onChange={(event) => setMessage(event.target.value)} className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white" placeholder="Optional details" />{status && <p role="status" className="text-sm text-amber-300">{status}</p>}<button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-60">{submitting ? "Publishing…" : "Share live report"}<Send size={15} /></button></form></section></div>;
}
