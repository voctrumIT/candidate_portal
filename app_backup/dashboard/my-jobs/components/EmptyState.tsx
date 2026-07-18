import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  showButton?: boolean;
}

export default function EmptyState({ imageSrc, title, subtitle, showButton = true }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative h-[240px] w-[360px] sm:h-[300px] sm:w-[450px]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-contain"
          priority
        />
      </div>
      <h3 className="mt-8 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">{subtitle}</p>
      
      {showButton && (
        <Link
          href="/dashboard/jobs"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#2f54eb] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2447d8]"
        >
          Find Jobs
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
