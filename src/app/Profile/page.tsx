"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, Calendar, Award, ShieldCheck, Sparkles, 
  Car, Fuel, Gauge, Zap, TrendingUp, Navigation, Star, 
  Trash2, History, CheckCircle2, Clock, Trophy, Flame, 
  Gift, Bell, ChevronRight, Share2, Copy, Settings, 
  Lock, Moon, Shield, LogOut, ArrowUpRight, BarChart3, 
  Bookmark, Edit3, Plus, Activity, Heart, DollarSign,
  Search, ExternalLink, RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, CartesianGrid 
} from "recharts";

// --- DUMMY DATA FOR CHARTS ---
const savingsHistoryData = [
  { month: "Jan", spent: 42000, saved: 6500, reports: 12 },
  { month: "Feb", spent: 38000, saved: 7200, reports: 18 },
  { month: "Mar", spent: 45000, saved: 5800, reports: 14 },
  { month: "Apr", spent: 51000, saved: 8900, reports: 22 },
  { month: "May", spent: 49000, saved: 9400, reports: 25 },
  { month: "Jun", spent: 44000, saved: 11200, reports: 31 },
  { month: "Jul", spent: 40000, saved: 12400, reports: 28 },
];

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "settings">("overview");
  const [copiedCode, setCopiedCode] = useState(false);
  
  // User Profile State
  const [user, setUser] = useState({
    fullName: "Emioluwa Gbajabiamila",
    username: "emi",
    email: "e.gbajabiamila@fuelsmart.ng",
    phone: "+234 812 345 6789",
    location: "Lagos, Nigeria",
    memberSince: "July 2026",
    level: "FuelSmart Gold Driver",
    score: 94,
    referralCode: "EMI-FUEL-2026",
  });

  useEffect(() => {
    async function getProfile() {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const { user: sessionUser } = await response.json();
        setUser((prev) => ({
          ...prev,
          email: sessionUser.email || prev.email,
          username: sessionUser.username || prev.username,
        }));
      }
    }
    getProfile();
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden pb-20">
      
      {/* BACKGROUND GLOWS */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* ==========================================
            1. PROFILE HEADER
        ========================================== */}
        <section className="relative bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
            {/* Profile Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-tr from-emerald-500 to-sky-400 p-1 shadow-xl shadow-emerald-500/10">
                <div className="w-full h-full bg-[#0D1B2A] rounded-[1.3rem] flex items-center justify-center text-4xl font-black text-emerald-400 border border-white/10">
                  {user.fullName.split(" ").map(n => n[0]).join("")}
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition-all shadow-lg">
                <Edit3 size={16} />
              </button>
            </div>

            {/* Profile Details */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">{user.fullName}</h1>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                      <ShieldCheck size={14} /> Verified
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-mono mt-1">@{user.username} • {user.email}</p>
                </div>

                <button 
                  onClick={() => setActiveTab("settings")}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 self-center md:self-auto"
                >
                  <Settings size={16} />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Meta Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-emerald-400" /> {user.location}</span>
                <span className="flex items-center gap-1.5"><Award size={14} className="text-amber-400" /> {user.level}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-500" /> Member since {user.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview & Activity" },
              { id: "analytics", label: "Analytics & Usage" },
              { id: "settings", label: "Account Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">

            {/* ==========================================
                2. DRIVER STATISTICS & 16. FUELSMART SCORE
            ========================================== */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <StatCard label="Total Saved" value="₦28,450" trend="+18% this month" positive icon={<DollarSign size={18} />} />
              <StatCard label="Reward Points" value="1,240" trend="Tier 2 Progress" icon={<Gift size={18} />} />
              <StatCard label="Reports Submitted" value="247" trend="24 verified" icon={<Activity size={18} />} />
              <StatCard label="Community Rank" value="#15" trend="Top 1% Lagos" icon={<Trophy size={18} />} />
              <StatCard label="Favorite Stations" value="4 Saved" trend="Live alerts on" icon={<Heart size={18} />} />
              
              {/* FuelSmart Score Gauge Card */}
              <div className="col-span-2 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">FuelSmart Score</span>
                  <Sparkles size={14} className="text-emerald-400" />
                </div>
                <div className="my-2">
                  <p className="text-3xl font-black text-white">{user.score}<span className="text-xs text-slate-500 font-normal"> / 100</span></p>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${user.score}%` }} />
                </div>
              </div>
            </div>

            {/* TWO COLUMN GRID: VEHICLE & INSIGHTS */}
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* ==========================================
                  3. MY VEHICLE & 10. FUEL USAGE
              ========================================== */}
              <div className="lg:col-span-6 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 lg:p-8 backdrop-blur-xl space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                      <Car size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">My Primary Vehicle</h3>
                      <p className="text-xs text-slate-400">Connected fuel efficiency metrics</p>
                    </div>
                  </div>
                  <button className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-slate-700 text-xs font-bold rounded-xl text-slate-300 transition-colors">
                    Edit Vehicle
                  </button>
                </div>

                {/* Specs Display */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <SpecBox label="Brand / Model" value="Toyota Corolla" sub="2021 Edition" />
                  <SpecBox label="Fuel Type" value="PMS (Petrol)" sub="Octane 91+" />
                  <SpecBox label="Tank Capacity" value="50 Liters" sub="Full Tank ≈ ₦37.5k" />
                  <SpecBox label="Avg Economy" value="13.5 km/L" sub="City / Highway" />
                  <SpecBox label="Monthly Spend" value="₦42,000" sub="Est. 3.2 Fills" />
                  <SpecBox label="Tank Status" value="~65% Full" sub="Calculated via AI" />
                </div>
              </div>

              {/* ==========================================
                  4. FUELSMART INSIGHTS
              ========================================== */}
              <div className="lg:col-span-6 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-950 border border-slate-800/80 rounded-[2rem] p-6 lg:p-8 backdrop-blur-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">AI Personalized Insights</h3>
                      <p className="text-xs text-slate-400">Automated price optimizations</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20 font-semibold">
                    REAL-TIME
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
                    <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Top Recommendation</p>
                    <p className="text-sm font-semibold text-slate-200">
                      <strong className="text-white">Mobil Lekki</strong> has been consistently cheaper for the last 12 days. Save up to ₦60/L by buying there on Tuesdays.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                      <p className="text-xs text-slate-400">Est. Monthly Savings</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">₦4,800</p>
                    </div>
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                      <p className="text-xs text-slate-400">Most Visited Station</p>
                      <p className="text-sm font-bold text-white mt-2">TotalEnergies Victoria Island</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ==========================================
                5. FAVORITE STATIONS & 11. SAVED STATIONS
            ========================================== */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 lg:p-8 backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Favorite & Bookmarked Stations</h3>
                  <p className="text-xs text-slate-400">Get priority alerts when prices drop here</p>
                </div>
                <button className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                  Manage Saved ({4})
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Mobil Lekki Phase 1", price: "₦720/L", dist: "1.4 km", score: "9.8/10", tag: "Cheapest" },
                  { name: "NNPC Retail Yaba", price: "₦680/L", dist: "4.2 km", score: "9.4/10", tag: "Low Queue" },
                  { name: "TotalEnergies Ikeja", price: "₦745/L", dist: "8.1 km", score: "9.1/10", tag: "Verified" },
                  { name: "Conoil VI", price: "₦750/L", dist: "2.8 km", score: "8.9/10", tag: "Fast Pump" },
                ].map((station, i) => (
                  <div key={i} className="p-5 bg-slate-950/50 border border-slate-800/80 rounded-2xl hover:border-emerald-500/40 transition-all space-y-4 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          {station.tag}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-2 group-hover:text-emerald-400 transition-colors">{station.name}</h4>
                        <p className="text-xs text-slate-500">{station.dist} away • Score {station.score}</p>
                      </div>
                      <button className="text-slate-600 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <span className="text-lg font-black text-white">{station.price}</span>
                      <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 rounded-xl transition-all">
                        <Navigation size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* THREE COLUMN GRID: ACHIEVEMENTS, REWARDS, & TIMELINE */}
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* ==========================================
                  7. ACHIEVEMENTS & BADGES
              ========================================== */}
              <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Trophy size={18} className="text-amber-400" /> Driver Badges
                  </h3>
                  <span className="text-xs text-slate-500">6 Unlocked</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Fuel Hunter", desc: "Reported 50+ prices", icon: "🥇", active: true },
                    { title: "Route Master", desc: "Used 20+ routes", icon: "🚗", active: true },
                    { title: "30 Day Streak", desc: "Daily verification", icon: "🔥", active: true },
                    { title: "Community Hero", desc: "100+ upvotes", icon: "⭐", active: true },
                    { title: "Verified Reporter", desc: "99% accuracy rate", icon: "🛡️", active: true },
                    { title: "Top Contributor", desc: "Top 100 Lagos", icon: "👑", active: false },
                  ].map((badge, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border text-center transition-all ${
                        badge.active 
                          ? "bg-slate-950/60 border-slate-800 hover:border-amber-500/40" 
                          : "bg-slate-950/20 border-slate-900 opacity-40 grayscale"
                      }`}
                    >
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <p className="text-xs font-bold text-white">{badge.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ==========================================
                  8. REWARDS & 18. COMMUNITY RANKING
              ========================================== */}
              <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Gift size={18} className="text-emerald-400" /> Rewards Progress
                  </h3>
                  <span className="text-xs text-emerald-400 font-mono">Gold Tier</span>
                </div>

                <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-slate-950 border border-emerald-500/20 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Current Points</span>
                    <span className="text-white font-bold font-mono">2,450 / 3,000 PTS</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-sky-400 h-full rounded-full" style={{ width: "81%" }} />
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    Earn <strong className="text-white">550 more points</strong> to unlock Platinum Status & Free Car Wash vouchers!
                  </p>
                </div>

                {/* Community Rank Preview */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Lagos Leaderboard</p>
                  {[
                    { rank: 1, name: "Tunde O.", pts: "4,820", me: false },
                    { rank: 2, name: "Chioma A.", pts: "4,150", me: false },
                    { rank: 15, name: "You (Emioluwa)", pts: "2,450", me: true },
                  ].map((r, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border text-xs ${r.me ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' : 'bg-slate-950/40 border-slate-800 text-slate-300'}`}>
                      <span className="flex items-center gap-3">
                        <span className="font-mono w-4">{r.rank}</span>
                        <span>{r.name}</span>
                      </span>
                      <span className="font-mono">{r.pts} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ==========================================
                  15. ACTIVITY TIMELINE
              ========================================== */}
              <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 backdrop-blur-xl space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock size={18} className="text-sky-400" /> Recent Activity
                </h3>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                  {[
                    { title: "Reported Mobil Lekki", time: "Yesterday", pts: "+50 Pts", color: "text-emerald-400" },
                    { title: "Earned Verified Badge", time: "2 days ago", pts: "+100 Pts", color: "text-amber-400" },
                    { title: "Saved ₦800 on refill", time: "4 days ago", pts: "Saved", color: "text-sky-400" },
                    { title: "Added Total VI to Saved", time: "Last week", pts: "Bookmarked", color: "text-slate-400" },
                  ].map((act, i) => (
                    <div key={i} className="flex items-start gap-4 relative z-10 pl-1">
                      <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white">{act.title}</p>
                        <p className="text-[10px] text-slate-500">{act.time}</p>
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${act.color}`}>{act.pts}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* TWO COLUMN GRID: REPORTS & ACTIONS */}
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* ==========================================
                  6. RECENT REPORTS
              ========================================== */}
              <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 lg:p-8 backdrop-blur-xl space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Your Recent Station Reports</h3>
                  <button className="text-xs text-emerald-400 font-bold hover:underline">View History</button>
                </div>

                <div className="space-y-3">
                  {[
                    { station: "Mobil Lekki Phase 1", price: "₦720/L", queue: "Short Queue", date: "Jul 23, 2026", verified: true },
                    { station: "NNPC Yaba Outlet", price: "₦680/L", queue: "Moderate Queue", date: "Jul 20, 2026", verified: true },
                    { station: "TotalEnergies Ikeja", price: "₦745/L", queue: "No Queue", date: "Jul 18, 2026", verified: true },
                  ].map((report, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">{report.station}</p>
                        <p className="text-xs text-slate-500">{report.date} • {report.queue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-400">{report.price}</p>
                        <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                          <CheckCircle2 size={12} className="text-emerald-500" /> Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ==========================================
                  13. QUICK ACTIONS & 17. REFERRAL SECTION
              ========================================== */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Quick Actions */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 backdrop-blur-xl space-y-4">
                  <h3 className="text-base font-bold text-white">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <ActionButton icon={<Plus size={16} />} label="Report Price" primary />
                    <ActionButton icon={<Search size={16} />} label="Find Stations" />
                    <ActionButton icon={<Car size={16} />} label="Update Car" />
                    <ActionButton icon={<Share2 size={16} />} label="Invite Friends" />
                  </div>
                </div>

                {/* Referral Box */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-emerald-500/20 rounded-[2rem] p-6 backdrop-blur-xl space-y-3">
                  <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">Invite & Earn</p>
                  <p className="text-xs text-slate-300">Share your code with friends and earn 200 pts for every signup.</p>
                  
                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-mono font-bold text-white flex-1 text-center">{user.referralCode}</span>
                    <button 
                      onClick={handleCopyCode} 
                      className="p-2 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors text-xs font-bold"
                    >
                      {copiedCode ? "Copied!" : <Copy size={14} />}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ANALYTICS & USAGE */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            
            {/* ==========================================
                9. SAVINGS HISTORY CHART & 10. FUEL USAGE
            ========================================== */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Monthly Fuel Spend vs Savings</h3>
                  <p className="text-xs text-slate-400">7-month aggregated financial breakdown</p>
                </div>
                <div className="flex gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Money Saved
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Fuel Spend
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={savingsHistoryData}>
                    <defs>
                      <linearGradient id="savedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} 
                    />
                    <Area type="monotone" dataKey="saved" stroke="#10b981" strokeWidth={3} fill="url(#savedGradient)" />
                    <Area type="monotone" dataKey="spent" stroke="#0284c7" strokeWidth={3} fill="url(#spentGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SUBSCRIPTION PLAN PREVIEW */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-xl space-y-6">
              <h3 className="text-lg font-bold text-white">Subscription & Fleet Tier</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Free Driver", price: "₦0", desc: "Basic crowdsourced reports & maps", current: true },
                  { name: "FuelSmart Pro", price: "₦2,500/mo", desc: "AI price forecasts & priority alerts", current: false },
                  { name: "Fleet Manager", price: "₦15,000/mo", desc: "Multi-vehicle tracking & bulk logs", current: false },
                  { name: "Enterprise", price: "Custom", desc: "API access for logistics providers", current: false },
                ].map((plan, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${plan.current ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950/40 border-slate-800'} space-y-3`}>
                    <p className="text-xs font-bold text-emerald-400 uppercase">{plan.name}</p>
                    <p className="text-2xl font-black text-white">{plan.price}</p>
                    <p className="text-xs text-slate-400">{plan.desc}</p>
                    <button className={`w-full py-2 rounded-xl text-xs font-bold ${plan.current ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                      {plan.current ? "Active Plan" : "Upgrade"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ACCOUNT SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* ==========================================
                  14. SETTINGS SHORTCUTS & 20. ACCOUNT INFORMATION
              ========================================== */}
              <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-xl space-y-6">
                <h3 className="text-lg font-bold text-white">Account Information</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <SettingField label="Full Name" value={user.fullName} />
                  <SettingField label="Username" value={`@${user.username}`} />
                  <SettingField label="Email Address" value={user.email} verified />
                  <SettingField label="Phone Number" value={user.phone} verified />
                  <SettingField label="Primary Location" value={user.location} />
                  <SettingField label="Verification Status" value="Tier 2 Verified" verified />
                </div>

                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white">Preferences & Security</h4>
                  <div className="space-y-2">
                    <SettingToggle label="Push Notifications for Price Drops" defaultChecked />
                    <SettingToggle label="Location Services for Automatic Scanning" defaultChecked />
                    <SettingToggle label="Dark Mode Theme" defaultChecked />
                  </div>
                </div>
              </div>

              {/* SETTINGS ACTIONS */}
              <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-6 backdrop-blur-xl space-y-4">
                <h3 className="text-base font-bold text-white">Security Shortcuts</h3>
                
                <button className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between">
                  <span className="flex items-center gap-2"><Lock size={16} /> Change Password</span>
                  <ChevronRight size={16} />
                </button>

                <button className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between">
                  <span className="flex items-center gap-2"><Shield size={16} /> Two-Factor Auth</span>
                  <ChevronRight size={16} />
                </button>

                <button 
                  onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); }}
                  className="w-full p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Sign Out of Account
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Helper Components
function StatCard({ label, value, trend, positive, icon }: { label: string; value: string; trend: string; positive?: boolean; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md space-y-2 relative overflow-hidden">
      <div className="flex justify-between items-center text-slate-400">
        <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className="text-xl font-black text-white tracking-tight">{value}</p>
      <p className={`text-[10px] font-semibold ${positive ? "text-emerald-400" : "text-slate-400"}`}>{trend}</p>
    </div>
  );
}

function SpecBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-0.5">
      <p className="text-[10px] font-mono text-slate-400 uppercase">{label}</p>
      <p className="text-xs font-bold text-white">{value}</p>
      <p className="text-[10px] text-slate-500">{sub}</p>
    </div>
  );
}

function ActionButton({ icon, label, primary }: { icon: React.ReactNode; label: string; primary?: boolean }) {
  return (
    <button className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
      primary 
        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20" 
        : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SettingField({ label, value, verified }: { label: string; value: string; verified?: boolean }) {
  return (
    <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1">
      <p className="text-[10px] font-mono text-slate-400 uppercase">{label}</p>
      <p className="text-xs font-bold text-white flex items-center justify-between">
        {value}
        {verified && <CheckCircle2 size={14} className="text-emerald-400" />}
      </p>
    </div>
  );
}

function SettingToggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-950/30 rounded-xl border border-slate-800/60">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
    </div>
  );
}
