"use client";

import Image from "next/image";
import { Search } from "lucide-react";

export default function BlogHeroSection() {
  return (
    <section className="relative pt-32 pb-32 lg:pt-40 lg:pb-40 flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/blogs/9df26d4c5c103bc41973cf95846c0b69a2b3c093.jpg"
          alt="Blog Hero Background"
          fill
          className="object-cover opacity-30 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
          priority
        />
        <div className="absolute inset-0 bg-slate-100/60 dark:bg-slate-900/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-blue-900 dark:text-blue-300 shadow-sm mb-6">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          Our Blog
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
          <span className="text-blue-600">Insights</span> That Help You Grow Professionally
        </h1>

        {/* Subtitle */}
        <p className="text-[15px] md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Explore expert advice, industry trends, career guidance, and practical resources designed to support your professional journey
        </p>

        {/* Search Bar */}
        <div className="mx-auto max-w-2xl flex items-center rounded-xl bg-white dark:bg-slate-800 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700">
          <div className="flex flex-1 items-center px-4">
            <input
              type="text"
              placeholder="Search articles, guides, and resources..."
              className="w-full bg-transparent text-[15px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
          <button className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Floating Stats Ribbon */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-[900px] px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 rounded-xl bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 dark:border-slate-700 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
          
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">50+ Articles</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant assistance whenever you need</p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">10+ Categories</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Helping users find solutions every day</p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Weekly Updates</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Trusted by job seekers and employers alike</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
