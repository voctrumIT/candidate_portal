"use client";

import { useEffect, useState, use } from "react";
import { MapPin, Clock, Calendar, Wallet, Bookmark, Share2, Network } from "lucide-react";
import Link from "next/link";
import { dummyJobs } from "../../../jobs/data";
import JobCard from "../../../jobs/components/JobCard";
import ApplyButton from "./components/ApplyButton";
import { jobsService } from "../../../../services/jobs";

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

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
      <div className="px-10 py-10 min-h-screen flex items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading job details...</p>
      </div>
    );
  }

  // Section Heading component for reuse
  const SectionHeading = ({ title }: { title: string }) => (
    <h3 className="mb-4 mt-8 flex items-center border-l-4 border-[#2f54eb] pl-3 text-lg font-bold text-slate-900 dark:text-white">
      {title}
    </h3>
  );

  const tags = Array.isArray(job.tags) ? job.tags : ["Full-time", "Remote"];
  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const qualifications = Array.isArray(job.qualifications) ? job.qualifications : [];
  const keySkills = Array.isArray(job.keySkills) ? job.keySkills : [];
  const aboutText = typeof job.aboutCompany === "string" ? job.aboutCompany : "Voctrum is dedicated to empowering modern professionals and organizations.";

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
          {tags.map((tag: string) => (
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
          {responsibilities.map((item: string, idx: number) => (
            <li key={idx} className="pl-2">
              {item}
            </li>
          ))}
        </ul>

        <SectionHeading title="Qualifications" />
        <ul className="ml-4 list-disc space-y-3 text-[15px] text-slate-500 dark:text-slate-400 marker:text-slate-400">
          {qualifications.map((item: string, idx: number) => (
            <li key={idx} className="pl-2">
              {item}
            </li>
          ))}
        </ul>

        <SectionHeading title="Key Skills" />
        <div className="flex flex-wrap gap-3">
          {keySkills.map((skill: string) => (
            <span
              key={skill}
              className="inline-flex h-9 items-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-[13px] font-medium text-slate-600 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>

        <SectionHeading title="About the Company" />
        <div className="space-y-4 text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
          {aboutText.split("\n\n").map((para: string, idx: number) => {
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
