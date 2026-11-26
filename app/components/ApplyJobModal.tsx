"use client";

import { useState, useEffect, useId } from "react";
import {
  X,
  Send,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { jobsService } from "../../services/jobs";
import { documentsService } from "../../services/documents";
import { emailService } from "../../services/email";
import { toast } from "./Toast";

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  jobCompany: string;
  salaryRange?: string;
  location?: string;
  tenantId?: string;
  onSuccess: () => void;
}

const NOTICE_PERIOD_OPTIONS = [
  "Immediate Joiner (Available Now)",
  "15 Days or less",
  "30 Days (1 Month)",
  "45 Days",
  "60 Days (2 Months)",
  "90 Days (3 Months)",
  "Serving Notice Period",
];

export default function ApplyJobModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  jobCompany,
  salaryRange,
  location,
  tenantId,
  onSuccess,
}: ApplyJobModalProps) {
  const { user, tenant } = useAuth();

  const [currentCtc, setCurrentCtc] = useState("");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("30 Days (1 Month)");
  const [note, setNote] = useState("");
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const currentCtcId = useId();
  const ctcId = useId();
  const noticeId = useId();
  const noteId = useId();

  // Load active candidate resume details
  useEffect(() => {
    if (!isOpen) return;

    setGeneralError("");
    setFieldErrors({});

    let activeName: string | null = null;
    let activeUrl: string | null = null;

    if (typeof window !== "undefined") {
      activeName = localStorage.getItem("candidate_active_resume_name");
      activeUrl = localStorage.getItem("candidate_active_resume_url");
      if (activeName) setResumeName(activeName);
      if (activeUrl) setResumeUrl(activeUrl);
    }

    // Verify with documentsService if no active resume or to confirm URL
    const fetchDoc = async () => {
      try {
        const docs = await documentsService.getDocuments();
        if (Array.isArray(docs) && docs.length > 0) {
          const matched =
            docs.find((d: any) => (activeUrl && d.fileUrl === activeUrl) || (activeName && (d.name === activeName || d.fileName === activeName))) || docs[0];
          if (matched) {
            setResumeName(matched.name || matched.fileName || activeName || "Candidate_Resume.pdf");
            setResumeUrl(matched.fileUrl || matched.url || activeUrl || null);
          }
        }
      } catch {}
    };
    fetchDoc();
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    const cleanCurrentCtc = currentCtc.trim();
    if (!cleanCurrentCtc) {
      errs.currentCtc = "Current CTC is required.";
    }

    const cleanCtc = expectedCtc.trim();
    if (!cleanCtc) {
      errs.expectedCtc = "Expected CTC is required.";
    } else if (cleanCtc.length < 2) {
      errs.expectedCtc = "Please enter a valid salary figure (e.g. 12 LPA or ₹ 12,00,000).";
    }

    if (!noticePeriod.trim()) {
      errs.noticePeriod = "Please select your notice period.";
    }

    const cleanNote = note.trim();
    if (!cleanNote) {
      errs.note = "A brief cover note to the hiring team is required.";
    } else if (cleanNote.length < 10) {
      errs.note = "Please write a cover note of at least 10 characters.";
    } else if (cleanNote.length > 500) {
      errs.note = "Cover note must not exceed 500 characters.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const activeTenantId =
        tenantId ||
        tenant?.normalizedTenantId ||
        (typeof window !== "undefined" ? localStorage.getItem("tenant_id") : null) ||
        "dotnetapi";

      const candidateId =
        user?.candidateId ||
        (typeof window !== "undefined" ? localStorage.getItem("candidate_id") || undefined : undefined);

      const candidateEmail = user?.email || (typeof window !== "undefined" ? localStorage.getItem("candidate_email") || "" : "");
      const candidateName = user?.name || "Candidate";

      const finalResumeLink =
        resumeUrl || "https://dotnetapi.voctrum.com/resumes/default-candidate-resume.pdf";

      // Submit application with noticePeriod, note, currentCtc, and expectedCtc
      await jobsService.applyForJob({
        jobId,
        tenantId: activeTenantId,
        resumeLink: finalResumeLink,
        note: note.trim(),
        noticePeriod: noticePeriod.trim(),
        currentCtc: currentCtc.trim(),
        expectedCtc: expectedCtc.trim(),
        candidateId,
      });

      // Save structured details in local application cache for the application detail view
      if (typeof window !== "undefined") {
        try {
          const rawDetails = localStorage.getItem("candidate_application_meta") || "{}";
          const metaObj = JSON.parse(rawDetails);
          const metaRecord = {
            jobId: String(jobId),
            jobTitle,
            companyName: jobCompany,
            currentCtc: currentCtc.trim(),
            expectedCtc: expectedCtc.trim(),
            noticePeriod: noticePeriod.trim(),
            note: note.trim(),
            appliedAt: new Date().toISOString(),
          };
          metaObj[String(jobId)] = metaRecord;
          metaObj[`app-${jobId}`] = metaRecord;
          localStorage.setItem("candidate_application_meta", JSON.stringify(metaObj));
        } catch {}

        try {
          const localAppsRaw = localStorage.getItem("candidate_local_applications") || "[]";
          const localApps = JSON.parse(localAppsRaw);
          if (!localApps.some((a: any) => String(a.jobId) === String(jobId))) {
            localApps.unshift({
              jobApplicationId: `app-${jobId}`,
              jobId: String(jobId),
              id: String(jobId),
              title: jobTitle,
              company: jobCompany,
              location: location || "Remote",
              salaryRange: salaryRange || "Competitive",
              applyDate: new Date().toISOString().split("T")[0],
              applicationStatus: "applied",
              currentCtc: currentCtc.trim(),
              expectedCtc: expectedCtc.trim(),
              noticePeriod: noticePeriod.trim(),
              note: note.trim(),
            });
            localStorage.setItem("candidate_local_applications", JSON.stringify(localApps));
          }
        } catch {}

        try {
          const rawApplied = localStorage.getItem("candidate_applied_jobs") || "[]";
          const listApplied = JSON.parse(rawApplied);
          if (!listApplied.includes(String(jobId))) {
            listApplied.push(String(jobId));
            localStorage.setItem("candidate_applied_jobs", JSON.stringify(listApplied));
          }
        } catch {}

        window.dispatchEvent(new CustomEvent("job_applied", { detail: { jobId: String(jobId) } }));
      }

      // Send automated confirmation email to candidate
      if (candidateEmail) {
        try {
          await emailService.sendApplicationSubmittedEmail({
            email: candidateEmail,
            candidateName,
            jobTitle,
            companyName: jobCompany,
            expectedCtc: expectedCtc.trim(),
            noticePeriod: noticePeriod.trim(),
          });
        } catch (emailErr) {
          console.warn("Notice: could not dispatch application confirmation email", emailErr);
        }
      }

      toast.success(
        "Application Submitted Successfully!",
        `Your application for "${jobTitle}" at ${jobCompany} has been submitted with your Expected CTC and Notice Period.`
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      const errMsg = err?.message || "Failed to submit application. Please try again.";
      if (errMsg.toLowerCase().includes("already applied")) {
        toast.info("Already Applied", `You have already applied for "${jobTitle}".`);
        onSuccess();
        onClose();
      } else {
        setGeneralError(errMsg);
        toast.error("Application Failed", errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[620px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-2xl transition-all my-8 z-10">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close modal"
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 px-3 py-1 text-xs font-bold text-[#2f54eb] dark:text-blue-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Job Application Form</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Apply for {jobTitle}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Building2 className="h-3.5 w-3.5 text-[#2f54eb]" />
              {jobCompany}
            </span>
            {location && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {location}
                </span>
              </>
            )}
            {salaryRange && (
              <>
                <span>•</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {salaryRange}
                </span>
              </>
            )}
          </div>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs font-medium text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* 1. Current CTC & Expected CTC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={currentCtcId}
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Current CTC <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Annual</span>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <IndianRupee className="h-4 w-4 text-[#2f54eb]" />
                </div>
                <input
                  id={currentCtcId}
                  type="text"
                  value={currentCtc}
                  onChange={(e) => {
                    setCurrentCtc(e.target.value);
                    if (fieldErrors.currentCtc) {
                      setFieldErrors((prev) => ({ ...prev, currentCtc: "" }));
                    }
                  }}
                  placeholder="e.g. 8 LPA or 0 (Fresher)"
                  className={`h-11 w-full rounded-xl border bg-white dark:bg-[#1f1f23] pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-[#2f54eb]/20 ${
                    fieldErrors.currentCtc
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
              </div>
              {fieldErrors.currentCtc && (
                <p className="mt-1 text-xs font-medium text-rose-500 pl-1">{fieldErrors.currentCtc}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={ctcId}
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Expected CTC <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Annual</span>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <IndianRupee className="h-4 w-4 text-[#2f54eb]" />
                </div>
                <input
                  id={ctcId}
                  type="text"
                  value={expectedCtc}
                  onChange={(e) => {
                    setExpectedCtc(e.target.value);
                    if (fieldErrors.expectedCtc) {
                      setFieldErrors((prev) => ({ ...prev, expectedCtc: "" }));
                    }
                  }}
                  placeholder="e.g. 12 LPA or ₹ 12,00,000"
                  className={`h-11 w-full rounded-xl border bg-white dark:bg-[#1f1f23] pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-[#2f54eb]/20 ${
                    fieldErrors.expectedCtc
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
              </div>
              {fieldErrors.expectedCtc && (
                <p className="mt-1 text-xs font-medium text-rose-500 pl-1">{fieldErrors.expectedCtc}</p>
              )}
            </div>
          </div>

          {/* 2. Notice Period */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={noticeId}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Notice Period <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Availability to join</span>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Clock className="h-4 w-4 text-[#2f54eb]" />
              </div>
              <select
                id={noticeId}
                value={noticePeriod}
                onChange={(e) => {
                  setNoticePeriod(e.target.value);
                  if (fieldErrors.noticePeriod) {
                    setFieldErrors((prev) => ({ ...prev, noticePeriod: "" }));
                  }
                }}
                className={`h-11 w-full appearance-none rounded-xl border bg-white dark:bg-[#1f1f23] pl-10 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-[#2f54eb]/20 ${
                  fieldErrors.noticePeriod
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                }`}
              >
                {NOTICE_PERIOD_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            {fieldErrors.noticePeriod && (
              <p className="mt-1 text-xs font-medium text-rose-500 pl-1">{fieldErrors.noticePeriod}</p>
            )}

            {/* Quick Pills for Notice Period */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Immediate Joiner", "15 Days", "30 Days", "60 Days"].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => {
                    const match = NOTICE_PERIOD_OPTIONS.find((o) => o.includes(quick)) || quick;
                    setNoticePeriod(match);
                    if (fieldErrors.noticePeriod) {
                      setFieldErrors((prev) => ({ ...prev, noticePeriod: "" }));
                    }
                  }}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                    noticePeriod.includes(quick)
                      ? "border-[#2f54eb] bg-blue-50 text-[#2f54eb] dark:bg-blue-950/40 dark:text-blue-300"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
                  }`}
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Note / Message to Recruiter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={noteId}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Cover Note / Message to Recruiter <span className="text-red-500">*</span>
              </label>
              <span
                className={`text-[11px] font-medium ${
                  note.length > 500 ? "text-rose-500 font-bold" : "text-slate-400"
                }`}
              >
                {note.length} / 500
              </span>
            </div>

            <textarea
              id={noteId}
              rows={3}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (fieldErrors.note) {
                  setFieldErrors((prev) => ({ ...prev, note: "" }));
                }
              }}
              placeholder="Highlight your key achievements, relevant experience, why this role matches your career goals, or any specific details for the hiring team..."
              className={`w-full rounded-xl border bg-white dark:bg-[#1f1f23] p-3 text-sm text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-[#2f54eb]/20 ${
                fieldErrors.note
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
              }`}
            />
            {fieldErrors.note && (
              <p className="mt-1 text-xs font-medium text-rose-500 pl-1">{fieldErrors.note}</p>
            )}
          </div>

          {/* Attached Resume Info Box */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f8faff] dark:bg-[#1f1f23]/60 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#2f54eb] dark:bg-blue-950/60 dark:text-blue-300">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {resumeName || "Profile Resume / CV"}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Active resume will be attached
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium shrink-0">
              ATS Verified
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-11 px-6 rounded-xl bg-[#2f54eb] hover:bg-[#2447d8] text-xs font-bold text-white shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

