"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowDown, Crown, Sparkles, Star } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import { KineticLetters, Lily, VelocityMarquee } from "@/components/ui/motion-kit";
import { EASE } from "@/lib/motion";

export default function HeroPage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const numY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const numRotate = useTransform(scrollYProgress, [0, 1], [-8, 12]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  function petalBurst(e) {
    const box = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 26,
      spread: 70,
      startVelocity: 22,
      gravity: 0.7,
      scalar: 0.7,
      ticks: 110,
      origin: { x: (box.left + box.width / 2) / window.innerWidth, y: (box.top + box.height / 2) / window.innerHeight },
      colors: ["#cbb7ff", "#f7f2ff", "#ff9bd4", "#a5f2d3"],
      shapes: ["circle"],
    });
  }

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <section className="hero relative min-h-screen flex items-center justify-center p-4 md:p-6 overflow-hidden isolation isolate" id="hero" ref={ref}>
          <div className="hero-mesh absolute inset-0 z-[-3]" />
          <div className="hero-grid absolute inset-0 z-[-2] opacity-6" />
          <div className="hero-spot absolute z-[-1] w-[90vmax] h-[90vmax] left-[-20vmax] top-[-30vmax] bg-[radial-gradient(circle,_rgba(203,183,255,0.16),transparent_62%)] blur-[18px] animate-[breathe_8s_ease-in-out_infinite]" />

          <div className="hero-gold-ring absolute inset-0 z-0" />

          <div className="floating-bear" style={{ right: "6%", top: "26%" }} aria-hidden="true">
            <img src="/gifs/gift.gif" alt="Bear" />
          </div>

          <motion.div className="hero-ghost-num absolute z-[-1]" style={{ y: numY, rotate: numRotate }} aria-hidden="true">
            <span onClick={petalBurst}>16</span>
          </motion.div>

          <div className="hero-orbit absolute right-[6%] top-[24%] w-[300px] aspect-[1] z-1 pointer-events-none grid place-items-center">
            <span className="orbit-ring r1 absolute inset-0 border border-white/18 rounded-full animate-[spin_38s_linear_infinite] border-dashed" />
            <span className="orbit-ring r2 absolute inset-[18%] border-white/18 rounded-full animate-[spin_26s_linear_infinite_reverse]" />
            <Lily className="orbit-lily" />
            <Star className="orbit-star s1" size={12} />
            <Star className="orbit-star s2" size={9} />
          </div>

          <div className="hero-gold-balloon absolute bottom-[-10%] left-0 w-full flex gap-4 justify-center opacity-85 pointer-events-none">
            <svg viewBox="0 0 100 140" className="w-16 h-22 drop-shadow-2xl" style={{ transformOrigin: "50% 100% 0" }}>
              <defs>
                <radialGradient id="heroGold1" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#F3D5B0" /><stop offset="50%" stopColor="#A4743E" /><stop offset="100%" stopColor="#7D5129" />
                </radialGradient>
              </defs>
              <ellipse cx="50" cy="60" rx="45" ry="55" fill="url(#heroGold1)" />
              <path d="M45 115 L55 115 L50 125 Z" fill="#ca8a04" />
              <path d="M50 125 Q40 140 50 150" stroke="#fde047" strokeWidth={1} fill="none" opacity={0.7} />
              <ellipse cx="30" cy="35" rx="14" ry="10" fill="rgba(255,255,255,0.3)" transform="rotate(-30 30 35)" filter="blur(2px)" />
              <ellipse cx="35" cy="45" rx="6" ry="6" fill="rgba(255,255,255,0.2)" filter="blur(3px)" />
            </svg>
            <svg viewBox="0 0 100 140" className="w-16 h-22 -mr-4 drop-shadow-2xl" style={{ transformOrigin: "50% 100% 0" }}>
              <defs>
                <radialGradient id="heroGold2" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#F3D5B0" /><stop offset="50%" stopColor="#A4743E" /><stop offset="100%" stopColor="#7D5129" />
                </radialGradient>
              </defs>
              <ellipse cx="50" cy="60" rx="45" ry="55" fill="url(#heroGold2)" />
              <path d="M45 115 L55 115 L50 125 Z" fill="#ca8a04" />
              <path d="M50 125 Q40 140 50 150" stroke="#fde047" strokeWidth={1} fill="none" opacity={0.7} />
              <ellipse cx="30" cy="35" rx="14" ry="10" fill="rgba(255,255,255,0.3)" transform="rotate(-30 30 35)" filter="blur(2px)" />
              <ellipse cx="35" cy="45" rx="6" ry="6" fill="rgba(255,255,255,0.2)" filter="blur(3px)" />
            </svg>
          </div>

          <motion.div className="hero-copy relative z-20 max-w-[820px] will-change-transform" style={{ y: copyY, opacity: copyOpacity }}>
            <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8, ease: EASE.out }}>
              <Crown size={13} /> THE BIRTHDAY EDITION · 18.11.2026
            </motion.p>

            <h1 className="hero-name font-theme">
              <KineticLetters text="PRINCE" delay={0.1} />
            </h1>

            <motion.div className="hero-chapter flex items-center gap-3 mb-5" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.9, ease: EASE.out }}>
              <span className="chapter-word text-[8px] text-white/60 tracking-widest font-mono">CHAPTER</span>
              <span className="chapter-num font-[Anton] text-[30px] text-lilac leading-[0.8] cursor-pointer transition" onClick={petalBurst}>16</span>
              <span className="chapter-rule flex-1 max-w-[260px] h-[1px] bg-gradient-to-r from-white/26 to-transparent" />
            </motion.div>

            <motion.p className="hero-line font-[Playfair_Display] font-italic font-bold text-[40px] leading-[0.95] tracking-tighter text-white" initial={{ opacity: 0, y: 24, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.75, duration: 0.9, ease: EASE.out }}>
              It's your <em className="text-lilac">era.</em>
            </motion.p>

            <motion.p className="hero-copy-text max-w-[390px] mt-5 text-[14px] leading-[1.7] text-white/60" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.8, ease: EASE.out }}>
              One more orbit. A whole new level. The world just got a little more legendary — and it's wearing your name.
            </motion.p>

            <motion.div className="hero-chip inline-flex items-center gap-2 mt-6 border border-white/10 bg-white/5 rounded-full px-[14px] py-[10px] text-[7px] tracking-widest text-white backdrop-blur-[10px]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8, ease: EASE.out }}>
              <Sparkles size={14} /> CHAPTER SIXTEEN · UNLOCKED
              <span className="chip-dot w-[5px] h-[5px] rounded-full bg-mint shadow-[0_0_8px_rgba(165,242,211,0.8)]" />
            </motion.div>
          </motion.div>

          <div className="scroll-cue absolute bottom-[74px] left-[20px] z-20 flex flex-col gap-2 text-[6.5px] tracking-widest text-white/40 font-mono">
            <span>SCROLL TO OPEN THE FILM</span>
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowDown size={16} />
            </motion.span>
          </div>

          <div className="hero-marquee absolute left-0 right-0 bottom-0 h-[42px] z-30 bg-white/9 border-t border-white/16 border-b border-white/10 backdrop-blur-[10px]">
            <VelocityMarquee>PRINCE'S DAY ✦ STAY LEGENDARY ✦ CHAPTER 16 ✦ IT'S YOUR ERA ✦</VelocityMarquee>
          </div>
        </section>
      </NavShell>
    </div>
  );
}
