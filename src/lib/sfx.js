export const SFX_ENABLED = true;

export function sfx(name: string) {
  if (!SFX_ENABLED || typeof window === "undefined") return;
  try {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    const freqMap: Record<string, number> = {
      click: 800,
      pop: 600,
      blow: 400,
      crackle: 300,
      magic: 1000,
    };
    osc.frequency.setValueAtTime(freqMap[name] || 500, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Audio may be blocked; silently ignore.
  }
}

export function vibrate(ms = 50) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}
