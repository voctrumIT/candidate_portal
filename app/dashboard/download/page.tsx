"use client";

import Image from "next/image";
import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { CheckCircle2, Smartphone, Bell, Zap, ShieldCheck, QrCode, ArrowLeft } from "lucide-react";

export default function DownloadPage() {
  return (
    <div className="px-10 py-10 max-w-6xl">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f54eb] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#1a1a1a] shadow-sm">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f0f4ff] px-4 py-1.5 text-xs font-bold text-[#2f54eb] dark:bg-slate-800 dark:text-blue-400">
              <Smartphone className="h-4 w-4" />
              Mobile App Experience
            </span>
            <h1 className="mt-4 text-3xl font-black text-slate-950 dark:text-white md:text-4xl">
              Get the <span className="text-[#2f54eb]">Voctrum</span> App
            </h1>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
              Never miss an opportunity. Search jobs, receive interview invites, and chat with employers on the go.
            </p>

            {/* Feature list */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Real-time Push Notifications</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Get notified the second a recruiter views your profile or schedules an interview.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">One-Tap Easy Apply</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Apply to top tech and business roles in seconds with your saved Voctrum resume.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Assistant on the Go</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Get instant advice on salary negotiations and interview preparation anywhere.</p>
                </div>
              </div>
            </div>

            {/* Download Badges and QR */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-3 rounded-xl bg-slate-950 px-5 text-sm font-semibold !text-white transition hover:bg-slate-800 dark:bg-white dark:bg-[#1a1a1a] dark:text-slate-950"
              >
                <FaGooglePlay className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-[10px] leading-none uppercase">Get it on</div>
                  <div className="text-xs font-bold leading-none mt-1">Google Play</div>
                </div>
              </a>

              <a
                href="https://apple.com/app-store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-3 rounded-xl bg-slate-950 px-5 text-sm font-semibold !text-white transition hover:bg-slate-800 dark:bg-white dark:bg-[#1a1a1a] dark:text-slate-950"
              >
                <FaApple className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-[10px] leading-none uppercase">Download on the</div>
                  <div className="text-xs font-bold leading-none mt-1">App Store</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Visuals & QR */}
          <div className="flex flex-col items-center justify-center gap-8 rounded-2xl bg-gradient-to-b from-blue-50/60 to-indigo-50/30 p-8 dark:from-slate-900/60 dark:to-slate-950/40 border border-blue-100 dark:border-slate-800">
            <div className="flex justify-center gap-4">
              <Image
                src="/homepage/m1.png"
                alt="Voctrum Mobile App"
                width={180}
                height={360}
                className="h-auto w-36 drop-shadow-xl"
              />
              <Image
                src="/homepage/m2.png"
                alt="Voctrum Mobile App Jobs"
                width={180}
                height={360}
                className="h-auto w-36 drop-shadow-xl"
              />
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/90 shadow-sm">
              <div className="grid h-16 w-16 place-items-center rounded-lg bg-blue-50 text-[#2f54eb] dark:bg-slate-700 dark:text-blue-400">
                <QrCode className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Scan QR code</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Point your camera to download directly to your mobile phone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

