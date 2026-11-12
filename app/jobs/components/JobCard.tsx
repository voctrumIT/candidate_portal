"use client";

import { Bookmark, Clock, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { JobListing } from '../data';
import { jobsService } from '../../../services/jobs';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../components/Toast';

export default function JobCard({
  job,
  isDashboard = false,
  initialSaved = false,
  onUnsave,
}: {
  job: JobListing;
  isDashboard?: boolean;
  initialSaved?: boolean;
  onUnsave?: (jobId: string) => void;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const jobUrl = isDashboard ? `/dashboard/jobs/${job.id}` : `/jobs/${job.id}`;
  const [isSaved, setIsSaved] = useState(initialSaved);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = typeof window !== 'undefined' ? localStorage.getItem('candidate_token') : null;
    if (!token && !user) {
      router.push(`/register?redirect=${encodeURIComponent(jobUrl)}`);
      return;
    }

    const currentlySaved = isSaved;
    setIsSaved(!currentlySaved);

    try {
      if (currentlySaved) {
        await jobsService.unsaveJob(job.id);
        onUnsave?.(job.id);
        toast.info("Job Removed", `"${job.title}" removed from your saved list.`);
      } else {
        await jobsService.saveJob(job.id);
        toast.success("Job Saved", `"${job.title}" has been saved to your jobs.`);
      }
    } catch {
      setIsSaved(currentlySaved);
      toast.error("Action Failed", "Could not update saved job.");
    }
  };
  
  return (
    <div className="flex flex-col justify-between rounded-[16px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#1a1a1a]">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              {job.company} - {job.location}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleSave}
            aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
            title={isSaved ? "Saved" : "Save job"}
            className="flex-shrink-0 p-1.5 rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110"
          >
            <Bookmark
              className={`h-5 w-5 transition ${
                isSaved
                  ? "fill-[#2f54eb] text-[#2f54eb]"
                  : "text-slate-400 hover:text-[#2f54eb] dark:text-slate-500 dark:hover:text-[#2f54eb]"
              }`}
            />
          </button>
        </div>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {job.tags && job.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-7 items-center rounded-full bg-[#F3F6FF] px-4 text-[12px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Dates */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-[13px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{job.postedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            <span>{job.applyByDate}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        <span className="text-[14px] font-medium text-slate-500 dark:text-slate-400">{job.salaryRange}</span>
        <Link
          href={jobUrl}
          className="rounded-md bg-blue-700 px-6 py-2.5 text-[13px] font-semibold !text-white transition hover:bg-blue-800"
        >
          View Job
        </Link>
      </div>
    </div>
  );
}
