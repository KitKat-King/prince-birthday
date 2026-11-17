"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Heart, Sparkles, ArrowRight } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import { triggerConfetti } from "@/components/shell/ConfettiCanvas";
import { EASE } from "@/lib/motion";

const CORRECT_PINS = ["123456", "1234567"];
const PIN_LENGTH = 6;

export default function PinPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const enterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current = document.getElementById("pin-audio") as HTMLAudioElement | null;
  }, []);

  const startAudio = () => {
    if (!audioStarted && audioRef.current) {
      setAudioStarted(true);
      audioRef.current.play().catch(() => {});
    }
  };

  const addDigit = (d: string) => {
    startAudio();
    if (pin.length >= PIN_LENGTH) return;
    setPin((p) => p + d);
    if (pin.length + 1 === PIN_LENGTH) setTimeout(() => checkPin(), 300);
  };

  const removeDigit = () => {
    startAudio();
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  const checkPin = () => {
    if (CORRECT_PINS.includes(pin)) {
      triggerConfetti({ x: window.innerWidth / 2, y: window.innerHeight / 2, count: 300 });
      setTimeout(() => {
        if (enterRef.current) enterRef.current.click();
      }, 700);
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 900);
    }
  };

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <div className="page-content">
          <div className="pin-blob pin-blob-1" aria-hidden="true" />
          <div className="pin-blob pin-blob-2" aria-hidden="true" />
          <div className="pin-blob pin-blob-3" aria-hidden="true" />
          <canvas id="pin-confetti" className="pin-confetti" aria-hidden="true" />
          <audio id="pin-audio" loop preload="none">
            <source src="/audio/bg.mp3" type="audio/mpeg" />
          </audio>
          <div className="pin-bunting pin-bunting-top" aria-hidden="true" />
          <div className="pin-bunting pin-bunting-bottom" aria-hidden="true" />

          <div className="glass-card max-w-sm w-full mx-auto flex flex-col items-center">
            <div className="pin-glass" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="pin-bear-wrap relative mb-6">
                <img src="/gifs/gift.gif" alt="Cute Bear" className="pin-bear" aria-hidden="true" />
                <div className="pin-lock-badge">
                  <Lock size={16} strokeWidth={2.2} />
                </div>
              </div>

              <h2 className="pin-title font-theme text-[2rem] font-semibold text-rose-600 mb-1">
                Unlock Your Surprise
              </h2>
              <p className="pin-sub text-sm text-rose-400/80 mb-6">Enter the secret code to begin</p>

              <div className="pin-dots flex gap-3 justify-center mb-6">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full bg-white/60 border border-pink-100 shadow-inner ${
                      i < pin.length ? "bg-rose-500 border-pink-300 shadow-[0_0_12px_rgba(246,51,154,0.6)]" : ""
                    } ${error ? "animate-shake" : ""}`}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              <div className="pin-keypad grid grid-cols-3 gap-4 max-w-[240px] mx-auto mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    className="pin-key w-14 h-14 rounded-full bg-white/70 border border-pink-50/80 text-rose-500 text-[21px] font-semibold hover:bg-pink-50 transition-all shadow-sm will-change-transform active:scale-95"
                    onClick={() => addDigit(String(n))}
                    onMouseDown={startAudio}
                  >
                    {n}
                  </button>
                ))}
                <div className="pin-key w-14 h-14" />
                <button
                  className="pin-key w-14 h-14 rounded-full bg-white/70 text-rose-500 text-[21px] font-semibold hover:bg-pink-100 transition-all shadow-sm will-change-transform active:scale-95"
                  onClick={() => addDigit("0")}
                  onMouseDown={startAudio}
                >
                  0
                </button>
                <button
                  className="pin-key w-14 h-14 rounded-full bg-white/70 text-rose-400 hover:bg-pink-100 transition-all shadow-sm will-change-transform active:scale-95"
                  onClick={removeDigit}
                  onMouseDown={startAudio}
                >
                  <ArrowRight size={20} strokeWidth={2} rotate={180} />
                </button>
              </div>

              {error && (
                <p className="pin-error mt-3 text-sm text-rose-600 flex items-center justify-center gap-2 animate-shake">
                  <Sparkles size={14} strokeWidth={2} /> Wrong code — try again
                </p>
              )}
            </div>
          </div>

          <div ref={enterRef} className="hidden" onClick={() => window.location.href = "/loader"} />
          <p className="pin-foot fixed bottom-4 right-4 text-sm text-black/40 font-light tracking-widest">anujbuilds.in</p>
        </div>
      </NavShell>
    </div>
  );
}
