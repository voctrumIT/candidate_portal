import { Search, ChevronDown, ChevronLeft, ChevronRight, PenTool, Code, TrendingUp, Database, BrainCircuit, MoreHorizontal } from "lucide-react";
import { dummyJobs } from "../../jobs/data";
import JobCard from "../../jobs/components/JobCard";

export default function DashboardJobsPage() {
  const filters = [
    "Role",
    "Employment Type",
    "Location",
    "Date Posted",
    "Experience Level",
  ];

  const categories = [
    { label: "UI/UX Designer", icon: PenTool },
    { label: "Full Stack", icon: Code },
    { label: "Digital Marketing", icon: TrendingUp },
    { label: "Data Science", icon: Database },
    { label: "AI/ML", icon: BrainCircuit },
  ];

  return (
    <div className="px-10 py-10">
      {/* Header */}
      <div>
        <h2 className="text-[28px] font-black text-slate-900 dark:text-white">Explore Jobs</h2>
        <p className="mt-1 text-[15px] font-medium text-slate-400">
          Great opportunities are out there—adjust your filters to discover more
        </p>
      </div>

      {/* Search Bar */}
      <div className="mt-8 relative max-w-2xl">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#2f54eb]" />
        </div>
        <input
          type="text"
          placeholder="Search jobs"
          className="w-full h-14 pl-14 pr-5 rounded-full bg-[#f4f7ff] border-none text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#2f54eb] outline-none transition"
        />
      </div>

      {/* Filters Row */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="h-10 rounded-full bg-[#2f54eb] px-6 text-[13px] font-semibold text-white transition hover:bg-[#2447d8]">
          Clear all
        </button>
        {filters.map((filter) => (
          <button
            key={filter}
            className="flex h-10 items-center gap-2 rounded-full bg-[#f1f5f9] px-5 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            {filter}
            <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={3} />
          </button>
        ))}
      </div>

      {/* Categories Section */}
      <div className="mt-10">
        <h3 className="text-[22px] font-bold text-slate-900 dark:text-white">Browse by Categories</h3>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button className="h-10 rounded-full bg-[#2f54eb] px-8 text-[13px] font-bold text-white transition hover:bg-[#2447d8]">
            All
          </button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.label}
                className="flex h-10 items-center gap-2 rounded-full border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] px-5 text-[13px] font-bold text-[#2f54eb] transition hover:bg-[#f4f7ff]"
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        {dummyJobs.slice(0, 6).map((job) => (
          <JobCard key={job.id} job={job} isDashboard />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-center gap-2">
        <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-slate-300">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 bg-white dark:bg-[#1a1a1a] text-[13px] font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:bg-slate-900">
          1
        </button>
        <button className="grid h-8 w-8 place-items-center text-[13px] font-bold text-slate-500 dark:text-slate-400 transition hover:text-slate-800">
          2
        </button>
        <button className="grid h-8 w-8 place-items-center text-[13px] font-bold text-slate-500 dark:text-slate-400 transition hover:text-slate-800">
          3
        </button>
        <button className="grid h-8 w-8 place-items-center text-[13px] font-bold text-slate-500 dark:text-slate-400 transition hover:text-slate-800">
          4
        </button>
        <button className="grid h-8 w-8 place-items-center text-[13px] font-bold text-slate-500 dark:text-slate-400 transition hover:text-slate-800">
          5
        </button>
        <button className="grid h-8 w-8 place-items-center text-slate-500 dark:text-slate-400 transition hover:text-slate-800">
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <button className="grid h-8 w-8 place-items-center text-[13px] font-bold text-slate-500 dark:text-slate-400 transition hover:text-slate-800">
          50
        </button>
        <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-slate-300">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
