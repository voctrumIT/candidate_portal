'use client';

import { Bookmark, CalendarDays, Clock3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

const filters = ['All', 'Remote', 'Full-time', 'Part-time', 'Contract'];

const jobs = [
  {
    title: 'Senior Product Designer',
    company: 'Niscala.io',
    city: 'San Francisco',
    tags: ['Remote', 'Full-time', 'Senior'],
    posted: '2 days ago',
    deadline: '30 April',
    salary: '₹520k - 660k/yr',
  },
  {
    title: 'Full Stack Engineer',
    company: 'SAMTIV',
    city: 'New York',
    tags: ['Onsite', 'Part-time'],
    posted: '2 days ago',
    deadline: '30 April',
    salary: '₹920k - 960k/yr',
  },
  {
    title: 'Data Scientist',
    company: 'UNICA',
    city: 'Berlin',
    tags: ['Onsite', 'Full-time', 'Senior'],
    posted: '1 day ago',
    deadline: '10 April',
    salary: '₹720k - 960k/yr',
  },
  {
    title: 'UX Designer',
    company: 'TechFlow',
    city: 'London',
    tags: ['Remote', 'Full-time'],
    posted: '3 days ago',
    deadline: '15 May',
    salary: '₹480k - 620k/yr',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudScale',
    city: 'Toronto',
    tags: ['Remote', 'Contract'],
    posted: '1 week ago',
    deadline: '20 May',
    salary: '₹850k - 1.1M/yr',
  },
  {
    title: 'Marketing Manager',
    company: 'BrandBoost',
    city: 'Sydney',
    tags: ['Hybrid', 'Full-time'],
    posted: '4 days ago',
    deadline: '25 April',
    salary: '₹380k - 520k/yr',
  },
  {
    title: 'Frontend Developer',
    company: 'WebCraft',
    city: 'Singapore',
    tags: ['Remote', 'Full-time'],
    posted: '5 days ago',
    deadline: '1 May',
    salary: '₹550k - 700k/yr',
  },
  {
    title: 'Product Manager',
    company: 'InnovateTech',
    city: 'Dubai',
    tags: ['Onsite', 'Full-time'],
    posted: '6 days ago',
    deadline: '5 May',
    salary: '₹650k - 800k/yr',
  },
  {
    title: 'Backend Engineer',
    company: 'DataSystems',
    city: 'Mumbai',
    tags: ['Hybrid', 'Full-time'],
    posted: '1 week ago',
    deadline: '10 May',
    salary: '₹600k - 750k/yr',
  },
];

export default function FeaturedJobListings() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <section className="bg-white px-5 pb-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1220px] overflow-hidden">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">OPPORTUNITIES</p>
            <h2 className="section-title">Featured Job Listings</h2>
          </div>
          <a href="#" className="mb-2 text-sm font-semibold text-slate-700 underline">
            View all
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`h-9 rounded-full border px-7 text-sm font-medium transition ${
                activeFilter === filter
                  ? 'border-blue-700 bg-blue-700 text-white'
                  : 'border-blue-700 bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              {filter}
            </button>
          ))}
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
          className="mt-9 !pb-16"
        >
          {jobs.map((job, index) => (
            <SwiperSlide key={job.title}>
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
                  <div>
                    <h3 className="text-2xl font-black text-slate-950">{job.title}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-400">
                      {job.company} - {job.city}
                    </p>
                  </div>
                  <button aria-label={`Save ${job.title}`}>
                    <Bookmark className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#edf1ff] px-7 py-2 text-xs font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-5 border-b border-slate-200 pb-6 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-4 w-4 text-blue-700" />
                    Posted {job.posted}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-4 w-4 text-blue-700" />
                    Apply by {job.deadline}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-slate-400">{job.salary}</p>
                  <button className="h-10 rounded-md bg-blue-700 px-7 text-sm font-bold text-white transition hover:bg-blue-800">
                    View Job
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
