"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, Sparkles } from "lucide-react";
import { Lily } from "@/components/ui/motion-kit";
import { PRINCE } from "@/lib/prince";
import { sfx, vibrate } from "@/lib/sfx";
import { EASE } from "@/lib/motion";

export default function Unlock({ onUnlock }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const raf = useRef(0);
  const last = useRef(0);
  const progressRef = useRef(0);
  const doneRef = useRef(false);

  function stopLoop() {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
  }

  function complete() {
    if (doneRef.current) return;
    doneRef.current = true;
    progressRef.current = 1;
    setProgress(1);
    setDone(true);
    stopLoop();
    sfx.sealCrack();
    vibrate([18, 40, 30]);
    setTimeout(() => onUnlock?.(), 1500);
  }

  function startHold() {
    if (doneRef.current) return;
    setHolding(true);
    last.current = performance.now();
    stopLoop();
    const tick = (time) => {
      const delta = Math.min(64, time - last.current);
      last.current = time;
      progressRef.current = Math.min(1, progressRef.current + delta / 1400);
      setProgress(progressRef.current);
      if (progressRef.current >= 1) {
        complete();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  function endHold() {
    stopLoop();
    setHolding(false);
  }

  useEffect(() => {
    if (holding || doneRef.current) return;
    if (progress <= 0) return;
    const decay = setInterval(() => {
      progressRef.current = Math.max(0, progressRef.current - 0.045);
      setProgress(progressRef.current);
      if (progressRef.current <= 0) clearInterval(decay);
    }, 40);
    return () => clearInterval(decay);
  }, [holding, progress]);

  useEffect(() => () => stopLoop(), []);

  function quickUnlock() {
    complete();
  }

  const heat = Math.round(progress * 100);
  const ring = 2 * Math.PI * 62;

  return (
    <motion.section
      className="unlock"
      exit={{ opacity: 0, scale: 1.16, filter: "blur(26px)", transition: { duration: 0.9, ease: [0.7, 0, 0.84, 0] } }}
      aria-label="Unlock the birthday transmission"
    >
      <div className="unlock-beams" aria-hidden="true">
        <span className="beam b1" />
        <span className="beam b2" />
        <span className="beam b3" />
        <span className="beam b4" />
      </div>
      <div className="unlock-grid" aria-hidden="true" />
      <div className="unlock-stars" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 67) % 100}%`,
              animationDelay: `${i * 0.17}s`,
              opacity: 0.2 + (i % 5) * 0.14,
            }}
          />
        ))}
      </div>
      <div className="unlock-lilies" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <Lily key={i} className={`drift-lily d${i}`} />
        ))}
      </div>

      <div className="unlock-top mono">
        <span>PRIVATE TRANSMISSION</span>
        <span className="live-dot"><i /> ENCRYPTED</span>
      </div>

      <motion.div
        className="unlock-content"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE.out }}
      >
        <p className="eyebrow"><Sparkles size={13} /> A FILM BY YOUR BEST FRIEND</p>
        <h1 className="unlock-name">
          <span>PRINCE</span>
        </h1>
        <div className="unlock-sub">
          <span className="mono">CHAPTER</span>
          <strong>16</strong>
          <span className="mono">18 · 11 · 2026</span>
        </div>

        <div className="seal-wrap" style={{ "--heat": `${heat}%` }}>
          <div className={`seal ${progress > 0.5 ? "warm" : ""} ${done ? "cracked" : ""}`}>
            <svg viewBox="0 0 140 140" className="seal-ring" aria-hidden="true">
              <circle cx="70" cy="70" r="62" className="seal-track" />
              <circle
                cx="70"
                cy="70"
                r="62"
                className="seal-progress"
                strokeDasharray={ring}
                strokeDashoffset={ring * (1 - progress)}
              />
            </svg>
            <button
              type="button"
              className="seal-button"
              aria-label="Press and hold to break the seal"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture?.(event.pointerId);
                startHold();
              }}
              onPointerUp={endHold}
              onPointerCancel={endHold}
              onPointerLeave={endHold}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  quickUnlock();
                }
              }}
            >
              <span className="seal-glow" aria-hidden="true" />
              <Lily className="seal-lily" />
              <span className="seal-lock"><LockKeyhole size={13} /></span>
              <span className="seal-label mono">{done ? "SEAL BROKEN" : holding ? "KEEP HOLDING" : "HOLD TO BREAK"}</span>
              <span className="seal-ticks mono">{Math.round(progress * 100)}%</span>
            </button>
          </div>

          <p className="seal-hint mono">
            {done ? "WELCOME TO YOUR ERA" : "PRESS & HOLD THE WAX SEAL FOR 1.4s"}
          </p>
        </div>

        <button type="button" className="ghost-btn mono" onClick={quickUnlock}>
          TAP INSTEAD <span aria-hidden="true">↗</span>
        </button>
      </motion.div>

      <motion.div
        className="unlock-flash"
        initial={false}
        animate={done ? { opacity: [0, 1, 0.92], scale: [0.6, 1.4, 1.9] } : { opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        aria-hidden="true"
      />

      {done && (
        <div className="seal-burst" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="burst-bit"
              style={{
                "--angle": `${i * 15}deg`,
                "--distance": `${120 + (i % 5) * 46}px`,
                animationDelay: `${(i % 6) * 0.035}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="unlock-bottom mono">
        <span>{PRINCE.productionCode}</span>
        <span>SC.00 · THE SEAL</span>
        <span>18.11.2026</span>
      </div>
    </motion.section>
  );
}
