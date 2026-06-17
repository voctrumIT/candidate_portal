"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const stats = [
    { value: "9", label: "Core ERP\nModules" },
    { value: "1", label: "Connected\nPlatform" },
    { value: "360", label: "Business\nVisibility", degree: true },
    { value: "24/7", label: "Cloud Access" },
]

const AboutUsHeroSection = () => {
    return (
        <section className="bg-white px-1.5 py-3 sm:px-2">
            <div className="relative mx-auto min-h-[762px] max-w-[1582px] overflow-hidden rounded-[28px] border border-[#d6defd] px-5 pb-12 shadow-[0_24px_70px_rgba(69,108,255,0.12)] sm:min-h-[700px] sm:rounded-[30px] sm:px-9 lg:pb-16">
                <Image
                    src="/AboutUsBgImg.png"
                    alt=""
                    fill
                    priority
                    className="pointer-events-none object-cover object-bottom"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,255,0.96)_0%,rgba(239,243,255,0.92)_42%,rgba(166,174,216,0.82)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-56 bg-white/40" />

                <div className="relative z-10 mx-auto flex max-w-[760px] flex-col items-center pt-32 text-center sm:pt-36 lg:pt-32">
                    <motion.span
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.08 }}
                        className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-[10px] font-medium text-white shadow-[0_12px_28px_rgba(63,108,255,0.24)]"
                    >
                        About Voctrum
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.58, delay: 0.16 }}
                        className="mt-5 max-w-[760px] text-[38px] font-bold leading-[1.02] text-[#172283] sm:text-[52px] lg:text-[58px]"
                    >
                        Building Better
                        <br />
                        Ways to Run <span className="text-[#456cff]">Business</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.52, delay: 0.24 }}
                        className="mt-3 max-w-[440px] text-[13px] leading-snug text-[#7180bc] sm:text-sm"
                    >
                        Voctrum brings people, processes, and business data together through one connected ERP platform.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.52, delay: 0.32 }}
                        className="mt-6 flex flex-wrap items-center justify-center gap-3"
                    >
                        <Link
                            href="/features"
                            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#25b8f4] to-[#082da9] px-2 pl-4 text-xs font-semibold text-white shadow-[0_14px_30px_rgba(20,75,196,0.25)] transition-transform hover:scale-[1.03]"
                        >
                            Explore Platform
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0b2da9]">
                                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
                            </span>
                        </Link>

                        <Link
                            href="/modules"
                            className="inline-flex h-9 items-center rounded-full border border-[#456cff] bg-white/45 px-4 text-xs font-semibold text-[#456cff] shadow-[0_12px_24px_rgba(69,108,255,0.10)] backdrop-blur-sm transition-colors hover:bg-white"
                        >
                            View Modules
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.62, delay: 0.42 }}
                    className="relative z-10 mx-auto mt-16 w-full max-w-[900px] rounded-[24px] bg-white shadow-[0_22px_60px_rgba(48,73,154,0.14)] sm:mt-20 lg:mt-24"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4">
                        {stats.map((item, index) => (
                            <div
                                key={item.value}
                                className="relative flex min-h-[96px] flex-col justify-center px-8 py-7 text-left"
                            >
                                {/* Vertical divider — faded, not full height */}
                                {index !== 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            width: "1px",
                                            height: "55%",
                                            background: "linear-gradient(to bottom, transparent, #c8d0f0, transparent)",
                                        }}
                                    />
                                )}
                                <p className="text-[34px] font-bold leading-none text-[#172283] sm:text-[40px] lg:text-[46px]">
                                    {item.value}
                                    {item.degree ? <span>&deg;</span> : null}
                                </p>
                                <p className="mt-2 text-[11px] leading-tight text-[#7180bc]">
                                    {item.label.replace("\n", " ")}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default AboutUsHeroSection