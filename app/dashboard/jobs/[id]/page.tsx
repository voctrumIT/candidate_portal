"use client";

import { useEffect, useState, use } from "react";
import { MapPin, Clock, Calendar, Wallet, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JobCard from "../../../jobs/components/JobCard";
import ApplyButton from "./components/ApplyButton";
import { JobDetailSkeleton } from "../../../components/Skeleton";
import { toast } from "../../../components/Toast";
import { jobsService } from "../../../../services/jobs";
import { useAuth } from "../../../../context/AuthContext";
import JobOverviewRenderer, { isHtml } from "../../../components/JobOverviewRenderer";

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

  const overviewText = apiJob.jobDescription || apiJob.overview || "We are looking for a passionate and detail-oriented candidate to join our team.";
  const hasHtml = isHtml(overviewText);

  const responsibilitiesList = Array.isArray(apiJob.responsibilities) && apiJob.responsibilities.length > 0
    ? apiJob.responsibilities
    : hasHtml
      ? []
      : [
          "Collaborate with product and engineering teams to design and build scalable features.",
          "Write clean, testable, and maintainable code adhering to modern best practices.",
          "Participate in code reviews, architectural planning, and continuous product improvement."
        ];

  const qualificationsList = Array.isArray(apiJob.qualifications) && apiJob.qualifications.length > 0
    ? apiJob.qualifications
    : hasHtml
      ? []
      : [
          apiJob.education ? `Degree or relevant education in ${apiJob.education}` : "Bachelor's degree or equivalent practical experience",
          apiJob.experience ? `${apiJob.experience}+ years of relevant industry experience` : "Solid understanding of software development principles",
          "Strong communication and collaborative problem-solving skills"
        ];

  return {
    id: String(apiJob.jobId || apiJob.id),
    tenantId: apiJob.tenant?.normalizedTenantId || apiJob.tenantId || apiJob.normalizedTenantId || 'dotnetapi',
    title: apiJob.jobTitle || apiJob.title || "Job Opportunity",
    company: apiJob.companyName || apiJob.company || "Voctrum",
    location: loc || "Remote",
    tags: tagsList.length > 0 ? tagsList : ["Remote", "Full-time"],
    postedDate: apiJob.createdAt ? `Posted ${new Date(apiJob.createdAt).toLocaleDateString()}` : "Posted recently",
    applyByDate: apiJob.lastApplicationDate ? `Apply by ${new Date(apiJob.lastApplicationDate).toLocaleDateString()}` : "Apply by 30 April",
    salaryRange: apiJob.salaryRange ? (apiJob.salaryRange.includes("$") || apiJob.salaryRange.includes("₹") ? apiJob.salaryRange : `₹${apiJob.salaryRange}k/yr`) : "Negotiable",
    overview: overviewText,
    responsibilities: responsibilitiesList,
    qualifications: qualificationsList,
    keySkills: skillsList.length > 0 ? skillsList : ["React", "TypeScript", "Node.js"],
    aboutCompany: apiJob.aboutCompany || "Software Development • 51-200 employees\n\nWe are a product-driven company focused on building impactful digital experiences. Our team values innovation, collaboration, and user-centric design to create solutions that make a real difference."
  };
}

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const resolvedParams = use(params);
  const rawId = resolvedParams?.id || "";
  const id = decodeURIComponent(rawId).trim();

  const [job, setJob] = useState<any>(null);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    jobsService.getSavedJobs().then((savedList) => {
      setIsSaved(savedList.some((s: any) => String(s.jobId || s.id) === id));
    });
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const loadJob = async () => {
      try {
        setLoading(true);

        const [jobRes, listRes] = await Promise.allSettled([
          jobsService.getJobById(id),
          jobsService.getJobs(),
        ]);

        let foundJob: any = null;

        if (jobRes.status === "fulfilled" && jobRes.value) {
          const apiPayload = jobRes.value?.payload || jobRes.value;
          foundJob = mapApiJobToJobListing(apiPayload);
        }

        let allMapped: any[] = [];
        if (listRes.status === "fulfilled" && listRes.value) {
          const data = listRes.value;
          const apiJobs = data?.payload?.jobs || (Array.isArray(data) ? data : []);
          if (Array.isArray(apiJobs)) {
            allMapped = apiJobs.map(mapApiJobToJobListing).filter(Boolean);
          }
        }

        if (!foundJob && allMapped.length > 0) {
          foundJob = allMapped.find((j) => String(j.id) === id) || null;
        }

        if (isMounted) {
          setJob(foundJob);
          const others = allMapped.filter((j) => String(j.id) !== id);
          setSimilarJobs(others.slice(0, 3));
        }
      } catch (err) {
        console.error("Could not fetch job by ID from API:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadJob();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleToggleSave = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("candidate_token") : null;
    if (!token && !user) {
      router.push(`/register?redirect=/dashboard/jobs/${id}`);
      return;
    }

    if (isSaved) {
      setIsSaved(false);
      await jobsService.unsaveJob(id);
      toast.info("Job Removed", `"${job.title}" removed from your saved list.`);
    } else {
      setIsSaved(true);
      await jobsService.saveJob(id, job);
      toast.success("Job Saved", `"${job.title}" has been saved to your jobs.`);
    }
  };

  if (loading) {
    return (
      <div className="px-10 py-10 min-h-screen">
        <JobDetailSkeleton />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="px-10 py-24 text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job Not Found</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          The job you are looking for does not exist or may have been closed.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800 transition"
          >
            Explore Jobs
          </Link>
        </div>
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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 p-2 dark:bg-slate-800">
            <div className="h-full w-full rounded-full bg-gradient-to-br from-[#2f54eb] to-cyan-400" />
          </div>
          <span className="text-[15px] font-medium text-slate-600 dark:text-slate-400">{job.company}</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white md:text-4xl">{job.title}</h1>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex h-8 items-center rounded-full bg-[#f3f6ff] px-5 text-[13px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Details Grid */}
        <div className="flex flex-wrap items-center gap-6 text-[14px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#2f54eb]" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Location :</span> {job.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#2f54eb]" />
            {job.postedDate}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#2f54eb]" />
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
          <button
            type="button"
            onClick={handleToggleSave}
            className={`flex h-11 items-center gap-2 rounded-lg border px-6 text-sm font-semibold transition ${
              isSaved
                ? "border-[#2f54eb] bg-[#2f54eb] text-white hover:bg-[#2447d8]"
                : "border-[#2f54eb] bg-white dark:bg-[#1a1a1a] text-[#2f54eb] hover:bg-[#f4f7ff] dark:hover:bg-slate-800"
            }`}
          >
            {isSaved ? "Saved" : "Save for Later"}
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-white text-white" : ""}`} />
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <hr className="my-10 border-slate-200 dark:border-slate-700" />

      {/* Content Section */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">About the Job</h2>

        <SectionHeading title="Overview" />
        <JobOverviewRenderer content={job.overview} />

        {responsibilities.length > 0 && (
          <>
            <SectionHeading title="Responsibilities" />
            <ul className="ml-4 list-disc space-y-3 text-[15px] text-slate-500 dark:text-slate-400 marker:text-slate-400">
              {responsibilities.map((item: string, idx: number) => (
                <li key={idx} className="pl-2">
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}

        {qualifications.length > 0 && (
          <>
            <SectionHeading title="Qualifications" />
            <ul className="ml-4 list-disc space-y-3 text-[15px] text-slate-500 dark:text-slate-400 marker:text-slate-400">
              {qualifications.map((item: string, idx: number) => (
                <li key={idx} className="pl-2">
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}

        {keySkills.length > 0 && (
          <>
            <SectionHeading title="Key Skills" />
            <div className="flex flex-wrap items-center gap-2">
              {keySkills.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-[#1a1a1a] dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

        {aboutText && (
          <>
            <SectionHeading title="About Company" />
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
              {aboutText}
            </p>
          </>
        )}
      </div>

      <hr className="my-14 border-slate-200 dark:border-slate-700" />

      {/* Similar Jobs */}
      {similarJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Similar Jobs</h2>
            <Link href="/dashboard/jobs" className="text-sm font-semibold text-[#2f54eb] underline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {similarJobs.map((simJob) => (
              <JobCard key={simJob.id} job={simJob} isDashboard />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
