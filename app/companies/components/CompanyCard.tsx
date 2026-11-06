import { MapPin, Users, Briefcase, Star, TrendingUp } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { CompanyListing } from "../data";
import Link from "next/link";

// Helper to render a fake logo based on company name
const CompanyLogo = ({ name }: { name: string }) => {
  if (name === "Google") {
    return <FcGoogle className="h-8 w-8" />;
  }
  if (name === "Microsoft") {
    return (
      <div className="grid grid-cols-2 gap-0.5 h-8 w-8 p-1.5">
        <div className="bg-[#F25022]"></div>
        <div className="bg-[#7FBA00]"></div>
        <div className="bg-[#00A4EF]"></div>
        <div className="bg-[#FFB900]"></div>
      </div>
    );
  }
  // Wipro / fallback
  return (
    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 border-4 border-dotted border-blue-400 rounded-full animate-[spin_10s_linear_infinite]" />
      <div className="absolute inset-2 border-4 border-dotted border-green-400 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
      <div className="absolute inset-3 border-4 border-dotted border-red-400 rounded-full animate-[spin_6s_linear_infinite]" />
      <span className="relative z-10 text-[8px] font-bold text-slate-800">Wipro</span>
    </div>
  );
};

export default function CompanyCard({ company }: { company: CompanyListing }) {
  return (
    <div className="flex flex-col justify-between rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 transition hover:shadow-md">
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white">
              <CompanyLogo name={company.name} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-tight">
                {company.name}
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
                {company.type}
              </p>
            </div>
          </div>
          
          {company.activelyHiring && (
            <div className="flex items-center gap-1 rounded-full bg-[#f0fdf4] dark:bg-green-900/20 px-3 py-1 text-[11px] font-bold text-[#10b981]">
              <TrendingUp className="h-3 w-3" />
              Actively Hiring
            </div>
          )}
        </div>

        {/* Metadata Rows */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[13px] text-slate-600 dark:text-slate-300 font-medium mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-[18px] w-[18px] text-[#2f54eb]" />
            <span className="truncate">{company.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-[18px] w-[18px] text-[#2f54eb]" />
            <span className="truncate">{company.employees}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-[18px] w-[18px] text-[#2f54eb]" />
            <span className="truncate">{company.openRoles} open roles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-[18px] w-[18px] text-amber-400 fill-amber-400" />
            <span>{company.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="mt-2 border-t border-slate-100 dark:border-slate-800 pt-5 flex justify-end">
        <Link
          href={`/companies/${company.id}`}
          className="rounded-lg bg-[#2f54eb] px-6 py-2.5 text-[13px] font-bold !text-white transition hover:bg-[#2447d8]"
        >
          View Open Roles
        </Link>
      </div>
    </div>
  );
}
