"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import {
  BadgeCheck,
  Copy,
  Disc3,
  Film,
  Heart,
  QrCode,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { KineticLetters, Lily, Reveal, Typewriter } from "@/components/ui/motion-kit";
import { PRINCE } from "@/lib/prince";
import { sfx, vibrate } from "@/lib/sfx";
import { SPRING } from "@/lib/motion";

const CREDITS = [
  ["STARRING", "PRINCE"],
  ["DIRECTED BY", "YOUR BEST FRIEND"],
  ["MUSIC", "BAIRAN · TERE AASA PASS DIN SARA"],
  ["SIGNATURE FLOWER", "LILY"],
  ["PRODUCTION CODE", "PRNCE-16"],
  ["SPECIAL THANKS", "EVERYONE WHO KNOWS HIM"],
];

export default function Finale({ onReplay }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.92, 1]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.25, 0.9]);

  const [passTaps, setPassTaps] = useState(0);
  const [verified, setVerified] = useState(false);
  const [reelTaps, setReelTaps] = useState(0);
  const [bonus, setBonus] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = {
      title: "Prince — Chapter 16",
      text: "A birthday transmission for Prince. Chapter 16: it's your era. 🎂",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast("LINK COPIED — SEND IT TO PRINCE");
    } catch {
      showToast("COPY THIS PAGE LINK AND SHARE THE ERA");
    }
  }

  function tapPass() {
    const next = passTaps + 1;
    setPassTaps(next);
    if (next === 3) {
      setVerified(true);
      sfx.stamp();
      vibrate([15, 50, 20]);
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#cbb7ff", "#f7f2ff", "#ff9bd4", "#a5f2d3"],
        scalar: 0.9,
      });
    }
  }

  function tapReel() {
    const next = reelTaps + 1;
    setReelTaps(next);
    sfx.click();
    if (next === 3) {
      setBonus(true);
      sfx.sparkle();
      vibrate([10, 30, 10]);
    }
  }

  return (
    <section className="finale" id="finale" ref={ref}>
      <motion.div className="finale-aura" style={{ opacity: glow }} aria-hidden="true" />
      <div className="finale-grid" aria-hidden="true" />

      <div className="finale-hero">
        <p className="eyebrow"><Sparkles size={13} /> END CREDITS · THE ERA CUT</p>
        <motion.h2 className="finale-title" style={{ scale }}>
          <KineticLetters text="STAY" />
          <KineticLetters text="LEGENDARY" className="legendary-word" delay={0.15} />
        </motion.h2>
        <p className="finale-sub mono">CHAPTER 16 · 18 NOVEMBER · A FILM BY YOUR BEST FRIEND</p>
      </div>

      <div className="finale-content">
        <Reveal>
          <div className="tribute">
            <div className="tribute-head">
              <span className="mono">A NOTE FROM THE FRONT ROW</span>
              <Heart size={14} />
            </div>
            <Typewriter
              text="Sixteen looks good on you, but honestly — you've been the main character since day one. May this year bring louder laughs, bigger plot twists, and every good thing with your name on it. Keep showing up like the whole world is your stage."
              speed={18}
              className="tribute-body"
            />
            <Typewriter
              text="I'm always in the front row."
              speed={30}
              startDelay={1500}
              className="tribute-body tribute-close"
            />
            <p className="tribute-sign script">{PRINCE.signature}</p>
            <span className="mono tribute-date">WRITTEN FOR 18.11.2026 · SEALED WITH A LILY</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="pass-wrap">
            <motion.div
              className="birthday-pass"
              onClick={tapPass}
              whileTap={{ scale: 0.985 }}
              transition={SPRING.snap}
              aria-label="Prince's birthday pass"
            >
              <div className="pass-top">
                <div className="pass-brand">
                  <span className="mono">PRINCE AIRWAYS · PRIVATE</span>
                  <strong>BIRTHDAY PASS</strong>
                </div>
                <Lily className="pass-lily" />
              </div>

              <div className="pass-divider" aria-hidden="true">
                <span className="notch left" />
                <span className="dash" />
                <span className="notch right" />
              </div>

              <div className="pass-body">
                <div className="pass-field">
                  <span className="mono">PASSENGER</span>
                  <b>PRINCE</b>
                </div>
                <div className="pass-field">
                  <span className="mono">CHAPTER</span>
                  <b>16</b>
                </div>
                <div className="pass-field">
                  <span className="mono">DATE</span>
                  <b>18.11.2026</b>
                </div>
                <div className="pass-field">
                  <span className="mono">GATE</span>
                  <b>CH-16</b>
                </div>
                <div className="pass-field wide">
                  <span className="mono">SEAT</span>
                  <b>LEGENDARY</b>
                </div>
                <div className="pass-field">
                  <span className="mono">BOARDING</span>
                  <b>NOW</b>
                </div>
              </div>

              <div className="pass-bottom">
                <div className="qr" aria-hidden="true">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <i key={i} className={i % 7 === 0 || i % 5 === 0 ? "on" : ""} />
                  ))}
                </div>
                <div className="pass-meta">
                  <span className="mono">SCAN AT THE DOOR OF YOUR BEST YEAR</span>
                  <span className="script">From your best friend</span>
                </div>
                <QrCode size={16} className="pass-qr-icon" />
              </div>

              <div className="pass-barcode" aria-hidden="true" />
              <span className="mono pass-code">PRNCE-16 · 0016 · LEGEND</span>

              <AnimatePresence>
                {verified && (
                  <motion.span
                    className="pass-verified"
                    initial={{ opacity: 0, scale: 2.4, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: -9 }}
                    transition={SPRING.bouncy}
                  >
                    PRINCE VERIFIED <BadgeCheck size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="pass-actions">
              <button type="button" className="action-btn" onClick={share}>
                <Share2 size={15} /> SHARE THE PASS
              </button>
              <button
                type="button"
                className="action-btn ghost"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    showToast("LINK COPIED");
                  } catch {
                    showToast("COPY THE URL FROM YOUR BROWSER");
                  }
                }}
              >
                <Copy size={14} /> COPY LINK
              </button>
            </div>
            <p className="mono pass-hint">TAP THE PASS THREE TIMES · SOMETHING HAPPENS</p>
          </div>
        </Reveal>
      </div>

      <div className="credits">
        <div className="credits-head">
          <span className="mono">THE ERA CUT · END CREDITS</span>
          <span className="mono">ROLL 16</span>
        </div>
        <div className="credits-grid">
          {CREDITS.map(([role, name], index) => (
            <Reveal key={role} delay={index * 0.05}>
              <div className="credit">
                <span className="mono">{role}</span>
                <b>{name}</b>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="credits-thanks">
          <Lily className="credits-lily" />
          <p>Thank you for being the kind of person people make films about.</p>
        </div>
      </div>

      <div className="post-credits">
        <button type="button" className="reel-btn" onClick={tapReel} aria-label="Secret deleted scene">
          <Disc3 size={18} />
          <span className="mono">POST-CREDITS {reelTaps > 0 ? `· ${Math.min(reelTaps, 3)}/3` : ""}</span>
        </button>

        <AnimatePresence>
          {bonus && (
            <motion.div
              className="deleted-scene"
              initial={{ opacity: 0, y: 26, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...SPRING.soft }}
            >
              <span className="mono">DELETED SCENE · TAKE 16</span>
              <p>“You didn&apos;t think the film was over, did you? There&apos;s always one more scene when you&apos;re the main character.”</p>
              <span className="script">— the best friend, again</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="button" className="replay-btn" onClick={onReplay}>
          <RotateCcw size={15} /> REPLAY THE FILM
        </button>
      </div>

      <footer className="site-foot">
        <span className="mono"><Film size={11} /> {PRINCE.productionCode} · THE ERA CUT</span>
        <span className="mono">MADE FOR PRINCE · 18 NOVEMBER</span>
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles size={12} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
