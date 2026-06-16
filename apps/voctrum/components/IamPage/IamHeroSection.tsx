"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

const userTypes = [
  { label: "Employees", count: 63, pct: "75%", color: "#456cff" },
  { label: "Managers", count: 25, pct: "40%", color: "#456cff" },
  { label: "Admins", count: 25, pct: "38%", color: "#8faeff" },
  { label: "External Vendors", count: 63, pct: "75%", color: "#172283" },
]

export default function IamHeroSection() {
  return (
    <section className="bg-white px-1.5 py-3 sm:px-2">
      <div className="relative mx-auto min-h-[760px] max-w-[1582px] overflow-hidden rounded-[28px] border border-[#d6defd] px-5 pt-24 sm:rounded-[30px] sm:px-9">
        <Image src="/IamBgImg.png" alt="" fill priority className="pointer-events-none object-cover object-center" sizes="100vw" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-white via-white/60 to-transparent" />

        {/* Hero text */}
        <div className="relative z-10 mx-auto flex max-w-[760px] flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-[10px] font-medium text-white shadow-[0_12px_28px_rgba(63,108,255,0.24)]"
          >
            Identity &amp; Access Control
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.58, delay: 0.16 }}
            className="mt-5 max-w-[700px] text-[36px] font-bold leading-[1.05] text-[#172283] sm:text-[48px] lg:text-[58px]"
          >
            Secure Access
            <br />
            <TypewriterEffect blur words={[{ text: "Without" }, { text: "Complexity", className: "text-[#456cff]" }]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, delay: 0.24 }}
            className="mt-3 max-w-[460px] text-[13px] leading-snug text-[#5565a0] sm:text-sm"
          >
            Manage users, permissions, roles, and access policies with
            complete visibility and enterprise-grade security.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, delay: 0.32 }}
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

        {/* Bottom area */}
        <motion.div
          initial={{ opacity: 0, y: 56 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.38 }}
          className="absolute inset-x-0 bottom-0 z-[2] mx-auto h-[388px] max-w-[1050px]"
        >
          {/* Phone */}
          <div className="absolute inset-x-0 bottom-0 mx-auto h-[496px] w-[315px] sm:w-[380px]">
            <div className="absolute inset-x-[14px] bottom-0 top-[130px] rounded-t-[36px] bg-[#edf2f8] sm:inset-x-[18px] sm:top-[142px] sm:rounded-t-[44px]" />
            <Image src="/CrmHeroSectionImg.png" alt="IAM mobile workspace" fill priority className="object-contain object-bottom" sizes="(max-width: 640px) 320px, 395px" />
            <Image src="/CrmHeroSectionBar.png" alt="" width={280} height={28} className="absolute left-1/2 top-[142px] z-10 h-auto w-[224px] -translate-x-1/2 sm:top-[155px] sm:w-[270px]" />
            <Image src="/IamIcon1.svg" alt="" width={300} height={300} className="absolute left-1/2 top-[220px] z-20 h-[180px] w-[180px] -translate-x-1/2 sm:top-[240px]" />
          </div>

          {/* Users By Type — left */}
          <motion.div
            initial={{ opacity: 0, x: -34 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.58, delay: 0.54 }}
            className="absolute left-[100px] top-[110px] w-[310px] rounded-[26px] bg-white/95 px-6 py-5 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <p className="mb-5 text-[16px] font-bold text-[#172283]">Users By Type</p>
            <div className="space-y-4">
              {userTypes.map((u) => (
                <div key={u.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-[#9ca8cc]">{u.label}</span>
                    <span className="text-[11px] font-bold text-[#172283]">{u.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#eceef4]">
                    <div className="h-1.5 rounded-full" style={{ width: u.pct, backgroundColor: u.color }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* User Access Overview — right */}
          <motion.div
            initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.58, delay: 0.6 }}
            className="absolute right-[150px] top-[130px] w-[230px] rounded-[26px] bg-white/95 px-5 py-4 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <p className="mb-3 text-[15px] font-bold text-[#172283]">User Access Overview</p>
            <div className="flex items-center justify-center">
              <div className="relative h-[90px] w-[90px]">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e0e6ff" strokeWidth="6" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#456cff" strokeWidth="6" strokeDasharray="63 87.96" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#c7d4ff" strokeWidth="6" strokeDasharray="22.5 87.96" strokeDashoffset="-63" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#456cff]" />
                  <span className="text-[11px] text-[#9ca8cc]">Active</span>
                </div>
                <p className="mt-1 text-[12px] font-semibold text-[#172283]">71.5%</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c7d4ff]" />
                  <span className="text-[11px] text-[#9ca8cc]">Inactive</span>
                </div>
                <p className="mt-1 text-[12px] font-semibold text-[#172283]">25.5%</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
