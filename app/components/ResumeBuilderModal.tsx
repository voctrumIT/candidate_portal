"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profile";
import {
  X,
  Download,
  Sparkles,
  Plus,
  Trash2,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  CheckCircle2,
  Eye,
  Save,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  Type,
  Languages,
  Maximize2,
  Minimize2,
  Layout,
  Info,
  HelpCircle,
  Lock,
  LogIn,
  Loader2,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { documentsService } from "../../services/documents";
import TemplateGalleryModal, {
  RESUME_TEMPLATES,
  TemplateId,
  TemplateInfo,
} from "./TemplateGalleryModal";

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  score: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  link: string;
  description: string;
  techStack?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Conversational";
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
}

const colorThemes = [
  { name: "Executive Navy", value: "#1e3a8a" },
  { name: "Royal Blue", value: "#2563eb" },
  { name: "Emerald Pro", value: "#059669" },
  { name: "Charcoal Dark", value: "#0f172a" },
  { name: "Deep Violet", value: "#7c3aed" },
  { name: "Ruby Crimson", value: "#b91c1c" },
  { name: "Teal Modern", value: "#0d9488" },
  { name: "Burnt Amber", value: "#d97706" },
];

const fontFamilies = [
  { name: "Inter (Sans)", value: "font-sans" },
  { name: "Merriweather (Serif)", value: "font-serif" },
  { name: "JetBrains (Mono)", value: "font-mono" },
];

const actionVerbs = [
  "Spearheaded",
  "Architected",
  "Engineered",
  "Accelerated",
  "Optimized",
  "Delivered",
  "Implemented",
  "Automated",
  "Mentored",
  "Streamlined",
  "Pioneered",
  "Restructured",
];

const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

interface ResumeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavedResume?: () => void;
}

export default function ResumeBuilderModal({
  isOpen,
  onClose,
  onSavedResume,
}: ResumeBuilderModalProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSyncingProfile, setIsSyncingProfile] = useState(false);
  const [profileAutoFilled, setProfileAutoFilled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("candidate_token");
      setToken(storedToken);
      setIsCheckingAuth(false);
    }
  }, [isOpen]);

  const isLoggedIn = Boolean(token || user);

  const [resume, setResume] = useState<ResumeData>(emptyResumeData);
  const [activeTab, setActiveTab] = useState<
    | "personal"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "languages"
  >("personal");

  const [template, setTemplate] = useState<TemplateId>("modern");
  const [accentColor, setAccentColor] = useState<string>("#1e3a8a");
  const [fontFamily, setFontFamily] = useState<string>("font-sans");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [showAtsBreakdown, setShowAtsBreakdown] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const [newSkillInput, setNewSkillInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<"split" | "edit" | "preview">("split");
  const [zoomScale, setZoomScale] = useState(0.95);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  // Auto-clear status feedback banner after 5 seconds
  useEffect(() => {
    if (statusFeedback) {
      const timer = setTimeout(() => setStatusFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusFeedback]);

  // Reusable function to fetch & populate data from candidate profile
  const handleFetchFromProfile = async (forceOverwrite: boolean = true) => {
    if (!isLoggedIn) {
      setStatusFeedback({
        type: "error",
        message: "Please sign in to fetch your profile details.",
      });
      return;
    }

    setIsSyncingProfile(true);
    try {
      const res = await profileService.getProfile();
      const payload = res?.payload || res;

      const profileFullName =
        payload?.name ||
        (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "") ||
        "";
      const profileEmail = payload?.email || user?.email || "";
      const profilePhone =
        payload?.contactNumber || payload?.mobile || user?.mobile || "";
      const profileLocation =
        payload?.city ||
        payload?.address?.city ||
        user?.currentLocation ||
        user?.preferredWorkLocation ||
        "";
      const profileJobTitle =
        payload?.designation ||
        payload?.headline ||
        payload?.role ||
        payload?.title ||
        user?.jobTitle ||
        "";
      const profileSummary =
        payload?.about || payload?.summary || payload?.bio || user?.about || "";
      const profileWebsite = payload?.website || user?.website || "";
      const profileLinkedin = payload?.linkedin || user?.linkedin || "";
      const profileGithub = payload?.github || user?.github || "";

      // Skills extraction
      let extractedSkills: string[] = [];
      if (Array.isArray(payload?.skills) && payload.skills.length > 0) {
        extractedSkills = payload.skills
          .map((s: any) => (typeof s === "string" ? s : s.name || s.title || ""))
          .filter(Boolean);
      } else if (Array.isArray(user?.skills) && user.skills.length > 0) {
        extractedSkills = user.skills.filter(Boolean);
      }

      // Work Experience extraction
      let extractedExp: ExperienceItem[] = [];
      const rawExp =
        payload?.workExperiences ||
        payload?.experiences ||
        payload?.experience ||
        user?.workExperiences;
      if (Array.isArray(rawExp) && rawExp.length > 0) {
        extractedExp = rawExp.map((e: any, idx: number) => ({
          id: `exp-${Date.now()}-${idx}`,
          title: e.title || e.designation || e.role || "Software Engineer",
          company: e.company || e.organisation || e.name || "Company",
          location: e.location || e.city || "",
          startDate: e.startDate || e.duration?.split("-")?.[0]?.trim() || "",
          endDate: e.endDate || e.duration?.split("-")?.[1]?.trim() || "Present",
          current: Boolean(e.current || e.isCurrent),
          description: e.description || e.responsibilities || "",
        }));
      }

      // Education extraction
      let extractedEdu: EducationItem[] = [];
      const rawEdu =
        payload?.educations || payload?.education || user?.education;
      if (Array.isArray(rawEdu) && rawEdu.length > 0) {
        extractedEdu = rawEdu.map((ed: any, idx: number) => ({
          id: `edu-${Date.now()}-${idx}`,
          degree: ed.degree || ed.qualification || "Degree",
          institution: ed.institution || ed.school || ed.college || "University",
          location: ed.location || ed.city || "",
          startDate: ed.startDate || ed.duration?.split("-")?.[0]?.trim() || "",
          endDate: ed.endDate || ed.duration?.split("-")?.[1]?.trim() || "",
          score: ed.score || ed.grade || ed.gpa || "",
        }));
      }

      // Certifications extraction
      let extractedCerts: CertificationItem[] = [];
      const rawCerts = payload?.certifications || payload?.certificates || user?.certifications;
      if (Array.isArray(rawCerts) && rawCerts.length > 0) {
        extractedCerts = rawCerts.map((c: any, idx: number) => ({
          id: `cert-${Date.now()}-${idx}`,
          name: c.name || c.title || "",
          issuer: c.issuer || c.organization || "",
          date: c.date || c.year || "",
        }));
      }

      // Languages extraction
      let extractedLangs: LanguageItem[] = [];
      const rawLangs = payload?.languages || user?.languages;
      if (Array.isArray(rawLangs) && rawLangs.length > 0) {
        extractedLangs = rawLangs.map((l: any, idx: number) => ({
          id: `lang-${Date.now()}-${idx}`,
          name: typeof l === "string" ? l : l.name || l.language || "",
          proficiency: (typeof l === "string" ? "Fluent" : l.proficiency || l.level || "Fluent") as any,
        }));
      }

      setResume((prev) => {
        if (forceOverwrite) {
          return {
            ...prev,
            personalInfo: {
              fullName: profileFullName || prev.personalInfo.fullName,
              jobTitle: profileJobTitle || prev.personalInfo.jobTitle,
              email: profileEmail || prev.personalInfo.email,
              phone: profilePhone || prev.personalInfo.phone,
              location: profileLocation || prev.personalInfo.location,
              website: profileWebsite || prev.personalInfo.website,
              linkedin: profileLinkedin || prev.personalInfo.linkedin,
              github: profileGithub || prev.personalInfo.github,
            },
            summary: profileSummary || prev.summary,
            skills: extractedSkills.length > 0 ? extractedSkills : prev.skills,
            experience: extractedExp.length > 0 ? extractedExp : prev.experience,
            education: extractedEdu.length > 0 ? extractedEdu : prev.education,
            certifications: extractedCerts.length > 0 ? extractedCerts : prev.certifications,
            languages: extractedLangs.length > 0 ? extractedLangs : prev.languages,
          };
        } else {
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              fullName: prev.personalInfo.fullName || profileFullName,
              jobTitle: prev.personalInfo.jobTitle || profileJobTitle,
              email: prev.personalInfo.email || profileEmail,
              phone: prev.personalInfo.phone || profilePhone,
              location: prev.personalInfo.location || profileLocation,
              website: prev.personalInfo.website || profileWebsite,
              linkedin: prev.personalInfo.linkedin || profileLinkedin,
              github: prev.personalInfo.github || profileGithub,
            },
            summary: prev.summary || profileSummary,
            skills: prev.skills.length > 0 ? prev.skills : extractedSkills,
            experience: prev.experience.length > 0 ? prev.experience : extractedExp,
            education: prev.education.length > 0 ? prev.education : extractedEdu,
            certifications: prev.certifications.length > 0 ? prev.certifications : extractedCerts,
            languages: prev.languages.length > 0 ? prev.languages : extractedLangs,
          };
        }
      });

      setProfileAutoFilled(true);
      if (forceOverwrite) {
        setStatusFeedback({
          type: "success",
          message: "Candidate profile details fetched successfully! All sections are completely editable.",
        });
      }
    } catch (err) {
      console.log("Profile auto-fill loaded fallback from auth context", err);
      if (user) {
        const profileFullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        setResume((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            fullName: (forceOverwrite ? profileFullName : prev.personalInfo.fullName) || profileFullName,
            email: (forceOverwrite ? user.email : prev.personalInfo.email) || user.email || "",
            phone: (forceOverwrite ? user.mobile : prev.personalInfo.phone) || user.mobile || "",
            location:
              (forceOverwrite
                ? user.currentLocation || user.preferredWorkLocation
                : prev.personalInfo.location) ||
              user.currentLocation ||
              user.preferredWorkLocation ||
              "",
          },
        }));
        setProfileAutoFilled(true);
        if (forceOverwrite) {
          setStatusFeedback({
            type: "success",
            message: "Profile details loaded from current account session.",
          });
        }
      } else {
        if (forceOverwrite) {
          setStatusFeedback({
            type: "error",
            message: "Could not fetch profile. Please check your connection and login status.",
          });
        }
      }
    } finally {
      setIsSyncingProfile(false);
    }
  };

  // Auto-fetch on open for logged in user (non-destructive)
  useEffect(() => {
    if (!isOpen || !isLoggedIn) return;
    handleFetchFromProfile(false);
  }, [isOpen, isLoggedIn]);

  // Reset resume to start from scratch
  const handleResetResume = () => {
    setResume(JSON.parse(JSON.stringify(emptyResumeData)));
    setProfileAutoFilled(false);
    setShowResetConfirmModal(false);
    setActiveTab("personal");
    setStatusFeedback({
      type: "info",
      message: "Resume reset to blank. You are now starting from scratch with a blank canvas.",
    });
  };

  // Real-Time ATS Score Calculations and Checklist
  const atsBreakdown = useMemo(() => {
    return [
      {
        label: "Candidate Full Name & Headline",
        passed: Boolean(resume.personalInfo.fullName.trim() && resume.personalInfo.jobTitle.trim()),
        points: 20,
      },
      {
        label: "Contact Email & Phone Number",
        passed: Boolean(resume.personalInfo.email.trim() && resume.personalInfo.phone.trim()),
        points: 15,
      },
      {
        label: "Location Details (City, State)",
        passed: Boolean(resume.personalInfo.location.trim()),
        points: 5,
      },
      {
        label: "Professional Summary (> 60 characters)",
        passed: resume.summary.trim().length > 60,
        points: 15,
      },
      {
        label: "At least 1 Work Experience Entry",
        passed: resume.experience.length >= 1,
        points: 15,
      },
      {
        label: "Detailed Experience with Bullet Points",
        passed: resume.experience.some((e) => e.description.includes("•") || e.description.length > 50),
        points: 5,
      },
      {
        label: "Education Details Listed",
        passed: resume.education.length >= 1,
        points: 10,
      },
      {
        label: "Core Competencies / Skills (5+ skills)",
        passed: resume.skills.length >= 5,
        points: 10,
      },
      {
        label: "Projects, Certifications, or Languages",
        passed: resume.projects.length >= 1 || resume.certifications.length >= 1,
        points: 5,
      },
    ];
  }, [resume]);

  const atsScore = useMemo(() => {
    return Math.min(
      100,
      atsBreakdown.reduce((acc, item) => (item.passed ? acc + item.points : acc), 0)
    );
  }, [atsBreakdown]);

  // Tab completion indicators
  const tabStatus = useMemo(() => {
    return {
      personal: Boolean(resume.personalInfo.fullName.trim() && resume.personalInfo.email.trim()),
      summary: resume.summary.trim().length > 30,
      experience: resume.experience.length > 0,
      education: resume.education.length > 0,
      skills: resume.skills.length >= 3,
      projects: resume.projects.length > 0,
      certifications: resume.certifications.length > 0,
      languages: resume.languages.length > 0,
    };
  }, [resume]);

  if (!isOpen) return null;

  // STRICT AUTH GUARD: Only logged-in candidates can access Resume Builder
  if (!isLoggedIn && !isCheckingAuth) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl dark:border-slate-800 dark:bg-[#121622] text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-xl shadow-blue-500/25">
            <Lock className="h-8 w-8" />
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <ShieldAlert className="h-3.5 w-3.5" /> Candidate Authentication Required
          </span>
          <h3 className="mt-3 text-xl font-black text-slate-900 dark:text-white">
            Register to Build Your Resume
          </h3>
          <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Only logged-in users can open the Resume Builder. Please sign in to your account to automatically load your candidate details, customize ATS-ready resumes, and save directly to your profile.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => {
                onClose();
                router.push("/register?redirect=/dashboard/resume-builder");
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              <LogIn className="h-4 w-4" /> Register to Continue
            </button>
            <button
              onClick={() => {
                onClose();
                router.push("/register");
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Don&apos;t have an account? Register Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handlers for Personal Info
  const handlePersonalChange = (field: keyof ResumeData["personalInfo"], value: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  // Handlers for Experience Reordering & Mutation
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setResume((prev) => ({ ...prev, experience: [newExp, ...prev.experience] }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const removeExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    const newExp = [...resume.experience];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newExp.length) return;
    const temp = newExp[index];
    newExp[index] = newExp[targetIndex];
    newExp[targetIndex] = temp;
    setResume((prev) => ({ ...prev, experience: newExp }));
  };

  // Handlers for Education
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      score: "",
    };
    setResume((prev) => ({ ...prev, education: [newEdu, ...prev.education] }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const removeEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  // Handlers for Skills
  const addSkill = (skillText: string) => {
    const trimmed = skillText.trim();
    if (trimmed && !resume.skills.includes(trimmed)) {
      setResume((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Handlers for Projects
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "",
      role: "",
      link: "",
      description: "",
      techStack: "",
    };
    setResume((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const removeProject = (id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Handlers for Certifications
  const addCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
    };
    setResume((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const updateCertification = (id: string, field: keyof CertificationItem, value: string) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  };

  const removeCertification = (id: string) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  // Handlers for Languages
  const addLanguage = () => {
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      name: "",
      proficiency: "Fluent",
    };
    setResume((prev) => ({ ...prev, languages: [...prev.languages, newLang] }));
  };

  const updateLanguage = (id: string, field: keyof LanguageItem, value: any) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    }));
  };

  const removeLanguage = (id: string) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
    }));
  };

  // AI Generator / Polisher
  const handleAiEnhanceSummary = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const title = resume.personalInfo.jobTitle || "Professional";
      const topSkills = resume.skills.slice(0, 3).join(", ") || "strategic problem solving";
      const enhanced = `High-performing ${title} with proven expertise in ${topSkills}. Track record of delivering scalable solutions, standardizing best practices, and collaborating effectively across teams to drive measurable business results.`;
      setResume((prev) => ({ ...prev, summary: enhanced }));
      setAiGenerating(false);
    }, 450);
  };

  // Print / Download High-Quality PDF
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resume.personalInfo.fullName || "Candidate"} - Resume</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4;
              margin: 8mm 12mm 12mm 12mm;
            }
            body {
              background: white;
              color: #111827;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @media print {
              .no-print { display: none !important; }
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body class="p-2 sm:p-4">
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Generate a valid high-quality PDF Blob from ATS Template with direct fallback
  const generateResumePdfBlob = async (resumeData: ResumeData, printElement: HTMLElement | null): Promise<Blob> => {
    if (typeof window === "undefined") {
      return new Blob([], { type: "application/pdf" });
    }

    // 1. Primary: Capture pixel-perfect rendered ATS template using html2canvas & jsPDF
    if (printElement) {
      try {
        const html2canvasModule = await import("html2canvas");
        const html2canvas = html2canvasModule.default || html2canvasModule;
        // @ts-ignore
        const jspdfModule = await import("jspdf/dist/jspdf.umd.min.js");
        const jsPDF = jspdfModule.jsPDF || jspdfModule.default?.jsPDF || jspdfModule.default;

        const canvas = await html2canvas(printElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          onclone: (clonedDoc: Document) => {
            const el = clonedDoc.getElementById("resume-printable-area");
            if (el) {
              el.style.transform = "none";
              el.style.boxShadow = "none";
              el.style.margin = "0";
              let parent = el.parentElement;
              while (parent) {
                parent.style.transform = "none";
                parent.style.overflow = "visible";
                parent = parent.parentElement;
              }
            }
          },
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 210; // A4 width mm
        const pageHeight = 297; // A4 height mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 5) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const blob = pdf.output("blob");
        if (blob && blob.size > 1000) {
          return blob;
        }
      } catch (err) {
        console.warn("Template canvas capture fallback to vector jsPDF:", err);
      }
    }

    // 2. Fallback: Direct vector jsPDF generator (guarantees valid PDF output under any conditions)
    // @ts-ignore
    const jspdfModule = await import("jspdf/dist/jspdf.umd.min.js");
    const jsPDF = jspdfModule.jsPDF || jspdfModule.default?.jsPDF || jspdfModule.default;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let y = 20;

    // Name & Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(47, 84, 235);
    doc.text(resumeData.personalInfo.fullName || "Candidate Resume", 20, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(102, 112, 133);
    doc.text(resumeData.personalInfo.jobTitle || "Professional", 20, y);

    y += 6;
    doc.setFontSize(9);
    const contacts = [
      resumeData.personalInfo.email,
      resumeData.personalInfo.phone,
      resumeData.personalInfo.location,
      resumeData.personalInfo.website,
    ].filter(Boolean).join("  •  ");
    doc.text(contacts, 20, y);

    y += 4;
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);

    // Summary
    if (resumeData.summary) {
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(47, 84, 235);
      doc.text("PROFESSIONAL SUMMARY", 20, y);

      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(16, 24, 40);
      const summaryLines = doc.splitTextToSize(resumeData.summary, 170);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 4.5 + 4;
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(47, 84, 235);
      doc.text("WORK EXPERIENCE", 20, y);

      for (const exp of resumeData.experience) {
        y += 6;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(16, 24, 40);
        doc.text(exp.title || "Position", 20, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(102, 112, 133);
        const dates = `${exp.startDate || ""} - ${exp.endDate || ""}`;
        doc.text(`${exp.company || ""}${exp.location ? ` • ${exp.location}` : ""} (${dates})`, 20, y + 4.5);

        y += 8;
        if (exp.description) {
          doc.setFontSize(9);
          doc.setTextColor(16, 24, 40);
          const descLines = doc.splitTextToSize(exp.description, 170);
          doc.text(descLines, 20, y);
          y += descLines.length * 4.2 + 2;
        }
      }
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      y += 5;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(47, 84, 235);
      doc.text("EDUCATION", 20, y);

      for (const edu of resumeData.education) {
        y += 6;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(16, 24, 40);
        doc.text(edu.degree || "Degree", 20, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(102, 112, 133);
        doc.text(`${edu.institution || ""}${edu.endDate ? ` (${edu.endDate})` : ""}`, 20, y + 4.5);
        y += 8;
      }
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      y += 5;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(47, 84, 235);
      doc.text("KEY SKILLS", 20, y);

      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(16, 24, 40);
      const skillsStr = resumeData.skills.join("  •  ");
      const skillLines = doc.splitTextToSize(skillsStr, 170);
      doc.text(skillLines, 20, y);
    }

    return doc.output("blob");
  };

  // Save to Profile & Document Store and set as Candidate Active Resume
  const handleSaveToProfile = async () => {
    setIsSaving(true);
    try {
      const candidateName = (resume.personalInfo.fullName || "Candidate").trim();
      const safeCandidateName = candidateName.replace(/[^a-zA-Z0-9_-]/g, "_") || "Candidate";
      const fileName = `${safeCandidateName}_Resume.pdf`;

      // 1. Generate real PDF Blob
      const pdfBlob = await generateResumePdfBlob(resume, printRef.current);
      const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

      // 2. Prepare FormData with real PDF file for candidate document endpoint
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("type", "Resume");

      let uploadedDoc: any = null;
      let uploadedDocId = `resume-${Date.now()}`;
      let uploadedDocUrl: string | null = null;

      try {
        const uploadRes = await documentsService.uploadDocument(formData);
        uploadedDoc = uploadRes?.payload || uploadRes;
        if (uploadedDoc) {
          uploadedDocId = uploadedDoc.id || uploadedDoc.documentId || uploadedDocId;
          uploadedDocUrl = uploadedDoc.fileUrl || uploadedDoc.url || null;
        }
      } catch (err: any) {
        console.warn("Backend document upload warning:", err);
      }

      // Generate local object URL if backend didn't return a remote URL
      if (!uploadedDocUrl && typeof window !== "undefined") {
        try {
          uploadedDocUrl = URL.createObjectURL(pdfBlob);
        } catch {}
      }

      // 3. Mark this newly completed/saved resume as Candidate's ACTIVE resume
      if (typeof window !== "undefined") {
        localStorage.setItem("candidate_active_resume", JSON.stringify(resume));
        localStorage.setItem("candidate_active_resume_name", fileName);
        localStorage.setItem("candidate_active_resume_template", template);
        localStorage.setItem("candidate_active_resume_id", uploadedDocId);
        if (uploadedDocUrl) {
          localStorage.setItem("candidate_active_resume_url", uploadedDocUrl);
        }
        localStorage.setItem("candidate_active_resume_updated_at", new Date().toISOString());

        // Dispatch events so profile resume tab and job application modals sync instantly
        window.dispatchEvent(
          new CustomEvent("active_resume_updated", {
            detail: {
              resume,
              fileName,
              template,
              id: uploadedDocId,
              fileUrl: uploadedDocUrl,
            },
          })
        );
        window.dispatchEvent(new Event("storage"));
      }

      setSaveSuccess(true);
      if (onSavedResume) onSavedResume();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error("Error saving resume as PDF:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Copy Plain Text for ATS job applications
  const handleCopyText = () => {
    const textResume = `
${(resume.personalInfo.fullName || "CANDIDATE").toUpperCase()}
${resume.personalInfo.jobTitle}
Contact: ${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}
Links: ${resume.personalInfo.linkedin} | ${resume.personalInfo.website} | ${resume.personalInfo.github}

PROFESSIONAL SUMMARY
${resume.summary}

WORK EXPERIENCE
${resume.experience
  .map(
    (e) => `
${e.title} | ${e.company} (${e.startDate} - ${e.endDate})
Location: ${e.location}
${e.description}
`
  )
  .join("\n")}

EDUCATION
${resume.education
  .map(
    (edu) =>
      `${edu.degree} - ${edu.institution} (${edu.startDate} - ${edu.endDate}) ${
        edu.score ? `[${edu.score}]` : ""
      }`
  )
  .join("\n")}

SKILLS
${resume.skills.join(", ")}

PROJECTS
${resume.projects
  .map((p) => `${p.name} (${p.role}) - ${p.link}\n${p.description}`)
  .join("\n")}

CERTIFICATIONS
${resume.certifications.map((c) => `${c.name} - ${c.issuer} (${c.date})`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(textResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activeTemplateInfo = RESUME_TEMPLATES.find((t) => t.id === template) || RESUME_TEMPLATES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 md:p-5 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative flex ${
          isFullscreen ? "h-screen w-screen rounded-none" : "h-[96vh] w-full max-w-[1540px] rounded-2xl"
        } flex-col overflow-hidden bg-white shadow-2xl dark:bg-[#0f131c] border border-slate-200 dark:border-slate-800 transition-all`}
      >
        {/* Top App Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-[#131722] z-20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Professional Resume Builder
                </h2>
                {/* Showcase Trigger Button */}
                <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Template: {activeTemplateInfo.name}</span>
                  <span className="rounded bg-blue-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                    Change
                  </span>
                </button>

                {isSyncingProfile ? (
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    <Loader2 className="h-3 w-3 animate-spin text-blue-600" /> Syncing Details...
                  </span>
                ) : profileAutoFilled ? (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Auto-Filled from Profile (Editable)
                  </span>
                ) : null}
              </div>

              {/* ATS Score & Checklist popover trigger */}
              <div className="relative mt-0.5 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => setShowAtsBreakdown(!showAtsBreakdown)}
                  className="flex items-center gap-1.5 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition"
                  title="Click to view ATS score recommendations"
                >
                  <span>ATS Readiness:</span>
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full transition-all duration-500 ${
                        atsScore >= 80 ? "bg-emerald-500" : atsScore >= 50 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${atsScore}%` }}
                    />
                  </div>
                  <span
                    className={
                      atsScore >= 80
                        ? "text-emerald-600 dark:text-emerald-400"
                        : atsScore >= 50
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400"
                    }
                  >
                    {atsScore}%
                  </span>
                  <HelpCircle className="h-3 w-3 text-slate-400" />
                </button>

                {/* ATS Breakdown Dropdown Popover */}
                {showAtsBreakdown && (
                  <div className="absolute left-0 top-6 z-30 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        ATS Checklist ({atsScore}/100)
                      </span>
                      <button
                        onClick={() => setShowAtsBreakdown(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-2.5 space-y-2">
                      {atsBreakdown.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px]">
                          <span
                            className={
                              item.passed
                                ? "text-slate-700 dark:text-slate-300 font-medium"
                                : "text-slate-400 dark:text-slate-500"
                            }
                          >
                            {item.label}
                          </span>
                          {item.passed ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <span className="text-[10px] text-amber-600 font-bold">+{item.points}%</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center: Accent Color & Font Family (Desktop) */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Color Accent Picker */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-[11px] font-semibold text-slate-500">Color:</span>
              <div className="flex items-center gap-1">
                {colorThemes.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setAccentColor(c.value)}
                    title={c.name}
                    className={`h-5 w-5 rounded-full transition-transform hover:scale-125 ${
                      accentColor === c.value ? "ring-2 ring-offset-2 ring-blue-600 scale-110" : ""
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            {/* Font Selector */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-800 dark:bg-slate-900/60">
              <Type className="h-3.5 w-3.5 text-slate-500" />
              {fontFamilies.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFontFamily(f.value)}
                  className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                    fontFamily === f.value
                      ? "bg-white text-blue-700 shadow-xs dark:bg-slate-700 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                  }`}
                >
                  {f.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Modes for Mobile/Tablet */}
            <div className="flex md:hidden items-center rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
              <button
                onClick={() => setPreviewMode("edit")}
                className={`rounded px-2 py-1 text-xs font-semibold ${
                  previewMode === "edit"
                    ? "bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setPreviewMode("preview")}
                className={`rounded px-2 py-1 text-xs font-semibold ${
                  previewMode === "preview"
                    ? "bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Preview
              </button>
            </div>

            {/* Fetch from Profile */}
            <button
              onClick={() => handleFetchFromProfile(true)}
              disabled={isSyncingProfile}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 hover:border-blue-300 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
              title="Fetch latest information, history, and skills from your candidate profile"
            >
              {isSyncingProfile ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              )}
              <span className="hidden sm:inline">
                {isSyncingProfile ? "Fetching..." : "Fetch Profile"}
              </span>
            </button>

            {/* Start from Scratch */}
            <button
              onClick={() => setShowResetConfirmModal(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-rose-950/40 dark:hover:border-rose-900 dark:hover:text-rose-300"
              title="Reset resume and build completely from scratch"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Start from Scratch</span>
            </button>

            {/* Copy Plaintext */}
            <button
              onClick={handleCopyText}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              title="Copy plain text for job applications"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            {/* Save Resume Button - Primary Action */}
            <button
              onClick={handleSaveToProfile}
              disabled={isSaving}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-75"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span className="font-bold">Resume Saved &amp; Active!</span>
                </>
              ) : isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Resume</span>
                </>
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Template Gallery Banner Carousel / Quick Switch Bar */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-2.5 dark:border-slate-800 dark:bg-[#12151f] overflow-x-auto scrollbar-none flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none">
            {/* Big "Browse All Templates" CTA pill */}
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="group flex shrink-0 items-center gap-2 rounded-xl border border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-2xs hover:border-blue-500 hover:from-blue-100 hover:to-indigo-100 dark:border-blue-800 dark:from-blue-950/60 dark:to-indigo-950/60 dark:text-blue-300 transition"
            >
              <Layout className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Browse All {RESUME_TEMPLATES.length} Templates</span>
              <span className="rounded-full bg-blue-600 px-1.5 py-0.2 text-[10px] text-white">
                Showcase
              </span>
            </button>

            <span className="text-slate-300 dark:text-slate-700 font-light">|</span>

            {/* Quick Switch Chips */}
            {RESUME_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`group flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-left transition-all ${
                  template === t.id
                    ? "border-blue-600 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-blue-600/30"
                    : "border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-md bg-gradient-to-tr ${t.iconBg} flex items-center justify-center text-white shadow-2xs text-[9px] font-black`}
                >
                  {t.name[0]}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.name}
                  </span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-semibold ${t.tagColor}`}>
                    {t.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Work Area: 2 Columns */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-12">
          {/* Left Column: Form Editor & Controls */}
          <div
            className={`flex flex-col border-r border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-[#0f131c] md:col-span-5 lg:col-span-5 ${
              previewMode === "preview" ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Editor Action & Quick Status Bar */}
            <div className="border-b border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-[#111520] px-3.5 py-2 flex items-center justify-between gap-2 text-xs shrink-0">
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                {profileAutoFilled ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium truncate">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Profile data synced &bull; Fully editable</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium truncate">
                    <FileText className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">Blank Canvas Mode</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleFetchFromProfile(true)}
                  disabled={isSyncingProfile}
                  className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-2 py-1 text-[11px] font-bold text-blue-700 shadow-2xs hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700 transition"
                  title="Fetch data from your profile"
                >
                  {isSyncingProfile ? (
                    <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                  ) : (
                    <Sparkles className="h-3 w-3 text-blue-600" />
                  )}
                  <span>Fetch Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowResetConfirmModal(true)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600 shadow-2xs hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 transition"
                  title="Reset all sections and start from scratch"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Feedback Alert Banner */}
            {statusFeedback && (
              <div
                className={`flex items-center justify-between border-b px-4 py-2 text-xs font-medium transition animate-in fade-in shrink-0 ${
                  statusFeedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : statusFeedback.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
                    : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {statusFeedback.type === "success" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : statusFeedback.type === "error" ? (
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  ) : (
                    <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  )}
                  <span>{statusFeedback.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusFeedback(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Section Tabs Header */}
            <div className="flex border-b border-slate-200 bg-white px-3 py-2 overflow-x-auto dark:border-slate-800 dark:bg-[#131722] scrollbar-none gap-1">
              {[
                { id: "personal", label: "Profile", icon: User, complete: tabStatus.personal },
                { id: "summary", label: "Summary", icon: FileText, complete: tabStatus.summary },
                { id: "experience", label: "Experience", icon: Briefcase, complete: tabStatus.experience, count: resume.experience.length },
                { id: "education", label: "Education", icon: GraduationCap, complete: tabStatus.education, count: resume.education.length },
                { id: "skills", label: "Skills", icon: Wrench, complete: tabStatus.skills, count: resume.skills.length },
                { id: "projects", label: "Projects", icon: FolderGit2, complete: tabStatus.projects, count: resume.projects.length },
                { id: "certifications", label: "Certs", icon: Award, complete: tabStatus.certifications, count: resume.certifications.length },
                { id: "languages", label: "Languages", icon: Languages, complete: tabStatus.languages, count: resume.languages.length },
              ].map(({ id, label, icon: Icon, complete, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`relative flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeTab === id
                      ? "bg-blue-50 text-blue-700 shadow-xs dark:bg-blue-950/60 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                  {typeof count === "number" && count > 0 && (
                    <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {count}
                    </span>
                  )}
                  {complete && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Section complete" />
                  )}
                </button>
              ))}
            </div>

            {/* Form Fields Body */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              {/* TAB 1: Personal Info */}
              {activeTab === "personal" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Quick Profile Fetch & Reset Hero Card */}
                  <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 p-3.5 dark:border-blue-900/40 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Resume Data Options</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Import details from your candidate profile or reset to build from scratch.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleFetchFromProfile(true)}
                        disabled={isSyncingProfile}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition"
                      >
                        {isSyncingProfile ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        <span>Fetch from Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirmModal(true)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:border-rose-900 dark:hover:text-rose-300 transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset Resume</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Candidate Details & Header Info
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        This information appears at the very top of your resume.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={resume.personalInfo.fullName}
                        onChange={(e) => handlePersonalChange("fullName", e.target.value)}
                        placeholder="e.g. John Doe"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Target Job Title / Headline *
                      </label>
                      <input
                        type="text"
                        value={resume.personalInfo.jobTitle}
                        onChange={(e) => handlePersonalChange("jobTitle", e.target.value)}
                        placeholder="e.g. Full Stack Developer"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={resume.personalInfo.email}
                        onChange={(e) => handlePersonalChange("email", e.target.value)}
                        placeholder="john@example.com"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        value={resume.personalInfo.phone}
                        onChange={(e) => handlePersonalChange("phone", e.target.value)}
                        placeholder="+1 555-0100"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Location (City, State / Country)
                      </label>
                      <input
                        type="text"
                        value={resume.personalInfo.location}
                        onChange={(e) => handlePersonalChange("location", e.target.value)}
                        placeholder="e.g. New York, NY"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Portfolio / Website
                      </label>
                      <input
                        type="text"
                        value={resume.personalInfo.website}
                        onChange={(e) => handlePersonalChange("website", e.target.value)}
                        placeholder="https://myportfolio.com"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        LinkedIn Profile
                      </label>
                      <input
                        type="text"
                        value={resume.personalInfo.linkedin}
                        onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                        placeholder="linkedin.com/in/username"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        GitHub / Other Profile
                      </label>
                      <input
                        type="text"
                        value={resume.personalInfo.github}
                        onChange={(e) => handlePersonalChange("github", e.target.value)}
                        placeholder="github.com/username"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Summary */}
              {activeTab === "summary" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Executive Summary & Pitch
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        A concise 2-4 sentence pitch highlighting your key strengths and impact.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAiEnhanceSummary}
                      disabled={aiGenerating}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 dark:border-indigo-800 dark:bg-indigo-950/70 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition shadow-2xs"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      {aiGenerating ? "Generating..." : "AI Generate Summary"}
                    </button>
                  </div>

                  <div>
                    <textarea
                      rows={6}
                      value={resume.summary}
                      onChange={(e) => setResume((prev) => ({ ...prev, summary: e.target.value }))}
                      placeholder="e.g. Proven Software Engineer with 5+ years of experience architecting high-traffic distributed web applications. Expertise in React, Next.js, and TypeScript with a track record of boosting performance by 40%."
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <div className="mt-1.5 flex justify-between text-xs text-slate-400">
                      <span>Recommendation: 60 - 250 characters</span>
                      <span className={resume.summary.length > 60 ? "text-emerald-600 font-bold" : ""}>
                        {resume.summary.length} characters
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Experience */}
              {activeTab === "experience" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        Work Experience ({resume.experience.length})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Add your roles starting from the most recent.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Role
                    </button>
                  </div>

                  {/* Action Verbs Quick Shelf */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Power Action Verbs for Bullet Points:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {actionVerbs.map((verb) => (
                        <span
                          key={verb}
                          className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {verb}
                        </span>
                      ))}
                    </div>
                  </div>

                  {resume.experience.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                      <Briefcase className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        No work experience added yet
                      </p>
                      <button
                        onClick={addExperience}
                        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add First Experience
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resume.experience.map((exp, index) => (
                        <div
                          key={exp.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-700 dark:bg-slate-800/80 transition"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-700/60">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-blue-600">Role #{index + 1}</span>
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {exp.title || "Untitled Role"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveExperience(index, "up")}
                                disabled={index === 0}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                title="Move up"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => moveExperience(index, "down")}
                                disabled={index === resume.experience.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                title="Move down"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeExperience(exp.id)}
                                className="p-1 text-slate-400 hover:text-red-500 transition"
                                title="Delete experience"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Job Title *
                              </label>
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                                placeholder="e.g. Senior Software Engineer"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Company / Organization *
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                placeholder="e.g. Acme Corp"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Start Date
                              </label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                placeholder="e.g. Jan 2022"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                End Date
                              </label>
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                placeholder="e.g. Present"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Key Responsibilities & Achievements
                              </label>
                              <textarea
                                rows={3}
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                placeholder="• Spearheaded the migration of core services to Next.js&#10;• Reduced load times by 45% through aggressive bundle optimization"
                                className="mt-1 w-full rounded border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Education */}
              {activeTab === "education" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        Education History ({resume.education.length})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Degrees, certifications, and academic institutions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Degree
                    </button>
                  </div>

                  {resume.education.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                      <GraduationCap className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        No education added yet
                      </p>
                      <button
                        onClick={addEducation}
                        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Degree
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resume.education.map((edu, index) => (
                        <div
                          key={edu.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-700 dark:bg-slate-800/80"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-700/60">
                            <span className="text-xs font-bold text-blue-600">Degree #{index + 1}</span>
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="text-slate-400 hover:text-red-500 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Degree / Major
                              </label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                placeholder="e.g. B.S. in Computer Science"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Institution / University
                              </label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                placeholder="e.g. Stanford University"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Years (e.g. 2016 - 2020)
                              </label>
                              <input
                                type="text"
                                value={`${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ""}`}
                                onChange={(e) => {
                                  const parts = e.target.value.split("-");
                                  updateEducation(edu.id, "startDate", parts[0]?.trim() || "");
                                  if (parts[1]) {
                                    updateEducation(edu.id, "endDate", parts[1]?.trim() || "");
                                  }
                                }}
                                placeholder="2016 - 2020"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Grade / Honors
                              </label>
                              <input
                                type="text"
                                value={edu.score}
                                onChange={(e) => updateEducation(edu.id, "score", e.target.value)}
                                placeholder="e.g. GPA 3.8 / First Class"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Skills */}
              {activeTab === "skills" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-600" />
                    Skills & Core Competencies ({resume.skills.length})
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill(newSkillInput);
                        }
                      }}
                      placeholder="Type a skill and hit Enter (e.g. React, SQL, Project Management)"
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(newSkillInput)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {resume.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Suggestions */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Popular Tech Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        "TypeScript",
                        "React.js",
                        "Next.js",
                        "Node.js",
                        "Tailwind CSS",
                        "PostgreSQL",
                        "Docker",
                        "AWS",
                        "GraphQL",
                        "Python",
                        "REST APIs",
                        "Agile Scrum",
                      ]
                        .filter((s) => !resume.skills.includes(s))
                        .map((s) => (
                          <button
                            key={s}
                            onClick={() => addSkill(s)}
                            className="inline-flex items-center gap-1 rounded bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950 font-medium"
                          >
                            <Plus className="h-3 w-3" /> {s}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: Projects */}
              {activeTab === "projects" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FolderGit2 className="h-4 w-4 text-blue-600" />
                      Key Projects ({resume.projects.length})
                    </h3>
                    <button
                      onClick={addProject}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Project
                    </button>
                  </div>

                  {resume.projects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                      <FolderGit2 className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        No projects added yet
                      </p>
                      <button
                        onClick={addProject}
                        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Project
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resume.projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-700 dark:bg-slate-800/80"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-700/60">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {proj.name || "Untitled Project"}
                            </span>
                            <button
                              onClick={() => removeProject(proj.id)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Project Name
                              </label>
                              <input
                                type="text"
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                                placeholder="e.g. AI Workflow Platform"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Tech Stack
                              </label>
                              <input
                                type="text"
                                value={proj.techStack}
                                onChange={(e) => updateProject(proj.id, "techStack", e.target.value)}
                                placeholder="Next.js, Python, PostgreSQL"
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Repository / Live Link
                              </label>
                              <input
                                type="text"
                                value={proj.link}
                                onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                                placeholder="https://github.com/..."
                                className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Description & Outcomes
                              </label>
                              <textarea
                                rows={2}
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                                placeholder="Describe the problem, technologies used, and outcomes achieved..."
                                className="mt-1 w-full rounded border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: Certifications */}
              {activeTab === "certifications" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-600" />
                      Certifications & Accreditations ({resume.certifications.length})
                    </h3>
                    <button
                      onClick={addCertification}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Cert
                    </button>
                  </div>

                  {resume.certifications.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                      <Award className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        No certifications added yet
                      </p>
                      <button
                        onClick={addCertification}
                        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Certification
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resume.certifications.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/80"
                        >
                          <input
                            type="text"
                            value={c.name}
                            onChange={(e) => updateCertification(c.id, "name", e.target.value)}
                            placeholder="Certificate Name (e.g. AWS Solutions Architect)"
                            className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={c.issuer}
                            onChange={(e) => updateCertification(c.id, "issuer", e.target.value)}
                            placeholder="Issuer (e.g. AWS)"
                            className="w-32 rounded border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={c.date}
                            onChange={(e) => updateCertification(c.id, "date", e.target.value)}
                            placeholder="Year"
                            className="w-20 rounded border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                          <button
                            onClick={() => removeCertification(c.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: Languages */}
              {activeTab === "languages" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Languages className="h-4 w-4 text-blue-600" />
                      Languages Spoken ({resume.languages.length})
                    </h3>
                    <button
                      onClick={addLanguage}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Language
                    </button>
                  </div>

                  {resume.languages.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                      <Languages className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        No languages added yet
                      </p>
                      <button
                        onClick={addLanguage}
                        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Language
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resume.languages.map((l) => (
                        <div
                          key={l.id}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/80"
                        >
                          <input
                            type="text"
                            value={l.name}
                            onChange={(e) => updateLanguage(l.id, "name", e.target.value)}
                            placeholder="Language (e.g. English, Spanish)"
                            className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                          <select
                            value={l.proficiency}
                            onChange={(e) => updateLanguage(l.id, "proficiency", e.target.value)}
                            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          >
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Professional">Professional</option>
                            <option value="Conversational">Conversational</option>
                          </select>
                          <button
                            onClick={() => removeLanguage(l.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live A4 Resume Preview */}
          <div
            className={`flex flex-col bg-slate-200/80 p-4 dark:bg-[#090c14] md:col-span-7 lg:col-span-7 overflow-y-auto ${
              previewMode === "edit" ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Preview Toolbar */}
            <div className="mb-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                  <Eye className="h-3.5 w-3.5 text-blue-600" />
                  Live Preview: {activeTemplateInfo.name}
                </span>
                <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="rounded bg-white px-2 py-0.5 text-[11px] font-bold text-blue-600 shadow-2xs hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400 transition"
                >
                  Change Template ↗
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span>Zoom:</span>
                <button
                  onClick={() => setZoomScale((z) => Math.max(0.65, Number((z - 0.05).toFixed(2))))}
                  className="rounded bg-white px-2 py-0.5 shadow-2xs font-bold dark:bg-slate-800"
                >
                  -
                </button>
                <span className="w-12 text-center font-mono font-semibold">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={() => setZoomScale((z) => Math.min(1.3, Number((z + 0.05).toFixed(2))))}
                  className="rounded bg-white px-2 py-0.5 shadow-2xs font-bold dark:bg-slate-800"
                >
                  +
                </button>
                <button
                  onClick={() => setZoomScale(0.95)}
                  className="rounded bg-white px-2 py-0.5 text-[10px] font-semibold shadow-2xs dark:bg-slate-800 ml-1"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* A4 Paper Scaled Wrapper */}
            <div className="flex justify-center flex-1 pb-12">
              <div
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: "top center",
                }}
                className="transition-transform duration-100"
              >
                <div
                  ref={printRef}
                  id="resume-printable-area"
                  className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl rounded-sm print:p-0 print:shadow-none print:w-full ${fontFamily} transition-all`}
                  style={{
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {/* ============================================================ */}
                  {/* TEMPLATE 1: SILICON VALLEY MODERN                            */}
                  {/* ============================================================ */}
                  {template === "modern" && (
                    <div className="p-10 space-y-5 text-xs">
                      {/* Top Header */}
                      <div className="border-l-4 pl-4 py-1" style={{ borderColor: accentColor }}>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                          {resume.personalInfo.fullName || "Your Full Name"}
                        </h1>
                        <p
                          className="mt-1 text-sm font-bold tracking-wider uppercase"
                          style={{ color: accentColor }}
                        >
                          {resume.personalInfo.jobTitle || "Job Title / Role"}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
                          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                          {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
                          {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
                          {resume.personalInfo.website && <span>• {resume.personalInfo.website}</span>}
                          {resume.personalInfo.linkedin && <span>• {resume.personalInfo.linkedin}</span>}
                        </div>
                      </div>

                      {/* Summary */}
                      {resume.summary && (
                        <div>
                          <h2
                            className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                            style={{ color: accentColor, borderColor: `${accentColor}33` }}
                          >
                            Professional Summary
                          </h2>
                          <p className="mt-2 leading-relaxed text-slate-700">{resume.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {resume.experience.length > 0 && (
                        <div>
                          <h2
                            className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                            style={{ color: accentColor, borderColor: `${accentColor}33` }}
                          >
                            Experience
                          </h2>
                          <div className="mt-3 space-y-3.5">
                            {resume.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex items-baseline justify-between">
                                  <h3 className="font-bold text-slate-900 text-xs">
                                    {exp.title || "Job Title"}
                                  </h3>
                                  {(exp.startDate || exp.endDate) && (
                                    <span className="text-[11px] font-medium text-slate-500">
                                      {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                                  <span>{exp.company}</span>
                                  {exp.location && <span>{exp.location}</span>}
                                </div>
                                {exp.description && (
                                  <div className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-700">
                                    {exp.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {resume.education.length > 0 && (
                        <div>
                          <h2
                            className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                            style={{ color: accentColor, borderColor: `${accentColor}33` }}
                          >
                            Education
                          </h2>
                          <div className="mt-2.5 space-y-2">
                            {resume.education.map((edu) => (
                              <div key={edu.id} className="flex items-baseline justify-between">
                                <div>
                                  <h3 className="font-bold text-slate-900">{edu.degree || "Degree"}</h3>
                                  <p className="text-[11px] text-slate-600">
                                    {edu.institution} {edu.score ? `— ${edu.score}` : ""}
                                  </p>
                                </div>
                                {(edu.startDate || edu.endDate) && (
                                  <span className="text-[11px] font-medium text-slate-500">
                                    {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {resume.skills.length > 0 && (
                        <div>
                          <h2
                            className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                            style={{ color: accentColor, borderColor: `${accentColor}33` }}
                          >
                            Core Competencies
                          </h2>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {resume.skills.map((s) => (
                              <span
                                key={s}
                                className="rounded px-2.5 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-800"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {resume.projects.length > 0 && (
                        <div>
                          <h2
                            className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                            style={{ color: accentColor, borderColor: `${accentColor}33` }}
                          >
                            Featured Projects
                          </h2>
                          <div className="mt-2.5 space-y-2">
                            {resume.projects.map((p) => (
                              <div key={p.id}>
                                <div className="flex items-baseline justify-between">
                                  <h3 className="font-bold text-slate-900">
                                    {p.name} {p.techStack ? `• ${p.techStack}` : ""}
                                  </h3>
                                  {p.link && (
                                    <span className="text-[10px] text-blue-600 underline">
                                      {p.link}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 text-[11px] text-slate-700">{p.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============================================================ */}
                  {/* TEMPLATE 2: LONDON TWO-COLUMN (SIDEBAR)                      */}
                  {/* ============================================================ */}
                  {template === "sidebar" && (
                    <div className="grid grid-cols-12 min-h-[297mm] text-xs">
                      {/* Left Dark Sidebar (4 Cols) */}
                      <div
                        className="col-span-4 p-8 text-white space-y-6"
                        style={{ backgroundColor: accentColor }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-black text-white shadow-inner">
                            {resume.personalInfo.fullName
                              ? resume.personalInfo.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                              : "YN"}
                          </div>
                          <div>
                            <h2 className="text-sm font-black leading-tight">
                              {resume.personalInfo.fullName || "Your Name"}
                            </h2>
                            <p className="text-[10px] text-white/80 font-medium">
                              {resume.personalInfo.jobTitle || "Your Title"}
                            </p>
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2 pt-2 border-t border-white/20 text-[11px]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                            Contact
                          </span>
                          {resume.personalInfo.email && <p className="truncate">{resume.personalInfo.email}</p>}
                          {resume.personalInfo.phone && <p>{resume.personalInfo.phone}</p>}
                          {resume.personalInfo.location && <p>{resume.personalInfo.location}</p>}
                          {resume.personalInfo.linkedin && (
                            <p className="truncate">{resume.personalInfo.linkedin}</p>
                          )}
                          {resume.personalInfo.github && (
                            <p className="truncate">{resume.personalInfo.github}</p>
                          )}
                        </div>

                        {/* Skills */}
                        {resume.skills.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-white/20">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                              Expertise
                            </span>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {resume.skills.map((s) => (
                                <span
                                  key={s}
                                  className="rounded bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {resume.education.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-white/20 text-[11px]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                              Education
                            </span>
                            {resume.education.map((e) => (
                              <div key={e.id} className="pt-1">
                                <p className="font-bold leading-tight">{e.degree}</p>
                                <p className="text-[10px] text-white/80">{e.institution}</p>
                                <p className="text-[10px] text-white/60">
                                  {e.startDate} {e.endDate ? `- ${e.endDate}` : ""}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Languages */}
                        {resume.languages.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t border-white/20 text-[11px]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                              Languages
                            </span>
                            {resume.languages.map((l) => (
                              <div key={l.id} className="flex justify-between text-[10px]">
                                <span>{l.name}</span>
                                <span className="text-white/70">{l.proficiency}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Main Area (8 Cols) */}
                      <div className="col-span-8 p-8 space-y-5 bg-white text-slate-800">
                        {/* Summary */}
                        {resume.summary && (
                          <div>
                            <h2
                              className="text-xs font-black uppercase tracking-wider pb-1 border-b"
                              style={{ color: accentColor, borderColor: `${accentColor}33` }}
                            >
                              Executive Summary
                            </h2>
                            <p className="mt-2 text-xs leading-relaxed text-slate-700">
                              {resume.summary}
                            </p>
                          </div>
                        )}

                        {/* Experience */}
                        {resume.experience.length > 0 && (
                          <div>
                            <h2
                              className="text-xs font-black uppercase tracking-wider pb-1 border-b"
                              style={{ color: accentColor, borderColor: `${accentColor}33` }}
                            >
                              Work History
                            </h2>
                            <div className="mt-3 space-y-4">
                              {resume.experience.map((exp) => (
                                <div key={exp.id}>
                                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                                    <span>{exp.title}</span>
                                    <span className="text-[10px] text-slate-500 font-normal">
                                      {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-semibold text-slate-600">
                                    {exp.company} {exp.location ? `• ${exp.location}` : ""}
                                  </p>
                                  <div className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-700">
                                    {exp.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {resume.projects.length > 0 && (
                          <div>
                            <h2
                              className="text-xs font-black uppercase tracking-wider pb-1 border-b"
                              style={{ color: accentColor, borderColor: `${accentColor}33` }}
                            >
                              Projects & Milestones
                            </h2>
                            <div className="mt-2.5 space-y-2">
                              {resume.projects.map((p) => (
                                <div key={p.id}>
                                  <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-slate-900">{p.name}</h3>
                                    {p.link && (
                                      <span className="text-[10px] text-blue-600 underline">
                                        {p.link}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-700">{p.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ============================================================ */}
                  {/* TEMPLATE 3: HARVARD CLASSIC (EXECUTIVE SERIF)                */}
                  {/* ============================================================ */}
                  {template === "executive" && (
                    <div className="p-10 space-y-5 text-xs font-serif text-slate-900">
                      <div className="text-center pb-3 border-b-2 border-slate-900 space-y-1">
                        <h1 className="text-3xl font-black uppercase tracking-wide">
                          {resume.personalInfo.fullName || "Your Full Name"}
                        </h1>
                        <p
                          className="text-xs font-bold tracking-widest uppercase font-sans"
                          style={{ color: accentColor }}
                        >
                          {resume.personalInfo.jobTitle || "Job Title / Role"}
                        </p>
                        <div className="text-[11px] text-slate-700 flex justify-center flex-wrap gap-2 pt-1 font-sans">
                          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                          {resume.personalInfo.phone && <span>| {resume.personalInfo.phone}</span>}
                          {resume.personalInfo.location && <span>| {resume.personalInfo.location}</span>}
                          {resume.personalInfo.linkedin && <span>| {resume.personalInfo.linkedin}</span>}
                        </div>
                      </div>

                      {/* Summary */}
                      {resume.summary && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-0.5 border-b border-slate-400">
                            Summary of Qualifications
                          </h2>
                          <p className="mt-2 leading-relaxed text-slate-800">{resume.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {resume.experience.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-0.5 border-b border-slate-400">
                            Professional Experience
                          </h2>
                          <div className="mt-3 space-y-3.5">
                            {resume.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex justify-between font-bold text-slate-950">
                                  <span>{exp.title}</span>
                                  <span className="font-normal text-slate-600">
                                    {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ""}
                                  </span>
                                </div>
                                <div className="italic text-slate-700 text-[11px]">
                                  {exp.company} {exp.location ? `, ${exp.location}` : ""}
                                </div>
                                {exp.description && (
                                  <div className="mt-1 whitespace-pre-line text-slate-800 leading-relaxed font-sans text-[11px]">
                                    {exp.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {resume.education.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-0.5 border-b border-slate-400">
                            Education
                          </h2>
                          <div className="mt-2.5 space-y-2">
                            {resume.education.map((e) => (
                              <div key={e.id} className="flex justify-between">
                                <div>
                                  <span className="font-bold">{e.degree}</span>, {e.institution}
                                  {e.score && <span className="italic text-slate-600"> ({e.score})</span>}
                                </div>
                                <span className="text-slate-600">
                                  {e.startDate} {e.endDate ? `– ${e.endDate}` : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {resume.skills.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-0.5 border-b border-slate-400">
                            Competencies & Expertise
                          </h2>
                          <p className="mt-1.5 leading-normal font-sans text-[11px] text-slate-800">
                            {resume.skills.join(" • ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============================================================ */}
                  {/* TEMPLATE 4: NORDIC MINIMALIST (TOP ATS)                      */}
                  {/* ============================================================ */}
                  {template === "minimal" && (
                    <div className="p-10 space-y-6 text-xs text-slate-800 font-sans">
                      <div>
                        <h1 className="text-3xl font-light text-slate-950 tracking-tight">
                          {resume.personalInfo.fullName || "Your Full Name"}
                        </h1>
                        <p className="mt-0.5 text-xs font-bold tracking-widest uppercase" style={{ color: accentColor }}>
                          {resume.personalInfo.jobTitle || "Your Professional Headline"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-5 text-[11px] text-slate-500">
                          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
                          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
                          {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
                        </div>
                      </div>

                      {resume.summary && (
                        <div>
                          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            About
                          </h2>
                          <p className="mt-1.5 leading-relaxed text-slate-700">{resume.summary}</p>
                        </div>
                      )}

                      {resume.experience.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            Experience
                          </h2>
                          <div className="mt-3 space-y-4">
                            {resume.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex justify-between items-baseline font-medium text-slate-900">
                                  <span>{exp.title}</span>
                                  <span className="text-[10px] text-slate-400">
                                    {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ""}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500">{exp.company}</div>
                                {exp.description && (
                                  <div className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-600">
                                    {exp.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resume.education.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            Education
                          </h2>
                          <div className="mt-2 space-y-1.5">
                            {resume.education.map((e) => (
                              <div key={e.id} className="flex justify-between text-[11px]">
                                <span>
                                  <strong>{e.degree}</strong>, {e.institution}
                                </span>
                                <span className="text-slate-400">
                                  {e.startDate} {e.endDate ? `– ${e.endDate}` : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {resume.skills.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            Skills
                          </h2>
                          <p className="mt-1.5 leading-relaxed text-slate-700 text-[11px]">
                            {resume.skills.join("  /  ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============================================================ */}
                  {/* TEMPLATE 5: TECH & ENGINEERING                               */}
                  {/* ============================================================ */}
                  {template === "tech" && (
                    <div className="p-10 space-y-5 text-xs font-mono text-slate-900">
                      {/* Terminal-inspired top header */}
                      <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-[11px] font-bold text-slate-500">
                            $ cat candidate_profile.json
                          </span>
                          <div className="flex gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-red-400" />
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          </div>
                        </div>
                        <h1 className="text-2xl font-black text-slate-950 font-sans tracking-tight">
                          {resume.personalInfo.fullName || "Your Full Name"}
                        </h1>
                        <p className="text-xs font-bold" style={{ color: accentColor }}>
                          {`// ${resume.personalInfo.jobTitle || "Software Engineer"}`}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1">
                          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                          {resume.personalInfo.github && <span>• {resume.personalInfo.github}</span>}
                          {resume.personalInfo.website && <span>• {resume.personalInfo.website}</span>}
                        </div>
                      </div>

                      {/* Summary */}
                      {resume.summary && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300">
                            01. Core Architecture & Summary
                          </h2>
                          <p className="mt-2 text-slate-700 leading-relaxed font-sans text-xs">
                            {resume.summary}
                          </p>
                        </div>
                      )}

                      {/* Skills badged */}
                      {resume.skills.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300">
                            02. Technical Arsenal
                          </h2>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {resume.skills.map((s) => (
                              <span
                                key={s}
                                className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-800"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience */}
                      {resume.experience.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300">
                            03. Professional Experience
                          </h2>
                          <div className="mt-3 space-y-3.5">
                            {resume.experience.map((exp) => (
                              <div key={exp.id} className="font-sans">
                                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                                  <span>
                                    {exp.title} <span className="text-slate-500 font-normal">@ {exp.company}</span>
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {exp.startDate} - {exp.endDate || "Present"}
                                  </span>
                                </div>
                                {exp.description && (
                                  <div className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-700">
                                    {exp.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {resume.projects.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300">
                            04. Systems & Codebases
                          </h2>
                          <div className="mt-2 space-y-2 font-sans">
                            {resume.projects.map((p) => (
                              <div key={p.id}>
                                <div className="flex justify-between items-baseline text-xs font-bold">
                                  <span>{p.name}</span>
                                  {p.link && (
                                    <span className="text-[10px] font-mono text-blue-600 underline">
                                      {p.link}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-700">{p.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============================================================ */}
                  {/* TEMPLATE 6: COMPACT ONE-PAGER                                */}
                  {/* ============================================================ */}
                  {template === "compact" && (
                    <div className="p-8 space-y-4 text-xs font-sans text-slate-900 leading-tight">
                      <div className="flex items-center justify-between border-b pb-2.5 border-slate-300">
                        <div>
                          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                            {resume.personalInfo.fullName || "Your Full Name"}
                          </h1>
                          <p className="text-xs font-bold" style={{ color: accentColor }}>
                            {resume.personalInfo.jobTitle || "Job Title"}
                          </p>
                        </div>
                        <div className="text-right text-[10px] text-slate-600 space-y-0.5">
                          <p>
                            {resume.personalInfo.email} {resume.personalInfo.phone ? `• ${resume.personalInfo.phone}` : ""}
                          </p>
                          <p>
                            {resume.personalInfo.location} {resume.personalInfo.linkedin ? `• ${resume.personalInfo.linkedin}` : ""}
                          </p>
                        </div>
                      </div>

                      {resume.summary && (
                        <div>
                          <h2
                            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 border-b"
                            style={{ color: accentColor }}
                          >
                            Summary
                          </h2>
                          <p className="mt-1 text-[11px] text-slate-700 leading-normal">
                            {resume.summary}
                          </p>
                        </div>
                      )}

                      {resume.experience.length > 0 && (
                        <div>
                          <h2
                            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 border-b"
                            style={{ color: accentColor }}
                          >
                            Experience
                          </h2>
                          <div className="mt-2 space-y-2.5">
                            {resume.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11px]">
                                  <span>
                                    {exp.title}, {exp.company}
                                  </span>
                                  {(exp.startDate || exp.endDate) && (
                                    <span className="text-[10px] text-slate-500 font-normal">
                                      {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                    </span>
                                  )}
                                </div>
                                {exp.description && (
                                  <div className="mt-0.5 whitespace-pre-line text-[11px] text-slate-700 leading-normal">
                                    {exp.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <h2
                            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 border-b"
                            style={{ color: accentColor }}
                          >
                            Key Skills
                          </h2>
                          <p className="mt-1 text-[11px] text-slate-700 leading-normal">
                            {resume.skills.length > 0 ? resume.skills.join(" • ") : "No skills added yet."}
                          </p>
                        </div>
                        <div>
                          <h2
                            className="text-[11px] font-bold uppercase tracking-wider pb-0.5 border-b"
                            style={{ color: accentColor }}
                          >
                            Education
                          </h2>
                          <div className="mt-1 space-y-1">
                            {resume.education.map((e) => (
                              <div key={e.id} className="text-[11px]">
                                <span className="font-bold">{e.degree}</span>, {e.institution}{" "}
                                {(e.startDate || e.endDate) && (
                                  <span className="text-[10px] text-slate-500">
                                    ({e.startDate} {e.endDate ? `- ${e.endDate}` : ""})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ============================================================ */}
                  {/* TEMPLATE 7: BERLIN METRO SPLIT (NEW)                         */}
                  {/* ============================================================ */}
                  {template === "berlin" && (
                    <div className="p-9 space-y-5 text-xs font-sans text-slate-900">
                      {/* Top Bold Banner */}
                      <div
                        className="rounded-xl p-6 text-white shadow-md flex items-center justify-between"
                        style={{ backgroundColor: accentColor }}
                      >
                        <div>
                          <h1 className="text-2xl font-black tracking-tight text-white">
                            {resume.personalInfo.fullName || "Your Full Name"}
                          </h1>
                          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/80">
                            {resume.personalInfo.jobTitle || "Target Role / Headline"}
                          </p>
                        </div>
                        <div className="text-right text-[11px] text-white/80 space-y-0.5">
                          {resume.personalInfo.email && <p>{resume.personalInfo.email}</p>}
                          {resume.personalInfo.phone && <p>{resume.personalInfo.phone}</p>}
                          {resume.personalInfo.location && <p>{resume.personalInfo.location}</p>}
                        </div>
                      </div>

                      {/* Summary */}
                      {resume.summary && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Executive Overview
                          </span>
                          <p className="text-xs leading-relaxed text-slate-700">{resume.summary}</p>
                        </div>
                      )}

                      {/* Split Grid: Left Experience, Right Sidebar */}
                      <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-8 space-y-4">
                          {resume.experience.length > 0 && (
                            <div>
                              <h2 className="text-xs font-black uppercase tracking-wider pb-1.5 border-b-2 border-slate-900">
                                Work Experience
                              </h2>
                              <div className="mt-3 space-y-4">
                                {resume.experience.map((exp) => (
                                  <div key={exp.id}>
                                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                                      <span>{exp.title}</span>
                                      <span className="text-[10px] font-medium text-slate-500">
                                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                      </span>
                                    </div>
                                    <div className="text-[11px] font-semibold text-slate-600">
                                      {exp.company} {exp.location ? `• ${exp.location}` : ""}
                                    </div>
                                    {exp.description && (
                                      <div className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-700">
                                        {exp.description}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="col-span-4 space-y-4">
                          {resume.skills.length > 0 && (
                            <div className="rounded-xl border border-slate-200 p-4 bg-white">
                              <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200">
                                Key Skills
                              </h3>
                              <div className="mt-2.5 flex flex-wrap gap-1">
                                {resume.skills.map((s) => (
                                  <span
                                    key={s}
                                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {resume.education.length > 0 && (
                            <div className="rounded-xl border border-slate-200 p-4 bg-white">
                              <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200">
                                Education
                              </h3>
                              <div className="mt-2 space-y-2">
                                {resume.education.map((e) => (
                                  <div key={e.id}>
                                    <p className="font-bold text-[11px]">{e.degree}</p>
                                    <p className="text-[10px] text-slate-600">{e.institution}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ============================================================ */}
                  {/* TEMPLATE 8: SWISS MODERN GRID (NEW)                          */}
                  {/* ============================================================ */}
                  {template === "swiss" && (
                    <div className="p-10 space-y-6 text-xs font-sans text-slate-900">
                      {/* Top Swiss Header */}
                      <div className="border-b-4 border-black pb-4 flex items-end justify-between">
                        <div>
                          <h1 className="text-4xl font-black tracking-tighter uppercase text-black leading-none">
                            {resume.personalInfo.fullName || "Your Full Name"}
                          </h1>
                          <p className="mt-2 text-xs font-bold tracking-widest uppercase text-slate-600">
                            {resume.personalInfo.jobTitle || "Professional Title"}
                          </p>
                        </div>
                        <div className="text-right text-[10px] font-mono text-slate-600 space-y-0.5">
                          <p>{resume.personalInfo.email}</p>
                          <p>{resume.personalInfo.phone}</p>
                          <p>{resume.personalInfo.location}</p>
                        </div>
                      </div>

                      {/* Swiss 12-col Grid */}
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-4 border-r border-slate-200 pr-4 space-y-5">
                          {resume.summary && (
                            <div>
                              <h2 className="text-[11px] font-black uppercase tracking-widest text-black">
                                Profile
                              </h2>
                              <p className="mt-2 text-[11px] leading-relaxed text-slate-700">
                                {resume.summary}
                              </p>
                            </div>
                          )}

                          {resume.skills.length > 0 && (
                            <div>
                              <h2 className="text-[11px] font-black uppercase tracking-widest text-black">
                                Competencies
                              </h2>
                              <div className="mt-2 space-y-1">
                                {resume.skills.map((s) => (
                                  <div key={s} className="text-[11px] font-semibold text-slate-800 border-b border-slate-100 pb-0.5">
                                    {s}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {resume.education.length > 0 && (
                            <div>
                              <h2 className="text-[11px] font-black uppercase tracking-widest text-black">
                                Academic
                              </h2>
                              <div className="mt-2 space-y-2">
                                {resume.education.map((e) => (
                                  <div key={e.id} className="text-[11px]">
                                    <p className="font-bold text-black">{e.degree}</p>
                                    <p className="text-slate-600 text-[10px]">{e.institution}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="col-span-8 space-y-5">
                          {resume.experience.length > 0 && (
                            <div>
                              <h2 className="text-[11px] font-black uppercase tracking-widest text-black pb-1 border-b border-black">
                                Chronological Experience
                              </h2>
                              <div className="mt-3 space-y-4">
                                {resume.experience.map((exp) => (
                                  <div key={exp.id}>
                                    <div className="flex justify-between items-baseline font-bold text-black">
                                      <span className="text-xs">{exp.title}</span>
                                      <span className="text-[10px] font-mono text-slate-500">
                                        {exp.startDate} - {exp.endDate || "Present"}
                                      </span>
                                    </div>
                                    <p className="text-[11px] font-semibold text-slate-600">
                                      {exp.company}
                                    </p>
                                    {exp.description && (
                                      <div className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-700">
                                        {exp.description}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ============================================================ */}
                  {/* TEMPLATE 9: TOKYO CLEAN SLATE (NEW)                          */}
                  {/* ============================================================ */}
                  {template === "tokyo" && (
                    <div className="p-10 space-y-5 text-xs font-sans text-slate-800">
                      {/* Delicate Balanced Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                        <div>
                          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            {resume.personalInfo.fullName || "Your Full Name"}
                          </h1>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {resume.personalInfo.jobTitle || "Professional Title"}
                          </p>
                        </div>
                        <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                          <p>{resume.personalInfo.email}</p>
                          <p>{resume.personalInfo.phone}</p>
                        </div>
                      </div>

                      {resume.summary && (
                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                          <p className="text-slate-700 leading-relaxed text-xs">{resume.summary}</p>
                        </div>
                      )}

                      {resume.experience.length > 0 && (
                        <div>
                          <h2
                            className="text-[11px] font-bold uppercase tracking-wider pb-1 border-b"
                            style={{ color: accentColor, borderColor: `${accentColor}33` }}
                          >
                            Experience
                          </h2>
                          <div className="mt-3 space-y-3.5">
                            {resume.experience.map((exp) => (
                              <div key={exp.id} className="rounded-lg border border-slate-100 p-3.5 bg-white">
                                <div className="flex justify-between items-baseline font-semibold text-slate-900">
                                  <span>{exp.title}</span>
                                  <span className="text-[10px] text-slate-400">
                                    {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ""}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">
                                  {exp.company}
                                </div>
                                {exp.description && (
                                  <div className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-600">
                                    {exp.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        {resume.skills.length > 0 && (
                          <div className="rounded-lg border border-slate-100 p-3.5">
                            <h3 className="font-bold text-[11px] text-slate-800 pb-1 border-b border-slate-100">
                              Core Skills
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {resume.skills.map((s) => (
                                <span
                                  key={s}
                                  className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {resume.education.length > 0 && (
                          <div className="rounded-lg border border-slate-100 p-3.5">
                            <h3 className="font-bold text-[11px] text-slate-800 pb-1 border-b border-slate-100">
                              Education
                            </h3>
                            <div className="mt-2 space-y-1">
                              {resume.education.map((e) => (
                                <div key={e.id} className="text-[11px]">
                                  <p className="font-semibold text-slate-800">{e.degree}</p>
                                  <p className="text-[10px] text-slate-500">{e.institution}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ============================================================ */}
                  {/* TEMPLATE 10: WALL STREET EXECUTIVE (NEW)                     */}
                  {/* ============================================================ */}
                  {template === "corporate" && (
                    <div className="p-10 space-y-5 text-xs font-serif text-slate-950">
                      {/* Authoritative Double-Rule Header */}
                      <div className="border-b-4 border-double border-slate-900 pb-3 flex items-end justify-between">
                        <div>
                          <h1 className="text-3xl font-black tracking-tight uppercase">
                            {resume.personalInfo.fullName || "Your Full Name"}
                          </h1>
                          <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-700 mt-1">
                            {resume.personalInfo.jobTitle || "Executive Role"}
                          </p>
                        </div>
                        <div className="font-sans text-right text-[11px] text-slate-700 space-y-0.5">
                          <p>{resume.personalInfo.email}</p>
                          <p>{resume.personalInfo.phone}</p>
                          <p>{resume.personalInfo.location}</p>
                        </div>
                      </div>

                      {/* Summary */}
                      {resume.summary && (
                        <div>
                          <h2 className="font-sans text-[11px] font-black uppercase tracking-wider pb-1 border-b border-slate-800">
                            Executive Profile
                          </h2>
                          <p className="mt-2 leading-relaxed text-slate-900 font-serif text-xs">
                            {resume.summary}
                          </p>
                        </div>
                      )}

                      {/* Experience */}
                      {resume.experience.length > 0 && (
                        <div>
                          <h2 className="font-sans text-[11px] font-black uppercase tracking-wider pb-1 border-b border-slate-800">
                            Corporate Experience
                          </h2>
                          <div className="mt-3 space-y-4">
                            {resume.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex justify-between items-baseline font-bold text-slate-950">
                                  <span className="text-xs uppercase">{exp.title}</span>
                                  <span className="font-sans text-[10px] text-slate-600 font-medium">
                                    {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ""}
                                  </span>
                                </div>
                                <div className="italic text-slate-800 text-[11px]">
                                  {exp.company} {exp.location ? `, ${exp.location}` : ""}
                                </div>
                                {exp.description && (
                                  <div className="mt-1 whitespace-pre-line text-[11px] font-sans leading-relaxed text-slate-800">
                                    {exp.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {resume.education.length > 0 && (
                        <div>
                          <h2 className="font-sans text-[11px] font-black uppercase tracking-wider pb-1 border-b border-slate-800">
                            Education & Credentials
                          </h2>
                          <div className="mt-2.5 space-y-2">
                            {resume.education.map((e) => (
                              <div key={e.id} className="flex justify-between">
                                <div>
                                  <span className="font-bold">{e.degree}</span>, {e.institution}
                                  {e.score && <span className="italic text-slate-600"> ({e.score})</span>}
                                </div>
                                <span className="font-sans text-[10px] text-slate-600">
                                  {e.startDate} {e.endDate ? `— ${e.endDate}` : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {resume.skills.length > 0 && (
                        <div>
                          <h2 className="font-sans text-[11px] font-black uppercase tracking-wider pb-1 border-b border-slate-800">
                            Areas of Expertise
                          </h2>
                          <p className="mt-2 font-sans text-[11px] text-slate-900 leading-normal">
                            {resume.skills.join(" • ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#131722] animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reset Resume & Start from Scratch?
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  This will clear all current sections — including contact details, experience, education, skills, and summary. You will start with a fresh, blank resume canvas.
                </p>
                <div className="mt-2.5 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-[11px] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                  💡 <strong>Note:</strong> You can click <strong>&quot;Fetch from Profile&quot;</strong> anytime later to re-populate your details from your candidate profile.
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetResume}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Yes, Reset to Blank</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Template Showcase Modal */}
      <TemplateGalleryModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        currentTemplate={template}
        onSelectTemplate={(newTemplateId) => setTemplate(newTemplateId)}
        accentColor={accentColor}
      />
    </div>
  );
}
