"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Eye, Trash2, FileText, Loader2, Sparkles, CheckCircle2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { documentsService } from "../../../../services/documents";
import ResumeBuilderModal from "../../../components/ResumeBuilderModal";
import { DocumentRowSkeleton } from "../../../components/Skeleton";
import { toast } from "../../../components/Toast";

export default function ResumeTab() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);

  const syncActiveResume = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentCid = localStorage.getItem("candidate_id");
      const ownerId = localStorage.getItem("candidate_active_resume_owner_id");
      if (ownerId && currentCid && ownerId !== currentCid) {
        localStorage.removeItem("candidate_active_resume_id");
        localStorage.removeItem("candidate_active_resume_name");
        localStorage.removeItem("candidate_active_resume_url");
        localStorage.removeItem("candidate_active_resume");
        localStorage.removeItem("candidate_active_resume_owner_id");
        setActiveResumeId(null);
        return;
      }
      const activeId = localStorage.getItem("candidate_active_resume_id");
      const activeName = localStorage.getItem("candidate_active_resume_name");
      setActiveResumeId(activeId || activeName || null);
    }
  }, []);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await documentsService.getDocuments();
      let list = Array.isArray(data) ? [...data] : [];

      if (typeof window !== "undefined") {
        const currentCid = localStorage.getItem("candidate_id");
        const ownerId = localStorage.getItem("candidate_active_resume_owner_id");

        // Clean up cross-user resume leakage
        if (ownerId && currentCid && ownerId !== currentCid) {
          localStorage.removeItem("candidate_active_resume_id");
          localStorage.removeItem("candidate_active_resume_name");
          localStorage.removeItem("candidate_active_resume_url");
          localStorage.removeItem("candidate_active_resume");
          localStorage.removeItem("candidate_active_resume_owner_id");
        } else {
          const localActiveName = localStorage.getItem("candidate_active_resume_name");
          const localActiveUrl = localStorage.getItem("candidate_active_resume_url");
          const localActiveId = localStorage.getItem("candidate_active_resume_id");

          // Only include builder-generated resume if it explicitly belongs to this user and has a real URL
          if (
            localActiveName &&
            localActiveUrl &&
            ownerId === currentCid &&
            !list.some(
              (r: any) =>
                r.name === localActiveName ||
                r.fileName === localActiveName ||
                (localActiveId && (r.id === localActiveId || r.fileUrl === localActiveUrl))
            )
          ) {
            list = [
              {
                id: localActiveId || "active-builder-resume",
                name: localActiveName,
                fileName: localActiveName,
                fileUrl: localActiveUrl,
                uploadedAt:
                  localStorage.getItem("candidate_active_resume_updated_at") ||
                  new Date().toISOString(),
                isFromBuilder: true,
              },
              ...list,
            ];
          }
        }
      }

      setResumes(list);

      // Check and sync active resume from real documents
      if (typeof window !== "undefined") {
        const currentActive = localStorage.getItem("candidate_active_resume_id");
        if (list.length > 0) {
          const exists = list.some(
            (r: any) =>
              r.id === currentActive ||
              r.fileUrl === currentActive ||
              r.name === currentActive ||
              r.fileName === currentActive
          );
          if (!exists) {
            const first = list[0];
            const defaultId = first.fileUrl || first.id || first.name || first.fileName;
            const currentCid = localStorage.getItem("candidate_id") || "";
            localStorage.setItem("candidate_active_resume_owner_id", currentCid);
            localStorage.setItem("candidate_active_resume_id", defaultId);
            if (first.name || first.fileName) {
              localStorage.setItem("candidate_active_resume_name", first.name || first.fileName);
            }
            if (first.fileUrl) {
              localStorage.setItem("candidate_active_resume_url", first.fileUrl);
            }
            setActiveResumeId(defaultId);
          } else {
            setActiveResumeId(currentActive);
          }
        } else {
          setActiveResumeId(null);
        }
      }
    } catch (e) {
      console.error("Failed to fetch candidate documents:", e);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();

    const handleActiveUpdated = () => {
      syncActiveResume();
      fetchDocs();
    };

    window.addEventListener("active_resume_updated", handleActiveUpdated);
    return () => {
      window.removeEventListener("active_resume_updated", handleActiveUpdated);
    };
  }, [syncActiveResume]);

  const handleSetActive = (resume: any) => {
    const id = resume.fileUrl || resume.id || resume.name || resume.fileName;
    const displayName = resume.name || resume.fileName || "Resume";
    if (typeof window !== "undefined") {
      const cid = localStorage.getItem("candidate_id");
      localStorage.setItem("candidate_active_resume_id", id);
      localStorage.setItem("candidate_active_resume_name", displayName);
      if (cid) {
        localStorage.setItem("candidate_active_resume_owner_id", cid);
      }
      if (resume.fileUrl) {
        localStorage.setItem("candidate_active_resume_url", resume.fileUrl);
      }
      setActiveResumeId(id);
      window.dispatchEvent(
        new CustomEvent("active_resume_updated", {
          detail: { id, name: displayName, fileUrl: resume.fileUrl },
        })
      );
      toast.success("Active Resume Set", `"${displayName}" is now set as your active profile resume.`);
    }
  };

  const handleOpenResumeBuilder = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('candidate_token') : null;
    if (!token) {
      router.push('/register?redirect=/dashboard/profile');
      return;
    }
    setIsResumeBuilderOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("File", file);
      formData.append("DocumentType", "Resume");
      formData.append("type", "Resume");

      const cid = typeof window !== "undefined" ? localStorage.getItem("candidate_id") : null;
      if (cid) {
        formData.append("CandidateId", cid);
      }

      const uploadRes = await documentsService.uploadDocument(formData);
      const newDoc = uploadRes?.payload || uploadRes;
      const newId = newDoc?.fileUrl || newDoc?.id || newDoc?.documentId || file.name;
      const newUrl = newDoc?.fileUrl || null;

      // Automatically set newly uploaded resume as active if none exists or as primary
      if (typeof window !== "undefined") {
        localStorage.setItem("candidate_active_resume_id", newId);
        localStorage.setItem("candidate_active_resume_name", file.name);
        if (cid) {
          localStorage.setItem("candidate_active_resume_owner_id", cid);
        }
        if (newUrl) {
          localStorage.setItem("candidate_active_resume_url", newUrl);
        }
        setActiveResumeId(newId);
        window.dispatchEvent(
          new CustomEvent("active_resume_updated", {
            detail: { id: newId, name: file.name, fileUrl: newUrl },
          })
        );
      }

      await fetchDocs();
      toast.success("Resume Uploaded", `"${file.name}" has been uploaded and set as active.`);
    } catch (err: any) {
      console.error("Upload failed", err);
      toast.error("Upload Failed", err?.message || "Could not upload document. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (identifier: string) => {
    try {
      if (identifier && !identifier.startsWith("blob:") && !identifier.startsWith("active-builder-") && identifier.length > 5) {
        await documentsService.deleteDocument(identifier);
      }
      if (
        activeResumeId === identifier ||
        (identifier && activeResumeId && (activeResumeId.includes(identifier) || identifier.includes(activeResumeId)))
      ) {
        localStorage.removeItem("candidate_active_resume_id");
        localStorage.removeItem("candidate_active_resume_name");
        localStorage.removeItem("candidate_active_resume_url");
        localStorage.removeItem("candidate_active_resume");
        setActiveResumeId(null);
      }
      await fetchDocs();
      toast.info("Resume Removed", "The document has been removed from your profile.");
    } catch (err: any) {
      console.error("Delete failed", err);
      // Even if API returns error (e.g. document not found on s3), clean local state if active
      if (activeResumeId === identifier) {
        localStorage.removeItem("candidate_active_resume_id");
        localStorage.removeItem("candidate_active_resume_name");
        localStorage.removeItem("candidate_active_resume_url");
        setActiveResumeId(null);
        await fetchDocs();
      }
      toast.error("Delete Failed", err?.message || "Could not remove document. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Resume</h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenResumeBuilder}
            className="flex items-center gap-2 rounded-lg border border-[#2f54eb] text-[#2f54eb] hover:bg-blue-50 dark:hover:bg-slate-800 px-4 py-2 text-[13px] font-semibold transition"
          >
            <Sparkles className="h-4 w-4" />
            Create Resume
          </button>
          <label
            htmlFor="resume-upload"
            className={`flex cursor-pointer items-center gap-2 rounded-lg bg-[#2f54eb] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#2447d8] ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Upload New
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col gap-4">
            <DocumentRowSkeleton />
            <DocumentRowSkeleton />
          </div>
        ) : resumes.length === 0 ? (
          <p className="text-sm text-slate-500">No resumes uploaded yet.</p>
        ) : (
          resumes.map((resume, index) => {
            const isResumeActive = Boolean(
              (activeResumeId && (
                resume.id === activeResumeId ||
                resume.name === activeResumeId ||
                resume.fileName === activeResumeId ||
                (resume.fileUrl && resume.fileUrl === activeResumeId)
              )) ||
              (!activeResumeId && index === 0)
            );

            return (
              <div
                key={resume.id || resume.fileUrl || resume.name || index}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[12px] p-5 transition-colors ${isResumeActive
                  ? "bg-blue-50/60 dark:bg-blue-950/20 border-2 border-blue-500/40"
                  : "bg-[#f8f9fa] dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-slate-800 hover:bg-[#f1f3f5] dark:hover:bg-slate-800"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-xs ${isResumeActive ? "bg-blue-600" : "bg-red-600"
                    }`}>
                    <span className="text-[11px] font-bold tracking-wider">
                      {resume.name?.toLowerCase().endsWith(".docx") || resume.name?.toLowerCase().endsWith(".doc") ? "DOC" : "PDF"}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">
                        {resume.name || resume.fileName || "Candidate Resume"}
                      </h4>
                      {isResumeActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Active Resume
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Uploaded on {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  {!isResumeActive && (
                    <button
                      type="button"
                      onClick={() => handleSetActive(resume)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
                    >
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      <span>Set as Active</span>
                    </button>
                  )}
                  {resume.fileUrl && (
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition hover:bg-slate-50 shadow-2xs"
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(resume.fileUrl || resume.id || resume.fileName || resume.name)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-[#1a1a1a] text-red-500 border border-slate-200 dark:border-slate-700 transition hover:bg-red-50 dark:hover:bg-red-950/40 shadow-2xs"
                    title="Delete Resume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ResumeBuilderModal
        isOpen={isResumeBuilderOpen}
        onClose={() => setIsResumeBuilderOpen(false)}
        onSavedResume={fetchDocs}
      />
    </div>
  );
}
