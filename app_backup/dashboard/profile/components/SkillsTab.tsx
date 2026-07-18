"use client";

import { useState } from "react";
import { Plus, X, Search } from "lucide-react";

const currentSkills = [
  "UI Design", "Figma", "Prototyping", "Illustrator", "Motion", "Agile",
  "Vue.js", "React", "TypeScript", "Node.js", "Python", "Sales"
];

const suggestedSkills = [
  "UI Design", "Figma", "Prototyping", "Illustrator", "Motion", "Agile", "Ap",
  "Vue.js", "React", "TypeScript", "Node.js", "Python", "Marketing", "Sales",
  "Communication", "Leadership", "Agile"
];

export default function SkillsTab() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Skills</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-[#2f54eb] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#2447d8]"
          >
            <Plus className="h-4 w-4" /> Add Skills
          </button>
        )}
      </div>

      <div className="mt-8">
        {isEditing ? (
          <div>
            {/* Search Bar */}
            <div className="flex h-12 w-[60%] items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] px-4 focus-within:border-[#2f54eb] focus-within:ring-1 focus-within:ring-[#2f54eb]">
              <Search className="h-5 w-5 text-[#2f54eb]" />
              <input 
                type="text" 
                placeholder="Search Skill" 
                className="flex-1 bg-transparent text-[14px] text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Suggestions */}
            <div className="mt-8">
              <h4 className="mb-4 text-[14px] font-semibold text-slate-500 dark:text-slate-400">Suggestions</h4>
              <div className="flex flex-wrap gap-4">
                {suggestedSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] px-6 py-2.5 text-[13px] font-medium text-slate-600 transition hover:border-[#2f54eb] hover:text-[#2f54eb]"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="h-11 rounded-lg bg-[#2f54eb] px-10 text-[14px] font-semibold text-white transition hover:bg-[#2447d8]"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-5 gap-y-4">
            {currentSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] pl-5 pr-3 py-2 shadow-sm"
              >
                <span className="text-[13px] font-medium text-slate-600">{skill}</span>
                <button className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
