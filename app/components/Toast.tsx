"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (type: ToastType, title: string, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Standalone global trigger function so any file or helper can trigger toasts without hook injection
export const toast = {
  success: (title: string, message?: string, duration = 4000) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app_toast", {
          detail: {
            type: "success",
            title,
            message: message || "",
            duration,
          },
        })
      );
    }
  },
  error: (title: string, message?: string, duration = 5000) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app_toast", {
          detail: {
            type: "error",
            title,
            message: message || "",
            duration,
          },
        })
      );
    }
  },
  info: (title: string, message?: string, duration = 4000) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app_toast", {
          detail: {
            type: "info",
            title,
            message: message || "",
            duration,
          },
        })
      );
    }
  },
  warning: (title: string, message?: string, duration = 4500) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app_toast", {
          detail: {
            type: "warning",
            title,
            message: message || "",
            duration,
          },
        })
      );
    }
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, message: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setToasts((prev) => {
        // Limit to max 4 concurrent toasts for a clean UI
        const updated = [...prev, { id, type, title, message, duration }];
        return updated.slice(-4);
      });
    },
    []
  );

  useEffect(() => {
    const handleCustomToast = (e: any) => {
      const detail = e.detail;
      if (detail && detail.title) {
        addToast(detail.type || "info", detail.title, detail.message || "", detail.duration);
      }
    };

    window.addEventListener("app_toast", handleCustomToast);
    return () => {
      window.removeEventListener("app_toast", handleCustomToast);
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warning,
    };
  }
  return {
    success: (title: string, message?: string, duration?: number) =>
      context.addToast("success", title, message || "", duration),
    error: (title: string, message?: string, duration?: number) =>
      context.addToast("error", title, message || "", duration),
    info: (title: string, message?: string, duration?: number) =>
      context.addToast("info", title, message || "", duration),
    warning: (title: string, message?: string, duration?: number) =>
      context.addToast("warning", title, message || "", duration),
    removeToast: context.removeToast,
  };
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[999999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onRemove={() => onRemove(item.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({
  item,
  onRemove,
}: {
  item: ToastItem;
  onRemove: () => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const remainingRef = useRef(item.duration || 4000);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onRemove();
      }, remainingRef.current);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - startTimeRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, onRemove]);

  const config = {
    success: {
      icon: CheckCircle2,
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80",
      accentBar: "bg-emerald-500",
    },
    error: {
      icon: AlertCircle,
      badgeBg: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/80",
      accentBar: "bg-rose-500",
    },
    info: {
      icon: Info,
      badgeBg: "bg-blue-50 dark:bg-blue-950/60 text-[#2f54eb] dark:text-blue-400 border-blue-200/80 dark:border-blue-800/80",
      accentBar: "bg-[#2f54eb]",
    },
    warning: {
      icon: AlertTriangle,
      badgeBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/80",
      accentBar: "bg-amber-500",
    },
  }[item.type];

  const IconComponent = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.92 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="pointer-events-auto relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-[#18181b]/95 p-4 shadow-xl shadow-slate-900/10 dark:shadow-black/60 backdrop-blur-md"
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${config.badgeBg}`}
        >
          <IconComponent className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-white leading-tight">
            {item.title}
          </h4>
          {item.message && (
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Subtle bottom progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-100 dark:bg-slate-800">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: isPaused ? undefined : "0%" }}
          transition={{
            duration: (item.duration || 4000) / 1000,
            ease: "linear",
          }}
          className={`h-full ${config.accentBar}`}
        />
      </div>
    </motion.div>
  );
}

