"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock,
  Crown,
  Download,
  Filter,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Settings,
  Star,
  TrendingUp,
  User,
  UsersRound,
  X,
} from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaApple, FaFacebookF, FaGooglePlay, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

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

const navItems = [
  { label: "Home", icon: Home, active: true },
  { label: "Jobs", icon: BriefcaseBusiness },
  { label: "Companies", icon: Building2 },
  { label: "My Jobs", icon: Bookmark },
  { label: "Notifications", icon: Bell },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
  { label: "Download the app", icon: Download },
];

export default function DashboardPage() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <main className="min-h-screen bg-white text-sm text-[#101828]">
      <DashboardSidebar />
      <section className="min-h-screen pl-[286px]">
        <DashboardHeader onProfileClick={() => setShowProfile(true)} />
        <div className="px-10 py-7">
          <SearchBar />
          <RecommendedJobs />
          <TopCompanies />
          <TrustedCompanies />
          <ResumeBanner />
          <ActiveUsers />
          <AppDownload />
        </div>
        <DashboardFooter />
      </section>
      {showProfile ? <ProfileModal onClose={() => setShowProfile(false)} /> : null}
    </main>
  );
}

function DashboardSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[286px] flex-col rounded-tr-[52px] bg-[#172a78] px-6 py-8 text-white">
      <Link href="/" className="mb-11 inline-flex">
        <Image src="/common/logo.png" alt="Voctrum" width={124} height={42} className="h-10 w-auto brightness-0 invert" priority />
      </Link>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a 
              key={item.label} 
              href="#" 
              style={item.active ? { color: '#2f54eb' } : undefined}
              className={`flex h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-base font-semibold transition-all duration-200 ${
                item.active 
                  ? "bg-white shadow-md" 
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.5} style={item.active ? { color: '#2f54eb' } : undefined} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg bg-white p-4 text-[#101828]">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold">Voctrum Pro</h3>
          <Crown className="h-5 w-5 fill-amber-300 text-amber-400" />
        </div>
        <p className="mt-3 text-xs leading-5 text-[#98a2b3]">Unlock priority applications and recruiter Insights</p>
        <button className="mt-4 h-10 rounded-lg bg-[#2f54eb] px-5 text-xs font-bold text-white transition hover:bg-[#2447d8]">Upgrade Now</button>
      </div>
    </aside>
  );
}

function DashboardHeader({ onProfileClick }: { onProfileClick: () => void }) {
  return (
    <header className="flex h-[104px] items-center justify-between border-b border-[#dfe3ea] px-10">
      <div>
        <h1 className="text-xl font-extrabold text-[#101828]">Hello, Hidayat ali</h1>
        <p className="mt-2 flex items-center gap-2 text-xs text-[#667085]">
          <MapPin className="h-4 w-4 text-[#2f54eb]" />
          Srinagar, Jammu & Kashmir
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="grid h-11 w-11 place-items-center rounded-full bg-[#e9edff] text-[#2f54eb]">
          <MessageCircle className="h-5 w-5" />
        </button>
        <button onClick={onProfileClick} className="transition hover:opacity-80">
          <Image src="/userdash/841fef2f2fee74c06511142a265d3665766990d3.png" alt="User profile" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
        </button>
      </div>
    </header>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <section 
        className="absolute right-10 top-[80px] w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[140px] bg-gradient-to-br from-gray-100 via-gray-50 to-white [background:repeating-linear-gradient(135deg,transparent,transparent_35px,rgba(200,200,200,0.08)_35px,rgba(200,200,200,0.08)_70px)]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg bg-[#2f54eb] text-white transition hover:bg-[#2447d8]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="-mt-16 px-6 pb-8 text-center">
          <div className="mx-auto h-[110px] w-[110px] rounded-full border-[5px] border-white bg-white shadow-xl">
            <Image src="/userdash/841fef2f2fee74c06511142a265d3665766990d3.png" alt="Hidayat Ali" width={100} height={100} className="h-full w-full rounded-full object-cover" />
          </div>
          <h2 className="mt-3 text-xl font-bold text-[#101828]">Hidayat Ali</h2>
          <p className="mt-1 text-xs text-[#98a2b3]">hidayatali143@gmail.com</p>
          <p className="mt-3 text-sm font-semibold text-[#c9a348]">UI/UX Designer, 2+ years of experience</p>
          <p className="mt-2 flex items-center justify-center gap-2 text-xs text-[#667085]">
            <MapPin className="h-3.5 w-3.5 text-[#2f54eb]" />
            San Francisco, USA
            <span className="mx-1 text-[#d0d5dd]">|</span>
            Joined April 2026
          </p>
          <button className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border-2 border-[#2f54eb] bg-white px-6 text-sm font-semibold text-[#2f54eb] transition hover:bg-[#f0f4ff]">
            <Crown className="h-4 w-4 fill-[#2f54eb] text-[#2f54eb]" />
            Upgrade Profile
          </button>
        </div>
      </section>
    </div>
  );
}
function SearchBar() {
  return (
    <div className="mx-auto flex h-14 max-w-[980px] items-center gap-4 rounded-full bg-[#e9edff] px-6">
      <Search className="h-5 w-5 shrink-0 text-[#2f54eb]" />
      <input placeholder="Enter  skills / designations / companies" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#667085]" />
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
            <article className="flex h-full min-h-[320px] flex-col rounded-2xl border border-[#e4e7ec] bg-white p-6 transition-all duration-300 hover:border-[#2f54eb] hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="line-clamp-1 text-lg font-bold text-[#101828]">{job.title}</h3>
                  <p className="mt-1.5 line-clamp-1 text-sm text-[#667085]">{job.company}</p>
                </div>
                <button className="shrink-0 transition hover:scale-110">
                  <Bookmark className="h-5 w-5 text-[#98a2b3] transition hover:fill-[#2f54eb] hover:text-[#2f54eb]" />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.tags.map((tag) => <span key={tag} className="rounded-full bg-[#f0f4ff] px-4 py-1.5 text-xs font-medium text-[#344054]">{tag}</span>)}
              </div>
              <div className="mt-5 flex flex-col gap-2.5 text-xs text-[#667085]">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#2f54eb]" />
                  {job.posted}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#2f54eb]" />
                  {job.apply}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-[#e4e7ec] pt-4">
                <p className="text-sm font-bold text-[#344054]">{job.salary}</p>
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
        <h2 className="text-2xl font-extrabold text-[#101828]">{title}</h2>
        <p className="mt-2 text-sm text-[#98a2b3]">{copy}</p>
      </div>
      <a href="#" className="text-sm font-semibold text-[#344054] underline">View all</a>
    </div>
  );
}

function CompanyCard({ company }: { company: (typeof companies)[number] }) {
  return (
    <article className="flex h-full min-h-[240px] flex-col rounded-2xl border border-[#e4e7ec] bg-white p-6 transition-all duration-300 hover:border-[#2f54eb] hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandMark name={company.logo} />
          <div>
            <h3 className="text-base font-bold text-[#101828]">{company.name}</h3>
            <p className="mt-0.5 text-xs text-[#98a2b3]">{company.subtitle}</p>
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
      <div className="mt-auto flex justify-end border-t border-[#e4e7ec] pt-4">
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
        <span className="h-px flex-1 bg-[#dfe3ea]" />
        <h2 className="text-center text-xl font-extrabold text-[#344054]">Trusted by leading companies</h2>
        <span className="h-px flex-1 bg-[#dfe3ea]" />
      </div>
      <Swiper modules={[Autoplay]} slidesPerView={3} spaceBetween={36} loop autoplay={{ delay: 1800, disableOnInteraction: false }} breakpoints={{ 820: { slidesPerView: 5 }, 1180: { slidesPerView: 8 } }} className="mt-10">
        {trustedCompanies.map((name) => (
          <SwiperSlide key={name}>
            <div className="flex h-10 items-center justify-center text-base font-black text-[#101828]">{name}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function ResumeBanner() {
  return (
    <section className="relative min-h-[420px] overflow-hidden rounded-xl bg-slate-50">
      <Image src="/homepage/section.png" alt="Professional building a resume on a laptop" fill sizes="1100px" className="object-cover" />
      <div className="relative z-10 max-w-2xl px-9 py-14 md:px-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-sm font-semibold italic text-slate-600">
          <span className="h-3 w-3 rounded-full bg-blue-800 ring-2 ring-blue-100" />
          AI-Powered
        </span>
        <h2 className="mt-8 text-2xl font-black text-slate-950">No resume? <span className="text-blue-700">No problem</span></h2>
        <ul className="mt-8 space-y-7 text-sm text-slate-600">
          {["Create or improve your resume with AI-powered assistance", "Enhance your resume with smart, personalized suggestions", "Optimize your resume to match job requirements instantly"].map((item) => (
            <li key={item} className="flex items-center gap-3"><span className="h-3 w-3 rounded-full border-2 border-blue-700" />{item}</li>
          ))}
        </ul>
        <button className="mt-9 h-12 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800">Start Building Your Resume</button>
      </div>
    </section>
  );
}

function ActiveUsers() {
  return (
    <section className="py-14">
      <h2 className="text-lg font-extrabold text-[#101828]">Active users</h2>
      <div className="mt-6 flex items-center gap-16">
        <div>
          <p className="text-8xl font-black leading-none text-[#172a78]">20k+</p>
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
            <p className="text-sm text-[#98a2b3]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#172a78]">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AppDownload() {
  return (
    <section className="mb-16 grid items-center gap-10 rounded-xl bg-slate-50 px-7 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-16">
      <div>
        <h2 className="max-w-xl text-2xl font-black leading-tight text-slate-950 md:text-3xl">Join thousands of users already using our <span className="text-blue-700">Voctrum app</span></h2>
        <p className="mt-7 text-sm text-slate-400">Access real-time job updates and apply seamlessly from your mobile device</p>
        <div className="mt-8 flex max-w-[520px] items-center rounded-full bg-[#eaf0ff] p-2 shadow-inner">
          <Phone className="ml-4 h-5 w-5 shrink-0 text-blue-700" />
          <input aria-label="Mobile number" placeholder="Enter your mobile number" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-500" />
          <button className="h-9 shrink-0 rounded-full bg-blue-700 px-5 text-xs font-bold text-white">Get App Link</button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="inline-flex h-12 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white"><FaGooglePlay className="h-5 w-5" />Google Play</span>
          <span className="inline-flex h-12 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white"><FaApple className="h-6 w-6" />App Store</span>
          <span className="grid h-24 w-24 place-items-center rounded border border-slate-300 bg-white text-center text-xs font-medium text-slate-500">QR<br />Scan to download</span>
        </div>
      </div>
      <div className="flex justify-center gap-5">
        <Image src="/homepage/m2.png" alt="Voctrum recommended jobs app screen" width={210} height={430} className="h-auto w-36 md:w-44" />
        <Image src="/homepage/m1.png" alt="Voctrum saved jobs app screen" width={210} height={430} className="h-auto w-36 md:w-44" />
      </div>
    </section>
  );
}

function DashboardFooter() {
  const columns = [
    ["Company", "About Us", "Careers", "Partners"],
    ["Job Seekers", "Browse Jobs", "Job Categories", "Featured Jobs", "Saved Jobs"],
    ["Resources", "Privacy & Security", "Help Center", "FAQs", "Blog"],
  ];
  return (
    <footer className="bg-[#172a78] px-10 py-10 text-white">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_1.5fr]">
        <div>
          <Image src="/common/logo.png" alt="Voctrum" width={130} height={46} className="h-10 w-auto brightness-0 invert" />
          <p className="mt-2 text-sm text-white">Connecting talent with the right opportunities</p>
          <div className="mt-7 flex max-w-lg gap-4">
            <input placeholder="Enter your email for job alerts" className="h-12 min-w-0 flex-1 rounded-lg bg-white px-4 text-sm text-slate-900 outline-none" />
            <button className="h-12 rounded-lg bg-white px-7 text-sm font-bold text-blue-800">Subscribe</button>
          </div>
        </div>
        <div className="grid gap-9 sm:grid-cols-3">
          {columns.map(([title, ...links]) => (
            <div key={title}>
              <h3 className="text-lg font-black">{title}</h3>
              <ul className="mt-7 space-y-5 text-sm text-white/75">
                {links.map((link) => <li key={link}><a href="#" className="hover:text-white">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-full bg-white px-6 py-4 text-sm text-slate-500 md:flex-row">
        <p><a href="#">Terms of Service</a><span className="mx-3 text-slate-300">|</span><a href="#">Privacy Policy</a></p>
        <p>© 2026 Voctrum. All rights reserved</p>
        <div className="flex items-center gap-4">
          <FaXTwitter className="h-4 w-4 text-black" />
          <FaFacebookF className="h-4 w-4 text-blue-600" />
          <FaInstagram className="h-4 w-4 text-pink-500" />
          <FaLinkedinIn className="h-4 w-4 text-sky-700" />
        </div>
      </div>
    </footer>
  );
}
