"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  itemLabel?: string;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 6,
  onPageChange = () => {},
  onPageSizeChange,
  itemLabel = "jobs",
}: PaginationProps) {
  // If explicitly given 0 items, don't show pagination
  if (totalItems === 0) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  // Item counts
  const hasItemCount = typeof totalItems === "number";
  const startItem = hasItemCount ? (totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1) : null;
  const endItem = hasItemCount ? Math.min(safeCurrentPage * pageSize, totalItems) : null;

  // Generate page array with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (safeTotalPages <= 7) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", safeTotalPages);
      } else if (safeCurrentPage >= safeTotalPages - 3) {
        pages.push(1, "...", safeTotalPages - 4, safeTotalPages - 3, safeTotalPages - 2, safeTotalPages - 1, safeTotalPages);
      } else {
        pages.push(1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", safeTotalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-10 mb-16 mx-auto max-w-[1360px] px-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800/80 pt-6">
      {/* Items Count Summary */}
      <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
        {hasItemCount ? (
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-semibold">{startItem}</strong> to{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">{endItem}</strong> of{" "}
            <strong className="text-[#2f54eb] dark:text-blue-400 font-semibold">{totalItems}</strong> {itemLabel}
          </span>
        ) : (
          <span>
            Page <strong className="text-slate-900 dark:text-white">{safeCurrentPage}</strong> of{" "}
            <strong className="text-slate-900 dark:text-white">{safeTotalPages}</strong>
          </span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Prev Button */}
        <button
          type="button"
          onClick={() => safeCurrentPage > 1 && onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          aria-label="Previous Page"
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${
            safeCurrentPage <= 1
              ? "cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 opacity-60"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {pages.map((p, index) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-1 text-slate-400 select-none text-xs">
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === safeCurrentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-9 min-w-[36px] px-2.5 items-center justify-center rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#2f54eb] text-white shadow-sm ring-2 ring-[#2f54eb]/25"
                    : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => safeCurrentPage < safeTotalPages && onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= safeTotalPages}
          aria-label="Next Page"
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${
            safeCurrentPage >= safeTotalPages
              ? "cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 opacity-60"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Page Size Selector */}
      {onPageSizeChange && (
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-[#2f54eb]"
          >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
        </div>
      )}
    </div>
  );
}
