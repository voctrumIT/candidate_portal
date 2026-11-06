import { JobListing } from '../../data';

export default function JobDetailContent({ job }: { job: JobListing }) {
  return (
    <div className="py-10">
      <h2 className="text-xl font-bold text-slate-900">About the Job</h2>

      <div className="mt-6 space-y-8">
        {/* Overview */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-800">Overview</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-slate-500">
            {job.overview}
          </p>
        </div>

        {/* Responsibilities */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-800">Responsibilities</h3>
          <ul className="mt-3 list-inside list-disc space-y-2 text-[14px] text-slate-500">
            {job.responsibilities.map((res, index) => (
              <li key={index}>{res}</li>
            ))}
          </ul>
        </div>

        {/* Qualifications */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-800">Qualifications</h3>
          <ul className="mt-3 list-inside list-disc space-y-2 text-[14px] text-slate-500">
            {job.qualifications.map((qual, index) => (
              <li key={index}>{qual}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Skills */}
      <div className="mt-10">
        <h2 className="text-[15px] font-bold text-slate-900">Key Skills</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {job.keySkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-[13px] font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* About Company */}
      <div className="mt-10">
        <h2 className="text-[15px] font-bold text-slate-900">About the Company</h2>
        <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-slate-500">
          {job.aboutCompany}
        </p>
      </div>
    </div>
  );
}
