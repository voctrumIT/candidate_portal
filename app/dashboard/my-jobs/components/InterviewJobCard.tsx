import { Clock, CalendarDays } from 'lucide-react';
import Link from 'next/link';

interface InterviewJobCardProps {
  job: any;
  status?: 'Completed' | 'Pending' | string;
  time?: string;
  date?: string;
  type?: 'Online' | 'Onsite' | string;
}

export default function InterviewJobCard({ job, status = 'Pending', time = '11:00 AM', date = 'Upcoming', type = 'Online' }: InterviewJobCardProps) {
  const targetId = job.jobId || job.id || (job as any).job?.jobId || "1";
  const displayTitle = job.title || job.jobTitle || "Job Opportunity";
  const displayCompany = job.company || job.companyName || "Voctrum Partner";
  const displayLocation = job.location || "Remote";

  return (
    <div className="flex flex-col justify-between rounded-[16px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#1a1a1a]">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{displayTitle}</h3>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              {displayCompany} • {displayLocation}
            </p>
          </div>
          {status === 'Completed' ? (
            <span className="shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Completed
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Scheduled
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {job.tags && job.tags.map((tag: string) => (
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
            <Clock className="h-4 w-4 text-[#2f54eb]" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-[#2f54eb]" />
            <span>{date}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        <span className="rounded-full border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] px-5 py-1.5 text-[12px] font-semibold text-[#2f54eb] dark:bg-transparent dark:text-blue-400 dark:border-blue-400">
          {type}
        </span>
        <Link
          href={`/dashboard/applications/${job.jobApplicationId || targetId}`}
          className="rounded-md bg-[#2f54eb] px-6 py-2.5 text-[13px] font-semibold !text-white transition hover:bg-[#2447d8]"
        >
          View Application
        </Link>
      </div>
    </div>
  );
}
