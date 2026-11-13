"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Briefcase,
  FileText,
  User,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { jobsService, parseApplicationStatus } from "../../../../services/jobs";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "../../../components/Toast";
import { stripHtml } from "../../../components/JobOverviewRenderer";

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, tenant } = useAuth();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const data = await jobsService.getApplicationById(id);
        if (isMounted) {
          setApplication(data);
        }
      } catch (err) {
        console.error("Failed to fetch application details:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] px-6 py-10 md:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-44 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="h-96 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-96 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-[80vh] px-6 py-16 md:px-12">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-[#1a1a1a]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Application Not Found
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            We couldn&apos;t locate the requested application record. It may have been updated or moved.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => router.push("/dashboard/my-jobs")}
              className="rounded-xl bg-[#2f54eb] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2447d8]"
            >
              Back to My Applications
            </button>
            <button
              onClick={() => router.push("/dashboard/jobs")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const job = application.fullJob || application.job || {};
  const statusInfo = parseApplicationStatus(application.applicationStatus || application.rawStatus || application.status);
  const companyName = job.companyName || application.company || tenant?.companyName || "Voctrum Partner";
  const jobTitle = job.jobTitle || job.title || application.title || "Job Opportunity";
  const location = job.location || (Array.isArray(job.locations) ? job.locations.join(", ") : application.location) || "Remote";
  const salary = job.salaryRange || application.salaryRange || "Competitive";
  const appliedDateStr = application.applyDate
    ? new Date(application.applyDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently applied";

  const appReferenceId = application.jobApplicationId
    ? `APP-${String(application.jobApplicationId).slice(-6).toUpperCase()}`
    : `APP-${String(id).slice(-6).toUpperCase()}`;

  // Timeline stage definitions for the vertical bar
  const currentStep = statusInfo.currentStep || 1;
  const isRejected = statusInfo.rawStatus === "rejected";

  const stages = [
    {
      id: 1,
      title: "Application Submitted & Received",
      shortDesc: "Your application materials were received and confirmed.",
      detailedDesc:
        "Your resume, contact details, and candidate profile were successfully recorded in the employer's applicant tracking system. An automated confirmation was generated and queued for hiring manager triage.",
      date: appliedDateStr,
      badge: "Completed",
      type: "submitted",
    },
    {
      id: 2,
      title: "Resume & Qualification Screening",
      shortDesc: "Hiring team assesses alignment with role requirements.",
      detailedDesc:
        "A technical recruiter and hiring team member evaluate your experience, verified skills, and background against role criteria. Candidates meeting benchmark requirements advance to candidate shortlisting.",
      date: currentStep >= 2 ? "Completed" : "Estimated 1–3 business days",
      badge: currentStep >= 2 ? "Completed" : currentStep === 1 ? "In Progress" : "Pending",
      type: "screening",
    },
    {
      id: 3,
      title: "Recruiter Review & Shortlisting",
      shortDesc: "Candidate profile shortlisted for direct interview rounds.",
      detailedDesc:
        "Your profile has been marked as high potential. The hiring manager is reviewing candidate scorecards and setting up available interview slots.",
      date: currentStep >= 3 ? "Completed" : currentStep === 2 ? "In Progress" : "Upcoming",
      badge: currentStep >= 3 ? "Completed" : currentStep === 2 ? "In Progress" : "Upcoming",
      type: "shortlisted",
    },
    {
      id: 4,
      title: "Interview & Technical Evaluation",
      shortDesc: "Panel discussion, behavioral, and technical evaluation rounds.",
      detailedDesc:
        currentStep >= 4 && application.interviewDate
          ? `Interview scheduled on ${application.interviewDate}. Please check your calendar invite for the video meeting link and preparation notes.`
          : "Structured interviews with the hiring manager and future team members to evaluate domain expertise, technical depth, and cultural alignment.",
      date: application.interviewDate || (currentStep >= 4 ? "Scheduled" : "Pending prior rounds"),
      badge:
        currentStep === 4
          ? "Active Stage"
          : currentStep > 4
          ? "Completed"
          : "Upcoming",
      type: "interview",
    },
    {
      id: 5,
      title: isRejected ? "Application Status Finalized" : "Final Decision & Offer",
      shortDesc: isRejected
        ? "Candidate selection completed for this cycle."
        : "Formal offer package, compensation, and onboarding documentation.",
      detailedDesc: isRejected
        ? "Thank you for taking the time to apply. While the team chose to proceed with other candidates whose profiles align more closely with immediate project requirements, your profile is retained for future openings."
        : "Final review by department leadership, background check completion, and preparation of the official offer letter outlining compensation, benefits, and start date.",
      date: currentStep >= 5 ? "Finalized" : "Upcoming",
      badge: isRejected ? "Closed" : currentStep >= 5 ? "Offer Ready" : "Pending",
      type: "decision",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-16 pt-8 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/dashboard/my-jobs"
              className="inline-flex items-center gap-1 hover:text-[#2f54eb] dark:hover:text-blue-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to My Applications</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">
              Application Details
            </span>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#18181b] sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#172a78] to-[#2f54eb] text-xl font-black text-white shadow-md">
                {companyName.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {jobTitle}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusInfo.badgeClass}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${statusInfo.dotColor}`} />
                    {statusInfo.statusLabel}
                  </span>
                </div>

                <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    {companyName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {location}
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-[#2f54eb]" />
                    Applied: {appliedDateStr}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                    Ref: {appReferenceId}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Salary: {salary}
                  </span>
                </div>
              </div>
            </div>

            {/* Recruiter Notice Pill */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-left dark:border-blue-900/40 dark:bg-blue-950/20 md:max-w-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2f54eb] dark:text-blue-400">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>Application Status Update</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                {application.statusNote || statusInfo.statusNote}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Main Content Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* LEFT: VERTICAL BAR APPLICATION FLOW & STAGES */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#18181b] sm:p-8">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Application Flow &amp; Recruitment Stages
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Vertical progress tracker representing live candidate evaluation milestones
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Stage {Math.min(currentStep, 5)} of 5
                </span>
              </div>

              {/* VERTICAL BAR STEPPER */}
              <div className="relative pl-6 sm:pl-8">
                {/* Continuous Vertical Connecting Bar */}
                <div className="absolute bottom-6 left-6 top-6 w-[3px] -translate-x-1/2 bg-slate-200 dark:bg-slate-800 sm:left-8" />
                
                {/* Active Colored Portion of the Vertical Bar */}
                <div
                  className="absolute left-6 top-6 w-[3px] -translate-x-1/2 bg-gradient-to-b from-[#2f54eb] via-indigo-600 to-blue-500 transition-all duration-700 sm:left-8"
                  style={{
                    height: `${Math.min(((currentStep - 1) / 4) * 100, 100)}%`,
                  }}
                />

                <div className="space-y-8">
                  {stages.map((stage) => {
                    const isCompleted = stage.id < currentStep;
                    const isCurrent = stage.id === currentStep;
                    const isUpcoming = stage.id > currentStep;

                    return (
                      <div key={stage.id} className="relative flex items-start gap-4 sm:gap-6">
                        {/* Node Icon on the Vertical Bar */}
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                            isCompleted
                              ? "bg-[#2f54eb] text-white shadow-md ring-4 ring-blue-500/15"
                              : isCurrent
                              ? "border-2 border-[#2f54eb] bg-white text-[#2f54eb] shadow-lg ring-4 ring-blue-500/25 dark:bg-[#18181b]"
                              : "border-2 border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-[#18181b]"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : isCurrent ? (
                            <span className="relative flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2f54eb] opacity-75" />
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#2f54eb]" />
                            </span>
                          ) : (
                            <span>{stage.id}</span>
                          )}
                        </div>

                        {/* Stage Details Content */}
                        <div
                          className={`flex-1 rounded-xl border p-4.5 transition-all ${
                            isCurrent
                              ? "border-blue-200 bg-blue-50/30 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/10"
                              : "border-slate-100 bg-[#fafbfc] dark:border-slate-800/80 dark:bg-[#1f1f23]"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3
                              className={`text-sm font-bold ${
                                isCurrent
                                  ? "text-[#2f54eb] dark:text-blue-400"
                                  : isCompleted
                                  ? "text-slate-900 dark:text-white"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {stage.title}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                isCompleted
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : isCurrent
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 animate-pulse"
                                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                            >
                              {stage.badge}
                            </span>
                          </div>

                          <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                            {stage.shortDesc}
                          </p>

                          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            {stage.detailedDesc}
                          </p>

                          <div className="mt-3 flex items-center justify-between border-t border-slate-100/80 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              {stage.date}
                            </span>
                            {isCurrent && (
                              <span className="font-semibold text-[#2f54eb] dark:text-blue-400">
                                Active Current Stage
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: JOB DETAILS & CANDIDATE SNAPSHOT */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#18181b]">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Job Overview &amp; Specifications
              </h2>

              <div className="mt-4 space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Job Title</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">
                    {jobTitle}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Hiring Company</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {companyName}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Workplace Type</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {location}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Offered Salary</span>
                  <span className="font-bold text-[#2f54eb] dark:text-blue-400">
                    {salary}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Reference ID</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                    {appReferenceId}
                  </span>
                </div>
              </div>

              {/* Job Description Summary */}
              <div className="mt-5">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  About the Role
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-4">
                  {stripHtml(job.overview || job.jobDescription) ||
                    "This position involves contributing to product engineering, collaborating with cross-functional teams, and building scalable software solutions."}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="mt-5">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Required &amp; Preferred Skills
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(job.keySkills || ["React", "TypeScript", "Node.js", "REST APIs"]).map(
                    (skill: string) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#2f54eb] dark:bg-blue-950/40 dark:text-blue-300"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                <Link
                  href={`/dashboard/jobs/${application.jobId || job.jobId || id}`}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <span>Open Full Job Details</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Submitted Candidate Details Card (moved under Job Overview & Specifications) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#18181b]">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Candidate Submission Snapshot
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Verified candidate information submitted with this application
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-[#fafbfc] p-3 dark:border-slate-800 dark:bg-[#1f1f23]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Candidate Name
                  </span>
                  <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || "Registered Candidate"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-[#fafbfc] p-3 dark:border-slate-800 dark:bg-[#1f1f23]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Contact Email
                  </span>
                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-900 dark:text-white">
                    {user?.email || "candidate@email.com"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-[#fafbfc] p-3 dark:border-slate-800 dark:bg-[#1f1f23]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Phone Number
                  </span>
                  <p className="mt-0.5 text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {user?.contactNumber || user?.phone || "Provided on profile"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-[#fafbfc] p-3 dark:border-slate-800 dark:bg-[#1f1f23]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Current Location
                  </span>
                  <p className="mt-0.5 text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {user?.currentLocation || user?.city || location || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Submitted Resume Pill */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-[#1f1f23]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2f54eb] dark:bg-blue-950/40 dark:text-blue-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Profile Resume / CV
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Attached to application
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/profile"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <User className="h-3 w-3 text-[#2f54eb]" />
                  <span>View Profile</span>
                </Link>
              </div>

              {application.note && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-[#fafbfc] p-3.5 dark:border-slate-800 dark:bg-[#1f1f23]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Application Note / Cover Message
                  </span>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    &ldquo;{application.note}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

