"use client";

import { Search } from "lucide-react";
import Image from "next/image";

export default function HelpHeroSection() {
  return (
    <section className="relative pt-24 pb-0 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Background Image (you can replace with an actual image in your public folder) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/helpcentre/1.png" 
          alt="Hero Background"
          fill
          className="object-cover opacity-10 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
        />
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-blue-900 dark:text-blue-300 shadow-sm mb-6">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          Help Center
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
          How Can We <span className="text-blue-600">Help</span> You Today?
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-2">
          Find answers, explore helpful resources, and get support for your job search or hiring needs.
        </p>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          Browse our knowledge base or chat with our AI Assistant for instant guidance.
        </p>

        {/* Search Bar */}
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-lg bg-white dark:bg-slate-800 p-2 shadow-lg dark:border dark:border-slate-700">
          <input
            type="text"
            placeholder="Ask anything about jobs, applications, or hiring..."
            className="flex-1 bg-transparent px-4 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
          />
          <button className="flex h-10 w-12 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="relative z-10 mt-16 border-t border-b border-white/40 dark:border-slate-700/50 bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="mx-auto max-w-[1300px] px-5 py-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="pt-4 md:pt-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">24/7 AI Support</h3>
              <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-400">Instant assistance whenever you need</p>
            </div>
            
            <div className="pt-4 md:pt-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">50K+ Questions Answered</h3>
              <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-400">Helping users find solutions every day</p>
            </div>
            
            <div className="pt-4 md:pt-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">98% Satisfaction Rate</h3>
              <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-400">Trusted by job seekers and employers alike</p>
            </div>
            
            <div className="pt-4 md:pt-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">3s Response Time</h3>
              <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-400">Get answers without the wait</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
