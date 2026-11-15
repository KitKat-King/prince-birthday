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
  type CSSProperties,
} from "react";

/* ============================================================
   DATA
   ============================================================ */
const PRINCE = {
  name: "Prince",
  birthDate: "18 November 2010",
  age: 16,
  flower: "Lily",
};

const TRACKS = [
  {
    id: 0,
    title: "Bairan",
    artist: "Prince's Birthday Anthem",
    duration: "3:42",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.4)",
  },
  {
    id: 1,
    title: "Tere Aasa Pass Din Sara",
    artist: "Prince's Soul Song",
    duration: "4:08",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.4)",
  },
];

const FACTS = [
  { label: "Name", value: "Prince", icon: "👑" },
  { label: "Born", value: "18 Nov 2010", icon: "🎂" },
  { label: "Age", value: "16 Today", icon: "🔥" },
  { label: "Flower", value: "Lily", icon: "🌸" },
];

const MESSAGES = [
  {
    heading: "A Legend Was Born",
    body: "On 18 November 2010, the universe quietly placed its rarest gift into the world — you, Prince. That day, everything changed.",
    icon: "✨",
  },
  {
    heading: "Built Different",
    body: "Your confidence is magnetic. Your presence is rare. You don't follow energy — you create it. That's not luck. That's Prince.",
    icon: "⚡",
  },
  {
    heading: "Your Kingdom Awaits",
    body: "This year is yours to conquer. May every door swing wide open, every dream turn real, and every moment carry your signature.",
    icon: "🏆",
  },
];

/* ============================================================
   CONSTANTS
   ============================================================ */
const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   LILY SVG
   ============================================================ */
function LilySVG({
  className = "",
  style,
  opacity = 1,
}: {
  className?: string;
  style?: CSSProperties;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={{ opacity, ...style }}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(200,150,255,0.2)" />
        </linearGradient>
        <linearGradient id="lg2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,200,255,0.8)" />
          <stop offset="100%" stopColor="rgba(150,100,255,0.1)" />
        </linearGradient>
      </defs>
      {/* Center petal */}
      <path
        d="M32 58c-6-8-10-17-10-26 0-10 4-20 10-28 6 8 10 18 10 28 0 9-4 18-10 26z"
        fill="url(#lg1)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
      />
      {/* Left petal */}
      <path
        d="M32 32c-9-5-16-12-18-20 4-2 9-2 13 0 5 2 9 7 10 14-1 3-3 5-5 6z"
        fill="url(#lg2)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.8"
      />
      {/* Right petal */}
      <path
        d="M32 32c9-5 16-12 18-20-4-2-9-2-13 0-5 2-9 7-10 14 1 3 3 5 5 6z"
        fill="url(#lg2)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.8"
      />
      {/* Stem */}
      <path
        d="M32 58v-26"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx="32" cy="30" r="2.5" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

/* ============================================================
   FLOATING LILIES BACKGROUND
   ============================================================ */
function FloatingLilies() {
  const items = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${((i * 7.3 + (i % 4) * 11) % 90) + 2}%`,
        top: `${((i * 13.7 + (i % 5) * 8) % 90) + 2}%`,
        size: 20 + (i % 5) * 10,
        delay: i * 0.4,
        dur: 5 + (i % 4) * 2,
        rotate: i * 23,
        opacity: 0.04 + (i % 4) * 0.025,
      })),
    []
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {items.map((lily) => (
        <motion.div
          key={lily.id}
          className="absolute"
          style={{
            left: lily.left,
            top: lily.top,
            width: lily.size,
            height: lily.size,
          }}
          animate={{
            y: [-12, 12, -12],
            rotate: [lily.rotate, lily.rotate + 15, lily.rotate],
            opacity: [lily.opacity, lily.opacity * 1.6, lily.opacity],
          }}
          transition={{
            duration: lily.dur,
            delay: lily.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <LilySVG className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500"
    />
  );
}

/* ============================================================
   REVEAL WRAPPER (Scroll-based)
   ============================================================ */
function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const variants = {
    up: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants[direction]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   3D TILT CARD (Aceternity-style)
   ============================================================ */
function TiltCard({
  children,
  className = "",
  glowColor = "rgba(168,85,247,0.15)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const nx = (clientX - rect.left) / rect.width - 0.5;
      const ny = (clientY - rect.top) / rect.height - 0.5;
      x.set(nx);
      y.set(ny);
    },
    [x, y]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHovered(false);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
      className={`relative cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

/* ============================================================
   GLOW CARD (Skiper-style)
   ============================================================ */
function GlowCard({
  children,
  className = "",
  color = "#a855f7",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl ${className}`}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        background: hovering
          ? `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${color}22 0%, transparent 50%), rgba(255,255,255,0.03)`
          : undefined,
        transition: "background 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   TEXT REVEAL (Animmaster-style word reveal)
   ============================================================ */
function TextReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`flex flex-wrap gap-x-[0.3em] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, rotateX: -40 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.65,
            delay: delay + i * 0.07,
            ease: EASE,
          }}
          style={{ display: "inline-block", transformOrigin: "bottom" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

/* ============================================================
   MUSIC PLAYER
   ============================================================ */
function MusicPlayer() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const track = TRACKS[active];

  const togglePlay = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false);
            return 0;
          }
          return p + 0.5;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const switchTrack = (id: number) => {
    setActive(id);
    setProgress(0);
    setPlaying(false);
  };

  return (
    <GlowCard color={track.color} className="p-6">
      {/* Track selector */}
      <div className="mb-5 flex gap-2">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTrack(t.id)}
            className={`flex-1 rounded-2xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              active === t.id
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/[0.07] text-white/40 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Album art / visualizer */}
      <div className="relative mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${track.color} ${progress * 3.6}deg, transparent 0deg)`,
            opacity: 0.3,
          }}
        />
        <motion.div
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <LilySVG className="h-14 w-14" />
        </motion.div>
        {/* Sound waves */}
        {playing && (
          <div className="absolute -right-1 -top-1 flex items-end gap-[2px] h-5">
            {[1, 1.5, 0.8, 1.2, 0.6].map((h, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full"
                style={{ backgroundColor: track.color }}
                animate={{ scaleY: [1, h * 1.5, 1] }}
                transition={{
                  duration: 0.5 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="mb-4 text-center">
        <p className="text-base font-black tracking-tight text-white">
          {track.title}
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
          {track.artist}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: track.color }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() =>
            switchTrack(active === 0 ? TRACKS.length - 1 : active - 1)
          }
          className="text-white/50 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>

        <motion.button
          onClick={togglePlay}
          whileTap={{ scale: 0.9 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10"
          style={{ boxShadow: playing ? `0 0 20px ${track.glow}` : "none" }}
        >
          <AnimatePresence mode="wait">
            {playing ? (
              <motion.svg
                key="pause"
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </motion.svg>
            ) : (
              <motion.svg
                key="play"
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <path d="M8 5v14l11-7z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        <button
          onClick={() => switchTrack((active + 1) % TRACKS.length)}
          className="text-white/50 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z" />
          </svg>
        </button>
      </div>
    </GlowCard>
  );
}

/* ============================================================
   CONFETTI BURST
   ============================================================ */
function ConfettiBurst({ trigger }: { trigger: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        angle: (i / 30) * 360,
        distance: 60 + Math.random() * 100,
        color: ["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"][i % 5],
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.3,
      })),
    []
  );

  if (!trigger) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ backgroundColor: p.color, width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(rad) * p.distance,
              y: Math.sin(rad) * p.distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.2,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   ENTRANCE GATE (Full-screen takeover)
   ============================================================ */
function EntranceGate({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<"idle" | "burst" | "exit">("idle");
  const [showBurst, setShowBurst] = useState(false);
  const [count, setCount] = useState(3);

  useEffect(() => {
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setCount((c) => {
          if (c <= 1) {
            clearInterval(interval);
            setPhase("burst");
            setShowBurst(true);
            setTimeout(() => {
              setPhase("exit");
              setTimeout(onEnter, 900);
            }, 1200);
            return 0;
          }
          return c - 1;
        });
      }, 700);
    }, 800);
    return () => clearTimeout(t);
  }, [onEnter]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="gate"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-black"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Background mesh */}
          <div className="absolute inset-0 overflow-hidden">
            {[
              { color: "#7c3aed", left: "20%", top: "20%" },
              { color: "#db2777", left: "70%", top: "60%" },
              { color: "#2563eb", left: "50%", top: "80%" },
            ].map((orb, i) => (
              <motion.div
                key={i}
                className="absolute h-64 w-64 rounded-full"
                style={{
                  left: orb.left,
                  top: orb.top,
                  background: `radial-gradient(circle, ${orb.color}30 0%, transparent 70%)`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Starburst lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px w-[180vw] origin-center"
                style={{
                  rotate: `${i * 15}deg`,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-6">
            <ConfettiBurst trigger={showBurst} />

            {/* Lily bloom */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: phase === "burst" ? [1, 1.4, 1] : 1,
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <LilySVG className="h-20 w-20" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(168,85,247,0.4)",
                    "0 0 60px rgba(236,72,153,0.5)",
                    "0 0 30px rgba(168,85,247,0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Countdown */}
            {count > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={count}
                  className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  Preparing your surprise…
                </motion.div>
              </AnimatePresence>
            )}

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
              className="text-center"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/40">
                A birthday for
              </p>
              <motion.h1
                className="mt-2 text-[clamp(4rem,22vw,9rem)] font-black leading-none tracking-tighter"
                style={{
                  background:
                    "linear-gradient(135deg, #fff 0%, #d8b4fe 50%, #f9a8d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={
                  phase === "burst"
                    ? { scale: [1, 1.08, 1] }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                PRINCE
              </motion.h1>
              <p className="mt-3 text-sm font-semibold text-white/50">
                18 · 11 · 2010
              </p>
            </motion.div>

            {/* Animated ring */}
            <motion.div
              className="absolute -inset-24 rounded-full border border-white/[0.06]"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -inset-16 rounded-full border border-white/[0.04]"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   SECTION: HERO
   ============================================================ */
function HeroSection({ entered }: { entered: boolean }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-between overflow-hidden px-6 py-14">
      {/* Background gradient orb */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(120,40,200,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={entered ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
        className="rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.5em] text-white/50 backdrop-blur-md"
      >
        🎂 &nbsp;Happy Birthday &nbsp;🎂
      </motion.div>

      {/* Main heading */}
      <motion.div style={{ y, opacity }} className="mt-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={entered ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.25, duration: 1, ease: EASE }}
        >
          <p className="mb-4 text-[9px] font-black uppercase tracking-[0.6em] text-white/40">
            The Legend · 18 November 2010
          </p>
          <h1
            className="text-[clamp(5.5rem,28vw,13rem)] font-black leading-[0.88] tracking-tighter"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, #d8b4fe 60%, rgba(255,255,255,0.15) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PRINCE
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
            className="mx-auto mt-6 max-w-[260px] text-sm leading-relaxed text-white/55"
          >
            Today the universe pauses to celebrate you. Sixteen and
            unstoppable.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-auto flex flex-col items-center gap-2 pb-4"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-[8px] font-black uppercase tracking-[0.5em] text-white/30"
        >
          Scroll
        </motion.span>
        <div className="h-10 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ============================================================
   SECTION: BIRTHDAY FILE (3D Tilt Cards)
   ============================================================ */
function BirthdayFileSection() {
  return (
    <section className="relative px-5 py-24">
      {/* Section label */}
      <Reveal className="text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-purple-400">
          ✦ &nbsp;Birthday File
        </p>
        <TextReveal
          text="SIXTEEN AND UNSTOPPABLE"
          className="mt-4 justify-center text-[clamp(2.5rem,13vw,6rem)] font-black leading-[0.9] tracking-tight text-white"
        />
      </Reveal>

      {/* Fact cards grid */}
      <div className="mt-10 grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {FACTS.map((fact, i) => (
          <Reveal key={fact.label} delay={i * 0.1}>
            <TiltCard glowColor="rgba(168,85,247,0.2)">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <span className="text-2xl">{fact.icon}</span>
                <p className="mt-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                  {fact.label}
                </p>
                <p className="mt-2 text-base font-black tracking-tight text-white">
                  {fact.value}
                </p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* Full-width highlight card */}
      <Reveal delay={0.3} className="mt-4 max-w-sm mx-auto">
        <TiltCard glowColor="rgba(236,72,153,0.2)">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 backdrop-blur-xl">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-15"
            >
              <LilySVG className="h-full w-full" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-purple-400">
              🌸 &nbsp;Favorite Flower
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              The White Lily
            </p>
            <p className="mt-2 text-xs text-white/40 leading-relaxed">
              Pure. Elegant. Powerful. Just like you.
            </p>
          </div>
        </TiltCard>
      </Reveal>
    </section>
  );
}

/* ============================================================
   SECTION: SOUNDTRACK
   ============================================================ */
function SoundtrackSection() {
  return (
    <section className="relative px-5 py-20 max-w-md mx-auto">
      <Reveal className="text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-pink-400">
          ♪ &nbsp;Soundtrack of Prince
        </p>
        <TextReveal
          text="PRESS PLAY. FEEL THE MOMENT."
          className="mt-4 justify-center text-[clamp(2.2rem,11vw,5rem)] font-black leading-[0.9] tracking-tight text-white"
        />
      </Reveal>
      <Reveal delay={0.15} className="mt-9">
        <MusicPlayer />
      </Reveal>
    </section>
  );
}

/* ============================================================
   SECTION: MESSAGES (Birthday Letter)
   ============================================================ */
function LetterSection() {
  return (
    <section className="relative px-5 py-24 max-w-md mx-auto">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-white/[0.025] p-7 backdrop-blur-2xl">
          {/* Decorative corner lily */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-10">
            <LilySVG className="h-full w-full" />
          </div>
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 opacity-[0.07]">
            <LilySVG className="h-full w-full" />
          </div>

          {/* Header */}
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-purple-400">
            ✉ &nbsp;A Letter For You
          </p>
          <div className="mt-5">
            <TextReveal
              text="DEAR PRINCE,"
              className="text-[clamp(2rem,10vw,4rem)] font-black leading-none tracking-tight text-white"
            />
          </div>

          {/* Messages */}
          <div className="mt-8 space-y-7">
            {MESSAGES.map((msg, i) => (
              <Reveal key={msg.heading} delay={i * 0.12} direction="left">
                <div className="flex gap-4">
                  <span className="mt-0.5 text-xl flex-shrink-0">{msg.icon}</span>
                  <div className="border-l border-white/10 pl-4">
                    <h3 className="text-sm font-black tracking-tight text-white">
                      {msg.heading}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/50">
                      {msg.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Sign-off */}
          <Reveal delay={0.4} className="mt-8 border-t border-white/[0.07] pt-6">
            <p className="text-xs text-white/35 leading-relaxed">
              With all the love in the world. Happy 16th Birthday, Prince. 🎂
            </p>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.3em] text-white/50">
              — Your Best Friend
            </p>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
   SECTION: FINALE
   ============================================================ */
function FinaleSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setBurst(true), 400);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      {/* Rotating lily bg */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[75vw] w-[75vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <LilySVG className="h-full w-full" />
      </motion.div>

      {/* Confetti */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ConfettiBurst trigger={burst} />
      </div>

      {/* Background gradient pulse */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(120,40,200,0.1) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(220,40,120,0.1) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(120,40,200,0.1) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <Reveal>
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/40">
          Happy Birthday
        </p>

        <div className="mt-6">
          <TextReveal
            text="STAY LEGENDARY"
            className="justify-center text-[clamp(3.5rem,18vw,9rem)] font-black leading-[0.88] tracking-tighter"
            delay={0.1}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="mx-auto mt-7 max-w-[270px] text-sm leading-relaxed text-white/50"
        >
          May your 16th year be as bold, brilliant, and unforgettable as you
          are. The world is yours, Prince.
        </motion.p>

        {/* Lily row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          {[-1, 0, 1].map((offset) => (
            <motion.div
              key={offset}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2,
                delay: (offset + 1) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <LilySVG
                className="h-7 w-7"
                opacity={offset === 0 ? 0.9 : 0.5}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-6 text-[9px] font-black uppercase tracking-[0.5em] text-white/30"
        >
          18 · 11 · 2010
        </motion.p>
      </Reveal>
    </section>
  );
}

/* ============================================================
   ROOT PAGE
   ============================================================ */
export default function BirthdayPage() {
  const [entered, setEntered] = useState(false);
  const handleEnter = useCallback(() => setEntered(true), []);

  return (
    <>
      {/* Entrance Gate */}
      <EntranceGate onEnter={handleEnter} />

      {/* Scroll progress */}
      {entered && <ProgressBar />}

      {/* Background */}
      <FloatingLilies />

      {/* Page */}
      <AnimatePresence>
        {entered && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative min-h-screen overflow-x-hidden"
          >
            <HeroSection entered={entered} />
            <BirthdayFileSection />
            <SoundtrackSection />
            <LetterSection />
            <FinaleSection />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
