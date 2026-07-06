'use client';

import { Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const benefits = [
  'Create or improve your resume with AI-powered assistance',
  'Enhance your resume with smart, personalized suggestions',
  'Optimize your resume to match job requirements instantly',
];

export default function ResumeBuilderSection() {
  return (
    <section className="bg-white px-5 py-12 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto min-h-[420px] max-w-[1220px] overflow-hidden rounded-lg bg-slate-50"
      >
        <Image
          src="/homepage/section.png"
          alt="Professional building a resume on a laptop"
          fill
          sizes="(max-width: 1220px) 100vw, 1220px"
          className="object-cover"
        />
        <div className="relative z-10 max-w-2xl px-7 py-16 md:px-28 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-sm font-semibold italic text-slate-600">
            <span className="h-3 w-3 rounded-full bg-blue-800 ring-2 ring-blue-100" />
            AI-Powered
          </span>
          <h2 className="mt-8 text-3xl font-black text-slate-950 md:text-4xl">
            No resume? <span className="text-blue-700">No problem</span>
          </h2>
          <ul className="mt-8 space-y-7">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-slate-600">
                <Hexagon className="h-5 w-5 fill-blue-50 text-blue-700" />
                <span className="text-base font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
          <button className="mt-9 h-12 rounded-md bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800">
            Start Building Your Resume
          </button>
        </div>
      </motion.div>
    </section>
  );
}
