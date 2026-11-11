'use client';

import { LogIn, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const navLinks: { label: string; href: string }[] = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'About Us', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, tenant, tenantLoading, logout } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = () => {
      if (typeof window !== 'undefined') {
        setToken(localStorage.getItem('candidate_token'));
      }
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const isLoggedIn = Boolean(token || user);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur"
    >
      <nav className="mx-auto flex h-20 max-w-[1360px] items-center justify-between px-5 md:px-10 lg:px-16">
        <Link href="/" aria-label="Home" className="flex items-center">
          {tenantLoading ? (
            <div className="h-10 w-32 animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-800" />
          ) : tenant?.logoUrl ? (
            <img
              src={tenant.logoUrl}
              alt={tenant.companyName || "Logo"}
              className="h-10 w-auto object-contain max-w-[160px]"
            />
          ) : (
            <Image
              src="/common/logo.png"
              alt="Voctrum"
              width={156}
              height={54}
              priority
              className="h-10 w-auto object-contain"
            />
          )}
        </Link>

        <div className="hidden items-center gap-16 md:flex">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                className={`text-[15px] font-semibold transition ${isActive
                    ? '!text-blue-700 dark:!text-blue-500 border-b-2 border-blue-700 dark:border-blue-500 pb-1'
                    : '!text-black dark:!text-white hover:!text-blue-700 dark:hover:!text-blue-500'
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href="/dashboard/profile"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold !text-white shadow-sm transition hover:bg-blue-800 hover:!text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:px-5"
              >
                <User className="h-4 w-4 text-white" />
                <span>{user?.firstName ? `${user.firstName}'s Profile` : 'Profile'}</span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex h-11 items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-3 md:px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <span className="hidden text-[15px] font-medium !text-gray-600 dark:!text-slate-300 lg:inline">
                Already have an account ?
              </span>
              <Link
                href="/login"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold !text-white shadow-sm transition hover:bg-blue-800 hover:!text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:px-6"
              >
                <LogIn className="h-4 w-4 text-white" />
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
