'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, MonitorSmartphone, FileText, Building2 } from 'lucide-react';

const offers = [
  {
    icon: ShieldCheck,
    title: 'Verified Opportunities',
    description: 'Trusted jobs from reputable employers across diverse industries.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Smart Applications',
    description: 'Enjoy a faster, simpler, and more efficient application experience.',
  },
  {
    icon: FileText,
    title: 'Resume Management',
    description: 'Easily manage and update your resume, skills, and professional information.',
  },
  {
    icon: Building2,
    title: 'Industry Diversity',
    description: 'Explore career opportunities across a wide range of industries and sectors.',
  },
];

export default function WhatWeOfferSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1220px]">

        <div className="text-center">
          <h2 className="text-4xl font-black text-slate-900 md:text-5xl">
            What We <span className="text-blue-700">Offer</span> ?
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Comprehensive tools and opportunities designed to simplify hiring
            <br className="hidden sm:block" />
            and support professional growth.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {offers.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex items-start gap-5 rounded-2xl border border-slate-100 p-6 shadow-sm"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-700">
                <item.icon className="h-7 w-7 text-white" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
