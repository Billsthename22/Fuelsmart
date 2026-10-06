"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { StationSummary } from "@/app/lib/stations";
import NearbyMapStationList from "./NearbyMapStationList";
import StationDetailsPanel from "./StationDetailsPanel";

type Point = { lat: number; lng: number };
type Props = { apiKey?: string; stations: StationSummary[]; selectedStationId: string | null; userLocation: Point | null; onSelect: (stationId: string) => void; error?: string; onRetry?: () => void };

export default function FuelStationMap({ apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", stations, selectedStationId, userLocation, onSelect, error, onRetry }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const directionsRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const selected = useMemo(() => stations.find((station) => station._id === selectedStationId) || stations[0] || null, [selectedStationId, stations]);

  useEffect(() => {
    if (!apiKey || !containerRef.current || mapRef.current) return;
    new Loader({ apiKey, version: "weekly", libraries: ["marker", "places"] }).load().then(() => {
      if (!containerRef.current) return;
      mapRef.current = new google.maps.Map(containerRef.current, { center: userLocation || selected?.coordinates || { lat: 6.5244, lng: 3.3792 }, zoom: 13, mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID, disableDefaultUI: true, zoomControl: true });
      directionsRef.current = new google.maps.DirectionsRenderer({ map: mapRef.current, suppressMarkers: false, polylineOptions: { strokeColor: "#10b981", strokeWeight: 5 } });
      setReady(true);
    }).catch(() => setLoadError(true));
  }, [apiKey, selected, userLocation]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    for (const marker of markersRef.current) marker.map = null;
    const bounds = new google.maps.LatLngBounds();
    markersRef.current = stations.map((station) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({ map: mapRef.current, position: station.coordinates, title: `${station.brand} — ${station.branchName}` });
      marker.addListener("gmp-click", () => onSelect(station._id));
      bounds.extend(station.coordinates);
      return marker;
    });
    if (userLocation) bounds.extend(userLocation);
    if (stations.length) mapRef.current.fitBounds(bounds, 72);
    return () => { for (const marker of markersRef.current) marker.map = null; };
  }, [onSelect, ready, stations, userLocation]);

  useEffect(() => {
    if (ready && selected && mapRef.current) { mapRef.current.panTo(selected.coordinates); mapRef.current.setZoom(15); }
  }, [ready, selected]);

  function showDirections() {
    if (!selected || !userLocation || !directionsRef.current) return;
    new google.maps.DirectionsService().route({ origin: userLocation, destination: selected.coordinates, travelMode: google.maps.TravelMode.DRIVING }, (result, status) => {
      if (status === "OK" && result) directionsRef.current?.setDirections(result);
    });
  }

  if (error) return <div className="flex h-full flex-col items-center justify-center bg-slate-950 p-8 text-center text-rose-300"><p>{error}</p>{onRetry && <button onClick={onRetry} className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white">Try again</button>}</div>;
  if (!apiKey) return <div className="flex h-full items-center justify-center bg-slate-950 p-8 text-center text-slate-300">Google Maps is not configured. Add the browser Maps API key to use navigation.</div>;
  if (loadError) return <div className="flex h-full items-center justify-center bg-slate-950 p-8 text-center text-rose-300">Google Maps could not load. Check the API key and try again.</div>;
  return <div className="relative h-full min-h-[560px]"><div ref={containerRef} className="absolute inset-0" /><NearbyMapStationList stations={stations} selectedStationId={selected?._id || null} onSelect={onSelect} />{selected && <div className="absolute bottom-4 left-4 right-4 z-10 mx-auto max-w-xl"><StationDetailsPanel station={selected} onDirections={showDirections} directionsAvailable={Boolean(userLocation)} /></div>}</div>;
}
