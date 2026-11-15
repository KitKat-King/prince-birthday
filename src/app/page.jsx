"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/aceternity/Card3D";
import { Spotlight } from "@/components/ui/aceternity/Spotlight";
import { GlowCard } from "@/components/ui/skiper/GlowCard";
import { TextReveal } from "@/components/ui/animmaster/TextReveal";
import { FloatingOrbs } from "@/components/ui/animmaster/FloatingOrbs";
import {
  Sparkles,
  Crown,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Music,
  Share2,
  CheckCircle2,
  ChevronDown,
  Gift,
  Disc3,
  PartyPopper,
} from "lucide-react";

/* ============================================================
   DATA & CONSTANTS
   ============================================================ */
const PRINCE = {
  name: "Prince",
  birthDate: "18 November 2010",
  dateFormatted: "18 · 11 · 2010",
  age: 16,
  flower: "White Lily",
  tagline: "16 Years of Unfiltered Royalty & Legacy",
};

const TRACKS = [
  {
    id: 0,
    title: "Bairan",
    artist: "Prince’s Prime Anthem",
    duration: "3:42",
    vibe: "High Energy · Bass Loaded · Certified Hype",
    color: "#a855f7",
    glow: "rgba(168, 85, 247, 0.45)",
    lyrics: "The energy speaks before you even enter the room.",
  },
  {
    id: 1,
    title: "Tere Aasa Pass Din Sara",
    artist: "Prince’s Timeless Loop",
    duration: "4:08",
    vibe: "Soulful · Magnetic · Always On Repeat",
    color: "#ec4899",
    glow: "rgba(236, 72, 153, 0.45)",
    lyrics: "Unforgettable aura that stays timeless forever.",
  },
];

const MEMORIES = [
  {
    id: 1,
    title: "The King's Smile",
    caption: "Confidence isn't taught. You were born with it.",
    src: "/images/1.jpg",
    tag: "AURA 100%",
  },
  {
    id: 2,
    title: "Unstoppable Drive",
    caption: "Every single room you walk into, you own the energy.",
    src: "/images/2.jpg",
    tag: "LEGEND",
  },
  {
    id: 3,
    title: "The Brother We Trust",
    caption: "Loyalty over everything. True brothers stand timeless.",
    src: "/images/3.jpg",
    tag: "BROTHERHOOD",
  },
  {
    id: 4,
    title: "Chapter 16 Begins",
    caption: "Level 16 unlocked. The whole universe is yours to conquer.",
    src: "/images/4.jpg",
    tag: "LEVEL 16",
  },
];

const STATS = [
  { label: "Years of Greatness", val: "16", suffix: "" },
  { label: "Days of Royalty", val: "5,844", suffix: "+" },
  { label: "Loyalty Score", val: "100", suffix: "%" },
  { label: "Swagger Aura", val: "∞", suffix: "" },
];

/* ============================================================
   CONFETTI UTILITY
   ============================================================ */
function fireGrandConfetti() {
  if (typeof window === "undefined") return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ["#a855f7", "#ec4899", "#ffd700"],
  });
  fire(0.2, {
    spread: 60,
    colors: ["#ffffff", "#c084fc", "#f43f5e"],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ["#ffd700", "#a855f7", "#38bdf8"],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ["#ffffff", "#f472b6"],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ["#ffd700", "#c084fc"],
  });
}

/* ============================================================
   LILY SVG VECTOR
   ============================================================ */
function RoyalLily({
  className = "",
  style,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="lilyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#f3e8ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="lilyAccent" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0.2" />
        </linearGradient>
        {glow && (
          <filter id="lilyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>
      <g filter={glow ? "url(#lilyGlow)" : undefined}>
        {/* Center Main Petal */}
        <path
          d="M32 58C25 48 20 37 20 26C20 14 26 5 32 2C38 5 44 14 44 26C44 37 39 48 32 58Z"
          fill="url(#lilyGrad)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.75"
        />
        {/* Left Side Petal */}
        <path
          d="M32 34C20 28 11 19 9 10C15 9 22 10 27 15C31 19 33 25 32 34Z"
          fill="url(#lilyAccent)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.7"
        />
        {/* Right Side Petal */}
        <path
          d="M32 34C44 28 53 19 55 10C49 9 42 10 37 15C33 19 31 25 32 34Z"
          fill="url(#lilyAccent)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.7"
        />
        {/* Center Golden Stem & Stamens */}
        <path
          d="M32 58V32"
          stroke="rgba(255,215,0,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="32" cy="28" r="2.2" fill="#ffd700" />
        <circle cx="28" cy="25" r="1.5" fill="#fbcfe8" />
        <circle cx="36" cy="25" r="1.5" fill="#fbcfe8" />
      </g>
    </svg>
  );
}

/* ============================================================
   FLOATING LILIES AMBIENT BACKGROUND
   ============================================================ */
function AmbientFloatingLilies() {
  const lilies = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${(i * 7.5 + (i % 3) * 11) % 92 + 4}%`,
        top: `${(i * 13.2 + (i % 4) * 8) % 92 + 4}%`,
        size: 24 + (i % 4) * 12,
        duration: 8 + (i % 5) * 2.5,
        delay: i * 0.45,
        rotation: (i * 37) % 360,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[1]">
      {lilies.map((l) => (
        <motion.div
          key={l.id}
          className="absolute"
          style={{
            left: l.left,
            top: l.top,
            width: l.size,
            height: l.size,
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-8, 8, -8],
            rotate: [l.rotation, l.rotation + 20, l.rotation],
            opacity: [0.08, 0.22, 0.08],
          }}
          transition={{
            duration: l.duration,
            repeat: Infinity,
            delay: l.delay,
            ease: "easeInOut",
          }}
        >
          <RoyalLily className="h-full w-full" glow />
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================
   SKIPER UI DYNAMIC ISLAND (Sticky Mobile Island)
   ============================================================ */
function MobileDynamicIsland({
  activeTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside aria-label="Quick Controls" className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={() => setExpanded(!expanded)}
        className="pointer-events-auto cursor-pointer rounded-full bg-zinc-950/90 text-white backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)] px-4 py-2 transition-all hover:border-purple-500/50"
      >
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] font-black tracking-widest text-white uppercase">
                  PRINCE · 16
                </span>
              </div>
              <div className="h-2 w-px bg-white/20" />
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((bar) => (
                  <motion.div
                    key={bar}
                    className="w-[2px] rounded-full bg-pink-500"
                    animate={{
                      height: isPlaying ? [4, 14, 6] : 4,
                    }}
                    transition={{
                      duration: 0.5 + bar * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: bar * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-bold text-white/60 truncate max-w-[90px]">
                {activeTrack.title}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-[280px] p-2 flex flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <RoyalLily className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">
                      {activeTrack.title}
                    </p>
                    <p className="text-[9px] text-white/50">{activeTrack.artist}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    fireGrandConfetti();
                  }}
                  className="rounded-full bg-purple-500/20 border border-purple-500/40 p-1.5 text-purple-300 hover:bg-purple-500/30"
                >
                  <PartyPopper className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between px-2">
                <button
                  onClick={onTogglePlay}
                  className="flex items-center gap-2 rounded-full bg-white text-black font-black text-[11px] px-3 py-1 hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3 w-3 fill-black" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-black" /> Play Anthem
                    </>
                  )}
                </button>
                <button
                  onClick={onNextTrack}
                  className="flex items-center gap-1 text-[10px] text-white/70 hover:text-white"
                >
                  Next Track <SkipForward className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
}

/* ============================================================
   GRAND SCREEN-TAKEOVER ENTRANCE ("PRINCE PROTOCOL")
   ============================================================ */
function GrandEntranceGate({ onUnlocked }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    let interval = null;
    if (holding) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setExploded(true);
            fireGrandConfetti();
            setTimeout(onUnlocked, 1000);
            return 100;
          }
          return prev + 4;
        });
      }, 35);
    } else {
      setProgress(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [holding, onUnlocked]);

  const handleInstantOpen = () => {
    setProgress(100);
    setExploded(true);
    fireGrandConfetti();
    setTimeout(onUnlocked, 900);
  };

  return (
    <AnimatePresence>
      {!exploded && (
        <motion.div
          key="gate"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black px-6 py-12 text-white overflow-hidden select-none"
          exit={{
            opacity: 0,
            scale: 1.15,
            filter: "blur(20px)",
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Ambient Cosmic Lights */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-purple-600/20 blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-pink-600/20 blur-[90px]" />
          </div>

          {/* Top Classification Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-1.5 z-10"
          >
            <div className="rounded-full border border-purple-500/40 bg-purple-950/30 px-3.5 py-1 text-[9px] font-black tracking-[0.4em] text-purple-300 uppercase backdrop-blur-md">
              ROYAL PROTOCOL · CONFIDENTIAL
            </div>
            <p className="text-[10px] font-mono text-white/40 tracking-widest">
              RESTRICTED FOR: PRINCE
            </p>
          </motion.div>

          {/* Center Crown & Royal Shield */}
          <div className="relative flex flex-col items-center gap-6 z-10">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: holding ? 1.08 : 1,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-purple-500/30 to-pink-500/30 blur-2xl animate-pulse" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-b from-white/10 to-white/[0.02] backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                <Crown className="h-14 w-14 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
              </div>
            </motion.div>

            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-[clamp(3.2rem,16vw,6rem)] font-black tracking-tighter leading-none"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #e9d5ff 40%, #f472b6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PRINCE
              </motion.h1>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.45em] text-white/60">
                18 NOVEMBER 2010
              </p>
              <p className="mt-1 text-[11px] text-purple-300/80 font-mono">
                TURNING 16 TODAY · GODSPEED
              </p>
            </div>
          </div>

          {/* Bottom Interactive Hold-to-Unlock / Tap button */}
          <div className="flex flex-col items-center gap-4 z-10 w-full max-w-xs">
            <div className="relative flex items-center justify-center">
              {/* Radial Progress Ring */}
              <svg className="h-28 w-28 -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="url(#gateGrad)"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="314"
                  strokeDashoffset={314 - (314 * progress) / 100}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gateGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>

              <button
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onTouchStart={() => setHolding(true)}
                onTouchEnd={() => setHolding(false)}
                onClick={handleInstantOpen}
                className="absolute flex h-20 w-20 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95 transition-all"
              >
                <Sparkles className="h-6 w-6" />
                <span className="text-[8px] font-black tracking-widest mt-0.5">
                  ENTER
                </span>
              </button>
            </div>

            <p className="text-[10px] font-mono text-white/50 tracking-wider text-center">
              HOLD OR TAP TO UNLOCK EXPERIENCE
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   HERO SECTION (Mobile-First Masterpiece)
   ============================================================ */
function MasterHeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 80]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0.2]);

  return (
    <section className="relative min-h-[95svh] flex flex-col justify-between items-center px-5 pt-20 pb-8 text-center overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />

      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.35em] text-purple-200 backdrop-blur-xl shadow-lg"
      >
        <Sparkles className="h-3 w-3 text-amber-300" />
        CELEBRATING PRINCE · CHAPTER 16
        <Sparkles className="h-3 w-3 text-amber-300" />
      </motion.div>

      {/* Hero Typography */}
      <motion.div style={{ y, opacity }} className="my-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-10 bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-amber-500/10 blur-3xl opacity-75 pointer-events-none" />

          <p className="text-[11px] font-mono font-bold tracking-[0.5em] text-white/40 uppercase mb-2">
            THE CHOSEN MONARCH
          </p>

          <h1
            className="text-[clamp(5.5rem,28vw,12rem)] font-black leading-[0.85] tracking-tighter"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, #f3e8ff 45%, #c084fc 80%, rgba(255,255,255,0.2) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PRINCE
          </h1>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400" />
            <p className="text-xs font-black uppercase tracking-[0.4em] text-purple-300">
              18 · 11 · 2010
            </p>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-6 max-w-[320px] text-xs sm:text-sm font-medium leading-relaxed text-white/65"
        >
          Today isn’t just your birthday. Today is a celebration of your
          loyalty, your swagger, and the undeniable aura you carry everywhere.
        </motion.p>
      </motion.div>

      {/* Live Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.8 }}
        className="grid grid-cols-4 gap-2 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-xl"
      >
        {STATS.map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <span className="text-sm font-black text-white">
              {s.val}
              <span className="text-[10px] text-purple-400">{s.suffix}</span>
            </span>
            <span className="text-[8px] font-semibold text-white/40 uppercase tracking-tight mt-0.5">
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Scroll Down Cue */}
      <div className="mt-6 flex flex-col items-center gap-1.5 opacity-60">
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">
          EXPLORE THE ARCHIVE
        </span>
        <ChevronDown className="h-3.5 w-3.5 animate-bounce text-purple-400" />
      </div>
    </section>
  );
}

/* ============================================================
   ACETERNITY 3D TILT MATRIX ("THE ROYAL DOSSIER")
   ============================================================ */
function RoyalDossierSection() {
  return (
    <section className="relative px-5 py-20">
      <div className="text-center mb-10">
        <span className="rounded-full bg-pink-500/10 border border-pink-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-pink-300">
          ACETERNITY 3D MATRIX
        </span>
        <TextReveal
          text="THE ROYAL DOSSIER"
          className="mt-3 text-[clamp(2.4rem,12vw,5rem)] font-black text-white tracking-tight justify-center"
        />
        <p className="mt-2 text-xs text-white/50 max-w-xs mx-auto">
          Touch & tilt each card to interact with Prince’s legendary profile.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-md mx-auto">
        {/* Card 1: Identity */}
        <CardContainer className="w-full">
          <CardBody className="relative group/card border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border rounded-3xl p-6 backdrop-blur-2xl">
            <CardItem
              translateZ={50}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400"
            >
              FILE #001 · IDENTITY
            </CardItem>
            <CardItem
              translateZ={60}
              className="text-2xl font-black text-white mt-2"
            >
              PRINCE
            </CardItem>
            <CardItem
              as="p"
              translateZ={40}
              className="text-xs text-white/60 mt-2 leading-relaxed"
            >
              Not just a title, but a lifestyle. Natural command, fierce loyalty,
              and a presence that commands respect effortlessly.
            </CardItem>
            <CardItem translateZ={80} className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[9px] font-black text-purple-300">
                18 NOV 2010
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-black text-white/70">
                LEVEL 16
              </span>
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* Card 2: Royal Emblem (Lily) */}
        <CardContainer className="w-full">
          <CardBody className="relative group/card border-white/10 bg-gradient-to-b from-purple-900/20 to-black border rounded-3xl p-6 backdrop-blur-2xl overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none">
              <RoyalLily className="h-36 w-36" glow />
            </div>
            <CardItem
              translateZ={50}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400"
            >
              FILE #002 · EMBLEM
            </CardItem>
            <CardItem
              translateZ={60}
              className="text-2xl font-black text-white mt-2 flex items-center gap-2"
            >
              THE WHITE LILY
            </CardItem>
            <CardItem
              as="p"
              translateZ={40}
              className="text-xs text-white/60 mt-2 leading-relaxed"
            >
              Prince’s signature flower. Representing unmatched elegance, pure
              intentions, and unbreakable resilience under pressure.
            </CardItem>
            <CardItem translateZ={70} className="mt-4">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-bold">
                <Sparkles className="h-4 w-4" /> Always Blooming in Adversity
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* Card 3: Swagger Index */}
        <CardContainer className="w-full">
          <CardBody className="relative group/card border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border rounded-3xl p-6 backdrop-blur-2xl">
            <CardItem
              translateZ={50}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400"
            >
              FILE #003 · VIBE MATRIX
            </CardItem>
            <CardItem
              translateZ={60}
              className="text-2xl font-black text-white mt-2"
            >
              INFINITE AURA
            </CardItem>
            <CardItem
              as="p"
              translateZ={40}
              className="text-xs text-white/60 mt-2 leading-relaxed"
            >
              When Prince enters, the frequency shifts. Authenticity that cannot
              be bought, duplicated, or imitated.
            </CardItem>
            <CardItem translateZ={80} className="mt-4 space-y-1.5 w-full">
              <div className="flex justify-between text-[10px] font-mono text-white/70">
                <span>Loyalty</span>
                <span className="text-amber-400">100%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-full" />
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* Card 4: Chapter 16 */}
        <CardContainer className="w-full">
          <CardBody className="relative group/card border-white/10 bg-gradient-to-b from-blue-900/20 to-black border rounded-3xl p-6 backdrop-blur-2xl">
            <CardItem
              translateZ={50}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400"
            >
              FILE #004 · MILESTONE
            </CardItem>
            <CardItem
              translateZ={60}
              className="text-2xl font-black text-white mt-2"
            >
              TURNING SIXTEEN
            </CardItem>
            <CardItem
              as="p"
              translateZ={40}
              className="text-xs text-white/60 mt-2 leading-relaxed"
            >
              Year 16 is your domain. Every ambition, every target, and every
              dream is yours to conquer with fearless momentum.
            </CardItem>
            <CardItem translateZ={80} className="mt-4">
              <button
                onClick={fireGrandConfetti}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 text-[10px] font-black text-white uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform"
              >
                SALUTE THE KING 👑
              </button>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
    </section>
  );
}

/* ============================================================
   SKIPER UI SOUNDSTAGE ("PRINCE'S JUKEBOX")
   ============================================================ */
function SkiperSoundstageSection({
  activeTrack,
  isPlaying,
  onTogglePlay,
  onSelectTrack,
  onNext,
  onPrev,
}) {
  const [scrub, setScrub] = useState(38);

  return (
    <section className="relative px-5 py-20 max-w-md mx-auto">
      <div className="text-center mb-8">
        <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-purple-300">
          SKIPER UI AUDIO ENGINE
        </span>
        <TextReveal
          text="THE SOUNDTRACK OF PRINCE"
          className="mt-3 text-[clamp(2.2rem,11vw,4.5rem)] font-black text-white tracking-tight justify-center"
        />
        <p className="mt-1 text-xs text-white/50">
          His top favorite anthems on infinite loop.
        </p>
      </div>

      <GlowCard
        glowColor={activeTrack.glow}
        className="p-6 border border-white/15 bg-zinc-950/90 rounded-[2.5rem]"
      >
        {/* Track Pills */}
        <div className="flex gap-2 mb-6">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTrack(t)}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-[10px] font-black tracking-wider uppercase transition-all duration-300 border ${
                activeTrack.id === t.id
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-white/[0.04] text-white/50 border-white/10 hover:border-white/20"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Rotating Vinyl Disc Component */}
        <div className="relative mx-auto my-4 flex h-48 w-48 items-center justify-center">
          {/* Vinyl Grooves */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-zinc-900 via-zinc-800 to-black p-2 shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 flex items-center justify-center"
          >
            <div className="h-full w-full rounded-full border border-white/[0.08] flex items-center justify-center">
              <div className="h-3/4 w-3/4 rounded-full border border-white/[0.06] flex items-center justify-center">
                <div className="h-1/2 w-1/2 rounded-full border border-white/[0.05]" />
              </div>
            </div>
            {/* Center Label */}
            <div
              className="absolute h-20 w-20 rounded-full flex flex-col items-center justify-center text-center p-1"
              style={{
                backgroundColor: activeTrack.color,
                boxShadow: `0 0 25px ${activeTrack.glow}`,
              }}
            >
              <RoyalLily className="h-8 w-8 text-white" />
              <span className="text-[7px] font-black uppercase text-white tracking-widest mt-0.5">
                PRINCE FM
              </span>
            </div>
          </motion.div>

          {/* Equalizer Frequency Bars Overlay */}
          <div className="absolute -bottom-2 flex items-end gap-1 h-8 z-10">
            {[4, 10, 16, 22, 14, 8, 18, 12, 6].map((h, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ backgroundColor: activeTrack.color }}
                animate={{
                  height: isPlaying ? [4, h * 1.5, 4] : 4,
                }}
                transition={{
                  duration: 0.4 + i * 0.08,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        </div>

        {/* Track Title & Vibe Description */}
        <div className="text-center mt-6">
          <h3 className="text-xl font-black text-white tracking-tight">
            {activeTrack.title}
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mt-0.5">
            {activeTrack.artist}
          </p>
          <div className="mt-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-2.5 text-xs text-white/60 italic font-medium">
            "{activeTrack.lyrics}"
          </div>
        </div>

        {/* Scrubber Timeline */}
        <div className="mt-6">
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setScrub(Math.max(0, Math.min(100, pct)));
            }}
            className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer relative"
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${scrub}%`,
                backgroundColor: activeTrack.color,
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-white/40 mt-1.5">
            <span>1:24</span>
            <span>{activeTrack.duration}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={onPrev}
            className="text-white/60 hover:text-white transition-colors active:scale-90"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-black" />
            ) : (
              <Play className="h-6 w-6 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="text-white/60 hover:text-white transition-colors active:scale-90"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      </GlowCard>
    </section>
  );
}

/* ============================================================
   INTERACTIVE POLAROID MEMORY VAULT
   ============================================================ */
function MemoryVaultSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextMemory = () => {
    setActiveIdx((prev) => (prev + 1) % MEMORIES.length);
  };

  const prevMemory = () => {
    setActiveIdx((prev) => (prev - 1 + MEMORIES.length) % MEMORIES.length);
  };

  const current = MEMORIES[activeIdx];

  return (
    <section className="relative px-5 py-20 max-w-md mx-auto">
      <div className="text-center mb-8">
        <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-amber-300">
          PHOTO ARCHIVE
        </span>
        <TextReveal
          text="MOMENTS OF THE KING"
          className="mt-3 text-[clamp(2.2rem,11vw,4.5rem)] font-black text-white tracking-tight justify-center"
        />
        <p className="mt-1 text-xs text-white/50">
          Swipe through timeless snapshots of Prince.
        </p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
            transition={{ duration: 0.4 }}
            className="rounded-[2.5rem] border border-white/15 bg-zinc-950 p-4 shadow-2xl backdrop-blur-2xl"
          >
            <div className="relative h-80 w-full rounded-3xl overflow-hidden bg-zinc-900 border border-white/10">
              <Image
                src={current.src}
                alt={current.title}
                fill
                className="object-cover"
                sizes="(max-width: 600px) 100vw, 400px"
                priority
              />
              <div className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase text-amber-300 border border-white/10">
                {current.tag}
              </div>
            </div>

            <div className="p-4 text-center">
              <h4 className="text-lg font-black text-white tracking-tight">
                {current.title}
              </h4>
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                {current.caption}
              </p>

              <div className="flex items-center justify-center gap-2 mt-4">
                {MEMORIES.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeIdx === i
                        ? "w-6 bg-purple-500"
                        : "w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel buttons */}
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            onClick={prevMemory}
            className="rounded-full border border-white/10 bg-white/[0.05] p-2.5 text-white/70 hover:text-white"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <span className="text-[10px] font-mono text-white/40">
            {activeIdx + 1} OF {MEMORIES.length}
          </span>
          <button
            onClick={nextMemory}
            className="rounded-full border border-white/10 bg-white/[0.05] p-2.5 text-white/70 hover:text-white"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   INTERACTIVE CANDLE BLOWOUT EXPERIENCE
   ============================================================ */
function InteractiveCandleSection() {
  const [blown, setBlown] = useState(false);

  const handleBlowCandle = () => {
    if (blown) return;
    setBlown(true);
    fireGrandConfetti();
  };

  return (
    <section className="relative px-5 py-24 text-center max-w-md mx-auto">
      <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-purple-950/30 to-black p-8 backdrop-blur-2xl">
        <span className="rounded-full bg-amber-400/10 border border-amber-400/20 px-3.5 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-amber-300">
          BIRTHDAY WISH CEREMONY
        </span>

        <h3 className="mt-4 text-2xl font-black text-white">
          Make a Wish, Prince!
        </h3>
        <p className="mt-1 text-xs text-white/60">
          Tap the flame to blow out your 16th birthday candle.
        </p>

        {/* Candle Visual */}
        <div className="my-10 flex flex-col items-center justify-center">
          <div
            onClick={handleBlowCandle}
            className="relative cursor-pointer group select-none flex flex-col items-center"
          >
            {/* Flame */}
            <AnimatePresence>
              {!blown ? (
                <motion.div
                  key="flame"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [1, 1.15, 0.95, 1],
                    y: [0, -2, 1, 0],
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-8 w-5 rounded-full bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 shadow-[0_0_30px_rgba(251,191,36,0.8)]"
                />
              ) : (
                <motion.div
                  key="smoke"
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.7, 0], y: -25, scale: 1.8 }}
                  transition={{ duration: 1.2 }}
                  className="text-xs font-mono text-white/40"
                >
                  💨 Wish Released!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Candle Body */}
            <div className="h-16 w-4 rounded-t-sm bg-gradient-to-r from-pink-400 to-purple-400 shadow-md border-t border-white/30" />
            {/* Cake Base Top */}
            <div className="h-6 w-24 rounded-full bg-amber-100/90 shadow-lg -mt-1 border border-amber-200" />
            {/* Cake Layer */}
            <div className="h-12 w-28 rounded-b-2xl bg-gradient-to-b from-purple-800 to-pink-900 shadow-xl border border-white/10 flex items-center justify-center">
              <span className="text-[10px] font-black text-amber-300">
                16 YEARS
              </span>
            </div>
          </div>
        </div>

        {/* Secret Wish Unlock Message */}
        <AnimatePresence>
          {blown && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-center"
            >
              <Crown className="h-6 w-6 text-amber-300 mx-auto mb-1.5" />
              <p className="text-sm font-black text-amber-200">
                WISH GRANTED FOR PRINCE! 👑
              </p>
              <p className="mt-1 text-xs text-white/70 leading-relaxed">
                "May your 16th year be overflowing with royal victories, health,
                peace, and endless reasons to celebrate."
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!blown && (
          <p className="text-[10px] font-mono text-white/40 tracking-wider">
            TAP CANDLE TO BLOW FLAME
          </p>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   ANIMMASTER SCROLL-DRIVEN TRIBUTE LETTER
   ============================================================ */
function TributeLetterSection() {
  return (
    <section className="relative px-5 py-24 max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-2xl">
        <div className="pointer-events-none absolute -right-12 -top-12 opacity-10">
          <RoyalLily className="h-44 w-44" glow />
        </div>

        <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-purple-300">
          A BROTHER'S LETTER
        </span>

        <h3 className="mt-4 text-3xl font-black text-white tracking-tight">
          DEAR PRINCE,
        </h3>

        <div className="mt-6 space-y-6 text-xs sm:text-sm text-white/70 leading-relaxed">
          <p>
            On <strong className="text-white">18 November 2010</strong>, the
            world was gifted someone who doesn’t conform to ordinary molds. You
            bring an unapologetic authenticity and confidence to everything you
            touch.
          </p>
          <p>
            Sixteen years of carving your own lane. Whether it’s having your
            favorite anthems like <em className="text-purple-300">Bairan</em> on
            full blast or just holding down the fort with quiet loyalty, your
            presence is always felt.
          </p>
          <p>
            May this 16th milestone year bring you ruthless focus, boundless
            joy, true brothers by your side, and all the success in the world.
          </p>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              SIGNED WITH BROTHERHOOD
            </p>
            <p className="text-xs font-bold text-white mt-0.5">
              Your Best Friend & Brother
            </p>
          </div>
          <Heart className="h-5 w-5 text-pink-500 fill-pink-500/40" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GRAND FINALE & VIP DIGITAL PASS
   ============================================================ */
function GrandFinaleSection() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
    fireGrandConfetti();
  };

  return (
    <section className="relative px-5 py-24 text-center overflow-hidden flex flex-col items-center">
      {/* Background Crown Watermark */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]">
        <Crown className="h-[90vw] w-[90vw]" />
      </div>

      <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 text-[9px] font-black uppercase tracking-[0.4em] text-purple-300">
        THE GRAND CORONATION
      </span>

      <h2
        className="mt-6 text-[clamp(3.5rem,18vw,8rem)] font-black leading-[0.88] tracking-tighter"
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, #e9d5ff 50%, #c084fc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        STAY
        <span className="block text-white">LEGENDARY</span>
      </h2>

      <p className="mt-4 max-w-xs text-xs text-white/60 leading-relaxed">
        16 years strong. Long live the King. Happy Birthday, Prince! 🎂👑
      </p>

      {/* VIP Access Pass Card */}
      <div className="mt-10 w-full max-w-xs rounded-3xl border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-2xl shadow-2xl text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-300" />
            <span className="text-xs font-black text-white tracking-widest">
              VIP ROYAL PASS
            </span>
          </div>
          <span className="text-[9px] font-mono text-purple-400">#PRINCE-16</span>
        </div>

        <div className="py-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/40">Holder</span>
            <span className="font-bold text-white">Prince</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Date of Birth</span>
            <span className="font-bold text-white">18 Nov 2010</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Crowned King
            </span>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="w-full mt-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 py-3 text-center text-xs font-black uppercase tracking-wider text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          {copied ? "Link Copied to Share! 🎉" : "Share Birthday Pass"}
        </button>
      </div>

      {/* Persistent Confetti Blast Button */}
      <button
        onClick={fireGrandConfetti}
        className="mt-8 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-white/20 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
      >
        <Sparkles className="h-4 w-4 text-amber-300" />
        BLAST CONFETTI 🎊
      </button>

      <div className="mt-14 flex items-center gap-2 text-white/30 text-[9px] font-mono">
        <RoyalLily className="h-4 w-4" />
        <span>CRAFTED WITH BROTHERHOOD FOR PRINCE · 2026</span>
        <RoyalLily className="h-4 w-4" />
      </div>
    </section>
  );
}

/* ============================================================
   MAIN PAGE CONTROLLER
   ============================================================ */
export default function MasterBirthdayPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeTrack, setActiveTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setActiveTrack((prev) =>
      prev.id === TRACKS.length - 1 ? TRACKS[0] : TRACKS[prev.id + 1]
    );
  };

  const prevTrack = () => {
    setActiveTrack((prev) =>
      prev.id === 0 ? TRACKS[TRACKS.length - 1] : TRACKS[prev.id - 1]
    );
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Grand Entrance Lock */}
      {!unlocked && <GrandEntranceGate onUnlocked={() => setUnlocked(true)} />}

      {/* Floating Lilies Background & Liquid Orbs */}
      <AmbientFloatingLilies />
      <FloatingOrbs />

      {/* Sticky Top Mobile Dynamic Island */}
      {unlocked && (
        <MobileDynamicIsland
          activeTrack={activeTrack}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onNextTrack={nextTrack}
        />
      )}

      {/* Scrollable Story Content */}
      <div className="relative z-10">
        <MasterHeroSection />
        <RoyalDossierSection />
        <SkiperSoundstageSection
          activeTrack={activeTrack}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onSelectTrack={setActiveTrack}
          onNext={nextTrack}
          onPrev={prevTrack}
        />
        <MemoryVaultSection />
        <InteractiveCandleSection />
        <TributeLetterSection />
        <GrandFinaleSection />
      </div>
    </main>
  );
}
