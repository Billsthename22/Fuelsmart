"use client";

import { useState, useEffect } from "react";
import { 
 Bell, Fuel, BarChart3, MapPin, 
  MessageSquare, Settings, LayoutDashboard, 
  History, LogOut, Search, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  XAxis, YAxis,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { supabase } from "@/app/lib/supabaseClient";

// Updated trend data with a more "organic" feel
const trendData = [
  { date: "Aug 1", price: 710 },
  { date: "Aug 5", price: 780 },
  { date: "Aug 10", price: 820 },
  { date: "Aug 15", price: 790 },
  { date: "Aug 20", price: 850 },
  { date: "Aug 25", price: 840 },
];


function ViewTrendsCard() {
  return (
    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Price Volatility</h3>
        <span className="text-emerald-500 text-xs font-bold">+12% This Week</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: '12px' }}
              itemStyle={{ color: "#10b981" }}
            />
            <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [] = useState(false);
  const [] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUsername(session.user.user_metadata?.username || session.user.email?.split('@')[0]);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/20 border-r border-white/5 flex flex-col p-8 gap-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl">
            <Fuel className="text-slate-950 w-6 h-6" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-white">FUEL<span className="text-emerald-500 not-italic">SMART</span></span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <SidebarLink icon={<MapPin size={20}/>} label="Stations" />
          <SidebarLink icon={<History size={20}/>} label="Price History" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Community" />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <div className="mt-auto p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
          <p className="text-xs font-bold text-emerald-500 mb-2 uppercase tracking-widest">FuelSmart Pro</p>
          <p className="text-sm text-slate-400 mb-4">Unlock advanced AI forecasting.</p>
          <button className="w-full py-2 bg-emerald-500 text-slate-950 rounded-xl font-bold text-sm">Upgrade</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#020617] to-[#0f172a] p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <p className="text-emerald-500 font-mono text-xs uppercase tracking-[0.3em] mb-1">Live Feed Active</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {username}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative bg-slate-800/40 border border-white/5 rounded-full px-4 py-2 flex items-center gap-3">
               <Search size={18} className="text-slate-500" />
               <input type="text" placeholder="Search stations..." className="bg-transparent border-none outline-none text-sm w-48" />
            </div>

            <button className="relative p-3 bg-slate-800/40 rounded-2xl border border-white/5 text-slate-400 hover:text-emerald-400 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617]" />
            </button>

            <button onClick={async () => { await supabase.auth.signOut(); router.push('/Login'); }} className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all">
              <LogOut size={22} />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <QuickStat label="Nearby Pumps" value="24" trend="+3 New" />
          <QuickStat label="Avg. Price" value="₦745" trend="-₦20" negative />
          <QuickStat label="Total Saved" value="₦12.4k" trend="This Month" />
          <QuickStat label="Reward Pts" value="2,850" trend="Gold Tier" />
        </div>

        {/* Analytics Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-xl font-bold mb-6">Recent Station Reports</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                        <MapPin className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-bold">NNPC Retail - Victoria Island</p>
                        <p className="text-xs text-slate-500">Verified by 12 drivers • 14 mins ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white">₦680<span className="text-xs text-slate-500">/L</span></p>
                      <ChevronRight size={16} className="ml-auto text-slate-600 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <ViewTrendsCard />
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold text-slate-950 mb-2 italic">AI Smart Buy</h3>
                 <p className="text-slate-900/80 text-sm font-medium mb-6">Current prediction: Prices likely to drop by 4% tomorrow evening.</p>
                 <button className="px-6 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform">Wait to Fill</button>
               </div>
               <BarChart3 className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-950/10 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
        </div>

        {/* Floating AI Action */}
        <button
          onClick={() => router.push("/AiChat")}
          className="fixed bottom-10 right-10 w-20 h-20 bg-emerald-500 hover:bg-emerald-400 rounded-[2rem] shadow-2xl shadow-emerald-500/40 flex items-center justify-center text-slate-950 transition-all hover:scale-110 active:scale-95 group"
        >
          <MessageSquare size={32} className="group-hover:rotate-12 transition-transform" />
        </button>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${active ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function QuickStat({ label, value, trend, negative = false }: { label: string, value: string, trend: string, negative?: boolean }) {
  return (
    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
      <p className="text-3xl font-black text-white mb-2">{value}</p>
      <p className={`text-xs font-bold ${negative ? 'text-emerald-500' : 'text-emerald-400 opacity-60'}`}>{trend}</p>
    </div>
  );
}