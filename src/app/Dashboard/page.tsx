// app/page.tsx (Next.js App Router)
"use client";
import { useState } from "react";
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
  const router = useRouter(); // ✅ must be inside the component
  const username = "Emioluwa"; // Later, fetch from session/auth
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // fake auth state for demo

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
            <h3 className="text-lg text-gray-400">Welcome {username}</h3>
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
                  3
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
                        onClick={() => setIsLoggedIn(false)}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700">
                        Login
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700">
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
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="pb-2">Station</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td>GasX</td>
                  <td>$3.45</td>
                  <td>2/14/2024</td>
                  <td className="text-green-400">Approved</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td>Speedway</td>
                  <td>$3.75</td>
                  <td>2/14/2024</td>
                  <td className="text-yellow-400">Pending</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td>Speedway</td>
                  <td>$3.62</td>
                  <td>2/14/2024</td>
                  <td className="text-green-400">Approved</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td>See</td>
                  <td>$3.75</td>
                  <td>2/14/2024</td>
                  <td className="text-green-400">Approved</td>
                </tr>
                <tr>
                  <td>Steves</td>
                  <td>$3.55</td>
                  <td>2/14/2024</td>
                  <td className="text-green-400">Approved</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-6">
            {/* View Trends */}
            <ViewTrendsCard />

            {/* Offline Mode */}
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
      </main>
    </div>
  );
}
