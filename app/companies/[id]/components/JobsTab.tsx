"use client";

import { useEffect, useState } from "react";
import CompanyJobFilters from "./CompanyJobFilters";
import JobCard from "../../../jobs/components/JobCard";
import { JobCardSkeleton } from "../../../components/Skeleton";
import { jobsService } from "../../../../services/jobs";

export default function JobsTab() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCompanyJobs = async () => {
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
                apiJob.employmentType === 0 ? 'Full-time' : apiJob.employmentType === 1 ? 'Part-time' : 'Contract',
                apiJob.experience ? `${apiJob.experience} yrs` : 'Entry Level',
                apiJob.education || 'Graduate'
              ].filter(Boolean),
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
          setJobs(mappedJobs.slice(0, 9));
        }
      } catch (err) {
        console.error("Failed to load company jobs", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCompanyJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="py-2">
      <CompanyJobFilters />

      {/* Jobs Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            No openings found for this company at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
