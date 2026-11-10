"use client";

import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  Flame,
  Layers,
  MapPin,
  Phone,
  Search,
  Send,
  Sparkles,
  TrendingUp,
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
    location: "San Francisco, USA (Remote)",
    type: "Full-time",
    salary: "₹520k - 660k/yr",
    appliedDate: "Applied 3 days ago",
    currentStep: 2,
    status: "In Review",
    statusNote: "Portfolio & design challenge being evaluated by Hiring Team.",
    badgeColor: "amber",
  },
  {
    id: "app-3",
    jobId: "4",
    title: "Product Manager",
    company: "Quantify",
    location: "Mumbai, India (Hybrid)",
    type: "Full-time",
    salary: "₹780k - 940k/yr",
    appliedDate: "Applied 5 days ago",
    currentStep: 2,
    status: "Shortlisted",
    statusNote: "Profile shortlisted. Recruiter will coordinate interview schedule shortly.",
    badgeColor: "emerald",
  },
  {
    id: "app-4",
    jobId: "3",
    title: "Data Scientist",
    company: "UNICA",
    location: "Berlin, Germany (Onsite)",
    type: "Full-time",
    salary: "₹720k - 960k/yr",
    appliedDate: "Applied 1 week ago",
    currentStep: 1,
    status: "Applied",
    statusNote: "Application received and queued for initial talent screening.",
    badgeColor: "blue",
  },
];

export default function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationItem[]>(defaultApplications);
  const [appCount, setAppCount] = useState<number>(defaultApplications.length);
  const { user } = useAuth();

  useEffect(() => {
    async function loadApplications() {
      try {
        const liveApps = await jobsService.getApplications();
        if (liveApps && Array.isArray(liveApps) && liveApps.length > 0) {
          setAppCount(liveApps.length);
        }
      } catch {
        // Fallback to default realistic candidate applications
      }
    }
    loadApplications();
  }, []);

  const candidateFirstName =
    user?.firstName ||
    (user?.name ? user.name.split(" ")[0] : "Candidate");

  return (
    <div className="px-6 py-6 md:px-10 md:py-8 space-y-10">
      {/* Welcome & Overview Header */}
      <section className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#101828] dark:text-white">
              Welcome back, {candidateFirstName} 👋
            </h1>
            <p className="mt-1 text-sm font-medium text-[#667085] dark:text-slate-400">
              Here is what is happening with your job applications and search activity today.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Profile Active
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        {/* <div className="mt-3">
          <SearchBar />
        </div> */}
      </section>

      {/* Overview Cards: Active Jobs, Applications, Saved, Interviews */}
      {/* <OverviewCards applicationCount={appCount} /> */}

      {/* Application Status Tracker Section */}
      <ApplicationStatusSection applications={applications} />

      {/* Recommended Jobs Carousel */}
      <RecommendedJobs />

      {/* AI Resume Banner */}
      <ResumeBanner
        onOpenResumeBuilder={() => setIsResumeBuilderOpen(true)}
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
    <div className="flex h-14 w-full items-center gap-3 rounded-2xl bg-white dark:bg-[#1a1a1a] px-5 shadow-sm border border-slate-200/80 dark:border-slate-800 transition focus-within:border-[#2f54eb] focus-within:ring-2 focus-within:ring-[#2f54eb]/10">
      <Search className="h-5 w-5 shrink-0 text-[#2f54eb]" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search jobs by title, skill, or company (e.g. React, UX Designer, Google)..."
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3] dark:text-white dark:placeholder:text-slate-500"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
      >
        <Filter className="h-3.5 w-3.5" />
        Filters
      </button>
      <button
        type="button"
        onClick={handleSearch}
        className="h-10 rounded-xl bg-[#2f54eb] px-5 text-xs sm:text-sm font-semibold !text-white transition hover:bg-[#2447d8] shadow-sm shrink-0"
      >
        Search Jobs
      </button>
    </div>
  );
}

function OverviewCards({ applicationCount }: { applicationCount: number }) {
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
      badge: "3 In Review",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
      icon: Send,
      iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
      href: "/dashboard/my-jobs",
      actionText: "View Applications",
    },
    {
      title: "Saved Jobs",
      count: "8",
      subtext: "Saved for quick apply",
      badge: "2 Closing Soon",
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
          <span>View All in My Jobs</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

function RecommendedJobs() {
  return (
    <section className="overflow-hidden">
      <SectionHeader
        title="Recommended Jobs for You"
        copy="Curated roles based on your profile, activity, and career goals"
      />
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        breakpoints={{
          900: { slidesPerView: 2 },
          1180: { slidesPerView: 3 },
        }}
        className="mt-6 !pb-14"
      >
        {jobs.map((job) => (
          <SwiperSlide key={job.id} className="h-auto">
            <article className="flex h-full min-h-[300px] flex-col rounded-2xl border border-slate-200/90 bg-white p-6 transition-all duration-300 hover:border-[#2f54eb] hover:shadow-lg dark:border-slate-800 dark:bg-[#1a1a1a]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="line-clamp-1 text-base font-bold text-[#101828] dark:text-white">
                    {job.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs sm:text-sm text-[#667085] dark:text-slate-400">
                    {job.company}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Bookmark job"
                  className="shrink-0 rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Bookmark className="h-5 w-5 text-[#98a2b3] transition hover:fill-[#2f54eb] hover:text-[#2f54eb]" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#f0f4ff] px-3 py-1 text-xs font-medium text-[#344054] dark:bg-slate-800 dark:text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 text-xs text-[#667085] dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#2f54eb]" />
                  {job.posted}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-[#2f54eb]" />
                  {job.apply}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="text-sm font-bold text-[#172a78] dark:text-blue-400">
                  {job.salary}
                </p>
                <Link
                  href={`/dashboard/jobs/${job.id}`}
                  className="inline-flex items-center justify-center rounded-lg bg-[#2f54eb] px-4 py-2 text-xs font-semibold !text-white transition hover:bg-[#2447d8] shadow-xs"
                >
                  View Job
                </Link>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function SectionHeader({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#101828] dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#667085] dark:text-slate-400">
          {copy}
        </p>
      </div>
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2f54eb] hover:underline dark:text-blue-400 shrink-0"
      >
        <span>View all jobs</span>
        <ArrowRight className="h-3.5 w-3.5" />
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
    <section className="relative min-h-[380px] overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-[#172a78] text-white p-8 md:p-14 shadow-md">
      <div className="relative z-10 max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-3.5 py-1 text-xs font-semibold text-blue-200 border border-white/20">
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          AI-Powered Career Toolkit
        </span>

        <h2 className="mt-6 text-2xl sm:text-3xl font-black leading-tight text-white">
          No resume ready? <br />
          <span className="text-blue-300">Create one in minutes</span>
        </h2>

        <p className="mt-3 text-sm text-blue-100 leading-relaxed">
          Enhance your hiring chances with ATS-friendly templates, AI-guided bullet points, and personalized job matching keywords.
        </p>

        <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-blue-100/90">
          {[
            "Create or improve your resume with AI-powered assistance",
            "Tailor summaries and skills directly for recruiter screening",
            "Download instant PDF exports ready to submit",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenResumeBuilder}
            className="h-11 rounded-xl bg-white px-6 text-xs sm:text-sm font-bold !text-[#172a78] transition hover:bg-blue-50 shadow-md"
          >
            Create Resume Now
          </button>
          <button
            type="button"
            onClick={onOpenChat}
            className="h-11 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Ask AI Assistant
          </button>
        </div>
      </div>
    </section>
  );
}

function ActiveUsers() {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1a]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2f54eb] dark:text-blue-400">
            Trusted Platform
          </span>
          <h2 className="mt-1 text-2xl font-black text-[#101828] dark:text-white">
            Connecting Talent Globally
          </h2>
          <p className="mt-2 text-sm text-[#667085] dark:text-slate-400 max-w-md">
            Join thousands of active professionals getting hired at leading technology and enterprise organizations.
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-black tracking-tight text-[#172a78] dark:text-blue-400">
              20k+
            </span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Active candidates hired
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
          {[
            ["Opportunities", "140K+"],
            ["Companies", "42K+"],
            ["Partner Brands", "800+"],
            ["Countries", "78+"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-medium text-[#667085] dark:text-slate-400">{label}</p>
              <p className="mt-1.5 text-2xl font-black text-[#172a78] dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppDownload() {
  return (
    <section className="mb-10 grid items-center gap-10 rounded-2xl bg-[#fafbfc] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 px-7 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-14">
      <div>
        <h2 className="max-w-xl text-2xl font-black leading-tight text-[#101828] md:text-3xl dark:text-white">
          Take your job hunt everywhere with the{" "}
          <span className="text-[#2f54eb] dark:text-blue-400">Voctrum App</span>
        </h2>
        <p className="mt-3 text-sm text-[#667085] dark:text-slate-400 max-w-lg">
          Receive real-time interview invitations, direct recruiter messages, and apply on the go.
        </p>

        <div className="mt-6 flex max-w-[500px] items-center rounded-2xl bg-white p-2 shadow-xs border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <Phone className="ml-3 h-5 w-5 shrink-0 text-[#2f54eb] dark:text-blue-400" />
          <input
            aria-label="Mobile number"
            placeholder="Enter your phone number..."
            className="min-w-0 flex-1 bg-transparent px-3 text-xs sm:text-sm outline-none placeholder:text-[#98a2b3] dark:text-white"
          />
          <button
            type="button"
            className="h-9 shrink-0 rounded-xl bg-[#2f54eb] px-4 text-xs font-bold !text-white transition hover:bg-[#2447d8]"
          >
            Send Link
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/download"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-semibold !text-white transition hover:bg-slate-800 dark:bg-white dark:!text-slate-950"
          >
            <FaGooglePlay className="h-4 w-4" />
            Google Play
          </Link>
          <Link
            href="/dashboard/download"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-semibold !text-white transition hover:bg-slate-800 dark:bg-white dark:!text-slate-950"
          >
            <FaApple className="h-5 w-5" />
            App Store
          </Link>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Image
          src="/homepage/m2.png"
          alt="Voctrum recommended jobs app screen"
          width={210}
          height={430}
          className="h-auto w-32 sm:w-40 drop-shadow-md"
        />
        <Image
          src="/homepage/m1.png"
          alt="Voctrum saved jobs app screen"
          width={210}
          height={430}
          className="h-auto w-32 sm:w-40 drop-shadow-md"
        />
      </div>
    </section>
  );
}
