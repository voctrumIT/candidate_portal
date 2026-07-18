"use client";

import { Handshake, Monitor, Headphones, LineChart } from "lucide-react";

const reasons = [
  {
    title: "Integrated Ecosystem",
    description: "Manage business operations and recruitment from a unified platform.",
    icon: Handshake,
  },
  {
    title: "Access to Talent",
    description: "Connect with qualified professionals through our hiring network.",
    icon: Monitor,
  },
  {
    title: "Dedicated Support",
    description: "Receive ongoing assistance and resources to help maximize the value of our platform and services.",
    icon: Headphones,
  },
  {
    title: "Long-Term Growth",
    description: "Scale efficiently with technology designed for growing businesses.",
    icon: LineChart,
  },
];

export default function WhyPartnerSection() {
  return (
    <section className="py-20 md:py-24 bg-slate-50 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1000px] px-5 md:px-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Why Companies <span className="text-[#2f54eb]">Partner</span> With Us
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            We help organizations streamline hiring, connect with qualified talent, and build stronger teams through our integrated recruitment ecosystem
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div 
                key={idx} 
                className="flex items-start gap-5 rounded-[20px] bg-white dark:bg-[#1a1a1a] p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-shadow hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2f54eb] text-white shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1.5">
                    {reason.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {reason.description}
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
