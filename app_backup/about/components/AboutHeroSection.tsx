'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

const missionPoints = [
  'Empower Talent Through Opportunity',
  'Enable Continuous Career Growth',
  'Simplify Modern Hiring Processes',
  'Build Meaningful Professional Connections',
];

export default function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f5f6fa]">
      {/* Right Background Image */}
      <div className="absolute right-0 top-0 h-full w-[34%]">
        <Image
          src="/aboutus/herobg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-6 pt-16">
        {/* Hero */}
        <div className="relative min-h-[360px]">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-[60%]"
          >
            <div className="flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[2px] text-[#2453ff]">
              <span className="h-3 w-3 rounded-full bg-[#2453ff]" />
              About Us
            </div>

            <h1 className="mt-8 max-w-[620px] text-[58px] font-black leading-[1.08] text-[#09153d]">
              Connecting Talent with
              <br />
              <span className="text-[#2453ff]">Better</span> Opportunities
            </h1>

            <p className="mt-8 max-w-[540px] text-[17px] leading-[2] text-slate-500">
              We help job seekers discover meaningful career opportunities
              while enabling employers to connect with qualified professionals
              across various industries.
            </p>
          </motion.div>

          {/* Hero Woman */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute z-20"
            style={{
              left: 'calc(66% - 85px)',
              bottom: '18px',
            }}
          >
            <Image
              src="/aboutus/hero.png"
              alt="Hero"
              width={250}
              height={380}
              priority
              className="h-auto w-[250px]"
            />
          </motion.div>

          {/* Floating Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute right-[150px] top-[36px] z-30 w-[190px]"
          >
            <Image
              src="/aboutus/heros1.png"
              alt="Call Confirmation"
              width={400}
              height={150}
              className="h-auto w-full"
            />
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="absolute right-[28px] top-[150px] z-30 w-[185px]"
          >
            <Image
              src="/aboutus/heros2.png"
              alt="HR Message"
              width={400}
              height={150}
              className="h-auto w-full"
            />
          </motion.div>

          {/* Floating Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute right-[90px] top-[315px] z-30 w-[185px]"
          >
            <Image
              src="/aboutus/heros3.png"
              alt="Job Alert"
              width={400}
              height={150}
              className="h-auto w-full"
            />
          </motion.div>
        </div>

        {/* Bottom Cards */}
        <div className="relative z-30 flex gap-6 pl-[170px] pb-16 -mt-8">
          {/* Who We Are */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-[420px] rounded-[26px] bg-[#1f2b85] px-8 py-8 text-white"
          >
            <h2 className="text-[22px] font-bold">
              Who We Are
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-slate-200">
              We are a career-focused platform that connects talented
              professionals with trusted employers through a seamless and
              efficient recruitment experience.
            </p>

            <Link
              href="/jobs"
              className="mt-8 inline-flex rounded-lg border border-white px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-white hover:text-[#1f2b85]"
            >
              Browse Opportunities
            </Link>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-[470px] rounded-[26px] bg-white px-8 py-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
          >
            <h2 className="text-[22px] font-bold text-slate-900">
              Our Mission
            </h2>

            <ul className="mt-6 space-y-4">
              {missionPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-[16px] text-slate-600"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2453ff]" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
