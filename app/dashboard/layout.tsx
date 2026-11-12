"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Bookmark,
  Download,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  Settings,
  User,
  X,
  ChevronDown,
  Phone,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import TenantSocialLinks from "../components/TenantSocialLinks";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "My Jobs", href: "/dashboard/my-jobs", icon: Bookmark },
  // { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile Settings", href: "/dashboard/profile", icon: User },
  // { label: "Settings", href: "/dashboard/settings", icon: Settings },s
  // { label: "Download the app", href: "/dashboard/download", icon: Download },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showProfile, setShowProfile] = useState(false);

  const pathname = usePathname();
  const showFooter =
    pathname !== "/dashboard" &&
    pathname !== "/dashboard/my-jobs" &&
    pathname !== "/dashboard/notifications" &&
    pathname !== "/dashboard/profile" &&
    pathname !== "/dashboard/settings" &&
    pathname !== "/dashboard/download" &&
    pathname !== "/dashboard/resume-builder" &&
    !pathname.startsWith("/dashboard/jobs");

  return (
    <main className="min-h-screen bg-[#fafbfc] dark:bg-[#0a0a0a] text-sm text-[#101828] dark:text-slate-100 transition-colors">
      <DashboardSidebar />
      <section className="min-h-screen pl-[286px] flex flex-col">
        <DashboardHeader onProfileClick={() => setShowProfile(true)} />
        <div className="flex-1">{children}</div>
        {/* {showFooter && <DashboardFooter />} */}
      </section>
      {showProfile ? <ProfileModal onClose={() => setShowProfile(false)} /> : null}
    </main>
  );
}

function DashboardSidebar() {
  const pathname = usePathname();
  const { tenant, tenantLoading, logout } = useAuth();

  return (
    <aside className="fixed bottom-0 left-0 top-0 w-[286px] flex flex-col overflow-y-auto bg-[#172a78] dark:bg-[#0f172a] text-white z-20 shadow-lg">
      <div className="flex h-[100px] shrink-0 items-center px-8">
        <Link href="/" className="flex items-center" title="Go to main homepage">
          <div className="rounded-xl bg-white px-3.5 py-1.5 shadow-sm inline-flex items-center justify-center">
            {tenantLoading ? (
              <div className="h-8 w-28 animate-pulse rounded bg-slate-200" />
            ) : tenant?.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={tenant.companyName || "Logo"}
                className="h-8 w-auto object-contain max-w-[140px]"
              />
            ) : (
              <Image
                src="/common/logo.png"
                alt={tenant?.companyName || "Logo"}
                width={120}
                height={36}
                className="h-8 w-auto object-contain"
                priority
              />
            )}
          </div>
        </Link>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1.5 px-5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3.5 rounded-xl px-4 py-3 text-[14px] font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-white !text-[#172a78] shadow-md dark:bg-[#1e293b] dark:!text-white"
                  : "!text-white/80 hover:bg-white/10 hover:!text-white"
              }`}
            >
              <item.icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive
                    ? "!text-[#172a78] dark:!text-white"
                    : "!text-white/80 group-hover:!text-white"
                }`}
              />
              <span
                className={`transition-colors ${
                  isActive
                    ? "!text-[#172a78] dark:!text-white font-bold"
                    : "!text-white/85 group-hover:!text-white"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[14px] font-semibold text-white/80 transition-all hover:bg-red-500/20 hover:text-red-200"
        >
          <LogOut className="h-5 w-5 text-red-400 shrink-0" />
          <span>Sign Out</span>
        </button>
      </nav>

    </aside>
  );
}

function getInitials(name?: string, firstName?: string, lastName?: string) {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (name && name.trim()) {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (firstName && firstName.trim()) {
    return firstName.trim().slice(0, 2).toUpperCase();
  }
  return "CP";
}

function DashboardHeader({ onProfileClick }: { onProfileClick: () => void }) {
  const { user } = useAuth();
  const displayName =
    user?.name ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Candidate");
  const displayEmail = user?.email || "candidate@voctrum.com";
  const initials = getInitials(user?.name, user?.firstName, user?.lastName);

  return (
    <header className="flex h-[88px] shrink-0 items-center justify-end px-6 md:px-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/70 dark:border-slate-800">
      <button
        onClick={onProfileClick}
        className="group flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141416] p-2 pr-3.5 shadow-xs hover:border-[#2f54eb]/60 hover:shadow-sm transition-all focus:outline-none"
        title="View Candidate Account"
        aria-label="View Candidate Account"
      >
        {/* Candidate Initials Badge - NO static image */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f54eb] to-indigo-600 text-sm font-black text-white shadow-xs">
          {initials}
        </div>

        {/* Candidate Info Text */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight group-hover:text-[#2f54eb] transition-colors">
              {displayName}
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active" />
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight truncate max-w-[150px]">
            {displayEmail}
          </span>
        </div>

        <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 group-hover:translate-y-0.5 ml-1" />
      </button>
    </header>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const displayName =
    user?.name ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Candidate Profile");
  const displayEmail = user?.email || "candidate@voctrum.com";
  const displayPhone = user?.contactNumber || user?.mobile || null;
  const displayLocation =
    user?.currentLocation ||
    user?.preferredWorkLocation ||
    (user?.address?.city ? `${user.address.city}${user.address.country ? `, ${user.address.country}` : ""}` : null);
  const displayRole = user?.headline || "Registered Candidate";
  const initials = getInitials(user?.name, user?.firstName, user?.lastName);

  const handleSignOut = () => {
    onClose();
    logout();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <section
        className="absolute right-6 md:right-10 top-[76px] w-[380px] max-w-[92vw] overflow-hidden rounded-2xl bg-white dark:bg-[#18181b] shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with close button */}
        <div className="relative h-28 bg-gradient-to-r from-[#172a78] via-[#2f54eb] to-indigo-600 p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Candidate
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile menu"
              className="grid h-7 w-7 place-items-center rounded-lg bg-black/20 text-white hover:bg-black/40 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Candidate Info Card */}
        <div className="relative z-10 -mt-12 px-6 pb-6 text-center">
          {/* Avatar Initials - completely unclipped and elevated with z-20 */}
          <div className="relative z-20 mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white dark:border-[#18181b] bg-gradient-to-br from-[#2f54eb] via-indigo-600 to-blue-700 text-3xl font-black text-white shadow-xl ring-4 ring-blue-500/20">
            {initials}
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {displayName}
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {displayEmail}
          </p>

          <span className="mt-2 inline-block rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-[11px] font-semibold text-[#2f54eb] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
            {displayRole}
          </span>

          {/* Details Pill Box */}
          {(displayPhone || displayLocation) && (
            <div className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3.5 border border-slate-100 dark:border-slate-800 text-left space-y-2 text-xs">
              {displayPhone && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-[#2f54eb] shrink-0" />
                  <span className="truncate">{displayPhone}</span>
                </div>
              )}
              {displayLocation && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-[#2f54eb] shrink-0" />
                  <span className="truncate">{displayLocation}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Links */}
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-red-50/80 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/40 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardFooter() {
  const { tenant } = useAuth();
  const companyName = tenant?.companyName || "Voctrum";

  const columns = [
    ["Company", "About Us", "Careers", "Partners"],
    ["Job Seekers", "Browse Jobs", "Featured Jobs", "Saved Jobs", "Resume Builder"],
    ["Resources", "Privacy & Security", "Help Center", "FAQs", "Blog"],
  ];

  const getDashboardLinkHref = (name: string) => {
    switch (name) {
      case "About Us":
        return "/about";
      case "Careers":
      case "Browse Jobs":
      case "Featured Jobs":
        return "/dashboard/jobs";
      case "Partners":
        return "/partners";
      case "Saved Jobs":
        return "/dashboard/my-jobs";
      case "Resume Builder":
        return "/dashboard/resume-builder";
      case "Privacy & Security":
        return "/about";
      case "Help Center":
      case "FAQs":
        return "/help-center";
      case "Blog":
        return "/blog";
      default:
        return "/dashboard";
    }
  };

  return (
    <footer className="bg-[#172a78] dark:bg-[#0f172a] px-10 py-10 text-white mt-auto border-t dark:border-slate-800">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_1.5fr]">
        <div>
          <Link href="/" title="Go to main homepage" className="inline-block">
            <div className="rounded-xl bg-white px-3.5 py-1.5 shadow-sm inline-flex items-center justify-center">
              {tenant?.logoUrl ? (
                <img
                  src={tenant.logoUrl}
                  alt={companyName}
                  className="h-8 w-auto object-contain max-w-[140px]"
                />
              ) : (
                <Image
                  src="/common/logo.png"
                  alt={companyName}
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
              )}
            </div>
          </Link>
          <p className="mt-2 text-sm text-white/85 dark:text-slate-300">
            Connecting talent with the right opportunities at {companyName}
          </p>
          <div className="mt-7 flex max-w-lg gap-4">
            <input
              placeholder="Enter your email for job alerts"
              className="h-12 min-w-0 flex-1 rounded-lg bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white outline-none dark:border dark:border-slate-700"
            />
            <button className="h-12 rounded-lg bg-white dark:bg-[#2f54eb] px-7 text-sm font-bold text-blue-800 dark:text-white transition hover:bg-slate-50 dark:hover:bg-[#2447d8]">
              Subscribe
            </button>
          </div>
        </div>
        <div className="grid gap-9 sm:grid-cols-3">
          {columns.map(([title, ...links]) => (
            <div key={title}>
              <h3 className="text-lg font-black">{title}</h3>
              <ul className="mt-7 space-y-4 text-sm text-white/75 dark:text-slate-400">
                {links.map((link) => (
                  <li key={link}>
                    <Link href={getDashboardLinkHref(link)} className="transition hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 text-xs text-white/60 dark:text-slate-400 sm:flex-row">
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-white transition">
            Terms of Service
          </Link>
          <span>|</span>
          <Link href="/about" className="hover:text-white transition">
            Privacy Policy
          </Link>
        </div>
        <p>© 2026 {companyName}. All rights reserved</p>
        <TenantSocialLinks iconSize="sm" />
      </div>
    </footer>
  );
}
