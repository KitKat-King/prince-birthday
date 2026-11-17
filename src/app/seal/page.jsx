"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import { triggerConfetti } from "@/components/shell/ConfettiCanvas";
import { Lily } from "@/components/ui/motion-kit";
import { EASE } from "@/lib/motion";

export default function SealPage() {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const [warm, setWarm] = useState(false);
  const raf = useRef(0);
  const last = useRef(0);
  const progressRef = useRef(0);

  const startHold = useCallback(() => {
    if (done) return;
    setHolding(true);
    setWarm(true);
    last.current = performance.now();
    raf.current = requestAnimationFrame(loop);
  }, [done]);

  const stopHold = useCallback(() => {
    setHolding(false);
    cancelAnimationFrame(raf.current);
    raf.current = 0;
  }, []);

  const loop = useCallback(() => {
    const now = performance.now();
    const dt = (now - last.current) / 16;
    last.current = now;
    progressRef.current = Math.min(1, progressRef.current + dt * 0.08);
    setProgress(progressRef.current);
    if (progressRef.current >= 1 && !done) {
      setDone(true);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      triggerConfetti({ x: window.innerWidth / 2, y: window.innerHeight / 2, count: 250 });
      setTimeout(() => { window.location.href = "/hero"; }, 900);
    } else {
      raf.current = requestAnimationFrame(loop);
    }
  }, [done]);

  useEffect(() => {
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <div className="page-content flex flex-col items-center justify-center">
          <div className="unlock relative w-full max-w-[680px] mx-auto text-center">
            <div className="unlock-beams absolute inset-0 flex items-center justify-center pointer-events-none">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`beam b${i} ${warm ? "opacity-75" : "opacity-5"}`} />
              ))}
            </div>
            <div className="unlock-grid absolute inset-0 opacity-45 pointer-events-none" />
            <div className="unlock-stars absolute inset-0 pointer-events-none" />
            <div className="unlock-lilies absolute inset-0 pointer-events-none">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Lily key={i} className={`drift-lily d${i}`} />
              ))}
            </div>

            <div className="unlock-top absolute top-4 left-4 right-4 flex justify-between text-[6.5px] text-white/40 tracking-widest">
              <span>SEAL INTEGRITY</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>

            <div className="unlock-content relative z-20 w-full">
              <div className="eyebrow flex justify-center">
                <span className="mono text-[6px] text-lilac tracking-widest">PRESS AND HOLD</span>
              </div>
              <h1 className="unlock-name mb-2 leading-[0.8]">
                <span className="font-[Anton] text-[76px] md:text-168px text-transparent bg-gradient-to-b from-white via-dcd5ec to-9b90b6 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
                  PRINCE
                </span>
              </h1>
              <div className="unlock-sub flex items-baseline justify-center gap-3 mb-8">
                <span className="mono text-[7px] text-white/40 tracking-widest">HOLD TO BREAK</span>
                <strong className="font-[Anton] text-[28px] md:text-44px text-lilac leading-[1]">{progress}</strong>
              </div>

              <div className="seal-wrap flex flex-col items-center gap-4">
                <div className="seal relative" style={{ width: "clamp(160px, 40vw, 196px)", aspectRatio: 1 }}>
                  <svg className="seal-ring w-full h-full" viewBox="0 0 140 140">
                    <circle className="seal-track" cx="70" cy="70" r="65" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
                    <circle className={`seal-progress ${warm ? "warm" : ""}`} cx="70" cy="70" r="65" fill="none" stroke="var(--lilac)" strokeWidth="3" strokeLinecap="round" style={{ strokeDashoffset: 408 - (408 * progress) / 100, transform: "rotate(-90deg)", transformOrigin: "70px 70px" }} />
                  </svg>
                  <button
                    className="seal-button"
                    onPointerDown={startHold}
                    onPointerUp={stopHold}
                    onPointerLeave={stopHold}
                    onTouchStart={(e) => { e.preventDefault(); startHold(); }}
                    onTouchEnd={stopHold}
                    onTouchCancel={stopHold}
                  >
                    <div className="seal-glow" />
                    <div className="seal-lock text-[6px] text-white/40 mb-1">
                      <Sparkles size={14} strokeWidth={2} />
                    </div>
                    <div className="seal-label">HOLD TO BREAK</div>
                    <div className="seal-ticks">{Math.round(progress * 100)}%</div>
                  </button>
                  <div className="seal-hint mt-1 text-[6px] text-white/30 tracking-widest">Press and hold (~1.4s) or tap "instead"</div>
                </div>
              </div>

              {done && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
                >
                  <div className="text-center animate-pulse">
                    <div className="text-[60px] md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-400 drop-shadow-[0_0_30px_rgba(236,72,153,0.25)]">💥</div>
                    <p className="mt-4 text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-400">SEAL BROKEN</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </NavShell>
    </div>
  );
}
