"use client";

import { useState } from "react";
import { Pencil, Crown } from "lucide-react";

export default function AboutTab() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">About Me</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex h-8 w-8 items-center justify-center rounded bg-[#2f54eb] text-white transition hover:bg-[#2447d8]"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-8">
        {isEditing ? (
          <div>
            <p className="mb-2 text-[13px] text-slate-400">Maximum 1000 characters can be added</p>
            <textarea
              placeholder="Highlight your expertise, achievements, and the value you bring to potential employers"
              className="h-48 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:border-slate-700 dark:bg-[#1a1a1a] p-4 text-[14px] leading-relaxed text-slate-900 dark:text-white outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] resize-none"
            />
            <div className="mt-6 flex items-center justify-between">
              <button className="flex items-center gap-2 rounded-lg bg-[#2f54eb] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#2447d8]">
                <Crown className="h-4 w-4" /> Generate with Voctrum AI
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="h-11 rounded-lg bg-[#2f54eb] px-10 text-[14px] font-semibold text-white transition hover:bg-[#2447d8]"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[14px] leading-[1.8] text-slate-500 dark:text-slate-400">
            I am a UI/UX designer focused on creating intuitive, user-centered digital experiences. I combine design thinking with modern aesthetics to build interfaces that are not only visually appealing but also highly functional and easy to use. I have a strong understanding of user behavior, usability principles, and interaction design, which helps me craft seamless experiences across web and mobile platforms. From research and wireframing to prototyping and final design, I focus on every detail to ensure clarity, consistency, and efficiency.
          </p>
        )}
      </div>
    </div>
  );
}
