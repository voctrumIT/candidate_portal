"use client";

import Image from "next/image";
import {
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VoctrumAIChat from "./components/VoctrumAIChat";
import ResumeBuilderModal from "../components/ResumeBuilderModal";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { jobsService } from "../../services/jobs";
import { ApplicationCardSkeleton, JobCardSkeleton } from "../components/Skeleton";
import { toast } from "../components/Toast";

import "swiper/css";
import "swiper/css/pagination";

export interface ApplicationItem {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  appliedDate: string;
  currentStep: number; // 1 to 4
  status: "In Review" | "Interview" | "Shortlisted" | "Applied";
  statusNote: string;
  badgeColor: string;
  interviewDate?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);

  const handleOpenResumeBuilder = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("candidate_token") : null;
    if (!token && !user) {
      router.push("/register?redirect=/dashboard/resume-builder");
      return;
    }
    setIsResumeBuilderOpen(true);
  };

  const candidateFirstName =
    user?.firstName ||
    (user?.name ? user.name.split(" ")[0] : "Candidate");

  return (
    <div className="px-6 py-6 md:px-10 md:py-8 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101828] dark:text-white">
            Welcome back, {candidateFirstName}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#667085] dark:text-slate-400">
            Track your job applications, interview invites, and matching career opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Profile Active
          </span>
        </div>
      </div>

      {/* Application Status Tracker Section */}
      <ApplicationStatusSection />

      {/* Recommended Jobs Carousel */}
      <RecommendedJobs />

      {/* AI Resume Banner */}
      <ResumeBanner
        onOpenResumeBuilder={handleOpenResumeBuilder}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Modals */}
      <VoctrumAIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ResumeBuilderModal
        isOpen={isResumeBuilderOpen}
        onClose={() => setIsResumeBuilderOpen(false)}
      />
    </div>
  );
}

function ApplicationStatusSection() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    let isMounted = true;
    const loadApps = async () => {
      try {
        setLoading(true);
        const res = await jobsService.getApplications();
        if (isMounted && res && Array.isArray(res)) {
          const mapped: ApplicationItem[] = res.map((app: any, idx: number) => {
            const statusVal: ApplicationItem["status"] =
              app.status === "Interview" ||
              app.status === "In Review" ||
              app.status === "Shortlisted"
                ? app.status
                : "Applied";

            return {
              id: String(app.id || app.applicationId || `app-${idx}`),
              jobId: String(app.jobId || app.job?.id || "1"),
              title: app.jobTitle || app.job?.title || app.title || "Job Application",
              company: app.companyName || app.job?.company || app.company || "Voctrum Partner",
              location: app.location || app.job?.location || "Remote",
              type: app.employmentType || "Full-time",
              salary: app.salaryRange || app.job?.salary || "Competitive",
              appliedDate: app.appliedAt
                ? `Applied ${new Date(app.appliedAt).toLocaleDateString()}`
                : "Applied recently",
              currentStep:
                app.step || (statusVal === "Interview" ? 3 : statusVal === "Shortlisted" ? 2 : 1),
              status: statusVal,
              statusNote:
                app.notes ||
                app.statusNote ||
                (statusVal === "Interview"
                  ? "Interview invitation scheduled."
                  : statusVal === "Shortlisted"
                  ? "Shortlisted for next interview round."
                  : "Application submitted and under review by recruiter."),
              badgeColor:
                statusVal === "Interview"
                  ? "indigo"
                  : statusVal === "Shortlisted"
                  ? "emerald"
                  : "blue",
              interviewDate: app.interviewDate || undefined,
            };
          });
          setApplications(mapped);
        }
      } catch (err) {
        console.warn("Could not load candidate applications:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadApps();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredApps = applications.filter((app) => {
    if (filter === "All") return true;
    if (filter === "In Review") return app.status === "In Review";
    if (filter === "Interview") return app.status === "Interview";
    if (filter === "Shortlisted") return app.status === "Shortlisted";
    return true;
  });

  const getStatusBadge = (status: ApplicationItem["status"]) => {
    switch (status) {
      case "Interview":
        return {
          label: "Interview Scheduled",
          classes:
            "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
          dotColor: "bg-indigo-600",
        };
      case "In Review":
        return {
          label: "Under Review",
          classes:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
          dotColor: "bg-amber-500",
        };
      case "Shortlisted":
        return {
          label: "Shortlisted",
          classes:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
          dotColor: "bg-emerald-600",
        };
      default:
        return {
          label: "Application Submitted",
          classes:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
          dotColor: "bg-blue-600",
        };
    }
  };

  const steps = ["Applied", "Screening", "Interview", "Offer"];

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1a]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-[#101828] dark:text-white">
              Job Application Status
            </h2>
            {!loading && (
              <span className="inline-flex items-center rounded-full bg-[#f0f4ff] px-2.5 py-0.5 text-xs font-semibold text-[#2f54eb] dark:bg-slate-800 dark:text-blue-400">
                {applications.length} Active
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#667085] dark:text-slate-400">
            Real-time stage tracking of your applications and scheduled recruiter interactions
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
          {["All", "In Review", "Interview", "Shortlisted"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === tab
                  ? "bg-white text-slate-900 shadow-sm dark:bg-[#1a1a1a] dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List / Skeletons / Empty State */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <>
            <ApplicationCardSkeleton />
            <ApplicationCardSkeleton />
          </>
        ) : filteredApps.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2f54eb] dark:text-blue-400">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              No applications in &ldquo;{filter}&rdquo;
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {filter === "All"
                ? "You have not submitted any applications yet. Explore recommended roles below to apply!"
                : `No active applications currently in ${filter} status.`}
            </p>
            {filter === "All" && (
              <Link
                href="/dashboard/jobs"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-4 py-2 text-xs font-semibold !text-white transition hover:bg-[#2447d8]"
              >
                <span>Browse Open Jobs</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        ) : (
          filteredApps.map((app) => {
            const badge = getStatusBadge(app.status);

            return (
              <article
                key={app.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-xl border border-slate-200/70 bg-[#fafbfc] p-5 transition hover:border-[#2f54eb]/50 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/80"
              >
                {/* Left Column: Job Info */}
                <div className="flex items-start gap-4 min-w-[260px] max-w-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-black text-[#172a78] dark:text-blue-400 shadow-xs">
                    {app.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-[#101828] dark:text-white">
                        {app.title}
                      </h3>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-[#475467] dark:text-slate-300">
                      {app.company} • <span className="text-[#667085] dark:text-slate-400">{app.location}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        <Clock className="h-3 w-3 text-[#2f54eb]" />
                        {app.appliedDate}
                      </span>
                      <span className="rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {app.salary}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle Column: Visual 4-Step Progress Tracker */}
                <div className="flex-1 max-w-xl">
                  {/* Step Progress Bar */}
                  <div className="relative flex items-center justify-between">
                    {/* Connecting Track */}
                    <div className="absolute left-3 right-3 top-3.5 h-[3px] bg-slate-200 dark:bg-slate-800 -z-0" />
                    <div
                      className="absolute left-3 top-3.5 h-[3px] bg-[#2f54eb] -z-0 transition-all duration-500"
                      style={{
                        width: `${((app.currentStep - 1) / (steps.length - 1)) * 94}%`,
                      }}
                    />

                    {steps.map((stepName, idx) => {
                      const stepNum = idx + 1;
                      const isCompleted = stepNum < app.currentStep;
                      const isCurrent = stepNum === app.currentStep;

                      return (
                        <div key={stepName} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                              isCompleted
                                ? "bg-[#2f54eb] text-white"
                                : isCurrent
                                ? "bg-white border-2 border-[#2f54eb] text-[#2f54eb] shadow-md ring-4 ring-[#2f54eb]/15 dark:bg-[#1a1a1a]"
                                : "bg-white border-2 border-slate-300 text-slate-400 dark:bg-slate-800 dark:border-slate-700"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <span>{stepNum}</span>
                            )}
                          </div>
                          <span
                            className={`mt-1.5 text-[11px] font-semibold ${
                              isCurrent
                                ? "text-[#2f54eb] dark:text-blue-400"
                                : isCompleted
                                ? "text-slate-700 dark:text-slate-300"
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          >
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Note / Next Event */}
                  <div className="mt-3.5 flex items-center justify-between rounded-lg bg-white dark:bg-slate-800/80 px-3.5 py-2 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-[#344054] dark:text-slate-300">
                      <span className={`h-2 w-2 rounded-full ${badge.dotColor} shrink-0`} />
                      <span className="line-clamp-1">{app.statusNote}</span>
                    </div>
                    {app.interviewDate && (
                      <span className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        <CalendarDays className="h-3 w-3" />
                        {app.interviewDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Column: Status Badge & Action */}
                <div className="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center gap-3 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badge.classes}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${badge.dotColor}`} />
                    {badge.label}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/jobs/${app.jobId}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#2f54eb] hover:bg-[#2447d8] px-4 py-2 text-xs font-semibold !text-white transition shadow-xs"
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Footer link to My Jobs */}
      {!loading && applications.length > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-xs text-[#667085] dark:text-slate-400">
            Showing {filteredApps.length} active candidate applications
          </p>
          <Link
            href="/dashboard/my-jobs"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#2f54eb] hover:underline dark:text-blue-400"
          >
            <span>View all applications</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}

function RecommendedJobs() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await jobsService.getJobs();
        const apiJobs = data?.payload?.jobs || data?.jobs || data;
        if (isMounted && apiJobs && Array.isArray(apiJobs)) {
          const mapped = apiJobs.map((apiJob: any) => {
            const loc = Array.isArray(apiJob.locations)
              ? apiJob.locations.join(", ")
              : typeof apiJob.locations === "string"
              ? apiJob.locations
              : "Remote";

            return {
              id: String(apiJob.jobId || apiJob.id || Math.random()),
              title: apiJob.jobTitle || apiJob.title || "Job Opportunity",
              company: apiJob.companyName || apiJob.company || "Voctrum",
              tags: [
                apiJob.employmentType === 0 ? "Full-time" : apiJob.employmentType === 1 ? "Part-time" : "Contract",
                apiJob.experience || "Senior Level",
                loc,
              ],
              posted: apiJob.createdAt
                ? `Posted ${new Date(apiJob.createdAt).toLocaleDateString()}`
                : "Posted recently",
              apply: apiJob.lastApplicationDate
                ? `Apply by ${new Date(apiJob.lastApplicationDate).toLocaleDateString()}`
                : "Apply by 30 April",
              salary: apiJob.salaryRange || "Competitive",
            };
          });
          setJobs(mapped.slice(0, 8));
        }
      } catch (err) {
        console.warn("Could not fetch live recommended jobs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJobs();

    const refreshSaved = () => {
      const map: Record<string, boolean> = {};
      jobs.forEach((j) => {
        map[j.id] = jobsService.isJobSaved(j.id);
      });
      setSavedMap(map);
    };

    refreshSaved();
    window.addEventListener("saved_jobs_updated", refreshSaved);
    window.addEventListener("storage", refreshSaved);

    return () => {
      isMounted = false;
      window.removeEventListener("saved_jobs_updated", refreshSaved);
      window.removeEventListener("storage", refreshSaved);
    };
  }, []);

  const handleToggleSave = async (e: React.MouseEvent, job: any) => {
    e.preventDefault();
    e.stopPropagation();

    const token = typeof window !== "undefined" ? localStorage.getItem("candidate_token") : null;
    if (!token && !user) {
      router.push(`/register?redirect=/dashboard/jobs/${job.id}`);
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
        location: job.tags?.[2] || "Remote",
        tags: job.tags,
        postedDate: job.posted,
        applyByDate: job.apply,
        salaryRange: job.salary,
      });
      toast.success("Job Saved", `"${job.title}" has been saved to your jobs.`);
    }
  };

  return (
    <section className="mt-14 overflow-hidden">
      <SectionHeader
        title="Recommended jobs for you"
        copy="Curated roles based on your profile and activity to match your career goals"
      />

      {loading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      ) : jobs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-10 text-center">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No recommended jobs currently available.
          </p>
          <Link
            href="/dashboard/jobs"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2f54eb] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#2447d8] transition"
          >
            Explore All Jobs
          </Link>
        </div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{ 900: { slidesPerView: 2 }, 1180: { slidesPerView: 3 } }}
          className="mt-8 !pb-16"
        >
          {jobs.map((job) => {
            const isSaved = Boolean(savedMap[job.id]);
            return (
              <SwiperSlide key={job.id} className="h-auto">
                <article className="flex h-full min-h-[320px] flex-col rounded-2xl border border-[#e4e7ec] bg-white dark:bg-[#1a1a1a] p-6 transition-all duration-300 hover:border-[#2f54eb] hover:shadow-lg dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="line-clamp-1 text-lg font-bold text-[#101828] dark:text-white">
                        {job.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-1 text-sm text-[#667085] dark:text-slate-400">
                        {job.company}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, job)}
                      aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
                      title={isSaved ? "Saved" : "Save job"}
                      className="shrink-0 p-1.5 rounded-lg transition hover:scale-110"
                    >
                      <Bookmark
                        className={`h-5 w-5 transition ${
                          isSaved
                            ? "fill-[#2f54eb] text-[#2f54eb]"
                            : "text-[#98a2b3] hover:fill-[#2f54eb] hover:text-[#2f54eb]"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f0f4ff] px-4 py-1.5 text-xs font-medium text-[#344054] dark:bg-slate-800 dark:text-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-col gap-2.5 text-xs text-[#667085] dark:text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#2f54eb]" />
                      {job.posted}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#2f54eb]" />
                      {job.apply}
                    </span>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-[#e4e7ec] pt-4 dark:border-slate-800">
                    <p className="text-sm font-bold text-[#344054] dark:text-slate-200">{job.salary}</p>
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-[#2f54eb] px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-[#2447d8]"
                    >
                      View Job
                    </Link>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
}

function SectionHeader({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#101828] dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-[#98a2b3] dark:text-slate-400">{copy}</p>
      </div>
      <Link href="/dashboard/jobs" className="text-sm font-semibold text-[#344054] underline dark:text-slate-300">
        View all
      </Link>
    </div>
  );
}

function ResumeBanner({
  onOpenResumeBuilder,
  onOpenChat,
}: {
  onOpenResumeBuilder?: () => void;
  onOpenChat?: () => void;
}) {
  return (
    <section className="relative min-h-[420px] overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900 dark:bg-slate-900/50">
      <Image
        src="/homepage/section.png"
        alt="Professional building a resume on a laptop"
        fill
        sizes="1100px"
        className="object-cover opacity-100 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"
      />
      <div className="relative z-10 max-w-2xl px-9 py-14 md:px-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-sm font-semibold italic text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
          <span className="h-3 w-3 rounded-full bg-blue-800 ring-2 ring-blue-100" />
          AI-Powered
        </span>
        <h2 className="mt-8 text-2xl font-black text-slate-950 dark:text-white">
          No resume? <span className="text-blue-700 dark:text-blue-500">No problem</span>
        </h2>
        <ul className="mt-8 space-y-7 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Create or improve your resume with AI-powered assistance",
            "Enhance your resume with smart, personalized suggestions",
            "Optimize your resume to match job requirements instantly",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full border-2 border-blue-700" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenResumeBuilder}
            className="h-12 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800 shadow-md"
          >
            Create Resume
          </button>
          <button
            onClick={onOpenChat}
            className="h-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-6 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-white dark:hover:bg-slate-800"
          >
            AI Assistant
          </button>
        </div>
      </div>
    </section>
  );
}
