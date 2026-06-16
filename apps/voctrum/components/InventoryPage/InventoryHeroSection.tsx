"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

const topProducts = [
  { name: "Laptop Pro 14", category: "Electronics", stock: 120 },
  { name: "Wireless Headphones", category: "Electronics", stock: 98 },
  { name: "Smart Watch X", category: "Electronics", stock: 75 },
  { name: "Keyboard Mechanical", category: "Accessories", stock: 60 },
  { name: "Gaming Mouse", category: "Accessories", stock: 45 },
]

const categories = [
  { label: "Electronics", color: "#456cff", pct: "60%", count: 6 },
  { label: "Accessories", color: "#a78bfa", pct: "25%", count: 4 },
  { label: "Peripherals", color: "#34d399", pct: "20%", count: 3 },
  { label: "Storage", color: "#fbbf24", pct: "10%", count: 2 },
  { label: "Others", color: "#f87171", pct: "5%", count: 1 },
]

export default function InventoryHeroSection() {
  return (
    <section className="bg-white px-1.5 py-3 sm:px-2">
      <div
        className="relative mx-auto min-h-[760px] max-w-[1582px] overflow-hidden rounded-[28px] border border-[#d6defd] px-5 pt-24 sm:rounded-[30px] sm:px-9"
      >
        <Image
          src="/InventoryBgImg.png"
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
            Smart Asset Management
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.16 }}
            className="mt-5 max-w-[760px] text-[48px] font-bold leading-[1.05] text-[#172283] sm:text-[56px] lg:text-[64px]"
          >
            Track Every Asset With
            <br />
            <TypewriterEffect blur words={[{ text: "Complete" }, { text: "Control", className: "text-[#456cff]" }]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.24 }}
            className="mt-3 max-w-[600px] text-[13px] leading-snug text-[#5565a0] sm:text-sm"
          >
            Manage inventory, monitor stock movement, track warehouse activity, and maintain
            complete visibility across your business assets in one centralised system.
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
              Explore Features
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
            <div className="absolute inset-x-[14px] bottom-0 top-[130px] rounded-t-[36px] bg-transparent sm:inset-x-[18px] sm:top-[142px] sm:rounded-t-[44px]" />
            <Image
              src="/CrmHeroSectionImg.png"
              alt="Inventory mobile workspace"
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
              src="/InventoryIcon1.svg"
              alt=""
              width={300}
              height={300}
              className="absolute left-1/2 top-[195px] z-10 h-[175px] w-[175px] -translate-x-1/2 sm:top-[214px] sm:h-[210px] sm:w-[210px]"
            />
          </div>

          {/* Top Products card — left */}
          <motion.div
            initial={{ opacity: 0, x: -34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.54 }}
            className="absolute left-25 top-[100px] w-[300px] rounded-[22px] bg-white/95 px-5 py-4 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-[#9ca8cc]">Top Products</p>
            <div className="space-y-2.5">
              {topProducts.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="h-7 w-7 shrink-0 rounded-lg bg-[#eef2ff]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-[#172283]">{p.name}</p>
                    <p className="text-[9px] text-[#9ca8cc]">{p.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-[#456cff]">{p.stock}</p>
                    <p className="text-[9px] text-[#22c55e]">In Stock</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-[#456cff]">
              View All Products <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>

          {/* Category Breakdown card — right */}
          <motion.div
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.6 }}
            className="absolute right-30 top-[130px] w-[270px] rounded-[22px] bg-white/95 px-5 py-9 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#9ca8cc]">Category Breakdown</p>
            <div className="flex items-center gap-4">
              {/* Donut */}
              <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#eef2ff" strokeWidth="5" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#456cff" strokeWidth="5" strokeDasharray="52.7 87.96" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#a78bfa" strokeWidth="5" strokeDasharray="22 87.96" strokeDashoffset="-52.7" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#34d399" strokeWidth="5" strokeDasharray="17.6 87.96" strokeDashoffset="-74.7" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#fbbf24" strokeWidth="5" strokeDasharray="8.8 87.96" strokeDashoffset="-92.3" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f87171" strokeWidth="5" strokeDasharray="4.4 87.96" strokeDashoffset="-101.1" />
                </svg>
                <div className="absolute text-center">
                  <p className="text-[13px] font-bold leading-none text-[#172283]">16</p>
                  <p className="text-[7px] leading-tight text-[#9ca8cc]">Total<br />Products</p>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-1.5">
                {categories.map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.color }} />
                    <span className="text-[9px] text-[#6878bb]">{c.label}</span>
                    <span className="ml-auto pl-2 text-[9px] font-semibold text-[#172283]">{c.pct} ({c.count})</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-[#456cff]">
              View All Categories <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
