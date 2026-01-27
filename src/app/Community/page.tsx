"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  TriangleAlert, 
  Fuel,
  Share2
} from "lucide-react";
import Navbar from "../components/Navbar";

// Mock Data for the Feed
const initialPosts = [
  {
    id: 1,
    user: "Segun_Lagos",
    location: "TotalEnergies, Lekki Phase 1",
    message: "Avoid this station for now. The tankers are just offloading and the queue is massive! 40+ cars already.",
    tag: "Long Queue",
    time: "5m ago",
    likes: 12,
    type: "alert"
  },
  {
    id: 2,
    user: "Aisha_Vibe",
    location: "Enyo, Ikate",
    message: "Fuel is ₦650 here! No queue at all. I was in and out in 3 minutes. Best spot today.",
    tag: "Cheap & Fast",
    time: "18m ago",
    likes: 45,
    type: "update"
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [newMsg, setNewMsg] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const post = {
      id: Date.now(),
      user: "You",
      location: "Current Location",
      message: newMsg,
      tag: "Community Update",
      time: "Just now",
      likes: 0,
      type: "update"
    };
    setPosts([post, ...posts]);
    setNewMsg("");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <Navbar />

      <main className="max-w-2xl mx-auto py-10 px-6">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-black italic tracking-tighter text-white">LIVE FEED</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time intelligence from the road</p>
        </div>

        {/* Create Post Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 border border-white/10 rounded-[2rem] p-6 mb-10 shadow-2xl backdrop-blur-xl"
        >
          <form onSubmit={handlePost} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold shrink-0">
                U
              </div>
              <textarea 
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="What's the fuel situation like where you are?"
                className="w-full bg-transparent border-none outline-none resize-none text-white placeholder:text-slate-600 py-2 text-lg"
                rows={2}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex gap-2">
                <button type="button" className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
                  <MapPin size={20} />
                </button>
                <button type="button" className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
                  <Fuel size={20} />
                </button>
              </div>
              
              <button 
                type="submit"
                className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
              >
                Broadcast <Send size={14} />
              </button>
            </div>
          </form>
        </motion.div>

        {/* Feed List */}
        <div className="space-y-6">
          <AnimatePresence>
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/30 border border-white/5 rounded-[2rem] p-6 hover:bg-slate-900/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      post.type === 'alert' ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-blue-500/20 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                    }`}>
                      {post.type === 'alert' ? <TriangleAlert size={16} /> : post.user[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">{post.user}</h3>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 font-bold uppercase tracking-tighter">
                        <MapPin size={10} className="text-emerald-500" /> {post.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase flex items-center gap-1">
                    <Clock size={10} /> {post.time}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed mb-4 font-medium">
                  {post.message}
                </p>

                {/* Tag Label */}
                <div className="mb-6 flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    post.type === 'alert' 
                      ? 'border-red-500/20 text-red-500 bg-red-500/5' 
                      : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                  }`}>
                    {post.type === 'alert' && <TriangleAlert size={10} />}
                    {post.tag}
                  </span>
                </div>

                {/* Interactions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors text-xs font-black">
                    <ThumbsUp size={16} /> {post.likes}
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors text-xs font-black">
                    <MessageSquare size={16} /> Reply
                  </button>
                  <button className="ml-auto text-slate-600 hover:text-white transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}