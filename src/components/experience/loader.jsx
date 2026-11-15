"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Lily } from "@/components/ui/motion-kit";
import { PRINCE } from "@/lib/prince";
import { EASE } from "@/lib/motion";

const BOOT_LINES = [
  "ESTABLISHING SECURE LINK",
  "RECIPIENT VERIFIED · PRINCE",
  "ERA CLEARANCE · CHAPTER 16",
  "LILIES SYNCHRONISED",
  "TRANSMISSION READY",
];

function useCountdown() {
  const [now, setNow] = useState(0);
  const target = useMemo(() => new Date(PRINCE.birthdayISO).getTime(), []);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  const ready = now > 0;
  const diff = ready ? Math.max(0, target - now) : 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const open = ready && now >= target;
  return { days, hours, mins, secs, open, ready };
}

const pad = (value) => String(value).padStart(2, "0");
const stamp = (value, ready) => (ready ? pad(value) : "--");

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);
  const { days, hours, mins, secs, open, ready } = useCountdown();

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          clearInterval(tick);
          return 100;
        }
        return Math.min(100, value + 1.6);
      });
    }, 42);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (line >= BOOT_LINES.length) return;
    const timer = setTimeout(() => setLine((value) => value + 1), 430);
    return () => clearTimeout(timer);
  }, [line]);

  useEffect(() => {
    if (progress < 100) return;
    const timer = setTimeout(() => onDone?.(), 1200);
    return () => clearTimeout(timer);
  }, [progress, onDone]);

  const ring = 2 * Math.PI * 54;

  return (
    <motion.section
      className="loader"
      exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.5 } }}
      aria-label="Private transmission loading"
    >
      <div className="loader-scan" aria-hidden="true" />
      <div className="loader-grid" aria-hidden="true" />
      <div className="loader-vignette" aria-hidden="true" />

      <div className="loader-top">
        <span className="mono">{PRINCE.productionCode}</span>
        <span className="mono live-dot">
          <i /> LIVE TRANSMISSION
        </span>
      </div>

      <div className="loader-core">
        <motion.div
          className="vault"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: EASE.out }}
        >
          <svg viewBox="0 0 120 120" className="vault-ring" aria-hidden="true">
            <circle cx="60" cy="60" r="58" className="vault-dash" />
            <circle cx="60" cy="60" r="54" className="vault-track" />
            <circle
              cx="60"
              cy="60"
              r="54"
              className="vault-progress"
              strokeDasharray={ring}
              strokeDashoffset={ring * (1 - progress / 100)}
            />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="60"
                y1="8"
                x2="60"
                y2={i % 6 === 0 ? "15" : "12"}
                transform={`rotate(${i * 15} 60 60)`}
                className="vault-tick"
              />
            ))}
          </svg>
          <div className="vault-face">
            <Lily className="vault-lily" />
            <span className="vault-num">{pad(Math.round(progress))}</span>
            <span className="mono vault-pct">SECURE</span>
          </div>
        </motion.div>

        <div className="boot-panel">
          <p className="mono boot-kicker">PRIVATE · BIRTHDAY · TRANSMISSION</p>
          <h1 className="boot-title">LOADING THE ERA</h1>

          <div className="boot-lines" aria-live="polite">
            {BOOT_LINES.map((text, index) => (
              <motion.p
                key={text}
                className={index < line ? "boot-line done" : "boot-line"}
                initial={{ opacity: 0, x: -10 }}
                animate={index < line ? { opacity: 1, x: 0 } : { opacity: 0.18, x: 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className="boot-caret">{index < line ? "▸" : "·"}</span>
                {text}
                {index < line && <span className="boot-ok">OK</span>}
              </motion.p>
            ))}
          </div>

          <div className="boot-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100">
            <motion.span style={{ width: `${progress}%` }} />
          </div>

          <div className="boot-meta">
            <span className="mono">{Math.round(progress)}%</span>
            <span className="mono">{open ? "SEAL OPEN" : "SEALED UNTIL 18.11"}</span>
          </div>
        </div>
      </div>

      <div className="countdown" aria-label="Countdown to Prince's birthday">
        <p className="mono countdown-label">{open ? "THE DAY IS HERE" : "T-MINUS TO CHAPTER 16"}</p>
        <div className="countdown-digits">
          {[
            [days, "DAYS"],
            [hours, "HRS"],
            [mins, "MIN"],
            [secs, "SEC"],
          ].map(([value, unit]) => (
            <div className="count-cell" key={unit}>
              <span className="count-value">{stamp(value, ready)}</span>
              <span className="mono count-unit">{unit}</span>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="skip-btn mono" onClick={() => onDone?.()}>
        SKIP TRANSMISSION <ArrowRight size={14} />
      </button>

      <div className="loader-sparks" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <Sparkles
            key={i}
            className="loader-spark"
            style={{ left: `${(i * 37) % 96}%`, top: `${(i * 53) % 90}%`, animationDelay: `${i * 0.4}s` }}
            size={10}
          />
        ))}
      </div>
    </motion.section>
  );
}
