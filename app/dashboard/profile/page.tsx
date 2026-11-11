"use client";

import { useState, useEffect, useMemo } from "react";
import { LogOut, CheckCircle2, AlertCircle, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import BasicDetailsTab from "./components/BasicDetailsTab";
import ResumeTab from "./components/ResumeTab";
import AboutTab from "./components/AboutTab";
import SkillsTab from "./components/SkillsTab";
import EducationTab from "./components/EducationTab";
import WorkExperienceTab from "./components/WorkExperienceTab";
import SettingsTab from "./components/SettingsTab";

type TabType = "Basic Details" | "Resume" | "About" | "Skill" | "Education" | "Work Experience" | "Settings";

const TABS: TabType[] = [
  "Basic Details",
  "Resume",
  "About",
  "Skill",
  "Education",
  "Work Experience",
  "Settings",
];

interface PendingItem {
  id: string;
  title: string;
  description: string;
  tab: TabType;
  points: number;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("Basic Details");
  const { user, logout } = useAuth();
  const [hasResume, setHasResume] = useState(false);
  const [hasAbout, setHasAbout] = useState(false);
  const [hasExperience, setHasExperience] = useState(false);

  useEffect(() => {
    const checkLocalProfileData = () => {
      if (typeof window !== "undefined") {
        const resumeId = localStorage.getItem("candidate_active_resume_id");
        const resumeName = localStorage.getItem("candidate_active_resume_name");
        setHasResume(Boolean(resumeId || resumeName));

        const about = localStorage.getItem("candidate_about_me");
        setHasAbout(Boolean(about && about.trim().length > 0));

        try {
          const expRaw = localStorage.getItem("candidate_work_experience");
          if (expRaw) {
            const parsed = JSON.parse(expRaw);
            setHasExperience(Array.isArray(parsed) && parsed.length > 0);
          } else if (Array.isArray(user?.workExperiences) && user.workExperiences.length > 0) {
            setHasExperience(true);
          } else {
            setHasExperience(false);
          }
        } catch {
          setHasExperience(Boolean(Array.isArray(user?.workExperiences) && user.workExperiences.length > 0));
        }
      }
    };

    checkLocalProfileData();
    window.addEventListener("storage", checkLocalProfileData);
    window.addEventListener("active_resume_updated", checkLocalProfileData);
    window.addEventListener("candidate_profile_updated", checkLocalProfileData);
    window.addEventListener("work_experience_updated", checkLocalProfileData);
    return () => {
      window.removeEventListener("storage", checkLocalProfileData);
      window.removeEventListener("active_resume_updated", checkLocalProfileData);
      window.removeEventListener("candidate_profile_updated", checkLocalProfileData);
      window.removeEventListener("work_experience_updated", checkLocalProfileData);
    };
  }, [user]);

  // Compute pending checklist and precise percentage
  const { completionPercentage, pendingItems } = useMemo(() => {
    const pending: PendingItem[] = [];
    let score = 0;

    // 1. Personal & Contact (20 points)
    const hasName = Boolean(user?.name || (user?.firstName && user?.lastName));
    const hasContact = Boolean(user?.contactNumber || user?.mobile);
    if (hasName && hasContact) {
      score += 20;
    } else {
      if (hasName) score += 10;
      pending.push({
        id: "contact",
        title: "Contact Number",
        description: "Add phone number for recruiter reach-outs",
        tab: "Basic Details",
        points: hasName ? 10 : 20,
      });
    }

    // 2. Address & Location (15 points)
    const addr = user?.address || {};
    const hasAddress = Boolean(user?.city || addr.city || user?.currentLocation || user?.addressLine1 || addr.addressLine1);
    if (hasAddress) {
      score += 15;
    } else {
      pending.push({
        id: "address",
        title: "Location & Address",
        description: "Set your location for nearby job matches",
        tab: "Basic Details",
        points: 15,
      });
    }

    // 3. Key Skills (20 points)
    const skillsList = Array.isArray(user?.skills) ? user.skills : [];
    if (skillsList.length >= 3) {
      score += 20;
    } else if (skillsList.length > 0) {
      score += 10;
      pending.push({
        id: "skills",
        title: "Key Skills",
        description: `Add at least 3 skills (${skillsList.length}/3 added)`,
        tab: "Skill",
        points: 10,
      });
    } else {
      pending.push({
        id: "skills",
        title: "Key Skills",
        description: "Add your core technical and professional skills",
        tab: "Skill",
        points: 20,
      });
    }

    // 4. Education (15 points)
    const eduList = Array.isArray(user?.educations) ? user.educations : [];
    if (eduList.length > 0) {
      score += 15;
    } else {
      pending.push({
        id: "education",
        title: "Education Details",
        description: "Add your degrees, certifications or university",
        tab: "Education",
        points: 15,
      });
    }

    // 5. Work Experience (10 points)
    if (hasExperience) {
      score += 10;
    } else {
      pending.push({
        id: "experience",
        title: "Work Experience",
        description: "Add your current or past professional roles",
        tab: "Work Experience",
        points: 10,
      });
    }

    // 6. Resume (10 points)
    if (hasResume) {
      score += 10;
    } else {
      pending.push({
        id: "resume",
        title: "ATS Resume",
        description: "Upload or create your ATS-optimized resume",
        tab: "Resume",
        points: 10,
      });
    }

    // 7. About Me Summary (10 points)
    const hasAboutSummary = Boolean(hasAbout || user?.bio || user?.about || user?.summary);
    if (hasAboutSummary) {
      score += 10;
    } else {
      pending.push({
        id: "about",
        title: "About Me Summary",
        description: "Highlight your background and career strengths",
        tab: "About",
        points: 10,
      });
    }

    return {
      completionPercentage: Math.min(100, Math.max(0, score)),
      pendingItems: pending,
    };
  }, [user, hasResume, hasAbout, hasExperience]);

  return (
    <div className="p-6 md:p-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#101828] dark:text-white">Your Profile</h1>
          <p className="mt-1 text-[15px] text-[#667085] dark:text-slate-400">
            Keep your profile up to date to improve visibility and job application matches
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 hover:border-red-300 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Dynamic Profile Completion Section */}
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-xs max-w-[850px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[17px] font-bold text-[#101828] dark:text-white">Profile Completion</h2>
            {completionPercentage === 100 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> 100% Complete
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400" /> {completionPercentage}% Complete
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {completionPercentage === 100
              ? "All profile sections verified!"
              : `${pendingItems.length} action item${pendingItems.length === 1 ? "" : "s"} remaining`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                completionPercentage === 100
                  ? "bg-emerald-500"
                  : completionPercentage >= 70
                  ? "bg-[#12b76a]"
                  : completionPercentage >= 40
                  ? "bg-blue-600"
                  : "bg-amber-500"
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Pending Items Checklist (Shown when < 100%) */}
        {completionPercentage < 100 && pendingItems.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> What is pending to reach 100%:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pendingItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.tab)}
                  className="group flex items-center justify-between rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 p-3 text-left transition hover:border-[#2f54eb] hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
                >
                  <div className="pr-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#2f54eb] transition">
                      + Add {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 shrink-0 rounded-lg bg-white dark:bg-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs group-hover:text-[#2f54eb]">
                    <span>+{item.points}%</span>
                    <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-[#2f54eb] group-hover:translate-x-0.5 transition" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="mt-8 inline-flex flex-wrap gap-1 rounded-xl bg-[#f4f5f7] p-1.5 dark:bg-slate-800/80">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-all ${
              activeTab === tab
                ? "bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="mt-6 w-full max-w-[850px] animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "Basic Details" && <BasicDetailsTab />}
        {activeTab === "Resume" && <ResumeTab />}
        {activeTab === "About" && <AboutTab />}
        {activeTab === "Skill" && <SkillsTab />}
        {activeTab === "Education" && <EducationTab />}
        {activeTab === "Work Experience" && <WorkExperienceTab />}
        {activeTab === "Settings" && <SettingsTab />}
      </div>
    </div>
  );
}
