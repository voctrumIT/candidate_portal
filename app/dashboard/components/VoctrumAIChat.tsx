"use client";

import { X, Send } from "lucide-react";
import Image from "next/image";

interface VoctrumAIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const chatMessages = [
  {
    id: 1,
    sender: "Hidayat ali",
    avatar: "/homepage/people3.png", // Using a dummy image, will fallback to a default styling if not found
    time: "March 8, 2025 13:40:30",
    text: "Can you help me improve my resume for a Data Scientist role?",
    isBot: false,
    dayText: "1 day ago",
  },
  {
    id: 2,
    sender: "Voctrum AI",
    avatar: "/common/logo.png",
    time: "March 8, 2025 13:40:30",
    text: "Absolutely! Please upload your current resume, and I'll analyze it to suggest improvements tailored for a Data Scientist position.",
    isBot: true,
    dayText: "1 day ago",
  },
  {
    id: 3,
    sender: "Hidayat ali",
    avatar: "/homepage/people3.png",
    time: "March 8, 2025 13:40:30",
    text: "Here is my resume. I want to highlight my machine learning projects.",
    isBot: false,
    dayText: "1 day ago",
  },
  {
    id: 4,
    sender: "Voctrum AI",
    avatar: "/common/logo.png",
    time: "March 8, 2025 13:40:30",
    text: "Got it. I'll make sure to emphasize your ML projects. Adding specific metrics and outcomes to your project descriptions will make a huge difference.",
    isBot: true,
    dayText: "",
  },
];

export default function VoctrumAIChat({ isOpen, onClose }: VoctrumAIChatProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-1/2 flex-col rounded-l-[40px] bg-white dark:bg-[#1a1a1a] shadow-2xl animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-10 py-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Voctrum AI</h2>
            <p className="mt-1 text-sm text-slate-400">Your smart assistant for jobs and career support</p>
          </div>
          <button 
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2f54eb] text-white transition hover:bg-[#2447d8]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-10 py-6 scrollbar-hide">
          <div className="flex flex-col gap-6">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full flex-col ${msg.isBot ? "items-start" : "items-end"}`}
              >
                {/* Sender Info */}
                <div className={`flex items-center gap-3 ${msg.isBot ? "flex-row" : "flex-row-reverse"}`}>
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#eef2ff] shadow-sm">
                    {msg.isBot ? (
                      <div className="flex h-full w-full items-center justify-center bg-[#f0f4ff] font-bold text-[#2f54eb] text-xs">AI</div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-200 font-bold text-slate-600 text-sm">HA</div>
                    )}
                  </div>
                  <div className={`flex flex-col ${msg.isBot ? "items-start" : "items-end"}`}>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{msg.sender}</span>
                    <span className="text-[11px] font-medium text-slate-400">{msg.time}</span>
                  </div>
                </div>

                {/* Message Bubble */}
                <div className={`mt-3 max-w-[85%] rounded-[20px] px-6 py-4 text-[15px] leading-relaxed shadow-sm ${
                  msg.isBot 
                    ? "rounded-tl-sm bg-gradient-to-br from-[#f8f9fa] to-[#eef1f6] text-slate-700 dark:text-slate-300" 
                    : "rounded-tr-sm bg-gradient-to-br from-[#f4f5f7] to-[#e2e6eb] text-slate-800"
                }`}>
                  {msg.text}
                </div>
                
                {/* Day Text below bubble (optional) */}
                {msg.dayText && (
                  <span className="mt-2 text-[11px] font-medium text-slate-400">{msg.dayText}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-100 bg-white dark:bg-[#1a1a1a] p-8 pb-10">
          <div className="relative flex items-center rounded-2xl bg-[#f4f6fc] px-4 py-3 shadow-inner">
            <input 
              type="text" 
              placeholder="Type Your Message here ......." 
              className="w-full bg-transparent px-2 py-2 text-[15px] text-slate-700 dark:text-slate-300 outline-none placeholder:text-slate-400"
            />
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2f54eb] text-white transition hover:scale-105 hover:bg-[#2447d8]">
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
