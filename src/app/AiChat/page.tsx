"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Cpu } from "lucide-react"; // Icons for user and bot

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const botResponses: { keyword: string; response: string }[] = [
    { keyword: "hello", response: "Hello! I'm FuelSmart Bot 🤖. How can I assist you today?" },
    { keyword: "hi", response: "Hi there! Need help finding fuel prices or stations?" },
    { keyword: "price", response: "Fuel prices vary by station. Check 'Reports' to see the latest prices." },
    { keyword: "report", response: "You can submit a report through the Reports section." },
    { keyword: "station", response: "Nearby stations are shown on your dashboard map." },
    { keyword: "trends", response: "View fuel price trends on your dashboard's 'Trends' card." },
    { keyword: "saved stations", response: "All your saved stations are listed under 'Stations' on the sidebar." },
    { keyword: "notifications", response: "Check your notifications icon at the top right for updates." },
    { keyword: "help", response: "I'm here to help! Ask me about prices, stations, reports, and trends." },
    { keyword: "bye", response: "Goodbye! Have a safe journey ⛽🚗." },
    { keyword: "thanks", response: "You're welcome! 😊" },
    { keyword: "who made you", response: "I was created by the FuelSmart team to help you navigate fuel data." },
  ];

  // Automatic welcome message
  useEffect(() => {
    setMessages([
      { sender: "bot", text: "Hi! I'm FuelSmart Bot 🤖. How can I help you today?" },
    ]);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const match = botResponses.find((b) => input.toLowerCase().includes(b.keyword));
    const botMessage: Message = {
      sender: "bot",
      text: match ? match.response : "Sorry, I didn't understand that. 🤔",
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <h1 className="text-xl font-semibold">AI Chatbot</h1>
        <button
          onClick={() => router.push("/Dashboard")}
          className="text-blue-400 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && <Cpu size={24} className="text-blue-400 mt-1" />}
            <div
              className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && <User size={24} className="text-green-400 mt-1" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-black focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}
