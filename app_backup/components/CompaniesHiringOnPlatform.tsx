'use client';

import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';

import 'swiper/css';

const brands = [
  {
    name: 'beatsaudio',
    className: 'text-red-500 font-semibold lowercase',
  },
  {
    name: 'calvin klein',
    className: 'font-serif italic text-slate-950',
  },
  {
    name: 'SPARTAN',
    className: 'tracking-[0.35em] text-blue-700 font-bold text-xs',
  },
  {
    name: 'Adobe',
    className: 'text-red-600 font-black',
  },
  {
    name: 'amazon',
    className: 'text-slate-950 font-black lowercase',
  },
  {
    name: 'Baskin Robbins',
    className: 'text-pink-600 font-black',
  },
  {
    name: 'LeetCode',
    className: 'text-slate-900 font-semibold',
  },
  {
    name: 'VAIO',
    className: 'text-amber-500 font-semibold tracking-[0.25em]',
  },
  {
    name: 'CISCO',
    className: 'text-sky-500 font-black tracking-[0.25em]',
  },
];

export default function CompaniesHiringOnPlatform() {
  return (
    <section className="bg-white px-5 py-12 md:px-10 md:py-16 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-[1220px]"
      >
        {/* Heading */}
        <div className="flex items-center justify-center gap-6 md:gap-10">
          <div className="h-px flex-1 bg-slate-200" />

          <h2 className="text-center text-[20px] font-black text-slate-950 md:text-[28px] lg:text-[32px]">
            Companies hiring on our platform
          </h2>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Moving Logos */}
        <div className="relative mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={'auto'}
            spaceBetween={80}
            loop={true}
            speed={8000}
            allowTouchMove={false}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            className="!overflow-visible"
          >
            {[...brands, ...brands, ...brands].map((brand, index) => (
              <SwiperSlide
                key={`${brand.name}-${index}`}
                className="!w-auto"
              >
                <div className="flex h-14 items-center justify-center px-4">
                  <span
                    className={`${brand.className} whitespace-nowrap text-sm md:text-base transition-all duration-300 hover:scale-110`}
                  >
                    {brand.name}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>
    </section>
  );
}
