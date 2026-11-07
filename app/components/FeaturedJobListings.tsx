'use client';

import { Bookmark, CalendarDays, Clock3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { jobsService } from '../../services/jobs';
import { useAuth } from '../../context/AuthContext';

const filters = ['All', 'Remote', 'Full-time', 'Part-time', 'Contract'];

const jobs = [
  {
    id: '1',
    title: 'Senior Product Designer',
    company: 'Niscala.io',
    city: 'San Francisco',
    tags: ['Remote', 'Full-time', 'Senior'],
    posted: '2 days ago',
    deadline: '30 April',
    salary: '₹520k - 660k/yr',
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'SAMTIV',
    city: 'New York',
    tags: ['Onsite', 'Part-time'],
    posted: '2 days ago',
    deadline: '30 April',
    salary: '₹920k - 960k/yr',
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'UNICA',
    city: 'Berlin',
    tags: ['Onsite', 'Full-time', 'Senior'],
    posted: '1 day ago',
    deadline: '10 April',
    salary: '₹720k - 960k/yr',
  },
  {
    id: '4',
    title: 'UX Designer',
    company: 'TechFlow',
    city: 'London',
    tags: ['Remote', 'Full-time'],
    posted: '3 days ago',
    deadline: '15 May',
    salary: '₹480k - 620k/yr',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    city: 'Toronto',
    tags: ['Remote', 'Contract'],
    posted: '1 week ago',
    deadline: '20 May',
    salary: '₹850k - 1.1M/yr',
  },
  {
    id: '6',
    title: 'Marketing Manager',
    company: 'BrandBoost',
    city: 'Sydney',
    tags: ['Hybrid', 'Full-time'],
    posted: '4 days ago',
    deadline: '25 April',
    salary: '₹380k - 520k/yr',
  },
  {
    id: '7',
    title: 'Frontend Developer',
    company: 'WebCraft',
    city: 'Singapore',
    tags: ['Remote', 'Full-time'],
    posted: '5 days ago',
    deadline: '1 May',
    salary: '₹550k - 700k/yr',
  },
  {
    id: '8',
    title: 'Product Manager',
    company: 'InnovateTech',
    city: 'Dubai',
    tags: ['Onsite', 'Full-time'],
    posted: '6 days ago',
    deadline: '5 May',
    salary: '₹650k - 800k/yr',
  },
  {
    id: '9',
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
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const refreshSaved = () => {
      const map: Record<string, boolean> = {};
      jobs.forEach((j) => {
        map[j.id] = jobsService.isJobSaved(j.id);
      });
      setSavedMap(map);
    };

    refreshSaved();
    window.addEventListener('saved_jobs_updated', refreshSaved);
    window.addEventListener('storage', refreshSaved);

    return () => {
      window.removeEventListener('saved_jobs_updated', refreshSaved);
      window.removeEventListener('storage', refreshSaved);
    };
  }, []);

  const handleToggleSave = async (e: React.MouseEvent, job: any) => {
    e.preventDefault();
    e.stopPropagation();

    const token = typeof window !== 'undefined' ? localStorage.getItem('candidate_token') : null;
    if (!token && !user) {
      router.push(`/register?redirect=/jobs/${job.id}`);
      return;
    }

    const currentlySaved = Boolean(savedMap[job.id]);
    setSavedMap((prev) => ({ ...prev, [job.id]: !currentlySaved }));

    if (currentlySaved) {
      await jobsService.unsaveJob(job.id);
    } else {
      await jobsService.saveJob(job.id, {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.city,
        tags: job.tags,
        postedDate: `Posted ${job.posted}`,
        applyByDate: `Apply by ${job.deadline}`,
        salaryRange: job.salary,
      });
    }
  };

  return (
    <section className="bg-white dark:bg-[#1a1a1a] px-5 pb-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1220px] overflow-hidden">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">OPPORTUNITIES</p>
            <h2 className="section-title">Featured Job Listings</h2>
          </div>
          <Link href="/jobs" className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300 underline">
            View all
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`h-9 rounded-full border px-7 text-sm font-medium transition ${
                activeFilter === filter
                  ? 'border-blue-700 bg-blue-700 text-white'
                  : 'border-blue-700 bg-white dark:bg-[#1a1a1a] text-blue-700 hover:bg-blue-50'
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
          {jobs.map((job, index) => {
            const isSaved = Boolean(savedMap[job.id]);
            return (
              <SwiperSlide key={job.id || job.title}>
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
                  className="h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] p-7 shadow-sm transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-950 dark:text-white">{job.title}</h3>
                        <p className="mt-1 text-sm font-medium text-slate-400">
                          {job.company} - {job.city}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(e, job)}
                        aria-label={isSaved ? `Remove ${job.title} from saved` : `Save ${job.title}`}
                        title={isSaved ? "Saved" : "Save job"}
                        className="p-1 rounded-md transition hover:scale-110"
                      >
                        <Bookmark
                          className={`h-6 w-6 transition ${
                            isSaved
                              ? "fill-blue-700 text-blue-700"
                              : "text-slate-400 hover:text-blue-700"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#edf1ff] dark:bg-slate-800 px-7 py-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-5 border-b border-slate-200 dark:border-slate-700 pb-6 text-sm text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                        Posted {job.posted}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                        Apply by {job.deadline}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-slate-400">{job.salary}</p>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center justify-center h-10 rounded-md bg-blue-700 px-7 text-sm font-bold !text-white transition hover:bg-blue-800"
                    >
                      View Job
                    </Link>
                  </div>
                </motion.article>
              </SwiperSlide>
            );
          })}
        </Swiper>

      </div>
    </section>
  );
}
