import { Cpu, Landmark, HeartPulse, GraduationCap, Megaphone } from "lucide-react";

export default function IndustryFilters() {
  const industries = [
    { label: "Technology", icon: Cpu },
    { label: "Finance", icon: Landmark },
    { label: "Healthcare", icon: HeartPulse },
    { label: "Education", icon: GraduationCap },
    { label: "Marketing", icon: Megaphone },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-[22px] font-bold text-slate-900 dark:text-white mb-5">
        Browse by Industry
      </h2>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Active 'All' Pill */}
        <button className="h-[38px] rounded-full bg-[#2f54eb] px-8 text-[13px] font-semibold !text-white transition hover:bg-[#2447d8]">
          All
        </button>
        
        {/* Industry Pills */}
        {industries.map((industry) => {
          const Icon = industry.icon;
          return (
            <button
              key={industry.label}
              className="flex h-[38px] items-center gap-2 rounded-full border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] px-5 text-[13px] font-semibold text-[#2f54eb] transition hover:bg-[#f4f7ff] dark:hover:bg-blue-900/20"
            >
              <Icon className="h-4 w-4" />
              {industry.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
