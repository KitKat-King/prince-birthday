"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getProgress, indexFor } from "@/lib/progress";

/**
 * Colorful in-page "next chapter" ticket. Hidden until the current chapter's
 * interaction is completed (tracked in localStorage via lib/progress).
 */
export default function NextChapter({ to, label, tone }) {
  const pathname = usePathname();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const check = () => {
      const i = indexFor(pathname);
      setUnlocked(i >= 0 && getProgress() > i);
    };
    check();
    window.addEventListener("prince-progress", check);
    return () => window.removeEventListener("prince-progress", check);
  }, [pathname]);

  if (!unlocked) return null;

  return (
    <div className="next-chapter-row">
      <button
        type="button"
        className="next-chapter"
        style={tone ? { "--nc-a": tone.a, "--nc-b": tone.b } : undefined}
        onClick={() => { window.location.href = `${to}/`; }}
      >
        <span className="next-chapter-tag">Next chapter</span>
        <span className="next-chapter-label">{label}</span>
        <span className="next-chapter-arrow">
          <ArrowRight size={15} strokeWidth={2.4} />
        </span>
      </button>
    </div>
  );
}
