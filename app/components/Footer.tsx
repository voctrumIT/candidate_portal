"use client";

import Image from 'next/image';
import Link from 'next/link';
import TenantSocialLinks from './TenantSocialLinks';
import { useAuth } from '../../context/AuthContext';

const footerColumns = [
  ['Company', 'About Us', 'Partners', 'Contact Us'],
  ['Job Seekers', 'Browse Jobs', 'Featured Jobs', 'Saved Jobs', 'Resume Builder'],
  ['Resources', 'Career', 'Help Center', 'Blog'],
];

export default function Footer() {
  const { tenant } = useAuth();
  const companyName = tenant?.companyName || "Voctrum";

  const getLinkHref = (name: string) => {
    switch (name) {
      // Company
      case 'About Us':
        return '/about';
      case 'Partners':
        return '/partners';
      case 'Contact Us':
        return '/contact-us';
      // Job Seekers
      case 'Browse Jobs':
        return '/jobs';
      case 'Featured Jobs':
        return '/jobs?featured=true';
      case 'Saved Jobs':
        return '/dashboard/my-jobs';
      case 'Resume Builder':
        return '/dashboard/resume-builder';
      // Resources
      case 'Career':
        return '/jobs';
      case 'Help Center':
        return '/help-center';
      case 'Blog':
        return '/blog';
      default:
        return '#';
    }
  };

  return (
    <footer className="bg-[#172a78] px-5 py-16 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-24">

          {/* Left Side: Logo & Subscribe */}
          <div className="max-w-[420px]">
            <Link href="/" title="Home" className="inline-block">
              <div className="rounded-2xl bg-white px-5 py-3 inline-flex items-center justify-center gap-3.5 shadow-md">
                {tenant?.logoUrl ? (
                  <img
                    src={tenant.logoUrl}
                    alt={companyName}
                    className="h-10 w-auto object-contain max-w-[140px] shrink-0"
                  />
                ) : (
                  <Image
                    src="/common/logo.png"
                    alt={companyName}
                    width={180}
                    height={48}
                    className="h-10 w-auto object-contain shrink-0"
                  />
                )}
                <span className="text-[40px] font-black text-slate-900 tracking-tight whitespace-nowrap">
                  {companyName}
                </span>
              </div>
            </Link>
            <p className="mt-4 text-[14px] font-medium text-[#b4c4e5]">
              Connecting talent with the right opportunities at {companyName}
            </p>

            <div className="mt-8 flex gap-3">
              <input
                aria-label="Email for job alerts"
                placeholder="Enter your email for job alerts"
                className="h-12 w-[260px] rounded-lg bg-white dark:bg-[#1a1a1a] px-4 text-[14px] text-slate-800 outline-none placeholder:text-[#9ca3af]"
              />
              <button className="h-12 rounded-lg bg-white dark:bg-[#1a1a1a] px-7 text-[14px] font-bold text-[#172a78] transition hover:bg-slate-50 dark:bg-slate-900">
                Subscribe
              </button>
            </div>
          </div>

          {/* Right Side: Columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-3 lg:gap-12">
            {footerColumns.map(([title, ...links]) => (
              <div key={title}>
                <h3 className="text-[17px] font-bold text-white">{title}</h3>
                <ul className="mt-6 space-y-4 text-[15px] text-[#b4c4e5]">
                  {links.map((link) => (
                    <li key={link}>
                      <Link href={getLinkHref(link)} className="transition hover:text-white">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-full bg-white dark:bg-[#1a1a1a] px-8 py-4 text-[14px] md:flex-row shadow-sm">

          <div className="flex items-center font-medium text-[#71717a] dark:text-slate-400">
            <Link href="/about" className="transition hover:text-slate-900 dark:hover:text-white">Terms of Service</Link>
            <span className="mx-3 text-[#d4d4d8] dark:text-slate-700">|</span>
            <Link href="/about" className="transition hover:text-slate-900 dark:hover:text-white">Privacy Policy</Link>
          </div>

          <div className="text-[#a1a1aa] dark:text-slate-400">
            © 2026 <span className="font-bold text-[#71717a] dark:text-slate-300">{companyName}.</span> All rights reserved
          </div>

          <TenantSocialLinks iconSize="md" />

        </div>
      </div>
    </footer>
  );
}
