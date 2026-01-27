"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Fuel, ArrowRight, Loader2, User, Mail, Lock } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setAlert({ type: "error", message: "Please fill in all fields." });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      setAlert({ type: "error", message: error.message });
      setLoading(false);
      return;
    }

    setAlert({ type: "success", message: "Account created! Redirecting..." });
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
    <div className="flex items-center justify-center min-h-screen bg-[#020617] p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[1000px] flex flex-col md:flex-row bg-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl shadow-black/50"
      >
        {/* Left Side: Visual/Context */}
        <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-full overflow-hidden hidden md:block">
          <Image
            src="/fuelsmartregisterimg.jpg" // Ensure this image is high quality
            alt="Dashboard Preview"
            fill
            className="object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40" />
          <div className="absolute inset-0 flex flex-col justify-end p-12 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-widest text-sm uppercase">
              <Fuel className="w-5 h-5" /> FuelSmart Premium
            </div>
            <h2 className="text-4xl font-bold leading-tight">Start saving at <br/><span className="text-emerald-500">the next pump.</span></h2>
            <p className="text-slate-400">Join 50,000+ drivers optimizing their fuel spend daily.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <a href="/Login" className="text-emerald-500 font-semibold hover:underline">Login here</a>
            </p>
          </div>

          <AnimatePresence>
            {alert && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
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
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-500"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : "CREATE ACCOUNT"}
            </button>
          </div>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="px-4 text-slate-600 text-xs font-bold tracking-widest uppercase">Or Continue With</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-white/5 border border-slate-800 py-3 rounded-xl hover:bg-white/10 transition-all font-bold text-sm"
            >
              <FcGoogle className="w-5 h-5" /> Google
            </button>
            <button
              onClick={() => handleOAuth("apple")}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-white/5 border border-slate-800 py-3 rounded-xl hover:bg-white/10 transition-all font-bold text-sm"
            >
              <FaApple className="w-5 h-5" /> Apple
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}