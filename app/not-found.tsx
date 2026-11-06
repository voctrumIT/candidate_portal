import Link from "next/link";
import { ArrowLeft, Briefcase, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] px-6 text-center dark:bg-[#0a0a0a]">
      <div className="max-w-md">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
          Page Not Found
        </span>
        <h1 className="mt-4 text-7xl font-black text-slate-900 dark:text-white">404</h1>
        <h2 className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-200">
          Looking for a role or page?
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The page or job you are looking for might have been moved or is no longer available.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#2f54eb] px-6 text-sm font-semibold !text-white transition hover:bg-[#2447d8] shadow-sm"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/dashboard/jobs"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-6 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
          >
            <Briefcase className="h-4 w-4 text-[#2f54eb]" />
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}

