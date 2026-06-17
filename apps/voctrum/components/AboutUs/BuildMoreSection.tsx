"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const BuildMoreSection = () => {
    return (
        <section className="bg-[#eceef5] px-8 py-16 sm:px-16 sm:py-20 lg:px-24 lg:py-32">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mx-auto flex max-w-[1100px] flex-col items-center rounded-[24px] bg-[#456cff] px-8 py-12 text-center"
            >
                <h2 className="max-w-[520px] text-[36px] font-bold leading-tight text-white sm:text-[42px] lg:text-[48px]">
                    Build a More <br />Connected Business
                </h2>

                <p className="mt-3 max-w-[520px] text-base leading-relaxed text-white/80">
                    Discover how Voctrum can simplify operations, improve visibility, and support smarter business growth.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/demo"
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#456cff] transition-colors hover:bg-white/90"
                    >
                        Book a Demo
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#456cff] text-white">
                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                    </Link>

                    <Link
                        href="/features"
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/60 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                        Explore Platform
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </Link>
                </div>
            </motion.div>
        </section>
    )
}

export default BuildMoreSection