"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Trash2, FileText, Loader2 } from "lucide-react";
import { documentsService } from "../../../../services/documents";

export default function ResumeTab() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await documentsService.getDocuments();
      setResumes(data || []);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await documentsService.uploadDocument(formData);
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
      await fetchDocs();
    } catch(err) {
      console.error("Delete failed", err);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 dark:border-slate-700 pb-4">
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Resume</h3>
        <div className="flex items-center gap-3">
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
          resumes.map((resume) => (
            <div
              key={resume.fileUrl}
              className="flex items-center justify-between rounded-[12px] bg-[#f8f9fa] dark:bg-[#1a1a1a] px-6 py-4 transition-colors hover:bg-[#f1f3f5] dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm">
                  <span className="text-[11px] font-bold tracking-wider">PDF</span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-900 dark:text-white">{resume.fileName || "Resume"}</p>
                  <p className="text-[12px] text-slate-400">{resume.fileSize ? `${Math.round(resume.fileSize / 1024)} KB` : "Unknown size"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {resume.fileUrl && (
                  <a href={`https://erp-api.voctrum.com/${resume.fileUrl}`} target="_blank" rel="noreferrer" className="text-[#2f54eb] hover:opacity-80 transition">
                    <Eye className="h-4 w-4" />
                  </a>
                )}
                <button onClick={() => handleDelete(resume.fileUrl)} className="text-red-500 hover:opacity-80 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
