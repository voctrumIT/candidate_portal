import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';

const footerColumns = [
  ['Company', 'About Us', 'Careers', 'Contact Us', 'Partners'],
  ['Job Seekers', 'Browse Jobs', 'Job Categories', 'Featured Jobs', 'Saved Jobs'],
  ['Career Resources', 'Privacy & Security', 'Help Center', 'FAQs', 'Blog'],
];

export default function Footer() {
  return (
    <footer className="bg-[#172a78] px-5 py-14 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1220px]">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1.5fr]">
          <div>
            <Image
              src="/common/logo.png"
              alt="Voctrum"
              width={150}
              height={52}
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="mt-2 text-sm font-medium text-white/90">
              Connecting talent with the right opportunities
            </p>
            <div className="mt-7 flex max-w-md gap-3">
              <input
                aria-label="Email for job alerts"
                placeholder="Enter your email for job alerts"
                className="h-12 min-w-0 flex-1 rounded-md border border-white/80 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/80"
              />
              <button className="h-12 rounded-md bg-white px-7 text-sm font-bold text-blue-800">
                Subscribe
              </button>
            </div>
          </div>

          <div className="grid gap-9 sm:grid-cols-3">
            {footerColumns.map(([title, ...links]) => (
              <div key={title}>
                <h3 className="text-xl font-black">{title}</h3>
                <ul className="mt-8 space-y-6 text-sm text-white/75">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="transition hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-full bg-white px-6 py-4 text-sm text-slate-500 md:flex-row">
          <p>
            <a href="#">Terms of Service</a>
            <span className="mx-3 text-slate-300">|</span>
            <a href="#">Privacy Policy</a>
          </p>
          <p>© 2026 Voctrum. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="X" className="grid h-6 w-6 place-items-center rounded-full bg-black text-white">
              <FaXTwitter className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="Facebook" className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-white">
              <FaFacebookF className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="Instagram" className="grid h-6 w-6 place-items-center rounded-full bg-pink-500 text-white">
              <FaInstagram className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="grid h-6 w-6 place-items-center rounded-full bg-sky-700 text-white">
              <FaLinkedinIn className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
