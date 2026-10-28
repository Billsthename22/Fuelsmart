"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, CheckCircle2, Clock3, Fuel, Gauge, MapPin, Send, ShieldCheck, TriangleAlert, XCircle } from "lucide-react";
import DriverNavigation from "@/app/components/dashboard/DriverNavigation";
import { COMMUNITY_CATEGORIES, COMMUNITY_CATEGORY_LABELS, CommunityCategory, CommunityPostSummary, CommunityVote } from "@/app/lib/community";
import { mergeNearbyStations, searchNearbyGoogleStations } from "@/app/lib/nearby-stations";
import { StationSummary } from "@/app/lib/stations";

type StationOption = { _id: string; brand: string; branchName: string; address: string; verified: boolean; coordinates?: { lat: number; lng: number } };
type Viewer = { username: string; role: string } | null;

export default function CommunityPage() {
  const [viewer, setViewer] = useState<Viewer>(null);
  const [authReady, setAuthReady] = useState(false);
  const [stations, setStations] = useState<StationOption[]>([]);
  const [posts, setPosts] = useState<CommunityPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [stationId, setStationId] = useState("");
  const [category, setCategory] = useState<CommunityCategory>("FUEL_AVAILABLE");
  const [reportedPrice, setReportedPrice] = useState("");
  const [fuelType, setFuelType] = useState("PMS");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStation, setFilterStation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true); setError("");
    const query = new URLSearchParams();
    if (filterCategory) query.set("category", filterCategory);
    if (filterStation) query.set("stationKey", filterStation);
    try {
      const response = await fetch(`/api/community-posts${query.size ? `?${query.toString()}` : ""}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPosts(data.posts || []);
    } catch { setError("Could not load community updates."); }
    finally { setLoading(false); }
  }, [filterCategory, filterStation]);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => { if (response.ok) setViewer((await response.json()).user); }).finally(() => setAuthReady(true));
    fetch("/api/stations").then(async (response) => {
      if (!response.ok) return;
      let rows: StationSummary[] = (await response.json()).stations || [];
      const applyDeepLink = (values: StationOption[]) => {
        const params = new URLSearchParams(window.location.search); const key = params.get("stationKey");
        if (key && !values.some((station) => station._id === key)) { const lat = Number(params.get("lat")), lng = Number(params.get("lng")); if (key.startsWith("google:") && params.get("brand") && params.get("address") && Number.isFinite(lat) && Number.isFinite(lng)) values = [{ _id: key, brand: params.get("brand")!, branchName: "", address: params.get("address")!, verified: false, coordinates: { lat, lng } }, ...values]; }
        setStations(values); if (key) setStationId(key);
      };
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!("geolocation" in navigator) || !apiKey) return applyDeepLink(rows);
      navigator.geolocation.getCurrentPosition(async ({ coords }) => { try { rows = mergeNearbyStations(rows, await searchNearbyGoogleStations({ apiKey, center: { lat: coords.latitude, lng: coords.longitude }, radiusKm: 50 })); } catch {} applyDeepLink(rows); }, () => applyDeepLink(rows), { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 });
    });
  }, []);
  useEffect(() => { const timer = window.setTimeout(loadPosts, 0); return () => window.clearTimeout(timer); }, [loadPosts]);

  const canContribute = viewer?.role === "DRIVER";
  const selectedStation = useMemo(() => stations.find((station) => station._id === stationId), [stationId, stations]);

  async function submitReport(event: FormEvent) {
    event.preventDefault(); setNotice(""); setSubmitting(true);
    try {
      const response = await fetch("/api/community-posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stationId, station: selectedStation ? { brand: selectedStation.brand, branchName: selectedStation.branchName, address: selectedStation.address, verified: selectedStation.verified, coordinates: selectedStation.coordinates } : null, category, fuelType, message, reportedPrice: reportedPrice ? Number(reportedPrice) : null }) });
      const data = await response.json();
      if (!response.ok) return setNotice(data.error || "Could not publish your update.");
      setMessage(""); setReportedPrice(""); setNotice("Your station update is live for 24 hours.");
      await loadPosts();
    } catch { setNotice("Could not publish your update."); }
    finally { setSubmitting(false); }
  }

  async function vote(postId: string, value: CommunityVote) {
    if (!canContribute) return setNotice("Log in with a driver account to confirm updates.");
    const response = await fetch(`/api/community-posts/${postId}/vote`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value }) });
    const data = await response.json();
    if (!response.ok) return setNotice(data.error || "Could not save your vote.");
    setPosts((current) => current.map((post) => post._id === postId ? { ...post, votes: data.votes } : post));
  }

  return <div className="flex min-h-screen bg-[#020617] text-slate-100">
    <DriverNavigation activeHref="/Community" username={viewer?.role === "DRIVER" ? viewer.username : null} />
    <main className="min-w-0 flex-1 bg-gradient-to-br from-[#020617] via-[#080e1e] to-[#0f172a] px-4 pb-16 pt-24 sm:px-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Verified station reports</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Community updates</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">Fresh reports from drivers, linked to real FuelSmart stations and automatically removed from the live feed after 24 hours.</p></div><div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-300"><ShieldCheck size={17} /><span>Station selection required</span></div></header>

        <section className="mt-7 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 shadow-xl sm:p-6">
          {!authReady ? <p className="text-sm text-slate-400">Checking your account…</p> : !canContribute ? <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-black">Want to report a station update?</h2><p className="mt-1 text-sm text-slate-400">You can read the live feed as a guest. Log in with a driver account to post or confirm reports.</p></div><a href="/login" className="rounded-xl bg-emerald-500 px-5 py-3 text-center text-sm font-black text-slate-950">Log in to contribute</a></div> : <form onSubmit={submitReport}>
            <div className="flex items-center gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500 text-sm font-black text-slate-950">{viewer.username.slice(0, 1).toUpperCase()}</div><div><h2 className="font-black">Share a live station update</h2><p className="text-xs text-slate-500">Reports remain active for 24 hours.</p></div></div>
            <div className="mt-5 grid gap-3 md:grid-cols-2"><label className="text-xs font-bold text-slate-400">Fuel station<select aria-label="Fuel station" required value={stationId} onChange={(event) => setStationId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white"><option value="">Select a verified station</option>{stations.map((station) => <option key={station._id} value={station._id}>{station.brand}{station.branchName ? ` — ${station.branchName}` : ""} · {station.address}</option>)}</select></label><label className="text-xs font-bold text-slate-400">Report category<select aria-label="Report category" value={category} onChange={(event) => setCategory(event.target.value as CommunityCategory)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white">{COMMUNITY_CATEGORIES.map((value) => <option key={value} value={value}>{COMMUNITY_CATEGORY_LABELS[value]}</option>)}</select></label></div>
            {selectedStation && <p className="mt-3 flex items-center gap-2 text-xs text-emerald-300"><BadgeCheck size={14} />Reporting {selectedStation.brand}{selectedStation.branchName ? ` — ${selectedStation.branchName}` : ""}</p>}
            {(category === "FUEL_AVAILABLE" || category === "FUEL_UNAVAILABLE" || category === "PRICE_UPDATE") && <div className="mt-4 grid gap-3 md:grid-cols-2"><label className="text-xs font-bold text-slate-400">Fuel type<select aria-label="Fuel type for report" value={fuelType} onChange={(event) => setFuelType(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white"><option>PMS</option><option>DIESEL</option><option>LPG</option><option>CNG</option></select></label>{category === "PRICE_UPDATE" && <label className="text-xs font-bold text-slate-400">Current price per litre<input aria-label="Reported fuel price" required min="1" type="number" value={reportedPrice} onChange={(event) => setReportedPrice(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white" placeholder="₦ e.g. 950" /></label>}</div>}
            <textarea aria-label="Additional details" maxLength={280} value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className="mt-4 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-emerald-500" placeholder="Optional details: queue length, fuel type, pump condition…" />
            <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-slate-600">{message.length}/280</span><button disabled={submitting} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-60">{submitting ? "Publishing…" : "Publish update"}<Send size={15} /></button></div>
          </form>}
          {notice && <p role="status" className="mt-4 rounded-xl bg-slate-950 p-3 text-sm text-amber-300">{notice}</p>}
        </section>

        <section className="mt-9"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-xl font-black">Live reports</h2><p className="mt-1 text-sm text-slate-500">Confirm useful information or mark reports that are no longer accurate.</p></div><div className="grid gap-2 sm:grid-cols-2"><select aria-label="Filter by station" value={filterStation} onChange={(event) => setFilterStation(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"><option value="">All stations</option>{stations.map((station) => <option key={station._id} value={station._id}>{station.brand}{station.branchName ? ` — ${station.branchName}` : ""}</option>)}</select><select aria-label="Filter by category" value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"><option value="">All updates</option>{COMMUNITY_CATEGORIES.map((value) => <option key={value} value={value}>{COMMUNITY_CATEGORY_LABELS[value]}</option>)}</select></div></div>
          <div className="mt-5 space-y-4">{loading ? <FeedMessage text="Loading live reports…" /> : error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center text-rose-300"><p>{error}</p><button onClick={loadPosts} className="mt-3 rounded-xl border border-rose-500/30 px-4 py-2 text-sm font-bold">Try again</button></div> : !posts.length ? <FeedMessage text="No live reports match these filters yet." /> : posts.map((post) => <PostCard key={post._id} post={post} canVote={canContribute} onVote={vote} />)}</div>
        </section>
      </div>
    </main>
  </div>;
}

function PostCard({ post, canVote, onVote }: { post: CommunityPostSummary; canVote: boolean; onVote: (id: string, value: CommunityVote) => void }) {
  const alert = post.category === "FUEL_UNAVAILABLE" || post.category === "LONG_QUEUE" || post.category === "STATION_CLOSED";
  return <article className="rounded-3xl border border-slate-800 bg-slate-900/45 p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="flex gap-3"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${alert ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>{alert ? <TriangleAlert size={19} /> : <Fuel size={19} />}</div><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-black text-white">{post.station.brand}{post.station.branchName ? ` — ${post.station.branchName}` : ""}</h3>{post.station.verified && <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase text-emerald-300"><BadgeCheck size={11} />Verified</span>}</div><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} />{post.station.address}</p></div></div><span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-slate-500"><Clock3 size={12} />{timeAgo(post.createdAt)}</span></div>
    <div className="mt-5"><div className="flex flex-wrap gap-2"><span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${alert ? "bg-rose-500/10 text-rose-300" : "bg-blue-500/10 text-blue-300"}`}>{COMMUNITY_CATEGORY_LABELS[post.category]}</span>{post.fuelType && <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-black text-slate-300">{post.fuelType}</span>}</div>{post.reportedPrice !== null && <p className="mt-3 text-2xl font-black text-white">₦{post.reportedPrice.toLocaleString()}<small className="text-sm text-slate-500">/L</small></p>}{post.message && <p className="mt-3 leading-relaxed text-slate-300">{post.message}</p>}<p className="mt-3 text-xs text-slate-600">Reported by {post.author.username}</p></div>
    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-800 pt-4"><button aria-label={`Still accurate ${post.votes.accurate}`} disabled={!canVote} onClick={() => onVote(post._id, "ACCURATE")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black ${post.votes.mine === "ACCURATE" ? "bg-emerald-500 text-slate-950" : "bg-slate-950 text-slate-400 hover:text-emerald-300"} disabled:cursor-not-allowed disabled:opacity-60`}><CheckCircle2 size={15} />Still accurate · {post.votes.accurate}</button><button aria-label={`No longer accurate ${post.votes.outdated}`} disabled={!canVote} onClick={() => onVote(post._id, "OUTDATED")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black ${post.votes.mine === "OUTDATED" ? "bg-amber-400 text-slate-950" : "bg-slate-950 text-slate-400 hover:text-amber-300"} disabled:cursor-not-allowed disabled:opacity-60`}><XCircle size={15} />No longer accurate · {post.votes.outdated}</button></div>
  </article>;
}

function FeedMessage({ text }: { text: string }) { return <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/20 p-10 text-center text-sm text-slate-500"><Gauge className="mx-auto mb-3" size={24} /><p>{text}</p></div>; }
function timeAgo(value: string) { const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000)); if (minutes < 1) return "Just now"; if (minutes < 60) return `${minutes}m ago`; const hours = Math.floor(minutes / 60); return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`; }
