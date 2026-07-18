import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';

const footerColumns = [
  ['Company', 'About Us', 'Partners', 'Contact Us'],
  ['Job Seekers', 'Browse Jobs', 'Job Categories', 'Featured Jobs', 'Saved Jobs'],
  ['Resources', 'Career', 'Help Center', 'Blog'],
];

export default function Footer() {
  return (
    <footer className="bg-[#172a78] px-5 py-16 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-24">
          
          {/* Left Side: Logo & Subscribe */}
          <div className="max-w-[420px]">
            <Image
              src="/footer/footerLogo.png"
              alt="Voctrum"
              width={240}
              height={80}
              className="w-[160px] md:w-[190px] h-auto object-contain"
            />
            <p className="mt-3 text-[14px] font-medium text-[#b4c4e5]">
              Connecting talent with the right opportunities
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
                  {links.map((link) => {
                    const getLinkHref = (name: string) => {
                      if (name === 'About Us') return '/about';
                      if (name === 'Partners') return '/partners';
                      if (name === 'Help Center') return '/help-center';
                      if (name === 'Blog') return '/blog';
                      if (name === 'Contact Us') return '/contact-us';
                      return '#';
                    };
                    return (
                      <li key={link}>
                        <Link href={getLinkHref(link)} className="transition hover:text-white">
                          {link}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-full bg-white dark:bg-[#1a1a1a] px-8 py-4 text-[14px] md:flex-row">
          
          <div className="flex items-center font-medium text-[#71717a]">
            <a href="#" className="transition hover:text-slate-900 dark:text-white">Terms of Service</a>
            <span className="mx-3 text-[#d4d4d8]">|</span>
            <a href="#" className="transition hover:text-slate-900 dark:text-white">Privacy Policy</a>
          </div>
          
          <div className="text-[#a1a1aa]">
            © 2026 <span className="font-bold text-[#71717a]">Voctrum.</span> All rights reserved
          </div>
          
          <div className="flex items-center gap-3">
            <a href="#" aria-label="X" className="grid h-[30px] w-[30px] place-items-center rounded-full bg-black text-white transition hover:opacity-80">
              <FaXTwitter className="h-[14px] w-[14px]" />
            </a>
            <a href="#" aria-label="Facebook" className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#1877F2] text-white transition hover:opacity-80">
              <FaFacebookF className="h-[14px] w-[14px]" />
            </a>
            <a href="#" aria-label="Instagram" className="grid h-[30px] w-[30px] place-items-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white transition hover:opacity-80">
              <FaInstagram className="h-[14px] w-[14px]" />
            </a>
            <a href="#" aria-label="LinkedIn" className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#0A66C2] text-white transition hover:opacity-80">
              <FaLinkedinIn className="h-[14px] w-[14px]" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
