"use client";

import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import TenantSocialLinks from "../../../app/components/TenantSocialLinks";

export default function ContactHeroAndForm() {
  const { tenant } = useAuth();
  return (
    <section className="relative w-full">

      {/* Background Section */}
      <div className="relative w-full bg-[#121c4a] pt-24 pb-48 md:pt-32 md:pb-64 lg:pb-72 overflow-hidden">

        {/* Glow/Gradient overlay for depth matching the image */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#243b8a] via-[#121c4a] to-[#0d1436] opacity-90" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold italic text-slate-500 mb-6 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2f54eb]" />
            Contact Us
          </div>

          {/* Heading */}
          <h1 className="text-[32px] md:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Get the Right Support, Faster
          </h1>

          {/* Subheading */}
          <p className="text-[13px] md:text-[15px] text-slate-300 max-w-2xl mx-auto leading-[1.6]">
            Whether you&apos;re hiring talent, exploring partnerships, or have a question for our team, we&apos;re here to help and<br className="hidden md:block" />
            would love to hear from you
          </p>

        </div>

        {/* Slanted Bottom SVG */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-[80px] md:h-[120px] lg:h-[180px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            {/* The path goes from bottom-left (0,120) to top-right (1200,0) down to bottom-right (1200,120) */}
            <path d="M0,120 L1200,0 L1200,120 Z" fill="currentColor" className="text-white dark:text-[#0a0a0a]"></path>
          </svg>
        </div>
      </div>

      {/* Main Content Section (Overlapping) */}
      <div className="relative z-20 mx-auto max-w-[1200px] px-5 -mt-36 md:-mt-48 lg:-mt-72 pb-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left Column: Form */}
          <div className="w-full lg:w-[55%]">
            <div className="rounded-[24px] bg-white dark:bg-[#1a1a1a] p-8 md:p-12 shadow-[0_30px_60px_rgb(0,0,0,0.08)] dark:shadow-none border border-slate-100 dark:border-slate-800">

              <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white mb-8">
                Leave  your message
              </h2>

              <form className="space-y-6">

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Name</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f8f9fa] dark:bg-slate-800/50 px-4 py-3 text-[14px] outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] transition-all dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Email</label>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f8f9fa] dark:bg-slate-800/50 px-4 py-3 text-[14px] outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] transition-all dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f8f9fa] dark:bg-slate-800/50 px-4 py-3 text-[14px] outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] transition-all dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Message</label>
                  <textarea
                    placeholder="Enter Your Message Here"
                    rows={6}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f8f9fa] dark:bg-slate-800/50 px-4 py-3 text-[14px] outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] transition-all dark:text-white placeholder:text-slate-400 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#2f54eb] focus:ring-[#2f54eb]" />
                    <span className="text-[13px] text-slate-600 dark:text-slate-400 font-medium">
                      I agree to the Terms & Privacy Policy
                    </span>
                  </label>

                  <button type="button" className="rounded-full bg-[#2f54eb] px-10 py-3 text-[14px] font-bold text-white transition hover:bg-blue-700 shadow-md whitespace-nowrap">
                    Send Message
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="w-full lg:w-[45%] lg:pt-[100px]">

            <h2 className="text-[28px] md:text-[32px] font-extrabold text-slate-900 dark:text-white mb-3">
              We&apos;d <span className="text-[#2f54eb]">Love</span> to Hear From You
            </h2>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-md">
              Reach out to us for support, collaborations, employer solutions, or any questions you may have
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

              {/* Info Card 1 */}
              <div className="flex items-center gap-4 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f4ff] dark:bg-blue-900/20 text-[#2f54eb]">
                  <MapPin className="h-[22px] w-[22px]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white mb-0.5">Office</h4>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">Srinagar, J&K</p>
                </div>
              </div>

              {/* Info Card 2 */}
              <div className="flex items-center gap-4 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fffcf0] dark:bg-yellow-900/20 text-[#d4a631]">
                  <Phone className="h-[22px] w-[22px]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white mb-0.5">Phone</h4>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">+912436373635636636</p>
                </div>
              </div>

              {/* Info Card 3 */}
              <div className="flex items-center gap-4 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8f0ff] dark:bg-purple-900/20 text-[#a855f7]">
                  <Clock className="h-[22px] w-[22px]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white mb-0.5">Business Hours</h4>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">Everyday 9:30 am - 5 pm</p>
                </div>
              </div>

              {/* Info Card 4 */}
              <div className="flex items-center gap-4 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0fdf4] dark:bg-green-900/20 text-[#10b981]">
                  <Mail className="h-[22px] w-[22px] fill-current" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white mb-0.5">Email</h4>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate">
                    {tenant?.contactEmail || "support@voctrum.com"}
                  </p>
                </div>
              </div>

            </div>

            <hr className="border-slate-200 dark:border-slate-800 mb-6" />

            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-slate-900 dark:text-white">Social Media :</span>
              <TenantSocialLinks />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
