import { BarChart3, Sparkles, Zap } from "lucide-react";

// DEMO DATA ONLY: these concepts stay visible until their real product requirements and backend sources are defined.
export default function DashboardDemoWidgets() {
  return <section aria-label="Product concept previews" className="mt-10">
    <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Preview data</p><h2 className="mt-1 text-xl font-black text-white">Future FuelSmart tools</h2></div><Sparkles className="text-amber-300" /></div>
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6"><p className="text-xs uppercase tracking-widest text-slate-500">Total Saved</p><p className="mt-2 text-3xl font-black">₦12,400</p><p className="mt-1 text-xs text-slate-500">Demo monthly estimate</p></div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6"><p className="text-xs uppercase tracking-widest text-slate-500">Reward Pts</p><p className="mt-2 text-3xl font-black">2,850</p><p className="mt-1 text-xs text-slate-500">Demo membership concept</p></div>
    </div>
    <div className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 p-7 text-slate-950"><div className="relative z-10 max-w-xl"><span className="rounded-full bg-slate-950/10 px-3 py-1 text-xs font-black uppercase">AI predictor concept</span><h3 className="mt-4 text-2xl font-black italic">AI Smart Buy</h3><p className="mt-1 text-sm font-medium">This preview will eventually help drivers understand whether nearby prices are rising or falling. It is not using a live prediction model yet.</p></div><Zap className="absolute right-6 top-6" /><BarChart3 className="absolute -bottom-8 -right-4 h-36 w-36 opacity-10" /></div>
  </section>;
}
