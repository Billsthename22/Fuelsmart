"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Fuel, Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push("/Dashboard");
    };
    checkSession();
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) {
      setAlert({ type: "error", message: "Please fill in all fields." });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlert({ type: "error", message: error.message });
      setLoading(false);
      return;
    }

    setAlert({ type: "success", message: "Welcome back! Redirecting..." });
    setTimeout(() => {
      setLoading(false);
      router.push("/Dashboard");
    }, 1500);
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider });
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] p-6 relative overflow-hidden text-slate-200">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[1000px] flex flex-col md:flex-row bg-slate-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl shadow-2xl"
      >
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center border-r border-white/5">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Access Dashboard</h2>
            <p className="text-slate-400 text-sm">
              New to FuelSmart?{" "}
              <a href="/Signup" className="text-emerald-500 font-semibold hover:underline">Create account</a>
            </p>
          </div>

          <AnimatePresence>
            {alert && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 mb-6 rounded-xl text-sm font-medium border ${
                  alert.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {alert.message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                disabled={loading}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-between items-center text-xs px-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer group">
                <input type="checkbox" className="accent-emerald-500 w-4 h-4 bg-slate-800 border-none rounded" />
                <span className="group-hover:text-slate-200 transition">Stay logged in</span>
              </label>
              <a href="#" className="text-emerald-500/80 hover:text-emerald-400 font-bold transition">Reset Password?</a>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-4 rounded-xl font-black tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10"
            >
              {loading ? <Loader2 className="animate-spin" /> : "LOGIN TO ACCOUNT"}
            </button>
          </div>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-800/50"></div>
            <span className="px-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Fast Connect</span>
            <div className="flex-grow border-t border-slate-800/50"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleOAuth("google")} className="flex items-center justify-center gap-2 bg-white/5 border border-slate-800 py-3 rounded-xl hover:bg-white/10 transition-all font-bold text-sm">
              <FcGoogle size={20} /> Google
            </button>
            <button onClick={() => handleOAuth("apple")} className="flex items-center justify-center gap-2 bg-white/5 border border-slate-800 py-3 rounded-xl hover:bg-white/10 transition-all font-bold text-sm">
              <FaApple size={20} /> Apple
            </button>
          </div>
        </div>

        {/* Right Side: Info Panel */}
        <div className="relative w-1/2 hidden md:block bg-gradient-to-br from-slate-900 to-[#020617]">
          <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
             <div 
               className="w-full h-full bg-cover bg-center" 
               style={{ backgroundImage: "url('/fuelsmartloginimg.png')" }}
             />
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-[#020617] via-transparent to-transparent" />
          <div className="relative h-full flex flex-col justify-center p-16 space-y-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <Fuel className="text-slate-950 w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter leading-none">OPTIMIZE <br/> EVERY <br/> DROP.</h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-[280px]">
              Access your personalized fuel heat-map and real-time pricing alerts.
            </p>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm uppercase tracking-widest pt-4 group cursor-pointer">
              Network Status: Live <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}