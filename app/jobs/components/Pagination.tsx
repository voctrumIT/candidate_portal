import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  return (
    <div className="mt-12 mb-20 flex items-center justify-center gap-2">
      {/* Prev Button */}
      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-slate-300">
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Pages */}
      <div className="flex items-center gap-2 text-[14px] font-medium text-slate-600">
        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-900 dark:text-white">
          1
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100">
          2
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100">
          3
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100">
          4
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100">
          5
        </button>
        <span className="px-2">...</span>
        <button className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100">
          50
        </button>
      </div>

      {/* Next Button */}
      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-slate-300">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
