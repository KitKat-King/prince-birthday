"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getMuted, setMuted, sfx } from "@/lib/sfx";

export default function AudioToggle() {
  const [muted, setMutedState] = useState(true);

  useEffect(() => {
    setMutedState(getMuted());
  }, []);

  function toggle() {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
    if (!next) sfx.sparkle();
  }

  return (
    <button
      type="button"
      className={`audio-toggle ${muted ? "is-muted" : "is-on"}`}
      onClick={toggle}
      aria-label={muted ? "Enable interface sounds" : "Mute interface sounds"}
      aria-pressed={!muted}
    >
      {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      <span className="mono">{muted ? "SOUND OFF" : "SOUND ON"}</span>
    </button>
  );
}
