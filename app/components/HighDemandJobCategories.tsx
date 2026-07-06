'use client';

import { BarChart3, Code2, GraduationCap, Megaphone, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { icon: Palette, title: 'UI/UX Design', roles: '4,821 open roles' },
  { icon: Code2, title: 'Programming', roles: '5,821 open roles' },
  { icon: Megaphone, title: 'Marketing', roles: '1,821 open roles' },
  { icon: BarChart3, title: 'Data & Analytics', roles: '2,821 open roles' },
  { icon: GraduationCap, title: 'Education', roles: '6,821 open roles' },
];

export default function HighDemandJobCategories() {
  return (
    <section className="bg-white px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1220px]">
        <p className="section-kicker">EXPLORE FIELDS</p>
        <h2 className="section-title">High Demand Job Categories</h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.article
                key={category.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="rounded-lg bg-[#dfe6ff] p-7 shadow-[0_4px_14px_rgba(37,99,235,0.18)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70">
                  <Icon className="h-6 w-6 text-blue-700" />
                </span>
                <h3 className="mt-8 text-xl font-semibold text-slate-700">
                  {category.title}
                </h3>
                <p className="mt-6 text-sm text-slate-600">{category.roles}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
