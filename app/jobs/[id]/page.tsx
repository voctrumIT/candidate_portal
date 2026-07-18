"use client";

import { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import JobCard from '../components/JobCard';
import JobDetailHeader from './components/JobDetailHeader';
import JobDetailContent from './components/JobDetailContent';
import { dummyJobs } from '../data';
import Link from 'next/link';
import { jobsService } from '../../../services/jobs';

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [job, setJob] = useState<any>(null);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const data = await jobsService.getJobs();
        const apiJobs = data?.payload?.jobs;
        let foundJob = null;
        let allJobs = dummyJobs;

        if (apiJobs && Array.isArray(apiJobs)) {
          const mappedJobs = apiJobs.map((apiJob: any) => ({
            id: apiJob.jobId,
            title: apiJob.jobTitle,
            company: apiJob.companyName || 'Voctrum',
            location: (apiJob.locations && apiJob.locations.length > 0) ? apiJob.locations.join(', ') : 'Remote',
            tags: [
              apiJob.employmentType === 0 ? 'Full-time' : apiJob.employmentType === 1 ? 'Part-time' : 'Contract',
              apiJob.experience || 'Entry Level',
              apiJob.education || 'Graduate'
            ],
            postedDate: apiJob.createdAt ? `Posted ${new Date(apiJob.createdAt).toLocaleDateString()}` : 'Posted recently',
            applyByDate: apiJob.lastApplicationDate ? `Apply by ${new Date(apiJob.lastApplicationDate).toLocaleDateString()}` : 'Apply by 30 April',
            salaryRange: apiJob.salaryRange || 'Negotiable',
            overview: apiJob.overview || 'We are looking for a passionate developer to join our team.',
            responsibilities: apiJob.responsibilities || ['Develop new features', 'Write clean code'],
            qualifications: apiJob.qualifications || ['Bachelor\'s degree', 'Experience in backend dev'],
            keySkills: apiJob.skills || ['Node.js', 'Express'],
            aboutCompany: apiJob.aboutCompany || 'Voctrum is a product-driven company focused on building impactful digital experiences.'
          }));
          foundJob = mappedJobs.find((j) => j.id === id);
          if (mappedJobs.length > 0) {
            allJobs = mappedJobs;
          }
        }

        if (!foundJob) {
          foundJob = dummyJobs.find((j) => j.id === id);
        }

        if (foundJob) {
          setJob(foundJob);
          setSimilarJobs(allJobs.filter((j) => j.id !== id).slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching job detail", err);
        const fallback = dummyJobs.find((j) => j.id === id);
        if (fallback) {
          setJob(fallback);
          setSimilarJobs(dummyJobs.filter((j) => j.id !== id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (loading) {
    return (
      <main className="pt-20 bg-white dark:bg-[#1a1a1a] min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading job details...</p>
      </main>
    );
  }

  if (!job) {
    notFound();
  }

  return (
    <main className="pt-20 bg-white dark:bg-[#1a1a1a]">
      <Navbar />

      <div className="mx-auto max-w-[960px] px-5 pt-12 md:px-10 lg:px-16">
        <JobDetailHeader job={job} />
        <JobDetailContent job={job} />
      </div>

      {/* Similar Jobs Section */}
      <div className="mx-auto max-w-[1360px] px-5 py-16 md:px-10 lg:px-16 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Similar Jobs</h2>
            <p className="mt-1 text-[14px] text-slate-500 dark:text-slate-400">
              Explore more opportunities that match your profile and interests.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-[14px] font-semibold text-slate-900 dark:text-white underline transition hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similarJobs.map((similarJob) => (
            <JobCard key={similarJob.id} job={similarJob} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
