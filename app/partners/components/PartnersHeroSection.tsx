"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function PartnersHeroSection() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/partners/1.png"
          alt="Partners Hero Background"
          fill
          className="object-cover opacity-60 mix-blend-multiply dark:mix-blend-screen"
        />
        <div className="absolute inset-0 bg-slate-100/70 dark:bg-slate-900/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm mb-6 border border-slate-200 dark:border-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
          Trusted Partnerships
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
          Partnering with <span className="text-blue-600">Industry</span> Leaders
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          We&apos;re proud to collaborate with forward-thinking organizations that trust our ecosystem for workforce management, recruitment, and business growth
        </p>

        {/* Button */}
        <button className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-[#2f54eb] px-8 text-sm font-bold text-white transition hover:bg-blue-700 shadow-md">
          Partner With Us Today
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#2f54eb]">
            <ArrowRight className="h-3 w-3" />
          </div>
        </button>
      </div>
    </section>
  );
}
