"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/* ---------------------------------- Data --------------------------------- */
const PRINCE = {
  name: "Prince",
  birthDate: "18 November 2010",
  age: "16",
  favoriteColor: "Black",
  flower: "Lily",
};

const TRACKS = [
  {
    title: "Bairan",
    artist: "Prince’s Birthday Anthem",
    duration: "3:42",
    accent: "from-white/25 to-white/5",
  },
  {
    title: "Tere Aasa Pass Din Sara",
    artist: "Prince’s Birthday Anthem",
    duration: "4:08",
    accent: "from-white/20 to-white/5",
  },
];

const MESSAGES = [
  {
    heading: "A Day Made Legendary",
    body: "On 18 November 2010, the world received a gift named Prince. Today is not just a birthday; it is a global celebration of your existence.",
  },
  {
    heading: "Built Different",
    body: "You carry a rare kind of confidence. You make ordinary moments feel alive, and your energy sets the standard everywhere you step.",
  },
  {
    heading: "Your Year, Your Kingdom",
    body: "May this year bring you fearless opportunities, loyal people, wild success, and memories that stay timeless forever.",
  },
];

/* ------------------------------ Small helpers ----------------------------- */
const EASE = [0.22, 1, 0.36, 1] as const;

function Lily({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lilyGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
      </defs>
      <path
        d="M32 58c-8-9-13-18-13-27 0-11 6-21 13-27 7 6 13 16 13 27 0 9-5 18-13 27z"
        fill="url(#lilyGradient)"
      />
      <path
        d="M32 58c-8-9-13-18-13-27 0-11 6-21 13-27 7 6 13 16 13 27 0 9-5 18-13 27z"
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1.2"
      />
      <path
        d="M32 4v54"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
    </svg>
  );
}

function FloatingLilies() {
  const lilies = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${(i * 6.5 + (i % 3) * 4) % 96}%`,
        top: `${(i * 11 + (i % 4) * 7) % 94}%`,
        size: 18 + ((i * 7) % 34),
        delay: (i % 8) * 0.65,
        duration: 9 + (i % 6) * 1.7,
        opacity: 0.05 + ((i % 5) * 0.035),
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {lilies.map((lily) => (
        <motion.div
          key={lily.id}
          className="absolute"
          style={{
            left: lily.left,
            top: lily.top,
            width: lily.size,
            height: lily.size,
            opacity: lily.opacity,
          }}
          initial={{ y: 30, rotate: -12 }}
          animate={{
            y: [-22, 22, -22],
            x: [-9, 9, -9],
            rotate: [-14, 14, -14],
          }}
          transition={{
            duration: lily.duration,
            delay: lily.delay,
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

function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 });

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 24);
    rotateX.set(-y * 24);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerUp={reset}
      onPointerCancel={reset}
      className={`[perspective:1200px] touch-pan-y ${className}`}
    >
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------ Music player ------------------------------ */
function MusicPlayer() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress((value) => (value >= 100 ? 0 : value + 0.35));
    }, 90);
    return () => window.clearInterval(id);
  }, [playing]);

  const track = TRACKS[active];

  return (
    <TiltCard>
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50">
              Prince FM
            </p>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-[3px] rounded-full bg-white"
                  animate={
                    playing
                      ? { height: [6, 18, 8, 22, 6] }
                      : { height: 5 }
                  }
                  transition={{
                    duration: 0.7 + bar * 0.12,
                    repeat: playing ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <motion.div
              className="relative grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/15 to-white/5"
              animate={playing ? { rotate: 360 } : { rotate: 0 }}
              transition={
                playing
                  ? { duration: 8, repeat: Infinity, ease: "linear" }
                  : { duration: 0.4 }
              }
            >
              <Lily className="h-9 w-9 opacity-80" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />
            </motion.div>

            <div className="min-w-0">
              <motion.h3
                key={track.title}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="truncate text-xl font-black tracking-tight text-white"
              >
                {track.title}
              </motion.h3>
              <p className="mt-1 truncate text-xs text-white/45">
                {track.artist}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${track.accent}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold text-white/40 tabular-nums">
              <span>
                {Math.floor((progress / 100) * 4)}:
                {String(Math.floor(((progress / 100) * 240) % 60)).padStart(2, "0")}
              </span>
              <span>{track.duration}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => {
                setActive((active + TRACKS.length - 1) % TRACKS.length);
                setProgress(0);
              }}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M6 5h2v14H6zM20 5v14l-10-7z" />
              </svg>
            </button>

            <motion.button
              onClick={() => setPlaying((value) => !value)}
              whileTap={{ scale: 0.9 }}
              className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-black shadow-[0_0_35px_rgba(255,255,255,0.35)] transition hover:scale-105"
            >
              <motion.span
                className="absolute inset-0 rounded-full border border-white/40"
                animate={playing ? { scale: [1, 1.5], opacity: [0.7, 0] } : {}}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </motion.button>

            <button
              onClick={() => {
                setActive((active + 1) % TRACKS.length);
                setProgress(0);
              }}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M16 5h2v14h-2zM4 5v14l10-7z" />
              </svg>
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {TRACKS.map((item, index) => (
              <button
                key={item.title}
                onClick={() => {
                  setActive(index);
                  setProgress(0);
                }}
                className={`rounded-2xl border p-3 text-left transition ${
                  active === index
                    ? "border-white/35 bg-white/10"
                    : "border-white/8 bg-white/[0.03]"
                }`}
              >
                <p className="truncate text-[11px] font-bold text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[10px] text-white/40">
                  {item.duration}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

/* ------------------------------ Entrance gate ----------------------------- */
function EntranceGate({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.12), transparent 60%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="relative text-center max-w-sm mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="text-[11px] font-black uppercase tracking-[0.55em] text-white/50"
        >
          18 · 11 · 2010
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.85, ease: EASE }}
          className="mt-5 text-[clamp(4.2rem,22vw,10rem)] font-black leading-none tracking-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.35)]"
        >
          PRINCE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
          className="mx-auto mt-4 text-sm text-white/60 font-medium"
        >
          A birthday experience engineered for the main character.
        </motion.p>
        <motion.button
          onClick={onOpen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7, ease: EASE }}
          whileTap={{ scale: 0.94 }}
          className="group relative mt-9 cursor-pointer overflow-hidden rounded-full border border-white/30 bg-white/15 px-8 py-4 backdrop-blur-xl transition hover:bg-white/25 active:bg-white/30"
        >
          <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em] text-white">
            Open the celebration →
          </span>
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* --------------------------------- Page ---------------------------------- */
export default function BirthdayPage() {
  const [entered, setEntered] = useState(false);
  const { scrollYProgress } = useScroll();

  const heroScale = useTransform(scrollYProgress, [0, 0.22], [1, 0.88]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -60]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.8]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.7], [0.5, 0]);

  useEffect(() => {
    document.body.style.background = "#000";
    document.body.style.color = "#fff";
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white antialiased selection:bg-white selection:text-black">
      <AnimatePresence>
        {!entered && <EntranceGate onOpen={() => setEntered(true)} />}
      </AnimatePresence>

      <FloatingLilies />

      <motion.div
        className="pointer-events-none fixed left-1/2 top-[-20%] z-0 h-[70vh] w-[120vw] -translate-x-1/2 rounded-full"
        style={{
          scale: glowScale,
          opacity: glowOpacity,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)",
        }}
      />

      <main className="relative z-10">
        {/* HERO */}
        <section className="relative flex min-h-[100svh] flex-col justify-between px-6 py-12 text-center">
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
              className="mx-auto w-fit rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.35em] text-white/60 backdrop-blur-md"
            >
              Happy Birthday
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={entered ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 1.1, ease: EASE }}
              className="mt-6 text-center text-[clamp(4.5rem,25vw,12rem)] font-black leading-none tracking-tight"
            >
              <span className="block bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                PRINCE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.8, ease: EASE }}
              className="mx-auto mt-5 max-w-xs text-center text-sm leading-relaxed text-white/60"
            >
              Born on <span className="font-semibold text-white">18 November 2010</span>. Today, the entire universe celebrates you.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40"
            >
              Scroll
            </motion.span>
            <div className="h-12 w-px bg-gradient-to-b from-white/70 to-transparent" />
          </motion.div>
        </section>

        {/* AGE / FACTS */}
        <section className="relative px-5 py-24">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 text-center">
              The Birthday File
            </p>
            <h2 className="mt-4 text-center text-[clamp(2.6rem,13vw,5.5rem)] font-black leading-none tracking-tight">
              SIXTEEN
              <span className="block text-white/25">AND UNSTOPPABLE</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 max-w-md mx-auto">
            {[
              { label: "Name", value: PRINCE.name },
              { label: "Birthday", value: "18 Nov 2010" },
              { label: "Color", value: "Pitch Black" },
              { label: "Flower", value: "Lily" },
            ].map((item, index) => (
              <Reveal key={item.label} delay={index * 0.08}>
                <TiltCard>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                      {item.label}
                    </p>
                    <p className="mt-3 text-lg font-black tracking-tight text-white">
                      {item.value}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* MUSIC */}
        <section className="relative px-5 py-20 max-w-md mx-auto">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 text-center">
              Soundtrack of Prince
            </p>
            <h2 className="mt-4 text-center text-[clamp(2.4rem,11vw,5rem)] font-black leading-[0.95] tracking-tight">
              PRESS PLAY.
              <span className="block text-white/25">FEEL THE MOMENT.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="mt-9">
            <MusicPlayer />
          </Reveal>
        </section>

        {/* LETTER */}
        <section className="relative px-5 py-24 max-w-md mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-7 backdrop-blur-2xl">
              <Lily className="absolute -right-8 -top-8 h-36 w-36 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.45em] text-white/40">
                A Letter For You
              </p>
              <h2 className="mt-5 text-[clamp(2.2rem,10vw,4.5rem)] font-black leading-none tracking-tight">
                DEAR
                <span className="block bg-gradient-to-r from-white to-white/35 bg-clip-text text-transparent">
                  PRINCE,
                </span>
              </h2>

              <div className="mt-8 space-y-8">
                {MESSAGES.map((message, index) => (
                  <Reveal key={message.heading} delay={index * 0.1}>
                    <div className="border-l border-white/15 pl-5">
                      <h3 className="text-lg font-black tracking-tight text-white">
                        {message.heading}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">
                        {message.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* FINALE */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
          <Reveal>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 opacity-10 blur-sm"
            >
              <Lily className="h-full w-full" />
            </motion.div>

            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
              Happy Birthday
            </p>

            <h2 className="relative mt-6 text-[clamp(3.4rem,17vw,8rem)] font-black leading-[0.9] tracking-tight">
              <span className="bg-gradient-to-b from-white via-white to-white/15 bg-clip-text text-transparent">
                STAY
              </span>
              <span className="block bg-gradient-to-b from-white via-white to-white/15 bg-clip-text text-transparent">
                LEGENDARY
              </span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="mx-auto mt-7 max-w-xs text-sm leading-relaxed text-white/55"
            >
              May your new year be as bold, brilliant, and unforgettable as you are.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mt-12 flex items-center justify-center gap-3"
            >
              <Lily className="h-8 w-8 opacity-70" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
                18 · 11 · 2010
              </span>
              <Lily className="h-8 w-8 opacity-70" />
            </motion.div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
