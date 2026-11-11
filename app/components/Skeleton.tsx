import React from "react";

export function JobCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm animate-pulse min-h-[290px]">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="w-3/4 space-y-2.5">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          </div>
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0" />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-5">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
  );
}

export function ApplicationCardSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-xl border border-slate-200/70 bg-[#fafbfc] dark:border-slate-800 dark:bg-slate-900/40 p-5 animate-pulse">
      <div className="flex items-start gap-4 min-w-[260px] max-w-sm">
        <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          <div className="flex gap-2 pt-1">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
      <div className="flex-1 max-w-xl space-y-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
      </div>
      <div className="flex lg:flex-col items-end gap-3 shrink-0">
        <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

export function JobDetailSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-6 animate-pulse space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-7 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="space-y-2.5">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}

export function DocumentRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-[#f8f9fa] dark:bg-[#1a1a1a] p-5 border border-slate-200/80 dark:border-slate-800 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

