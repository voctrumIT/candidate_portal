"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

type TabType = "Today" | "This Week" | "This Month";

const notificationsData: Record<TabType, { id: number; title: string; subtitle: string; time: string }[]> = {
  "Today": [
    {
      id: 1,
      title: "Job Applied",
      subtitle: "You applied for Frontend Developer at ABC Company",
      time: "1 hours ago",
    },
    {
      id: 2,
      title: "Shortlisted",
      subtitle: "You've been shortlisted for UI Designer role",
      time: "3 hours ago",
    },
    {
      id: 3,
      title: "Job Alert",
      subtitle: "New React Developer jobs matching your profile",
      time: "5 hours ago",
    },
    {
      id: 4,
      title: "Profile & Resume",
      subtitle: "Your profile is 80% complete — add more details to improve visibility",
      time: "7 hours ago",
    },
    {
      id: 5,
      title: "Interview",
      subtitle: "Interview scheduled with XYZ Ltd on 12 Apr, 10:00 AM",
      time: "9 hours ago",
    },
  ],
  "This Week": [
    {
      id: 6,
      title: "System / Reminders",
      subtitle: "Don't miss out — finish your application for Frontend Developer",
      time: "Yesterday",
    },
    {
      id: 7,
      title: "Interview",
      subtitle: "Interview scheduled with XYZ Ltd on 12 Apr, 10:00 AM",
      time: "2 days ago",
    },
    {
      id: 8,
      title: "Shortlisted",
      subtitle: "You've been shortlisted for UI Designer role",
      time: "3 days ago",
    },
    {
      id: 9,
      title: "Job Applied",
      subtitle: "You applied for Frontend Developer at ABC Company",
      time: "6 days ago",
    },
  ],
  "This Month": [
    {
      id: 10,
      title: "System / Reminders",
      subtitle: "Don't miss out — finish your application for Frontend Developer",
      time: "Last week",
    },
    {
      id: 11,
      title: "Interview",
      subtitle: "Interview scheduled with XYZ Ltd on 12 Apr, 10:00 AM",
      time: "2 weeks ago",
    },
    {
      id: 12,
      title: "Shortlisted",
      subtitle: "You've been shortlisted for UI Designer role",
      time: "3 weeks ago",
    },
    {
      id: 13,
      title: "Job Applied",
      subtitle: "You applied for Frontend Developer at ABC Company",
      time: "23 days ago",
    },
  ]
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Today");
  
  const currentNotifications = notificationsData[activeTab] || [];
  const hasNotifications = currentNotifications.length > 0;

  return (
    <div className="p-10">
      <h1 className="text-[28px] font-bold text-[#101828] dark:text-white">Your Notifications</h1>
      <p className="mt-1 text-[15px] text-[#667085] dark:text-slate-400">
        Stay updated with your activity, application, and jobs alert
      </p>

      <div className="mt-8 inline-flex rounded-lg bg-[#f4f5f7] p-1 dark:bg-slate-800">
        {(["Today", "This Week", "This Month"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-6 py-2 text-[14px] font-medium transition-all ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm font-semibold dark:bg-[#1a1a1a] dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {hasNotifications ? (
        <div className="mt-8 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {currentNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex w-full items-center justify-between rounded-[16px] bg-[#f4f7fc] p-5 dark:bg-[#1a1a1a] dark:border dark:border-slate-800"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800">
                  <span className="text-[17px] font-black tracking-tighter text-slate-800 dark:text-slate-200">HR</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">{notification.title}</h3>
                  <p className="mt-0.5 text-[14px] text-[#667085] dark:text-slate-400">{notification.subtitle}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                <button className="flex h-7 w-7 items-center justify-center rounded bg-red-50 text-red-500 transition hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <span className="text-[12px] font-bold text-slate-900 dark:text-slate-300">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-32 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
          <Image
            src="/notification/1.png"
            alt="No notifications"
            width={320}
            height={320}
            className="object-contain"
            priority
          />
          <h3 className="mt-8 text-[22px] font-bold text-slate-900 dark:text-white">No notifications yet</h3>
          <p className="mt-3 max-w-2xl text-[15px] text-[#667085] dark:text-slate-400">
            Stay tuned — we'll notify you when there's progress on your applications or new
            opportunities
          </p>
        </div>
      )}
    </div>
  );
}
