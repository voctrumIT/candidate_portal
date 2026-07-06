'use client';

import { motion } from 'framer-motion';
import { Award, Users, Lock, TrendingUp } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Quality Over Quantity',
    description:
      'Every opportunity is carefully reviewed to maintain quality, authenticity, and value throughout the recruitment journey.',
  },
  {
    icon: Users,
    title: 'Trusted Connections',
    description:
      'We facilitate valuable professional connections that support successful hiring outcomes, career and long-term professional growth.',
  },
  {
    icon: Lock,
    title: 'Transparency First',
    description:
      'We are committed to maintaining openness and reliability, ensuring candidates and employers can engage with confidence.',
  },
  {
    icon: TrendingUp,
    title: 'Long-Term Growth',
    description:
      'Our focus extends beyond placements, helping professionals discover opportunities that contribute to sustained career progression.',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="bg-[#f7f8fb] px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1220px]">

        {/* Heading */}
        <div className="max-w-lg">
          <h2 className="text-4xl font-black text-slate-900 md:text-5xl">
            Why <span className="text-blue-700">Choose</span> Us ?
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Built to deliver a more reliable, transparent, and effective recruitment
            experience that fosters meaningful professional connections and
            supports long-term career success.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex flex-col gap-4 rounded-xl p-4"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-700">
                <item.icon className="h-7 w-7 text-white" />
              </span>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
