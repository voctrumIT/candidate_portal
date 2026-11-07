"use client";

import React, { useState, useEffect } from "react";
import ResumeBuilderModal from "../../components/ResumeBuilderModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, ArrowLeft, ArrowUpRight, Lock, UserPlus } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function ResumeBuilderStandalonePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("candidate_token");
      setHasToken(Boolean(token));
    }
  }, []);

  const isUserAuthenticated = Boolean(hasToken || user);

  if (hasToken === false && !loading && !user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-xl shadow-blue-500/25">
          <Lock className="h-8 w-8" />
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          Candidate Access Only
        </span>
        <h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
          Register to Access Resume Builder
        </h1>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Only registered users can open the Resume Builder. Please create your candidate account to automatically build, edit, and export professional ATS resumes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => router.push("/register?redirect=/dashboard/resume-builder")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <UserPlus className="h-4 w-4" /> Register Your Account
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 md:px-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            ATS Resume Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, customize, and export ATS-optimized candidate resumes
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
        >
          <Sparkles className="h-4 w-4" /> Open Resume Builder
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          <FileText className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Active Resume Session
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          The interactive modal gives you full ATS live preview, AI generation, and multiple export formats (PDF &amp; JSON).
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
        >
          <Sparkles className="h-4 w-4" /> Launch Interactive Builder
        </button>
      </div>

      <ResumeBuilderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
