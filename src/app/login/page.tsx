"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { AppRole, dashboardForRole, validateLogin } from "@/app/lib/auth-routing";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false); const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateLogin(email, password);
    if (validation) return setMessage(validation);
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), password }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setMessage(data.error || "Unable to log in."); return; }
      router.replace(dashboardForRole(data.user.role as AppRole));
    } catch { setMessage("Could not reach FuelSmart. Check your connection and try again."); }
    finally { setLoading(false); }
  }

  return <AuthLayout title="Welcome back" subtitle="Sign in to find verified stations and live branch prices." alternateText="New to FuelSmart?" alternateHref="/signup" alternateLabel="Create an account"><form onSubmit={submit} className="space-y-4">
    {message && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">{message}</p>}
    <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-400">Email address</span><span className="relative block"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-emerald-500" placeholder="you@example.com" /></span></label>
    <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-400">Password</span><span className="relative block"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-11 pr-12 text-sm outline-none focus:border-emerald-500" placeholder="Your password" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((shown) => !shown)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
    <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60">{loading && <Loader2 className="animate-spin" size={18} />}Sign in</button>
  </form></AuthLayout>;
}
