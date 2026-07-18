import { MapPin, Clock, Calendar, Wallet, ExternalLink, Bookmark, Share2, Network } from "lucide-react";
import Link from "next/link";
import { dummyJobs } from "../../../jobs/data";
import JobCard from "../../../jobs/components/JobCard";
import ApplyButton from "./components/ApplyButton";
import { notFound } from "next/navigation";

export default async function JobDetailsPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Await params if it's a promise (Next.js 15+ behavior)
  const resolvedParams = await params;
  const job = dummyJobs.find((j) => j.id === resolvedParams.id);

  if (!job) {
    notFound();
  }

  // Section Heading component for reuse
  const SectionHeading = ({ title }: { title: string }) => (
    <h3 className="mb-4 mt-8 flex items-center border-l-4 border-[#2f54eb] pl-3 text-lg font-bold text-slate-900">
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
            <p className="text-sm font-medium text-slate-500">{job.company}</p>
            <h1 className="text-3xl font-black text-slate-900">{job.title}</h1>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-8 items-center rounded-full bg-[#f4f7ff] px-5 text-[13px] font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Info Row */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[14px] text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#2f54eb]" />
            <span className="font-semibold text-slate-700">Location :</span> {job.location}, USA
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
        <div className="flex items-center gap-2 text-[14px] text-slate-500">
          <Wallet className="h-5 w-5 text-[#2f54eb]" />
          <span className="font-semibold text-slate-700">Salary :</span> {job.salaryRange}
        </div>

        {/* Action Buttons */}
        <div className="mt-2 flex items-center gap-4">
          <ApplyButton jobCompany={job.company} jobTitle={job.title} />
          <button className="flex h-11 items-center gap-2 rounded-lg border border-[#2f54eb] bg-white px-6 text-sm font-semibold text-[#2f54eb] transition hover:bg-[#f4f7ff]">
            Save for Later
            <Bookmark className="h-4 w-4" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <hr className="my-10 border-slate-200" />

      {/* Content Section */}
      <div>
        <h2 className="text-2xl font-black text-slate-900">About the Job</h2>

        <SectionHeading title="Overview" />
        <p className="text-[15px] leading-relaxed text-slate-500">{job.overview}</p>

        <SectionHeading title="Responsibilities" />
        <ul className="ml-4 list-disc space-y-3 text-[15px] text-slate-500 marker:text-slate-400">
          {job.responsibilities.map((item, idx) => (
            <li key={idx} className="pl-2">
              {item}
            </li>
          ))}
        </ul>

        <SectionHeading title="Qualifications" />
        <ul className="ml-4 list-disc space-y-3 text-[15px] text-slate-500 marker:text-slate-400">
          {job.qualifications.map((item, idx) => (
            <li key={idx} className="pl-2">
              {item}
            </li>
          ))}
        </ul>

        <SectionHeading title="Key Skills" />
        <div className="flex flex-wrap gap-3">
          {job.keySkills.map((skill) => (
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
        <div className="space-y-4 text-[15px] leading-relaxed text-slate-500">
          {job.aboutCompany.split("\n\n").map((para, idx) => {
            // First paragraph in the dummy data is the company size/type string, which should be bolded according to the design.
            if (idx === 0) {
              return (
                <p key={idx} className="font-bold text-slate-700">
                  {para}
                </p>
              );
            }
            return <p key={idx}>{para}</p>;
          })}
        </div>
      </div>

      <hr className="my-12 border-slate-200" />

      {/* Similar Jobs Section */}
      <div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Similar Jobs</h2>
            <p className="mt-1 text-sm text-slate-500">Explore more opportunities that match your profile and interests.</p>
          </div>
          <Link href="/dashboard/jobs" className="text-sm font-bold text-slate-900 underline underline-offset-4 hover:text-[#2f54eb]">
            View all
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {/* Slicing exactly 3 jobs to match screenshot layout */}
          {dummyJobs.slice(0, 3).map((similarJob) => (
            <JobCard key={similarJob.id} job={similarJob} />
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
