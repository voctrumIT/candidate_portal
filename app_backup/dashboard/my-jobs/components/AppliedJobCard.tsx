import { Clock } from 'lucide-react';
import Link from 'next/link';
import { JobListing } from '../../../jobs/data';

export default function AppliedJobCard({ job }: { job: JobListing }) {
  // Extracting days from the postedDate (e.g. "Posted 2 days ago" -> "2 days")
  // Or just hardcoding for the dashboard preview since it's dummy data
  const appliedTime = job.postedDate.replace('Posted', 'Applied');

  return (
    <div className="flex flex-col justify-between rounded-[16px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#1a1a1a]">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              {job.company} - {job.location}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {job.tags.map((tag) => (
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
            <span>{appliedTime}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        <span className="text-[14px] font-medium text-slate-500 dark:text-slate-400">{job.salaryRange}</span>
        <Link
          href={`/jobs/${job.id}`}
          className="rounded-md bg-[#2f54eb] px-6 py-2.5 text-[13px] font-semibold !text-white transition hover:bg-[#2447d8]"
        >
          View Application
        </Link>
      </div>
    </div>
  );
}
