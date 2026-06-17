"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "The Idea",
    description:
      "Voctrum began with a simple goal: reduce the complexity created by disconnected systems and repetitive business processes.",
  },
  {
    number: "02",
    title: "Building the Foundation",
    description:
      "We developed a unified platform designed to centralise information, improve visibility, and support everyday operations.",
  },
  {
    number: "03",
    title: "Connecting Every Function",
    description:
      "Focused modules were introduced for workforce management, sales, inventory, finance, support, security, and analytics.",
  },
  {
    number: "04",
    title: "Growing With Businesses",
    description:
      "Voctrum continues to evolve around real operational needs, helping teams scale without adding unnecessary complexity.",
  },
]

const OurStorySection = () => {
  return (
    <section className="bg-white px-5 py-16 sm:px-9 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[900px] lg:-translate-x-24 xl:-translate-x-32">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

          {/* Left — heading */}
          <div className="flex-shrink-0 lg:w-[280px]">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-xs font-medium text-white"
            >
              Our Story
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-5 text-[40px] font-bold leading-[1.08] text-[#172283] sm:text-[46px] lg:text-[52px]"
            >
              Built to Connect
              <br />
              Every Part of
              <br />
              <span className="text-[#456cff]">Business</span>
            </motion.h2>
          </div>

          {/* Right — timeline */}
          <div className="flex flex-1 flex-col lg:pl-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex gap-5"
              >
                {/* Circle + dashed line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#dde3f8] bg-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#172283] text-[11px] font-bold text-white">
                      {step.number}
                    </div>
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      style={{
                        borderLeft: "3px dotted #0c37e4",
                        minHeight: "62px",
                        marginTop: "4px",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10">
                  <h3 className="text-base font-bold text-[#172283]">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[320px] text-sm leading-relaxed text-[#7180bc]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default OurStorySection
