"use client";

import { useState } from "react";
import { Pencil, LocateFixed } from "lucide-react";
import Image from "next/image";

export default function BasicDetailsTab() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 dark:border-slate-700 pb-4">
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Basic Details</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex h-8 w-8 items-center justify-center rounded bg-[#2f54eb] text-white transition hover:bg-[#2447d8]"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-8 flex items-start gap-10">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-[#eef2ff]">
            <Image src="/homepage/m1.png" alt="Profile" width={96} height={96} className="object-cover" />
          </div>
          {isEditing && (
            <button className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded bg-white dark:bg-[#1a1a1a] shadow-md border border-slate-100 text-[#2f54eb] hover:bg-slate-50 dark:bg-slate-900 transition">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Details / Form */}
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-6">
          {isEditing ? (
            <>
              {/* Form Mode */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">First Name <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="Hidayat" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Last Name <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="Ali" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Email <span className="text-red-500">*</span></label>
                <input type="email" defaultValue="hidayatali1143@gmail.com" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Mobile <span className="text-red-500">*</span></label>
                <div className="flex h-11 w-full items-center rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] px-4 focus-within:border-[#2f54eb] focus-within:ring-1 focus-within:ring-[#2f54eb]">
                  <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">+91 v</span>
                  <input type="text" defaultValue="8899451482" className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Preferred Work Location</label>
                <div className="relative">
                  <input type="text" defaultValue="Srinagar, Jammu & Kashmir" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
                  <LocateFixed className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f54eb]" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300">Current Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" defaultValue="Srinagar, Jammu & Kashmir" className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-700 dark:bg-[#1a1a1a] pl-4 pr-10 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]" />
                  <LocateFixed className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f54eb]" />
                </div>
              </div>
              
              <div className="col-span-2 mt-4 flex justify-end">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="h-11 rounded-lg bg-[#2f54eb] px-10 text-[14px] font-semibold text-white transition hover:bg-[#2447d8]"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div>
                <p className="text-[12px] font-semibold text-slate-400">First Name</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">Hidayat</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">Last Name</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">Ali</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">Email</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">hidayatali1143@gmail.com</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">Mobile</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">+91 8899451482</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">Preferred Work Location</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">Srinagar, Jammu & Kashmir</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">Current Location</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">Srinagar, Jammu & Kashmir</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
