"use client";

import React, { useState, useEffect } from "react";
import ResumeBuilderModal from "../../components/ResumeBuilderModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, ArrowLeft, ArrowUpRight, Lock, LogIn } from "lucide-react";
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
          Sign In to Access Resume Builder
        </h1>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Only logged-in users can open the Resume Builder. Please sign in to fetch your candidate credentials automatically and build professional ATS resumes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => router.push("/login?redirect=/dashboard/resume-builder")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <LogIn className="h-4 w-4" /> Log In to Your Account
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
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <span className="text-sm font-bold text-slate-400">/</span>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Resume Builder
          </h1>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Sparkles className="h-4 w-4" /> Open Resume Builder
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 p-8 dark:border-slate-800 dark:from-slate-900/50 dark:via-slate-900/20 dark:to-[#121620]">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            ATS Compliant & Multi-Template
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-white md:text-3xl">
            Build your professional resume in minutes
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Create a custom, tailored resume optimized for client review. Select
            from modern or executive layouts, customize color accents, generate
            AI-enhanced summaries, and export straight to PDF or attach directly to
            your candidate profile.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800 shadow-md"
            >
              <FileText className="h-4 w-4" /> Launch Builder
            </button>
            <Link
              href="/dashboard/profile"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              View Uploaded Resumes <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <ResumeBuilderModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
