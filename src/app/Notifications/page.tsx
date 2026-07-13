"use client";

import { motion } from "framer-motion";
import { 
  Bell, 
  TrendingDown, 
  Wrench, 
  Zap, 
  ChevronRight, 
  CheckCircle2,
  Clock
} from "lucide-react";
import Navbar from "../components/Navbar";

const notifications = [
  {
    id: 1,
    title: "Fuel Price Update",
    message: "Premium fuel price has dropped by ₦15/L today.",
    time: "2h ago",
    type: "price",
    icon: <TrendingDown className="text-emerald-500" size={20} />,
    color: "emerald"
  },
  {
    id: 2,
    title: "Service Reminder",
    message: "Your car is due for servicing next week. Don’t forget to schedule!",
    time: "1d ago",
    type: "service",
    icon: <Wrench className="text-blue-500" size={20} />,
    color: "blue"
  },
  {
    id: 3,
    title: "FuelSmart Promo",
    message: "Get 5% cashback when you buy fuel via FuelSmart Wallet this weekend.",
    time: "3d ago",
    type: "promo",
    icon: <Zap className="text-purple-500" size={20} />,
    color: "purple"
  },
];

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto py-12 px-6">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase tracking-[0.3em] mb-2"
            >
              <Bell size={14} /> System Activity
            </motion.div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white">NOTIFICATIONS</h1>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 transition-colors flex items-center gap-2">
            Mark all as read <CheckCircle2 size={14} />
          </button>
        </div>

        {/* Notification Feed */}
        <div className="space-y-4">
          {notifications.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 8 }}
              className="group relative bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2rem] p-6 cursor-pointer hover:bg-slate-800/60 transition-all flex items-start gap-5 shadow-xl"
            >
              {/* Vertical Accent Line */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full transition-all ${
                note.color === 'emerald' ? 'bg-emerald-500' : 
                note.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
              }`} />

              {/* Icon Container */}
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                {note.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-lg font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">
                    {note.title}
                  </h2>
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                    <Clock size={10} /> {note.time}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                  {note.message}
                </p>
              </div>

              {/* Action Arrow */}
              <div className="self-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="text-emerald-500" size={20} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State / Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
            You&apos;re all caught up for today
          </p>
        </div>
      </main>

      <style jsx global>{`
        body {
          background-color: #020617;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;