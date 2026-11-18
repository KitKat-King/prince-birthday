import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Colorful in-page "next chapter" ticket. Anchored to the page wrapper so each
 * scene keeps its single-screen layout while still offering a way forward.
 */
export default function NextChapter({ to, label, tone }) {
  return (
    <div className="next-chapter-row">
      <Link href={`${to}/`} className="next-chapter" style={tone ? { "--nc-a": tone.a, "--nc-b": tone.b } : undefined}>
        <span className="next-chapter-tag">Next chapter</span>
        <span className="next-chapter-label">{label}</span>
        <span className="next-chapter-arrow">
          <ArrowRight size={15} strokeWidth={2.4} />
        </span>
      </Link>
    </div>
  );
}
