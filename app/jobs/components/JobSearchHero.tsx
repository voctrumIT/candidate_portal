"use client";

import { Search, ChevronDown, X, RotateCcw } from 'lucide-react';

interface JobSearchHeroProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  selectedRole?: string;
  onRoleChange?: (role: string) => void;
  selectedLocation?: string;
  onLocationChange?: (loc: string) => void;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  selectedExperience?: string;
  onExperienceChange?: (exp: string) => void;
  onClearAll?: () => void;
  availableRoles?: string[];
  availableLocations?: string[];
  resultsCount?: number;
}

export default function JobSearchHero({
  searchQuery = "",
  onSearchChange,
  selectedRole = "All",
  onRoleChange,
  selectedLocation = "All",
  onLocationChange,
  selectedDate = "All",
  onDateChange,
  selectedExperience = "All",
  onExperienceChange,
  onClearAll,
  availableRoles = [],
  availableLocations = [],
  resultsCount,
}: JobSearchHeroProps) {
  const isAnyFilterActive =
    Boolean(searchQuery.trim()) ||
    selectedRole !== "All" ||
    selectedLocation !== "All" ||
    selectedDate !== "All" ||
    selectedExperience !== "All";

  const dateOptions = [
    { label: "Date Posted (All)", value: "All" },
    { label: "Past 24 Hours", value: "Past 24 Hours" },
    { label: "Past Week", value: "Past Week" },
    { label: "Past Month", value: "Past Month" },
  ];

  const experienceOptions = [
    { label: "Experience (All)", value: "All" },
    { label: "Entry Level (0-2 yrs)", value: "Entry Level" },
    { label: "Mid Level (3-5 yrs)", value: "Mid Level" },
    { label: "Senior Level (5+ yrs)", value: "Senior Level" },
  ];

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-10 md:px-10 lg:px-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-[38px]">Explore Jobs</h1>
          <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
            Great opportunities are out there—adjust your filters to discover matching roles
          </p>
        </div>
        {typeof resultsCount === "number" && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-start md:self-end">
            Showing <strong className="text-blue-600 dark:text-blue-400">{resultsCount}</strong> jobs
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="mt-7 flex items-center gap-3 rounded-[14px] bg-[#EEF2F6] dark:bg-slate-800/80 px-4 py-3.5 border border-slate-200/60 dark:border-slate-700 transition focus-within:ring-2 focus-within:ring-blue-600">
        <Search className="h-5 w-5 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search jobs by title, company, skills, or keywords..."
          className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-slate-500 dark:text-slate-400 text-slate-900 dark:text-white"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange?.("")}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns Row - WITHOUT Employment Type */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {/* Clear All button */}
        {isAnyFilterActive ? (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-800 shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear all
          </button>
        ) : (
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Filters:</span>
        )}

        {/* Role Filter */}
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange?.(e.target.value)}
            className={`appearance-none cursor-pointer rounded-full pl-4 pr-8 py-2 text-[13px] font-medium transition outline-none ${
              selectedRole !== "All"
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                : "bg-[#F3F4F6] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <option value="All">Role: All Roles</option>
            {availableRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange?.(e.target.value)}
            className={`appearance-none cursor-pointer rounded-full pl-4 pr-8 py-2 text-[13px] font-medium transition outline-none ${
              selectedLocation !== "All"
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                : "bg-[#F3F4F6] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <option value="All">Location: All Locations</option>
            <option value="Remote">Remote</option>
            {availableLocations
              .filter((loc) => loc.toLowerCase() !== "remote" && loc !== "All")
              .map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>

        {/* Date Posted Filter */}
        <div className="relative">
          <select
            value={selectedDate}
            onChange={(e) => onDateChange?.(e.target.value)}
            className={`appearance-none cursor-pointer rounded-full pl-4 pr-8 py-2 text-[13px] font-medium transition outline-none ${
              selectedDate !== "All"
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                : "bg-[#F3F4F6] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {dateOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>

        {/* Experience Level Filter */}
        <div className="relative">
          <select
            value={selectedExperience}
            onChange={(e) => onExperienceChange?.(e.target.value)}
            className={`appearance-none cursor-pointer rounded-full pl-4 pr-8 py-2 text-[13px] font-medium transition outline-none ${
              selectedExperience !== "All"
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                : "bg-[#F3F4F6] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {experienceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
    </div>
  );
}
