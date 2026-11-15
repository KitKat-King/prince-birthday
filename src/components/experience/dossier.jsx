"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Crown, Flower2, Gem, Music2, RotateCcw, Sparkles } from "lucide-react";
import { Lily, Reveal, SectionHead, TiltCard } from "@/components/ui/motion-kit";
import { PRINCE } from "@/lib/prince";
import { SPRING } from "@/lib/motion";
import { sfx, vibrate } from "@/lib/sfx";

function useLived() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const birth = Date.UTC(2010, 10, 18, 0, 0, 0);
  const ms = Math.max(0, now - birth);
  return {
    hours: Math.floor(ms / 3600000),
    days: Math.floor(ms / 86400000),
    minutes: Math.floor(ms / 60000),
  };
}

const REDACTED = [
  ["CLASSIFIED TRAIT", "effortlessly impossible to forget"],
  ["EARLY PREDICTION", "main character, confirmed"],
  ["ERA STATUS", "only getting louder from here"],
];

export default function Dossier() {
  const [flipped, setFlipped] = useState(false);
  const { hours, days, minutes } = useLived();

  function flip() {
    setFlipped((value) => !value);
    sfx.click();
    vibrate(8);
  }

  return (
    <section className="dossier" id="dossier">
      <div className="dossier-aura" aria-hidden="true" />
      <div className="wrap">
        <SectionHead
          scene="SC.02"
          eyebrow="THE ROYAL DOSSIER"
          title="main character"
          accent="energy."
          copy="Filed under: born for bright entrances. Cleared for a whole new chapter. Tap the card — the file has two sides."
        />

        <div className="dossier-grid">
          <Reveal className="flip-wrap">
            <TiltCard className="flip-tilt" max={7} glare={false}>
              <motion.div
                className="flip-inner"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={SPRING.soft}
                style={{ transformStyle: "preserve-3d" }}
              >
                <article className="id-card face-front" onClick={flip} aria-label="Prince dossier card, tap to flip">
                  <div className="id-holo" aria-hidden="true" />
                  <div className="id-top mono">
                    <span>SUBJECT_001</span>
                    <span className="id-clearance">CLASSIFIED · LEGEND</span>
                  </div>
                  <div className="id-crest">
                    <Crown size={18} />
                    <span className="mono">PRNC · 16</span>
                  </div>
                  <h3 className="id-name">PRINCE</h3>
                  <p className="id-tagline">Made for bright entrances and better stories.</p>
                  <div className="id-meta">
                    <div>
                      <span className="mono">DATE OF BIRTH</span>
                      <b>18 · 11 · 2010</b>
                    </div>
                    <div>
                      <span className="mono">SIGNATURE</span>
                      <b className="script">Lily</b>
                    </div>
                  </div>
                  <div className="id-stripes" aria-hidden="true" />
                  <span className="id-flip-hint mono"><RotateCcw size={12} /> TAP TO FLIP</span>
                  <motion.span
                    className="stamp stamp-approved"
                    initial={{ opacity: 0, scale: 2.1, rotate: -24 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: -11 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ ...SPRING.bouncy, delay: 0.5 }}
                  >
                    APPROVED
                    <small>18 NOV</small>
                  </motion.span>
                </article>

                <article className="id-card face-back" onClick={flip} aria-label="Dossier back with live stats">
                  <div className="id-top mono">
                    <span>FILE_16 · BACK</span>
                    <span className="id-clearance">LIVE DATA</span>
                  </div>
                  <div className="back-hours">
                    <span className="mono">HOURS LIVED SINCE 18.11.2010</span>
                    <strong className="mono">{hours.toLocaleString("en-US")}</strong>
                    <span className="back-sub mono">{days.toLocaleString("en-US")} DAYS · {minutes.toLocaleString("en-US")} MINUTES</span>
                  </div>
                  <div className="back-facts">
                    <span className="mono"><Flower2 size={12} /> SIGNATURE FLOWER · LILY</span>
                    <span className="mono"><Music2 size={12} /> SOUNDTRACK · 02 ANTHEMS</span>
                    <span className="mono"><Gem size={12} /> CLEARANCE · CH-16</span>
                  </div>
                  <p className="back-quote">
                    “Sixteen years of showing up like a whole main event.”
                  </p>
                  <span className="id-flip-hint mono"><RotateCcw size={12} /> TAP TO FLIP BACK</span>
                  <motion.span
                    className="stamp stamp-verified"
                    initial={{ opacity: 0, scale: 2.1, rotate: 15 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 8 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ ...SPRING.bouncy, delay: 0.35 }}
                  >
                    VERIFIED
                    <small>LILY CODED</small>
                  </motion.span>
                </article>
              </motion.div>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.1}>
            <TiltCard className="lily-panel" max={8}>
              <div className="lily-panel-glow" aria-hidden="true" />
              <span className="micro mono">SIGNATURE SYMBOL</span>
              <Lily className="lily-hero" draw />
              <h3 className="lily-title">Lily<br /><em>coded.</em></h3>
              <p className="lily-copy">Soft power. Rare energy. Impossible to ignore. The flower that matches your whole aura.</p>
              <div className="lily-chips">
                <span className="mini-chip mono"><BadgeCheck size={11} /> RARE</span>
                <span className="mini-chip mono">SOFT POWER</span>
                <span className="mini-chip mono">CH.16</span>
              </div>
              <Sparkles className="lily-spark" size={16} />
            </TiltCard>
          </Reveal>
        </div>

        <div className="redacted-list">
          {REDACTED.map(([label, text], index) => (
            <Reveal key={label} delay={index * 0.08}>
              <div className="redacted-row">
                <span className="mono redacted-label">{label}</span>
                <span className="redacted-text">
                  {text}
                  <motion.span
                    className="redacted-bar"
                    initial={{ scaleX: 1 }}
                    whileInView={{ scaleX: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, delay: 0.4 + index * 0.12, ease: [0.76, 0, 0.24, 1] }}
                    style={{ originX: 0 }}
                  />
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="stat-strip">
          {[
            { value: "16", label: "CHAPTERS UNLOCKED", icon: Crown },
            { value: "02", label: "ANTHEMS ON REPEAT", icon: Music2 },
            { value: "01", label: "SIGNATURE FLOWER", icon: Flower2 },
            { value: "∞", label: "GOOD THINGS AHEAD", icon: Sparkles },
          ].map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.06}>
              <div className="stat-cell">
                <stat.icon size={14} />
                <b>{stat.value}</b>
                <span className="mono">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
