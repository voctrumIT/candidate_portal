"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileText,
  DollarSign,
  Hourglass,
  ArrowRight,
} from "lucide-react";
import { jobsService, CandidateApplicationDto, parseApplicationStatus } from "../../../../services/jobs";
import { useAuth } from "../../../../context/AuthContext";

export default function AppliedJobsTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const apps = await jobsService.getApplications();
      setApplications(Array.isArray(apps) ? apps : []);
    } catch (err) {
      console.warn("Could not load applied jobs in profile:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();

    const handleUpdate = () => {
      loadApplications();
    };

    window.addEventListener("job_applied", handleUpdate);
    window.addEventListener("application_status_updated", handleUpdate);
    return () => {
      window.removeEventListener("job_applied", handleUpdate);
      window.removeEventListener("application_status_updated", handleUpdate);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
              Applied Jobs
            </h2>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2f54eb] dark:bg-blue-950/40 dark:text-blue-300">
              {applications.length} Submitted
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Track and monitor the evaluation status of all jobs applied with your profile
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/jobs")}
          className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#2f54eb] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#2447d8]"
        >
          <span>Find More Jobs</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60"
              />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2f54eb] dark:bg-blue-950/40 dark:text-blue-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              No Job Applications Yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You haven&apos;t applied to any roles yet. Explore matching positions and submit your profile in one tap.
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/jobs")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#2f54eb] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2447d8]"
            >
              <span>Explore Available Jobs</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any, idx: number) => {
              const statusInfo = parseApplicationStatus(app.rawStatus || app.applicationStatus || app.status);
              const targetAppId = app.jobApplicationId || app.id || app.jobId || `app-${idx}`;
              const appliedDateStr = app.applyDate
                ? new Date(app.applyDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recently applied";

              return (
                <div
                  key={targetAppId}
                  className="group relative rounded-xl border border-slate-200/90 dark:border-slate-800 bg-[#fafbfc] dark:bg-[#18181b] p-5 transition hover:border-[#2f54eb] hover:bg-white dark:hover:bg-[#1c1c20] shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#2f54eb] transition">
                          {app.title || app.job?.jobTitle || "Job Opportunity"}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                            app.badgeClass || statusInfo.badgeClass
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              app.dotColor || statusInfo.dotColor
                            }`}
                          />
                          {app.statusLabel || statusInfo.statusLabel}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {app.company || app.job?.companyName || "Hiring Partner"} • {app.location || "Remote"}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-3.5 w-3.5 text-[#2f54eb]" />
                          Applied: {appliedDateStr}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {app.salaryRange || "Competitive"}
                        </span>
                        {app.expectedCtc && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                              <DollarSign className="h-3 w-3 text-emerald-600" />
                              CTC: {app.expectedCtc}
                            </span>
                          </>
                        )}
                        {app.noticePeriod && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                              <Hourglass className="h-3 w-3 text-blue-600" />
                              Notice: {app.noticePeriod}
                            </span>
                          </>
                        )}
                      </div>

                      {(app.statusNote || app.note) && (
                        <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                          &ldquo;{app.statusNote || app.note}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center self-end sm:self-center shrink-0">
                      <Link
                        href={`/dashboard/applications/${targetAppId}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-4 py-2 text-xs font-semibold !text-white transition hover:bg-[#2447d8] shadow-xs"
                      >
                        <span>View Application</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

