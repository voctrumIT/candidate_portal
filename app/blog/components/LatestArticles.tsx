"use client";

import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const articles = [
  {
    title: "How to Create a Professional Resume That Stands Out",
    desc: "Learn how to showcase your skills, and achievements effectively to capture recruiters' attention",
    image: "/blogs/04a5325bd8b5f77caac6ce74f42a13eb7a0dfa71.jpg",
    time: "5 min read",
  },
  {
    title: "10 Interview Questions Every Candidate Should Prepare For",
    desc: "Build confidence and improve your responses with practical tips for common interview questions",
    image: "/blogs/28a234c547f5db67fd60d7dbfa36d7a2c69194ff.jpg",
    time: "7 min read",
  },
  {
    title: "How to Find the Right Job Opportunities Faster",
    desc: "Explore effective job search strategies and learn how to identify roles that align with your goals",
    image: "/blogs/cf30044fba6b7ee931d7fda7c2b45ae7ccf2d4e4.jpg",
    time: "8 min read",
  },
  {
    title: "Essential Skills for the Modern Workplace",
    desc: "Discover the top skills that professionals need to stand out in today's competitive job market",
    image: "/blogs/d62919b7186a081213c5732be0b890f585ffc4ac.jpg",
    time: "10 min read",
  },
];

export default function LatestArticles() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <div className="mx-auto max-w-[1100px] px-5">
        
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            Latest <span className="text-blue-600">Articles</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
            Explore the latest career insights, industry trends, and practical advice to support your professional journey
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="w-full relative">
          <style dangerouslySetInnerHTML={{
            __html: `
              .latest-articles-swiper {
                padding-bottom: 60px !important;
                margin: -20px !important;
                padding-top: 20px !important;
                padding-left: 20px !important;
                padding-right: 20px !important;
              }
              .latest-articles-swiper .swiper-pagination-bullet {
                width: 8px;
                height: 8px;
                background: #cbd5e1;
                opacity: 1;
              }
              .dark .latest-articles-swiper .swiper-pagination-bullet {
                background: #334155;
              }
              .latest-articles-swiper .swiper-pagination-bullet-active {
                background: #2563eb !important;
              }
            `
          }} />
          <Swiper
            modules={[Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            className="latest-articles-swiper h-full"
          >
            {articles.map((article, idx) => (
              <SwiperSlide key={idx} className="h-auto">
                <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                  
                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden p-4 pb-0">
                    <div className="relative h-full w-full rounded-t-xl overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 pt-4">
                    <h3 className="text-[14px] font-bold text-blue-600 mb-2 leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {article.desc}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#bfa15f]">
                      <Clock className="h-3.5 w-3.5" />
                      {article.time}
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#bfa15f] transition-transform group-hover:translate-x-1" />
                  </div>
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
