"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@googlemaps/js-api-loader";
import { ArrowLeft, Fuel, LocateFixed, Search } from "lucide-react";
import FuelStationMap from "@/app/components/map/FuelStationMap";
import { StationSummary } from "@/app/lib/stations";

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

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (!response.ok) return router.replace("/login");
      const { user } = await response.json();
      if (user.role !== "DRIVER") router.replace(user.role === "SUPER_ADMIN" ? "/superadmin" : "/admin");
    });
  }, [router]);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => setUserLocation({ lat: coords.latitude, lng: coords.longitude }), () => setUserLocation(null), { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  }, []);

  useEffect(() => { if (!initialPoint) locate(); }, [initialPoint, locate]);

  const loadStations = useCallback(async () => {
    setLoading(true); setError("");
    const query = new URLSearchParams({ radiusKm: "50" });
    if (userLocation) { query.set("lat", String(userLocation.lat)); query.set("lng", String(userLocation.lng)); }
    try {
      const response = await fetch(`/api/stations?${query.toString()}`);
      if (!response.ok) throw new Error("Could not load stations");
      const data = await response.json();
      let rows: StationSummary[] = data.stations || [];
      if (selectedFromUrl && !rows.some((station) => station._id === selectedFromUrl)) {
        const detail = await fetch(`/api/stations/${selectedFromUrl}`);
        if (detail.ok) rows = [await detail.json().then((value) => value.station), ...rows];
      }
      setStations(rows);
      setSelectedId((current) => current && rows.some((station) => station._id === current) ? current : rows[0]?._id || null);
    } catch {
      setError("Could not load registered FuelSmart stations.");
    } finally { setLoading(false); }
  }, [selectedFromUrl, userLocation]);

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
    if (userLocation) { next.set("lat", String(userLocation.lat)); next.set("lng", String(userLocation.lng)); }
    router.replace(`/stations?${next.toString()}`, { scroll: false });
  }

  function submitAddress(event: FormEvent) { event.preventDefault(); addressRef.current?.focus(); }

  return <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100">
    <header className="flex flex-col gap-4 border-b border-slate-800 bg-slate-950 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4"><Link href="/Dashboard" className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link><Link href="/Dashboard" className="flex items-center gap-2 text-xl font-black italic"><span className="rounded-lg bg-emerald-500 p-2 text-slate-950"><Fuel size={18} /></span>FUEL<span className="text-emerald-400 not-italic">SMART</span></Link><div className="hidden border-l border-slate-800 pl-4 lg:block"><p className="text-sm font-bold">Station navigation</p><p className="text-xs text-slate-500">Only registered and verified FuelSmart branches</p></div></div>
      <div className="flex flex-col gap-2 sm:flex-row"><form onSubmit={submitAddress} className="relative min-w-0 sm:w-80"><Search className="absolute left-3 top-3.5 text-slate-500" size={15} /><input ref={addressRef} value={address} onChange={(event) => setAddress(event.target.value)} aria-label="Search your location" placeholder="Search your location or area" className="w-full rounded-xl border border-slate-700 bg-[#020617] py-3 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" /></form><button onClick={locate} className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold"><LocateFixed size={16} />My location</button></div>
    </header>
    <main className="relative min-h-[calc(100vh-89px)] flex-1"><FuelStationMap stations={stations} selectedStationId={selectedId} userLocation={userLocation} onSelect={selectStation} error={error || undefined} onRetry={loadStations} />{loading && <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-slate-950/90 px-4 py-2 text-xs font-bold text-emerald-300 shadow-xl">Loading verified stations…</div>}{!loading && !error && !stations.length && <div className="absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-2xl border border-slate-700 bg-slate-950/95 p-5 text-center text-sm text-slate-300">No verified stations were found in this area.</div>}</main>
  </div>;
}
