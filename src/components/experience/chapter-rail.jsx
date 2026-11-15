"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/prince";

export default function ChapterRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.42;
      let current = 0;
      CHAPTERS.forEach((chapter, index) => {
        const node = document.getElementById(chapter.id);
        if (node && node.offsetTop <= mid) current = index;
      });
      setActive(current);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="chapter-rail" aria-label="Film chapters">
      <span className="rail-track" aria-hidden="true">
        <span className="rail-fill" style={{ height: `${progress * 100}%` }} />
      </span>
      <ul>
        {CHAPTERS.map((chapter, index) => (
          <li key={chapter.id}>
            <button
              type="button"
              className={index === active ? "rail-dot active" : "rail-dot"}
              aria-label={`Go to ${chapter.label}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => {
                document.getElementById(chapter.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span className="dot" />
              <span className="rail-label mono">{chapter.scene} {chapter.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
