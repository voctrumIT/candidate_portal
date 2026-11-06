"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Check,
  Sparkles,
  Layout,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Code2,
  Palette,
  FileText,
  SlidersHorizontal,
} from "lucide-react";

export type TemplateId =
  | "modern"
  | "sidebar"
  | "executive"
  | "minimal"
  | "tech"
  | "compact"
  | "berlin"
  | "swiss"
  | "tokyo"
  | "corporate";

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  tag: string;
  tagColor: string;
  category: "trending" | "ats" | "executive" | "tech" | "creative";
  categoryLabel: string;
  description: string;
  bestFor: string;
  layoutStyle: "Single Column" | "Two-Column Sidebar" | "Split Grid" | "Dense Single-Page";
  atsScoreRating: "100%" | "99%" | "98%" | "97%";
  iconBg: string;
  accentPreview: string;
}

export const RESUME_TEMPLATES: TemplateInfo[] = [
  {
    id: "modern",
    name: "Silicon Valley Modern",
    tag: "Trending 2026",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    category: "trending",
    categoryLabel: "Trending & High-Growth",
    description: "Sleek accent border, modern typography, pill badges, and structured metric highlights.",
    bestFor: "Product Managers, Growth Leaders & Tech Startups",
    layoutStyle: "Single Column",
    atsScoreRating: "99%",
    iconBg: "from-blue-600 to-indigo-600",
    accentPreview: "#2563eb",
  },
  {
    id: "sidebar",
    name: "London Two-Column",
    tag: "Most Popular",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    category: "trending",
    categoryLabel: "Executive & Visual",
    description: "Executive left accent sidebar with timeline and focal contact block for instant visual distinction.",
    bestFor: "Senior Professionals, Consultants & Agency Leads",
    layoutStyle: "Two-Column Sidebar",
    atsScoreRating: "97%",
    iconBg: "from-purple-600 to-pink-600",
    accentPreview: "#7c3aed",
  },
  {
    id: "minimal",
    name: "Nordic Minimalist",
    tag: "Top ATS Rating",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    category: "ats",
    categoryLabel: "ATS Certified",
    description: "Generous whitespace, hyper-readable hierarchy, zero parsing friction for enterprise ATS systems.",
    bestFor: "Corporate Applications, Fortune 500 & Government",
    layoutStyle: "Single Column",
    atsScoreRating: "100%",
    iconBg: "from-emerald-600 to-teal-700",
    accentPreview: "#059669",
  },
  {
    id: "executive",
    name: "Harvard Classic",
    tag: "Ivy League",
    tagColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    category: "executive",
    categoryLabel: "Executive Suite",
    description: "Centered traditional serif layout with formal rules. High credibility and prestige.",
    bestFor: "Banking, Private Equity, Consulting & Academia",
    layoutStyle: "Single Column",
    atsScoreRating: "99%",
    iconBg: "from-slate-800 to-slate-950",
    accentPreview: "#1e3a8a",
  },
  {
    id: "corporate",
    name: "Wall Street Executive",
    tag: "Finance & Legal",
    tagColor: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700",
    category: "executive",
    categoryLabel: "Executive Suite",
    description: "Authoritative double-rule headers, balanced margins, and distinguished corporate typography.",
    bestFor: "C-Suite, Legal Counsel, Finance Directors & VPs",
    layoutStyle: "Single Column",
    atsScoreRating: "100%",
    iconBg: "from-slate-900 to-blue-950",
    accentPreview: "#0f172a",
  },
  {
    id: "tech",
    name: "Tech & Engineering",
    tag: "Developer Favorite",
    tagColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    category: "tech",
    categoryLabel: "Engineering & Dev",
    description: "Optimized for software engineers with tech stack badges, repository URLs, and system impact metrics.",
    bestFor: "Full-Stack Devs, Cloud Architects & DevOps",
    layoutStyle: "Single Column",
    atsScoreRating: "99%",
    iconBg: "from-cyan-600 to-blue-700",
    accentPreview: "#0891b2",
  },
  {
    id: "berlin",
    name: "Berlin Metro Split",
    tag: "Modern European",
    tagColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    category: "trending",
    categoryLabel: "Modern & Scaleup",
    description: "High-contrast header block with split-grid highlights and crisp badge typography.",
    bestFor: "Scaleups, Tech Startups & Modern Enterprises",
    layoutStyle: "Split Grid",
    atsScoreRating: "98%",
    iconBg: "from-indigo-600 to-blue-800",
    accentPreview: "#4f46e5",
  },
  {
    id: "swiss",
    name: "Swiss Modern Grid",
    tag: "Editorial & Design",
    tagColor: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    category: "creative",
    categoryLabel: "Creative & Design",
    description: "Asymmetrical editorial layout inspired by Swiss international typographic style. Sharp and memorable.",
    bestFor: "UI/UX Designers, Creative Directors & Marketers",
    layoutStyle: "Split Grid",
    atsScoreRating: "98%",
    iconBg: "from-rose-600 to-red-700",
    accentPreview: "#e11d48",
  },
  {
    id: "tokyo",
    name: "Tokyo Clean Slate",
    tag: "Zen Minimalism",
    tagColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    category: "creative",
    categoryLabel: "Minimalist & Clean",
    description: "Architectural precision with delicate micro-dividers and balanced card containers for optimal clarity.",
    bestFor: "Architects, Project Managers & Analysts",
    layoutStyle: "Split Grid",
    atsScoreRating: "99%",
    iconBg: "from-teal-600 to-emerald-700",
    accentPreview: "#0d9488",
  },
  {
    id: "compact",
    name: "Compact One-Pager",
    tag: "Dense Layout",
    tagColor: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    category: "ats",
    categoryLabel: "Dense Single-Page",
    description: "Engineered to fit 5+ years of extensive experience cleanly into an unclipped single page.",
    bestFor: "Experienced Professionals needing a 1-page resume",
    layoutStyle: "Dense Single-Page",
    atsScoreRating: "100%",
    iconBg: "from-orange-600 to-amber-700",
    accentPreview: "#d97706",
  },
];

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  accentColor: string;
}

export default function TemplateGalleryModal({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate,
  accentColor,
}: TemplateGalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Templates", count: RESUME_TEMPLATES.length, icon: Layout },
    { id: "trending", label: "Trending 2026", count: 3, icon: Sparkles },
    { id: "ats", label: "Top ATS Score", count: 2, icon: ShieldCheck },
    { id: "executive", label: "Executive & Corporate", count: 2, icon: Briefcase },
    { id: "tech", label: "Tech & Engineering", count: 1, icon: Code2 },
    { id: "creative", label: "Creative & Design", count: 2, icon: Palette },
  ];

  const filteredTemplates = useMemo(() => {
    return RESUME_TEMPLATES.filter((t) => {
      const matchesCategory =
        selectedCategory === "all" || t.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleApply = (templateId: TemplateId, name: string) => {
    onSelectTemplate(templateId);
    setAppliedNotification(name);
    setTimeout(() => {
      setAppliedNotification(null);
      onClose();
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-3 md:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0e121d] border border-slate-200 dark:border-slate-800 transition-all">
        {/* Top Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-[#131722] z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Layout className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Resume Template Showcase
                </h2>
                <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                  {RESUME_TEMPLATES.length} Modern Layouts
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a professional template tailored to your industry. Click any template to apply it immediately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {appliedNotification && (
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                Applied &quot;{appliedNotification}&quot;!
              </div>
            )}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-6 py-3 dark:border-slate-800 dark:bg-[#111420]">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates or roles..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {filteredTemplates.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center dark:border-slate-700">
              <FileText className="h-10 w-10 text-slate-400" />
              <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                No templates found
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try searching for something else or reset your filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-3 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((t) => {
                const isSelected = currentTemplate === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => handleApply(t.id, t.name)}
                    className={`group relative flex flex-col justify-between cursor-pointer rounded-2xl border bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-[#121622] ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-600/30 shadow-lg dark:border-blue-500"
                        : "border-slate-200 hover:border-blue-400 dark:border-slate-800 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Miniature Wireframe Visual Representation */}
                    <div className="relative mb-3.5 h-44 w-full overflow-hidden rounded-xl bg-slate-100 p-3 transition-colors group-hover:bg-blue-50/40 dark:bg-slate-900/90 dark:group-hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800">
                      {/* Active Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                          <Check className="h-3 w-3 stroke-[3]" /> Selected
                        </div>
                      )}

                      {/* Mini Preview Mockup depending on template style */}
                      {renderMiniMockup(t.id, accentColor || t.accentPreview)}

                      {/* Hover Overlay with "Apply Template" CTA */}
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-900/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition transform group-hover:scale-105">
                          {isSelected ? (
                            <>
                              <Check className="h-4 w-4" /> Current Active
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" /> Apply Template
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div>
                      {/* Tags Row */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${t.tagColor}`}
                        >
                          {t.tag}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          <span>ATS {t.atsScoreRating}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mt-2 text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {t.name}
                      </h3>

                      {/* Description */}
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>

                      {/* Best For Industry pill */}
                      <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          Ideal For:
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {t.bestFor}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">
                        Layout: <strong className="text-slate-700 dark:text-slate-300">{t.layoutStyle}</strong>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(t.id, t.name);
                        }}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-2xs"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Active
                          </>
                        ) : (
                          <>
                            Apply <ArrowRight className="h-3 w-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <footer className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-[#131722]">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span>All templates are standard A4 format and optimized for automated ATS parsers.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            Close Showcase
          </button>
        </footer>
      </div>
    </div>
  );
}

// Helper to render miniature architectural mockup previews
function renderMiniMockup(templateId: TemplateId, accentColor: string) {
  switch (templateId) {
    case "modern":
      return (
        <div className="h-full w-full rounded bg-white p-2.5 shadow-2xs flex flex-col justify-between">
          <div className="border-l-2 pl-2" style={{ borderColor: accentColor }}>
            <div className="h-2.5 w-24 rounded-xs bg-slate-800" />
            <div className="mt-1 h-1.5 w-16 rounded-xs" style={{ backgroundColor: accentColor }} />
            <div className="mt-1 h-1 w-32 rounded-xs bg-slate-300" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-1.5 w-14 rounded-xs bg-slate-400" />
            <div className="h-1 w-full rounded-xs bg-slate-200" />
            <div className="h-1 w-4/5 rounded-xs bg-slate-200" />
          </div>
          <div className="space-y-1 border-t border-slate-100 pt-1.5">
            <div className="h-1.5 w-20 rounded-xs" style={{ backgroundColor: accentColor }} />
            <div className="flex justify-between">
              <div className="h-1 w-24 rounded-xs bg-slate-700" />
              <div className="h-1 w-10 rounded-xs bg-slate-300" />
            </div>
            <div className="h-1 w-full rounded-xs bg-slate-200" />
          </div>
          <div className="flex gap-1 pt-1">
            <span className="h-2 w-8 rounded-full bg-slate-200" />
            <span className="h-2 w-8 rounded-full bg-slate-200" />
            <span className="h-2 w-8 rounded-full bg-slate-200" />
          </div>
        </div>
      );

    case "sidebar":
      return (
        <div className="grid h-full w-full grid-cols-12 rounded bg-white overflow-hidden shadow-2xs">
          <div className="col-span-4 p-2 text-white flex flex-col justify-between" style={{ backgroundColor: accentColor }}>
            <div className="space-y-1">
              <div className="h-5 w-5 rounded-md bg-white/30" />
              <div className="h-2 w-12 rounded-xs bg-white" />
              <div className="h-1 w-10 rounded-xs bg-white/70" />
            </div>
            <div className="space-y-1">
              <div className="h-1 w-12 rounded-xs bg-white/60" />
              <div className="h-1 w-14 rounded-xs bg-white/40" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-6 rounded-full bg-white/30" />
              <div className="h-1.5 w-8 rounded-full bg-white/30" />
            </div>
          </div>
          <div className="col-span-8 p-2.5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="h-1.5 w-16 rounded-xs" style={{ backgroundColor: accentColor }} />
              <div className="h-1 w-full rounded-xs bg-slate-200" />
              <div className="h-1 w-3/4 rounded-xs bg-slate-200" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-14 rounded-xs" style={{ backgroundColor: accentColor }} />
              <div className="h-1 w-28 rounded-xs bg-slate-700" />
              <div className="h-1 w-full rounded-xs bg-slate-200" />
              <div className="h-1 w-4/5 rounded-xs bg-slate-200" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-12 rounded-xs bg-slate-400" />
              <div className="h-1 w-20 rounded-xs bg-slate-600" />
            </div>
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className="h-full w-full rounded bg-white p-3 shadow-2xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="h-3 w-28 rounded-xs bg-slate-900" />
            <div className="h-1.5 w-20 rounded-xs" style={{ color: accentColor }}>
              <div className="h-full w-full rounded-xs" style={{ backgroundColor: accentColor }} />
            </div>
            <div className="h-1 w-36 rounded-xs bg-slate-300" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-16 rounded-xs uppercase tracking-wider bg-slate-300" />
            <div className="h-1 w-full rounded-xs bg-slate-200" />
            <div className="h-1 w-full rounded-xs bg-slate-200" />
            <div className="h-1 w-2/3 rounded-xs bg-slate-200" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-14 rounded-xs uppercase bg-slate-300" />
            <div className="flex justify-between">
              <div className="h-1 w-24 rounded-xs bg-slate-800" />
              <div className="h-1 w-12 rounded-xs bg-slate-300" />
            </div>
            <div className="h-1 w-full rounded-xs bg-slate-200" />
          </div>
        </div>
      );

    case "executive":
      return (
        <div className="h-full w-full rounded bg-white p-2.5 shadow-2xs flex flex-col justify-between text-center">
          <div className="border-b-2 border-slate-900 pb-1.5 space-y-1">
            <div className="mx-auto h-2.5 w-28 rounded-xs bg-slate-900" />
            <div className="mx-auto h-1.5 w-16 rounded-xs" style={{ backgroundColor: accentColor }} />
            <div className="mx-auto h-1 w-36 rounded-xs bg-slate-400" />
          </div>
          <div className="space-y-1 text-left pt-1">
            <div className="mx-auto h-1.5 w-20 rounded-xs bg-slate-800" />
            <div className="h-1 w-full rounded-xs bg-slate-200" />
            <div className="h-1 w-full rounded-xs bg-slate-200" />
          </div>
          <div className="space-y-1 text-left border-t border-slate-200 pt-1">
            <div className="mx-auto h-1.5 w-16 rounded-xs bg-slate-800" />
            <div className="flex justify-between">
              <div className="h-1 w-24 rounded-xs bg-slate-700" />
              <div className="h-1 w-12 rounded-xs bg-slate-400" />
            </div>
            <div className="h-1 w-full rounded-xs bg-slate-200" />
          </div>
        </div>
      );

    case "corporate":
      return (
        <div className="h-full w-full rounded bg-white p-2.5 shadow-2xs flex flex-col justify-between">
          <div className="border-b-2 border-double border-slate-900 pb-1.5 flex justify-between items-center">
            <div>
              <div className="h-3 w-28 rounded-xs bg-slate-950 font-serif" />
              <div className="mt-1 h-1.5 w-16 rounded-xs" style={{ backgroundColor: accentColor }} />
            </div>
            <div className="space-y-0.5 text-right">
              <div className="h-1 w-16 rounded-xs bg-slate-400" />
              <div className="h-1 w-14 rounded-xs bg-slate-400" />
            </div>
          </div>
          <div className="space-y-1 pt-1">
            <div className="h-1.5 w-20 border-b border-slate-800 pb-0.5" style={{ color: accentColor }}>
              <div className="h-full w-full" style={{ backgroundColor: accentColor }} />
            </div>
            <div className="h-1 w-full rounded-xs bg-slate-200" />
            <div className="h-1 w-4/5 rounded-xs bg-slate-200" />
          </div>
          <div className="space-y-1 pt-1">
            <div className="h-1.5 w-24 border-b border-slate-800 pb-0.5" style={{ color: accentColor }}>
              <div className="h-full w-full" style={{ backgroundColor: accentColor }} />
            </div>
            <div className="flex justify-between">
              <div className="h-1 w-28 rounded-xs bg-slate-800" />
              <div className="h-1 w-12 rounded-xs bg-slate-400" />
            </div>
            <div className="h-1 w-full rounded-xs bg-slate-200" />
          </div>
        </div>
      );

    case "tech":
      return (
        <div className="h-full w-full rounded bg-slate-950 p-2 text-cyan-400 shadow-2xs flex flex-col justify-between font-mono">
          <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <div>
              <div className="h-2.5 w-24 rounded-xs bg-white" />
              <div className="mt-0.5 h-1.5 w-16 rounded-xs" style={{ backgroundColor: accentColor }} />
            </div>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-1 w-20 rounded-xs" style={{ backgroundColor: accentColor }} />
            <div className="h-1 w-full rounded-xs bg-slate-800" />
            <div className="h-1 w-3/4 rounded-xs bg-slate-800" />
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            <span className="h-2 w-7 rounded-xs bg-slate-800 border border-cyan-800" />
            <span className="h-2 w-8 rounded-xs bg-slate-800 border border-cyan-800" />
            <span className="h-2 w-6 rounded-xs bg-slate-800 border border-cyan-800" />
          </div>
          <div className="border-t border-slate-800 pt-1 space-y-0.5">
            <div className="h-1 w-24 rounded-xs bg-slate-600" />
            <div className="h-1 w-full rounded-xs bg-slate-800" />
          </div>
        </div>
      );

    case "berlin":
      return (
        <div className="h-full w-full rounded bg-white p-2.5 shadow-2xs flex flex-col justify-between">
          <div className="rounded-lg p-2 text-white flex justify-between items-center" style={{ backgroundColor: accentColor }}>
            <div>
              <div className="h-2.5 w-20 rounded-xs bg-white" />
              <div className="mt-1 h-1 w-14 rounded-xs bg-white/70" />
            </div>
            <div className="h-4 w-4 rounded-full bg-white/20" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="space-y-1">
              <div className="h-1.5 w-14 rounded-xs bg-slate-800" />
              <div className="h-1 w-full rounded-xs bg-slate-200" />
              <div className="h-1 w-3/4 rounded-xs bg-slate-200" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: accentColor }} />
              <div className="h-1 w-full rounded-xs bg-slate-200" />
              <div className="h-1 w-2/3 rounded-xs bg-slate-200" />
            </div>
          </div>
          <div className="space-y-1 border-t border-slate-100 pt-1">
            <div className="h-1.5 w-16 rounded-xs bg-slate-800" />
            <div className="h-1 w-full rounded-xs bg-slate-200" />
          </div>
        </div>
      );

    case "swiss":
      return (
        <div className="h-full w-full rounded bg-white p-2.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-baseline justify-between border-b border-black pb-1.5">
            <div className="h-3 w-28 rounded-xs bg-black" />
            <div className="h-1.5 w-12 rounded-xs" style={{ backgroundColor: accentColor }} />
          </div>
          <div className="grid grid-cols-12 gap-2 py-1">
            <div className="col-span-4 border-r border-slate-200 pr-1 space-y-1">
              <div className="h-1.5 w-8 rounded-xs" style={{ backgroundColor: accentColor }} />
              <div className="h-1 w-full rounded-xs bg-slate-300" />
              <div className="h-1 w-4/5 rounded-xs bg-slate-300" />
            </div>
            <div className="col-span-8 space-y-1">
              <div className="h-1.5 w-14 rounded-xs bg-black" />
              <div className="h-1 w-full rounded-xs bg-slate-200" />
              <div className="h-1 w-4/5 rounded-xs bg-slate-200" />
              <div className="h-1 w-3/4 rounded-xs bg-slate-200" />
            </div>
          </div>
          <div className="flex gap-1 pt-1 border-t border-slate-100">
            <span className="h-1.5 w-8 rounded-xs bg-black" />
            <span className="h-1.5 w-8 rounded-xs bg-slate-300" />
          </div>
        </div>
      );

    case "tokyo":
      return (
        <div className="h-full w-full rounded bg-white p-2.5 shadow-2xs flex flex-col justify-between border border-slate-200">
          <div className="flex justify-between items-center pb-1 border-b border-slate-100">
            <div>
              <div className="h-2.5 w-24 rounded-xs bg-slate-800" />
              <div className="mt-0.5 h-1 w-16 rounded-xs" style={{ color: accentColor }}>
                <div className="h-full w-full" style={{ backgroundColor: accentColor }} />
              </div>
            </div>
            <div className="h-1 w-12 rounded-xs bg-slate-300" />
          </div>
          <div className="space-y-1.5 py-1">
            <div className="h-1 w-full rounded-xs bg-slate-100" />
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded border border-slate-100 p-1 space-y-0.5">
                <div className="h-1 w-12 rounded-xs bg-slate-600" />
                <div className="h-1 w-full rounded-xs bg-slate-200" />
              </div>
              <div className="rounded border border-slate-100 p-1 space-y-0.5">
                <div className="h-1 w-12 rounded-xs" style={{ backgroundColor: accentColor }} />
                <div className="h-1 w-full rounded-xs bg-slate-200" />
              </div>
            </div>
          </div>
          <div className="flex gap-1 pt-0.5">
            <span className="h-1.5 w-6 rounded-full bg-slate-200" />
            <span className="h-1.5 w-6 rounded-full bg-slate-200" />
          </div>
        </div>
      );

    case "compact":
    default:
      return (
        <div className="h-full w-full rounded bg-white p-2 shadow-2xs flex flex-col justify-between text-[8px]">
          <div className="flex justify-between items-center border-b border-slate-300 pb-1">
            <div>
              <div className="h-2.5 w-20 rounded-xs bg-slate-950" />
              <div className="mt-0.5 h-1 w-12 rounded-xs" style={{ backgroundColor: accentColor }} />
            </div>
            <div className="h-1 w-16 rounded-xs bg-slate-400" />
          </div>
          <div className="space-y-0.5 py-0.5">
            <div className="h-1 w-12 rounded-xs" style={{ backgroundColor: accentColor }} />
            <div className="h-0.5 w-full bg-slate-200" />
            <div className="h-0.5 w-full bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="space-y-0.5">
              <div className="h-1 w-10 rounded-xs" style={{ backgroundColor: accentColor }} />
              <div className="h-0.5 w-full bg-slate-200" />
            </div>
            <div className="space-y-0.5">
              <div className="h-1 w-10 rounded-xs" style={{ backgroundColor: accentColor }} />
              <div className="h-0.5 w-full bg-slate-200" />
            </div>
          </div>
          <div className="h-0.5 w-full bg-slate-200" />
        </div>
      );
  }
}
