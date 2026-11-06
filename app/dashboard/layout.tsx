"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Crown,
  Download,
  Home,
  MapPin,
  MessageCircle,
  Settings,
  User,
  X,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Jobs", href: "/dashboard/jobs", icon: BriefcaseBusiness },
  { label: "Companies", href: "/dashboard/companies", icon: Building2 },
  { label: "My Jobs", href: "/dashboard/my-jobs", icon: Bookmark },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Download the app", href: "/dashboard/download", icon: Download },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);

  const pathname = usePathname();
  const showFooter = pathname !== "/dashboard/my-jobs" && pathname !== "/dashboard/notifications" && pathname !== "/dashboard/profile" && pathname !== "/dashboard/settings" && !pathname.startsWith("/dashboard/jobs/");

  return (
    <main className="min-h-screen bg-[#fafbfc] dark:bg-[#0a0a0a] text-sm text-[#101828] dark:text-white dark:text-slate-100 transition-colors">
      <DashboardSidebar />
      <section className="min-h-screen pl-[286px] flex flex-col">
        <DashboardHeader onProfileClick={() => setShowProfile(true)} />
        <div className="flex-1">
          {children}
        </div>
        {showFooter && <DashboardFooter />}
      </section>
      {showProfile ? <ProfileModal onClose={() => setShowProfile(false)} /> : null}
    </main>
  );
}

function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-0 w-[286px] flex-col overflow-y-auto bg-[#172a78] dark:bg-[#0f172a] text-white">
      <div className="flex h-[100px] items-center px-10">
        <Link href="/">
          <Image src="/common/logo.png" alt="Voctrum" width={120} height={42} className="h-9 w-auto brightness-0 invert" />
        </Link>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1.5 px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-5 py-3.5 text-[14px] font-medium transition-all ${
                isActive
                  ? "bg-white dark:bg-[#1a1a1a] text-[#172a78] shadow-sm dark:bg-[#1e293b] dark:text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-6 pb-10">
        <div className="rounded-xl bg-[#f4f5f7] p-5 dark:bg-[#1e293b]">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#101828] dark:text-white">Voctrum Pro</h4>
            <Crown className="h-5 w-5 text-[#d4b106]" />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[#667085] dark:text-slate-400">
            Unlock priority applications and recruiter insights
          </p>
          <button className="mt-4 rounded-lg bg-[#2f54eb] px-5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#2447d8]">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}

function DashboardHeader({ onProfileClick }: { onProfileClick: () => void }) {
  return (
    <header className="flex h-[100px] shrink-0 items-center justify-end px-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 border-b border-transparent dark:border-slate-800">
      <button 
        onClick={onProfileClick}
        className="flex items-center justify-center gap-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 p-2 pr-4 transition-colors"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f4ff] dark:bg-slate-800 text-[#2f54eb] dark:text-slate-300">
          <MessageCircle className="h-5 w-5" />
        </div>
        <Image
          src="/userdash/841fef2f2fee74c06511142a265d3665766990d3.png"
          alt="Hidayat ali"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
      </button>
    </header>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <section 
        className="absolute right-10 top-[80px] w-[520px] overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-2xl border dark:border-slate-800" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[140px] bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 [background:repeating-linear-gradient(135deg,transparent,transparent_35px,rgba(200,200,200,0.08)_35px,rgba(200,200,200,0.08)_70px)]">
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
          <div className="mx-auto h-[110px] w-[110px] rounded-full border-[5px] border-white dark:border-slate-800 bg-white dark:bg-[#1a1a1a] dark:bg-slate-800 shadow-xl">
            <Image src="/userdash/841fef2f2fee74c06511142a265d3665766990d3.png" alt="Hidayat Ali" width={100} height={100} className="h-full w-full rounded-full object-cover" />
          </div>
          <h2 className="mt-3 text-xl font-bold text-[#101828] dark:text-white">Hidayat Ali</h2>
          <p className="mt-1 text-xs text-[#98a2b3] dark:text-slate-400">hidayatali143@gmail.com</p>
          <p className="mt-3 text-sm font-semibold text-[#c9a348]">UI/UX Designer, 2+ years of experience</p>
          <p className="mt-2 flex items-center justify-center gap-2 text-xs text-[#667085] dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-[#2f54eb]" />
            San Francisco, USA
            <span className="mx-1 text-[#d0d5dd] dark:text-slate-600">|</span>
            Joined April 2026
          </p>
          <button className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border-2 border-[#2f54eb] bg-white dark:bg-[#1a1a1a] dark:bg-transparent px-6 text-sm font-semibold text-[#2f54eb] transition hover:bg-[#f0f4ff] dark:hover:bg-slate-800">
            <Crown className="h-4 w-4 fill-[#2f54eb] text-[#2f54eb]" />
            Upgrade Profile
          </button>
        </div>
      </section>
    </div>
  );
}

function DashboardFooter() {
  const columns = [
    ["Company", "About Us", "Careers", "Partners"],
    ["Job Seekers", "Browse Jobs", "Job Categories", "Featured Jobs", "Saved Jobs"],
    ["Resources", "Privacy & Security", "Help Center", "FAQs", "Blog"],
  ];
  return (
    <footer className="bg-[#172a78] dark:bg-[#0f172a] px-10 py-10 text-white mt-auto border-t dark:border-slate-800">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_1.5fr]">
        <div>
          <Image src="/common/logo.png" alt="Voctrum" width={130} height={46} className="h-10 w-auto brightness-0 invert" />
          <p className="mt-2 text-sm text-white dark:text-slate-300">Connecting talent with the right opportunities</p>
          <div className="mt-7 flex max-w-lg gap-4">
            <input placeholder="Enter your email for job alerts" className="h-12 min-w-0 flex-1 rounded-lg bg-white dark:bg-[#1a1a1a] dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none dark:border dark:border-slate-700" />
            <button className="h-12 rounded-lg bg-white dark:bg-[#1a1a1a] dark:bg-[#2f54eb] px-7 text-sm font-bold text-blue-800 dark:text-white transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-[#2447d8]">Subscribe</button>
          </div>
        </div>
        <div className="grid gap-9 sm:grid-cols-3">
          {columns.map(([title, ...links]) => (
            <div key={title}>
              <h3 className="text-lg font-black">{title}</h3>
              <ul className="mt-7 space-y-5 text-sm text-white/75 dark:text-slate-400">
                {links.map((link) => <li key={link}><a href="#" className="transition hover:text-white">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 text-xs text-white/60 dark:text-slate-500 dark:text-slate-400 sm:flex-row">
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition">Terms of Service</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
        </div>
        <p>© 2026 Voctrum. All rights reserved</p>
        <div className="flex gap-3">
          <a href="#" className="grid h-[28px] w-[28px] place-items-center rounded-full bg-black text-white hover:opacity-80 transition"><FaXTwitter className="h-3.5 w-3.5" /></a>
          <a href="#" className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition"><FaFacebookF className="h-3.5 w-3.5" /></a>
          <a href="#" className="grid h-[28px] w-[28px] place-items-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-80 transition"><FaInstagram className="h-3.5 w-3.5" /></a>
          <a href="#" className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition"><FaLinkedinIn className="h-3 w-3" /></a>
        </div>
      </div>
    </footer>
  );
}
