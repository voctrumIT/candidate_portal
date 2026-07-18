import CompanyJobFilters from "./CompanyJobFilters";
import JobCard from "../../../jobs/components/JobCard";
import { dummyJobs } from "../../../jobs/data";

export default function JobsTab() {
  const jobsToShow = dummyJobs.slice(0, 9);

  return (
    <div className="py-2">
      <CompanyJobFilters />

      {/* Jobs Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobsToShow.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
