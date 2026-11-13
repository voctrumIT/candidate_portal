"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Building2, MapPin, CalendarDays, Check, Briefcase, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { profileService, WorkExperienceDto, isGuid, toDateOnlyString } from "../../../../services/profile";
import { toast } from "../../../components/Toast";
import { getUserFriendlyErrorMessage } from "../../../../lib/errorUtils";

export interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  employmentType?: string;
  startDate: string;
  endDate: string;
  currentRole: boolean;
  skills: string[];
  description?: string;
}

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

export function toDateInputValue(str?: string | null): string {
  if (!str || String(str).toLowerCase() === "present") return "";
  const trimmed = String(str).trim();
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  if (/^\d{4}-\d{2}$/.test(trimmed)) return `${trimmed}-01`;
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  } catch {}
  return "";
}

export function formatDateDisplay(str?: string | null): string {
  if (!str) return "";
  if (String(str).toLowerCase() === "present") return "Present";
  try {
    const match = String(str).trim().match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const d = new Date(year, month, 1);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
  } catch {}
  return String(str);
}

export default function WorkExperienceTab() {
  const { user, refreshProfile } = useAuth();
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentRole, setCurrentRole] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load experiences directly from user profile API data
  useEffect(() => {
    const userExp = user?.workExperiences || (user as any)?.experiences;
    if (Array.isArray(userExp)) {
      const mapped: WorkExperienceItem[] = userExp.map((we: any, i: number) => {
        const isCurrent = Boolean(
          we.current ||
          we.currentRole ||
          we.isCurrent ||
          String(we.endDate || "").toLowerCase() === "present" ||
          !we.endDate
        );
        return {
          id: we.id || `we-${i}`,
          role: we.designation || we.role || we.title || we.position || we.jobTitle || "Professional",
          company: we.organization || we.company || we.companyName || "",
          location: we.location || "",
          employmentType: we.employmentType || "Full-time",
          startDate: toDateInputValue(we.startDate),
          endDate: isCurrent ? "Present" : toDateInputValue(we.endDate),
          currentRole: isCurrent,
          skills: Array.isArray(we.skills)
            ? we.skills
            : (typeof we.skills === "string" ? we.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : []),
          description: we.description || we.responsibilities || "",
        };
      });
      setExperiences(mapped);
    } else {
      setExperiences([]);
    }
  }, [user?.workExperiences, user?.experiences]);

  const openAddForm = () => {
    setEditingId(null);
    setRole("");
    setCompany("");
    setEmploymentType("Full-time");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setCurrentRole(false);
    setSkillsInput("");
    setDescription("");
    setFormError("");
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (item: WorkExperienceItem) => {
    setEditingId(item.id);
    setRole(item.role);
    setCompany(item.company);
    setEmploymentType(item.employmentType || "Full-time");
    setLocation(item.location);
    setStartDate(toDateInputValue(item.startDate));
    setEndDate(item.currentRole ? "" : toDateInputValue(item.endDate));
    setCurrentRole(item.currentRole);
    setSkillsInput(Array.isArray(item.skills) ? item.skills.join(", ") : "");
    setDescription(item.description || "");
    setFormError("");
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const syncExperienceData = async (updatedList: WorkExperienceItem[]): Promise<boolean> => {
    setSaving(true);
    setFormError("");
    try {
      // Save directly to backend API (PUT /api/Candidate/profile/update)
      await profileService.updateProfile({
        workExperiences: updatedList.map((item) => ({
          ...(isGuid(item.id) ? { id: item.id } : {}),
          designation: item.role,
          role: item.role,
          title: item.role,
          position: item.role,
          jobTitle: item.role,
          organization: item.company,
          company: item.company,
          companyName: item.company,
          location: item.location,
          employmentType: item.employmentType,
          startDate: toDateInputValue(item.startDate) || item.startDate,
          endDate: item.currentRole ? null : (toDateInputValue(item.endDate) || item.endDate || null),
          currentRole: item.currentRole,
          current: item.currentRole,
          isCurrent: item.currentRole,
          skills: item.skills,
          description: item.description,
        })),
      });

      await refreshProfile();

      // Dispatch system-wide events
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("work_experience_updated", { detail: updatedList }));
        window.dispatchEvent(new Event("candidate_profile_updated"));
        window.dispatchEvent(new Event("storage"));
      }

      return true;
    } catch (apiErr: any) {
      console.error("Backend profile sync error:", apiErr);
      const friendlyMsg = getUserFriendlyErrorMessage(apiErr, "profile");
      setFormError(friendlyMsg);
      toast.error("Save Failed", friendlyMsg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const itemToDelete = experiences.find((e) => e.id === id);
    const updated = experiences.filter((e) => e.id !== id);
    setExperiences(updated);
    const ok = await syncExperienceData(updated);
    if (ok) {
      toast.info("Experience Removed", `Removed "${itemToDelete?.role || "Entry"}" from your profile.`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};

    if (!role.trim()) {
      errors.role = "Job title / designation is required.";
    } else if (role.trim().length < 2) {
      errors.role = "Job title must be at least 2 characters long.";
    } else if (role.trim().length > 100) {
      errors.role = "Job title cannot exceed 100 characters.";
    }

    if (!company.trim()) {
      errors.company = "Company / organisation name is required.";
    } else if (company.trim().length < 2) {
      errors.company = "Company name must be at least 2 characters long.";
    } else if (company.trim().length > 150) {
      errors.company = "Company name cannot exceed 150 characters.";
    }

    if (location.trim().length > 100) {
      errors.location = "Location cannot exceed 100 characters.";
    }

    if (!startDate.trim()) {
      errors.startDate = "Please select a valid start date from the calendar.";
    } else {
      const startD = new Date(startDate);
      const maxFuture = new Date();
      maxFuture.setDate(maxFuture.getDate() + 30);
      if (isNaN(startD.getTime())) {
        errors.startDate = "Please enter a valid start date.";
      } else if (startD > maxFuture) {
        errors.startDate = "Start date cannot be in the future.";
      }
    }

    if (!currentRole) {
      if (!endDate.trim()) {
        errors.endDate = "Please select an end date or check 'Currently working here'.";
      } else {
        const endD = new Date(endDate);
        if (isNaN(endD.getTime())) {
          errors.endDate = "Please enter a valid end date.";
        } else if (startDate.trim() && endD < new Date(startDate)) {
          errors.endDate = "End date cannot be earlier than start date.";
        }
      }
    }

    if (description.trim().length > 2000) {
      errors.description = "Description cannot exceed 2000 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Please fix the highlighted errors before saving.");
      return;
    }

    const parsedSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newItem: WorkExperienceItem = {
      id: editingId || `exp-${Date.now()}`,
      role: role.trim(),
      company: company.trim(),
      employmentType: employmentType.trim(),
      location: location.trim(),
      startDate: startDate.trim(),
      endDate: currentRole ? "Present" : endDate.trim(),
      currentRole,
      skills: parsedSkills,
      description: description.trim(),
    };

    let updatedList: WorkExperienceItem[];
    if (editingId) {
      updatedList = experiences.map((item) => (item.id === editingId ? newItem : item));
    } else {
      updatedList = [newItem, ...experiences];
    }

    const ok = await syncExperienceData(updatedList);
    if (ok) {
      setExperiences(updatedList);
      setIsFormOpen(false);
      setEditingId(null);
      setRole("");
      setCompany("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setCurrentRole(false);
      setSkillsInput("");
      setDescription("");
      setFormError("");
      setFieldErrors({});
      toast.success(
        editingId ? "Experience Updated" : "Experience Added",
        `"${newItem.role}" at ${newItem.company} has been saved to your profile.`
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Work Experience</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Showcase your career history, accomplishments, and professional milestones
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#2447d8] shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Experience
          </button>
        )}
      </div>

      <div className="mt-6">
        {/* Add/Edit Form */}
        {isFormOpen ? (
          <form
            onSubmit={handleSave}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#2f54eb]" />
                {editingId ? "Edit Work Experience" : "Add Work Experience"}
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Fields with * are mandatory</span>
            </div>

            {formError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Job Title */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Job Title / Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  maxLength={100}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (fieldErrors.role) setFieldErrors((prev) => ({ ...prev, role: "" }));
                  }}
                  placeholder="e.g. Senior Full Stack Developer"
                  className={`h-10 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-3.5 text-xs text-slate-900 dark:text-white outline-none transition ${
                    fieldErrors.role ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                {fieldErrors.role && <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.role}</p>}
              </div>

              {/* Company Name */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Company / Organisation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  maxLength={150}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (fieldErrors.company) setFieldErrors((prev) => ({ ...prev, company: "" }));
                  }}
                  placeholder="e.g. Voctrum Technologies"
                  className={`h-10 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-3.5 text-xs text-slate-900 dark:text-white outline-none transition ${
                    fieldErrors.company ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                {fieldErrors.company && <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.company}</p>}
              </div>

              {/* Employment Type */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-3.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] transition cursor-pointer"
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Location / Workplace <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={location}
                  maxLength={100}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (fieldErrors.location) setFieldErrors((prev) => ({ ...prev, location: "" }));
                  }}
                  placeholder="e.g. New York, NY or Remote"
                  className={`h-10 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-3.5 text-xs text-slate-900 dark:text-white outline-none transition ${
                    fieldErrors.location ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                {fieldErrors.location && <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.location}</p>}
              </div>

              {/* Start Date */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (fieldErrors.startDate) setFieldErrors((prev) => ({ ...prev, startDate: "" }));
                    }}
                    className={`h-10 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-3.5 text-xs text-slate-900 dark:text-white outline-none transition [color-scheme:light] dark:[color-scheme:dark] cursor-pointer ${
                      fieldErrors.startDate ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                    }`}
                  />
                </div>
                {fieldErrors.startDate && <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.startDate}</p>}
              </div>

              {/* End Date with Present toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    End Date {!currentRole && <span className="text-red-500">*</span>}
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentRole}
                      onChange={(e) => {
                        setCurrentRole(e.target.checked);
                        if (e.target.checked) {
                          setEndDate("");
                          if (fieldErrors.endDate) setFieldErrors((prev) => ({ ...prev, endDate: "" }));
                        }
                      }}
                      className="rounded border-slate-300 text-[#2f54eb] focus:ring-[#2f54eb]"
                    />
                    <span className="font-medium text-[#2f54eb] dark:text-blue-400">Currently working here</span>
                  </label>
                </div>
                {currentRole ? (
                  <div className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3.5 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Present (Current Role)
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (fieldErrors.endDate) setFieldErrors((prev) => ({ ...prev, endDate: "" }));
                      }}
                      className={`h-10 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-3.5 text-xs text-slate-900 dark:text-white outline-none transition [color-scheme:light] dark:[color-scheme:dark] cursor-pointer ${
                        fieldErrors.endDate ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                      }`}
                    />
                  </div>
                )}
                {fieldErrors.endDate && <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.endDate}</p>}
              </div>

              {/* Skills Used */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Key Skills & Technologies Used <span className="text-slate-400 font-normal">(Comma-separated, optional)</span>
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. React, TypeScript, Next.js, PostgreSQL, Docker, AWS"
                  className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-3.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] transition"
                />
              </div>

              {/* Description & Responsibilities */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Roles, Responsibilities & Accomplishments <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className={`text-[11px] ${description.length > 1900 ? "text-amber-500 font-semibold" : "text-slate-400"}`}>
                    {description.length}/2000
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  maxLength={2000}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (fieldErrors.description) setFieldErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  placeholder="Describe your daily responsibilities, architecture design contributions, leadership, or major impact on projects..."
                  className={`w-full rounded-lg border bg-white dark:bg-[#1a1a1a] p-3 text-xs text-slate-900 dark:text-white outline-none transition resize-y ${
                    fieldErrors.description ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                {fieldErrors.description && <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.description}</p>}
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId(null);
                  setFormError("");
                  setFieldErrors({});
                }}
                disabled={saving}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#2447d8] shadow-sm cursor-pointer disabled:opacity-75"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Save Experience
                  </>
                )}
              </button>
            </div>
          </form>
        ) : experiences.length === 0 ? (
          /* Clean Empty State */
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center bg-slate-50/50 dark:bg-[#1a1a1a]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2f54eb] dark:text-blue-400">
              <Briefcase className="h-7 w-7" />
            </div>
            <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No Work Experience Listed</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Adding your current and past work roles significantly improves recruiter visibility and boosts your profile rating.
            </p>
            <button
              onClick={openAddForm}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2447d8] shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Work Experience
            </button>
          </div>
        ) : (
          /* Experience Cards List */
          <div className="flex flex-col gap-4">
            {experiences.map((item) => {
              const initials = item.company
                ? item.company
                    .split(" ")
                    .filter(Boolean)
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "WE";
              const displayStart = formatDateDisplay(item.startDate);
              const displayEnd = item.currentRole || item.endDate === "Present" ? "Present" : formatDateDisplay(item.endDate);
              const durationStr = displayStart ? `${displayStart} — ${displayEnd || "Present"}` : (item.currentRole ? "Current Role" : "");

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar / Initials */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 font-bold text-[#2f54eb] text-sm">
                        {initials}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">
                            {item.role}
                          </h4>
                          {item.employmentType && (
                            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                              {item.employmentType}
                            </span>
                          )}
                          {item.currentRole && (
                            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                              Current Role
                            </span>
                          )}
                        </div>

                        {/* Company, Location, Duration */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                            <Building2 className="h-3.5 w-3.5 text-[#2f54eb]" />
                            {item.company}
                          </span>
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {item.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                            {durationStr}
                          </span>
                        </div>

                        {/* Description */}
                        {item.description && (
                          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line pt-1">
                            {item.description}
                          </p>
                        )}

                        {/* Skills */}
                        {item.skills && item.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                            {item.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditForm(item)}
                        disabled={saving}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Edit Experience"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={saving}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                        title="Delete Experience"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
