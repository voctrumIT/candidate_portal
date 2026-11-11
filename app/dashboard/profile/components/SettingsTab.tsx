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

const supportedLanguages = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "nl", name: "Dutch", native: "Nederlands" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

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
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred_language");
      if (saved) {
        setCurrentLang(saved);
        return;
      }
      const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
      if (match && match[1]) {
        setCurrentLang(match[1]);
      }
    }
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

  const handleLanguageChange = (newLang: string) => {
    setCurrentLang(newLang);
    if (typeof window === "undefined") return;

    localStorage.setItem("preferred_language", newLang);

    // Set Google Translate cookie
    const cookieValue = `/en/${newLang}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
    if (window.location.hostname.includes(".")) {
      const rootDomain = window.location.hostname.split(".").slice(-2).join(".");
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${rootDomain};`;
    }

    // Trigger Google Translate combo element if available
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      combo.value = newLang;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      window.location.reload();
    }

    const langObj = supportedLanguages.find((l) => l.code === newLang);
    toast.success(
      "Language Updated",
      `Google Translation active: ${langObj?.name || newLang} (${langObj?.native || ""}).`
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
          title="Google Translation & Language"
          subtitle="Translate all portal pages instantly using Google Translate"
          action={
            <div className="relative">
              <select
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="h-9 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] pl-4 pr-10 text-[13px] font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-[#2f54eb]"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} - {lang.native}
                  </option>
                ))}
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
          title="Help & FAQ"
          subtitle="Find answers to common questions and guides"
          action={<ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
        />
        <SettingItem
          icon={<HeadphonesIcon className="h-5 w-5" />}
          iconBg="bg-[#e6fbf9]"
          iconColor="text-[#0fa596]"
          title="Contact support"
          subtitle="Need assistance? Our support team is ready to help"
          action={<ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
        />
        <SettingItem
          icon={<Shield className="h-5 w-5" />}
          iconBg="bg-[#f3e8ff]"
          iconColor="text-[#9333ea]"
          title="Privacy policy"
          subtitle="Read how we handle your personal data and privacy"
          action={<ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />}
          borderBottom={false}
        />
      </SettingsCard>
    </div>
  );
}
