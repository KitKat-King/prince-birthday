"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CakeSlice, Flame, Gift, Sparkles, Wind } from "lucide-react";
import { Lily, Reveal, SectionHead } from "@/components/ui/motion-kit";
import { sfx, vibrate } from "@/lib/sfx";
import { SPRING } from "@/lib/motion";

const WISHES = [
  "Every room you walk into remembers you.",
  "The next year owes you something big.",
  "Louder laughs. Wilder stories. Zero boring days.",
  "You keep collecting people who feel lucky to know you.",
];

const COLORS = ["#cbb7ff", "#f7f2ff", "#ff9bd4", "#a5f2d3", "#e7cfa1"];

function celebrate(originX = 0.5, originY = 0.55) {
  confetti({
    particleCount: 110,
    spread: 100,
    startVelocity: 46,
    origin: { x: originX, y: originY },
    colors: COLORS,
    scalar: 1,
    ticks: 190,
  });

  [0.16, 0.5, 0.84].forEach((x, i) => {
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 360,
        startVelocity: 42,
        gravity: 0.7,
        origin: { x, y: 0.5 },
        colors: COLORS,
        shapes: ["star"],
        scalar: 0.9,
        ticks: 180,
      });
    }, 220 + i * 340);
  });

  try {
    const petal = confetti.shapeFromPath({
      path: "M12 0C19 6 20 17 12 24C4 17 5 6 12 0Z",
    });
    confetti({
      particleCount: 34,
      spread: 360,
      startVelocity: 24,
      gravity: 0.5,
      drift: 0.6,
      ticks: 240,
      scalar: 1.15,
      origin: { x: originX, y: originY },
      shapes: [petal],
      colors: ["#ff9bd4", "#f7f2ff", "#cbb7ff"],
    });
  } catch {
    /* shape fallback is optional */
  }

  const end = Date.now() + 2200;
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      startVelocity: 38,
      origin: { x: 0, y: 0.72 },
      colors: COLORS,
      shapes: ["star"],
      scalar: 0.8,
      ticks: 120,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      startVelocity: 38,
      origin: { x: 1, y: 0.72 },
      colors: COLORS,
      shapes: ["star"],
      scalar: 0.8,
      ticks: 120,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export default function CakeScene() {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [blown, setBlown] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [wishIndex, setWishIndex] = useState(0);
  const raf = useRef(0);
  const last = useRef(0);
  const progressRef = useRef(0);
  const doneRef = useRef(false);
  const stageRef = useRef(null);

  function stopLoop() {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
  }

  function trigger() {
    if (doneRef.current) return;
    doneRef.current = true;
    progressRef.current = 1;
    setBlown(true);
    setShaking(true);
    setProgress(1);
    stopLoop();
    sfx.blow();
    vibrate([20, 60, 30, 60, 40]);
    setTimeout(() => setShaking(false), 800);
    const box = stageRef.current?.getBoundingClientRect();
    const originX = box ? (box.left + box.width / 2) / window.innerWidth : 0.5;
    const originY = box ? (box.top + box.height * 0.4) / window.innerHeight : 0.55;
    setTimeout(() => celebrate(originX, originY), 220);
    setTimeout(() => celebrate(originX, originY + 0.08), 1400);
  }

  function holdStart() {
    if (doneRef.current) return;
    setHolding(true);
    last.current = performance.now();
    stopLoop();
    const tick = (time) => {
      const delta = Math.min(64, time - last.current);
      last.current = time;
      progressRef.current = Math.min(1, progressRef.current + delta / 1500);
      setProgress(progressRef.current);
      if (progressRef.current >= 1) {
        trigger();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  function holdEnd() {
    stopLoop();
    setHolding(false);
    if (doneRef.current) return;
  }

  function relight() {
    doneRef.current = false;
    progressRef.current = 0;
    setBlown(false);
    setProgress(0);
    setHolding(false);
    setWishIndex((value) => (value + 1) % WISHES.length);
    sfx.sparkle();
  }

  useEffect(() => {
    if (holding || doneRef.current) return;
    if (progress <= 0) return;
    const decay = setInterval(() => {
      progressRef.current = Math.max(0, progressRef.current - 0.05);
      setProgress(progressRef.current);
      if (progressRef.current <= 0) clearInterval(decay);
    }, 40);
    return () => clearInterval(decay);
  }, [holding, progress]);

  useEffect(() => () => stopLoop(), []);

  const ring = 2 * Math.PI * 46;

  return (
    <section className="cake-chapter" id="wish">
      <div className="cake-aura" aria-hidden="true" />
      <div className="wrap">
        <SectionHead
          scene="SC.05"
          eyebrow="THE WISH · SIXTEEN CANDLES"
          title="make a wish,"
          accent="legend."
          copy="Sixteen candles. One breath. Hold the button, give it everything, and let the whole screen celebrate with you."
        />

        <div className={`cake-stage ${shaking ? "shake" : ""}`} ref={stageRef}>
          <div className="cake-halo" aria-hidden="true" />
          <div className="cake-sparks" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <Sparkles
                key={i}
                className="cake-spark"
                size={10 + (i % 4) * 3}
                style={{ left: `${8 + ((i * 37) % 84)}%`, top: `${6 + ((i * 29) % 70)}%`, animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>

          <div className="cake">
            <div className={`candle-grid ${blown ? "blown" : ""}`} aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => (
                <span className="candle" key={i} style={{ animationDelay: `${i * 0.03}s` }}>
                  <i className="wick" />
                  <i className="flame" />
                  <i className="smoke" />
                </span>
              ))}
            </div>

            <div className="cake-tier tier-top">
              <span className="tier-icing" />
              <span className="drip d1" /><span className="drip d2" /><span className="drip d3" />
              <span className="sprinkle s1" /><span className="sprinkle s2" /><span className="sprinkle s3" />
            </div>
            <div className="cake-tier tier-mid">
              <span className="tier-icing" />
              <span className="drip d1" /><span className="drip d2" /><span className="drip d3" /><span className="drip d4" />
            </div>
            <div className="cake-tier tier-bottom">
              <span className="tier-icing" />
              <span className="drip d1" /><span className="drip d2" /><span className="drip d3" />
            </div>
            <div className="cake-plate" />
            <span className="cake-number mono">16</span>
          </div>

          <div className={`cake-flash ${blown ? "on" : ""}`} aria-hidden="true" />
          {blown && (
            <motion.div
              className="cake-banner"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...SPRING.bouncy, delay: 0.15 }}
            >
              <span className="mono">18.11 · CHAPTER 16</span>
              <strong>HAPPY BIRTHDAY, PRINCE</strong>
            </motion.div>
          )}
        </div>

        <div className="wish-controls">
          <div className="blow-wrap">
            <button
              type="button"
              className={`blow-btn ${holding ? "holding" : ""} ${blown ? "done" : ""}`}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture?.(event.pointerId);
                holdStart();
              }}
              onPointerUp={holdEnd}
              onPointerCancel={holdEnd}
              onPointerLeave={holdEnd}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  trigger();
                }
              }}
              aria-label="Hold to blow out the sixteen candles"
            >
              <svg viewBox="0 0 104 104" className="blow-ring" aria-hidden="true">
                <circle cx="52" cy="52" r="46" className="blow-track" />
                <circle
                  cx="52"
                  cy="52"
                  r="46"
                  className="blow-progress"
                  strokeDasharray={ring}
                  strokeDashoffset={ring * (1 - progress)}
                />
              </svg>
              <span className="blow-inner">
                {blown ? <Gift size={22} /> : <Wind size={22} />}
                <b>{blown ? "WISH SENT" : holding ? "KEEP BLOWING" : "HOLD TO BLOW"}</b>
                <small className="mono">{blown ? "THE ERA IS ON" : `${Math.round(progress * 100)}%`}</small>
              </span>
            </button>
            <p className="mono blow-hint">
              {blown ? "Show's not over — make another wish." : "1.5 SECONDS OF PURE BIRTHDAY FORCE"}
            </p>
          </div>

          <AnimatePresence>
            {blown && (
              <motion.div
                className="wish-ticket"
                initial={{ opacity: 0, y: 46, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: -1.5 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ ...SPRING.soft, delay: 0.35 }}
              >
                <div className="ticket-edge" aria-hidden="true" />
                <span className="mono">WISH #{String(wishIndex + 1).padStart(2, "0")} · PRINCE / CH.16</span>
                <strong>{WISHES[wishIndex]}</strong>
                <div className="ticket-foot">
                  <span className="script">with love, always</span>
                  <button type="button" className="mini-action mono" onClick={relight}>
                    <Flame size={12} /> RELIGHT & WISH AGAIN
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="cake-hint mono">
            <CakeSlice size={12} /> SERVES 01 LEGEND · BEST WITH YOUR PEOPLE
          </div>
        </div>

        <Reveal delay={0.05}>
          <div className="cake-note">
            <Lily className="cake-lily" />
            <p>Wishes are just plans with better lighting. <em>Go get all of it.</em></p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
