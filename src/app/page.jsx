"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Loader from "@/components/experience/loader";
import Unlock from "@/components/experience/unlock";
import PinLock from "@/components/experience/pin-lock";
import Hero from "@/components/experience/hero";
import Dossier from "@/components/experience/dossier";
import MusicChapter from "@/components/experience/music";
import Memories from "@/components/experience/memories";
import CakeScene from "@/components/experience/cake";
import Finale from "@/components/experience/finale";
import ChapterRail from "@/components/experience/chapter-rail";
import AudioToggle from "@/components/experience/audio-toggle";
import { Lily } from "@/components/ui/motion-kit";
import { EASE } from "@/lib/motion";

export default function Home() {
  const [phase, setPhase] = useState("pin"); // pin → boot → seal → film
  const [credits, setCredits] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  const enterFilm = useCallback(() => {
    setPhase("film");
    setCredits(true);
    window.scrollTo({ top: 0, behavior: "auto" });
    const timer = setTimeout(() => setCredits(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  const enterBoot = useCallback(() => {
    setPhase("boot");
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === "film" ? "" : "hidden";
    const lenis = typeof window !== "undefined" ? window.__lenis : null;
    if (lenis) {
      if (phase === "film") lenis.start();
      else lenis.stop();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  function replay() {
    setCredits(false);
    setPhase("pin");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return (
    <>
      <div className="film-grain" aria-hidden="true" />
      <div className="film-vignette" aria-hidden="true" />

      {phase === "film" && (
        <motion.div
          className="scroll-progress"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
      )}

      <AnimatePresence mode="wait">
        {phase === "pin" && <PinLock key="pin" onUnlock={enterBoot} />}
        {phase === "boot" && <Loader key="loader" onDone={() => setPhase("seal")} />}
        {phase === "seal" && <Unlock key="unlock" onUnlock={enterFilm} />}
      </AnimatePresence>

      {phase === "film" && (
        <>
          <ChapterRail />
          <AudioToggle />

          <main className="film">
            <Hero />
            <Dossier />
            <MusicChapter />
            <Memories />
            <CakeScene />
            <Finale onReplay={replay} />
          </main>
        </>
      )}

      <AnimatePresence>
        {credits && (
          <motion.div
            className="opening-credits"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE.out } }}
            onClick={() => setCredits(false)}
            aria-label="Opening credits"
          >
            <div className="credits-letterbox top" />
            <Lily className="opening-lily" />
            <div className="opening-copy">
              <p className="mono">A FILM BY</p>
              <h3>YOUR BEST FRIEND</h3>
              <span className="mono">STARRING</span>
              <h2>PRINCE</h2>
              <div className="opening-rule" />
              <p className="mono">CHAPTER 16 · IT&apos;S YOUR ERA</p>
            </div>
            <div className="credits-letterbox bottom" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
