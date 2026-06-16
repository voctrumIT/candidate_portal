"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function TicketingHeroSection() {
  return (
    <section className="bg-white px-1.5 py-3 sm:px-2">
      <div
        className="relative mx-auto min-h-[760px] max-w-[1582px] overflow-hidden rounded-[28px] border border-[#d6defd] px-5 pt-24 sm:rounded-[30px] sm:px-9"
      >
        <Image
          src="/TicketingBgImg.png"
          alt=""
          fill
          priority
          className="pointer-events-none object-cover object-center"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-white via-white/60 to-transparent" />

        {/* Hero text */}
        <div className="relative z-10 mx-auto flex max-w-[760px] flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-[10px] font-medium text-white shadow-[0_12px_28px_rgba(69,108,255,0.24)]"
          >
            Support & Issue Management
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.16 }}
            className="mt-5 max-w-[700px] text-[36px] font-bold leading-[1.05] text-[#172283] sm:text-[48px] lg:text-[58px]"
          >
            <span className="text-[#456cff]">Resolve</span> Every
            <br />
            <TypewriterEffect blur words={[{ text: "Request" }, { text: "with" }, { text: "Clarity" }]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.24 }}
            className="mt-3 max-w-[460px] text-[13px] leading-snug text-[#5565a0] sm:text-sm"
          >
            Manage tickets, track issues, and deliver faster support with
            a structured and fully connected system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.32 }}
            className="mt-5"
          >
            <Link
              href="/products/register"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#456cff] px-2 pl-4 text-xs font-semibold text-white shadow-[0_14px_30px_rgba(69,108,255,0.32)] transition-transform hover:scale-[1.03]"
            >
              Get Started
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#456cff]">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Bottom cards + phone */}
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38 }}
          className="absolute inset-x-0 bottom-0 z-[2] mx-auto h-[388px] max-w-[1050px]"
        >
          {/* Center phone */}
          <div className="absolute inset-x-0 bottom-0 mx-auto h-[496px] w-[315px] sm:w-[380px]">
            <div className="absolute inset-x-[14px] bottom-0 top-[130px] rounded-t-[36px] bg-[#ede8f8] sm:inset-x-[18px] sm:top-[142px] sm:rounded-t-[44px]" />
            <Image
              src="/CrmHeroSectionImg.png"
              alt="Ticketing mobile workspace"
              fill
              priority
              className="object-contain object-bottom"
              sizes="(max-width: 640px) 320px, 395px"
            />
            <Image
              src="/CrmHeroSectionBar.png"
              alt=""
              width={280}
              height={28}
              className="absolute left-1/2 top-[142px] z-10 h-auto w-[224px] -translate-x-1/2 sm:top-[155px] sm:w-[270px]"
            />
            <Image
              src="/TicketingIcon1.svg"
              alt=""
              width={300}
              height={300}
              className="absolute left-1/2 top-[195px] z-10 h-[175px] w-[175px] -translate-x-1/2 sm:top-[214px] sm:h-[210px] sm:w-[210px]"
            />
          </div>

          {/* Performance Trends card — left */}
          <motion.div
            initial={{ opacity: 0, x: -34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.54 }}
            className="absolute left-20 top-[100px] w-[320px] rounded-[26px] bg-white/95 px-5 py-4 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-[#172283]">Performance Trends</p>
              <span className="flex items-center gap-1 rounded-lg border border-[#e0e4f0] px-2 py-1 text-[9px] text-[#8b95ad]">
                Select Year ▾
              </span>
            </div>
            <div className="mb-2 flex items-center gap-3 text-[9px] text-[#8b95ad]">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#456cff]" />Created</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />Resolved</span>
            </div>
            {/* Simple line chart */}
            <div className="flex gap-2">
              <div className="flex flex-col justify-between pb-4 text-right">
                {["250", "200", "150", "100", "50", "0"].map((v) => (
                  <span key={v} className="text-[7px] text-[#9ca8cc]">{v}</span>
                ))}
              </div>
              <div className="flex-1">
                <svg viewBox="0 0 260 120" className="w-full" preserveAspectRatio="none">
                  <polyline points="0,100 22,70 44,85 66,30 88,52 110,22 132,45 154,30 176,15 198,45 220,22 242,60 260,38" fill="none" stroke="#456cff" strokeWidth="2" strokeLinejoin="round" />
                  <polyline points="0,108 22,85 44,95 66,60 88,75 110,57 132,72 154,57 176,42 198,75 220,57 242,82 260,63" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" strokeLinejoin="round" />
                </svg>
                <div className="mt-1 flex justify-between">
                  {months.map((m) => (
                    <span key={m} className="text-[6px] text-[#b0b8cc]">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Department Performance card — right */}
          <motion.div
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.6 }}
            className="absolute right-28 top-[150px] w-[270px] rounded-[26px] bg-white/95 px-5 py-4 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <p className="mb-3 text-sm font-bold text-[#172283]">Department Performance</p>
            <div className="rounded-xl border-l-4 border-[#7c3aed] pl-3">
              <p className="text-[10px] text-[#8b95ad]">All Tickets</p>
              <p className="text-[22px] font-bold text-[#172283]">1,245</p>
              <p className="mt-1 text-[10px] font-semibold text-[#22c55e]">+6% vs last week</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
