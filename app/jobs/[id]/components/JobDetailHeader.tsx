import { MapPin, Clock, CalendarDays, Wallet, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import Image from 'next/image';
import { JobListing } from '../../data';

export default function JobDetailHeader({ job }: { job: JobListing }) {
  return (
    <div className="border-b border-slate-200 pb-8">
      {/* Company Info */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 p-2">
          {/* Fallback avatar/logo */}
          <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-cyan-400" />
        </div>
        <span className="text-[15px] font-medium text-slate-600">{job.company}</span>
      </div>

      <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">{job.title}</h1>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-8 items-center rounded-full bg-[#F3F6FF] px-5 text-[13px] font-medium text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Meta info */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-[14px] text-slate-500">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span>Location : {job.location}, USA</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <span>{job.postedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          <span>{job.applyByDate}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[14px] font-semibold text-slate-800">
        <Wallet className="h-4 w-4 text-blue-600" />
        <span>Salary : {job.salaryRange}</span>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button className="flex items-center gap-2 rounded-md bg-blue-700 px-8 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-blue-800">
          Apply
          <ExternalLink className="h-4 w-4" />
        </button>

        <button className="flex items-center gap-2 rounded-md border border-blue-600 px-6 py-2.5 text-[14px] font-semibold text-blue-700 transition hover:bg-blue-50">
          Save for Later
          <Bookmark className="h-4 w-4" />
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition hover:bg-slate-200">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
