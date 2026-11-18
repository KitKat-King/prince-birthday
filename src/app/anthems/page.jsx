"use client";

import { useEffect } from "react";
import { setProgress } from "@/lib/progress";
import NextChapter from "@/components/shell/NextChapter";

/**
 * The Mixtape chapter is now the full Night Glow lyric-video experience —
 * the generated 16:9 engine lives verbatim in /public/lyrics and is embedded
 * here full-screen. No player UI of our own; the engine handles playback,
 * fullscreen, waveform scrubbing and the synced lyrics sheet.
 */
export default function AnthemsPage() {
  useEffect(() => { setProgress(6); }, []);

  return (
    <div className="page-wrap lyric-page">
      <iframe
        src="/lyrics/index.html"
        title="Dooron Dooron — Night Glow Lyric Experience"
        className="lyric-frame-full"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      <NextChapter to="/memories" label="The Reel" tone={{ a: "#22d3ee", b: "#3ddc97" }} />
    </div>
  );
}
