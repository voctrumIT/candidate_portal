"use client";

import { useState } from "react";
import { Plus, MoreVertical, Building2, MapPin, CalendarDays, Calendar, LocateFixed, ChevronDown } from "lucide-react";

const experienceList = [
  {
    id: 1,
    initials: "FS",
    role: "Full stack / UI Designer",
    company: "Kashtech Solutions",
    location: "Srinagar, Jammu & Kashmir",
    duration: "Feb 2023 - Sep 2025",
    skills: ["UI Design", "React.js", "Node.js", "Firebase", "Sql", "Mongo db"]
  },
  {
    id: 2,
    initials: "IS",
    role: "UI/UX Designer",
    company: "Voctrum",
    location: "Srinagar, Jammu & Kashmir",
    duration: "Feb 2025 - Present",
    skills: ["UI Design", "React.js", "Node.js", "Motion"]
  }
];

export default function WorkExperienceTab() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 dark:border-slate-700 pb-4">
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Work Experience</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-[#2f54eb] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#2447d8]"
          >
            <Plus className="h-4 w-4" /> Add Work Experience
          </button>
        )}
      </div>

      <div className="mt-8">
        {isEditing ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Designation <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Designation" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Organisation <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Organisation Name" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
              </div>
              
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Duration <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" placeholder="Start Date" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
                  <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f54eb]" />
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <div className="mb-2 flex items-center justify-end gap-2">
                  <input type="checkbox" id="currentRole" className="h-3.5 w-3.5 rounded border-slate-300 text-[#2f54eb] focus:ring-[#2f54eb]" />
                  <label htmlFor="currentRole" className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Currently Working in this role</label>
                </div>
                <div className="relative">
                  <input type="text" placeholder="End Date" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
                  <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f54eb]" />
                </div>
              </div>
              
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" placeholder="Select Location" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
                  <LocateFixed className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f54eb]" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Skills Acquired <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="h-11 w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-500 dark:text-slate-400 outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]">
                    <option value="" disabled selected>Select Type</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
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
            {experienceList.map((item) => (
              <div key={item.id} className="rounded-[12px] border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f0f4ff] font-bold text-[#2f54eb]">
                    {item.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-[15px] font-semibold text-slate-900 dark:text-white">{item.role}</h4>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Building2 className="h-4 w-4 text-[#2f54eb]" />
                        <span>{item.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4 text-[#2f54eb]" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-4 w-4 text-[#2f54eb]" />
                      <span>{item.duration}</span>
                    </div>
                    
                    <div className="mt-4">
                      <p className="mb-2 text-[13px] font-semibold text-slate-600">Skills Acquired</p>
                      <div className="flex flex-wrap gap-3">
                        {item.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="rounded-full border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 text-[12px] font-medium text-slate-600"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
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
