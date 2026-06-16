"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

const invoiceData = [
  { label: "Paid", value: 514, color: "#22c55e" },
  { label: "Overdue", value: 234, color: "#ef4444" },
  { label: "Unpaid", value: 98, color: "#456cff" },
]

export default function AccountsHeroSection() {
  return (
    <section className="bg-white px-1.5 py-3 sm:px-2">
      <div className="relative mx-auto min-h-[760px] max-w-[1582px] overflow-hidden rounded-[28px] border border-[#d6defd] px-5 pt-24 sm:rounded-[30px] sm:px-9">
        <Image
          src="/AccountsBgImg.png"
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
            className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-[10px] font-medium text-white shadow-[0_12px_28px_rgba(63,108,255,0.24)]"
          >
            Treasury &amp; Finance
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.16 }}
            className="mt-5 max-w-[760px] text-[48px] font-bold leading-[1.05] text-[#172283] sm:text-[56px] lg:text-[64px]"
          >
            Take Control of Every
            <br />
            <TypewriterEffect blur words={[{ text: "Business" }, { text: "Transaction", className: "text-[#456cff]" }]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.24 }}
            className="mt-3 max-w-[520px] text-[13px] leading-snug text-[#5565a0] sm:text-sm"
          >
            Monitor revenue, expenses, invoices, cash flow, and profitability
            from one connected financial workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.32 }}
            className="mt-5"
          >
            <Link
              href="#features"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#456cff] px-2 pl-4 text-xs font-semibold text-white shadow-[0_14px_30px_rgba(69,108,255,0.32)] transition-transform hover:scale-[1.03]"
            >
              Explore Accounts
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
            <div className="absolute inset-x-[14px] bottom-0 top-[130px] rounded-t-[36px] bg-[#edf2f8] sm:inset-x-[18px] sm:top-[142px] sm:rounded-t-[44px]" />
            <Image
              src="/CrmHeroSectionImg.png"
              alt="Accounts mobile workspace"
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
              src="/AccountsIcon1.svg"
              alt=""
              width={300}
              height={300}
              className="absolute left-1/2 top-[195px] z-10 h-[175px] w-[175px] -translate-x-1/2 sm:top-[214px] sm:h-[210px] sm:w-[210px]"
            />
          </div>

          {/* Invoice Status card — left */}
          <motion.div
            initial={{ opacity: 0, x: -34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.54 }}
            className="absolute left-30 top-[140px] w-[280px] rounded-[22px] h-50 bg-white/95 px-5 py-4 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-[#9ca8cc]">Invoice Status</p>
            <div className="flex items-center gap-5">
              {/* Donut */}
              <div className="relative flex h-[80px] w-[80px] shrink-0 items-center justify-center">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#eef2ff" strokeWidth="5" />
                  {/* Paid ~61% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray="53.7 87.96" />
                  {/* Overdue ~28% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray="24.6 87.96" strokeDashoffset="-53.7" />
                  {/* Unpaid ~11% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#456cff" strokeWidth="5" strokeDasharray="9.7 87.96" strokeDashoffset="-78.3" />
                </svg>
                <div className="absolute text-center">
                  <p className="text-[13px] font-bold leading-none text-[#172283]">846</p>
                  <p className="text-[7px] leading-tight text-[#9ca8cc]">Total</p>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-2.5">
                {invoiceData.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
                    <div>
                      <p className="text-[9px] text-[#9ca8cc]">{item.label}</p>
                      <p className="text-[11px] font-bold text-[#172283]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Financial Overview card — right */}
          <motion.div
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.6 }}
            className="absolute right-15 top-[90px] z-20 max-md:hidden"
          >
            <Image src="/AccountsImg1.png" alt="Financial Overview" width={270} height={280} className="h-[280px] w-auto object-contain" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
