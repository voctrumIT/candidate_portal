"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function EnterprisePlanSection() {
  return (
    <section className="bg-white px-4 py-24 md:px-8">
      <div className="mx-auto max-w-[916px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative min-h-[320px] overflow-visible rounded-[26px] bg-[#3f68ff] px-8 py-12 md:px-8 md:py-14"
        >
          <div className="relative z-10 max-w-[390px]">
            <h2 className="text-[42px] font-medium leading-[1.08] tracking-normal text-white md:text-[48px]">
              Need an enterprise plan?
            </h2>
            <p className="mt-4 max-w-[350px] text-sm leading-[1.25] text-white/85 md:text-[14px]">
              Custom pricing, dedicated support, and advanced security for large organizations.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="inline-flex h-[34px] items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-[#2f61ff] transition hover:bg-white/90"
              >
                Contact Sales
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#3f68ff] text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-[34px] items-center gap-2 rounded-full border border-white/70 bg-transparent px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                View Pricing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <Image
            src="/GetStartedImg.png"
            alt="Enterprise plan illustration"
            width={600}
            height={440}
            className="relative mx-auto mt-8 h-auto w-full max-w-[520px] object-contain drop-shadow-2xl lg:absolute lg:-top-[250px] lg:right-6 lg:mt-0 lg:w-[520px]"
          />
        </motion.div>
      </div>
    </section>
  )
}
