"use client";

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobSearchHero from './components/JobSearchHero';
import JobCard from './components/JobCard';
import Pagination from './components/Pagination';
import { JobCardSkeleton } from '../components/Skeleton';
import { jobsService } from '../../services/jobs';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="pt-20 bg-[#fefefe] dark:bg-[#121212] min-h-screen">
      <Navbar />
      
      <JobSearchHero />

      {/* Jobs Grid */}
      <div className="mx-auto mt-10 max-w-[1360px] px-5 md:px-10 lg:px-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400">
              No jobs found.
            </div>
          )}
        </div>
      </div>

      {!loading && jobs.length > 0 && <Pagination />}
      
      <Footer />
    </main>
  );
}
