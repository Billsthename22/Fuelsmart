import { Loader2, MapPinOff, RefreshCw, TriangleAlert } from "lucide-react";
import { StationSummary } from "@/app/lib/stations";
import StationCard from "./StationCard";

type Props = { state: "loading" | "error" | "ready"; stations: StationSummary[]; onRetry: () => void; userLocation: { lat: number; lng: number } | null };

export default function NearbyStationList({ state, stations, onRetry, userLocation }: Props) {
  if (state === "loading") return <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center"><Loader2 className="mx-auto animate-spin text-emerald-400" /><p className="mt-3 text-sm text-slate-300">Finding verified stations near you…</p></div>;
  if (state === "error") return <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center"><TriangleAlert className="mx-auto text-rose-400" /><p className="mt-3 text-sm text-slate-300">We could not load nearby stations.</p><button onClick={onRetry} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold"><RefreshCw size={15} />Try again</button></div>;
  if (!stations.length) return <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center"><MapPinOff className="mx-auto text-slate-500" /><h3 className="mt-3 font-bold">No verified stations found</h3><p className="mt-1 text-sm text-slate-400">Try another search or increase the search radius.</p></div>;
  return <div className="space-y-4">{stations.map((station) => <StationCard key={station._id} station={station} userLocation={userLocation} />)}</div>;
}
