'use client';

import { motion } from 'framer-motion';
import { Autoplay, Pagination } from 'swiper/modules';
import {
  BriefcaseBusiness,
  MapPin,
  Star,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

const companies = [
  {
    name: 'Wipro',
    subtitle: 'IT Company',
    logo: 'wipro',
    location: 'Pune, India',
    employees: '10k+ Employees',
    roles: '18 open roles',
    rating: '4.0',
  },
  {
    name: 'Google',
    subtitle: 'Bangalore, India',
    logo: 'google',
    location: 'Pune, India',
    employees: '10k+ Employees',
    roles: '28 open roles',
    rating: '4.5',
  },
  {
    name: 'Microsoft',
    subtitle: 'Hyderabad, India',
    logo: 'microsoft',
    location: 'Pune, India',
    employees: '10k+ Employees',
    roles: '23 open roles',
    rating: '4.0',
  },
  {
    name: 'Amazon',
    subtitle: 'Marketplace',
    logo: 'amazon',
    location: 'Bengaluru, India',
    employees: '10k+ Employees',
    roles: '31 open roles',
    rating: '4.3',
  },
  {
    name: 'Adobe',
    subtitle: 'Creative Cloud',
    logo: 'adobe',
    location: 'Noida, India',
    employees: '5k+ Employees',
    roles: '15 open roles',
    rating: '4.4',
  },
];

function BrandMark({ name }: { name: string }) {
  if (name === 'google') {
    return <span className="text-4xl font-black text-blue-600">G</span>;
  }

  if (name === 'microsoft') {
    return (
      <span className="grid h-9 w-9 grid-cols-2 gap-0.5">
        <span className="bg-red-500" />
        <span className="bg-green-500" />
        <span className="bg-blue-500" />
        <span className="bg-yellow-400" />
      </span>
    );
  }

  if (name === 'amazon') {
    return (
      <span className="text-3xl font-black lowercase text-slate-900">
        a
      </span>
    );
  }

  if (name === 'adobe') {
    return (
      <span className="text-3xl font-black text-red-600">
        A
      </span>
    );
  }

  return (
    <span className="relative h-11 w-11">
      <Image
        src="/common/logo.png"
        alt=""
        fill
        sizes="44px"
        className="object-contain"
      />
    </span>
  );
}

export default function TopCompaniesHiring() {
  return (
    <section className="bg-white px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1220px] overflow-hidden">

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              FINDINGS
            </p>

            <h2 className="mt-2 text-5xl font-black text-slate-950">
              Top Companies Hiring
            </h2>
          </div>

          <a
            href="#"
            className="mb-2 text-sm font-semibold text-slate-700 underline"
          >
            View all
          </a>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={24}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            760: {
              slidesPerView: 2,
            },
            1080: {
              slidesPerView: 3,
            },
          }}
          className="company-card-swiper mt-10 !pb-16"
        >
          {companies.map((company, index) => (
            <SwiperSlide key={company.name}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -5,
                }}
                className="h-full rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <BrandMark name={company.logo} />

                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {company.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-slate-400">
                        {company.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Actively Hiring
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-sm font-medium text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-700" />
                    {company.location}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <UsersRound className="h-5 w-5 text-blue-700" />
                    {company.employees}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness className="h-5 w-5 text-blue-700" />
                    {company.roles}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    {company.rating}
                  </span>
                </div>

                <div className="mt-7 flex justify-end border-t border-slate-200 pt-6">
                  <button className="h-10 rounded-md bg-[#2952e3] px-6 text-sm font-semibold text-white transition hover:bg-[#1f45d4]">
                    View Open Roles
                  </button>
                </div>
              </motion.article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
