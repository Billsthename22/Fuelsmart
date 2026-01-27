"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Fuel, MapPin, Map, BellRing, Sparkles, 
  ArrowRight, Gauge, ShieldCheck, Zap 
} from "lucide-react";
import { useRouter } from "next/navigation";

// Placeholder Components (Replace with your actual imports)
const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
    <div className="flex items-center gap-2 text-2xl font-black italic tracking-tighter">
      FUEL<span className="text-emerald-500 text-not-italic">SMART</span>
    </div>
    <div className="flex gap-6 items-center">
      <button className="text-sm font-bold text-slate-400 hover:text-white transition">LOGIN</button>
      <button className="bg-emerald-500 text-[#0D1B2A] px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-400 transition">GET STARTED</button>
    </div>
  </nav>
);

export default function Home() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <main className="bg-[#020617] text-slate-100 min-h-screen selection:bg-emerald-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-24 px-6">
        {/* Glow Backgrounds */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-8 tracking-[0.2em] uppercase border border-emerald-500/20 w-fit px-4 py-1.5 rounded-full bg-emerald-500/5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Pricing Engine v2.0</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl xl:text-[5rem] font-bold leading-[1.1] mb-8 tracking-tight">
              Fueling the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-sky-400">
                Next Generation.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed">
              Stop wandering. FuelSmart aggregates real-time data across Nigeria to bring you the lowest prices and shortest queues, instantly.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/Signup")}
                className="group relative px-10 py-5 bg-emerald-500 text-[#020617] font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
              >
                FIND CHEAP FUEL
              </button>
              <button className="px-10 py-5 border border-slate-800 rounded-2xl font-bold hover:bg-white/5 transition-all text-slate-300">
                Live Data Map
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side UI Mockup */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative z-10 p-4 rounded-[3rem] border border-white/5 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-2xl">
               <div className="bg-[#0D1B2A] rounded-[2.5rem] h-[550px] w-full border border-slate-800 overflow-hidden relative">
                  {/* Fake UI Content */}
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-10">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Zap className="text-emerald-500" size={20} />
                      </div>
                      <div className="h-6 w-20 bg-slate-800 rounded-full"></div>
                    </div>
                    <div className="space-y-6">
                      <div className="h-32 w-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-3xl border border-white/5 p-6">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Total Saved</p>
                        <p className="text-4xl font-black">₦48,250</p>
                      </div>
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-2 w-2/3 bg-slate-700 rounded-full"></div>
                              <div className="h-2 w-1/3 bg-slate-800 rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Pulsing Location Tag */}
                  <div className="absolute bottom-10 right-10 flex items-center gap-2 bg-emerald-500 text-black px-4 py-2 rounded-full font-bold shadow-lg shadow-emerald-500/40 animate-bounce">
                    <MapPin size={16} /> ₦750/L
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="py-12 border-y border-slate-900 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Drivers", val: "50K+" },
            { label: "Stations Mapped", val: "1.2K" },
            { label: "Daily Updates", val: "8.5K" },
            { label: "Avg. Savings", val: "18%" },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-emerald-500 text-3xl font-black mb-1">{stat.val}</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS (Timeline) --- */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold mb-4">Precision Intelligence</h2>
            <p className="text-slate-500 italic">"Three steps to a full tank and a full wallet."</p>
          </div>
          
          <div className="relative space-y-20">
            {/* Connection Line */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-slate-800 to-transparent hidden md:block" />

            {[
              { icon: <Gauge />, title: "Real-Time Scan", desc: "Our engine scans local refinery outflows and crowdsourced station data.", color: "text-emerald-400" },
              { icon: <ShieldCheck />, title: "Verify & Filter", desc: "Prices are cross-referenced by our community to ensure 99% accuracy.", color: "text-blue-400" },
              { icon: <Map />, title: "Direct Route", desc: "One-tap navigation to the pump that saves you the most time and money.", color: "text-emerald-400" },
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-10 group"
              >
                <div className={`relative z-10 w-14 h-14 shrink-0 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-center ${step.color} shadow-xl group-hover:border-emerald-500/50 transition-all`}>
                  {step.icon}
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-xl">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

   {/* --- UPDATED CTA SECTION --- */}
<section className="py-24 px-6 mb-20">
  <div className="max-w-5xl mx-auto relative group">
    {/* Ambient Glow */}
    <div className="absolute inset-0 bg-emerald-500 rounded-[3rem] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
    
    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-12 md:p-20 text-center overflow-hidden">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
       >
         <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
           Master Your <span className="text-emerald-500 italic">Mileage.</span>
         </h2>
         <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
           Take the guesswork out of your commute. Join 50,000+ drivers who use FuelSmart to secure the best rates in real-time.
         </p>
         
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/20">
             DOWNLOAD FOR IOS <ArrowRight size={20} />
           </button>
           <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all">
             ANDROID VERSION <ArrowRight size={20} />
           </button>
         </div>
         
         <p className="mt-8 text-xs font-mono text-slate-500 uppercase tracking-widest">
           Free to use • No hidden fees • Verified Data
         </p>
       </motion.div>
    </div>
  </div>
</section>
    </main>
  );
}