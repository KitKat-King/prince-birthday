"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import { setProgress } from "@/lib/progress";
import { triggerConfetti } from "@/components/shell/ConfettiCanvas";
import { PRINCE } from "@/lib/prince";

const BOOT_LINES = [
  "ESTABLISHING SECURE LINK",
  "RECIPIENT VERIFIED · PRINCE",
  "ERA CLEARANCE · CHAPTER 16",
  "LILIES SYNCHRONISED",
  "TRANSMISSION READY",
];

export default function LoaderPage() {
  const [now, setNow] = useState(0);
  const [done, setDone] = useState(false);
  const target = useMemo(() => new Date(PRINCE.birthdayISO).getTime(), []);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (done) {
      triggerConfetti({ x: window.innerWidth / 2, y: window.innerHeight / 3, count: 150 });
      setTimeout(() => { setProgress(2); window.location.href = "/seal/"; }, 900);
    }
  }, [done]);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 4200);
    return () => clearTimeout(timer);
  }, []);

  const ready = now > 0;
  const diff = ready ? Math.max(0, target - now) : 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="page-content flex flex-col items-center justify-center"
        >
          <div className="loader flex flex-col items-center justify-center w-full h-full relative">
            <div className="loader-scan absolute inset-0 pointer-events-none opacity-5" />
            <div className="loader-grid absolute inset-0 opacity-5" />
            <div className="loader-vignette absolute inset-0" />

            <div className="loader-top flex justify-between gap-4 px-4">
              <span className="mono text-[7px] text-white/60">BOOT_SEQUENCE</span>
              <span className="mono text-[7px] text-mint">LIVE</span>
            </div>

            <div className="loader-core flex items-center gap-[6vw] w-full max-w-[980px] mx-auto">
              <div className="boot-panel w-full max-w-[430px]">
                <p className="boot-kicker mb-2 text-[7px] text-lilac tracking-widest">BOOT STATUS</p>
                <h2 className="boot-title mb-5 font-[Anton] text-[30px] leading-[0.95] text-white">SYSTEM READY</h2>
                <div className="boot-lines flex flex-col gap-2 min-h-[100px]">
                  {BOOT_LINES.map((line, i) => (
                    <div
                      key={i}
                      className={`boot-line flex items-center gap-2 text-[7px] tracking-widest transition-colors ${i < BOOT_LINES.length - 1 ? "text-white/34" : "text-white/78"}`}
                    >
                      <span className="boot-caret text-lilac">›</span>
                      {line}
                      <span className="ml-auto boot-ok text-mint text-[6px]">OK</span>
                    </div>
                  ))}
                </div>
                <div className="boot-bar mt-6 h-[2px] bg-white/10 overflow-hidden">
                  <span className="h-full bg-gradient-to-r from-lilac via-pink to-fuchsia shadow-[0_0_12px_rgba(203,183,255,0.8)] w-[95%]" />
                </div>
                <div className="boot-meta mt-2 flex justify-between">
                  <span className="mono text-[6.5px] text-white/40">PRINCE·CHAPTER_16</span>
                  <span className="mono text-[6.5px] text-white/40">UNLOCKING…</span>
                </div>
              </div>

              <div className="countdown relative z-20 text-center">
                <p className="countdown-label mb-2 text-[6.5px] tracking-widest text-white/40">ERA CLEARANCE</p>
                <div className="count-digits flex justify-center gap-[3vw]">
                  {[days, hours, mins, secs].map((val, i) => (
                    <div key={i} className="count-cell flex flex-col items-center min-w-[46px]">
                      <span className="count-value font-[Anton] text-[24px] text-white">{String(val).padStart(2, "0")}</span>
                      <span className="count-unit text-[5.5px] text-white/40 tracking-widest mt-1">
                        {["D", "H", "M", "S"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className="skip-btn absolute right-[18px] bottom-[18px] z-[3] flex items-center gap-2 bg-transparent border border-white/20 rounded-full px-[13px] py-[9px] text-[6.5px] tracking-widest text-white/40 hover:bg-white hover:text-black transition"
                  onClick={() => setDone(true)}
                >
                  <ArrowRight size={14} strokeWidth={2} /> SKIP
                </button>
              </div>

              <div className="loader-sparks absolute inset-0 z-[1] pointer-events-none" />
            </div>
          </div>

          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm"
            >
              <div className="text-center animate-pulse">
                <div className="text-[80px] md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400 drop-shadow-[0_0_30px_rgba(236,72,153,0.25)]">
                  0
                </div>
                <p className="mt-4 text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-400">
                  READY
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </NavShell>
    </div>
  );
}
