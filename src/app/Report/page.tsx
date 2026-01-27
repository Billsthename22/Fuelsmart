"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  Fuel, 
  MapPin, 
  ChevronDown, 
  Camera, 
  MessageSquare, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import { fuelStations } from "@/app/stationData";

export default function ReportPage() {
  const [station, setStation] = useState("");
  const [address, setAddress] = useState("Ajah, Lekki, Lagos");
  const [fuelType, setFuelType] = useState("PMS");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Logic remains the same
    console.log({ station, address, fuelType, price, photo, comments });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-12 px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest mb-4"
          >
            <Fuel size={14} /> Community Intelligence
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
            REPORT <span className="text-emerald-500 not-italic">LIVE</span> PRICES
          </h1>
          <p className="text-slate-400 mt-4 max-w-md mx-auto">
            Help the community save by reporting current prices at your local station.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />

          <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Station Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Fuel size={14} className="text-emerald-500" /> Select Station
                </label>
                <div className="relative group">
                  <select
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-white appearance-none outline-none focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">-- Select Station --</option>
                    {fuelStations.map((s) => (
                      <option key={s} value={s} className="bg-slate-900">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:rotate-180 transition-transform" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-500" /> Station Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
                  >
                    <option value="PMS">PMS</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Price (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="750.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Media & Submission */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Camera size={14} className="text-emerald-500" /> Proof of Price
                </label>
                <label
                  htmlFor="photo-upload"
                  className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${
                    photo 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-slate-700/50 hover:border-emerald-500/50 bg-slate-800/30'
                  }`}
                >
                  <Upload className={`${photo ? 'text-emerald-500' : 'text-slate-500'} mb-3`} size={28} />
                  <span className="text-sm font-bold text-center px-4">
                    {photo ? photo.name : "Tap to upload receipt/pump photo"}
                  </span>
                  {!photo && <span className="text-[10px] text-slate-600 mt-2 uppercase tracking-tighter">JPEG, PNG up to 5MB</span>}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <MessageSquare size={14} className="text-emerald-500" /> Additional Notes
                </label>
                <textarea
                  placeholder="Optional: Long queues, limited stock, etc."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all resize-none placeholder:text-slate-600"
                  rows={3}
                />
              </div>
            </div>

            {/* Full Width Submit */}
            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={submitted}
                className={`w-full py-5 rounded-[1.5rem] font-black tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                  submitted 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-white text-slate-950 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20'
                }`}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 size={20} /> REPORT SUBMITTED
                  </>
                ) : (
                  <>SUBMIT TO NETWORK</>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-4 text-slate-600 uppercase font-black text-[9px] tracking-widest">
                <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Fast Verification</span>
                <span className="flex items-center gap-1"><AlertCircle size={10} /> Accurate Data Only</span>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}