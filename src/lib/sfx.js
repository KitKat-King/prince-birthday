"use client";

/**
 * Tiny synthesized sound design — zero audio files, zero copyright.
 * Everything is generated with the Web Audio API and only fires from
 * a real user gesture (safe on mobile autoplay policies).
 */

let ctx = null;

function isMuted() {
  try {
    return localStorage.getItem("prince:muted") === "1";
  } catch {
    return false;
  }
}

function getCtx() {
  if (typeof window === "undefined") return null;
  if (isMuted()) return null;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function blip({
  freq = 520,
  to = null,
  duration = 0.09,
  type = "sine",
  gain = 0.05,
  delay = 0,
} = {}) {
  const audio = getCtx();
  if (!audio) return;
  try {
    const t0 = audio.currentTime + delay;
    const osc = audio.createOscillator();
    const vol = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + duration);
    vol.gain.setValueAtTime(0.0001, t0);
    vol.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    vol.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(vol).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  } catch {
    /* audio is a bonus, never a blocker */
  }
}

export const sfx = {
  click: () => blip({ freq: 680, to: 520, duration: 0.06, type: "triangle", gain: 0.035 }),
  sealCrack: () => {
    blip({ freq: 180, to: 60, duration: 0.28, type: "sawtooth", gain: 0.045 });
    blip({ freq: 900, to: 1400, duration: 0.16, type: "sine", gain: 0.03, delay: 0.05 });
  },
  shutter: () => {
    blip({ freq: 1400, to: 400, duration: 0.05, type: "square", gain: 0.03 });
    blip({ freq: 300, to: 200, duration: 0.09, type: "triangle", gain: 0.035, delay: 0.06 });
  },
  cassette: () => {
    blip({ freq: 220, to: 160, duration: 0.07, type: "square", gain: 0.03 });
    blip({ freq: 320, to: 240, duration: 0.07, type: "square", gain: 0.028, delay: 0.09 });
  },
  blow: () => {
    blip({ freq: 420, to: 90, duration: 0.5, type: "sawtooth", gain: 0.04 });
    blip({ freq: 1200, to: 300, duration: 0.35, type: "sine", gain: 0.02, delay: 0.04 });
  },
  stamp: () => blip({ freq: 120, to: 55, duration: 0.22, type: "square", gain: 0.05 }),
  sparkle: () => {
    blip({ freq: 960, to: 1400, duration: 0.12, type: "sine", gain: 0.025 });
    blip({ freq: 1280, to: 1800, duration: 0.12, type: "sine", gain: 0.02, delay: 0.09 });
  },
};

export function vibrate(pattern = 12) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

export function setMuted(muted) {
  try {
    localStorage.setItem("prince:muted", muted ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function getMuted() {
  return isMuted();
}
