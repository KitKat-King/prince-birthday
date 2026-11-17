"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowDown, Crown, Sparkles, Star } from "lucide-react";
import { KineticLetters, Lily, VelocityMarquee } from "@/components/ui/motion-kit";
import { EASE } from "@/lib/motion";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const numY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const numRotate = useTransform(scrollYProgress, [0, 1], [-8, 12]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  function petalBurst(event) {
    const box = event.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 26,
      spread: 70,
      startVelocity: 22,
      gravity: 0.7,
      scalar: 0.7,
      ticks: 110,
      origin: {
        x: (box.left + box.width / 2) / window.innerWidth,
        y: (box.top + box.height / 2) / window.innerHeight,
      },
      colors: ["#cbb7ff", "#f7f2ff", "#ff9bd4", "#a5f2d3"],
      shapes: ["circle"],
    });
  }

  return (
    <section className="hero" id="hero" ref={ref}>
      <div className="hero-mesh" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-spot" aria-hidden="true" />

      {/* V4 gold ring accent */}
      <div className="hero-gold-ring" aria-hidden="true" />

      {/* V5 floating bear */}
      <div className="floating-bear" style={{ right: "6%", top: "26%" }} aria-hidden="true">
        <img src="/gifs/gift.gif" alt="Bear" />
      </div>

      <motion.div className="hero-ghost-num" style={{ y: numY, rotate: numRotate }} aria-hidden="true">
        <span onClick={petalBurst}>16</span>
      </motion.div>

      <div className="hero-orbit" aria-hidden="true">
        <span className="orbit-ring r1" />
        <span className="orbit-ring r2" />
        <Lily className="orbit-lily" />
        <Star className="orbit-star s1" size={12} />
        <Star className="orbit-star s2" size={9} />
      </div>

      {/* V4 gold balloons at bottom */}
      <div className="hero-gold-balloon" aria-hidden="true">
        <svg viewBox="0 0 100 140" className="drop-shadow-2xl" style={{ transformOrigin: "50% 100% 0" }}>
          <defs>
            <radialGradient id="goldBalloon" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F3D5B0" />
              <stop offset="50%" stopColor="#A4743E" />
              <stop offset="100%" stopColor="#7D5129" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="60" rx="45" ry="55" fill="url(#goldBalloon)" />
          <path d="M45 115 L55 115 L50 125 Z" fill="#ca8a04" />
          <path d="M50 125 Q40 140 50 150" stroke="#fde047" strokeWidth={1} fill="none" opacity={0.7} />
          <ellipse cx="30" cy="35" rx="14" ry="10" fill="rgba(255,255,255,0.3)" transform="rotate(-30 30 35)" filter="blur(2px)" />
          <ellipse cx="35" cy="45" rx="6" ry="6" fill="rgba(255,255,255,0.2)" filter="blur(3px)" />
        </svg>
        <svg viewBox="0 0 100 140" className="drop-shadow-2xl -mr-4" style={{ transformOrigin: "50% 100% 0" }}>
          <defs>
            <radialGradient id="goldBalloon2" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F3D5B0" />
              <stop offset="50%" stopColor="#A4743E" />
              <stop offset="100%" stopColor="#7D5129" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="60" rx="45" ry="55" fill="url(#goldBalloon2)" />
          <path d="M45 115 L55 115 L50 125 Z" fill="#ca8a04" />
          <path d="M50 125 Q40 140 50 150" stroke="#fde047" strokeWidth={1} fill="none" opacity={0.7} />
          <ellipse cx="30" cy="35" rx="14" ry="10" fill="rgba(255,255,255,0.3)" transform="rotate(-30 30 35)" filter="blur(2px)" />
          <ellipse cx="35" cy="45" rx="6" ry="6" fill="rgba(255,255,255,0.2)" filter="blur(3px)" />
        </svg>
      </div>

      <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: EASE.out }}
        >
          <Crown size={13} /> THE BIRTHDAY EDITION · 18.11.2026
        </motion.p>

        <h1 className="hero-name">
          <KineticLetters text="PRINCE" delay={0.1} />
        </h1>

        <motion.div
          className="hero-chapter"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease: EASE.out }}
        >
          <span className="chapter-word">CHAPTER</span>
          <span className="chapter-num" onClick={petalBurst}>16</span>
          <span className="chapter-rule" />
        </motion.div>

        <motion.p
          className="hero-line"
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.75, duration: 0.9, ease: EASE.out }}
        >
          It&apos;s your <em>era.</em>
        </motion.p>

        <motion.p
          className="hero-copy-text"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8, ease: EASE.out }}
        >
          One more orbit. A whole new level. The world just got a little more legendary — and it&apos;s
          wearing your name.
        </motion.p>

        <motion.div
          className="hero-chip"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: EASE.out }}
        >
          <Sparkles size={14} /> CHAPTER SIXTEEN · UNLOCKED
          <span className="chip-dot" />
        </motion.div>
      </motion.div>

      <div className="scroll-cue mono">
        <span>SCROLL TO OPEN THE FILM</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown size={16} />
        </motion.span>
      </div>

      <div className="hero-marquee">
        <VelocityMarquee>
          PRINCE&apos;S DAY <b>✦</b> STAY LEGENDARY <b>✦</b> CHAPTER 16 <b>✦</b> IT&apos;S YOUR ERA <b>✦</b>
        </VelocityMarquee>
      </div>
    </section>
  );
}
