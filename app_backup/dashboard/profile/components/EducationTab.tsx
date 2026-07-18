"use client";

import { useState } from "react";
import { Plus, MoreVertical, GraduationCap, CalendarDays, LocateFixed, ChevronDown, Calendar } from "lucide-react";

const educationList = [
  {
    id: 1,
    school: "Islamic university of science and technology(IUST), Awantipora",
    degree: "Graduate, B.Tech Computer Science Engineering",
    duration: "2020 Sep - 2024 Sep",
    description: "I hold a B.Tech degree with a specialization in Machine Learning, where I developed a strong foundation in data analysis, algorithms, and intelligent systems."
  },
  {
    id: 2,
    school: "Islamic university of science and technology(IUST), Awantipora",
    degree: "Graduate, M.Tech Computer Science Engineering",
    duration: "2024 Oct - 2026 Mar",
    description: "I hold a B.Tech degree with a specialization in Machine Learning, where I developed a strong foundation in data analysis, algorithms, and intelligent systems."
  }
];

export default function EducationTab() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Education</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-[#2f54eb] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#2447d8]"
          >
            <Plus className="h-4 w-4" /> Add Education
          </button>
        )}
      </div>

      <div className="mt-8">
        {isEditing ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">College <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter College Name" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">Preferred Work Location</label>
                <div className="relative">
                  <input type="text" placeholder="Select Location" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
                  <LocateFixed className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f54eb]" />
                </div>
              </div>
              
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">Qualification <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="h-11 w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-500 dark:text-slate-400 outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]">
                    <option value="" disabled selected>Select Qualification</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">Course <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="h-11 w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-500 dark:text-slate-400 outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]">
                    <option value="" disabled selected>Select Course</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">Specialization <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="h-11 w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-500 dark:text-slate-400 outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]">
                    <option value="" disabled selected>Select Specialization</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">Duration <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input type="text" placeholder="Start Date" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
                    <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f54eb]" />
                  </div>
                  <div className="relative">
                    <input type="text" placeholder="End Date" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
                    <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f54eb]" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea 
                placeholder="Detail your education degree"
                className="h-32 w-full resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]"
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="h-11 rounded-lg bg-[#2f54eb] px-10 text-[14px] font-semibold text-white transition hover:bg-[#2447d8]"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {educationList.map((item) => (
              <div key={item.id} className="rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f0f4ff] font-bold text-[#2f54eb]">
                    IS
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-[15px] font-semibold text-slate-900 dark:text-white">{item.school}</h4>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <GraduationCap className="h-4 w-4 text-[#2f54eb]" />
                      <span>{item.degree}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-4 w-4 text-[#2f54eb]" />
                      <span>{item.duration}</span>
                    </div>
                    
                    <p className="mt-4 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
