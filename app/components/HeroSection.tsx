'use client';

import { MapPin, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f8fb]">

      {/* Top Left Pattern */}
      <div className="absolute left-0 top-0 h-80 w-96 rounded-br-[100%] bg-[repeating-radial-gradient(circle_at_0_0,rgba(15,23,42,0.12)_0,rgba(15,23,42,0.12)_1px,transparent_2px,transparent_8px)] opacity-25" />

      {/* Bottom Right Pattern */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(120%_110%_at_85%_0%,transparent_0%,transparent_42%,#e1e1e1_43%,#f3f3f3_76%,transparent_77%)]" />

      <div className="relative mx-auto max-w-[1380px] px-5 py-14 md:px-10 lg:px-16">

        <div className="grid items-center gap-0 lg:grid-cols-[50%_50%]">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold italic text-slate-600">
              <span className="h-3 w-3 rounded-full bg-blue-800 ring-2 ring-blue-100" />
              Inclusive workplace for all
            </div>

            <h1 className="text-[54px] font-black leading-[1.05] text-slate-950 lg:text-[68px]">
              Find Jobs where
              <br />
              <span className="text-blue-700">Diversity</span> Thrives
            </h1>

            <p className="mt-7 max-w-[620px] text-lg leading-8 text-slate-600">
              Search for roles in organizations where your values,
              personality, and potential matter — not just your resume.
              Connect with workplaces that appreciate your individuality
              and help you grow beyond your limits.
            </p>

            {/* Search Box */}
            <div className="mt-10 flex flex-col gap-4 rounded-[28px] bg-[#E9EDFB] p-3 shadow-[0_8px_20px_rgba(15,23,42,0.14)] items-stretch justify-center md:flex-row relative z-10">

              <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Search size={20} className="flex-shrink-0 text-blue-700" aria-hidden />
                <input
                  placeholder="Enter skills / designations / companies"
                  className="h-12 min-w-0 w-full bg-transparent text-sm outline-none"
                />
              </label>

              <div className="hidden h-10 w-[2px] bg-slate-600 md:block"></div>

              <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <MapPin size={18} className="flex-shrink-0 text-blue-700" aria-hidden />
                <input
                  placeholder="Enter Location"
                  className="h-12 min-w-0 w-full bg-transparent text-sm outline-none"
                />
              </label>

              <button className="flex-shrink-0 h-12 rounded-[22px] bg-blue-700 px-8 text-sm font-bold text-white">
                Search Jobs
              </button>
            </div>

            {/* Register + Rating */}
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">

              <div>
                <Link href="/register" className="inline-flex h-11 w-56 items-center justify-center rounded-md border-2 border-blue-700 bg-white font-bold !text-blue-700 shadow-sm transition hover:bg-blue-700 hover:!text-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                  Register
                </Link>

                <p className="mt-3 text-sm italic text-slate-500">
                  Get started in minutes with simple ease
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    'bg-amber-200',
                    'bg-sky-200',
                    'bg-emerald-200',
                    'bg-rose-200',
                    'bg-violet-200',
                  ].map((color, index) => (
                    <span
                      key={color}
                      className={`h-10 w-10 rounded-full border-2 border-white ${color}`}
                      style={{ zIndex: 10 - index }}
                    />
                  ))}
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Trusted by 10k+ job seekers
                  </p>

                  <div className="mt-1 flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={16} className="text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="relative -mr-16 w-[850px] max-w-none"
          >
                          <Image
                src="/homepage/hero.png"
                width={1800}
                height={1400}
                priority
                alt="Hero Image"
                className="w-full h-auto scale-125 object-contain"
              />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

