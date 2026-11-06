'use client';

import { MapPin, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = () => {
      if (typeof window !== 'undefined') {
        setToken(localStorage.getItem('candidate_token'));
      }
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const isLoggedIn = Boolean(token || user);

  return (
    <section className="relative overflow-hidden bg-[#f7f8fb] dark:bg-[#0a0a0a]">

      {/* Top Left Pattern */}
      <div className="absolute left-0 top-0 h-80 w-96 rounded-br-[100%] bg-[repeating-radial-gradient(circle_at_0_0,rgba(15,23,42,0.12)_0,rgba(15,23,42,0.12)_1px,transparent_2px,transparent_8px)] opacity-25" />

      {/* Bottom Right Pattern */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(120%_110%_at_85%_0%,transparent_0%,transparent_42%,#e1e1e1_43%,#f3f3f3_76%,transparent_77%)] dark:opacity-10" />

      <div className="relative mx-auto max-w-[1380px] px-5 py-14 md:px-10 lg:px-16">

        <div className="grid items-center gap-0 lg:grid-cols-[50%_50%]">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] px-4 py-1.5 text-sm font-semibold italic text-slate-600 dark:text-slate-300">
              <span className="h-3 w-3 rounded-full bg-blue-800 ring-2 ring-blue-100" />
              Inclusive workplace for all
            </div>

            <h1 className="text-4xl font-black leading-[1.15] tracking-tight !text-black dark:!text-white sm:text-5xl lg:text-[56px]">
              Find a workplace where you can truly thrive.
            </h1>

            <p className="mt-6 max-w-xl text-base text-gray-600 dark:text-slate-300">
              Explore thousands of job opportunities tailored to your unique skills, experience, and career aspirations.
            </p>

            {/* SEARCH BAR */}
            <div className="mt-8 flex flex-col gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] p-2 shadow-sm sm:flex-row sm:items-center sm:rounded-full">

              <label className="flex items-center gap-3 px-4 sm:flex-1">
                <Search size={18} className="flex-shrink-0 text-blue-700 dark:text-blue-400" aria-hidden />
                <input
                  placeholder="Job title, keywords..."
                  className="h-12 min-w-0 w-full bg-transparent text-sm outline-none !text-black dark:!text-white placeholder:text-gray-600 dark:placeholder:text-slate-400"
                />
              </label>

              <div className="hidden h-8 w-[1px] bg-slate-200 dark:bg-slate-700 sm:block" />

              <label className="flex items-center gap-3 px-4 sm:flex-1">
                <MapPin size={18} className="flex-shrink-0 text-blue-700 dark:text-blue-400" aria-hidden />
                <input
                  placeholder="Enter Location"
                  className="h-12 min-w-0 w-full bg-transparent text-sm outline-none !text-black dark:!text-white placeholder:text-gray-600 dark:placeholder:text-slate-400"
                />
              </label>

              <button className="flex-shrink-0 h-12 rounded-[22px] bg-blue-700 px-8 text-sm font-bold text-white">
                Search Jobs
              </button>
            </div>

            {/* Register or Profile CTA + Rating */}
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">

              {isLoggedIn ? (
                <div>
                  <Link
                    href="/dashboard/profile"
                    className="inline-flex h-11 w-56 items-center justify-center rounded-md bg-blue-700 font-bold !text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md"
                  >
                    View Your Profile
                  </Link>
                  <p className="mt-3 text-sm italic text-slate-500 dark:text-slate-400">
                    Welcome back! Keep your profile updated
                  </p>
                </div>
              ) : (
                <div>
                  <Link
                    href="/register"
                    className="inline-flex h-11 w-56 items-center justify-center rounded-md border-2 border-blue-700 bg-white dark:bg-[#1a1a1a] font-bold !text-blue-700 shadow-sm transition hover:bg-blue-700 hover:!text-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    Register
                  </Link>

                  <p className="mt-3 text-sm italic text-slate-500 dark:text-slate-400">
                    Get started in minutes with simple ease
                  </p>
                </div>
              )}

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
                      className={`h-10 w-10 rounded-full border-2 border-white dark:border-[#0a0a0a] ${color}`}
                      style={{ zIndex: 10 - index }}
                    />
                  ))}
                </div>

                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
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

          {/* RIGHT HERO IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex items-center justify-center lg:justify-end w-full mt-10 lg:mt-0"
          >
            <div className="relative w-full max-w-[580px] lg:max-w-[660px] aspect-[4/3]">
              <Image
                src="/homepage/hero.png"
                alt="Find a workplace where you can thrive with Voctrum"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 660px"
                className="object-contain select-none"
              />
            </div>
          </motion.div>

        </div>

      </div>

    </section>
  );
}
