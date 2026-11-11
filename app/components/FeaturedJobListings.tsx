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
import { JobCardSkeleton } from './Skeleton';
import { toast } from './Toast';

export default function FeaturedJobListings() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        const data = await jobsService.getJobs();
        const apiJobs = data?.payload?.jobs || (Array.isArray(data) ? data : []);
        if (apiJobs && Array.isArray(apiJobs) && isMounted) {
          const mapped = apiJobs.map((j: any) => {
            const loc = Array.isArray(j.locations)
              ? j.locations.join(', ')
              : typeof j.locations === 'string'
              ? j.locations
              : 'Remote';
            return {
              id: String(j.jobId || j.id || Math.random()),
              title: j.jobTitle || j.title || 'Job Opportunity',
              company: j.companyName || j.company || 'Voctrum',
              city: loc || 'Remote',
              tags: [
                j.employmentType === 0 ? 'Full-time' : j.employmentType === 1 ? 'Part-time' : 'Contract',
                j.experience ? `${j.experience} yrs` : 'Senior',
                ...(Array.isArray(j.skills) ? j.skills.slice(0, 1) : []),
              ].filter(Boolean),
              posted: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : 'recently',
              deadline: j.lastApplicationDate ? new Date(j.lastApplicationDate).toLocaleDateString() : '30 April',
              salary: j.salaryRange
                ? (j.salaryRange.includes('$') || j.salaryRange.includes('₹')
                    ? j.salaryRange
                    : `₹${j.salaryRange}k/yr`)
                : 'Negotiable',
            };
          });
          setJobs(mapped);
        }
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedJobs();

    return () => {
      isMounted = false;
    };
  }, []);

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
  }, [jobs]);

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
      toast.info("Job Removed", `"${job.title}" removed from your saved list.`);
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
      toast.success("Job Saved", `"${job.title}" has been saved to your jobs.`);
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

        {loading ? (
          <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 !pb-16">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-9 py-16 text-center text-slate-500">
            No featured jobs available.
          </div>
        ) : (
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
                        {job.tags.map((tag: string) => (
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
        )}
      </div>
    </section>
  );
}
