"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus } from "lucide-react"

const faqs = [
  { q: "Do I need a credit card to start?", a: "No, our 30-day free trial doesn't require a credit card. You'll have full access to all features." },
  { q: "Can I upgrade or cancel anytime?", a: "Yes, you can upgrade to a paid plan or cancel your trial at any time with no questions asked." },
  { q: "What happens after the trial?", a: "We'll notify you before your trial ends. Choose a plan that fits your needs or export your data." },
  { q: "Is my data secure during trial?", a: "Absolutely. Trial accounts have the same enterprise-grade security as paid plans." },
]

export default function GetStartedFAQs() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-[#f0f2f8] px-4 py-20 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:gap-20 lg:items-start">

          {/* Left */}
          <div>
            <span className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-xs font-semibold text-white">
              Registration FAQ
            </span>
            <h2 className="mt-4 text-[36px] font-bold leading-[1.05] text-[#172283] md:text-[42px]">
              <span className="text-[#456cff]">Common</span>{" "}
              questions about getting started
            </h2>
            <p className="mt-4 text-sm leading-snug text-[#6c78bd]">
              Everything you need to know about creating your workspace
            </p>
          </div>

          {/* Right — Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="overflow-hidden rounded-[16px] bg-white shadow-[0_4px_20px_rgba(48,73,154,0.07)]"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-[#172283]">{faq.q}</span>
                  {open === i
                    ? <Minus className="h-4 w-4 shrink-0 text-[#456cff]" />
                    : <Plus className="h-4 w-4 shrink-0 text-[#456cff]" />
                  }
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-6 pb-5 text-sm leading-snug text-[#6c78bd]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
