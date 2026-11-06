"use client";

import { UserRound, Search, FileText, Settings, File, Lock, Bell, TrendingUp, Sprout } from "lucide-react";

const categories = [
  {
    icon: UserRound,
    title: "Creating Your Profile",
    description: "Learn how to set up and optimize your profile",
  },
  {
    icon: Search,
    title: "Job Search",
    description: "Find opportunities using filters, keywords, and alerts",
  },
  {
    icon: FileText,
    title: "My Application",
    description: "Track, manage, and update your job applications",
  },
  {
    icon: Settings,
    title: "Technical Issue",
    description: "Report platform issues, bugs, or unexpected errors",
  },
  {
    icon: File,
    title: "Resume Documents",
    description: "Upload, edit, and manage resumes and documents",
  },
  {
    icon: Lock,
    title: "Account & Login",
    description: "Help with passwords, account access, and security settings",
  },
  {
    icon: Bell,
    title: "Job Alerts",
    description: "Manage notifications and personalized job",
  },
  {
    icon: Sprout,
    title: "Career Growth",
    description: "Access career advice, application tips.",
  },
];

export default function SupportCategoriesSection() {
  return (
    <section className="py-20 bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1300px] px-5 md:px-10 lg:px-16">
        
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Explore <span className="text-blue-600">Support</span> Categories
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Find answers, access helpful resources, or get the support you need from our team
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <a
                key={idx}
                href="#"
                className="group flex flex-col rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-100 dark:hover:border-slate-700 text-left"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2f54eb] text-white shadow-sm transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-[15px] font-bold text-slate-900 dark:text-white">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
