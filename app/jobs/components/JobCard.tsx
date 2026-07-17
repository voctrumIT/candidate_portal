import { Bookmark, Clock, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { JobListing } from '../data';

export default function JobCard({ job }: { job: JobListing }) {
  return (
    <div className="flex flex-col justify-between rounded-[16px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {job.company} - {job.location}
            </p>
          </div>
          <button className="flex-shrink-0 text-slate-400 transition hover:text-slate-600">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-7 items-center rounded-full bg-[#F3F6FF] px-4 text-[12px] font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Dates */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-[13px] text-slate-500">
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

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
        <span className="text-[14px] font-medium text-slate-500">{job.salaryRange}</span>
        <Link
          href={`/jobs/${job.id}`}
          className="rounded-md bg-blue-700 px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-800"
        >
          View Job
        </Link>
      </div>
    </div>
  );
}
