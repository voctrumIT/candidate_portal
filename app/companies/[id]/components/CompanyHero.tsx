import { MapPin, Users, Briefcase, Star, TrendingUp, Plus } from "lucide-react";
import Image from "next/image";
import { CompanyListing } from "../../data";

export default function CompanyHero({ company }: { company: CompanyListing }) {
  return (
    <div className="relative">
      {/* Background Image Banner */}
      <div className="h-[240px] w-full relative">
        <Image 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="Company Building"
          fill
          className="object-cover object-center brightness-[0.7]"
          priority
        />
      </div>

      {/* Overlapping Content Container */}
      <div className="mx-auto max-w-[1360px] px-5 md:px-10 lg:px-16 -mt-16 relative z-10 flex flex-col md:flex-row items-end justify-between gap-6">
        
        {/* Main White Card */}
        <div className="w-full md:max-w-[70%] bg-white dark:bg-[#1a1a1a] rounded-[16px] p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex gap-5">
          
          {/* Logo */}
          <div className="w-[80px] h-[80px] shrink-0 rounded-full border border-slate-100 flex items-center justify-center bg-white overflow-hidden p-2">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg"
              alt={company.name}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[22px] font-bold text-slate-900 dark:text-white leading-tight">
                  {company.name}
                </h1>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
                  IT Services & Consulting • Software Development
                </p>
              </div>

              {company.activelyHiring && (
                <div className="flex items-center gap-1 rounded-full bg-[#f0fdf4] dark:bg-green-900/20 px-3 py-1.5 text-[11px] font-bold text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  Actively Hiring
                </div>
              )}
            </div>

            {/* Metadata Row */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#2f54eb]" />
                {company.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#2f54eb]" />
                {company.employees}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#2f54eb]" />
                {company.openRoles} open roles
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>{company.rating.toFixed(1)} Rating (2.1k Reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 max-w-[95%]">
              Building innovative solutions and empowering businesses worldwide to achieve sustainable growth, digital transformation, and long-term success.
            </p>
          </div>
        </div>

        {/* Follower Section */}
        <div className="flex flex-col items-end pb-4 shrink-0">
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-600 dark:text-slate-400 mb-3">
            <Users className="h-4 w-4 text-[#2f54eb]" />
            2.5k followers
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#2f54eb] px-6 py-2 text-[13px] font-bold !text-white transition hover:bg-[#2447d8]">
            <Plus className="h-4 w-4" />
            Follow
          </button>
        </div>

      </div>
    </div>
  );
}
