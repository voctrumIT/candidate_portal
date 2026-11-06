"use client";

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobSearchHero from './components/JobSearchHero';
import CategoryPills from './components/CategoryPills';
import JobCard from './components/JobCard';
import Pagination from './components/Pagination';
import { jobsService } from '../../services/jobs';
import { dummyJobs } from './data';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>(dummyJobs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobsService.getJobs();
        const apiJobs = data?.payload?.jobs;
        if (apiJobs && Array.isArray(apiJobs)) {
          const mappedJobs = apiJobs.map((apiJob: any) => {
            const loc = Array.isArray(apiJob.locations) ? apiJob.locations.join(', ') : (typeof apiJob.locations === 'string' ? apiJob.locations : 'Remote');
            const skills = Array.isArray(apiJob.skills) ? apiJob.skills : (typeof apiJob.skills === 'string' ? apiJob.skills.split(',').map((s: string) => s.trim()) : ['Node.js', 'Express']);
            const resp = Array.isArray(apiJob.responsibilities) ? apiJob.responsibilities : (typeof apiJob.responsibilities === 'string' ? apiJob.responsibilities.split('\n').filter(Boolean) : ['Develop new features', 'Write clean code']);
            const qual = Array.isArray(apiJob.qualifications) ? apiJob.qualifications : (typeof apiJob.qualifications === 'string' ? apiJob.qualifications.split('\n').filter(Boolean) : ['Bachelor\'s degree', 'Experience in development']);

            return {
              id: String(apiJob.jobId || Math.random()),
              title: apiJob.jobTitle || 'Job Opportunity',
              company: apiJob.companyName || 'Voctrum',
              location: loc || 'Remote',
              tags: [
                apiJob.employmentType === 0 ? 'Full-time' : apiJob.employmentType === 1 ? 'Part-time' : 'Contract',
                apiJob.experience || 'Entry Level',
                apiJob.education || 'Graduate'
              ],
              postedDate: apiJob.createdAt ? `Posted ${new Date(apiJob.createdAt).toLocaleDateString()}` : 'Posted recently',
              applyByDate: apiJob.lastApplicationDate ? `Apply by ${new Date(apiJob.lastApplicationDate).toLocaleDateString()}` : 'Apply by 30 April',
              salaryRange: apiJob.salaryRange || 'Negotiable',
              overview: apiJob.jobDescription || apiJob.overview || 'We are looking for a passionate professional to join our team.',
              responsibilities: resp,
              qualifications: qual,
              keySkills: skills,
              aboutCompany: apiJob.aboutCompany || 'Voctrum is a product-driven company focused on building impactful digital experiences.'
            };
          });
          if (mappedJobs.length > 0) {
            setJobs(mappedJobs);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <main className="pt-20 bg-[#fefefe]">
      <Navbar />
      
      <JobSearchHero />
      <CategoryPills />

      {/* Jobs Grid */}
      <div className="mx-auto mt-10 max-w-[1360px] px-5 md:px-10 lg:px-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      <Pagination />
      
      <Footer />
    </main>
  );
}
