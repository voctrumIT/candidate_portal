"use client";

import { useState } from "react";
import { Plus, Eye, Trash2, FileText } from "lucide-react";

const resumes = [
  { id: 1, name: "Resume1.PDF", size: "60kb of 125kb" },
  { id: 2, name: "Resume1.PDF", size: "60kb of 125kb" },
  { id: 3, name: "Resume1.PDF", size: "60kb of 125kb" },
];

export default function ResumeTab() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Resume</h3>
        <div className="flex items-center gap-3">
          <label
            htmlFor="resume-upload"
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#2f54eb] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#2447d8]"
            onClick={() => setIsEditing(true)}
          >
            <Plus className="h-4 w-4" /> Upload New
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {resumes.slice(0, isEditing ? 3 : 2).map((resume) => (
          <div
            key={resume.id}
            className="flex items-center justify-between rounded-[12px] bg-[#f8f9fa] px-6 py-4 transition-colors hover:bg-[#f1f3f5]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm">
                <span className="text-[11px] font-bold tracking-wider">PDF</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-slate-900 dark:text-white">{resume.name}</p>
                <p className="text-[12px] text-slate-400">{resume.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-[#2f54eb] hover:opacity-80 transition">
                <Eye className="h-4 w-4" />
              </button>
              <button className="text-red-500 hover:opacity-80 transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="h-11 rounded-lg bg-[#2f54eb] px-10 text-[14px] font-semibold text-white transition hover:bg-[#2447d8]"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
