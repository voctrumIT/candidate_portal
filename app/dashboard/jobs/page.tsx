"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ChevronDown, X, RotateCcw, Briefcase } from "lucide-react";
import JobCard from "../../jobs/components/JobCard";
import Pagination from "../../jobs/components/Pagination";
import { JobCardSkeleton } from "../../components/Skeleton";
import { jobsService } from "../../../services/jobs";

export default function DashboardJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const [data, savedList] = await Promise.all([
          jobsService.getJobs(),
          jobsService.getSavedJobs(),
        ]);
        if (isMounted) {
          setSavedIds(savedList.map((s: any) => String(s.jobId || s.id)));
        }
        const apiJobs = data?.payload?.jobs || (Array.isArray(data) ? data : []);
        if (apiJobs && Array.isArray(apiJobs) && isMounted) {
          const mappedJobs = apiJobs.map((apiJob: any) => {
            const loc = Array.isArray(apiJob.locations) ? apiJob.locations.join(', ') : (typeof apiJob.locations === 'string' ? apiJob.locations : 'Remote');
            const skills = Array.isArray(apiJob.skills) ? apiJob.skills : (typeof apiJob.skills === 'string' ? apiJob.skills.split(',').map((s: string) => s.trim()) : ['Node.js', 'Express']);
            const resp = Array.isArray(apiJob.responsibilities) ? apiJob.responsibilities : (typeof apiJob.responsibilities === 'string' ? apiJob.responsibilities.split('\n').filter(Boolean) : ['Develop new features', 'Write clean code']);
            const qual = Array.isArray(apiJob.qualifications) ? apiJob.qualifications : (typeof apiJob.qualifications === 'string' ? apiJob.qualifications.split('\n').filter(Boolean) : ['Bachelor\'s degree', 'Experience in development']);

            return {
              id: String(apiJob.jobId || apiJob.id || Math.random()),
              title: apiJob.jobTitle || apiJob.title || 'Job Opportunity',
              company: apiJob.companyName || apiJob.company || 'Voctrum',
              location: loc || 'Remote',
              tags: [
                apiJob.experience ? `${apiJob.experience} yrs` : 'Entry Level',
                apiJob.education || 'Graduate'
              ].filter(Boolean),
              rawExperience: apiJob.experience,
              createdAt: apiJob.createdAt,
              postedDate: apiJob.createdAt ? `Posted ${new Date(apiJob.createdAt).toLocaleDateString()}` : 'Posted recently',
              applyByDate: apiJob.lastApplicationDate ? `Apply by ${new Date(apiJob.lastApplicationDate).toLocaleDateString()}` : 'Apply by 30 April',
              salaryRange: apiJob.salaryRange ? (apiJob.salaryRange.includes('$') || apiJob.salaryRange.includes('₹') ? apiJob.salaryRange : `₹${apiJob.salaryRange}k/yr`) : 'Negotiable',
              overview: apiJob.jobDescription || apiJob.overview || 'We are looking for a passionate professional to join our team.',
              responsibilities: resp,
              qualifications: qual,
              keySkills: skills,
              aboutCompany: apiJob.aboutCompany || 'Voctrum is a product-driven company focused on building impactful digital experiences.'
            };
          });
          setJobs(mappedJobs);
        }
      } catch (err) {
        console.error("Failed to fetch live jobs", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically extract available options
  const availableRoles = useMemo(() => {
    const roleKeywords = ["Frontend", "Backend", "Full Stack", "Developer", "Designer", "Product", "QA", "Engineer", "Data", "Marketing"];
    const matched = new Set<string>();
    jobs.forEach((j) => {
      roleKeywords.forEach((kw) => {
        if (j.title?.toLowerCase().includes(kw.toLowerCase())) {
          matched.add(kw);
        }
      });
      if (j.title && j.title.length < 35) {
        matched.add(j.title);
      }
    });
    return Array.from(matched).slice(0, 10);
  }, [jobs]);

  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    jobs.forEach((j) => {
      if (j.location && j.location.toLowerCase() !== "remote") {
        locs.add(j.location.split(",")[0].trim());
      }
    });
    return Array.from(locs).slice(0, 8);
  }, [jobs]);

  // Reset pagination on search or filter change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    setCurrentPage(1);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const handleExperienceChange = (exp: string) => {
    setSelectedExperience(exp);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedRole("All");
    setSelectedLocation("All");
    setSelectedDate("All");
    setSelectedExperience("All");
    setCurrentPage(1);
  };

  // Robust multi-term reactive filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Multi-term Search Query
      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const searchableFields = [
          job.title,
          job.company,
          job.location,
          job.overview,
          job.aboutCompany,
          ...(Array.isArray(job.keySkills) ? job.keySkills : []),
          ...(Array.isArray(job.tags) ? job.tags : []),
          ...(Array.isArray(job.responsibilities) ? job.responsibilities : []),
          ...(Array.isArray(job.qualifications) ? job.qualifications : [])
        ].filter(Boolean).join(" ").toLowerCase();

        const allTermsMatch = terms.every((term) => searchableFields.includes(term));
        if (!allTermsMatch) {
          return false;
        }
      }

      // 2. Role Filter
      if (selectedRole !== "All") {
        const rLower = selectedRole.toLowerCase();
        const titleLower = (job.title || "").toLowerCase();
        const skillsMatch = job.keySkills?.some((s: string) => s.toLowerCase().includes(rLower));
        if (!titleLower.includes(rLower) && !skillsMatch) {
          return false;
        }
      }

      // 3. Location Filter
      if (selectedLocation !== "All") {
        const locLower = (job.location || "").toLowerCase();
        const selLocLower = selectedLocation.toLowerCase();
        if (selLocLower === "remote") {
          if (!locLower.includes("remote")) return false;
        } else if (!locLower.includes(selLocLower)) {
          return false;
        }
      }

      // 4. Experience Level Filter
      if (selectedExperience !== "All") {
        const expLower = selectedExperience.toLowerCase();
        const tagsStr = (job.tags || []).join(" ").toLowerCase();
        const titleAndDesc = `${job.title} ${job.overview}`.toLowerCase();
        const expNum = parseInt(String(job.rawExperience || ""), 10);

        if (expLower.includes("entry")) {
          const isEntry =
            (!isNaN(expNum) && expNum <= 2) ||
            tagsStr.includes("entry") ||
            titleAndDesc.includes("junior") ||
            titleAndDesc.includes("entry");
          if (!isEntry) return false;
        } else if (expLower.includes("mid")) {
          const isMid =
            (!isNaN(expNum) && expNum >= 3 && expNum <= 5) ||
            tagsStr.includes("3") ||
            tagsStr.includes("4") ||
            titleAndDesc.includes("mid") ||
            titleAndDesc.includes("intermediate");
          if (!isMid) return false;
        } else if (expLower.includes("senior")) {
          const isSenior =
            (!isNaN(expNum) && expNum > 5) ||
            tagsStr.includes("5+") ||
            tagsStr.includes("6") ||
            tagsStr.includes("7") ||
            titleAndDesc.includes("senior") ||
            titleAndDesc.includes("lead");
          if (!isSenior) return false;
        }
      }

      // 5. Date Posted Filter
      if (selectedDate !== "All" && job.createdAt) {
        const jobTime = new Date(job.createdAt).getTime();
        const now = Date.now();
        const diffHours = (now - jobTime) / (1000 * 60 * 60);
        if (selectedDate === "Past 24 Hours" && diffHours > 24) return false;
        if (selectedDate === "Past Week" && diffHours > 24 * 7) return false;
        if (selectedDate === "Past Month" && diffHours > 24 * 30) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedRole, selectedLocation, selectedExperience, selectedDate]);

  // Total pages and pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedJobs = useMemo(() => {
    const startIndex = (activePage - 1) * pageSize;
    return filteredJobs.slice(startIndex, startIndex + pageSize);
  }, [filteredJobs, activePage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

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
    <div className="px-6 md:px-10 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-black text-slate-900 dark:text-white">Explore Jobs</h2>
          <p className="mt-1 text-[15px] font-medium text-slate-500 dark:text-slate-400">
            Great opportunities are out there—adjust your filters to discover matching roles
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <strong className="text-blue-600 dark:text-blue-400">{filteredJobs.length}</strong> jobs
        </span>
      </div>

      {/* Search Bar */}
      <div className="mt-8 relative max-w-2xl">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#2f54eb]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search jobs by title, company, skills, or keywords..."
          className="w-full h-14 pl-14 pr-12 rounded-full bg-[#f4f7ff] dark:bg-slate-800 border-none text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#2f54eb] outline-none transition"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters Row - Employment Type Removed */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {isAnyFilterActive ? (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 h-10 rounded-full bg-[#2f54eb] px-5 text-[13px] font-semibold text-white transition hover:bg-[#2447d8] shadow-xs"
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
            onChange={(e) => handleRoleChange(e.target.value)}
            className={`appearance-none cursor-pointer h-10 rounded-full pl-4 pr-8 text-[13px] font-semibold transition outline-none ${
              selectedRole !== "All"
                ? "bg-blue-50 dark:bg-blue-950/60 text-[#2f54eb] dark:text-blue-300 border-2 border-[#2f54eb]"
                : "bg-[#f1f5f9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
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
            onChange={(e) => handleLocationChange(e.target.value)}
            className={`appearance-none cursor-pointer h-10 rounded-full pl-4 pr-8 text-[13px] font-semibold transition outline-none ${
              selectedLocation !== "All"
                ? "bg-blue-50 dark:bg-blue-950/60 text-[#2f54eb] dark:text-blue-300 border-2 border-[#2f54eb]"
                : "bg-[#f1f5f9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
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
            onChange={(e) => handleDateChange(e.target.value)}
            className={`appearance-none cursor-pointer h-10 rounded-full pl-4 pr-8 text-[13px] font-semibold transition outline-none ${
              selectedDate !== "All"
                ? "bg-blue-50 dark:bg-blue-950/60 text-[#2f54eb] dark:text-blue-300 border-2 border-[#2f54eb]"
                : "bg-[#f1f5f9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
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
            onChange={(e) => handleExperienceChange(e.target.value)}
            className={`appearance-none cursor-pointer h-10 rounded-full pl-4 pr-8 text-[13px] font-semibold transition outline-none ${
              selectedExperience !== "All"
                ? "bg-blue-50 dark:bg-blue-950/60 text-[#2f54eb] dark:text-blue-300 border-2 border-[#2f54eb]"
                : "bg-[#f1f5f9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
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

      {/* Jobs Grid */}
      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))
        ) : paginatedJobs.length > 0 ? (
          paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} isDashboard initialSaved={savedIds.includes(job.id)} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">No Matching Jobs Found</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No job postings matched your current search filters. Try clearing or expanding your criteria.
            </p>
            <button
              onClick={handleClearAll}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#2f54eb] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2447d8] shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredJobs.length > 0 && (
        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          totalItems={filteredJobs.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          itemLabel="jobs"
        />
      )}
    </div>
  );
}
