import { forwardRef } from "react";
import { LocateFixed, MapPinned, RefreshCw } from "lucide-react";

const LocationAccessPanel = forwardRef<HTMLInputElement, { denied: boolean; onRetry: () => void }>(function LocationAccessPanel({ denied, onRetry }, ref) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
    <div className="flex items-start gap-3"><div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">{denied ? <MapPinned size={20} /> : <LocateFixed size={20} />}</div><div><h2 className="font-bold text-white">{denied ? "Choose your location" : "Using your current location"}</h2><p className="mt-1 text-sm text-slate-400">{denied ? "Location access was unavailable. Search an address below or try the browser request again." : "FuelSmart uses your position only to find and sort nearby verified stations."}</p></div></div>
    {denied && <div className="mt-4 flex flex-col gap-2 sm:flex-row"><input ref={ref} aria-label="Search an address" placeholder="Search an address or area in Nigeria" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" /><button onClick={onRetry} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold"><RefreshCw size={15} />Retry location</button></div>}
  </div>;
});

export default LocationAccessPanel;
