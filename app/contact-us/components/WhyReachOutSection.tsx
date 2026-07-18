"use client";

import { Flame, Handshake, Globe } from "lucide-react";

const reasons = [
  {
    title: "Fast Response",
    desc: "We aim to respond to inquiries promptly",
    icon: Flame,
  },
  {
    title: "Personalized Support",
    desc: "Connect with the right team and receive guidance tailored",
    icon: Handshake,
  },
  {
    title: "Reliable Communicate",
    desc: "Every inquiry is handled with professionalism, transparency",
    icon: Globe,
  },
];

export default function WhyReachOutSection() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1200px] px-5">
        
        {/* Header */}
        <div className="mb-14 text-center md:text-left">
          <h2 className="text-3xl md:text-[34px] lg:text-[38px] font-extrabold text-slate-900 dark:text-white mb-4">
            Why <span className="text-[#2f54eb]">Reach</span> Out to Us ?
          </h2>
          <p className="text-[14px] md:text-[15px] text-slate-500 dark:text-slate-400">
            Whether you&apos;re exploring opportunities, partnerships, or have a question, we&apos;re here to help
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-5 rounded-[32px] bg-white dark:bg-[#1a1a1a] p-6 shadow-sm border border-[#f0f0f0] dark:border-slate-800 transition-shadow hover:shadow-md"
              >
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[20px] bg-[#2f54eb] text-white shadow-sm">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-900 dark:text-white mb-1">
                    {reason.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed pr-2">
                    {reason.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
