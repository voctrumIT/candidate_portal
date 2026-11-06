import { JobListing } from '../../data';

export default function JobDetailContent({ job }: { job: JobListing }) {
  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const qualifications = Array.isArray(job.qualifications) ? job.qualifications : [];
  const keySkills = Array.isArray(job.keySkills) ? job.keySkills : [];
  const aboutCompany = typeof job.aboutCompany === "string" ? job.aboutCompany : "";

  return (
    <div className="py-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">About the Job</h2>

      <div className="mt-6 space-y-8">
        {/* Overview */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200">Overview</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
            {job.overview}
          </p>
        </div>

        {/* Responsibilities */}
        {responsibilities.length > 0 && (
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200">Responsibilities</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-[14px] text-slate-500 dark:text-slate-400">
              {responsibilities.map((res, index) => (
                <li key={index}>{res}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Qualifications */}
        {qualifications.length > 0 && (
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200">Qualifications</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-[14px] text-slate-500 dark:text-slate-400">
              {qualifications.map((qual, index) => (
                <li key={index}>{qual}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Key Skills */}
      {keySkills.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Key Skills</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {keySkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 py-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* About Company */}
      {aboutCompany && (
        <div className="mt-10">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">About the Company</h2>
          <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
            {aboutCompany}
          </p>
        </div>
      )}
    </div>
  );
}
