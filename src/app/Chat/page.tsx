"use client";

import React, { useState, useRef, useEffect } from "react";

type Message = {
  text?: string;
  sender: string;
  time: string;
  avatar: string;
  reaction?: string | null;
  image?: string;
  audio?: string;
};

const REACTIONS = ["❤️", "👍", "👎", "😂", "❗", "❓"];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [openPickerFor, setOpenPickerFor] = useState<number | null>(null);
  const [attachmentOpen, setAttachmentOpen] = useState(false);

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [liveAudioData, setLiveAudioData] = useState<number[]>([]);

  const pickerTimeouts = useRef<Record<number, number>>({});
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number | null>(null);

  const formatTime = () => {
    const date = new Date();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const sendMessage = (extra?: { image?: string; audio?: string }) => {
    if (!input.trim() && !extra?.image && !extra?.audio) return;

    setMessages((prev) => [
      ...prev,
      {
        text: input || undefined,
        sender: "You",
        time: formatTime(),
        avatar: "/avatar-you.png",
        reaction: null,
        ...extra,
      },
    ]);

    setInput("");
    setIsTyping(false);
    setAttachmentOpen(false);
    scrollToBottom();
  };

  const handleTyping = (value: string) => {
    setInput(value);
    setIsTyping(value.length > 0);
  };

  const toggleReaction = (index: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((m, i) =>
        i === index ? { ...m, reaction: m.reaction === emoji ? null : emoji } : m
      )
    );
    setOpenPickerFor(null);
  };

  const onPickerButtonClick = (index: number) => {
    setOpenPickerFor((cur) => (cur === index ? null : index));
  };

  const handlePointerDown = (index: number) => {
    const id = window.setTimeout(() => setOpenPickerFor(index), 400);
    pickerTimeouts.current[index] = id;
  };

  const handlePointerUpOrLeave = (index: number) => {
    const id = pickerTimeouts.current[index];
    if (id) {
      clearTimeout(id);
      delete pickerTimeouts.current[index];
    }
  };

  const startRecording = async () => {
    if (recording) return;
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    source.connect(analyser);

    const recorder = new MediaRecorder(stream);
    setAudioChunks([]);
    recorder.ondataavailable = (e) => setAudioChunks((prev) => [...prev, e.data]);
    recorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: "audio/webm" });
      const audioURL = URL.createObjectURL(blob);
      sendMessage({ audio: audioURL });
      stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
      cancelAnimationFrame(animationRef.current!);
      setLiveAudioData([]);
    };
    recorder.start();
    setMediaRecorder(recorder);

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      setLiveAudioData(Array.from(dataArrayRef.current));
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
  };

  useEffect(() => scrollToBottom(), []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-reaction-picker]") &&
        !target.closest("[data-reaction-btn]") &&
        !target.closest("[data-attachment]") &&
        !target.closest("[data-attachment-btn]")
      ) {
        setOpenPickerFor(null);
        setAttachmentOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const renderWaveform = (data: number[], width = 100, height = 20) => {
    return (
      <svg width={width} height={height} className="rounded-lg bg-blue-100">
        {data.map((v, i) => {
          const barHeight = (v / 255) * height;
          const x = (i / data.length) * width;
          return (
            <rect
              key={i}
              x={x}
              y={height - barHeight}
              width={width / data.length}
              height={barHeight}
              fill="#2563eb"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* HEADER */}
      <div className="p-4 bg-[#111827] text-white text-lg font-semibold">
        FuelSmart Group Chat
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`relative flex items-start gap-3 ${
              msg.sender === "You" ? "flex-row-reverse" : ""
            }`}
            onPointerDown={() => handlePointerDown(index)}
            onPointerUp={() => handlePointerUpOrLeave(index)}
            onPointerLeave={() => handlePointerUpOrLeave(index)}
          >
            {/* Avatar */}
            <img src={msg.avatar} className="w-10 h-10 rounded-full object-cover" />

            {/* Message bubble */}
            <div
              className={`max-w-[75%] p-3 rounded-xl shadow-md text-black ${
                msg.sender === "You" ? "bg-[#e5e7eb]" : "bg-white"
              }`}
            >
              {msg.sender && <p className="text-xs opacity-60 mb-1">{msg.sender}</p>}
              {msg.text && <p className="font-medium break-words">{msg.text}</p>}
              {msg.image && <img src={msg.image} alt="sent" className="mt-2 rounded-lg max-w-full h-auto" />}
              {msg.audio && renderWaveform(new Array(50).fill(100)) /* static waveform */}
              {recording && renderWaveform(liveAudioData)} {/* live waveform while recording */}
              <p className="text-[10px] mt-1 text-gray-600">{msg.time}</p>
            </div>

            {/* Reaction sticker */}
            {msg.reaction && (
              <div
                className={`absolute ${
                  msg.sender === "You" ? "right-[56px]" : "left-[56px]"
                } -top-2 z-30`}
              >
                <div className="inline-flex items-center justify-center px-2 py-1 rounded-full shadow-md bg-white text-sm animate-pop">
                  <span className="text-[14px]">{msg.reaction}</span>
                </div>
              </div>
            )}

            {/* Reaction button */}
            <button
              data-reaction-btn
              onClick={(e) => {
                e.stopPropagation();
                onPickerButtonClick(index);
              }}
              className="z-10 w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="React"
            >
              <span className="text-lg select-none">😊</span>
            </button>

            {/* Reaction picker */}
            {openPickerFor === index && (
              <div
                data-reaction-picker
                className={`absolute ${msg.sender === "You" ? "right-10" : "left-10"} top-0 z-20`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-2 p-2 bg-white rounded-2xl shadow-xl border">
                  {REACTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => toggleReaction(index, r)}
                      className={`text-lg px-2 py-1 rounded-lg transform transition-transform hover:-translate-y-1 active:scale-95 ${
                        messages[index].reaction === r ? "ring-2 ring-offset-1 ring-gray-300" : ""
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="bg-white px-4 py-2 rounded-xl shadow text-sm">typing...</div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white flex gap-2 items-center border-t relative">
        {/* Attachment button */}
        <button
          data-attachment-btn
          className="text-2xl"
          onClick={(e) => {
            e.stopPropagation();
            setAttachmentOpen((cur) => !cur);
          }}
        >
          📎
        </button>

        {/* Attachment popover */}
        {attachmentOpen && (
          <div
            data-attachment
            className="absolute bottom-14 left-4 flex flex-col bg-white shadow-lg rounded-xl border p-2 gap-2"
          >
            {/* Image */}
            <label className="cursor-pointer px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-1">
              📷 Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) sendMessage({ image: URL.createObjectURL(file) });
                }}
              />
            </label>
            {/* Voice note */}
            {!recording ? (
              <button
                className="px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-1"
                onClick={startRecording}
              >
                🎤 Start Recording
              </button>
            ) : (
              <button
                className="px-3 py-1 rounded bg-red-200 flex items-center gap-1"
                onClick={stopRecording}
              >
                ⏹ Stop Recording
              </button>
            )}
          </div>
        )}

        {/* Text input */}
        <input
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-xl focus:outline-none"
        />

        {/* Send button */}
        <button onClick={() => sendMessage()} className="px-5 py-2 bg-[#111827] text-white rounded-xl">
          Send
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: popIn 180ms ease-out;
        }
      `}</style>
    </div>
  );
}
