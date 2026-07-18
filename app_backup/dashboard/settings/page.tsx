"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  FileText,
  MessageSquare,
  Calendar,
  Eye,
  UserCheck,
  FileSearch,
  Lock,
  Key,
  Moon,
  Globe,
  HelpCircle,
  HeadphonesIcon,
  Shield,
  LogOut,
  ChevronRight,
  ChevronDown
} from "lucide-react";

// --- Components ---

function ToggleSwitch({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
        active
          ? "border-transparent bg-[#a5b4fc] dark:bg-[#4f46e5]"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow transition duration-200 ease-in-out ${
          active
            ? "translate-x-5 bg-white"
            : "translate-x-1 bg-slate-400 dark:bg-slate-500"
        }`}
      />
    </button>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-[13px] font-semibold text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="flex flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1a1a1a]">
        {children}
      </div>
    </div>
  );
}

interface SettingItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  action: React.ReactNode;
  borderBottom?: boolean;
}

function SettingItem({ icon, iconBg, iconColor, title, subtitle, action, borderBottom = true }: SettingItemProps) {
  return (
    <div className={`flex items-center justify-between p-5 ${borderBottom ? "border-b border-slate-100 dark:border-slate-800/50" : ""}`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} dark:bg-opacity-10 dark:brightness-125`}>
          {icon}
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">{title}</h4>
          {subtitle && <p className="mt-0.5 text-[12px] text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div>{action}</div>
    </div>
  );
}


// --- Main Page ---

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [toggles, setToggles] = useState({
    jobAlerts: true,
    appUpdates: false,
    recruiterMessage: false,
    interviewReminders: true,
    openToWork: true,
    darkMode: false,
  });

  useEffect(() => {
    setMounted(true);
    if (theme === "dark") {
      setToggles((prev) => ({ ...prev, darkMode: true }));
    }
  }, [theme]);

  const toggleState = (key: keyof typeof toggles) => {
    if (key === "darkMode") {
      const newDarkMode = !toggles.darkMode;
      setTheme(newDarkMode ? "dark" : "light");
      setToggles((prev) => ({ ...prev, darkMode: newDarkMode }));
    } else {
      setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleLogout = () => {
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="p-10 pb-20">
      <h1 className="text-[28px] font-bold text-[#101828] dark:text-white">Settings</h1>
      <p className="mt-1 text-[15px] text-[#667085] dark:text-slate-400">
        Manage your account and preference
      </p>

      <div className="mt-10 w-full max-w-[800px]">
        {/* Notifications */}
        <SettingsCard title="Notifications">
          <SettingItem
            icon={<Briefcase className="h-5 w-5" />}
            iconBg="bg-[#eff2fe]"
            iconColor="text-[#2f54eb]"
            title="Job alerts"
            subtitle="Get notified about job matchings"
            action={<ToggleSwitch active={toggles.jobAlerts} onChange={() => toggleState("jobAlerts")} />}
          />
          <SettingItem
            icon={<FileText className="h-5 w-5" />}
            iconBg="bg-[#fff9e6]"
            iconColor="text-[#d4b106]"
            title="Application updates"
            subtitle="Status change on your application"
            action={<ToggleSwitch active={toggles.appUpdates} onChange={() => toggleState("appUpdates")} />}
          />
          <SettingItem
            icon={<MessageSquare className="h-5 w-5" />}
            iconBg="bg-[#faebf6]"
            iconColor="text-[#c41d7f]"
            title="Recruiter message"
            subtitle="Message from hiring managers"
            action={<ToggleSwitch active={toggles.recruiterMessage} onChange={() => toggleState("recruiterMessage")} />}
          />
          <SettingItem
            icon={<Calendar className="h-5 w-5" />}
            iconBg="bg-[#fff1f0]"
            iconColor="text-[#cf1322]"
            title="Interview Reminders"
            subtitle="Upcoming interview notification"
            action={<ToggleSwitch active={toggles.interviewReminders} onChange={() => toggleState("interviewReminders")} />}
            borderBottom={false}
          />
        </SettingsCard>

        {/* Privacy & Visibility */}
        <SettingsCard title="Privacy & Visibility">
          <SettingItem
            icon={<Eye className="h-5 w-5" />}
            iconBg="bg-[#eff2fe]"
            iconColor="text-[#2f54eb]"
            title="Open to work"
            subtitle="Show recruiters your are available"
            action={<ToggleSwitch active={toggles.openToWork} onChange={() => toggleState("openToWork")} />}
          />
          <SettingItem
            icon={<UserCheck className="h-5 w-5" />}
            iconBg="bg-[#fff9e6]"
            iconColor="text-[#d4b106]"
            title="Profile Visibility"
            subtitle="Who can see your profile"
            action={
              <div className="relative">
                <select className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-10 text-[13px] font-medium text-slate-700 outline-none focus:border-[#2f54eb] dark:border-slate-700 dark:bg-[#222] dark:text-slate-200">
                  <option>Everyone</option>
                  <option>Recruiters only</option>
                  <option>Private</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            }
          />
          <SettingItem
            icon={<FileSearch className="h-5 w-5" />}
            iconBg="bg-[#faebf6]"
            iconColor="text-[#c41d7f]"
            title="Resume Visibility"
            subtitle="Control who can download your resume"
            action={
              <div className="relative">
                <select className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-10 text-[13px] font-medium text-slate-700 outline-none focus:border-[#2f54eb] dark:border-slate-700 dark:bg-[#222] dark:text-slate-200" defaultValue="Recruiters only">
                  <option>Everyone</option>
                  <option>Recruiters only</option>
                  <option>Private</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            }
            borderBottom={false}
          />
        </SettingsCard>

        {/* Security */}
        <SettingsCard title="Security">
          <SettingItem
            icon={<Lock className="h-5 w-5" />}
            iconBg="bg-[#eff2fe]"
            iconColor="text-[#2f54eb]"
            title="Change password"
            subtitle="Update your password"
            action={<ChevronRight className="h-5 w-5 text-slate-300" />}
          />
          <SettingItem
            icon={<Key className="h-5 w-5" />}
            iconBg="bg-[#fff9e6]"
            iconColor="text-[#d4b106]"
            title="Two-factor authentication"
            subtitle="Add an extra layer of security"
            action={<ChevronRight className="h-5 w-5 text-slate-300" />}
            borderBottom={false}
          />
        </SettingsCard>

        {/* Appearance */}
        <SettingsCard title="Appearance">
          <SettingItem
            icon={<Moon className="h-5 w-5" />}
            iconBg="bg-[#1e293b]"
            iconColor="text-white"
            title="Dark mode"
            subtitle="Switch to a darker interface"
            action={<ToggleSwitch active={toggles.darkMode} onChange={() => toggleState("darkMode")} />}
          />
          <SettingItem
            icon={<Globe className="h-5 w-5" />}
            iconBg="bg-[#fff9e6]"
            iconColor="text-[#d4b106]"
            title="Language"
            subtitle="Choose your display language"
            action={
              <div className="relative">
                <select className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-10 text-[13px] font-medium text-slate-700 outline-none focus:border-[#2f54eb] dark:border-slate-700 dark:bg-[#222] dark:text-slate-200">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            }
            borderBottom={false}
          />
        </SettingsCard>

        {/* Support & Help */}
        <SettingsCard title="Support & Help">
          <SettingItem
            icon={<HelpCircle className="h-5 w-5" />}
            iconBg="bg-[#eff2fe]"
            iconColor="text-[#2f54eb]"
            title="Help center"
            subtitle="Browse guides and FAQS"
            action={<ChevronRight className="h-5 w-5 text-slate-300" />}
          />
          <SettingItem
            icon={<HeadphonesIcon className="h-5 w-5" />}
            iconBg="bg-[#fff9e6]"
            iconColor="text-[#d4b106]"
            title="Contact support"
            subtitle="Reach out to our team"
            action={<ChevronRight className="h-5 w-5 text-slate-300" />}
          />
          <SettingItem
            icon={<Shield className="h-5 w-5" />}
            iconBg="bg-[#faebf6]"
            iconColor="text-[#c41d7f]"
            title="Privacy policy"
            subtitle="Read how we handle your data"
            action={<ChevronRight className="h-5 w-5 text-slate-300" />}
            borderBottom={false}
          />
        </SettingsCard>

        {/* Logout */}
        <div 
          onClick={handleLogout}
          className="mt-10 rounded-xl border border-red-100 bg-white hover:bg-red-50/50 transition cursor-pointer dark:border-red-900/30 dark:bg-[#1a1a1a] dark:hover:bg-red-950/20"
        >
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/30">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-red-500">Logout</h4>
                <p className="mt-0.5 text-[12px] text-slate-400">Sign out of your voctrum accout</p>
              </div>
            </div>
            <div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
