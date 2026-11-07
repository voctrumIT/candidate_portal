"use client";

import Image from "next/image";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Phone,
  Search,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VoctrumAIChat from "./components/VoctrumAIChat";
import ResumeBuilderModal from "../components/ResumeBuilderModal";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { jobsService } from "../../services/jobs";

import "swiper/css";
import "swiper/css/pagination";

const jobs = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "Niscala.io - San Francisco",
    tags: ["Remote", "Full-time", "Senior"],
    posted: "Posted 2 days ago",
    apply: "Apply by 30 April",
    salary: "₹520k - 660k/yr",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "SAMTIV - New York",
    tags: ["Onsite", "Part-time"],
    posted: "Posted 2 days ago",
    apply: "Apply by 30 April",
    salary: "₹920k - 960k/yr",
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "UNICA - Berlin",
    tags: ["Onsite", "Senior"],
    posted: "Posted 1 day ago",
    apply: "Apply by 18 May",
    salary: "₹720k - 960k/yr",
  },
  {
    id: "4",
    title: "Product Manager",
    company: "Quantify - Mumbai",
    tags: ["Hybrid", "Full-time"],
    posted: "Posted 3 days ago",
    apply: "Apply by 12 May",
    salary: "₹780k - 940k/yr",
  },
];

interface ApplicationItem {
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

const defaultApplications: ApplicationItem[] = [
  {
    id: "app-1",
    jobId: "2",
    title: "Full Stack Engineer",
    company: "SAMTIV",
    location: "New York, USA (Remote)",
    type: "Full-time",
    salary: "₹920k - 960k/yr",
    appliedDate: "Applied 2 days ago",
    currentStep: 3,
    status: "Interview",
    statusNote: "Technical Discussion Round 2 scheduled with Engineering Lead.",
    badgeColor: "indigo",
    interviewDate: "Fri, Nov 8 • 3:00 PM EST",
  },
  {
    id: "app-2",
    jobId: "1",
    title: "Senior Product Designer",
    company: "Niscala.io",
    location: "San Francisco, USA",
    type: "Full-time",
    salary: "₹520k - 660k/yr",
    appliedDate: "Applied 4 days ago",
    currentStep: 2,
    status: "In Review",
    statusNote: "Application under hiring manager portfolio review.",
    badgeColor: "amber",
  },
  {
    id: "app-3",
    jobId: "3",
    title: "Data Scientist",
    company: "UNICA",
    location: "Berlin, Germany",
    type: "Full-time",
    salary: "₹720k - 960k/yr",
    appliedDate: "Applied 1 week ago",
    currentStep: 2,
    status: "Shortlisted",
    statusNote: "Candidate shortlisted for algorithmic interview stage.",
    badgeColor: "emerald",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);
  const [applications] = useState<ApplicationItem[]>(defaultApplications);
  const [appCount, setAppCount] = useState<number>(defaultApplications.length);
  const [savedJobsCount, setSavedJobsCount] = useState<number>(8);

  useEffect(() => {
    async function loadData() {
      try {
        const liveApps = await jobsService.getApplications();
        if (liveApps && Array.isArray(liveApps) && liveApps.length > 0) {
          setAppCount(liveApps.length);
        }
      } catch {
        // Fallback
      }

      try {
        const saved = await jobsService.getSavedJobs();
        if (saved && Array.isArray(saved) && saved.length > 0) {
          setSavedJobsCount(saved.length);
        }
      } catch {
        // Fallback
      }
    }

    loadData();

    const handleSavedUpdated = async () => {
      try {
        const saved = await jobsService.getSavedJobs();
        if (saved && Array.isArray(saved) && saved.length > 0) {
          setSavedJobsCount(saved.length);
        }
      } catch {}
    };

    window.addEventListener("saved_jobs_updated", handleSavedUpdated);
    window.addEventListener("storage", handleSavedUpdated);
    return () => {
      window.removeEventListener("saved_jobs_updated", handleSavedUpdated);
      window.removeEventListener("storage", handleSavedUpdated);
    };
  }, []);

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
    <div className="px-10 py-7 space-y-10">
      {/* Search Header */}
      <div>
        <div className="mb-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Welcome back, {candidateFirstName}!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track your job applications, interview invites, and matching career opportunities.
          </p>
        </div>
        <SearchBar />
      </div>

      {/* Overview Cards: Active Jobs, Applications, Saved, Interviews */}
      <OverviewCards applicationCount={appCount} savedCount={savedJobsCount} />

      {/* Application Status Tracker Section */}
      <ApplicationStatusSection applications={applications} />

      {/* Recommended Jobs Carousel */}
      <RecommendedJobs />

      {/* AI Resume Banner */}
      <ResumeBanner
        onOpenResumeBuilder={handleOpenResumeBuilder}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Platform & Community Stats */}
      <ActiveUsers />

      {/* App Download Promo */}
      <AppDownload />

      {/* Modals */}
      <VoctrumAIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ResumeBuilderModal
        isOpen={isResumeBuilderOpen}
        onClose={() => setIsResumeBuilderOpen(false)}
      />
    </div>
  );
}

function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/dashboard/jobs?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/dashboard/jobs");
    }
  };

  return (
    <div className="mx-auto flex h-14 w-full items-center gap-4 rounded-full bg-[#e9edff] px-6 dark:bg-slate-800">
      <Search className="h-5 w-5 shrink-0 text-[#2f54eb]" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Enter skills / designations / companies"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#667085] dark:text-slate-400 dark:text-white"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2f54eb] px-6 text-sm font-bold text-white transition hover:bg-[#2447d8]"
      >
        <Filter className="h-4 w-4" />
        Filter
      </button>
      <button
        type="button"
        onClick={handleSearch}
        className="h-11 rounded-full bg-[#2f54eb] px-7 text-sm font-bold text-white transition hover:bg-[#2447d8]"
      >
        Search Jobs
      </button>
    </div>
  );
}

function OverviewCards({ applicationCount, savedCount }: { applicationCount: number; savedCount: number }) {
  const cards = [
    {
      title: "Active Jobs",
      count: "1,420+",
      subtext: "Matching your profile",
      badge: "48 New Today",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
      icon: BriefcaseBusiness,
      iconBg: "bg-blue-50 text-[#2f54eb] dark:bg-blue-950/60 dark:text-blue-400",
      href: "/dashboard/jobs",
      actionText: "Explore Live Jobs",
    },
    {
      title: "Applications",
      count: applicationCount.toString(),
      subtext: "Active recruiter reviews",
      badge: `${applicationCount} In Review`,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
      icon: Send,
      iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
      href: "/dashboard/my-jobs",
      actionText: "View Applications",
    },
    {
      title: "Saved Jobs",
      count: savedCount.toString(),
      subtext: "Saved for quick apply",
      badge: "Quick Apply Ready",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      icon: Bookmark,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      href: "/dashboard/my-jobs",
      actionText: "Review Saved Jobs",
    },
    {
      title: "Interviews",
      count: "2",
      subtext: "Next: Nov 8, SAMTIV",
      badge: "Round 2 Ready",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      icon: CalendarCheck2,
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
      href: "/dashboard/my-jobs",
      actionText: "Prepare Schedule",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 dark:border-slate-800 dark:bg-[#1a1a1a]"
            >
              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} transition-transform group-hover:scale-105`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Big Metric & Label */}
                <div className="mt-4">
                  <div className="text-3xl font-extrabold tracking-tight text-[#101828] dark:text-white">
                    {card.count}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {card.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#667085] dark:text-slate-400">
                    {card.subtext}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2f54eb] hover:text-[#2447d8] dark:text-blue-400 transition"
                >
                  <span>{card.actionText}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ApplicationStatusSection({ applications }: { applications: ApplicationItem[] }) {
  const [filter, setFilter] = useState<string>("All");

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
          classes: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
          dotColor: "bg-indigo-600",
        };
      case "In Review":
        return {
          label: "Under Review",
          classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
          dotColor: "bg-amber-500",
        };
      case "Shortlisted":
        return {
          label: "Shortlisted",
          classes: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
          dotColor: "bg-emerald-600",
        };
      default:
        return {
          label: "Application Submitted",
          classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
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
            <span className="inline-flex items-center rounded-full bg-[#f0f4ff] px-2.5 py-0.5 text-xs font-semibold text-[#2f54eb] dark:bg-slate-800 dark:text-blue-400">
              {applications.length} Active
            </span>
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

      {/* Applications List */}
      <div className="mt-6 space-y-4">
        {filteredApps.map((app) => {
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
        })}
      </div>

      {/* Footer link to My Jobs */}
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
    </section>
  );
}

function RecommendedJobs() {
  const router = useRouter();
  const { user } = useAuth();
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
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
    } else {
      await jobsService.saveJob(job.id, {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.company.includes("-") ? job.company.split("-")[1].trim() : "Remote",
        tags: job.tags,
        postedDate: job.posted,
        applyByDate: job.apply,
        salaryRange: job.salary,
      });
    }
  };

  return (
    <section className="mt-14 overflow-hidden">
      <SectionHeader title="Recommended jobs for you" copy="Curated roles based on your profile and activity to match your career goals" />
      <Swiper modules={[Pagination, Autoplay]} slidesPerView={1} spaceBetween={20} pagination={{ clickable: true }} autoplay={{ delay: 3000, disableOnInteraction: false }} breakpoints={{ 900: { slidesPerView: 2 }, 1180: { slidesPerView: 3 } }} className="mt-8 !pb-16">
        {jobs.map((job) => {
          const isSaved = Boolean(savedMap[job.id]);
          return (
            <SwiperSlide key={job.id} className="h-auto">
              <article className="flex h-full min-h-[320px] flex-col rounded-2xl border border-[#e4e7ec] bg-white dark:bg-[#1a1a1a] p-6 transition-all duration-300 hover:border-[#2f54eb] hover:shadow-lg dark:border-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="line-clamp-1 text-lg font-bold text-[#101828] dark:text-white">{job.title}</h3>
                    <p className="mt-1.5 line-clamp-1 text-sm text-[#667085] dark:text-slate-400">{job.company}</p>
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
                  {job.tags.map((tag) => <span key={tag} className="rounded-full bg-[#f0f4ff] px-4 py-1.5 text-xs font-medium text-[#344054] dark:bg-slate-800 dark:text-slate-200">{tag}</span>)}
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
      <Link href="/dashboard/my-jobs" className="text-sm font-semibold text-[#344054] underline dark:text-slate-300">
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
      <Image src="/homepage/section.png" alt="Professional building a resume on a laptop" fill sizes="1100px" className="object-cover opacity-100 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen" />
      <div className="relative z-10 max-w-2xl px-9 py-14 md:px-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-sm font-semibold italic text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
          <span className="h-3 w-3 rounded-full bg-blue-800 ring-2 ring-blue-100" />
          AI-Powered
        </span>
        <h2 className="mt-8 text-2xl font-black text-slate-950 dark:text-white">No resume? <span className="text-blue-700 dark:text-blue-500">No problem</span></h2>
        <ul className="mt-8 space-y-7 text-sm text-slate-600 dark:text-slate-300">
          {["Create or improve your resume with AI-powered assistance", "Enhance your resume with smart, personalized suggestions", "Optimize your resume to match job requirements instantly"].map((item) => (
            <li key={item} className="flex items-center gap-3"><span className="h-3 w-3 rounded-full border-2 border-blue-700" />{item}</li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button onClick={onOpenResumeBuilder} className="h-12 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800 shadow-md">Create Resume</button>
          <button onClick={onOpenChat} className="h-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-6 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-white dark:hover:bg-slate-800">AI Assistant</button>
        </div>
      </div>
    </section>
  );
}

function ActiveUsers() {
  return (
    <section className="py-14">
      <h2 className="text-lg font-extrabold text-[#101828] dark:text-white">Active users</h2>
      <div className="mt-6 flex items-center gap-16">
        <div>
          <p className="text-8xl font-black leading-none text-[#172a78] dark:text-blue-500">20k+</p>
        </div>
        <Image src="/userdash/3d204399488638237ac87e5ffd3c504d59af71a7.png" alt="Active users" width={280} height={160} className="h-auto w-72 object-contain" />
      </div>
      <div className="mt-10 grid grid-cols-4 gap-8">
        {[
          ["Opportunities", "140K+"],
          ["Organisations", "42K+"],
          ["Brands Trust Us", "800+"],
          ["Countries", "78+"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-sm text-[#98a2b3] dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#172a78] dark:text-blue-500">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AppDownload() {
  return (
    <section className="mb-16 grid items-center gap-10 rounded-xl bg-slate-50 dark:bg-slate-900 px-7 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-16 dark:bg-slate-900/50">
      <div>
        <h2 className="max-w-xl text-2xl font-black leading-tight text-slate-950 md:text-3xl dark:text-white">Join thousands of users already using our <span className="text-blue-700 dark:text-blue-500">Voctrum app</span></h2>
        <p className="mt-7 text-sm text-slate-400">Access real-time job updates and apply seamlessly from your mobile device</p>
        <div className="mt-8 flex max-w-[520px] items-center rounded-full bg-[#eaf0ff] p-2 shadow-inner dark:bg-slate-800">
          <Phone className="ml-4 h-5 w-5 shrink-0 text-blue-700 dark:text-blue-500" />
          <input aria-label="Mobile number" placeholder="Enter your mobile number" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-500 dark:text-slate-400 dark:text-white" />
          <button className="h-9 shrink-0 rounded-full bg-blue-700 px-5 text-xs font-bold text-white transition hover:bg-blue-800">Get App Link</button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/dashboard/download" className="inline-flex h-12 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold !text-white transition hover:bg-slate-800 dark:bg-white dark:bg-[#1a1a1a] dark:text-slate-950"><FaGooglePlay className="h-5 w-5" />Google Play</Link>
          <Link href="/dashboard/download" className="inline-flex h-12 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold !text-white transition hover:bg-slate-800 dark:bg-white dark:bg-[#1a1a1a] dark:text-slate-950"><FaApple className="h-6 w-6" />App Store</Link>
          <Link href="/dashboard/download" className="grid h-24 w-24 place-items-center rounded border border-slate-300 bg-white dark:bg-[#1a1a1a] text-center text-xs font-medium text-slate-500 dark:text-slate-400 dark:border-slate-700 dark:bg-slate-800 hover:border-[#2f54eb] transition">QR<br />Scan to download</Link>
        </div>
      </div>
      <div className="flex justify-center gap-5">
        <Image src="/homepage/m2.png" alt="Voctrum recommended jobs app screen" width={210} height={430} className="h-auto w-36 md:w-44" />
        <Image src="/homepage/m1.png" alt="Voctrum saved jobs app screen" width={210} height={430} className="h-auto w-36 md:w-44" />
      </div>
    </section>
  );
}
