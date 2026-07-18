import { ChevronDown } from "lucide-react";

export default function CompanyJobFilters() {
  const filters = ["Department", "Location", "Experience"];

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <button className="h-[36px] rounded-full bg-[#2f54eb] px-6 text-[13px] font-bold !text-white transition hover:bg-[#2447d8]">
        Clear all
      </button>
      
      {filters.map((filter) => (
        <button
          key={filter}
          className="flex h-[36px] items-center gap-2 rounded-full bg-[#f1f5f9] dark:bg-slate-800 px-5 text-[13px] font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {filter}
          <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={3} />
        </button>
      ))}
    </div>
  );
}
