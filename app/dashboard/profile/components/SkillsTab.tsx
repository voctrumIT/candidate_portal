"use client";

import { useState, useEffect } from "react";
import { Plus, X, Search, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { profileService } from "../../../../services/profile";
import { toast } from "../../../components/Toast";

const DEFAULT_SUGGESTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "UI/UX Design",
  "Figma",
  "Tailwind CSS",
  "HTML & CSS",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Git & GitHub",
  "REST APIs",
  "GraphQL",
  "Docker",
  "AWS",
  "Agile Methodologies",
  "Communication",
  "Problem Solving",
  "Project Management",
];

export default function SkillsTab() {
  const { user, refreshProfile } = useAuth();
  const [skills, setSkills] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    if (user?.skills && Array.isArray(user.skills)) {
      setSkills(user.skills);
    }
  }, [user?.skills]);

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) {
      setInputError("Skill name cannot be empty.");
      return;
    }
    if (trimmed.length > 50) {
      setInputError("Skill name cannot exceed 50 characters.");
      return;
    }
    const alreadyExists = skills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      setInputError(`"${trimmed}" is already added to your skills.`);
      return;
    }

    setSkills((prev) => [...prev, trimmed]);
    setCustomInput("");
    setInputError("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
    setInputError("");
  };

  const handleSave = async () => {
    setLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await profileService.updateProfile({ skills });
      await refreshProfile();
      setSuccessMessage("Skills updated successfully!");
      toast.success("Skills Updated", "Your profile skills have been saved successfully.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      console.error("Failed to update skills", err);
      setApiError(err.message || "Failed to update skills. Please try again.");
      toast.error("Skills Update Failed", err.message || "Failed to save skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = DEFAULT_SUGGESTIONS.filter(
    (item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase().trim()) &&
      !skills.some((s) => s.toLowerCase() === item.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Your Skills</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Add relevant skills to match with job opportunities
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-[#2f54eb] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2447d8] disabled:opacity-70 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
            </>
          ) : (
            "Save Skills"
          )}
        </button>
      </div>

      {successMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {apiError && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3.5 text-sm font-medium text-rose-800 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Selected Skills List */}
      <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Selected Skills ({skills.length})
          </h4>
          {skills.length > 0 && (
            <button
              onClick={() => setSkills([])}
              className="text-xs text-rose-500 hover:text-rose-600 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {skills.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No skills added yet. Select from suggestions below or type a custom skill.</p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-xs transition"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-blue-500 hover:bg-blue-200/60 dark:hover:bg-blue-800 hover:text-blue-900 transition"
                  title={`Remove ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Skill & Search */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Custom Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Add Custom Skill
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setInputError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(customInput);
                }
              }}
              placeholder="e.g. Kotlin, Docker, Figma..."
              className="h-11 flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb]"
            />
            <button
              type="button"
              onClick={() => addSkill(customInput)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-5 text-xs font-semibold text-white transition hover:bg-[#2447d8]"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          {inputError && <p className="mt-1 text-xs text-rose-500">{inputError}</p>}
        </div>

        {/* Filter Suggestions */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Search Suggested Skills
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter suggested skills..."
              className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] pl-10 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb]"
            />
          </div>
        </div>
      </div>

      {/* Suggested Skills Section */}
      <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Popular &amp; Trending Skills (Click to add)
        </h4>

        <div className="flex flex-wrap gap-2">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition hover:border-[#2f54eb] hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#2f54eb]"
              >
                <Plus className="h-3 w-3" />
                {skill}
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-400">All matching suggestions have been added.</p>
          )}
        </div>
      </div>
    </div>
  );
}
