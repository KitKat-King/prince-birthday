"use client";

import { animate, stagger } from "animejs";

/**
 * Draws every <path> inside an SVG using anime.js.
 * Used for the lily line-art growth + signature strokes.
 */
export function drawPaths(svgOrPaths, { duration = 1600, delay = 90, ease = "inOutSine" } = {}) {
  const source =
    typeof svgOrPaths === "string" ? document.querySelectorAll(svgOrPaths) : svgOrPaths;
  const paths = source?.querySelectorAll ? Array.from(source.querySelectorAll("path")) : Array.from(source || []);
  if (!paths.length) return null;

  paths.forEach((path) => {
    let length = 800;
    try {
      length = path.getTotalLength() || 800;
    } catch {
      /* non-geometry path */
    }
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
  });

  return animate(paths, {
    strokeDashoffset: 0,
    duration,
    delay: stagger(delay),
    ease,
  });
}

export { animate, stagger };
