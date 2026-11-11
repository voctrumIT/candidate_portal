"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import JobCard from "../../jobs/components/JobCard";
import { JobCardSkeleton } from "../../components/Skeleton";
import { jobsService } from "../../../services/jobs";

export default function DashboardJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await jobsService.getJobs();
        const apiJobs = data?.payload?.jobs || (Array.isArray(data) ? data : []);
        if (apiJobs && Array.isArray(apiJobs) && isMounted) {
          const mappedJobs = apiJobs.map((apiJob: any) => {
            const loc = Array.isArray(apiJob.locations) ? apiJob.locations.join(', ') : (typeof apiJob.locations === 'string' ? apiJob.locations : 'Remote');
            const skills = Array.isArray(apiJob.skills) ? apiJob.skills : (typeof apiJob.skills === 'string' ? apiJob.skills.split(',').map((s: string) => s.trim()) : ['Node.js', 'Express']);
            const resp = Array.isArray(apiJob.responsibilities) ? apiJob.responsibilities : (typeof apiJob.responsibilities === 'string' ? apiJob.responsibilities.split('\n').filter(Boolean) : ['Develop new features', 'Write clean code']);
            const qual = Array.isArray(apiJob.qualifications) ? apiJob.qualifications : (typeof apiJob.qualifications === 'string' ? apiJob.qualifications.split('\n').filter(Boolean) : ['Bachelor\'s degree', 'Experience in development']);

            return {
              id: String(apiJob.jobId || apiJob.id || Math.random()),
              title: apiJob.jobTitle || apiJob.title || 'Job Opportunity',
              company: apiJob.companyName || apiJob.company || 'Voctrum',
              location: loc || 'Remote',
              tags: [
                apiJob.employmentType === 0 ? 'Full-time' : apiJob.employmentType === 1 ? 'Part-time' : 'Contract',
                apiJob.experience ? `${apiJob.experience} yrs` : 'Entry Level',
                apiJob.education || 'Graduate'
              ].filter(Boolean),
              postedDate: apiJob.createdAt ? `Posted ${new Date(apiJob.createdAt).toLocaleDateString()}` : 'Posted recently',
              applyByDate: apiJob.lastApplicationDate ? `Apply by ${new Date(apiJob.lastApplicationDate).toLocaleDateString()}` : 'Apply by 30 April',
              salaryRange: apiJob.salaryRange ? (apiJob.salaryRange.includes('$') || apiJob.salaryRange.includes('₹') ? apiJob.salaryRange : `₹${apiJob.salaryRange}k/yr`) : 'Negotiable',
              overview: apiJob.jobDescription || apiJob.overview || 'We are looking for a passionate professional to join our team.',
              responsibilities: resp,
              qualifications: qual,
              keySkills: skills,
              aboutCompany: apiJob.aboutCompany || 'Voctrum is a product-driven company focused on building impactful digital experiences.'
            };
          });
          setJobs(mappedJobs);
        }
      } catch (err) {
        console.error("Failed to fetch live jobs", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const filters = [
    "Role",
    "Employment Type",
    "Location",
    "Date Posted",
    "Experience Level",
  ];

  return (
    <div className="px-10 py-10">
      {/* Header */}
      <div>
        <h2 className="text-[28px] font-black text-slate-900 dark:text-white">Explore Jobs</h2>
        <p className="mt-1 text-[15px] font-medium text-slate-400">
          Great opportunities are out there—adjust your filters to discover more
        </p>
      </div>

      {/* Search Bar */}
      <div className="mt-8 relative max-w-2xl">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#2f54eb]" />
        </div>
        <input
          type="text"
          placeholder="Search jobs"
          className="w-full h-14 pl-14 pr-5 rounded-full bg-[#f4f7ff] dark:bg-slate-800 border-none text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#2f54eb] outline-none transition"
        />
      </div>

      {/* Filters Row */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="h-10 rounded-full bg-[#2f54eb] px-6 text-[13px] font-semibold text-white transition hover:bg-[#2447d8]">
          Clear all
        </button>
        {filters.map((filter) => (
          <button
            key={filter}
            className="flex h-10 items-center gap-2 rounded-full bg-[#f1f5f9] dark:bg-slate-800 px-5 text-[13px] font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {filter}
            <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={3} />
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} isDashboard />
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400">
            No jobs found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && jobs.length > 0 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition hover:bg-slate-300 dark:hover:bg-slate-700">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] text-[13px] font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800">
            1
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition hover:bg-slate-300 dark:hover:bg-slate-700">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
