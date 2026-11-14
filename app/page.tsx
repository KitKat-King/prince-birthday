/**
 * PRINCE — THE BIRTHDAY EXPERIENCE
 * ------------------------------------------------------------
 * Next.js App Router · "use client"
 * Dependencies: framer-motion, tailwindcss
 *
 * This is a single-file masterpiece. Spotlight, Sparkles,
 * TiltCard, FloatingLilies, the entrance, and all scroll
 * reveals are recreated inline with Framer Motion — no
 * Aceternity UI install required.
 *
 * Music player is a visual experience. Wire `TRACKS` to real
 * audio URLs when you have them.
 * ------------------------------------------------------------
 */

"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

/** Deterministic pseudo-random — avoids hydration mismatches. */
const seeded = (seed: number) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

/* ------------------------------------------------------------------ */
/*  Lily                                                               */
/* ------------------------------------------------------------------ */

function Lily({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const rawId = useId().replace(/:/g, "");
  const strokeId = `lily-stroke-${rawId}`;
  const fillId = `lily-fill-${rawId}`;

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient
          id={strokeId}
          x1="20"
          y1="10"
          x2="100"
          y2="110"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#e4e4e7" stopOpacity="0.55" />
          <stop offset="1" stopColor="#71717a" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient
          id={fillId}
          x1="60"
          y1="8"
          x2="60"
          y2="112"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* back petals */}
      <path
        d="M60 20C46 4 20 9 23 31c2 17 21 27 37 35"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M60 20c14-16 40-11 37 11-2 17-21 27-37 35"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* side petals */}
      <path
        d="M60 66C43 54 16 51 12 70c-4 19 20 30 36 34"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M60 66c17-12 44-15 48 4 4 19-20 30-36 34"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* front petal */}
      <path
        d="M60 66c-7 9-20 16-20 28 0 11 9 19 20 19s20-8 20-19c0-12-13-19-20-28Z"
        fill={`url(#${fillId})`}
        stroke={`url(#${strokeId})`}
        strokeWidth="1.2"
      />
      <path
        d="M60 66v46"
        stroke={`url(#${strokeId})`}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="60" cy="60" r="2.2" fill="#ffffff" fillOpacity="0.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Spotlight (Aceternity-inspired)                                    */
/* ------------------------------------------------------------------ */

function Spotlight() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute -top-[40%] left-1/2 h-[80vh] w-[120vw] -translate-x-1/2"
      >
        <motion.div
          animate={{ x: ["-10%", "10%", "-10%"], rotate: [-8, 8, -8] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-white/[0.06] blur-[120px]"
        />
        <motion.div
          animate={{ x: ["8%", "-8%", "8%"], rotate: [6, -6, 6] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-[10%] h-[60vh] w-[50vw] rounded-full bg-zinc-400/[0.04] blur-[120px]"
        />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sparkles (lightweight, dependency-free)                            */
/* ------------------------------------------------------------------ */

function Sparkles({
  count = 40,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: seeded(i + 1) * 100,
        y: seeded(i + 2) * 100,
        size: seeded(i + 3) * 2 + 0.8,
        delay: seeded(i + 4) * 6,
        duration: seeded(i + 5) * 4 + 2,
        opacity: seeded(i + 6) * 0.5 + 0.2,
      })),
    [count]
  );

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0, s.opacity, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating Lilies                                                    */
/* ------------------------------------------------------------------ */

function FloatingLilies() {
  const lilies = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: seeded(i + 11) * 100,
        top: seeded(i + 12) * 100,
        size: seeded(i + 13) * 46 + 24,
        delay: seeded(i + 14) * 8,
        duration: seeded(i + 15) * 14 + 14,
        opacity: seeded(i + 16) * 0.18 + 0.06,
        rotate: seeded(i + 17) * 40 - 20,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {lilies.map((l) => (
        <motion.div
          key={l.id}
          className="absolute"
          style={{
            left: `${l.left}%`,
            top: `${l.top}%`,
            width: l.size,
            height: l.size,
            opacity: l.opacity,
            rotate: l.rotate,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 12, 0],
            rotate: [l.rotate, l.rotate + 10, l.rotate],
          }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Lily className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll Reveal                                                      */
/* ------------------------------------------------------------------ */

function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  3D Tilt Card                                                       */
/* ------------------------------------------------------------------ */

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [12, -12]),
    { stiffness: 180, damping: 22 }
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-14, 14]),
    { stiffness: 180, damping: 22 }
  );

  const glareX = useTransform(mouseX, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["20%", "80%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.12), transparent 55%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className={cn("perspective-[1200px]", className)}>
      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-px shadow-2xl shadow-black/60"
      >
        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-zinc-950/90">
          <motion.div
            className="pointer-events-none absolute inset-0 z-10"
            style={{ background: glare }}
          />
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Music Player                                                       */
/* ------------------------------------------------------------------ */

const TRACKS = [
  {
    title: "Bairan",
    artist: "Prince's Favourites",
    duration: "3:42",
    total: 222,
    color: "from-violet-500/40 via-fuchsia-500/20 to-transparent",
  },
  {
    title: "Tere Aasa Pass Din Sara",
    artist: "Prince's Favourites",
    duration: "4:05",
    total: 245,
    color: "from-amber-400/30 via-orange-500/15 to-transparent",
  },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function MusicPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const track = TRACKS[trackIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= track.total) {
          setIsPlaying(false);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, track.total]);

  const selectTrack = (index: number) => {
    setTrackIndex(index);
    setProgress(0);
    setIsPlaying(true);
  };

  const next = () => selectTrack((trackIndex + 1) % TRACKS.length);
  const prev = () =>
    selectTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length);

  const percentage = Math.min(100, (progress / track.total) * 100);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-b from-white/[0.06] to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-2xl">
        {/* album art */}
        <div
          className={cn(
            "relative mb-5 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br",
            track.color
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />

          <motion.div
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="relative h-32 w-32 rounded-full border border-white/10 bg-black/40"
          >
            <div className="absolute inset-4 rounded-full border border-white/10" />
            <div className="absolute inset-8 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur" />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </motion.div>

          <div className="absolute bottom-3 left-3 flex items-end gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-1 rounded-full bg-white/70"
                animate={
                  isPlaying
                    ? { height: [4, 14, 6, 18, 4] }
                    : { height: 6 }
                }
                transition={{
                  duration: 0.8 + i * 0.1,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* track info */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <motion.h3
              key={track.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="truncate text-lg font-semibold tracking-tight text-white"
            >
              {track.title}
            </motion.h3>
            <p className="mt-0.5 text-xs text-zinc-500">{track.artist}</p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-widest text-zinc-400">
            On repeat
          </span>
        </div>

        {/* progress */}
        <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-white/80 to-white/30"
            animate={{ width: `${percentage}%` }}
            transition={{ ease: "linear", duration: 0.4 }}
          />
        </div>
        <div className="mb-4 flex justify-between text-[10px] tabular-nums text-zinc-500">
          <span>{formatTime(progress)}</span>
          <span>{track.duration}</span>
        </div>

        {/* controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={prev}
            aria-label="Previous track"
            className="grid h-10 w-10 place-items-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M6 5h2v14H6V5Zm3 7 9-7v14l-9-7Z" />
            </svg>
          </button>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="grid h-14 w-14 place-items-center rounded-full bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] transition hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="ml-0.5 h-6 w-6"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
            )}
          </button>

          <button
            onClick={next}
            aria-label="Next track"
            className="grid h-10 w-10 place-items-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M16 5h2v14h-2V5ZM6 5l9 7-9 7V5Z" />
            </svg>
          </button>
        </div>

        {/* playlist */}
        <div className="mt-5 space-y-2 border-t border-white/5 pt-4">
          {TRACKS.map((t, i) => (
            <button
              key={t.title}
              onClick={() => selectTrack(i)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition",
                i === trackIndex ? "bg-white/[0.07]" : "hover:bg-white/[0.03]"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full text-[10px]",
                    i === trackIndex
                      ? "bg-white text-black"
                      : "bg-white/5 text-zinc-500"
                  )}
                >
                  {i === trackIndex && isPlaying ? "♫" : i + 1}
                </span>
                <div>
                  <p
                    className={cn(
                      "text-xs font-medium",
                      i === trackIndex ? "text-white" : "text-zinc-400"
                    )}
                  >
                    {t.title}
                  </p>
                  <p className="text-[10px] text-zinc-600">{t.duration}</p>
                </div>
              </div>

              {i === trackIndex && (
                <motion.span
                  layoutId="playing-dot"
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confetti                                                           */
/* ------------------------------------------------------------------ */

function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: Math.random() * 1.6 + 1.6,
        rotate: Math.random() * 720 - 360,
        color: ["#ffffff", "#c4b5fd", "#fcd34d", "#a1a1aa"][
          Math.floor(Math.random() * 4)
        ],
        size: Math.random() * 8 + 4,
        shape: Math.random() > 0.5 ? "circle" : "rect",
      })),
    []
  );

  return (
    <AnimatePresence>
      {active && (
        <div
          key="confetti"
          className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
        >
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              className="absolute top-0"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === "circle" ? "9999px" : "2px",
              }}
              initial={{ y: -40, opacity: 1, rotate: 0 }}
              animate={{
                y: "110vh",
                rotate: p.rotate,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Entrance — screen takeover                                         */
/* ------------------------------------------------------------------ */

function Entrance({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      exit={{ pointerEvents: "none" }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-black"
        exit={{ y: "-100%" }}
        transition={{ duration: 1, ease: EASE }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-black"
        exit={{ y: "100%" }}
        transition={{ duration: 1, ease: EASE }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(20px)", y: -30 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em] text-white/30">
            <span className="h-px w-8 bg-white/20" />
            18 · 11 · 2010
            <span className="h-px w-8 bg-white/20" />
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.6em] text-white/40">
            A celebration for
          </p>

          <h1 className="text-[clamp(3.5rem,18vw,8rem)] font-black leading-[0.85] tracking-[-0.06em] text-white">
            PRINCE
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: EASE }}
            className="my-8 h-px w-40 origin-center bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            onClick={onComplete}
            className="group relative overflow-hidden rounded-full border border-white/15 bg-white/[0.04] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.3em] text-white/80 backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.08] active:scale-95"
          >
            <span className="relative z-10">Enter the celebration</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[9px] uppercase tracking-[0.4em] text-white/20"
      >
        tap to begin
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function BirthdayPage() {
  const [entered, setEntered] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const { scrollYProgress } = useScroll();
  const progressBar = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], [0, -120]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  const triggerConfetti = useCallback(() => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4200);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white selection:bg-white/20">
      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progressBar }}
        className="fixed left-0 right-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-white/80 via-violet-300/60 to-amber-200/60"
      />

      <AnimatePresence>
        {!entered && <Entrance onComplete={() => setEntered(true)} />}
      </AnimatePresence>

      <Confetti active={confetti} />

      {/* fixed atmosphere */}
      <FloatingLilies />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(255,255,255,0.06),transparent_60%)]" />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ============================================================ */}
      {/* HERO                                                         */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-20"
      >
        <Spotlight />
        <Sparkles count={30} />

        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="relative flex w-full max-w-3xl flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mb-6 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-400">
              18 November 2010
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(16px)" }}
            animate={
              entered
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : {}
            }
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-[clamp(4.5rem,23vw,11rem)] font-black leading-[0.82] tracking-[-0.07em]"
          >
            <span className="bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent">
              PRINCE
            </span>
            <span className="absolute -inset-4 -z-10 bg-white/10 blur-3xl" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-6 max-w-xs text-balance text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            A legend was born. The world has been louder, brighter, and
            infinitely better since{" "}
            <span className="text-white">18.11.2010</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <a
              href="#message"
              className="group relative overflow-hidden rounded-full bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:scale-[1.03] active:scale-95"
            >
              <span className="relative z-10">Open your surprise</span>
            </a>

            <button
              onClick={triggerConfetti}
              className="rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition hover:border-white/30 hover:text-white active:scale-95"
            >
              Blow the candles ✦
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute -bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          >
            <span className="text-[8px] uppercase tracking-[0.4em] text-zinc-600">
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-6 w-px bg-gradient-to-b from-zinc-500 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* QUOTE / VERSE                                                */}
      {/* ============================================================ */}
      <section className="relative z-10 px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <span className="text-[9px] uppercase tracking-[0.5em] text-zinc-600">
              The birthday verse
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
              Some people just exist.
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-white to-amber-200 bg-clip-text text-transparent">
                You happen to the room.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-zinc-500">
              Sixteen years of chaotic brilliance, unforgettable laughs, and a
              heart that somehow keeps getting bigger. This one’s for you,
              Prince.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mx-auto mt-10 flex items-center justify-center gap-2">
              <span className="h-px w-10 bg-white/10" />
              <Lily className="h-6 w-6 opacity-60" />
              <span className="h-px w-10 bg-white/10" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3D TILT CARD                                                 */}
      {/* ============================================================ */}
      <section id="message" className="relative z-10 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-md">
          <ScrollReveal>
            <span className="text-[9px] uppercase tracking-[0.5em] text-zinc-600">
              A note for you
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <TiltCard className="mt-6">
              <div className="relative p-7 sm:p-9">
                <div className="absolute right-5 top-5 h-16 w-16 opacity-30">
                  <Lily className="h-full w-full" />
                </div>

                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <span className="text-lg">✦</span>
                </div>

                <h3 className="text-2xl font-semibold leading-tight tracking-tight">
                  Happy Birthday,
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 to-amber-200 bg-clip-text text-transparent">
                    Prince.
                  </span>
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  You make ordinary days feel like main-character moments.
                  Here’s to more late-night playlists, unreasonably good fits,
                  and a year that finally matches your energy.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/5 pt-6">
                  {[
                    { label: "Born", value: "18.11" },
                    { label: "Aura", value: "∞" },
                    { label: "Color", value: "Black" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                  <span className="h-px w-6 bg-white/10" />
                  always in your corner
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MUSIC                                                        */}
      {/* ============================================================ */}
      <section className="relative z-10 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-md">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <span className="text-[9px] uppercase tracking-[0.5em] text-zinc-600">
                The soundtrack
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Songs that scream{" "}
                <span className="bg-gradient-to-r from-violet-300 to-amber-200 bg-clip-text text-transparent">
                  you
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-zinc-500">
                Press play. Let the night slow down for a minute.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <MusicPlayer />
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LILY GARDEN / FINAL                                          */}
      {/* ============================================================ */}
      <section className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
        <Spotlight />
        <Sparkles count={24} />

        <div className="relative mx-auto max-w-lg">
          <ScrollReveal>
            <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur">
              <Lily className="h-7 w-7" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-balance text-4xl font-black leading-[0.95] tracking-tighter sm:text-5xl">
              Stay rare.
              <br />
              <span className="bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent">
                Stay you.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-zinc-400">
              Like a lily in a field of noise — impossible to miss, impossible
              to replace. Have the bestest birthday ever, Prince.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <button
              onClick={triggerConfetti}
              className="group relative mt-10 overflow-hidden rounded-full bg-white px-9 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Make a wish</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="mt-16 flex flex-col items-center gap-2">
              <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-600">
                18 · 11 · 2010 — forever iconic
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-zinc-700" />
                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                <span className="h-1 w-1 rounded-full bg-zinc-700" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center">
        <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-700">
          Made with black coffee, lilies & an unreasonable amount of love
        </p>
      </footer>
    </main>
  );
}
