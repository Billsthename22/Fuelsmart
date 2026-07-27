'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Fuel, 
  MapPinned, 
  ChevronDown, 
  Search,
  Settings2
} from 'lucide-react';

interface SidebarProps {
  brands: string[];
  models: string[];
  stations: string[];
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  selectedStation: string;
  setSelectedStation: (value: string) => void;
}

export default function Sidebar({
  brands,
  models,
  stations,
  selectedBrand,
  setSelectedBrand,
  selectedModel,
  setSelectedModel,
  selectedStation,
  setSelectedStation,
}: SidebarProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const initAutocomplete = () => {
      const input = document.getElementById("areaSearch") as HTMLInputElement;
      if (!input || !window.google?.maps?.places) return;

      autocompleteRef.current = new google.maps.places.Autocomplete(input, {
        types: ["(regions)"],
        componentRestrictions: { country: "ng" },
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        console.log("Location Selected:", place?.formatted_address);
      });
    };

    if (window.google) {
      initAutocomplete();
    } else {
      const timer = setInterval(() => {
        if (window.google) {
          initAutocomplete();
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  return (
    <aside className="h-full w-[320px] bg-slate-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Fuel size={20} className="text-slate-950" />
          </div>
          <h2 className="text-xl font-black tracking-tighter text-white">
            FUEL<span className="text-emerald-500">FLOW</span>
          </h2>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Navigation System v2.0</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Vehicle Configuration */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <Settings2 size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Vehicle Config</span>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel('');
                }}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-white appearance-none focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all hover:bg-slate-800/50"
              >
                <option value="" className="bg-slate-950">Select Brand</option>
                {brands.map((b) => <option key={b} value={b} className="bg-slate-950">{b}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>

            <div className={`relative transition-opacity duration-300 ${!selectedBrand ? 'opacity-40' : 'opacity-100'}`}>
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <select
                disabled={!selectedBrand}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-white appearance-none focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              >
                <option value="" className="bg-slate-950">Select Model</option>
                {models.map((m) => <option key={m} value={m} className="bg-slate-950">{m}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>
          </div>
        </section>

        {/* Station Preference */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <MapPinned size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Station Selection</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                id="areaSearch"
                type="text"
                placeholder="Search Lagos Area..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="h-[200px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {stations.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStation(s)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                    selectedStation === s 
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {s}
                  {selectedStation === s && <motion.div layoutId="dot" className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Connection Status */}
      <div className="p-4 bg-white/5 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Google Places Engine Active</span>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </aside>
  );
}