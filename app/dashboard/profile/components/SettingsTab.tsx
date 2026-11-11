"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  HeadphonesIcon,
  HelpCircle,
  Shield,
  Moon,
  Sun,
  Lock,
  Key,
  Globe,
  ChevronDown,
} from "lucide-react";
import { toast } from "../../../components/Toast";

interface SettingItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  action: React.ReactNode;
  borderBottom?: boolean;
}

function ToggleSwitch({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        active ? "bg-[#2f54eb]" : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
          active ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingItem({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  action,
  borderBottom = true,
}: SettingItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-5 ${
        borderBottom ? "border-b border-slate-100 dark:border-slate-800/60" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} dark:bg-opacity-20`}
        >
          {icon}
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">{title}</h4>
          {subtitle && (
            <p className="mt-0.5 text-[12px] text-slate-400 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div>{action}</div>
    </div>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a]">
        {children}
      </div>
    </div>
  );
}

export default function SettingsTab() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  const toggleDarkMode = () => {
    const nextMode = isDarkMode ? "light" : "dark";
    setTheme(nextMode);
    toast.info(
      nextMode === "dark" ? "Dark Mode Enabled" : "Light Mode Enabled",
      `Switched display theme to ${nextMode} mode.`
    );
  };

  return (
    <div className="w-full">
      {/* Appearance */}
      <SettingsCard title="Appearance">
        <SettingItem
          icon={
            isDarkMode ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )
          }
          iconBg={isDarkMode ? "bg-indigo-950/60" : "bg-amber-50"}
          iconColor={isDarkMode ? "text-indigo-400" : "text-amber-600"}
          title="Dark mode"
          subtitle="Switch between light and dark themes"
          action={
            <ToggleSwitch
              active={isDarkMode}
              onChange={toggleDarkMode}
            />
          }
        />
        <SettingItem
          icon={<Globe className="h-5 w-5" />}
          iconBg="bg-[#eff2fe]"
          iconColor="text-[#2f54eb]"
          title="Language"
          subtitle="Choose your preferred display language"
          action={
            <div className="relative">
              <select
                onChange={(e) => toast.info("Language Updated", `Display language preference set to ${e.target.value}.`)}
                className="h-9 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] pl-4 pr-10 text-[13px] font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-[#2f54eb]"
              >
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

      {/* Security */}
      <SettingsCard title="Security">
        <SettingItem
          icon={<Lock className="h-5 w-5" />}
          iconBg="bg-[#eff2fe]"
          iconColor="text-[#2f54eb]"
          title="Change password"
          subtitle="Update your password regularly to keep your account safe"
          action={<ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
        />
        <SettingItem
          icon={<Key className="h-5 w-5" />}
          iconBg="bg-[#fff9e6]"
          iconColor="text-[#d4b106]"
          title="Two-factor authentication"
          subtitle="Add an extra layer of security when signing in"
          action={<ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
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
          subtitle="Browse candidate guides, FAQs, and tips"
          action={<ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
        />
        <SettingItem
          icon={<HeadphonesIcon className="h-5 w-5" />}
          iconBg="bg-[#fff9e6]"
          iconColor="text-[#d4b106]"
          title="Contact support"
          subtitle="Reach out to our dedicated support team"
          action={<ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
        />
        <SettingItem
          icon={<Shield className="h-5 w-5" />}
          iconBg="bg-[#faebf6]"
          iconColor="text-[#c41d7f]"
          title="Privacy policy"
          subtitle="Read how we safeguard and protect your personal data"
          action={<ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
          borderBottom={false}
        />
      </SettingsCard>
    </div>
  );
}
