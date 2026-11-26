"use client";

import { useState, useMemo, useEffect, useId } from "react";
import {
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Mail,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth";
import { emailService } from "../../services/email";
import { getUserFriendlyErrorMessage } from "../../lib/errorUtils";
import { toast } from "./Toast";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { user } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const oldId = useId();
  const newId = useId();
  const confirmId = useId();

  // Reset form upon opening
  useEffect(() => {
    if (isOpen) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
      setFieldErrors({});
      setError("");
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  // Live password strength
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, text: "", color: "bg-slate-200", textColor: "text-slate-400" };
    if (newPassword.length < 6) {
      return { score: 1, text: "Too short (min 6 characters)", color: "bg-rose-500", textColor: "text-rose-500" };
    }
    const hasNum = /\d/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);

    let score = 1;
    if (hasNum) score++;
    if (hasSpecial || hasUpper) score++;

    if (score === 3 && newPassword.length >= 8) {
      return { score: 3, text: "Strong password", color: "bg-emerald-500", textColor: "text-emerald-500" };
    }
    if (score >= 2) {
      return { score: 2, text: "Good password", color: "bg-amber-500", textColor: "text-amber-500" };
    }
    return { score: 1, text: "Weak password", color: "bg-rose-500", textColor: "text-rose-500" };
  }, [newPassword]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!oldPassword) {
      errs.oldPassword = "Current password is required.";
    }

    if (!newPassword) {
      errs.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      errs.newPassword = "New password must be at least 6 characters long.";
    } else if (oldPassword && newPassword === oldPassword) {
      errs.newPassword = "New password cannot be identical to your current password.";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required.";
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    const email =
      user?.email ||
      (typeof window !== "undefined" ? localStorage.getItem("candidate_email") : null);

    if (!email) {
      setError("Unable to identify account email. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      // 1. Submit password change to backend endpoint
      await authService.changePassword({
        email: email.trim(),
        oldPassword,
        newPassword,
      });

      // 2. Dispatch automated security notification email to candidate
      try {
        await emailService.sendPasswordChangedEmail(email.trim(), user?.name || "Candidate");
      } catch (mailErr) {
        console.warn("Could not dispatch password change notification email:", mailErr);
      }

      setSuccess(true);
      toast.success(
        "Password Updated Successfully!",
        `Your password was updated. A security confirmation email was sent to ${email}.`
      );

      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err: any) {
      const errorMsg = getUserFriendlyErrorMessage(err, "general");
      setError(errorMsg);
      toast.error("Change Password Notice", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[480px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-2xl transition-all my-8 z-10">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close modal"
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#2f54eb] dark:text-blue-400 mb-3">
            <Lock className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Change Account Password
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Keep your candidate account protected with a strong, secure password
          </p>
        </div>

        {/* Success View */}
        {success ? (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Password Changed Successfully!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              A security confirmation email has been sent to your registered address.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <Mail className="h-3.5 w-3.5" />
                <span>Confirmation Email Dispatched</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 space-y-4">
            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-medium text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label
                htmlFor={oldId}
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
              >
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={oldId}
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    if (fieldErrors.oldPassword) {
                      setFieldErrors((prev) => ({ ...prev, oldPassword: "" }));
                    }
                  }}
                  placeholder="Enter current password"
                  className={`h-11 w-full rounded-xl border bg-white dark:bg-[#1f1f23] pl-3.5 pr-10 text-sm text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-[#2f54eb]/20 ${
                    fieldErrors.oldPassword
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  aria-label={showOld ? "Hide current password" : "Show current password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.oldPassword && (
                <p className="mt-1 text-xs font-medium text-rose-500 pl-1">{fieldErrors.oldPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor={newId}
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={newId}
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (fieldErrors.newPassword) {
                      setFieldErrors((prev) => ({ ...prev, newPassword: "" }));
                    }
                  }}
                  placeholder="Min 6 characters (e.g. Pass@123)"
                  className={`h-11 w-full rounded-xl border bg-white dark:bg-[#1f1f23] pl-3.5 pr-10 text-sm text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-[#2f54eb]/20 ${
                    fieldErrors.newPassword
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.newPassword && (
                <p className="mt-1 text-xs font-medium text-rose-500 pl-1">{fieldErrors.newPassword}</p>
              )}

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1.5 h-1.5">
                    <div
                      className={`flex-1 rounded-full transition-colors ${
                        passwordStrength.score >= 1 ? passwordStrength.color : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full transition-colors ${
                        passwordStrength.score >= 2 ? passwordStrength.color : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full transition-colors ${
                        passwordStrength.score >= 3 ? passwordStrength.color : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Strength:</span>
                    <span className={`font-semibold ${passwordStrength.textColor}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor={confirmId}
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
              >
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={confirmId}
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
                  placeholder="Re-type new password"
                  className={`h-11 w-full rounded-xl border bg-white dark:bg-[#1f1f23] pl-3.5 pr-10 text-sm text-slate-900 dark:text-white outline-none transition focus:ring-2 focus:ring-[#2f54eb]/20 ${
                    fieldErrors.confirmPassword
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#2f54eb]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs font-medium text-rose-500 pl-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Security Notice */}
            <div className="rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-3 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2f54eb] dark:text-blue-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Security Assurance</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                Upon updating, a security confirmation email will be dispatched to your account address.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="h-10 px-5 rounded-xl bg-[#2f54eb] hover:bg-[#2447d8] text-xs font-bold text-white shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

