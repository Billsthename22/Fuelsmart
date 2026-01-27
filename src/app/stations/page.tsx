"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import Sidebar from '@/app/components/Sidebar';
import carData from '@/data/car_brands_models.json';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Navigation2, 
  MapPin, 
  Loader2, 
  ChevronRight, 
  Fuel, 
  LocateFixed 
} from 'lucide-react';

const stations = [
  'NNPC','Total','TotalEnergies','Oando','MRS','Conoil',
  'Enyo','Ardova','Mobil','Rainoil','Eterna','NorthWest Petroleum',
  'Heyden','AA Rano','Forte Oil','Nipco','Acorn','Ammasco','Petrocam'
];

type ResultItem = {
  name: string;
  address?: string;
  placeId?: string;
  position: google.maps.LatLngLiteral;
  distanceKm: number;
  marker: google.maps.marker.AdvancedMarkerElement;
};

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID!;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export default function FuelMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const dirRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [userPos, setUserPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchStation, setLastSearchStation] = useState('');

  const brands = Object.keys(carData);
  const models = selectedBrand && selectedBrand in carData
    ? carData[selectedBrand as keyof typeof carData] : [];

  // Initialize Map
  useEffect(() => {
    const loader = new Loader({
      apiKey: API_KEY,
      version: 'weekly',
      libraries: ['marker', 'places'],
    });
    loader.load().then(() => {
      if (!mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 6.535, lng: 3.384 },
        zoom: 13,
        mapId: MAP_ID,
        disableDefaultUI: true, // Clean UI
        zoomControl: true,
      });
      mapInstance.current = map;
      dirRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: { 
          strokeColor: "#10b981", // Emerald Green Path
          strokeWeight: 5,
          strokeOpacity: 0.8
        },
      });
      setMapsReady(true);

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserPos(p);
            map.setCenter(p);
            placeOrUpdateUserMarker(p);
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      }
    });
  }, []);

  useEffect(() => {
    if (!mapsReady || !mapInstance.current || !userPos) return;
    placeOrUpdateUserMarker(userPos);
  }, [userPos, mapsReady]);

  const haversineKm = useCallback((a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral) => {
    const R = 6371;
    const toRad = (x: number) => x * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }, []);

  const clearResults = useCallback(() => {
    results.forEach(r => (r.marker.map = null));
    setResults([]);
    setActiveIdx(null);
    dirRendererRef.current?.set('directions', null);
  }, [results]);

  function placeOrUpdateUserMarker(p: google.maps.LatLngLiteral) {
    if (!mapInstance.current) return;
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
        <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
      </div>
    `;
    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstance.current, position: p, content: container,
      });
    } else {
      userMarkerRef.current.position = p;
    }
  }

  const routeTo = useCallback((item: ResultItem, idx: number) => {
    if (!mapInstance.current || !dirRendererRef.current || !userPos) return;
    const dirSvc = new google.maps.DirectionsService();
    dirSvc.route({
      origin: userPos,
      destination: item.position,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (res, status) => {
      if (status === 'OK') {
        dirRendererRef.current!.setDirections(res);
        setActiveIdx(idx);
      }
    });
  }, [userPos]);

  const searchBrandWithin8km = useCallback(async (brand: string) => {
    setIsLoading(true);
    clearResults();
    const map = mapInstance.current!;
    const origin = userPos ?? map.getCenter()!.toJSON();
    const textQuery = brand.includes('Total') ? `${brand} gas station` : `${brand} gas station`;

    try {
      const resp = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
        },
        body: JSON.stringify({
          textQuery,
          locationBias: { circle: { center: { latitude: origin.lat, longitude: origin.lng }, radius: 8000 } },
          pageSize: 20,
        }),
      });

      const data = await resp.json();
      const items: ResultItem[] = [];
      const bounds = new google.maps.LatLngBounds();
      if (userPos) bounds.extend(userPos);

      if (data.places) {
        data.places.forEach((p: any, i: number) => {
          const pos = { lat: p.location.latitude, lng: p.location.longitude };
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map, position: pos, title: p.displayName?.text,
          });  
          marker.addListener('gmp-click', () => routeTo(items[i], i));      
          items.push({
            name: p.displayName?.text || brand,
            address: p.formattedAddress,
            placeId: p.id,
            position: pos,
            distanceKm: userPos ? haversineKm(userPos, pos) : 0,
            marker,
          });
          bounds.extend(pos);
        });
      }

      if (!bounds.isEmpty()) map.fitBounds(bounds, 80);
      const sorted = items.sort((a, b) => a.distanceKm - b.distanceKm);
      setResults(sorted);
      if (sorted.length > 0) routeTo(sorted[0], 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [clearResults, haversineKm, routeTo, userPos]);

  useEffect(() => {
    if (!mapsReady || !selectedStation || isLoading || lastSearchStation === selectedStation) return;
    const timeoutId = setTimeout(() => {
      setLastSearchStation(selectedStation);
      searchBrandWithin8km(selectedStation);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [selectedStation, mapsReady]);

  function locateSelectedStation() {
    if (!selectedStation || isLoading) return;
    setLastSearchStation('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserPos(p);
          placeOrUpdateUserMarker(p);
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          brands={brands}
          models={models}
          stations={stations}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedStation={selectedStation}
          setSelectedStation={setSelectedStation}
        />

        <main className="flex-1 relative">
          {/* Action HUD */}
          <div className="absolute top-6 left-6 z-20 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={locateSelectedStation}
              disabled={isLoading || !selectedStation}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all shadow-2xl ${
                isLoading || !selectedStation 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' 
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              <span className="uppercase tracking-widest text-xs">
                {isLoading ? 'Scanning Area...' : `Find ${selectedStation || 'Stations'}`}
              </span>
            </motion.button>
            
            <button 
              onClick={() => userPos && mapInstance.current?.panTo(userPos)}
              className="p-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl text-emerald-500 hover:text-emerald-400 transition-all"
            >
              <LocateFixed size={20} />
            </button>
          </div>

          {/* Results Overlay */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute z-20 right-6 top-6 bottom-6 w-[360px] hidden lg:flex flex-col bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Navigation2 size={16} className="text-emerald-500" /> Optimal Routes
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Within 8km radius</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    {results.length} Found
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {results.map((r, i) => (
                    <motion.div
                      key={r.placeId || i}
                      whileHover={{ x: 4 }}
                      onClick={() => routeTo(r, i)}
                      className={`p-5 rounded-3xl cursor-pointer transition-all border group ${
                        activeIdx === i 
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' 
                        : 'bg-white/5 border-white/5 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-bold ${activeIdx === i ? 'text-slate-950' : 'text-white'}`}>
                          {r.name}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${activeIdx === i ? 'bg-slate-900/10 text-slate-900' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {r.distanceKm.toFixed(1)} KM
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-1 opacity-70 ${activeIdx === i ? 'text-slate-800' : 'text-slate-400'}`}>
                        {r.address}
                      </p>
                      {activeIdx === i && (
                        <div className="mt-3 pt-3 border-t border-slate-950/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>Navigating...</span>
                          <ChevronRight size={14} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={mapRef} className="w-full h-full grayscale-[0.3] invert-[0.02] brightness-[0.95]" />
          
          {/* Map Gradient Vignette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(2,6,23,0.5)]" />
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}