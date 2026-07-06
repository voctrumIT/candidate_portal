'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '1',
    title: 'Create Account',
    text: 'Create your Voctrum account',
    align: 'items-start text-left',
  },
  {
    number: '2',
    title: 'Explore Opportunities',
    text: 'Explore roles from companies that value inclusion and culture',
    align: 'items-center text-center',
  },
  {
    number: '3',
    title: 'Apply With Ease',
    text: 'Apply in a few clicks and get closer to your next role',
    align: 'items-end text-right',
  },
];

export default function EasyStepsSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1220px]">
        <div className="text-center">
          <p className="section-kicker justify-center">Easy Onboarding</p>
          <h2 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
            Get Started In 3 Easy Steps
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-[12%] right-[12%] top-20 hidden h-28 rounded-[50%] border-b-2 border-dashed border-slate-300 lg:block" />
          <div className="grid gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className={`relative z-10 flex flex-col ${step.align}`}
              >
                <span className="flex h-15 w-15 items-center justify-center rounded-full bg-blue-700 text-4xl font-black text-white">
                  {step.number}
                </span>
                <h3 className="mt-7 text-3xl font-semibold text-slate-600">{step.title}</h3>
                <p className="mt-4 max-w-xs text-base leading-5 text-slate-400">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
