"use client";

import { useState } from "react";
import { Pencil, CheckCircle2, AlertCircle, Loader2, MapPin } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { profileService, validateProfileUpdate } from "../../../../services/profile";
import { toast } from "../../../components/Toast";

export default function BasicDetailsTab() {
  const { user, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const firstName = (formData.get("firstName") as string || "").trim();
    const lastName = (formData.get("lastName") as string || "").trim();
    const contactNumber = (formData.get("contactNumber") as string || "").trim();
    const addressLine1 = (formData.get("addressLine1") as string || "").trim();
    const addressLine2 = (formData.get("addressLine2") as string || "").trim();
    const city = (formData.get("city") as string || "").trim();
    const state = (formData.get("state") as string || "").trim();
    const country = (formData.get("country") as string || "").trim();
    const postalCode = (formData.get("postalCode") as string || "").trim();

    const fullName = `${firstName} ${lastName}`.trim();

    const validation = validateProfileUpdate({
      name: fullName,
      contactNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
    });

    if (!firstName) {
      validation.errors.firstName = "First name is required.";
      validation.isValid = false;
    }
    if (!lastName) {
      validation.errors.lastName = "Last name is required.";
      validation.isValid = false;
    }
    if (!contactNumber) {
      validation.errors.contactNumber = "Contact number is required.";
      validation.isValid = false;
    }

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await profileService.updateProfile({
        name: fullName,
        contactNumber,
        addressLine1: addressLine1 || null,
        addressLine2: addressLine2 || null,
        city: city || null,
        state: state || null,
        country: country || null,
        postalCode: postalCode || null,
      });

      await refreshProfile();
      setSuccessMessage("Profile details updated successfully!");
      toast.success("Profile Updated", "Your personal details and address have been saved successfully.");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      console.error("Failed to update profile", err);
      setApiError(err.message || "Failed to update profile. Please try again.");
      toast.error("Update Failed", err.message || "Failed to update profile details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const address = user?.address || {};
  const displayAddressLine1 = user?.addressLine1 || address.addressLine1 || "";
  const displayAddressLine2 = user?.addressLine2 || address.addressLine2 || "";
  const displayCity = user?.city || address.city || user?.currentLocation || "";
  const displayState = user?.state || address.state || "";
  const displayCountry = user?.country || address.country || "";
  const displayPostalCode = user?.postalCode || address.postalCode || "";

  const initials = (user?.firstName && user?.lastName)
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.name
    ? user.name.split(" ").filter(Boolean).map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "CP";

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Basic Details & Address</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Manage your personal contact and address information
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setApiError("");
              setFormErrors({});
            }}
            className="flex items-center gap-2 rounded-lg bg-[#2f54eb] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2447d8]"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit Profile
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

      <div className="mt-8 flex flex-col md:flex-row items-start gap-8">
        {/* Candidate Avatar Initials - NO profile picture */}
        <div className="relative shrink-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-slate-100 dark:border-slate-800 bg-gradient-to-br from-[#2f54eb] to-indigo-600 text-2xl font-black text-white shadow-sm ring-2 ring-slate-200/50 dark:ring-slate-700/50">
            {initials}
          </div>
        </div>

        {/* Details / Form */}
        <div className="flex-1 w-full">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  type="text"
                  defaultValue={user?.firstName || ""}
                  className={`h-11 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none transition ${
                    formErrors.firstName ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                  placeholder="e.g. John"
                />
                {formErrors.firstName && <p className="mt-1 text-xs text-rose-500">{formErrors.firstName}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  type="text"
                  defaultValue={user?.lastName || ""}
                  className={`h-11 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none transition ${
                    formErrors.lastName ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                  placeholder="e.g. Doe"
                />
                {formErrors.lastName && <p className="mt-1 text-xs text-rose-500">{formErrors.lastName}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Email <span className="text-xs text-slate-400 font-normal">(Account Email)</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-4 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="contactNumber"
                  type="tel"
                  defaultValue={user?.contactNumber || user?.mobile || ""}
                  className={`h-11 w-full rounded-lg border bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none transition ${
                    formErrors.contactNumber ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                  placeholder="e.g. +1 555-0199 or 9876543210"
                />
                {formErrors.contactNumber && <p className="mt-1 text-xs text-rose-500">{formErrors.contactNumber}</p>}
              </div>

              {/* Address Header */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#2f54eb]" /> Address Information
                </h4>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Address Line 1
                </label>
                <input
                  name="addressLine1"
                  type="text"
                  defaultValue={displayAddressLine1}
                  className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb]"
                  placeholder="Street address, P.O. box, company name"
                />
                {formErrors.addressLine1 && <p className="mt-1 text-xs text-rose-500">{formErrors.addressLine1}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Address Line 2
                </label>
                <input
                  name="addressLine2"
                  type="text"
                  defaultValue={displayAddressLine2}
                  className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb]"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
                {formErrors.addressLine2 && <p className="mt-1 text-xs text-rose-500">{formErrors.addressLine2}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  City
                </label>
                <input
                  name="city"
                  type="text"
                  defaultValue={displayCity}
                  className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb]"
                  placeholder="City"
                />
                {formErrors.city && <p className="mt-1 text-xs text-rose-500">{formErrors.city}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  State / Province
                </label>
                <input
                  name="state"
                  type="text"
                  defaultValue={displayState}
                  className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb]"
                  placeholder="State / Province"
                />
                {formErrors.state && <p className="mt-1 text-xs text-rose-500">{formErrors.state}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Country
                </label>
                <input
                  name="country"
                  type="text"
                  defaultValue={displayCountry}
                  className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb]"
                  placeholder="Country"
                />
                {formErrors.country && <p className="mt-1 text-xs text-rose-500">{formErrors.country}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Postal / ZIP Code
                </label>
                <input
                  name="postalCode"
                  type="text"
                  defaultValue={displayPostalCode}
                  className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-[#2f54eb]"
                  placeholder="Postal Code"
                />
                {formErrors.postalCode && <p className="mt-1 text-xs text-rose-500">{formErrors.postalCode}</p>}
              </div>

              <div className="sm:col-span-2 mt-4 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormErrors({});
                  }}
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
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="text-[12px] font-semibold text-slate-400">Full Name</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">
                  {user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Not provided")}
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">Email</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">{user?.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">Contact Number</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">
                  {user?.contactNumber || user?.mobile || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">City / Location</p>
                <p className="mt-1 text-[15px] font-semibold text-slate-900 dark:text-white">
                  {displayCity || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">Address</p>
                <p className="mt-1 text-[14px] text-slate-700 dark:text-slate-300">
                  {displayAddressLine1 || displayAddressLine2
                    ? [displayAddressLine1, displayAddressLine2].filter(Boolean).join(", ")
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-400">State & Country</p>
                <p className="mt-1 text-[14px] text-slate-700 dark:text-slate-300">
                  {displayState || displayCountry
                    ? [displayState, displayCountry, displayPostalCode].filter(Boolean).join(", ")
                    : "Not provided"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
