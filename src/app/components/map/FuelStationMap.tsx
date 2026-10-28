"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { StationSummary } from "@/app/lib/stations";
import { pickShortestRoute, TravelMode } from "@/app/lib/station-routing";
import StationDetailsPanel, { RouteSummary } from "./StationDetailsPanel";
import QuickStationReport from "./QuickStationReport";
import { advanceVisit, distanceBetweenMeters, VisitPhase } from "@/app/lib/station-visit";

type Point = { lat: number; lng: number };
type Props = { apiKey?: string; stations: StationSummary[]; selectedStationId: string | null; userLocation: Point | null; radiusKm: number; onSelect: (stationId: string) => void; onClearSelection: () => void; error?: string; onRetry?: () => void };

export default function FuelStationMap({ apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", stations, selectedStationId, userLocation, radiusKm, onSelect, onClearSelection, error, onRetry }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const radiusCircleRef = useRef<google.maps.Circle | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const progressMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const visitPhaseRef = useRef<VisitPhase>("idle");
  const visitStationRef = useRef<StationSummary | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode>("driving");
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [routeError, setRouteError] = useState("");
  const [routing, setRouting] = useState(false);
  const [reviewStation, setReviewStation] = useState<StationSummary | null>(null);
  const [automaticReview, setAutomaticReview] = useState(false);
  const [reportsRefreshToken, setReportsRefreshToken] = useState(0);
  const selected = useMemo(() => stations.find((station) => station._id === selectedStationId) || null, [selectedStationId, stations]);

  const clearRoute = useCallback(() => {
    for (const polyline of polylinesRef.current) polyline.setMap(null);
    polylinesRef.current = [];
    if (progressMarkerRef.current) progressMarkerRef.current.map = null;
    progressMarkerRef.current = null;
    setRouteSummary(null);
    setRouteError("");
  }, []);

  useEffect(() => {
    if (!apiKey || !containerRef.current || mapRef.current) return;
    new Loader({ apiKey, version: "weekly", libraries: ["marker", "places"] }).load().then(() => {
      if (!containerRef.current) return;
      mapRef.current = new google.maps.Map(containerRef.current, { center: userLocation || { lat: 6.5244, lng: 3.3792 }, zoom: 14, mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID, disableDefaultUI: true, zoomControl: true, clickableIcons: false });
      mapRef.current.addListener("click", onClearSelection);
      setReady(true);
    }).catch(() => setLoadError(true));
  }, [apiKey, onClearSelection, userLocation]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    for (const marker of markersRef.current) marker.map = null;
    const bounds = new google.maps.LatLngBounds();
    markersRef.current = stations.map((station) => {
      const content = document.createElement("button");
      content.type = "button";
      content.className = `grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-black shadow-xl ${station.verified ? "border-white bg-emerald-500 text-slate-950" : "border-amber-300 bg-slate-950 text-amber-300"}`;
      content.textContent = "⛽";
      content.setAttribute("aria-label", `${station.brand} station`);
      const marker = new google.maps.marker.AdvancedMarkerElement({ map: mapRef.current, position: station.coordinates, title: station.branchName ? `${station.brand} — ${station.branchName}` : station.brand, content });
      marker.addListener("gmp-click", () => onSelect(station._id));
      bounds.extend(station.coordinates);
      return marker;
    });
    if (userLocation) bounds.extend(userLocation);
    if (stations.length && !selectedStationId) mapRef.current.fitBounds(bounds, 72);
    return () => { for (const marker of markersRef.current) marker.map = null; };
  }, [onSelect, ready, selectedStationId, stations, userLocation]);

  useEffect(() => {
    if (!ready || !mapRef.current || !userLocation) return;
    const content = document.createElement("div");
    content.className = "relative h-6 w-6 rounded-full border-[3px] border-white bg-blue-500 shadow-[0_0_0_8px_rgba(59,130,246,.22)]";
    content.setAttribute("aria-label", "Your current location");
    if (userMarkerRef.current) { userMarkerRef.current.position = userLocation; userMarkerRef.current.content = content; }
    else userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({ map: mapRef.current, position: userLocation, title: "Your current location", content, zIndex: 1000 });
    radiusCircleRef.current?.setMap(null);
    radiusCircleRef.current = new google.maps.Circle({ map: mapRef.current, center: userLocation, radius: radiusKm * 1000, strokeColor: "#10b981", strokeOpacity: 0.45, strokeWeight: 1, fillColor: "#10b981", fillOpacity: 0.06, clickable: false });
    if (progressMarkerRef.current) progressMarkerRef.current.position = userLocation;
  }, [radiusKm, ready, userLocation]);

  useEffect(() => {
    const visitStation = visitStationRef.current;
    if (!userLocation || !visitStation || visitPhaseRef.current === "idle" || visitPhaseRef.current === "prompted") return;
    const next = advanceVisit(visitPhaseRef.current, distanceBetweenMeters(userLocation, visitStation.coordinates));
    visitPhaseRef.current = next;
    if (next === "prompted") { const timer = window.setTimeout(() => { setAutomaticReview(true); setReviewStation(visitStation); }, 0); return () => window.clearTimeout(timer); }
  }, [userLocation]);

  useEffect(() => {
    if (ready && selected && mapRef.current) { mapRef.current.panTo(selected.coordinates); mapRef.current.setZoom(16); }
    const timer = window.setTimeout(clearRoute, 0);
    return () => window.clearTimeout(timer);
  }, [clearRoute, ready, selected]);

  const showDirections = useCallback(async () => {
    if (!selected || !userLocation || !mapRef.current) return;
    visitStationRef.current = selected;
    visitPhaseRef.current = advanceVisit("approaching", distanceBetweenMeters(userLocation, selected.coordinates));
    setRouting(true); setRouteError(""); clearRoute();
    try {
      const { Route } = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;
      const base: google.maps.routes.ComputeRoutesRequest = { origin: userLocation, destination: selected.coordinates, travelMode: travelMode === "walking" ? "WALKING" : "DRIVING", fields: ["distanceMeters", "durationMillis", "path", "viewport", "routeLabels"], computeAlternativeRoutes: true };
      let response;
      if (travelMode === "driving") {
        try { response = await Route.computeRoutes({ ...base, requestedReferenceRoutes: ["SHORTER_DISTANCE"] }); }
        catch { response = await Route.computeRoutes(base); }
      } else response = await Route.computeRoutes(base);
      const route = pickShortestRoute(response.routes || []);
      if (!route) throw new Error("No route found");
      polylinesRef.current = route.createPolylines({ polylineOptions: { strokeColor: "#2563eb", strokeOpacity: 1, strokeWeight: 8, zIndex: 20 } });
      for (const polyline of polylinesRef.current) polyline.setMap(mapRef.current);
      if (travelMode === "driving") {
        const car = document.createElement("div");
        car.className = "grid h-11 w-11 place-items-center rounded-full border-[3px] border-white bg-blue-600 text-xl shadow-[0_4px_18px_rgba(37,99,235,.55)]";
        car.textContent = "🚗";
        car.setAttribute("aria-label", "Your driving progress");
        progressMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({ map: mapRef.current, position: userLocation, title: "Your driving progress", content: car, zIndex: 1200 });
      }
      if (route.viewport) mapRef.current.fitBounds(route.viewport, 72);
      setRouteSummary({ distance: formatDistance(route.distanceMeters), duration: formatDuration(route.durationMillis) });
    } catch { setRouteError("Could not calculate a route here. You can still open it in Google Maps."); }
    finally { setRouting(false); }
  }, [clearRoute, selected, travelMode, userLocation]);

  function changeTravelMode(mode: TravelMode) { setTravelMode(mode); clearRoute(); }
  function closeDetails() { clearRoute(); onClearSelection(); }

  if (error) return <div className="flex h-full flex-col items-center justify-center bg-slate-950 p-8 text-center text-rose-300"><p>{error}</p>{onRetry && <button onClick={onRetry} className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white">Try again</button>}</div>;
  if (!apiKey) return <div className="flex h-full items-center justify-center bg-slate-950 p-8 text-center text-slate-300">Google Maps is not configured. Add the browser Maps API key to use navigation.</div>;
  if (loadError) return <div className="flex h-full items-center justify-center bg-slate-950 p-8 text-center text-rose-300">Google Maps could not load. Check the API key and try again.</div>;
  return <div className="relative h-full min-h-0"><div ref={containerRef} className="absolute inset-0" />{selected && <div data-testid="station-details-positioner" className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-xl sm:bottom-4 sm:px-4 lg:bottom-auto lg:left-auto lg:right-5 lg:top-24 lg:w-[390px] lg:max-w-none lg:p-0"><StationDetailsPanel station={selected} userLocation={userLocation} travelMode={travelMode} onTravelModeChange={changeTravelMode} onDirections={showDirections} onClose={closeDetails} directionsAvailable={Boolean(userLocation)} routeSummary={routeSummary} routing={routing} routeError={routeError} onReport={() => { setAutomaticReview(false); setReviewStation(selected); }} reportsRefreshToken={reportsRefreshToken} /></div>}{reviewStation && <QuickStationReport station={reviewStation} automatic={automaticReview} onClose={() => setReviewStation(null)} onSubmitted={() => setReportsRefreshToken((value) => value + 1)} />}</div>;
}

function formatDistance(meters?: number) { if (!Number.isFinite(meters)) return "Distance unavailable"; return (meters as number) < 1000 ? `${Math.round(meters as number)} m` : `${((meters as number) / 1000).toFixed(1)} km`; }
function formatDuration(milliseconds?: number | null) { if (!Number.isFinite(milliseconds)) return "Time unavailable"; const minutes = Math.max(1, Math.round((milliseconds as number) / 60_000)); return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} hr ${minutes % 60} min`; }
