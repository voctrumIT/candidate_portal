"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "../../components/Toast";
import {
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
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow transition duration-200 ease-in-out ${
          active
            ? "translate-x-5 bg-white dark:bg-[#1a1a1a]"
            : "translate-x-1 bg-slate-400 dark:bg-slate-50"
        }`}
      />
    </button>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-[13px] font-semibold text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a]">
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
          {subtitle && <p className="mt-0.5 text-[12px] text-slate-400 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      <div>{action}</div>
    </div>
  );
}

// --- Main Page ---

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [toggles, setToggles] = useState({
    darkMode: false,
  });

  useEffect(() => {
    setMounted(true);
    if (resolvedTheme === "dark") {
      setToggles({ darkMode: true });
    } else {
      setToggles({ darkMode: false });
    }
  }, [resolvedTheme]);

  const toggleDarkMode = () => {
    const newDarkMode = !toggles.darkMode;
    setTheme(newDarkMode ? "dark" : "light");
    setToggles({ darkMode: newDarkMode });
    toast.info(
      newDarkMode ? "Dark Mode Enabled" : "Light Mode Enabled",
      `Switched display theme to ${newDarkMode ? "dark" : "light"} mode.`
    );
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!mounted) return null;

  return (
    <div className="p-10 pb-20">
      <h1 className="text-[28px] font-bold text-[#101828] dark:text-white">Settings</h1>
      <p className="mt-1 text-[15px] text-[#667085] dark:text-slate-400">
        Manage your account and preferences
      </p>

      <div className="mt-10 w-full max-w-[800px]">
        {/* Security */}
        <SettingsCard title="Security">
          <SettingItem
            icon={<Lock className="h-5 w-5" />}
            iconBg="bg-[#eff2fe]"
            iconColor="text-[#2f54eb]"
            title="Change password"
            subtitle="Update your password regularly to keep your account safe"
            action={<ChevronRight className="h-5 w-5 text-slate-300" />}
          />
          <SettingItem
            icon={<Key className="h-5 w-5" />}
            iconBg="bg-[#fff9e6]"
            iconColor="text-[#d4b106]"
            title="Two-factor authentication"
            subtitle="Add an extra layer of security when signing in"
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
            subtitle="Switch between light and dark themes"
            action={<ToggleSwitch active={toggles.darkMode} onChange={toggleDarkMode} />}
          />
          <SettingItem
            icon={<Globe className="h-5 w-5" />}
            iconBg="bg-[#fff9e6]"
            iconColor="text-[#d4b106]"
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

        {/* Help Centre / Support */}
        <SettingsCard title="Help Centre">
          <SettingItem
            icon={<HelpCircle className="h-5 w-5" />}
            iconBg="bg-[#eff2fe]"
            iconColor="text-[#2f54eb]"
            title="Help center"
            subtitle="Browse candidate guides, FAQs, and application tips"
            action={<ChevronRight className="h-5 w-5 text-slate-300" />}
          />
          <SettingItem
            icon={<HeadphonesIcon className="h-5 w-5" />}
            iconBg="bg-[#fff9e6]"
            iconColor="text-[#d4b106]"
            title="Contact support"
            subtitle="Reach out to our 24/7 dedicated candidate support team"
            action={<ChevronRight className="h-5 w-5 text-slate-300" />}
          />
          <SettingItem
            icon={<Shield className="h-5 w-5" />}
            iconBg="bg-[#faebf6]"
            iconColor="text-[#c41d7f]"
            title="Privacy policy"
            subtitle="Read how we safeguard and protect your personal data"
            action={<ChevronRight className="h-5 w-5 text-slate-300" />}
            borderBottom={false}
          />
        </SettingsCard>

        {/* Logout */}
        <div 
          onClick={handleLogout}
          className="mt-10 rounded-xl border border-red-100 bg-white dark:bg-[#1a1a1a] hover:bg-red-50/50 transition cursor-pointer dark:border-red-900/30 dark:hover:bg-red-950/20"
        >
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/30">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-red-500">Logout</h4>
                <p className="mt-0.5 text-[12px] text-slate-400">Sign out of your Voctrum account</p>
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
