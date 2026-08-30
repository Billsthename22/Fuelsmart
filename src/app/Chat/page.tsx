"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const send = () => { if (!message.trim()) return; setMessages((items) => [...items, message.trim()]); setMessage(""); };
  return <div className="min-h-screen bg-[#020617] text-slate-100"><Navbar /><main className="max-w-3xl mx-auto p-6"><h1 className="text-3xl font-black">Community chat</h1><p className="mt-2 text-slate-400">Chat persistence will be added to the MongoDB backend in a later phase.</p><div className="mt-8 min-h-64 rounded-3xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">{messages.length ? messages.map((item, index) => <p key={index} className="rounded-xl bg-emerald-500/10 p-3 text-emerald-100">{item}</p>) : <p className="text-slate-500">No messages yet.</p>}</div><div className="mt-4 flex gap-3"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} className="flex-1 rounded-xl border border-slate-700 bg-slate-900 p-3" placeholder="Write a message" /><button onClick={send} className="rounded-xl bg-emerald-500 px-5 font-bold text-slate-950">Send</button></div></main></div>;
}
