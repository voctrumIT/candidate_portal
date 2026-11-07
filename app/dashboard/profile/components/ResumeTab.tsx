"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Eye, Trash2, FileText, Loader2, Sparkles, CheckCircle2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { documentsService } from "../../../../services/documents";
import ResumeBuilderModal from "../../../components/ResumeBuilderModal";

export default function ResumeTab() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);

  const syncActiveResume = useCallback(() => {
    if (typeof window !== "undefined") {
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

      // Ensure active resume from builder is seamlessly visible
      if (typeof window !== "undefined") {
        const localActiveName = localStorage.getItem("candidate_active_resume_name");
        const localActiveUrl = localStorage.getItem("candidate_active_resume_url");
        const localActiveId = localStorage.getItem("candidate_active_resume_id");
        if (
          localActiveName &&
          !list.some(
            (r: any) =>
              r.name === localActiveName ||
              r.fileName === localActiveName ||
              (localActiveId && r.id === localActiveId)
          )
        ) {
          list = [
            {
              id: localActiveId || "active-builder-resume",
              name: localActiveName,
              fileName: localActiveName,
              fileUrl: localActiveUrl || undefined,
              uploadedAt: localStorage.getItem("candidate_active_resume_updated_at") || new Date().toISOString(),
              isFromBuilder: true,
            },
            ...list,
          ];
        }
      }

      setResumes(list);

      // Check active resume
      syncActiveResume();
      if (typeof window !== "undefined" && !localStorage.getItem("candidate_active_resume_id") && list.length > 0) {
        // Default first resume to active if none explicitly set
        const first = list[0];
        const defaultId = first.id || first.name || first.fileName;
        localStorage.setItem("candidate_active_resume_id", defaultId);
        if (first.name || first.fileName) {
          localStorage.setItem("candidate_active_resume_name", first.name || first.fileName);
        }
        setActiveResumeId(defaultId);
      }
    } catch(e) {
      console.error(e);
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
    window.addEventListener("storage", handleActiveUpdated);
    return () => {
      window.removeEventListener("active_resume_updated", handleActiveUpdated);
      window.removeEventListener("storage", handleActiveUpdated);
    };
  }, [syncActiveResume]);

  const handleSetActive = (resume: any) => {
    const id = resume.id || resume.name || resume.fileName || resume.fileUrl;
    if (typeof window !== "undefined") {
      localStorage.setItem("candidate_active_resume_id", id);
      if (resume.name || resume.fileName) {
        localStorage.setItem("candidate_active_resume_name", resume.name || resume.fileName);
      }
      setActiveResumeId(id);
      window.dispatchEvent(
        new CustomEvent("active_resume_updated", {
          detail: { id, name: resume.name || resume.fileName },
        })
      );
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
      const uploadRes = await documentsService.uploadDocument(formData);

      // Automatically set newly uploaded resume as active if none exists or as primary
      if (typeof window !== "undefined") {
        const newId = uploadRes?.id || uploadRes?.payload?.id || file.name;
        localStorage.setItem("candidate_active_resume_id", newId);
        localStorage.setItem("candidate_active_resume_name", file.name);
        setActiveResumeId(newId);
      }

      await fetchDocs();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await documentsService.deleteDocument(id);
      if (activeResumeId === id) {
        localStorage.removeItem("candidate_active_resume_id");
        localStorage.removeItem("candidate_active_resume_name");
        setActiveResumeId(null);
      }
      await fetchDocs();
    } catch(err) {
      console.error("Delete failed", err);
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
          <p className="text-sm text-slate-500">Loading documents...</p>
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
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[12px] p-5 transition-colors ${
                  isResumeActive
                    ? "bg-blue-50/60 dark:bg-blue-950/20 border-2 border-blue-500/40"
                    : "bg-[#f8f9fa] dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-slate-800 hover:bg-[#f1f3f5] dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-xs ${
                    isResumeActive ? "bg-blue-600" : "bg-red-600"
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
                    onClick={() => handleDelete(resume.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-[#1a1a1a] text-red-500 border border-slate-200 dark:border-slate-700 transition hover:bg-red-50 shadow-2xs"
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
