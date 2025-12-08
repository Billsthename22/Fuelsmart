"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { supabase } from "@/app/lib/supabaseClient"; // ✅ correct import

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Email/password registration
  const handleRegister = async () => {
    if (!username || !email || !password) {
      setAlert({ type: "error", message: "⚠️ Please fill in all fields." });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setAlert({ type: "error", message: `⚠️ ${error.message}` });
      setLoading(false);
      return;
    }

    setAlert({ type: "success", message: "✅ Account registered successfully!" });
    setUsername("");
    setEmail("");
    setPassword("");

    // Redirect to dashboard after short delay
    setTimeout(() => {
      setLoading(false);
      router.push("/Dashboard");
    }, 1500);
  };

  // OAuth registration (Google/Apple)
  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setAlert({ type: "error", message: `⚠️ ${error.message}` });
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#192337] relative overflow-hidden">
      <div className="relative w-[900px] h-[500px] bg-white rounded-xl shadow-lg overflow-hidden flex">
        {/* Left Panel */}
        <div className="absolute top-0 left-0 w-1/2 h-full rounded-r-[100px] overflow-hidden">
          <Image
            src="/fuelsmartregisterimg.jpg"
            alt="Register Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-10">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Hello, Welcome!</h1>
            <p className="text-lg mb-6 drop-shadow-md">Already have an account?</p>
            <a
              href="/Login"
              className="border-2 border-white py-2 px-6 rounded-md hover:bg-white hover:text-blue-500 transition"
            >
              Login
            </a>
          </div>
        </div>

        {/* Register Form */}
        <div className="absolute right-0 w-1/2 h-full bg-white flex flex-col items-center justify-center text-center p-10 text-gray-800">
          {alert && (
            <div
              className={`w-full px-4 py-2 mb-4 text-sm rounded ${
                alert.type === "success"
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              {alert.message}
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4">Register</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-3 border rounded-md"
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-3 border rounded-md"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md"
            disabled={loading}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-3 rounded-md text-white transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="flex items-center w-full my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={() => handleOAuth("google")}
            disabled={loading}
            className="w-full border py-2 mb-2 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
          >
            <FcGoogle className="w-5 h-5 mr-2" /> Register with Google
          </button>
          <button
            onClick={() => handleOAuth("apple")}
            disabled={loading}
            className="w-full border py-2 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
          >
            <FaApple className="w-5 h-5 mr-2" /> Register with Apple
          </button>
        </div>
      </div>
    </div>
  );
}
