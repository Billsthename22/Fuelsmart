"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, Fuel, BarChart3, MapPin, 
  MessageSquare, Settings, LayoutDashboard, 
  History, LogOut, Search, ChevronRight, TrendingDown,
  Sparkles, Menu, X, ArrowUpRight, Zap, CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid 
} from "recharts";
import { supabase } from "@/app/lib/supabaseClient";

// Trend data
const trendData = [
  { date: "Aug 1", price: 710 },
  { date: "Aug 5", price: 780 },
  { date: "Aug 10", price: 820 },
  { date: "Aug 15", price: 790 },
  { date: "Aug 20", price: 850 },
  { date: "Aug 25", price: 840 },
];

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#020617]/90 border border-slate-700/60 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs">
        <p className="text-slate-400 font-mono mb-1">{label}</p>
        <p className="text-emerald-400 font-extrabold text-sm flex items-center gap-1">
          ₦{payload[0].value} <span className="text-[10px] text-slate-500 font-normal">/L</span>
        </p>
      </div>
    );
  }
  return null;
};

function ViewTrendsCard() {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">Price Volatility</h3>
          <p className="text-lg font-bold text-white">August Trend</p>
        </div>
        <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <TrendingDown size={12} /> +12% This Week
        </span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              activeDot={{ r: 6, fill: "#10b981", stroke: "#020617", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUsername(session.user.user_metadata?.username || session.user.email?.split('@')[0]);
      } else {
        setUsername("Driver");
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* Mobile Top Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 italic font-black text-xl text-white">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <Fuel className="text-slate-950 w-4 h-4" />
          </div>
          FUEL<span className="text-emerald-500 not-italic">SMART</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-2 bg-slate-800/80 rounded-xl text-slate-300"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-[#020617] lg:bg-slate-900/20 border-r border-slate-800/60 
        flex flex-col p-6 gap-8 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Header */}
        <div className="hidden lg:flex items-center gap-3 pt-2">
          <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
            <Fuel className="text-slate-950 w-5 h-5" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-white">
            FUEL<span className="text-emerald-500 not-italic">SMART</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 pt-12 lg:pt-0">
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
          <SidebarLink icon={<MapPin size={18}/>} label="Stations" />
          <SidebarLink icon={<History size={18}/>} label="Price History" />
          <SidebarLink icon={<MessageSquare size={18}/>} label="Community" />
          <SidebarLink icon={<Settings size={18}/>} label="Settings" />
        </nav>

        {/* Upgrade Card */}
        <div className="mt-auto p-5 bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles size={14} /> FuelSmart Pro
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Unlock real-time AI forecasting & queue alerts.
          </p>
          <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5">
            <span>Upgrade Now</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-sm">
            {username ? username[0].toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{username || "User"}</p>
            <p className="text-[10px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Driver
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#020617] via-[#080e1e] to-[#0f172a] p-6 lg:p-10 pt-20 lg:pt-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Pricing Feed Active
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">{username || "Driver"}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:flex-initial bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-3 text-slate-400 focus-within:border-emerald-500/50 transition-colors">
              <Search size={16} className="text-slate-500" />
              <input 
                type="text" 
                placeholder="Search stations, areas..." 
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full md:w-48" 
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-colors shrink-0">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-4 ring-[#020617]" />
            </button>

            {/* Logout */}
            <button 
              onClick={async () => { await supabase.auth.signOut(); router.push('/Login'); }} 
              className="p-2.5 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <QuickStat label="Nearby Pumps" value="24" trend="+3 Available" />
          <QuickStat label="Avg. Price" value="₦745" trend="-₦20 vs Yesterday" positive />
          <QuickStat label="Total Saved" value="₦12,400" trend="This Month" />
          <QuickStat label="Reward Pts" value="2,850" trend="Gold Tier Member" />
        </div>

        {/* Analytics & Station Feeds */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left / Center 2 Columns: Station Reports */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 lg:p-8 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Live Station Reports</h3>
                  <p className="text-xs text-slate-400">Crowdsourced updates from local drivers</p>
                </div>
                <button className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                  View All <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "NNPC Retail - Victoria Island", price: "680", status: "Verified", time: "14 mins ago", drivers: 12 },
                  { name: "TotalEnergies - Lekki Phase 1", price: "750", status: "Low Queue", time: "22 mins ago", drivers: 8 },
                  { name: "Ardova PLC - Ikoyi Hub", price: "710", status: "Verified", time: "45 mins ago", drivers: 19 },
                ].map((station, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800/60 hover:border-emerald-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {station.name}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{station.time}</span> • 
                          <span className="flex items-center gap-1 text-slate-400">
                            <CheckCircle2 size={12} className="text-emerald-500" /> {station.drivers} drivers verified
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-lg font-black text-white">₦{station.price}<span className="text-xs text-slate-500 font-normal">/L</span></p>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {station.status}
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Analytics & AI Widget */}
          <div className="space-y-6">
            
            {/* Price Trend Chart */}
            <ViewTrendsCard />

            {/* AI Smart Buy Recommendation */}
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 lg:p-8 rounded-[2rem] shadow-xl shadow-emerald-950/40 relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-slate-950/20 text-slate-950 px-3 py-1 rounded-full uppercase tracking-wider">
                    AI Predictor
                  </span>
                  <Zap size={18} className="text-slate-950 fill-slate-950" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight italic">AI Smart Buy</h3>
                  <p className="text-slate-900/80 text-xs font-medium leading-relaxed mt-1">
                    Forecast model indicates local pump prices will drop by <span className="font-bold underline">4% tomorrow evening</span>.
                  </p>
                </div>

                <button className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-emerald-400 rounded-xl font-bold text-xs tracking-wider transition-all shadow-lg shadow-slate-950/30 flex items-center justify-center gap-2">
                  <span>WAIT TO FILL (SAVINGS ~₦1,200)</span>
                </button>
              </div>

              {/* Background Decorative Icon */}
              <BarChart3 className="absolute -right-6 -bottom-6 w-36 h-36 text-slate-950/10 group-hover:rotate-12 transition-transform duration-500" />
            </div>

          </div>
        </div>

        {/* Floating AI Chat Navigation Button */}
        <button 
          onClick={() => router.push("/AiChat")}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 lg:w-16 lg:h-16 bg-emerald-500 hover:bg-emerald-400 rounded-2xl lg:rounded-3xl shadow-2xl shadow-emerald-500/40 flex items-center justify-center text-slate-950 transition-all hover:scale-110 active:scale-95 group z-30"
          title="Ask AI Assistant"
        >
          <MessageSquare size={26} className="group-hover:rotate-12 transition-transform" />
        </button>

      </main>
    </div>
  );
}

// Sidebar Link Component
function SidebarLink({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`
      flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs transition-all w-full text-left
      ${active 
        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'}
    `}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Quick Stat Component
function QuickStat({ label, value, trend, positive = false }: { label: string, value: string, trend: string, positive?: boolean }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-[1.75rem] backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0" />
      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl lg:text-3xl font-black text-white tracking-tight mb-1">{value}</p>
      <p className={`text-[11px] font-medium ${positive ? 'text-emerald-400' : 'text-slate-400'}`}>
        {trend}
      </p>
    </div>
  );
}