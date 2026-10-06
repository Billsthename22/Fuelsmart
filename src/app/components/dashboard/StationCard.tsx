import Link from "next/link";
import { Clock3, MapPin, Navigation, ShieldCheck } from "lucide-react";
import { StationSummary } from "@/app/lib/stations";

export default function StationCard({ station, userLocation }: { station: StationSummary; userLocation: { lat: number; lng: number } | null }) {
  const params = new URLSearchParams({ stationId: station._id });
  if (userLocation) { params.set("lat", String(userLocation.lat)); params.set("lng", String(userLocation.lng)); }
  const open = station.status === "OPEN";
  return <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-emerald-500/40">
    <div className="flex flex-col justify-between gap-4 sm:flex-row">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-black text-white">{station.brand} — {station.branchName}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${open ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>Station {open ? "open" : "closed"}</span></div>
        <p className="mt-2 flex items-start gap-2 text-sm text-slate-400"><MapPin className="mt-0.5 shrink-0" size={15} />{station.address}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">{station.distanceKm !== null && <span>{station.distanceKm.toFixed(2)} km away</span>}<span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-400" />Verified branch</span><span className="flex items-center gap-1"><Clock3 size={13} />Updated {new Date(station.lastUpdatedAt).toLocaleString()}</span></div>
      </div>
      <Link href={`/stations?${params.toString()}`} className="flex h-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400"><Navigation size={16} />View map</Link>
    </div>
    <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{station.currentPrices.length ? station.currentPrices.map((price) => <div key={price.fuelType} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3"><div className="flex items-center justify-between"><span className="text-xs font-black text-slate-300">{price.fuelType}</span><span className={`text-[10px] font-bold ${price.available ? "text-emerald-400" : "text-amber-400"}`}>{price.available ? "Fuel available" : "Fuel unavailable"}</span></div><p className="mt-2 text-xl font-black text-white">₦{price.price.toLocaleString()}<span className="text-xs font-normal text-slate-500">/L</span></p></div>) : <p className="text-sm text-slate-500">No prices reported</p>}</div>
  </article>;
}
