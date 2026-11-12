"use client";

import { useState } from "react";
import {
  X,
  Send,
  HeadphonesIcon,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "../../../components/Toast";

interface SupportTicketModalProps {
  onClose: () => void;
  initialSubject?: string;
}

export default function SupportTicketModal({
  onClose,
  initialSubject = "",
}: SupportTicketModalProps) {
  const { user, tenant } = useAuth();

  const [category, setCategory] = useState("Application Status & Screening");
  const [priority, setPriority] = useState<"Normal" | "High" | "Urgent">("Normal");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState<{ id: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!subject.trim()) {
      setError("Please provide a subject for your ticket.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Please provide a detailed description (at least 10 characters).");
      return;
    }

    setLoading(true);
    try {
      // Simulate ticket generation and persistence
      await new Promise((resolve) => setTimeout(resolve, 800));

      const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      const newTicket = {
        id: ticketId,
        subject: subject.trim(),
        category,
        priority,
        message: message.trim(),
        attachmentName,
        candidateName: user?.name || "Candidate",
        candidateEmail: user?.email || "candidate@email.com",
        createdAt: new Date().toISOString(),
        status: "Open",
      };

      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("candidate_support_tickets") || "[]";
          const list = JSON.parse(raw);
          list.unshift(newTicket);
          localStorage.setItem("candidate_support_tickets", JSON.stringify(list));
        } catch {}
      }

      setTicketSuccess({ id: ticketId });
      toast.success(
        "Support Ticket Submitted!",
        `Ticket #${ticketId} created. Our support team will follow up at ${user?.email || "your email"}.`
      );
    } catch {
      setError("Failed to submit support ticket. Please try again.");
      toast.error("Submission Failed", "Could not submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("File Too Large", "Please select a file smaller than 5MB.");
        return;
      }
      setAttachmentName(file.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#18181b]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2f54eb]/10 text-[#2f54eb] dark:bg-blue-900/30 dark:text-blue-400">
              <HeadphonesIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Contact Support &amp; Submit Ticket
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {tenant?.companyName || "Candidate"} Support Team
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        {ticketSuccess ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-xs">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Ticket Submitted Successfully
            </h4>
            <p className="mt-1 text-xs font-semibold text-[#2f54eb] dark:text-blue-400">
              Reference #{ticketSuccess.id}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Our support team has received your inquiry. A confirmation receipt has been sent to{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                {user?.email || "your registered email"}
              </strong>
              . Expected response time is within 24 business hours.
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#2f54eb] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2447d8] cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Candidate Pre-fill banner */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#fafbfc] px-4 py-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
              <div>
                <span className="font-bold text-slate-800 dark:text-white">
                  {user?.name || "Candidate"}
                </span>{" "}
                ({user?.email || "candidate@email.com"})
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                Active Session
              </span>
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Inquiry Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none transition focus:border-[#2f54eb] dark:border-slate-700 dark:bg-[#1a1a1a] dark:text-slate-200"
                >
                  <option value="Application Status & Screening">Application Status &amp; Screening</option>
                  <option value="Profile Details & Resume Upload">Profile &amp; Resume Upload</option>
                  <option value="Account, Login & Credentials">Account &amp; Authentication</option>
                  <option value="Job Search & Alerts">Job Search &amp; Alerts</option>
                  <option value="Technical Issue or Bug">Technical Issue / Bug</option>
                  <option value="General Inquiry">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-1.5 h-10">
                  {(["Normal", "High", "Urgent"] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex items-center justify-center rounded-xl text-xs font-semibold transition cursor-pointer ${
                        priority === p
                          ? "bg-[#2f54eb] text-white shadow-xs"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a1a1a] dark:text-slate-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject / Issue Summary
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your inquiry..."
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#2f54eb] dark:border-slate-700 dark:bg-[#1a1a1a] dark:text-slate-200"
                required
              />
            </div>

            {/* Description / Message */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message / Full Description
                </label>
                <span className="text-[11px] text-slate-400">
                  {message.length} characters
                </span>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your question or issue in detail so our support team can assist you efficiently..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#2f54eb] dark:border-slate-700 dark:bg-[#1a1a1a] dark:text-slate-200"
                required
              />
            </div>

            {/* File Attachment */}
            <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 p-3 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                <Paperclip className="h-4 w-4 text-[#2f54eb]" />
                <span>{attachmentName ? attachmentName : "Attach Screenshot / Document (Optional)"}</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
              </label>
              {attachmentName && (
                <button
                  type="button"
                  onClick={() => setAttachmentName(null)}
                  className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2f54eb] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2447d8] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Ticket</span>
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

