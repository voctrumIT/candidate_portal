"use client"

import { motion } from "framer-motion"
import { ArrowRight, FileText, Mail, Phone, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { TypewriterEffect } from "@/components/ui/typewriter-effect"

const activityItems = [
  {
    icon: Mail,
    title: "You emailed demo details to Tom H.",
    time: "10 min ago",
    className: "bg-[#dce8ff] text-[#4777ff]",
  },
  {
    icon: FileText,
    title: "Jane D. was assigned to you",
    time: "1 hr ago",
    className: "bg-[#efd9ff] text-[#b654ff]",
  },
  {
    icon: Phone,
    title: "Call with Jane D.",
    time: "1 hr ago",
    className: "bg-[#ddfbe9] text-[#28c76f]",
  },
]

const taskItems = [
  {
    icon: Phone,
    title: "Call Jane D.",
    label: "Follow Up",
    time: "10:00 AM",
    className: "bg-[#dce8ff] text-[#4777ff]",
  },
  {
    icon: FileText,
    title: "Prepare proposal for Acme Corp",
    label: "Proposal",
    time: "1:00 PM",
    className: "bg-[#ffe8d3] text-[#ff8743]",
  },
  {
    icon: Mail,
    title: "Email demo details to Tom H.",
    label: "Email",
    time: "08:30 PM",
    className: "bg-[#f2d7ff] text-[#bc4dff]",
  },
]

const CrmHeroSection = () => {
  return (
    <section className="bg-white px-1.5 py-3 sm:px-2">
      <div className="relative mx-auto min-h-[760px] max-w-[1582px] overflow-hidden rounded-[28px] border border-[#d6defd] px-5 pt-24 shadow-[0_24px_70px_rgba(69,108,255,0.12)] sm:rounded-[30px] sm:px-9">
        <Image
          src="/CrmBgImg.png"
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
            Client Relationship Management
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.16 }}
            className="mt-5 max-w-[700px] text-[40px] font-bold leading-[1.05] text-[#172283] sm:text-[52px] lg:text-[56px]"
          >
            Turn Every Relationship
            <br />
            <TypewriterEffect
              blur
              words={[
                { text: "Into" },
                { text: "Business" },
                { text: "Growth", className: "text-[#456cff]" },
              ]}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.24 }}
            className="mt-3 max-w-[410px] text-sm leading-snug text-[#7180bc]"
          >
            Manage clients, enquiries, opportunities, meetings, and follow-ups from one connected CRM workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.32 }}
            className="mt-5"
          >
            <Link
              href="#crm"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#25b8f4] to-[#082da9] px-2 pl-4 text-xs font-semibold text-white shadow-[0_14px_30px_rgba(20,75,196,0.25)] transition-transform hover:scale-[1.03]"
            >
              Explore CRM
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
          className="absolute inset-x-0 bottom-0 z-[2] mx-auto h-[368px] max-w-[920px]"
        >
          <div className="absolute inset-x-0 bottom-0 mx-auto h-[496px] w-[315px] sm:w-[380px]">
            <div className="absolute inset-x-[14px] bottom-0 top-[130px] rounded-t-[36px] bg-[#edf2f8] sm:inset-x-[18px] sm:top-[142px] sm:rounded-t-[44px]" />
            <Image
              src="/CrmHeroSectionImg.png"
              alt="Voctrum CRM mobile frame"
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
              src="/CrmHeroSectionIcon.svg"
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
            className="absolute left-[1px] top-[86px] w-[344px] rounded-[26px] bg-white/95 px-6 py-4 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <div className="mb-4 flex items-center gap-3 text-[#343c54]">
              <span className="grid grid-cols-2 gap-0.5 text-[#9ba7c7]">
                <span className="h-1 w-1 rounded-full bg-current" />
                <span className="h-1 w-1 rounded-full bg-current" />
                <span className="h-1 w-1 rounded-full bg-current" />
                <span className="h-1 w-1 rounded-full bg-current" />
              </span>
              <h2 className="text-base font-semibold">Recent Activity</h2>
            </div>

            <div className="space-y-5">
              {activityItems.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="flex gap-3">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.className}`}>
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-[#59627a]">{item.title}</p>
                      <p className="mt-1 text-xs text-[#a4aec5]">{item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.6 }}
            className="absolute right-[1px] top-[80px] w-[344px] rounded-[26px] bg-white/95 px-6 py-3 shadow-[0_28px_65px_rgba(48,73,154,0.18)] backdrop-blur-md max-md:hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#343c54]">
                <span className="grid grid-cols-2 gap-0.5 text-[#9ba7c7]">
                  <span className="h-1 w-1 rounded-full bg-current" />
                  <span className="h-1 w-1 rounded-full bg-current" />
                  <span className="h-1 w-1 rounded-full bg-current" />
                  <span className="h-1 w-1 rounded-full bg-current" />
                </span>
                <h2 className="text-base font-semibold">Tasks</h2>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#456cff]">
                <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                Add Task
              </button>
            </div>

            <p className="mb-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-[#a6afc8]">
              Today&apos;s Tasks
            </p>
            <div className="space-y-4">
              {taskItems.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.className}`}>
                      <Icon className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-xs font-bold text-[#40485f]">{item.title}</p>
                      <p className="mt-0.5 text-[10px] font-medium text-[#a4aec5]">{item.label}</p>
                    </div>
                    <span className="text-[10px] font-medium text-[#9ca7bf]">{item.time}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

export default CrmHeroSection
