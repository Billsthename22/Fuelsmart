"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id?: number;
  user_id?: string;
  type: "text" | "image" | "audio";
  content: string;
  created_at?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [liveAudioData, setLiveAudioData] = useState<number[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number | null>(null);

  const scrollToBottom = () =>
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  // Load messages & subscribe to real-time updates
  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      setMessages(data || []);
      scrollToBottom();
    }

    loadMessages();

    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Get current user
  const getCurrentUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  };

  // Send text message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userId = await getCurrentUserId();
    if (!userId) return alert("Not logged in");

    const newMessage = { user_id: userId, type: "text" as const, content: input.trim() };
    await supabase.from("messages").insert(newMessage);
    setInput("");
  };

  // Send image
  const sendImage = async (file: File) => {
    const userId = await getCurrentUserId();
    if (!userId) return alert("Not logged in");

    const fileName = `${Date.now()}-${file.name}`;
    await supabase.storage.from("chat-uploads").upload(fileName, file);

    const publicUrl = supabase.storage.from("chat-uploads").getPublicUrl(fileName).data.publicUrl;

    await supabase.from("messages").insert({
      user_id: userId,
      type: "image",
      content: publicUrl,
    });
  };

  // Send audio
  const sendAudio = async (blob: Blob) => {
    const userId = await getCurrentUserId();
    if (!userId) return alert("Not logged in");

    const fileName = `voice-${Date.now()}.webm`;
    await supabase.storage.from("chat-uploads").upload(fileName, blob);

    const publicUrl = supabase.storage.from("chat-uploads").getPublicUrl(fileName).data.publicUrl;

    await supabase.from("messages").insert({
      user_id: userId,
      type: "audio",
      content: publicUrl,
    });
  };

  // Start recording audio
  const startRecording = async () => {
    if (recording) return;
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
    const chunks: Blob[] = [];

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    source.connect(analyser);

    const recorder = new MediaRecorder(stream, { mimeType });
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: mimeType });
      await sendAudio(blob);

      stream.getTracks().forEach((t) => t.stop());
      setRecording(false);
      cancelAnimationFrame(animationRef.current!);
      setLiveAudioData([]);
    };

    recorder.start();
    setMediaRecorder(recorder);

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      setLiveAudioData([...dataArrayRef.current]);
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const stopRecording = () => mediaRecorder?.stop();

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-black">
      {/* Header */}
      <div className="p-4 bg-[#111827] text-white font-semibold">FuelSmart Group Chat</div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 bg-white rounded shadow max-w-xs">
            {msg.type === "text" && <p>{msg.content}</p>}
            {msg.type === "image" && <img src={msg.content} className="rounded-xl w-48" />}
            {msg.type === "audio" && <audio controls src={msg.content}></audio>}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex items-center gap-2 relative">
        <button onClick={() => setAttachmentOpen((x) => !x)} className="text-2xl">
          📎
        </button>

        {attachmentOpen && (
          <div className="absolute bottom-14 left-4 bg-white border shadow rounded-xl p-2 flex flex-col gap-2">
            <label className="px-3 py-1 hover:bg-gray-100 rounded cursor-pointer">
              📷 Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) sendImage(file);
                }}
              />
            </label>

            {!recording ? (
              <button
                className="px-3 py-1 hover:bg-gray-100 rounded"
                onClick={startRecording}
              >
                🎤 Start Recording
              </button>
            ) : (
              <button
                className="px-3 py-1 bg-red-200 rounded"
                onClick={stopRecording}
              >
                ⏹ Stop Recording
              </button>
            )}
          </div>
        )}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 border rounded-xl placeholder-gray-600"
          placeholder="Type a message..."
        />

        <button onClick={sendMessage} className="px-5 py-2 bg-black text-white rounded-xl">
          Send
        </button>
      </div>
    </div>
  );
}
