"use client";

import { useEffect, useState, use } from "react";
import { MapPin, Clock, Calendar, Wallet, Bookmark, Share2, Network } from "lucide-react";
import Link from "next/link";
import { dummyJobs } from "../../../jobs/data";
import JobCard from "../../../jobs/components/JobCard";
import ApplyButton from "./components/ApplyButton";
import { notFound } from "next/navigation";
import { jobsService } from "../../../../services/jobs";

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
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
      <div className="px-10 py-10 min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    notFound();
  }

  // Section Heading component for reuse
  const SectionHeading = ({ title }: { title: string }) => (
    <h3 className="mb-4 mt-8 flex items-center border-l-4 border-[#2f54eb] pl-3 text-lg font-bold text-slate-900 dark:text-white">
      {title}
    </h3>
  );

  return (
    <div className="px-10 py-10 pb-20 max-w-[1000px]">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          {/* Company Logo Placeholder */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#2f54eb]">
            <Network className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{job.company}</p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{job.title}</h1>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {job.tags.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex h-8 items-center rounded-full bg-[#f4f7ff] dark:bg-slate-800 px-5 text-[13px] font-medium text-slate-600 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Info Row */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[14px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#2f54eb]" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Location :</span> {job.location}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#2f54eb]" />
            {job.postedDate}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#2f54eb]" />
            {job.applyByDate}
          </div>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2 text-[14px] text-slate-500 dark:text-slate-400">
          <Wallet className="h-5 w-5 text-[#2f54eb]" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Salary :</span> {job.salaryRange}
        </div>

        {/* Action Buttons */}
        <div className="mt-2 flex items-center gap-4">
          <ApplyButton jobId={job.id} jobCompany={job.company} jobTitle={job.title} />
          <button className="flex h-11 items-center gap-2 rounded-lg border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] px-6 text-sm font-semibold text-[#2f54eb] transition hover:bg-[#f4f7ff]">
            Save for Later
            <Bookmark className="h-4 w-4" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <hr className="my-10 border-slate-200 dark:border-slate-700" />

      {/* Content Section */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">About the Job</h2>

        <SectionHeading title="Overview" />
        <p className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">{job.overview}</p>

        <SectionHeading title="Responsibilities" />
        <ul className="ml-4 list-disc space-y-3 text-[15px] text-slate-500 dark:text-slate-400 marker:text-slate-400">
          {job.responsibilities.map((item: string, idx: number) => (
            <li key={idx} className="pl-2">
              {item}
            </li>
          ))}
        </ul>

        <SectionHeading title="Qualifications" />
        <ul className="ml-4 list-disc space-y-3 text-[15px] text-slate-500 dark:text-slate-400 marker:text-slate-400">
          {job.qualifications.map((item: string, idx: number) => (
            <li key={idx} className="pl-2">
              {item}
            </li>
          ))}
        </ul>

        <SectionHeading title="Key Skills" />
        <div className="flex flex-wrap gap-3">
          {job.keySkills.map((skill: string) => (
            <span
              key={skill}
              className="inline-flex h-9 items-center rounded-full border border-slate-300 px-5 text-[13px] font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>

        <SectionHeading title="About the Company" />
        {/* Render paragraphs dynamically since it contains line breaks */}
        <div className="space-y-4 text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
          {job.aboutCompany.split("\n\n").map((para: string, idx: number) => {
            // First paragraph in the dummy data is the company size/type string, which should be bolded according to the design.
            if (idx === 0) {
              return (
                <p key={idx} className="font-bold text-slate-700 dark:text-slate-300">
                  {para}
                </p>
              );
            }
            return <p key={idx}>{para}</p>;
          })}
        </div>
      </div>

      <hr className="my-12 border-slate-200 dark:border-slate-700" />

      {/* Similar Jobs Section */}
      <div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Similar Jobs</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Explore more opportunities that match your profile and interests.</p>
          </div>
          <Link href="/dashboard/jobs" className="text-sm font-bold text-slate-900 dark:text-white underline underline-offset-4 hover:text-[#2f54eb]">
            View all
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {/* Slicing exactly 3 jobs to match screenshot layout */}
          {similarJobs.slice(0, 3).map((similarJob: any) => (
            <JobCard key={similarJob.id} job={similarJob} isDashboard />
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="mt-10 flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#2f54eb]"></div>
          <div className="h-2 w-2 rounded-full bg-slate-300"></div>
          <div className="h-2 w-2 rounded-full bg-slate-300"></div>
        </div>
      </div>
    </div>
  );
}
