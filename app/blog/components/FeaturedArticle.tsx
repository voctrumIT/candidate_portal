"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function FeaturedArticle() {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-24 px-5">
      <div className="mx-auto max-w-[1100px]">
        
        <div className="flex flex-col lg:flex-row overflow-hidden rounded-[24px] bg-white dark:bg-[#1a1a1a] shadow-sm border border-slate-200 dark:border-slate-800">
          
          {/* Left: Image */}
          <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-[450px]">
            <Image
              src="/blogs/c42f2e645b291334de5bb4ecac325c1fc4a18549.png"
              alt="Featured Article"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 lg:w-1/2">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#e9edff] dark:bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-blue-800 dark:text-blue-300 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-700" />
              Featured Article
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-5 leading-snug">
              The Complete Guide to Landing Your Dream Job
            </h2>
            
            <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Building a successful career starts with the right preparation. Learn practical strategies for creating a standout resume, excelling in interviews, and showcasing your skills and experience effectively. These insights can help you stand out to employers and increase your chances of securing the opportunities that align with your career goals.
            </p>

            <div className="text-[13px] font-bold text-blue-700 dark:text-blue-400 mb-8">
              Career . 8 min read
            </div>

            <button className="self-start inline-flex h-11 items-center justify-center gap-3 rounded-lg bg-[#2f54eb] pl-6 pr-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm">
              Read Article
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#2f54eb]">
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
            
          </div>
          
        </div>

      </div>
    </section>
  );
}
