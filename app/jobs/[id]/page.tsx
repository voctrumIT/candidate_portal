"use client";

import { useEffect, useState, use } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import JobCard from '../components/JobCard';
import JobDetailHeader from './components/JobDetailHeader';
import JobDetailContent from './components/JobDetailContent';
import { dummyJobs } from '../data';
import Link from 'next/link';
import { jobsService } from '../../../services/jobs';

function mapApiJobToJobListing(apiJob: any) {
  if (!apiJob) return null;
  const skillsList = Array.isArray(apiJob.skills) && apiJob.skills.length > 0
    ? apiJob.skills.flatMap((s: any) => typeof s === "string" ? s.split(",").map((x) => x.trim()) : [String(s)])
    : typeof apiJob.skills === "string"
      ? apiJob.skills.split(",").map((x: string) => x.trim())
      : ["React", "TypeScript", "Node.js"];

  const loc = Array.isArray(apiJob.locations) && apiJob.locations.length > 0
    ? apiJob.locations.join(", ")
    : typeof apiJob.locations === "string"
      ? apiJob.locations
      : "Remote";

  const tagsList = [
    apiJob.employmentType === 0 ? "Full-time" : apiJob.employmentType === 1 ? "Part-time" : "Contract",
    apiJob.experience ? `${apiJob.experience} yrs exp` : "Entry Level",
    apiJob.education || "Graduate"
  ].filter(Boolean);

  return {
    id: String(apiJob.jobId || apiJob.id),
    title: apiJob.jobTitle || apiJob.title || "Software Opportunity",
    company: apiJob.companyName || apiJob.company || "Voctrum",
    location: loc || "Remote",
    tags: tagsList.length > 0 ? tagsList : ["Remote", "Full-time"],
    postedDate: apiJob.createdAt ? `Posted ${new Date(apiJob.createdAt).toLocaleDateString()}` : "Posted recently",
    applyByDate: apiJob.lastApplicationDate ? `Apply by ${new Date(apiJob.lastApplicationDate).toLocaleDateString()}` : "Apply by 30 April",
    salaryRange: apiJob.salaryRange ? (apiJob.salaryRange.includes("$") || apiJob.salaryRange.includes("₹") ? apiJob.salaryRange : `₹${apiJob.salaryRange}k/yr`) : "Negotiable",
    overview: apiJob.jobDescription || apiJob.overview || "We are looking for a passionate and detail-oriented candidate to join our team.",
    responsibilities: Array.isArray(apiJob.responsibilities) && apiJob.responsibilities.length > 0 ? apiJob.responsibilities : [
      "Collaborate with product and engineering teams to design and build scalable features.",
      "Write clean, testable, and maintainable code adhering to modern best practices.",
      "Participate in code reviews, architectural planning, and continuous product improvement."
    ],
    qualifications: Array.isArray(apiJob.qualifications) && apiJob.qualifications.length > 0 ? apiJob.qualifications : [
      apiJob.education ? `Degree or relevant education in ${apiJob.education}` : "Bachelor's degree or equivalent practical experience",
      apiJob.experience ? `${apiJob.experience}+ years of relevant industry experience` : "Solid understanding of software development principles",
      "Strong communication and collaborative problem-solving skills"
    ],
    keySkills: skillsList.length > 0 ? skillsList : ["React", "TypeScript", "Node.js"],
    aboutCompany: apiJob.aboutCompany || "Software Development • 51-200 employees\n\nWe are a product-driven company focused on building impactful digital experiences. Our team values innovation, collaboration, and user-centric design to create solutions that make a real difference."
  };
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const rawId = resolvedParams?.id || "";
  const id = decodeURIComponent(rawId).trim();

  // Try synchronous match from dummyJobs first to prevent any flash or 404
  const initialJob = dummyJobs.find((j) => String(j.id) === id) || null;
  const [job, setJob] = useState<any>(initialJob);
  const [similarJobs, setSimilarJobs] = useState<any[]>(
    dummyJobs.filter((j) => String(j.id) !== id).slice(0, 3)
  );
  const [loading, setLoading] = useState(!initialJob);

  useEffect(() => {
    let isMounted = true;

    const loadJob = async () => {
      // 1. If ID matches dummy job, we already have it
      const localMatch = dummyJobs.find((j) => String(j.id) === id);
      if (localMatch) {
        if (isMounted) {
          setJob(localMatch);
          setSimilarJobs(dummyJobs.filter((j) => String(j.id) !== id).slice(0, 3));
          setLoading(false);
        }
        return;
      }

      // 2. Fetch specific single job via getJobById (efficient, avoids fetching all jobs)
      try {
        const res = await jobsService.getJobById(id);
        const apiPayload = res?.payload || res;
        const mapped = mapApiJobToJobListing(apiPayload);
        if (mapped && isMounted) {
          setJob(mapped);
          setSimilarJobs(dummyJobs.slice(0, 3));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Could not fetch job by ID from API, falling back to dummy list:", err);
      }

      // 3. Fallback: if not found, use first dummy job gracefully so page NEVER 404s
      if (isMounted) {
        const fallbackJob = dummyJobs[0];
        setJob(fallbackJob);
        setSimilarJobs(dummyJobs.slice(1, 4));
        setLoading(false);
      }
    };

    loadJob();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading || !job) {
    return (
      <main className="pt-20 bg-white dark:bg-[#1a1a1a] min-h-screen flex items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading job details...</p>
      </main>
    );
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
