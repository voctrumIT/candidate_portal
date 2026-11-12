import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function AppliedJobCard({ job }: { job: any }) {
  const appliedTime = job.postedDate || (job.applyDate ? `Applied ${new Date(job.applyDate).toLocaleDateString()}` : "Applied recently");
  const targetId = job.jobId || job.id || (job as any).job?.jobId || "1";
  const statusLabel = job.statusLabel || (job.applicationStatus ? String(job.applicationStatus).charAt(0).toUpperCase() + String(job.applicationStatus).slice(1) : "Applied");
  const badgeClass = job.badgeClass || "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
  const dotColor = job.dotColor || "bg-blue-600";

  return (
    <div className="flex flex-col justify-between rounded-[16px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#1a1a1a]">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{job.title || job.jobTitle}</h3>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              {job.company || job.companyName} • {job.location || "Remote"}
            </p>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            {statusLabel}
          </span>
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

        {/* Dates & Status Note */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-[13px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#2f54eb]" />
            <span>{appliedTime}</span>
          </div>
        </div>

        {job.statusNote && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {job.statusNote}
          </p>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        <span className="text-[14px] font-medium text-slate-500 dark:text-slate-400">{job.salaryRange || "Competitive"}</span>
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
