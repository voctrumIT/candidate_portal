"use client";

import { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobSearchHero from './components/JobSearchHero';
import JobCard from './components/JobCard';
import Pagination from './components/Pagination';
import { JobCardSkeleton } from '../components/Skeleton';
import { jobsService } from '../../services/jobs';
import { Briefcase } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
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
        const data = await jobsService.getJobs();
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

  // Dynamically extract available filter options from the jobs list
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

  // Reset pagination to page 1 whenever search query or filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
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
      window.scrollTo({ top: 220, behavior: "smooth" });
    }
  };

  return (
    <main className="pt-20 bg-[#fefefe] dark:bg-[#121212] min-h-screen">
      <Navbar />
      
      <JobSearchHero
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        selectedExperience={selectedExperience}
        onExperienceChange={handleExperienceChange}
        onClearAll={handleClearAll}
        availableRoles={availableRoles}
        availableLocations={availableLocations}
        resultsCount={filteredJobs.length}
      />

      {/* Jobs Grid */}
      <div className="mx-auto mt-10 max-w-[1360px] px-5 md:px-10 lg:px-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))
          ) : paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">No Matching Jobs Found</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No job openings matched your active filters. Try adjusting your search keywords or clearing filters.
              </p>
              <button
                onClick={handleClearAll}
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-800 shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

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
      
      <Footer />
    </main>
  );
}
