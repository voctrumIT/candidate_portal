"use client";

import { useMemo } from "react";

/**
 * Checks whether a string contains HTML tags.
 */
export function isHtml(str?: string | null): boolean {
  if (!str) return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Strips HTML tags and entities, producing clean single-line or multi-line plain text.
 * Useful for card snippets, search queries, and condensed previews.
 */
export function stripHtml(str?: string | null): string {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sanitizes rich HTML content by removing executable scripts, styles, objects, and unsafe attributes.
 */
export function sanitizeJobHtml(html?: string | null): string {
  if (!html) return "";
  return String(html)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "")
    .replace(/href\s*=\s*["']?javascript:[^"'>]*/gi, 'href="#"');
}

export interface JobOverviewRendererProps {
  content?: string | null;
  className?: string;
}

/**
 * Renders job overview/description content cleanly.
 * If rich HTML is detected (e.g. from ProseMirror/TipTap editor), it renders safe,
 * styled typography with proper list markers and margins.
 * If plain text, it renders with clean line-break preservation.
 */
export default function JobOverviewRenderer({
  content,
  className = "",
}: JobOverviewRendererProps) {
  const contentStr = content || "";
  const hasHtml = useMemo(() => isHtml(contentStr), [contentStr]);
  const sanitized = useMemo(() => (hasHtml ? sanitizeJobHtml(contentStr) : ""), [hasHtml, contentStr]);

  if (!contentStr.trim()) {
    return (
      <p className={`text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 ${className}`}>
        No detailed overview provided for this position.
      </p>
    );
  }

  if (hasHtml) {
    return (
      <div
        className={`job-rich-content ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  return (
    <div className={`text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line ${className}`}>
      {contentStr}
    </div>
  );
}

