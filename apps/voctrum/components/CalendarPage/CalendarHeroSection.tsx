"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

const weekDays = ["S", "M", "T", "W", "T", "F", "S"]
// May 2026 starts on Friday (index 5), 31 days
const may2026 = [
  { day: 27, faded: true }, { day: 28, faded: true }, { day: 29, faded: true }, { day: 30, faded: true }, { day: 1, faded: false }, { day: 2, faded: false }, { day: 3, faded: false },
  { day: 4, faded: false }, { day: 5, faded: false }, { day: 6, faded: false }, { day: 7, faded: false }, { day: 8, faded: false }, { day: 9, faded: false }, { day: 10, faded: false },
  { day: 11, faded: false }, { day: 12, faded: false }, { day: 13, faded: false }, { day: 14, faded: false }, { day: 15, faded: false }, { day: 16, faded: false }, { day: 17, faded: false },
  { day: 18, faded: false }, { day: 19, faded: false }, { day: 20, faded: false }, { day: 21, faded: false }, { day: 22, faded: false }, { day: 23, faded: false }, { day: 24, faded: false },
  { day: 25, faded: false }, { day: 26, faded: false }, { day: 27, faded: false }, { day: 28, faded: false }, { day: 29, faded: false }, { day: 30, faded: false }, { day: 31, faded: false },
]
const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"]

const CalendarHeroSection = () => {
  return (
    <section className="bg-white px-1.5 py-3 sm:px-2">
      <div className="relative mx-auto min-h-[760px] max-w-[1582px] overflow-hidden rounded-[28px] border border-[#c9ddff] px-5 pt-[92px] shadow-[0_24px_70px_rgba(8,38,118,0.11)] sm:rounded-[30px] sm:px-9">
        <Image
          src="/CalendarBgImg.png"
          alt=""
          fill
          priority
          className="pointer-events-none object-cover object-center"
          sizes="100vw"
        />
        <div className="relative z-20 mx-auto flex max-w-[900px] flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-[10px] font-medium leading-none text-white shadow-[0_12px_28px_rgba(63,108,255,0.22)]"
          >
            Smart Schedule Management
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.16 }}
            className="mt-7 max-w-[980px] text-[34px] font-bold leading-[1.02] text-[#172283] sm:text-[42px] lg:text-[46px]"
          >
            <span className="text-[#456cff]">Organize</span> Meetings, Events &amp; Team
            <br className="hidden sm:block" />
            <TypewriterEffect blur words={[{ text: "Schedules" }, { text: "Effortlessly", className: "text-[#456cff]" }]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.24 }}
            className="mt-3 max-w-[440px] text-[12px] leading-snug text-[#6d7fc4] sm:text-[13px]"
          >
            Manage business schedules, appointments, events, and team coordination from one centralized calendar system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.32 }}
            className="relative z-30 mt-6"
          >
            <Link
              href="#features"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[linear-gradient(90deg,#2aa8f5,#09268f)] pl-4 pr-1 text-xs font-semibold text-white shadow-[0_14px_30px_rgba(28,99,213,0.22)] transition-transform hover:scale-[1.03]"
            >
              Start Scheduling
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#09268f]">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.7} />
              </span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.4 }}
          className="absolute inset-x-0 bottom-[1px] z-10 mx-auto h-[420px] max-w-[780px]"
        >
          <div className="absolute inset-x-0 bottom-0 z-0 mx-auto h-[430px] w-[315px] sm:w-[355px]">
            <div className="absolute inset-x-[44px] bottom-0 top-[86px] z-0 rounded-[38px] bg-[#f8fbff] sm:inset-x-[19px] sm:top-[110px]" />
            <Image
              src="/CrmHeroSectionImg.png"
              alt="Voctrum calendar mobile workspace"
              fill
              priority
              className="z-10 object-contain object-bottom"
              sizes="(max-width: 640px) 315px, 355px"
            />
            <Image
              src="/CrmHeroSectionBar.png"
              alt=""
              width={280}
              height={28}
              className="absolute left-1/2 top-[54px] z-20 h-auto w-[224px] -translate-x-1/2 sm:top-[108px] sm:w-[300px]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.56 }}
            className="absolute -left-5 top-[140px] z-20 w-[285px] overflow-hidden rounded-[22px] bg-white/96 shadow-[0_30px_70px_rgba(42,71,146,0.18)] backdrop-blur-md"
          >
            <ScheduleBoard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.58, delay: 0.62 }}
            className="absolute left-1/2 top-[154px] z-30 h-[170px] w-[170px] -translate-x-1/2 sm:h-[220px] sm:w-[220px]"
          >
            <Image src="/CalendarIcon1.svg" alt="" width={300} height={300} className="h-full w-full drop-shadow-[0_30px_72px_rgba(40,74,154,0.14)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="absolute -right-10 top-[142px] z-20 w-[305px] rounded-[22px] bg-white/96 p-4 shadow-[0_30px_70px_rgba(42,71,146,0.18)] backdrop-blur-md"
          >
            <DatePickerCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const ScheduleBoard = () => (
  <div className="p-3">
    <div className="mb-2 flex items-center gap-1.5">
      <span className="rounded-full bg-[#456cff] px-2.5 py-0.5 text-[8px] font-semibold text-white">Calendar</span>
      <span className="text-[8px] font-semibold text-[#456cff]">Schedule &amp; Event Management</span>
      <span className="grid h-3 w-3 place-items-center rounded-full border border-[#9cb2ff] text-[8px] font-bold text-[#456cff]">i</span>
    </div>

    <div className="mb-2 flex items-center gap-1.5">
      <span className="rounded-md border border-[#dfe5f3] px-1.5 py-0.5 text-[8px] font-medium text-[#52617c]">May 2026</span>
      <span className="rounded-md bg-[#456cff] px-1.5 py-0.5 text-[8px] font-semibold text-white">24h</span>
      <span className="rounded-md border border-[#dfe5f3] px-1.5 py-0.5 text-[8px] font-medium text-[#52617c]">12h</span>
      <span className="rounded-md bg-[#456cff] px-2 py-0.5 text-[8px] font-semibold text-white">Today</span>
      <span className="text-[10px] font-bold text-[#9aa6bf]">&lt;</span>
      <span className="text-[10px] font-bold text-[#9aa6bf]">&gt;</span>
    </div>

    <div className="grid grid-cols-[40px_repeat(4,1fr)] border-t border-l border-[#e8edf6] text-[8px] text-[#8a96ad]">
      <div className="border-r border-b border-[#e8edf6] bg-[#fbfcff] p-1.5" />
      {["10", "11", "12", "13"].map((day) => (
        <div key={day} className="border-r border-b border-[#e8edf6] bg-[#fbfcff] p-1.5 text-center">
          <p className="font-bold text-[#404a60]">{day}</p>
          <p className="mt-0.5 text-[7px]">MON</p>
        </div>
      ))}

      {["00:00", "04:00", "08:00"].map((time, row) => (
        <div key={time} className="contents">
          <div className="h-11 border-r border-b border-[#e8edf6] p-2 text-[7px]">
            {time}
          </div>
          {Array.from({ length: 4 }, (_, column) => (
            <div key={`${time}-${column}`} className="relative h-11 border-r border-b border-[#e8edf6] bg-white">
              {row === 1 && column === 2 ? (
                <span className="absolute left-1 right-1 top-1 rounded-sm bg-[#456cff] px-1.5 py-0.5 text-[7px] font-semibold text-white">
                  Review meeting
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)

const DatePickerCard = () => (
  <div className="grid grid-cols-[1fr_120px] gap-5">
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-[#26314a]">May 2026</p>
        <span className="text-xs text-[#9aa6bf]">&#8249; &#8250;</span>
      </div>

      <div className="grid grid-cols-7 gap-x-2 gap-y-1 text-center text-[8px] font-bold text-[#66748c]">
        {weekDays.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
        {may2026.map((item, index) => (
          <span
            key={index}
            className={`grid h-4 place-items-center rounded-full ${
              item.day === 30 && !item.faded ? "bg-[#456cff] text-white" : item.faded ? "text-[#c5ccd8]" : "text-[#67738a]"
            }`}
          >
            {item.day}
          </span>
        ))}
      </div>
    </div>

    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-[#26314a]">2026</p>
        <span className="text-xs text-[#9aa6bf]">&#8249; &#8250;</span>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-3 text-center text-[9px] font-semibold text-[#52617c]">
        {years.map((year) => (
          <span key={year} className={year === "2026" ? "rounded-md bg-[#456cff] px-2 py-0 text-white" : ""}>
            {year}
          </span>
        ))}
      </div>
    </div>
  </div>
)

export default CalendarHeroSection
