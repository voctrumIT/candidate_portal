"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

export default function SalesHeroSection() {
  return (
    <section className="bg-white px-1.5 py-3 sm:px-2">
      <div className="relative mx-auto min-h-[760px] max-w-[1582px] overflow-hidden rounded-[28px] border border-[#d6defd] px-5 pt-24 sm:rounded-[30px] sm:px-9">
        <Image src="/SalesBgImg.png" alt="" fill priority className="pointer-events-none object-cover object-center" sizes="100vw" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-white via-white/60 to-transparent" />

        {/* Hero text */}
        <div className="relative z-10 mx-auto flex max-w-[760px] flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-[10px] font-medium text-white shadow-[0_12px_28px_rgba(63,108,255,0.24)]"
          >
            Sales Management
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.58, delay: 0.16 }}
            className="mt-5 max-w-[700px] text-[36px] font-bold leading-[1.05] text-[#172283] sm:text-[48px] lg:text-[58px]"
          >
            Manage Every Sale
            <br />
            <TypewriterEffect blur words={[{ text: "  From Lead To"}, {text:"Payment", className: "text-[#456cff]" }]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, delay: 0.24 }}
            className="mt-3 max-w-[460px] text-[13px] leading-snug text-[#5565a0] sm:text-sm"
          >
            Track customers, opportunities, quotations, orders, invoices, and revenue from one connected sales platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, delay: 0.32 }}
            className="mt-5"
          >
            <Link
              href="#features"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#456cff] px-2 pl-4 text-xs font-semibold text-white shadow-[0_14px_30px_rgba(69,108,255,0.32)] transition-transform hover:scale-[1.03]"
            >
              Explore Sales
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#456cff]">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Bottom area */}
        <motion.div
          initial={{ opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.38 }}
          className="absolute inset-x-0 bottom-0 z-[2] mx-auto h-[388px] max-w-[1050px]"
        >
          {/* Center phone */}
          <div className="absolute inset-x-0 bottom-0 mx-auto h-[496px] w-[315px] sm:w-[380px]">
            <div className="absolute inset-x-[14px] bottom-0 top-[130px] rounded-t-[36px] bg-[#edf2f8] sm:inset-x-[18px] sm:top-[142px] sm:rounded-t-[44px]" />
            <Image src="/CrmHeroSectionImg.png" alt="Sales mobile workspace" fill priority className="object-contain object-bottom" sizes="(max-width: 640px) 320px, 395px" />
            <Image src="/CrmHeroSectionBar.png" alt="" width={280} height={28} className="absolute left-1/2 top-[142px] z-10 h-auto w-[224px] -translate-x-1/2 sm:top-[155px] sm:w-[270px]" />
            <Image src="/SalesIcon1.svg" alt="" width={300} height={300} className="absolute left-1/2 top-[220px] z-20 h-[180px] w-[180px] -translate-x-1/2 sm:top-[240px]" />
          </div>

          {/* Leads card — left */}
          <motion.div
            initial={{ opacity: 0, x: -34 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.58, delay: 0.54 }}
            className="absolute left-[90px] top-[100px] w-[300px] rounded-[22px] bg-white/95 px-5 py-4 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-bold text-[#172283]">Leads</p>
              <p className="text-[9px] text-[#9ca8cc]">Today · 0 new</p>
            </div>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#9ca8cc]">Lead Sources</p>
            <div className="flex items-center gap-4">
              {/* Filled pie chart */}
              <svg viewBox="0 0 100 100" className="h-[90px] w-[90px] shrink-0">
                {/* Website 42% — blue, top-right */}
                <path d="M50,50 L50,5 A45,45 0 0,1 95,50 Z" fill="#456cff" />
                {/* Email 20% — green */}
                <path d="M50,50 L95,50 A45,45 0 0,1 63.5,91.5 Z" fill="#22c55e" />
                {/* Referral 25% — amber */}
                <path d="M50,50 L63.5,91.5 A45,45 0 0,1 5,50 Z" fill="#f59e0b" />
                {/* Social 13% — purple */}
                <path d="M50,50 L5,50 A45,45 0 0,1 50,5 Z" fill="#a78bfa" />
              </svg>
              <div className="space-y-1.5">
                {[["Website", "42%", "#456cff"], ["Email", "20%", "#22c55e"], ["Referral", "25%", "#f59e0b"], ["Social", "13%", "#a78bfa"]].map(([label, pct, color]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                    <span className="text-[9px] text-[#9ca8cc]">{label}</span>
                    <span className="ml-auto text-[9px] font-bold text-[#172283]">{pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 border-t border-[#edf0f6] pt-2">
              <div className="mb-2 flex gap-3">
                <span className="border-b-2 border-[#456cff] pb-1 text-[9px] font-bold text-[#456cff]">Hot Leads</span>
                <span className="pb-1 text-[9px] text-[#9ca8cc]">Unassigned</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#456cff] text-[9px] font-bold text-white">JD</span>
                <div>
                  <p className="text-[10px] font-bold text-[#172283]">John Doe</p>
                  <p className="text-[8px] text-[#9ca8cc]">Joute · Email</p>
                </div>
                <span className="ml-auto text-[10px] font-bold text-[#172283]">$5,000</span>
              </div>
            </div>
          </motion.div>

          {/* Sales Overview card — right */}
          <motion.div
            initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.58, delay: 0.6 }}
            className="absolute right-[120px] top-[120px] z-20 w-[260px] rounded-[22px] bg-white/95 px-5 py-4 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <p className="mb-3 text-[11px] font-bold text-[#172283]">Sales Overview</p>
            <div className="flex gap-3">
              {/* Y-axis */}
              <div className="flex flex-col justify-between pb-4 text-right">
                {["1400", "1050", "700", "350", "0"].map((v) => (
                  <span key={v} className="text-[7px] text-[#9ca8cc]">{v}</span>
                ))}
              </div>
              {/* Bars */}
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-end justify-between gap-1.5 h-[160px]">
                  {[
                    { h: 28, label: "JAN" }, { h: 50, label: "FEB" }, { h: 35, label: "MAR" },
                    { h: 80, label: "APR" }, { h: 68, label: "MAY" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex flex-1 flex-col items-center gap-1">
                      <div className="w-full rounded-t-[3px] bg-[#456cff]" style={{ height: `${bar.h}px` }} />
                      <span className="text-[7px] text-[#9ca8cc]">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
