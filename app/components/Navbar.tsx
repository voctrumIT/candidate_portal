'use client';

import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const navLinks: { label: string; href: string }[] = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Companies', href: '/companies' },
  { label: 'About Us', href: '/about' },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur"
    >
      <nav className="mx-auto flex h-20 max-w-[1360px] items-center justify-between px-5 md:px-10 lg:px-16">
        <Link href="/" aria-label="Voctrum home" className="flex items-center">
          <Image
            src="/common/logo.png"
            alt="Voctrum"
            width={156}
            height={54}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center gap-16 md:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[15px] font-semibold text-slate-700 transition hover:text-blue-700"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <span className="hidden text-[15px] font-medium text-slate-500 lg:inline">
            Already have an account ?
          </span>
          <Link
            href="/login"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold !text-white shadow-sm transition hover:bg-blue-800 hover:!text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:px-6"
          >
            <LogIn className="h-4 w-4 text-white" />
            Login
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
