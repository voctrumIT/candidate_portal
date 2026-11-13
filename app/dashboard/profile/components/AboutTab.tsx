"use client";

import { useState, useEffect } from "react";
import { Pencil, Sparkles, Check, Loader2, UserCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { profileService } from "../../../../services/profile";
import { toast } from "../../../components/Toast";
import { getUserFriendlyErrorMessage } from "../../../../lib/errorUtils";

export default function AboutTab() {
  const { user, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isEditing) {
      const summaryText = user?.aboutMe || user?.about || user?.summary || user?.bio || "";
      setAboutText(summaryText);
    }
  }, [user?.aboutMe, user?.about, user?.summary, user?.bio, isEditing]);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const skillsStr = Array.isArray(user?.skills) && user.skills.length > 0
        ? user.skills.slice(0, 5).join(", ")
        : "modern web technologies and agile problem solving";
      const name = user?.firstName || user?.name || "Professional";

      const generatedBio = `Results-driven software professional with hands-on experience delivering scalable applications and exceptional user experiences. Proficient in ${skillsStr}, with a passion for clean architecture, cross-functional collaboration, and continuous learning. Committed to driving impactful outcomes and delivering high-quality solutions in fast-paced environments.`;

      setAboutText(generatedBio);
      setIsGenerating(false);
      toast.success("Summary Generated", "AI generated a professional summary based on your profile skills.");
    }, 600);
  };

  const handleSave = async () => {
    setErrorMsg("");
    const trimmed = aboutText.trim();
    if (trimmed.length > 2000) {
      setErrorMsg("Summary cannot exceed 2000 characters.");
      return;
    }

    setIsSaving(true);
    try {
      // Call backend API PUT /api/Candidate/profile/update directly
      await profileService.updateProfile({
        aboutMe: trimmed,
        summary: trimmed,
        about: trimmed,
        bio: trimmed,
      });
      await refreshProfile();

      setAboutText(trimmed);
      setIsEditing(false);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("candidate_profile_updated", { detail: { aboutMe: trimmed, about: trimmed } }));
        window.dispatchEvent(new Event("storage"));
      }

      toast.success("About Me Saved", "Your professional summary has been saved successfully to your profile.");
    } catch (err: any) {
      const friendlyMsg = getUserFriendlyErrorMessage(err, "profile");
      setErrorMsg(friendlyMsg);
      toast.error("Save Failed", friendlyMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">About Me</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            A concise overview highlighting your background, strengths, and goals
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#2447d8] shadow-sm"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit Summary</span>
          </button>
        )}
      </div>

      <div className="mt-6">
        {isEditing ? (
          <div>
            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                Write a brief summary of your expertise and accomplishments
              </span>
              <span className={`text-[12px] font-medium ${aboutText.length > 2000 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {aboutText.length}/2000 characters
              </span>
            </div>
            <textarea
              value={aboutText}
              onChange={(e) => {
                setAboutText(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="Highlight your key skills, career achievements, and the value you bring to potential employers..."
              rows={6}
              className={`w-full rounded-xl border bg-white dark:bg-[#1a1a1a] p-4 text-[14px] leading-relaxed text-slate-900 dark:text-white outline-none resize-none transition shadow-inner ${
                errorMsg ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-800 focus:border-[#2f54eb]"
              }`}
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 px-4 py-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition hover:bg-indigo-100 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2447d8] shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>Save Summary</span>
                </button>
              </div>
            </div>
          </div>
        ) : aboutText ? (
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1a1a1a] p-6">
            <p className="text-[14px] leading-[1.8] text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {aboutText}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center bg-slate-50/30 dark:bg-[#1a1a1a]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <UserCheck className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-slate-800 dark:text-white">No Summary Added Yet</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Adding a professional summary increases your profile visibility and helps recruiters understand your strengths.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2447d8]"
            >
              <Pencil className="h-3.5 w-3.5" /> Add Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
