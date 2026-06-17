"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const cards = [
  {
    icon: "/AboutUsIcon5.svg",
    title: "One Connected Platform",
    description:
      "Manage people, sales, finance, inventory, support, and operations from one central system.",
  },
  {
    icon: "/AboutUsIcon6.svg",
    title: "Designed for Real Work",
    description:
      "Simple dashboards and structured workflows help teams complete everyday tasks more efficiently.",
  },
  {
    icon: "/AboutUsIcon7.svg",
    title: "Built to Scale",
    description:
      "Add users, modules, and capabilities as your team and business requirements grow.",
  },
]

const WhyVoctrumSection = () => {
  return (
    <section className="bg-white px-5 py-16 sm:px-9 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[900px]">

        {/* Top — centered heading */}
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-xs font-medium text-white"
          >
            Why Voctrum
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-4 text-[38px] font-bold leading-tight text-[#172283] sm:text-[44px] lg:text-[52px]"
          >
            What Sets Us <span className="text-[#456cff]">Apart?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-3 max-w-[420px] text-base leading-relaxed text-[#7180bc]"
          >
            Voctrum is designed to replace disconnected tools with one flexible platform built around real business needs.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index + 0.2 }}
              className="flex flex-col rounded-[20px] border border-[#c8d0f0] bg-white p-6 shadow-[0_8px_30px_rgba(69,108,255,0.07)]"
            >
              {/* Icon */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#f0f3ff]">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={52}
                  height={52}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-[26px] font-bold leading-snug text-[#172283]">
                {card.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-[15px] leading-relaxed text-[#7180bc]">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default WhyVoctrumSection