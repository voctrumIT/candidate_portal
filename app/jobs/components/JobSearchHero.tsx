import { Search, ChevronDown } from 'lucide-react';

export default function JobSearchHero() {
  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-12 md:px-10 lg:px-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-[40px]">Explore Jobs</h1>
      <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
        Great opportunities are out there—adjust your filters to discover more
      </p>

      {/* Search Input */}
      <div className="mt-8 flex items-center gap-3 rounded-[12px] bg-[#EEF2F6] px-4 py-3">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search jobs"
          className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-slate-500 dark:text-slate-400 text-black"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-blue-700 px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-800">
          Clear all
        </button>

        {['Role', 'Employment Type', 'Location', 'Date Posted', 'Experience Level'].map((filter) => (
          <button
            key={filter}
            className="flex items-center gap-1.5 rounded-full bg-[#F3F4F6] px-5 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-200"
          >
            {filter}
            <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
