"use client";

import Image from "next/image";
import {
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  Filter,
  MapPin,
  Phone,
  Search,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import VoctrumAIChat from "./components/VoctrumAIChat";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/pagination";

const jobs = [
  {
    title: "Senior Product Designer",
    company: "Niscala.io - San Francisco",
    tags: ["Remote", "Full-time", "Senior"],
    posted: "Posted 2 days ago",
    apply: "Apply by 30 April",
    salary: "₹520k - 660k/yr",
  },
  {
    title: "Full Stack Engineer",
    company: "SAMTIV - New York",
    tags: ["Onsite", "Part-time"],
    posted: "Posted 2 days ago",
    apply: "Apply by 30 April",
    salary: "₹920k - 960k/yr",
  },
  {
    title: "Data Scientist",
    company: "UNICA - Berlin",
    tags: ["Onsite", "Senior"],
    posted: "Posted 1 day ago",
    apply: "Apply by 18 May",
    salary: "₹720k - 960k/yr",
  },
  {
    title: "Product Manager",
    company: "Quantify - Mumbai",
    tags: ["Hybrid", "Full-time"],
    posted: "Posted 3 days ago",
    apply: "Apply by 12 May",
    salary: "₹780k - 940k/yr",
  },
];

const companies = [
  { name: "Wipro", subtitle: "IT Company", logo: "wipro", location: "Pune, india", roles: "18 open roles", rating: "4.0" },
  { name: "Google", subtitle: "Banglore, india", logo: "google", location: "Pune, india", roles: "28 open roles", rating: "4.5" },
  { name: "Microsoft", subtitle: "Software Company", logo: "microsoft", location: "Pune, india", roles: "23 open roles", rating: "4.0" },
  { name: "Amazon", subtitle: "Marketplace", logo: "amazon", location: "Bangalore, india", roles: "31 open roles", rating: "4.3" },
];

const trustedCompanies = ["beats audio", "Lafayette", "SPARTAN", "Adobe", "amazon", "Baskin Robbins", "LeetCode", "VAIO", "CISCO"];

export default function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="px-10 py-7">
      <SearchBar />
      <RecommendedJobs />
      <TopCompanies />
      <TrustedCompanies />
      <ResumeBanner onOpenChat={() => setIsChatOpen(true)} />
      <ActiveUsers />
      <AppDownload />
      <VoctrumAIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

function SearchBar() {
  return (
    <div className="mx-auto flex h-14 max-w-[980px] items-center gap-4 rounded-full bg-[#e9edff] px-6 dark:bg-slate-800">
      <Search className="h-5 w-5 shrink-0 text-[#2f54eb]" />
      <input placeholder="Enter  skills / designations / companies" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#667085] dark:text-white" />
      <button className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2f54eb] px-6 text-sm font-bold text-white transition hover:bg-[#2447d8]">
        <Filter className="h-4 w-4" />
        Filter
      </button>
      <button className="h-11 rounded-full bg-[#2f54eb] px-7 text-sm font-bold text-white transition hover:bg-[#2447d8]">Search Jobs</button>
    </div>
  );
}

function RecommendedJobs() {
  return (
    <section className="mt-14 overflow-hidden">
      <SectionHeader title="Recommended jobs for you" copy="Curated roles based on your profile and activity to match your career goals" />
      <Swiper modules={[Pagination, Autoplay]} slidesPerView={1} spaceBetween={20} pagination={{ clickable: true }} autoplay={{ delay: 3000, disableOnInteraction: false }} breakpoints={{ 900: { slidesPerView: 2 }, 1180: { slidesPerView: 3 } }} className="mt-8 !pb-16">
        {jobs.map((job) => (
          <SwiperSlide key={job.title} className="h-auto">
            <article className="flex h-full min-h-[320px] flex-col rounded-2xl border border-[#e4e7ec] bg-white p-6 transition-all duration-300 hover:border-[#2f54eb] hover:shadow-lg dark:border-slate-800 dark:bg-[#1a1a1a]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="line-clamp-1 text-lg font-bold text-[#101828] dark:text-white">{job.title}</h3>
                  <p className="mt-1.5 line-clamp-1 text-sm text-[#667085] dark:text-slate-400">{job.company}</p>
                </div>
                <button className="shrink-0 transition hover:scale-110">
                  <Bookmark className="h-5 w-5 text-[#98a2b3] transition hover:fill-[#2f54eb] hover:text-[#2f54eb]" />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.tags.map((tag) => <span key={tag} className="rounded-full bg-[#f0f4ff] px-4 py-1.5 text-xs font-medium text-[#344054] dark:bg-slate-800 dark:text-slate-200">{tag}</span>)}
              </div>
              <div className="mt-5 flex flex-col gap-2.5 text-xs text-[#667085] dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#2f54eb]" />
                  {job.posted}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#2f54eb]" />
                  {job.apply}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-[#e4e7ec] pt-4 dark:border-slate-800">
                <p className="text-sm font-bold text-[#344054] dark:text-slate-200">{job.salary}</p>
                <button className="rounded-lg bg-[#2f54eb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2447d8]">View Job</button>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function TopCompanies() {
  return (
    <section className="mt-12 overflow-hidden">
      <SectionHeader title="Top companies hiring" copy="Discover leading companies actively looking for talent like you" />
      <Swiper modules={[Pagination, Autoplay]} slidesPerView={1} spaceBetween={24} pagination={{ clickable: true }} autoplay={{ delay: 3300, disableOnInteraction: false }} breakpoints={{ 980: { slidesPerView: 2 }, 1300: { slidesPerView: 3 } }} className="mt-8 !pb-16">
        {companies.map((company) => (
          <SwiperSlide key={company.name} className="h-auto">
            <CompanyCard company={company} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function SectionHeader({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#101828] dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-[#98a2b3] dark:text-slate-400">{copy}</p>
      </div>
      <a href="#" className="text-sm font-semibold text-[#344054] underline dark:text-slate-300">View all</a>
    </div>
  );
}

function CompanyCard({ company }: { company: (typeof companies)[number] }) {
  return (
    <article className="flex h-full min-h-[240px] flex-col rounded-2xl border border-[#e4e7ec] bg-white p-6 transition-all duration-300 hover:border-[#2f54eb] hover:shadow-lg dark:border-slate-800 dark:bg-[#1a1a1a]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandMark name={company.logo} />
          <div>
            <h3 className="text-base font-bold text-[#101828] dark:text-white">{company.name}</h3>
            <p className="mt-0.5 text-xs text-[#98a2b3] dark:text-slate-400">{company.subtitle}</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
          <TrendingUp className="h-3 w-3" />
          Actively Hiring
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-medium text-[#667085]">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#2f54eb]" />
          {company.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-[#2f54eb]" />
          10k+ Employees
        </span>
        <span className="inline-flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-[#2f54eb]" />
          {company.roles}
        </span>
        <span className="inline-flex items-center gap-2">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {company.rating}
        </span>
      </div>
      <div className="mt-auto flex justify-end border-t border-[#e4e7ec] pt-4 dark:border-slate-800">
        <button className="rounded-lg bg-[#2f54eb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2447d8]">View Open Roles</button>
      </div>
    </article>
  );
}

function BrandMark({ name }: { name: string }) {
  if (name === "google") return <span className="text-4xl font-black text-blue-600">G</span>;
  if (name === "microsoft") {
    return <span className="grid h-9 w-9 grid-cols-2 gap-0.5"><span className="bg-red-500" /><span className="bg-green-500" /><span className="bg-blue-500" /><span className="bg-yellow-400" /></span>;
  }
  if (name === "amazon") return <span className="text-3xl font-black lowercase text-slate-900">a</span>;
  return <span className="relative h-11 w-11"><Image src="/common/logo.png" alt="" fill sizes="44px" className="object-contain" /></span>;
}

function TrustedCompanies() {
  return (
    <section className="py-14">
      <div className="flex items-center gap-9">
        <span className="h-px flex-1 bg-[#dfe3ea] dark:bg-slate-800" />
        <h2 className="text-center text-xl font-extrabold text-[#344054] dark:text-slate-200">Trusted by leading companies</h2>
        <span className="h-px flex-1 bg-[#dfe3ea] dark:bg-slate-800" />
      </div>
      <Swiper modules={[Autoplay]} slidesPerView={3} spaceBetween={36} loop autoplay={{ delay: 1800, disableOnInteraction: false }} breakpoints={{ 820: { slidesPerView: 5 }, 1180: { slidesPerView: 8 } }} className="mt-10">
        {trustedCompanies.map((name) => (
          <SwiperSlide key={name}>
            <div className="flex h-10 items-center justify-center text-base font-black text-[#101828] dark:text-slate-200">{name}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function ResumeBanner({ onOpenChat }: { onOpenChat?: () => void }) {
  return (
    <section className="relative min-h-[420px] overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/50">
      <Image src="/homepage/section.png" alt="Professional building a resume on a laptop" fill sizes="1100px" className="object-cover opacity-100 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen" />
      <div className="relative z-10 max-w-2xl px-9 py-14 md:px-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-sm font-semibold italic text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
          <span className="h-3 w-3 rounded-full bg-blue-800 ring-2 ring-blue-100" />
          AI-Powered
        </span>
        <h2 className="mt-8 text-2xl font-black text-slate-950 dark:text-white">No resume? <span className="text-blue-700 dark:text-blue-500">No problem</span></h2>
        <ul className="mt-8 space-y-7 text-sm text-slate-600 dark:text-slate-300">
          {["Create or improve your resume with AI-powered assistance", "Enhance your resume with smart, personalized suggestions", "Optimize your resume to match job requirements instantly"].map((item) => (
            <li key={item} className="flex items-center gap-3"><span className="h-3 w-3 rounded-full border-2 border-blue-700" />{item}</li>
          ))}
        </ul>
        <button onClick={onOpenChat} className="mt-9 h-12 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800">Start Building Your Resume</button>
      </div>
    </section>
  );
}

function ActiveUsers() {
  return (
    <section className="py-14">
      <h2 className="text-lg font-extrabold text-[#101828] dark:text-white">Active users</h2>
      <div className="mt-6 flex items-center gap-16">
        <div>
          <p className="text-8xl font-black leading-none text-[#172a78] dark:text-blue-500">20k+</p>
        </div>
        <Image src="/userdash/3d204399488638237ac87e5ffd3c504d59af71a7.png" alt="Active users" width={280} height={160} className="h-auto w-72 object-contain" />
      </div>
      <div className="mt-10 grid grid-cols-4 gap-8">
        {[
          ["Opportunities", "140K+"],
          ["Organisations", "42K+"],
          ["Brands Trust Us", "800+"],
          ["Countries", "78+"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-sm text-[#98a2b3] dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#172a78] dark:text-blue-500">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AppDownload() {
  return (
    <section className="mb-16 grid items-center gap-10 rounded-xl bg-slate-50 px-7 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-16 dark:bg-slate-900/50">
      <div>
        <h2 className="max-w-xl text-2xl font-black leading-tight text-slate-950 md:text-3xl dark:text-white">Join thousands of users already using our <span className="text-blue-700 dark:text-blue-500">Voctrum app</span></h2>
        <p className="mt-7 text-sm text-slate-400">Access real-time job updates and apply seamlessly from your mobile device</p>
        <div className="mt-8 flex max-w-[520px] items-center rounded-full bg-[#eaf0ff] p-2 shadow-inner dark:bg-slate-800">
          <Phone className="ml-4 h-5 w-5 shrink-0 text-blue-700 dark:text-blue-500" />
          <input aria-label="Mobile number" placeholder="Enter your mobile number" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-500 dark:text-white" />
          <button className="h-9 shrink-0 rounded-full bg-blue-700 px-5 text-xs font-bold text-white transition hover:bg-blue-800">Get App Link</button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="inline-flex h-12 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"><FaGooglePlay className="h-5 w-5" />Google Play</span>
          <span className="inline-flex h-12 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"><FaApple className="h-6 w-6" />App Store</span>
          <span className="grid h-24 w-24 place-items-center rounded border border-slate-300 bg-white text-center text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800">QR<br />Scan to download</span>
        </div>
      </div>
      <div className="flex justify-center gap-5">
        <Image src="/homepage/m2.png" alt="Voctrum recommended jobs app screen" width={210} height={430} className="h-auto w-36 md:w-44" />
        <Image src="/homepage/m1.png" alt="Voctrum saved jobs app screen" width={210} height={430} className="h-auto w-36 md:w-44" />
      </div>
    </section>
  );
}
