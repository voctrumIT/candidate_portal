"use client";

import { MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function HelpCTASection() {
  return (
    <section className="bg-[#f8f8f9] dark:bg-slate-900/40 py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-4xl px-5 text-center">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-5">
          Your Success <span className="text-blue-600">Starts Here</span>
        </h2>
        
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Whether you&apos;re searching for your next opportunity or hiring top talent, we&apos;re here to support your journey every step of the way.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/jobs"
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 text-sm font-bold text-white transition hover:bg-blue-700 w-full sm:w-auto"
          >
            Explore more jobs
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          
          <Link
            href="#"
            className="flex h-12 items-center justify-center gap-2 rounded-lg border border-blue-600 bg-transparent px-8 text-sm font-bold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-slate-800 w-full sm:w-auto"
          >
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </Link>
        </div>

      </div>
    </section>
  );
}
