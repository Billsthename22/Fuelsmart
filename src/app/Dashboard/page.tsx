"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader } from "@googlemaps/js-api-loader";
import { Bell, Fuel, History, LayoutDashboard, LogOut, MapPin, Menu, MessageSquare, Search, Settings, X } from "lucide-react";
import { FUEL_TYPES, FuelType, StationSummary } from "@/app/lib/stations";
import NearbyStationList from "@/app/components/dashboard/NearbyStationList";
import DashboardDemoWidgets from "@/app/components/dashboard/DashboardDemoWidgets";
import LocationAccessPanel from "@/app/components/dashboard/LocationAccessPanel";

type Point = { lat: number; lng: number };

export default function Dashboard() {
  const router = useRouter();
  const addressRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("Driver");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState<Point | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [stations, setStations] = useState<StationSummary[]>([]);
  const [listState, setListState] = useState<"loading" | "error" | "ready">("loading");
  const [radius, setRadius] = useState(8);
  const [fuelType, setFuelType] = useState<FuelType | "">("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [search, setSearch] = useState("");

  const requestLocation = useCallback(() => {
    setLocationDenied(false);
    setListState("loading");
    if (!("geolocation" in navigator)) { setLocationDenied(true); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation({ lat: coords.latitude, lng: coords.longitude }),
      () => setLocationDenied(true),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (!response.ok) return router.replace("/login");
      const { user } = await response.json();
      if (user.role !== "DRIVER") return router.replace(user.role === "SUPER_ADMIN" ? "/superadmin" : "/admin");
      setUsername(user.username);
      requestLocation();
    });
  }, [requestLocation, router]);

  const loadStations = useCallback(async () => {
    setListState("loading");
    const params = new URLSearchParams({ radiusKm: String(radius) });
    if (location) { params.set("lat", String(location.lat)); params.set("lng", String(location.lng)); }
    if (fuelType) params.set("fuelType", fuelType);
    if (availableOnly) params.set("available", "true");
    if (search.trim()) params.set("search", search.trim());
    try {
      const response = await fetch(`/api/stations?${params.toString()}`);
      if (!response.ok) throw new Error("station request failed");
      const data = await response.json();
      setStations(data.stations || []);
      setListState("ready");
    } catch {
      setListState("error");
    }
  }, [availableOnly, fuelType, location, radius, search]);

  useEffect(() => {
    if (!location && !locationDenied) return;
    const timer = window.setTimeout(loadStations, 250);
    return () => window.clearTimeout(timer);
  }, [loadStations, location, locationDenied]);

  useEffect(() => {
    if (!locationDenied || !addressRef.current) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;
    new Loader({ apiKey, version: "weekly", libraries: ["places"] }).load().then(() => {
      if (!addressRef.current) return;
      const autocomplete = new google.maps.places.Autocomplete(addressRef.current, { componentRestrictions: { country: "ng" }, fields: ["formatted_address", "geometry"] });
      autocomplete.addListener("place_changed", () => {
        const point = autocomplete.getPlace().geometry?.location;
        if (point) { setLocation({ lat: point.lat(), lng: point.lng() }); setLocationDenied(false); }
      });
    }).catch(() => undefined);
  }, [locationDenied]);

  const availablePrices = stations.flatMap((station) => station.currentPrices.filter((price) => price.available));
  const lowestPrice = availablePrices.length ? Math.min(...availablePrices.map((price) => price.price)) : null;
  const openCount = stations.filter((station) => station.status === "OPEN").length;
  const nav = useMemo(() => [
    { href: "/Dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/stations", label: "Stations", icon: <MapPin size={18} /> },
    { href: "/Trends", label: "Price History", icon: <History size={18} /> },
    { href: "/Community", label: "Community", icon: <MessageSquare size={18} /> },
    { href: "/Profile", label: "Settings", icon: <Settings size={18} /> },
  ], []);

  return <div className="flex min-h-screen bg-[#020617] text-slate-100">
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-[#020617]/95 p-4 backdrop-blur lg:hidden"><Brand /><button onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-xl bg-slate-800 p-2">{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button></header>
    {mobileMenuOpen && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-[#020617] p-6 transition-transform lg:sticky lg:top-0 lg:h-screen ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}><Brand /><nav className="mt-10 space-y-2">{nav.map((item, index) => <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${index === 0 ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>{item.icon}{item.label}</Link>)}</nav><div className="mt-auto border-t border-slate-800 pt-5"><p className="font-bold">{username}</p><p className="text-xs text-emerald-400">Driver account</p></div></aside>
    <main className="min-w-0 flex-1 bg-gradient-to-br from-[#020617] via-[#080e1e] to-[#0f172a] px-5 pb-12 pt-24 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Live FuelSmart stations</p><h1 className="mt-2 text-3xl font-black">Welcome back, {username}</h1><p className="mt-1 text-sm text-slate-400">Compare verified branch prices before you start driving.</p></div><div className="flex gap-2"><button className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-400"><Bell size={18} /></button><button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); }} className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400" title="Logout"><LogOut size={18} /></button></div></div>
        <div className="mt-7"><LocationAccessPanel ref={addressRef} denied={locationDenied} onRetry={requestLocation} /></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3"><Stat label="Nearby branches" value={String(stations.length)} /><Stat label="Open now" value={String(openCount)} /><Stat label="Lowest available price" value={lowestPrice === null ? "—" : `₦${lowestPrice.toLocaleString()}/L`} /></div>
        <section className="mt-8"><div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><h2 className="text-xl font-black">Nearby verified stations</h2><p className="mt-1 text-sm text-slate-400">Station status and fuel availability are shown separately.</p></div><div className="grid gap-2 sm:grid-cols-2 lg:flex"><label className="relative"><Search className="absolute left-3 top-3.5 text-slate-500" size={15} /><input aria-label="Search stations" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Station, branch or area" className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" /></label><select aria-label="Search radius" value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm">{[1, 5, 8, 15, 25, 50].map((km) => <option key={km} value={km}>{km} km radius</option>)}</select><select aria-label="Fuel type" value={fuelType} onChange={(event) => setFuelType(event.target.value as FuelType | "")} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm"><option value="">All fuels</option>{FUEL_TYPES.map((fuel) => <option key={fuel}>{fuel}</option>)}</select><label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm"><input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} className="accent-emerald-500" />Available only</label></div></div><NearbyStationList state={listState} stations={stations} onRetry={loadStations} userLocation={location} /></section>
        <DashboardDemoWidgets />
      </div>
    </main>
  </div>;
}

function Brand() { return <Link href="/" className="flex items-center gap-2 text-xl font-black italic"><span className="rounded-lg bg-emerald-500 p-2 text-slate-950"><Fuel size={18} /></span>FUEL<span className="text-emerald-400 not-italic">SMART</span></Link>; }
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5"><p className="text-xs uppercase tracking-widest text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-white">{value}</p></div>; }
