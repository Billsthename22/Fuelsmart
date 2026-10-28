"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@googlemaps/js-api-loader";
import { ArrowLeft, ChevronDown, Fuel, LocateFixed, Search, SlidersHorizontal, X } from "lucide-react";
import FuelStationMap from "@/app/components/map/FuelStationMap";
import { StationSummary } from "@/app/lib/stations";
import { mergeNearbyStations, searchNearbyGoogleStations } from "@/app/lib/nearby-stations";
import { shouldTrackDeviceLocation } from "@/app/lib/location-tracking";

type Point = { lat: number; lng: number };

export default function FuelMapPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}><FuelMapContent /></Suspense>;
}

function FuelMapContent() {
  const router = useRouter();
  const params = useSearchParams();
  const addressRef = useRef<HTMLInputElement>(null);
  const selectedFromUrl = params.get("stationId");
  const paramLat = Number(params.get("lat"));
  const paramLng = Number(params.get("lng"));
  const initialPoint = useMemo(() => Number.isFinite(paramLat) && Number.isFinite(paramLng) && params.has("lat") && params.has("lng") ? { lat: paramLat, lng: paramLng } : null, [paramLat, paramLng, params]);
  const [userLocation, setUserLocation] = useState<Point | null>(initialPoint);
  const [stations, setStations] = useState<StationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(selectedFromUrl);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [controlsOpen, setControlsOpen] = useState(false);
  const [locationError, setLocationError] = useState("");
  const requestedRadius = Number(params.get("radiusKm") ?? 8);
  const [radius, setRadius] = useState(Math.min(Math.max(Number.isFinite(requestedRadius) ? requestedRadius : 8, 1), 50));

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (!response.ok) return router.replace("/login");
      const { user } = await response.json();
      if (user.role !== "DRIVER") router.replace(user.role === "SUPER_ADMIN" ? "/superadmin" : "/admin");
    });
  }, [router]);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return setLocationError("Location is not supported on this device.");
    navigator.geolocation.getCurrentPosition(({ coords }) => { setUserLocation({ lat: coords.latitude, lng: coords.longitude }); setLocationError(""); }, () => setLocationError("Allow location access to show where you are."), { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator) || !shouldTrackDeviceLocation(initialPoint)) return;
    const watcher = navigator.geolocation.watchPosition(({ coords }) => { setUserLocation({ lat: coords.latitude, lng: coords.longitude }); setLocationError(""); }, () => setLocationError("Allow location access to show where you are."), { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    return () => navigator.geolocation.clearWatch(watcher);
  }, [initialPoint]);

  const loadStations = useCallback(async () => {
    setLoading(true); setError("");
    const query = new URLSearchParams({ radiusKm: String(radius) });
    if (userLocation) { query.set("lat", String(userLocation.lat)); query.set("lng", String(userLocation.lng)); }
    try {
      const response = await fetch(`/api/stations?${query.toString()}`);
      if (!response.ok) throw new Error("Could not load stations");
      const data = await response.json();
      let rows: StationSummary[] = data.stations || [];
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (userLocation && apiKey) {
        try {
          rows = mergeNearbyStations(rows, await searchNearbyGoogleStations({ apiKey, center: userLocation, radiusKm: radius }));
        } catch {
          // Keep registered FuelSmart stations visible if Places search fails.
        }
      }
      if (selectedFromUrl && !selectedFromUrl.startsWith("google:") && !rows.some((station) => station._id === selectedFromUrl)) {
        const detail = await fetch(`/api/stations/${selectedFromUrl}`);
        if (detail.ok) rows = [await detail.json().then((value) => value.station), ...rows];
      }
      setStations(rows);
      setSelectedId((current) => current && rows.some((station) => station._id === current) ? current : null);
    } catch {
      setError("Could not load registered FuelSmart stations.");
    } finally { setLoading(false); }
  }, [radius, selectedFromUrl, userLocation]);

  useEffect(() => { const timer = window.setTimeout(loadStations, 0); return () => window.clearTimeout(timer); }, [loadStations]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !addressRef.current) return;
    new Loader({ apiKey, version: "weekly", libraries: ["marker", "places"] }).load().then(() => {
      if (!addressRef.current) return;
      const autocomplete = new google.maps.places.Autocomplete(addressRef.current, { componentRestrictions: { country: "ng" }, fields: ["formatted_address", "geometry"] });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace(); const point = place.geometry?.location;
        if (point) { setAddress(place.formatted_address || ""); setUserLocation({ lat: point.lat(), lng: point.lng() }); }
      });
    }).catch(() => undefined);
  }, []);

  function selectStation(stationId: string) {
    setSelectedId(stationId);
    const next = new URLSearchParams({ stationId });
    next.set("radiusKm", String(radius));
    if (userLocation) { next.set("lat", String(userLocation.lat)); next.set("lng", String(userLocation.lng)); }
    router.replace(`/stations?${next.toString()}`, { scroll: false });
  }

  function clearSelection() {
    setSelectedId(null);
    const next = new URLSearchParams({ radiusKm: String(radius) });
    if (userLocation) { next.set("lat", String(userLocation.lat)); next.set("lng", String(userLocation.lng)); }
    router.replace(`/stations?${next.toString()}`, { scroll: false });
  }

  function submitAddress(event: FormEvent) { event.preventDefault(); addressRef.current?.focus(); }

  return <main className="relative h-dvh overflow-hidden bg-[#020617] text-slate-100">
    <FuelStationMap stations={stations} selectedStationId={selectedId} userLocation={userLocation} radiusKm={radius} onSelect={selectStation} onClearSelection={clearSelection} error={error || undefined} onRetry={loadStations} />

    <div className="absolute left-3 right-3 top-3 z-20 sm:left-5 sm:right-auto sm:w-[390px]">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-950/92 p-2 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2"><Link href="/Dashboard" aria-label="Back to dashboard" className="rounded-xl p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white"><ArrowLeft size={18} /></Link><Link href="/Dashboard" className="flex min-w-0 flex-1 items-center gap-2 font-black italic"><span className="rounded-lg bg-emerald-500 p-2 text-slate-950"><Fuel size={16} /></span><span>FUEL<span className="text-emerald-400 not-italic">SMART</span></span></Link><span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-300">{stations.length} NEARBY</span><button onClick={() => setControlsOpen((open) => !open)} aria-label="Toggle map search controls" aria-expanded={controlsOpen} className="rounded-xl p-2.5 text-slate-300 hover:bg-slate-800"><ChevronDown className={`transition ${controlsOpen ? "rotate-180" : ""}`} size={18} /></button></div>
        {controlsOpen && <div className="border-t border-slate-800 px-1 pb-1 pt-3"><form onSubmit={submitAddress} className="relative"><Search className="absolute left-3 top-3.5 text-slate-500" size={15} /><input ref={addressRef} value={address} onChange={(event) => setAddress(event.target.value)} aria-label="Search your location" placeholder="Search an area in Nigeria" className="w-full rounded-xl border border-slate-700 bg-[#020617] py-3 pl-9 pr-10 text-sm outline-none focus:border-emerald-500" />{address && <button type="button" onClick={() => setAddress("")} aria-label="Clear search" className="absolute right-3 top-3 text-slate-500"><X size={17} /></button>}</form><div className="mt-2 flex gap-2"><label className="relative flex flex-1 items-center"><SlidersHorizontal className="pointer-events-none absolute left-3 text-slate-500" size={15} /><select aria-label="Nearby radius" value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="w-full appearance-none rounded-xl border border-slate-700 bg-[#020617] py-3 pl-9 pr-3 text-sm">{[1, 5, 8, 15, 25, 50].map((km) => <option key={km} value={km}>Within {km} km</option>)}</select></label><button onClick={locate} type="button" className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 text-xs font-black text-slate-950"><LocateFixed size={16} />Locate me</button></div>{locationError && <p className="mt-2 px-1 text-xs text-amber-300">{locationError}</p>}</div>}
      </div>
    </div>

    <button onClick={locate} aria-label="Center on my current location" className="absolute bottom-6 right-4 z-20 grid h-12 w-12 place-items-center rounded-full border border-slate-700 bg-slate-950/95 text-emerald-400 shadow-xl backdrop-blur sm:right-6"><LocateFixed size={21} /></button>
    {loading && <div className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-950/90 px-4 py-2 text-xs font-bold text-emerald-300 shadow-xl">Scanning {radius} km around you…</div>}
    {!loading && !error && !stations.length && <div className="absolute left-1/2 top-28 z-20 w-[min(90%,360px)] -translate-x-1/2 rounded-2xl border border-slate-700 bg-slate-950/95 p-5 text-center text-sm text-slate-300">No fuel stations were found within {radius} km.</div>}
  </main>;
}
