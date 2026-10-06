"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { AppRole, dashboardForRole, validateSignup } from "@/app/lib/auth-routing";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState(""); const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false); const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateSignup({ username, email, password, confirmation });
    if (validation) return setMessage(validation);
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: username.trim(), email: email.trim(), password }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setMessage(data.error || "Unable to create your account."); return; }
      router.replace(dashboardForRole(data.user.role as AppRole));
    } catch { setMessage("Could not reach FuelSmart. Check your connection and try again."); }
    finally { setLoading(false); }
  }

  const field = "w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-emerald-500";
  return <AuthLayout title="Create your account" subtitle="Join as a driver to compare verified nearby fuel stations." alternateText="Already registered?" alternateHref="/login" alternateLabel="Sign in"><form onSubmit={submit} className="space-y-4">
    {message && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">{message}</p>}
    <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-400">Username</span><span className="relative block"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} disabled={loading} className={field} placeholder="Choose a username" /></span></label>
    <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-400">Email address</span><span className="relative block"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} className={field} placeholder="you@example.com" /></span></label>
    <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-400">Password</span><span className="relative block"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} className={`${field} pr-12`} placeholder="At least 8 characters" /><button type="button" aria-label={showPassword ? "Hide passwords" : "Show passwords"} onClick={() => setShowPassword((shown) => !shown)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
    <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-400">Confirm password</span><span className="relative block"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input required minLength={8} type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={loading} className={field} placeholder="Enter the password again" /></span></label>
    <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60">{loading && <Loader2 className="animate-spin" size={18} />}Create driver account</button>
    <p className="text-center text-xs leading-5 text-slate-500">Fuel-station administrators do not register here. They use the private link sent after their station application is approved.</p>
  </form></AuthLayout>;
}
