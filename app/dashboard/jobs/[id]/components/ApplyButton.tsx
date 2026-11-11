"use client";

import { useState, useEffect } from "react";
import { ExternalLink, BadgeCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import { jobsService } from "../../../../../services/jobs";
import { documentsService } from "../../../../../services/documents";
import { toast } from "../../../../components/Toast";

interface ApplyButtonProps {
  jobId: string;
  jobCompany: string;
  jobTitle: string;
}

export default function ApplyButton({ jobId, jobCompany, jobTitle }: ApplyButtonProps) {
  const router = useRouter();
  const { user, tenant } = useAuth();
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // Check locally cached applied status
    if (jobsService.isJobApplied(jobId)) {
      setHasApplied(true);
    }

    // Check remote applications status
    const checkApplied = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("candidate_token") : null;
      if (!token && !user) return;
      try {
        const apps = await jobsService.getApplications();
        if (Array.isArray(apps)) {
          const found = apps.some((a: any) => String(a.jobId) === String(jobId));
          if (found) setHasApplied(true);
        }
      } catch (err) {
        // Silent catch for initial status check
      }
    };
    checkApplied();

    const handleJobApplied = (e: any) => {
      if (String(e?.detail?.jobId) === String(jobId)) {
        setHasApplied(true);
      }
    };

    window.addEventListener("job_applied", handleJobApplied);
    return () => window.removeEventListener("job_applied", handleJobApplied);
  }, [user, jobId]);

  const handleDirectApply = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("candidate_token") : null;
    if (!token && !user) {
      toast.info("Sign In Required", "Please sign in or create an account to apply for this position.");
      router.push(`/register?redirect=/dashboard/jobs/${jobId}`);
      return;
    }

    if (applying || hasApplied) return;

    setApplying(true);
    try {
      // 1. Determine candidate resume link (from active storage, uploaded documents, or builder)
      let resumeLink = typeof window !== "undefined" ? localStorage.getItem("candidate_active_resume_url") : null;

      if (!resumeLink) {
        try {
          const docs = await documentsService.getDocuments();
          if (Array.isArray(docs) && docs.length > 0) {
            const activeId = typeof window !== "undefined" ? localStorage.getItem("candidate_active_resume_id") : null;
            const activeName = typeof window !== "undefined" ? localStorage.getItem("candidate_active_resume_name") : null;
            const matchingDoc = docs.find(
              (d: any) =>
                d.id === activeId ||
                d.fileUrl === activeId ||
                d.name === activeName ||
                d.fileName === activeName
            ) || docs[0];
            resumeLink = matchingDoc?.fileUrl || matchingDoc?.url || null;
          }
        } catch (e) {
          console.warn("Could not retrieve documents", e);
        }
      }

      if (!resumeLink) {
        resumeLink = "https://dotnetapi.voctrum.com/resumes/default-candidate-resume.pdf";
      }

      // 2. Candidate profile details note
      const candidateName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
      const noteDetails = [
        candidateName ? `Candidate: ${candidateName}` : null,
        user?.email ? `Email: ${user.email}` : null,
        user?.mobile ? `Phone: ${user.mobile}` : null,
        user?.currentLocation ? `Location: ${user.currentLocation}` : null,
      ].filter(Boolean).join(" | ");

      const safeNote = (noteDetails || `Direct application for ${jobTitle} at ${jobCompany}`).slice(0, 190);
      const activeTenantId =
        tenant?.normalizedTenantId ||
        (typeof window !== "undefined" ? localStorage.getItem("tenant_id") : null) ||
        "dotnetapi";
      const candidateId =
        user?.candidateId ||
        (typeof window !== "undefined" ? localStorage.getItem("candidate_id") || undefined : undefined);

      // 3. Submit direct application
      await jobsService.applyForJob({
        jobId,
        tenantId: activeTenantId,
        resumeLink,
        note: safeNote,
        candidateId,
      });

      setHasApplied(true);
      toast.success(
        "Application Submitted!",
        `Your profile and details have been submitted directly for "${jobTitle}".`
      );

      // Notify other views
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("job_applied", { detail: { jobId } }));
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to submit application. Please try again.";
      if (errorMsg.toLowerCase().includes("already applied")) {
        setHasApplied(true);
        toast.info("Already Applied", `You have already applied for "${jobTitle}".`);
      } else {
        console.error("Direct apply error:", err);
        toast.error("Application Failed", errorMsg);
      }
    } finally {
      setApplying(false);
    }
  };

  if (hasApplied) {
    return (
      <button
        type="button"
        disabled
        className="flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-8 text-sm font-semibold text-white shadow-sm cursor-not-allowed opacity-95 transition"
      >
        <BadgeCheck className="h-4 w-4" />
        Applied
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDirectApply}
      disabled={applying}
      className="flex h-11 items-center gap-2 rounded-lg bg-[#2f54eb] px-8 text-sm font-semibold text-white transition hover:bg-[#2447d8] shadow-sm disabled:opacity-75 cursor-pointer"
    >
      {applying ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Applying...
        </>
      ) : (
        <>
          Apply Now
          <ExternalLink className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
