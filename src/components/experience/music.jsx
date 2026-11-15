"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronUp,
  Disc3,
  Pause,
  Play,
  Radio,
  SkipForward,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { Lily, Reveal, SectionHead, TiltCard } from "@/components/ui/motion-kit";
import { PRINCE } from "@/lib/prince";
import { sfx, vibrate } from "@/lib/sfx";
import { EASE } from "@/lib/motion";

const LINES = [
  [
    "Streetlights flicker on our names",
    "We move loud, we move like flame",
    "Every block a chapter, every night a scene",
  ],
  [
    "The days feel softer next to you",
    "Ordinary hours turning gold",
    "Stay close — the whole year is ours",
  ],
];

const SCENES = ["/images/1.jpg", "/images/2.jpg"];

function Equalizer({ active, className = "" }) {
  return (
    <div className={`equalizer ${active ? "is-on" : ""} ${className}`} aria-hidden="true">
      {Array.from({ length: 22 }).map((_, i) => (
        <i
          key={i}
          style={{
            height: `${7 + ((i * 7) % 18)}px`,
            animationDelay: `${(i % 7) * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function MusicChapter() {
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [islandOpen, setIslandOpen] = useState(false);
  const song = PRINCE.songs[track];
  const lines = LINES[track];

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setProgress((value) => {
        const next = value + 0.008;
        return next >= 1 ? 0 : next;
      });
    }, 110);
    return () => clearInterval(timer);
  }, [playing, track]);

  const activeLine = Math.min(lines.length - 1, Math.floor(progress * lines.length));
  const lineFraction = progress * lines.length - activeLine;
  const wordsInLine = lines[activeLine].split(" ");
  const litWords = Math.max(1, Math.ceil(lineFraction * wordsInLine.length));

  const totalWords = useMemo(() => lines.reduce((sum, line) => sum + line.split(" ").length, 0), [lines]);

  function togglePlay() {
    setPlaying((value) => !value);
    sfx.click();
    vibrate(10);
  }

  function switchTrack(next = (track + 1) % PRINCE.songs.length) {
    setTrack(next);
    setProgress(0);
    setPlaying(true);
    sfx.cassette();
    vibrate([8, 30, 8]);
  }

  function scrub(event) {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    setProgress(ratio);
    sfx.click();
  }

  return (
    <section className="music" id="music">
      <div className="music-aura" aria-hidden="true" />
      <div className="wrap">
        <SectionHead
          scene="SC.03"
          eyebrow="THE SOUNDTRACK · TWO SIDES"
          title="press play."
          accent="stay a while."
          copy="A visual mixtape built from the two songs that own the aux. No borrowed lyrics — just the feeling, translated into light, motion and lilies."
        />

        <Reveal delay={0.06}>
          <div className="music-stage">
            <div className="cassette-zone">
              <div className="side-tabs" role="tablist" aria-label="Mixtape sides">
                {PRINCE.songs.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={track === index}
                    className={track === index ? "side-tab active" : "side-tab"}
                    onClick={() => switchTrack(index)}
                  >
                    <span className="mono">SIDE {index === 0 ? "A" : "B"}</span>
                    <b>{item.title}</b>
                  </button>
                ))}
              </div>

              <div className="cassette-shell">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={song.id}
                    className={`cassette ${playing ? "is-playing" : ""}`}
                    initial={{ rotateY: -78, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 78, opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE.inOut }}
                  >
                    <div className="cassette-top">
                      <span className="mono">{PRINCE.productionCode} · MIXTAPE</span>
                      <span className="mono">{playing ? "REC ●" : "STANDBY"}</span>
                    </div>
                    <div className="cassette-window">
                      <span className={`reel ${playing ? "spin" : ""}`} />
                      <span className="tape-line" />
                      <span className={`reel ${playing ? "spin" : ""}`} />
                    </div>
                    <div className="cassette-label">
                      <span className="mono">SIDE {track === 0 ? "A" : "B"} · CH.16</span>
                      <strong>{song.title}</strong>
                      <span className="mono cassette-mood">{song.mood}</span>
                    </div>
                    <div className="cassette-dots" aria-hidden="true">
                      <i /><i /><i /><i />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="mono cassette-note">
                VISUAL MIXTAPE · ORIGINAL MOOD LINES · TAP TO FLIP SIDES
              </p>
            </div>

            <Reveal delay={0.1}>
              <TiltCard className="player" max={7}>
                <div className="player-vinyl-zone">
                  <div className={`vinyl ${playing ? "spinning" : ""}`} aria-hidden="true">
                    <span className="vinyl-groove g1" />
                    <span className="vinyl-groove g2" />
                    <span className="vinyl-groove g3" />
                    <span className="vinyl-label">
                      <Disc3 size={18} />
                      <b>PRINCE</b>
                      <em className="mono">CH.16</em>
                    </span>
                  </div>
                  <span className={`tonearm ${playing ? "drop" : ""}`} aria-hidden="true" />
                </div>

                <div className="player-main">
                  <div className="player-live mono">
                    <span className={playing ? "signal on" : "signal"} />
                    {playing ? "NOW IN THE AIR" : "READY WHEN YOU ARE"}
                  </div>
                  <h3 className="player-title">{song.title}</h3>
                  <p className="mono player-sub">{song.mood}</p>

                  <Equalizer active={playing} />

                  <div className="player-progress" onClick={scrub} role="slider" aria-label="Scrub visual mixtape" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress * 100)} tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight") setProgress((p) => Math.min(1, p + 0.05));
                      if (event.key === "ArrowLeft") setProgress((p) => Math.max(0, p - 0.05));
                    }}
                  >
                    <span className="player-progress-fill" style={{ width: `${progress * 100}%` }} />
                    <span className="player-progress-knob" style={{ left: `${progress * 100}%` }} />
                  </div>

                  <div className="player-controls">
                    <button type="button" className="play-btn" onClick={togglePlay} aria-label={playing ? "Pause visualizer" : "Play visualizer"}>
                      {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button type="button" className="side-btn" onClick={() => switchTrack()} aria-label="Switch to the other anthem">
                      <SkipForward size={16} />
                      <span className="mono">NEXT SIDE</span>
                    </button>
                    <span className="mono player-time">
                      {String(Math.floor(progress * 3.16)).padStart(1, "0")}:
                      {String(Math.floor((progress * 3.16 * 60) % 60)).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <span className="player-gloss" aria-hidden="true" />
                <span className="player-island-hint mono">
                  <Radio size={11} /> DYNAMIC ISLAND ARMED
                </span>
              </TiltCard>
            </Reveal>
          </div>
        </Reveal>

        <div className="lyric-scene">
          <Reveal delay={0.05}>
            <div className="lyric-frame">
              <div className={`lyric-photo p${track}`}>
                <img src={SCENES[track]} alt="" aria-hidden="true" />
                <span className="ken-burns" />
                <span className="light-leak l1" />
                <span className="light-leak l2" />
              </div>

              <div className="lyric-card">
                <div className="lyric-head mono">
                  <span><Sparkles size={11} /> SIDE {track === 0 ? "A" : "B"}</span>
                  <span>{PRINCE.songs[track].title}</span>
                </div>

                <div className="lyric-lines" aria-live="polite">
                  {lines.map((line, lineIndex) => {
                    const words = line.split(" ");
                    const isActive = lineIndex === activeLine;
                    return (
                      <p
                        key={line}
                        className={`lyric-line ${isActive ? "active" : ""}`}
                        onClick={() => {
                          setProgress((lineIndex + 0.5) / lines.length);
                          setPlaying(true);
                        }}
                      >
                        {words.map((word, wordIndex) => (
                          <span
                            key={`${word}-${wordIndex}`}
                            className={isActive && wordIndex < litWords ? "lit" : ""}
                          >
                            {word}{" "}
                          </span>
                        ))}
                      </p>
                    );
                  })}
                </div>

                <div className="lyric-foot">
                  <div className="lyric-bars" aria-hidden="true">
                    <span style={{ width: `${progress * 100}%` }} />
                  </div>
                  <span className="mono">{Math.round(progress * 100)}%</span>
                </div>

                <AnimatePresence>
                  {activeLine >= 0 && (
                    <motion.div
                      key={`${track}-${activeLine}`}
                      className="lyric-bloom"
                      initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.4, rotate: 20 }}
                      transition={{ duration: 0.6, ease: EASE.out }}
                      aria-hidden="true"
                    >
                      <Lily />
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="lyric-note mono">TAP A LINE TO CUE IT · WORDS LIGHT AS THE TRACK MOVES</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="music-footnote">
            <span className="mono"><Volume2 size={12} /> AUDIO-FREE BY DESIGN</span>
            <p>Every beat you see is drawn in real time — a lyric-video mood board with no sound, no borrowed words, and all of the feeling.</p>
            <span className="mono"><Radio size={12} /> {totalWords} WORDS · 2 SIDES</span>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {playing && (
          <motion.div
            layout
            className={`dynamic-island ${islandOpen ? "open" : ""}`}
            initial={{ y: -90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={() => setIslandOpen((value) => !value)}
            role="status"
            aria-label="Now playing visual mixtape"
          >
            <div className="island-inner">
              <span className={`island-vinyl ${playing ? "spin" : ""}`} aria-hidden="true" />
              <div className="island-meta">
                <span className="mono island-kicker">NOW PLAYING · CH.16</span>
                <strong>{song.title}</strong>
                <span className="mono island-sub">{song.mood}</span>
              </div>
              <Equalizer active={playing} className="island-eq" />
              <button
                type="button"
                className="island-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  togglePlay();
                }}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
              </button>
              <button
                type="button"
                className="island-btn ghost"
                onClick={(event) => {
                  event.stopPropagation();
                  setPlaying(false);
                  setIslandOpen(false);
                }}
                aria-label="Close now playing"
              >
                <X size={15} />
              </button>
              <ChevronUp size={12} className="island-chevron" aria-hidden="true" />
            </div>
            {islandOpen && (
              <motion.div
                className="island-expanded"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="island-wave" aria-hidden="true">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <i key={i} style={{ height: `${4 + ((i * 11) % 24)}px`, animationDelay: `${i * 0.02}s` }} />
                  ))}
                </div>
                <div className="island-lines mono">
                  <span>VISUAL MIXTAPE</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
