import { MapPin } from "lucide-react";
import { StationSummary } from "@/app/lib/stations";

type Props = {
  stations: StationSummary[];
  selectedStationId: string | null;
  onSelect: (stationId: string) => void;
};

export default function NearbyMapStationList({ stations, selectedStationId, onSelect }: Props) {
  if (!stations.length) return null;

  return <aside aria-label="Nearby stations" className="absolute left-4 right-4 top-4 z-10 max-h-48 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl sm:right-auto sm:w-80 lg:max-h-[calc(100%-15rem)]">
    <div className="mb-2 flex items-center justify-between gap-3 px-1">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-400">Nearby stations</p>
        <p className="mt-0.5 text-xs text-slate-400">{stations.length} {stations.length === 1 ? "station" : "stations"} near you</p>
      </div>
      <MapPin className="shrink-0 text-emerald-400" size={18} />
    </div>
    <div className="space-y-2">
      {stations.map((station) => {
        const selected = station._id === selectedStationId;
        return <button key={station._id} type="button" aria-label={`Select ${station.brand} ${station.branchName}`} onClick={() => onSelect(station._id)} className={`w-full rounded-xl border p-3 text-left transition ${selected ? "border-emerald-500 bg-emerald-500/10" : "border-slate-800 bg-slate-900/80 hover:border-slate-600"}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><p className="truncate text-sm font-black text-white">{station.brand} — {station.branchName}</p><p className="mt-1 truncate text-xs text-slate-400">{station.address}</p></div>
            <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase ${station.status === "OPEN" ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>{station.status === "OPEN" ? "Open" : "Closed"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs"><span className="text-slate-500">{station.distanceKm === null ? "Registered branch" : `${station.distanceKm.toFixed(2)} km away`}</span><span className="font-bold text-emerald-400">{station.currentPrices.length ? `${station.currentPrices.length} fuel ${station.currentPrices.length === 1 ? "type" : "types"}` : "No price yet"}</span></div>
        </button>;
      })}
    </div>
  </aside>;
}
