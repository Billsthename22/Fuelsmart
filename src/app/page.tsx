"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, ArrowRight, Gauge, ShieldCheck, Map, 
  MapPin, Zap, CheckCircle2, ChevronRight, Fuel, TrendingDown,
  Navigation
} from "lucide-react";
import { useRouter } from "next/navigation"; 

// --- NAVBAR COMPONENT ---
const Navbar = () => (
  <header className="sticky top-0 z-50 backdrop-blur-md bg-[#020617]/80 border-b border-slate-800/60">
    <nav className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-2xl font-black italic tracking-tighter cursor-pointer">
        FUEL<span className="text-emerald-500 not-italic">SMART</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
        <a href="#coverage" className="hover:text-emerald-400 transition-colors">Coverage</a>
      </div>

      <div className="flex gap-2 sm:gap-4 items-center">
        <a href="/apply" className="hidden sm:inline text-xs font-bold text-slate-300 hover:text-emerald-400 px-3 py-2 transition tracking-wider">
          LIST YOUR STATION
        </a>
        <a href="/login" className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition tracking-wider">
          LOGIN
        </a>
        <a href="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs tracking-wider transition-all shadow-md shadow-emerald-500/20 active:scale-95">
          GET STARTED
        </a>
      </div>
    </nav>
  </header>
);

export default function Home() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <main className="bg-[#020617] text-slate-100 min-h-screen selection:bg-emerald-500/30 overflow-x-hidden font-sans">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 lg:pt-20 pb-24 px-6 overflow-hidden">
        {/* Glow Backgrounds */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 lg:left-1/4 w-[550px] h-[550px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase border border-emerald-500/30 px-4 py-1.5 rounded-full bg-emerald-500/10 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Pricing Engine v2.0</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl xl:text-[5.25rem] font-extrabold leading-[1.08] tracking-tight">
              Fueling the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-sky-400">
                Next Generation.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Stop wandering. FuelSmart aggregates real-time data across Nigeria to bring you the lowest prices and shortest queues, instantly.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => router.push("/signup")}
                className="group relative px-8 py-4 bg-emerald-500 text-[#020617] font-black rounded-2xl transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 tracking-wider text-sm"
              >
                <span>FIND CHEAP FUEL</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="px-8 py-4 bg-white/5 border border-slate-800 rounded-2xl font-bold hover:bg-white/10 hover:border-slate-700 transition-all text-slate-300 text-sm flex items-center justify-center gap-2">
                <Map className="w-4 h-4 text-emerald-400" />
                <span>Live Data Map</span>
              </button>
            </motion.div>

            <motion.a variants={itemVariants} href="/apply" className="w-fit text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors underline underline-offset-4 decoration-slate-600 hover:decoration-emerald-400">
              Manage a fuel station? Apply to list your branch →
            </motion.a>

            {/* Micro Feature Badges */}
            <motion.div variants={itemVariants} className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Crowd-Verified</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Updated Every 3 Mins</span>
            </motion.div>
          </motion.div>

          {/* Right UI Card Column */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Outer Glass Ring */}
            <div className="relative z-10 p-3 rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl shadow-2xl">
               <div className="bg-[#0D1B2A] rounded-[2rem] p-6 border border-slate-800/80 overflow-hidden relative space-y-6">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                        <Zap className="text-emerald-400" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Nearest Station</p>
                        <p className="text-sm font-bold text-white flex items-center gap-1">
                          Lekki Phase 1 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      LIVE
                    </span>
                  </div>

                  {/* Highlight Stat */}
                  <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-sky-500/10 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Monthly Savings</p>
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <TrendingDown size={14} /> -18% vs Avg
                      </span>
                    </div>
                    <p className="text-3xl font-black tracking-tight text-white">₦48,250</p>
                  </div>

                  {/* Live Feed List */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Nearby Stations</p>
                    
                    {[
                      { name: "TotalEnergies Express", price: "₦750/L", queue: "Low Queue", distance: "1.2 km" },
                      { name: "NNPC Retail Hub", price: "₦720/L", queue: "Moderate", distance: "2.8 km" },
                    ].map((station, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 bg-slate-900/60 hover:bg-slate-800/50 transition rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                            <Fuel size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200">{station.name}</p>
                            <p className="text-[11px] text-slate-500">{station.distance} • {station.queue}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          {station.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Floating Pin Highlight */}
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="flex items-center gap-2 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-full font-black text-xs shadow-lg shadow-emerald-500/30 border border-emerald-300/40 w-fit mx-auto mt-2 cursor-pointer hover:bg-emerald-400 transition-colors"
                  >
                    <Navigation size={14} fill="currentColor" />
                    <span>NAVIGATE TO CHEAPEST (₦720/L)</span>
                  </motion.div>
               </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="py-12 border-y border-slate-800/60 bg-[#020617]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Drivers", val: "50K+" },
            { label: "Stations Mapped", val: "1.2K" },
            { label: "Daily Updates", val: "8.5K" },
            { label: "Avg. Savings", val: "18%" },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left space-y-1">
              <p className="text-emerald-400 text-3xl lg:text-4xl font-black tracking-tight">{stat.val}</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-28 px-6 relative">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center space-y-3 mb-20">
            <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest">Workflow</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Precision Intelligence</h2>
            <p className="text-slate-400 italic text-base">"Three steps to a full tank and a full wallet."</p>
          </div>
          
          <div className="relative space-y-12 md:space-y-16">
            {/* Timeline Vertical Line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-slate-800 to-transparent hidden md:block" />

            {[
              { icon: <Gauge className="w-6 h-6" />, title: "Real-Time Scan", desc: "Our engine scans local refinery outflows and crowdsourced station data to capture live pump prices.", color: "text-emerald-400" },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Verify & Filter", desc: "Prices are cross-referenced by our community driver network to guarantee accuracy before you drive.", color: "text-sky-400" },
              { icon: <Map className="w-6 h-6" />, title: "Direct Route", desc: "One-tap turn-by-turn navigation guides you directly to the pump with minimum wait time.", color: "text-emerald-400" },
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-6 md:gap-10 items-start group"
              >
                <div className={`relative z-10 w-14 h-14 shrink-0 rounded-2xl bg-[#0D1B2A] border border-slate-800 flex items-center justify-center ${step.color} shadow-xl group-hover:border-emerald-500/50 group-hover:scale-110 transition-all duration-300`}>
                  {step.icon}
                </div>
                <div className="space-y-2 pt-1">
                  <h3 className="text-2xl font-bold group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                    {step.title}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-400" />
                  </h3>
                  <p className="text-slate-400 text-base leading-relaxed max-w-2xl">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-6 mb-16">
        <div className="max-w-5xl mx-auto relative group">
          
          {/* Outer Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-[3rem] blur-2xl opacity-15 group-hover:opacity-25 transition duration-500" />
          
          <div className="relative bg-[#0D1B2A]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 text-center overflow-hidden">
             
             {/* Background Grid Pattern */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="relative z-10 space-y-8"
             >
               <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
                 Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 italic">Mileage.</span>
               </h2>
               
               <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                 Take the guesswork out of your commute. Join 50,000+ drivers who use FuelSmart to secure the best rates in real-time.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                 <button className="bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 text-sm tracking-wider">
                   <span>DOWNLOAD FOR IOS</span>
                   <ArrowRight size={18} />
                 </button>
                 
                 <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all text-sm tracking-wider">
                   <span>ANDROID VERSION</span>
                   <ArrowRight size={18} />
                 </button>
               </div>
               
               <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest pt-4">
                 Free to use • No hidden fees • Verified Data
               </p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-900 py-10 px-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FuelSmart Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition">Support</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
