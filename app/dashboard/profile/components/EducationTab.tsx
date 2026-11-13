"use client";

import { useState } from "react";
import { Plus, GraduationCap, CalendarDays, Trash2, Pencil, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { profileService, EducationDto, validateProfileUpdate } from "../../../../services/profile";
import { toast } from "../../../components/Toast";
import { getUserFriendlyErrorMessage } from "../../../../lib/errorUtils";

export default function EducationTab() {
  const { user, refreshProfile } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form states
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [grade, setGrade] = useState("");
  const [yearOfPassing, setYearOfPassing] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const currentEducations: EducationDto[] = Array.isArray(user?.educations) ? user.educations : [];

  const openAddForm = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setInstitution("");
    setDegree("");
    setGrade("");
    setYearOfPassing("");
    setStartDate("");
    setEndDate("");
    setFormErrors({});
    setApiError("");
  };

  const openEditForm = (index: number) => {
    const item = currentEducations[index];
    if (!item) return;
    setEditingIndex(index);
    setIsAdding(false);
    setInstitution(item.institution || "");
    setDegree(item.degree || "");
    setGrade(item.grade || "");
    setYearOfPassing(item.yearOfPassing ? String(item.yearOfPassing) : "");
    setStartDate(item.startDate ? item.startDate.slice(0, 10) : "");
    setEndDate(item.endDate ? item.endDate.slice(0, 10) : "");
    setFormErrors({});
    setApiError("");
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setFormErrors({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setApiError("");

    const parsedYear = yearOfPassing.trim() ? parseInt(yearOfPassing.trim(), 10) : null;
    const itemToSave: EducationDto = {
      institution: institution.trim(),
      degree: degree.trim(),
      grade: grade.trim() || null,
      yearOfPassing: parsedYear,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
    };

    const validation = validateProfileUpdate({
      educations: [itemToSave],
    });

    if (!itemToSave.institution) {
      validation.errors.institution = "Institution or university is required.";
      validation.isValid = false;
    } else if (itemToSave.institution.length < 2) {
      validation.errors.institution = "Institution name must be at least 2 characters.";
      validation.isValid = false;
    }

    if (!itemToSave.degree) {
      validation.errors.degree = "Degree or qualification is required.";
      validation.isValid = false;
    } else if (itemToSave.degree.length < 2) {
      validation.errors.degree = "Degree must be at least 2 characters.";
      validation.isValid = false;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      validation.errors.endDate = "End date cannot be earlier than start date.";
      validation.isValid = false;
    }

    if (yearOfPassing.trim()) {
      const year = parseInt(yearOfPassing.trim(), 10);
      if (isNaN(year) || year < 1950 || year > 2100) {
        validation.errors.yearOfPassing = "Please enter a valid year between 1950 and 2100.";
        validation.isValid = false;
      }
    }

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      let updatedList: EducationDto[];
      if (editingIndex !== null) {
        updatedList = currentEducations.map((item, idx) => (idx === editingIndex ? itemToSave : item));
      } else {
        updatedList = [...currentEducations, itemToSave];
      }

      await profileService.updateProfile({ educations: updatedList });
      await refreshProfile();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("candidate_profile_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      setSuccessMessage(editingIndex !== null ? "Education updated successfully!" : "Education added successfully!");
      toast.success(
        editingIndex !== null ? "Education Updated" : "Education Added",
        `"${itemToSave.degree}" at ${itemToSave.institution} has been saved.`
      );
      closeForm();
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      console.error("Failed to save education", err);
      const friendlyMsg = getUserFriendlyErrorMessage(err, "profile");
      setApiError(friendlyMsg);
      toast.error("Save Failed", friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this education record?")) return;

    setLoading(true);
    setApiError("");
    try {
      const itemToDelete = currentEducations[index];
      const updatedList = currentEducations.filter((_, idx) => idx !== index);
      await profileService.updateProfile({ educations: updatedList });
      await refreshProfile();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("candidate_profile_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      setSuccessMessage("Education record removed successfully.");
      toast.info("Education Removed", `Removed "${itemToDelete?.degree || "Record"}" from your profile.`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      console.error("Failed to delete education", err);
      setApiError(err.message || "Failed to remove education.");
      toast.error("Remove Failed", err.message || "Failed to remove education record.");
    } finally {
      setLoading(false);
    }
  };

  const isFormOpen = isAdding || editingIndex !== null;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Education Background</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Showcase your academic credentials and qualifications
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-lg bg-[#2f54eb] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2447d8]"
          >
            <Plus className="h-3.5 w-3.5" /> Add Education
          </button>
        )}
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

      <div className="mt-8">
        {isFormOpen ? (
          <form onSubmit={handleSave} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-6">
              {editingIndex !== null ? "Edit Education" : "Add Education Record"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Institution / University <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Stanford University or NIT Srinagar"
                  className={`h-11 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none transition ${
                    formErrors.institution || formErrors.education_0_institution
                      ? "border-rose-400"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                {(formErrors.institution || formErrors.education_0_institution) && (
                  <p className="mt-1 text-xs text-rose-500">{formErrors.institution || formErrors.education_0_institution}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Degree / Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className={`h-11 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none transition ${
                    formErrors.degree || formErrors.education_0_degree
                      ? "border-rose-400"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                {(formErrors.degree || formErrors.education_0_degree) && (
                  <p className="mt-1 text-xs text-rose-500">{formErrors.degree || formErrors.education_0_degree}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Grade / GPA <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. 3.8 / 4.0 or First Class with Distinction"
                  className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Year of Passing <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="1950"
                  max="2100"
                  value={yearOfPassing}
                  onChange={(e) => setYearOfPassing(e.target.value)}
                  placeholder="e.g. 2024"
                  className={`h-11 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none transition ${
                    formErrors.yearOfPassing || formErrors.education_0_year
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                {(formErrors.yearOfPassing || formErrors.education_0_year) && (
                  <p className="mt-1 text-xs text-rose-500">{formErrors.yearOfPassing || formErrors.education_0_year}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Start Date <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none transition [color-scheme:light] dark:[color-scheme:dark] ${
                    formErrors.startDate
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                {formErrors.startDate && <p className="mt-1 text-xs text-rose-500">{formErrors.startDate}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  End Date <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`h-11 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none transition [color-scheme:light] dark:[color-scheme:dark] ${
                    formErrors.endDate
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                {formErrors.endDate && <p className="mt-1 text-xs text-rose-500">{formErrors.endDate}</p>}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeForm}
                className="h-10 rounded-lg border border-slate-200 dark:border-slate-700 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2f54eb] px-8 text-sm font-semibold text-white transition hover:bg-[#2447d8] disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Education"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            {currentEducations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] p-10 text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">No education records added</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Add your degree, university, and academic details to strengthen your profile for recruiters.
                </p>
                <button
                  onClick={openAddForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2f54eb] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2447d8]"
                >
                  <Plus className="h-4 w-4" /> Add Education Record
                </button>
              </div>
            ) : (
              currentEducations.map((item, index) => {
                const datesDisplay = [
                  item.startDate ? new Date(item.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : null,
                  item.endDate ? new Date(item.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : null,
                ].filter(Boolean).join(" - ") || (item.yearOfPassing ? `Class of ${item.yearOfPassing}` : "");

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2f54eb] border border-blue-100 dark:border-blue-900">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-[16px] font-bold text-slate-900 dark:text-white">{item.degree}</h4>
                          <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-300">{item.institution}</p>

                          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            {datesDisplay && (
                              <span className="flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                {datesDisplay}
                              </span>
                            )}
                            {item.grade && (
                              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300">
                                Grade: {item.grade}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditForm(index)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
