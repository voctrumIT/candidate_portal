"use client";

import { useState, useEffect } from "react";
import { ExternalLink, BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import { jobsService } from "../../../../../services/jobs";
import { toast } from "../../../../components/Toast";
import ApplyJobModal from "../../../../components/ApplyJobModal";

interface ApplyButtonProps {
  jobId: string;
  jobCompany: string;
  jobTitle: string;
  salaryRange?: string;
  location?: string;
}

export default function ApplyButton({
  jobId,
  jobCompany,
  jobTitle,
  salaryRange,
  location,
}: ApplyButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [hasApplied, setHasApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleOpenApply = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("candidate_token") : null;
    if (!token && !user) {
      toast.info("Sign In Required", "Please sign in or create an account to apply for this position.");
      router.push(`/register?redirect=/dashboard/jobs/${jobId}`);
      return;
    }

    if (hasApplied) return;

    setShowModal(true);
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
    <>
      <button
        type="button"
        onClick={handleOpenApply}
        className="flex h-11 items-center gap-2 rounded-lg bg-[#2f54eb] px-8 text-sm font-semibold text-white transition hover:bg-[#2447d8] shadow-sm cursor-pointer"
      >
        <span>Apply Now</span>
        <ExternalLink className="h-4 w-4" />
      </button>

      {/* Professional Job Application Modal */}
      <ApplyJobModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        jobId={jobId}
        jobTitle={jobTitle}
        jobCompany={jobCompany}
        salaryRange={salaryRange}
        location={location}
        onSuccess={() => {
          setHasApplied(true);
        }}
      />
    </>
  );
}
