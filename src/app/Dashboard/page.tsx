 "use client";

import { useState, useEffect } from "react";
import { User, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatsCard from "../components/StatsCard";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Dummy data for trends
const trendData = [
  { date: "Aug 1", price: 700 },
  { date: "Aug 5", price: 800 },
  { date: "Aug 10", price: 850 },
  { date: "Aug 15", price: 850 },
  { date: "Aug 20", price: 850 },
  { date: "Aug 25", price: 850 },
];

// Dummy notifications
const notifications = [
  { id: 1, text: "New report submitted at GasX", time: "2m ago" },
  { id: 2, text: "Station Speedway price updated", time: "10m ago" },
  { id: 3, text: "Your sync was successful", time: "1h ago" },
];

// View Trends card component
function ViewTrendsCard() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">View Trends</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
              labelStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get current user from Supabase auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUsername(session.user.user_metadata?.full_name || session.user.email);
        setIsLoggedIn(true);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUsername(session.user.user_metadata?.full_name || session.user.email);
        setIsLoggedIn(true);
      } else {
        setUsername(null);
        setIsLoggedIn(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1D36] flex flex-col p-6">
        <h1 className="text-xl font-bold mb-8">FuelSmart</h1>
        <nav className="flex flex-col gap-4">
          <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg">
            <span>Dashboard</span>
          </button>
          <button className="text-gray-300 hover:text-white">Reports</button>
          <button className="text-gray-300 hover:text-white">Stations</button>
          <button className="text-gray-300 hover:text-white">Trends</button>
          <button className="text-gray-300 hover:text-white">Settings</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <div>
            <h3 className="text-lg text-gray-400">
              Welcome {username || "Guest"},
            </h3>
            <h2 className="text-2xl font-semibold">Welcome to FuelSmart</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div
              className="relative"
              onMouseEnter={() => setNotifOpen(true)}
              onMouseLeave={() => setNotifOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-2 z-50">
                  <h4 className="px-3 py-2 font-semibold text-sm border-b border-gray-700">
                    Notifications
                  </h4>
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className="px-3 py-2 hover:bg-gray-700 rounded-md text-sm"
                      >
                        <p>{n.text}</p>
                        <span className="text-xs text-gray-400">{n.time}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => router.push("/Notifications")}
                    className="w-full mt-2 text-sm text-blue-400 hover:underline"
                  >
                    View all
                  </button>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer">
                <User size={20} />
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg p-2 z-50">
                  {isLoggedIn ? (
                    <>
                      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700">
                        Profile
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 text-red-400"
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setIsLoggedIn(false);
                          setUsername(null);
                          router.push("/Login");
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700"
                        onClick={() => router.push("/Login")}
                      >
                        Login
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700"
                        onClick={() => router.push("/Signup")}
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatsCard label="Nearby Stations Found" value={23} />
          <StatsCard label="Lowest Price Reported" value="$3.59" />
          <StatsCard label="Reports Submitted" value={114} />
          <StatsCard label="Stations Saved" value={8} />
        </div>

        {/* Lower Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="col-span-2 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
            {/* ...table code here... */}
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-6">
            <ViewTrendsCard />

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-white">
                Notifications
              </h3>
              <p className="text-gray-400 text-sm mb-4">No New Notifications</p>
              <button
                onClick={() => router.push("/Notifications")}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium text-white"
              >
                Open Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <button
            className="bg-blue-900 hover:bg-blue-800 h-20 rounded-lg font-medium text-white flex items-center justify-center"
            onClick={() => router.push("/Reports")}
          >
            Reports
          </button>

          <button
            className="bg-blue-900 hover:bg-blue-800 h-20 rounded-lg font-medium text-white flex items-center justify-center"
            onClick={() => router.push("/Stations")}
          >
            Stations
          </button>

          <button
            className="bg-blue-900 hover:bg-blue-800 h-20 rounded-lg font-medium text-white flex items-center justify-center"
            onClick={() => router.push("/Chat")}
          >
            Chat
          </button>

          {/* Floating Chat Button */}
<button
  onClick={() => router.push("/AiChat")}
  className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white text-2xl z-50"
>
  💬
</button>

        </div>

      </main>
    </div>
  );
}