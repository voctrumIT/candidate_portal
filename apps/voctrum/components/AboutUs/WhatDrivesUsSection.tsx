"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const beliefs = [
  {
    icon: "/AboutUsIcon1.svg",
    title: "Clarity First",
    description:
      "We simplify complex workflows so teams can understand information and act with confidence.",
  },
  {
    icon: "/AboutUsIcon2.svg",
    title: "Built to Connect",
    description:
      "We bring departments, processes, and business data together in one unified environment.",
  },
  {
    icon: "/AboutUsIcon3.svg",
    title: "Practical Innovation",
    description:
      "We create useful technology focused on solving real operational challenges.",
  },
  {
    icon: "/AboutUsIcon4.svg",
    title: "Security by Design",
    description:
      "We build access control, visibility, and data protection into every part of the platform.",
  },
]

const WhatDrivesUsSection = () => {
  return (
    <section className="bg-[#eef1f6] px-5 py-16 sm:px-9 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1160px]">
        <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-xs font-medium text-white shadow-[0_12px_28px_rgba(63,108,255,0.20)]"
          >
            What Drives Us
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-6 text-[38px] font-bold leading-tight text-[#172283] sm:text-[48px] lg:text-[56px]"
          >
            What We <span className="text-[#456cff]">Believe?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.18 }}
            className="mt-4 max-w-[560px] text-sm leading-relaxed text-[#7180bc] sm:text-base"
          >
            We build practical ERP solutions that make business operations clearer, more connected, and easier to manage.
          </motion.p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[980px] gap-5 md:grid-cols-2 lg:mt-14 lg:gap-x-6 lg:gap-y-6">
          {beliefs.map((belief, index) => (
            <motion.div
              key={belief.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex min-h-[108px] items-center gap-5 rounded-[24px] border border-[#d7def9] bg-white px-5 py-4 shadow-[0_22px_50px_rgba(48,73,154,0.10)] sm:px-6"
            >
              <div className="flex h-26 w-26 shrink-0 items-center justify-center rounded-[16px] bg-[#172283] shadow-[0_14px_28px_rgba(23,34,131,0.18)]">
                <Image
                  src={belief.icon}
                  alt={belief.title}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-bold leading-tight text-[#172283] sm:text-xl">
                  {belief.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-[#7180bc] sm:text-[15px]">
                  {belief.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatDrivesUsSection