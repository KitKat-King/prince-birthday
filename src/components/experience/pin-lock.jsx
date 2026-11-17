"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Heart, Sparkles, ArrowRight, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";

const CORRECT_PINS = ["123456", "1234567"];
const PIN_LENGTH = 6;

export default function PinLock({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const confettiRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("pin-confetti");
    if (el && !confettiRef.current) confettiRef.current = el as HTMLCanvasElement;
  }, []);

  useEffect(() => {
    audioRef.current = document.getElementById("pin-audio") as HTMLAudioElement | null;
    // User gesture required to start audio
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
    if (pin.length + 1 === PIN_LENGTH) {
      setTimeout(() => checkPin(), 300);
    }
  };

  const removeDigit = () => {
    startAudio();
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  const checkPin = () => {
    if (CORRECT_PINS.includes(pin)) {
      celebrate();
      setTimeout(() => onUnlock(), 900);
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 900);
    }
  };

  const celebrate = () => {
    if (!confettiRef.current) return;
    const count = 200;
    const defaults = confettiRef.current.getContext("2d")!;
    const { width, height } = defaults.canvas;
    const particleCount = count;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number }> = [];
    const colors = ["#ff2357", "#f6339a", "#ff667f", "#fb64b6", "#fff"];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 7 + 4,
        alpha: 1,
      });
    }
    let frame = 0;
    const ctx = confettiRef.current.getContext("2d")!;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5;
        p.alpha -= 0.015;
        p.size *= 0.96;
        if (p.alpha > 0 && p.size > 0.5) alive = true;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame++;
      if (alive && frame < 600) requestAnimationFrame(animate);
    }
    animate();
  };

  return (
    <section className="pin-lock" aria-label="Unlock your surprise">
      {/* Background decorative blobs */}
      <div className="pin-blob pin-blob-1" aria-hidden="true" />
      <div className="pin-blob pin-blob-2" aria-hidden="true" />
      <div className="pin-blob pin-blob-3" aria-hidden="true" />
      <canvas id="pin-confetti" className="pin-confetti" aria-hidden="true" />

      <audio id="pin-audio" loop preload="none">
        <source src="/audio/bg.mp3" type="audio/mpeg" />
      </audio>

      <div className="pin-bunting pin-bunting-top" aria-hidden="true" />
      <div className="pin-bunting pin-bunting-bottom" aria-hidden="true" />

      <main className="pin-body">
        <div className="pin-card">
          <div className="pin-glass" />
          <div className="pin-card-inner">
            <div className="pin-bear-wrap">
              <img
                src="/gifs/gift.gif"
                alt="Cute Bear"
                className="pin-bear"
                aria-hidden="true"
              />
              <div className="pin-lock-badge">
                <Lock size={16} strokeWidth={2.2} />
              </div>
            </div>

            <h2 className="pin-title">Unlock Your Surprise</h2>
            <p className="pin-sub">Enter the secret code to begin</p>

            <div className="pin-dots">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`pin-dot ${i < pin.length ? "pin-dot-filled" : ""} ${
                    error ? "pin-dot-error" : ""
                  }`}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            <div className="pin-keypad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  className="pin-key"
                  onClick={() => addDigit(String(n))}
                  onMouseDown={startAudio}
                >
                  {n}
                </button>
              ))}
              <div className="pin-key pin-key-empty" />
              <button
                className="pin-key pin-key-zero"
                onClick={() => addDigit("0")}
                onMouseDown={startAudio}
              >
                0
              </button>
              <button
                className="pin-key pin-key-delete"
                onClick={removeDigit}
                onMouseDown={startAudio}
              >
                <Trash2 size={20} strokeWidth={2} />
              </button>
            </div>

            {error && (
              <p className="pin-error">
                <Sparkles size={14} strokeWidth={2} /> Wrong code — try again
              </p>
            )}
          </div>
        </div>

        <p className="pin-foot">anujbuilds.in</p>
      </main>

      <div className="pin-overlay" onClick={startAudio} aria-hidden="true" />
    </section>
  );
}
