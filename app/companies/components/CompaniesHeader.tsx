import { Search, ChevronDown } from "lucide-react";

export default function CompaniesHeader() {
  const dropdowns = ["Company Type", "Company Size", "Location"];

  return (
    <div className="mb-10">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-[32px]">
        Explore Companies
      </h1>
      <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
        Discover top companies hiring across industries and find the right fit for your career.
      </p>

      {/* Search Bar */}
      <div className="mt-8 relative max-w-2xl">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#2f54eb]" />
        </div>
        <input
          type="text"
          placeholder="Search companies, industries, or locations..."
          className="w-full h-[52px] pl-14 pr-5 rounded-full bg-[#f4f7ff] border-none text-[14px] text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#2f54eb] outline-none transition"
        />
      </div>

      {/* Filter Buttons */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="h-[38px] rounded-full bg-[#2f54eb] px-6 text-[13px] font-semibold !text-white transition hover:bg-[#2447d8]">
          Clear all
        </button>
        {dropdowns.map((filter) => (
          <button
            key={filter}
            className="flex h-[38px] items-center gap-2 rounded-full bg-[#f1f5f9] dark:bg-slate-800 px-5 text-[13px] font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {filter}
            <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={3} />
          </button>
        ))}
      </div>
    </div>
  );
}
