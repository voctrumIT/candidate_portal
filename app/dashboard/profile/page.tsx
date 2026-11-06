"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import BasicDetailsTab from "./components/BasicDetailsTab";
import ResumeTab from "./components/ResumeTab";
import AboutTab from "./components/AboutTab";
import SkillsTab from "./components/SkillsTab";
import EducationTab from "./components/EducationTab";
import WorkExperienceTab from "./components/WorkExperienceTab";

type TabType = "Basic Details" | "Resume" | "About" | "Skill" | "Education" | "Work Experience" | "Social Links";

const TABS: TabType[] = [
  "Basic Details",
  "Resume",
  "About",
  "Skill",
  "Education",
  "Work Experience",
  "Social Links",
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("Basic Details");
  const { logout } = useAuth();

  return (
    <div className="p-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#101828] dark:text-white">Your Profile</h1>
          <p className="mt-1 text-[15px] text-[#667085] dark:text-slate-400">
            Keep your profile up to date to improve visibility and opportunities
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

      {/* Progress Bar Area */}
      <div className="mt-8">
        <h2 className="text-[17px] font-bold text-[#101828] dark:text-white dark:text-slate-200">Complete Your Profile</h2>
        <div className="mt-3 flex items-center gap-4">
          <div className="h-2 w-full max-w-[400px] rounded-full bg-[#eefaf4] dark:bg-emerald-950">
            <div className="h-full w-[75%] rounded-full bg-[#12b76a]"></div>
          </div>
          <span className="text-[11px] font-bold text-[#101828] dark:text-white dark:text-slate-300">75%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 inline-flex flex-wrap gap-1 rounded-lg bg-[#f4f5f7] p-1 dark:bg-slate-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-5 py-2 text-[14px] font-medium transition-all ${
              activeTab === tab
                ? "bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white shadow-sm font-semibold dark:bg-[#1a1a1a] dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="mt-8 w-full max-w-[850px] animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "Basic Details" && <BasicDetailsTab />}
        {activeTab === "Resume" && <ResumeTab />}
        {activeTab === "About" && <AboutTab />}
        {activeTab === "Skill" && <SkillsTab />}
        {activeTab === "Education" && <EducationTab />}
        {activeTab === "Work Experience" && <WorkExperienceTab />}
        {activeTab === "Social Links" && (
          <div className="rounded-[16px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] p-6 dark:border-slate-800 dark:bg-[#1a1a1a]">
            <p className="text-sm text-slate-500 dark:text-slate-400">Social Links section coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
