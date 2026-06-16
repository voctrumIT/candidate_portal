"use client"

import { motion } from "framer-motion"
import { ArrowRight, CalendarDays } from "lucide-react"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import Image from "next/image"
import Link from "next/link"

const HrmHeroSection = () => {
  return (
    <section className="bg-white px-1.5 py-3 sm:px-2">
      <div className="relative mx-auto min-h-[760px] max-w-[1582px] overflow-hidden rounded-[28px] border border-[#d6defd] bg-white px-5 pt-24 shadow-[0_24px_70px_rgba(234,110,0,0.11)] sm:rounded-[30px] sm:px-9">
        <Image
          src="/HrmBgImg.png"
          alt=""
          fill
          priority
          className="pointer-events-none object-cover object-center"
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto flex max-w-[760px] flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-[10px] font-medium text-white shadow-[0_12px_28px_rgba(63,108,255,0.24)]"
          >
            Human Resource Management
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.16 }}
            className="mt-5 max-w-[650px] text-[36px] font-bold leading-[1.05] text-[#172283] sm:text-[48px] lg:text-[52px]"
          >
            <span className="text-[#456cff]">Build</span> Stronger Teams
            <br />
            <TypewriterEffect blur words={[{ text: "with" }, { text: "Better" }, { text: "Visibility", className: "text-[#456cff]" }]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.24 }}
            className="mt-3 max-w-[480px] text-[13px] leading-snug text-[#7180bc] sm:text-sm"
          >
            Manage employees, attendance, recruitment, payroll, and performance from one connected HR workspace designed for growing teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.32 }}
            className="mt-5"
          >
            <Link
              href="#features"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#25b8f4] to-[#082da9] px-2 pl-4 text-xs font-semibold text-white shadow-[0_14px_30px_rgba(20,75,196,0.25)] transition-transform hover:scale-[1.03]"
            >
              Explore HRM
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0b2da9]">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
              </span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38 }}
          className="absolute inset-x-0 bottom-0 z-[2] mx-auto h-[388px] max-w-[1050px]"
        >
          <div className="absolute inset-x-0 bottom-0 mx-auto h-[496px] w-[315px] sm:w-[380px]">
            <div className="absolute inset-x-[14px] bottom-0 top-[130px] rounded-t-[36px] bg-[#edf2f8] sm:inset-x-[18px] sm:top-[142px] sm:rounded-t-[44px]" />
            <Image
              src="/CrmHeroSectionImg.png"
              alt="Voctrum HRM mobile workspace"
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
              src="/HrmHeroSectionIcon.svg"
              alt=""
              width={300}
              height={300}
              className="absolute left-1/2 top-[195px] z-10 h-[175px] w-[175px] -translate-x-1/2 sm:top-[214px] sm:h-[210px] sm:w-[210px]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.54 }}
            className="absolute left-25 top-[88px] w-[288px] rounded-[22px] bg-white/95 px-5 py-3 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1b2238]">Team Performance</h2>
              <span className="inline-flex items-center gap-1 rounded-md border border-[#cdd3df] px-2 py-0.5 text-[9px] text-[#8b95ad]">
                dd-mm-yyyy
                <CalendarDays className="h-2.5 w-2.5" />
              </span>
            </div>
            <PerformanceRow name="Irfan Yousuf" role="Software Development" team="Designers" value="90%" color="bg-[#49b95a]" />
            <PerformanceRow name="Adnan" role="RTO" team="Grammerly" value="70%" color="bg-[#e5a640]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.6 }}
            className="absolute right-15 top-[156px] w-[330px] rounded-[26px] bg-white/95 px-6 py-5 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <div className="flex items-start gap-3">
              <div className="flex -space-x-2">
                <span className="h-8 w-8 rounded-full bg-[#d99b6a]" />
                <span className="h-8 w-8 rounded-full border-2 border-white bg-[#b6c7de]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#4777ff] underline">Shafiya Hameed</p>
                <p className="mt-0.5 text-[10px] text-[#8a95ae]">Technology</p>
                <p className="text-[10px] text-[#67738d]">Mar 07-08&nbsp;&nbsp; Sick Leave</p>
                <div className="mt-3 flex gap-3">
                  <span className="rounded-md border border-[#40c96b] px-3 py-1 text-[10px] text-[#28a950]">Approved</span>
                  <span className="rounded-md border border-[#ef4b57] px-3 py-1 text-[10px] text-[#e33d48]">Rejected</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#67738d]">Status</p>
                <span className="mt-1 inline-flex rounded-md bg-[#fff1d8] px-2 py-1 text-[10px] text-[#e39a25]">Pending</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const PerformanceRow = ({
  name,
  role,
  team,
  value,
  color,
}: {
  name: string
  role: string
  team: string
  value: string
  color: string
}) => (
  <div className="mb-1.5 rounded-[14px] border border-[#d8dde8] p-2.5 last:mb-0">
    <div className="grid grid-cols-[30px_1fr_1fr] items-center gap-2">
      <span className="h-6 w-6 rounded-full bg-[#d9dee8]" />
      <div>
        <p className="text-[11px] font-bold text-[#1b2238]">Team Leader</p>
        <p className="text-[9px] text-[#8993aa]">{name}</p>
      </div>
      <div>
        <p className="text-[11px] font-bold text-[#1b2238]">Department</p>
        <p className="text-[9px] text-[#8993aa]">{role}</p>
      </div>
    </div>
    <p className="mt-1.5 text-[9px] text-[#8993aa]">{team}</p>
    <div className="mt-1 flex items-center gap-2">
      <span className="h-1.5 flex-1 rounded-full bg-[#e8e9eb]">
        <span className={`block h-1.5 rounded-full ${color}`} style={{ width: value }} />
      </span>
      <span className="text-[9px] text-[#7abf76]">{value}</span>
    </div>
  </div>
)

export default HrmHeroSection
