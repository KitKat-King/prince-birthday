import { ArrowRight } from "lucide-react";

/**
 * Colorful in-page "next chapter" ticket. Uses a full navigation (window.location)
 * to stay consistent with the rest of the app and avoid client-router quirks.
 */
export default function NextChapter({ to, label, tone }) {
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
