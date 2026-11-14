"use client";

/* =====================================================================
   HAPPY BIRTHDAY, PRINCE — a cinematic, scroll-driven birthday experience
   Stack : Next.js (App Router) + TailwindCSS + Framer Motion
   Drop into app/page.tsx, then:  npm i framer-motion lucide-react
   ===================================================================== */

import { useEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence, useScroll, useTransform,
  useSpring, useMotionValue, useInView,
} from "framer-motion";
import { Play, Pause, Sparkles, Music, Flower2, Cake, ChevronDown, Heart, Crown } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ============================== LILY ================================ */
function Lily({ size = 60, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <path key={r} d="M50 50 C 40 30, 42 12, 50 4 C 58 12, 60 30, 50 50 Z"
          fill="currentColor" opacity={r % 120 === 0 ? 0.95 : 0.6} transform={`rotate(${r} 50 50)`} />
      ))}
      {[20, 90, 160].map((r) => (
        <line key={r} x1="50" y1="50" x2="50" y2="14" stroke="#fbbf24" strokeWidth="1.8"
          strokeLinecap="round" transform={`rotate(${r} 50 50)`} />
      ))}
      {[20, 90, 160].map((r) => (
        <circle key={r} cx="50" cy="13" r="2.4" fill="#fde68a" transform={`rotate(${r} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="4.5" fill="#fbbf24" />
    </svg>
  );
}

const LILIES = [
  { left: "4%", top: "12%", size: 54, dur: 9, delay: 0, blur: 0, o: 0.55, tint: "text-amber-100/70" },
  { left: "78%", top: "8%", size: 42, dur: 11, delay: 1.2, blur: 1, o: 0.4, tint: "text-violet-200/60" },
  { left: "64%", top: "30%", size: 68, dur: 13, delay: 0.6, blur: 2, o: 0.25, tint: "text-amber-200/50" },
  { left: "10%", top: "46%", size: 36, dur: 10, delay: 2, blur: 1, o: 0.35, tint: "text-white/50" },
  { left: "84%", top: "58%", size: 58, dur: 12, delay: 0.4, blur: 0, o: 0.45, tint: "text-amber-100/60" },
  { left: "24%", top: "72%", size: 46, dur: 14, delay: 1.6, blur: 2, o: 0.3, tint: "text-violet-200/50" },
  { left: "58%", top: "84%", size: 62, dur: 10, delay: 2.4, blur: 1, o: 0.35, tint: "text-white/40" },
  { left: "38%", top: "4%", size: 30, dur: 8, delay: 3, blur: 2, o: 0.4, tint: "text-amber-200/60" },
];

function FloatingLilies() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  return (
    <motion.div style={{ y }} className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {LILIES.map((l, i) => (
        <motion.div key={i} className={`absolute ${l.tint}`}
          style={{ left: l.left, top: l.top, opacity: l.o,
            filter: l.blur ? `blur(${l.blur}px)` : "drop-shadow(0 0 14px rgba(251,191,36,0.35))" }}
          animate={{ y: [0, -34, 0], x: [0, 12, 0], rotate: [0, 14, -10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut" }}>
          <Lily size={l.size} />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* =========================== SPOTLIGHT ============================== */
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = ref.current; if (!el) return;
      el.style.background = `radial-gradient(560px at ${e.clientX}px ${e.clientY}px, rgba(251,191,36,0.08), transparent 80%)`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div ref={ref} className="pointer-events-none fixed inset-0 z-[4]" />;
}

/* ========================== SCROLL REVEAL =========================== */
function Reveal({ children, delay = 0, className = "" }:
  { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 64, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.9, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

/* ===================== WORD-BY-WORD TEXT REVEAL ===================== */
function Words({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-1">
          <motion.span className="inline-block" initial={{ y: "115%" }}
            animate={inView ? { y: 0 } : {}} transition={{ delay: i * 0.035, duration: 0.7, ease: EASE }}>
            {w}
          </motion.span>
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </p>
  );
}

/* ============================ 3D TILT =============================== */
function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 18);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18);
  };
  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={() => { rx.set(0); ry.set(0); }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full">
        {children}
      </motion.div>
    </div>
  );
}

/* ======================== ENTRANCE TAKEOVER ========================= */
function Entrance({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"count" | "name" | "exit">("count");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const iv = setInterval(() => {
      setCount((c) => {
        if (c >= 16) { clearInterval(iv); setTimeout(() => setPhase("name"), 350); return c; }
        return c + 1;
      });
    }, 80);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (phase === "name") { const t = setTimeout(() => setPhase("exit"), 1900); return () => clearTimeout(t); }
    if (phase === "exit") {
      const t = setTimeout(() => { document.body.style.overflow = ""; onDone(); }, 1100);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
      animate={phase === "exit" ? { y: "-100%" } : { y: 0 }} transition={{ duration: 1.1, ease: EASE }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(251,191,36,0.12),transparent_60%)]" />
      <AnimatePresence mode="wait">
        {phase === "count" && (
          <motion.div key="c" exit={{ opacity: 0, scale: 1.6, filter: "blur(12px)" }} transition={{ duration: 0.5, ease: EASE }}
            className={`${playfair.variable} font-[family-name:var(--font-playfair)] text-center`}>
            <motion.div key={count} initial={{ opacity: 0.4, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              className="text-[26vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 drop-shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              {count}
            </motion.div>
            <p className="tracking-[0.5em] text-amber-200/60 text-[10px] uppercase mt-2 pl-2">candles loading</p>
          </motion.div>
        )}
        {phase === "name" && (
          <motion.div key="n" className="text-center px-6">
            <motion.p initial={{ opacity: 0, letterSpacing: "0.2em" }} animate={{ opacity: 1, letterSpacing: "0.6em" }}
              transition={{ duration: 1, ease: EASE }} className="text-amber-200/70 text-[10px] uppercase mb-4">
              the one and only
            </motion.p>
            <div className="flex justify-center gap-1">
              {"PRINCE".split("").map((ch, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 90, rotateX: -90, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.25 + i * 0.09, duration: 0.8, ease: EASE }}
                  className={`${playfair.variable} font-[family-name:var(--font-playfair)] text-[16vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500 drop-shadow-[0_0_30px_rgba(251,191,36,0.45)]`}>
                  {ch}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================ MARQUEE =============================== */
function Marquee() {
  const chunk = (
    <span className="mx-6 flex items-center gap-6">
      HAPPY BIRTHDAY <Sparkles className="w-5 h-5 text-amber-400" /> PRINCE
      <Flower2 className="w-5 h-5 text-violet-300" /> 18 NOVEMBER 2010
      <Cake className="w-5 h-5 text-pink-300" /> LEVEL 16 UNLOCKED
      <Crown className="w-5 h-5 text-amber-300" />
    </span>
  );
  return (
    <div className="relative z-10 border-y border-white/10 bg-white/[0.02] py-4 overflow-hidden">
      <div className="flex w-max whitespace-nowrap animate-[marquee_22s_linear_infinite] text-sm tracking-[0.35em] uppercase text-white/60">
        {Array.from({ length: 6 }).map((_, i) => <span key={i} className="flex">{chunk}</span>)}
      </div>
    </div>
  );
}

/* =========================== MUSIC ENGINE =========================== */
type Engine = { ctx: AudioContext; master: GainNode; filter: BiquadFilterNode; timer: number | null; step: number };

const TRACKS = [
  { title: "Bairan", sub: "Anthem №1 · on repeat", accent: "from-amber-500/30 to-yellow-600/10", icon: Crown,
    dur: 270, type: "sawtooth" as OscillatorType, bass: 110,
    notes: [220, 261.63, 329.63, 440, 329.63, 261.63, 246.94, 196] },
  { title: "Tere Aasa Pass Din Sara", sub: "Anthem №2 · vibe check", accent: "from-violet-500/30 to-fuchsia-600/10", icon: Heart,
    dur: 330, type: "triangle" as OscillatorType, bass: 130.81,
    notes: [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 392] },
];

function TrackCard({ track }: { track: (typeof TRACKS)[number]; index: number }) {
  const engine = useRef<Engine | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(iv);
  }, [playing]);

  const stopAll = () => {
    const e = engine.current; if (!e) return;
    if (e.timer) window.clearInterval(e.timer);
    e.master.gain.setTargetAtTime(0, e.ctx.currentTime, 0.08);
    e.timer = null;
  };
  useEffect(() => stopAll, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (playing) { stopAll(); setPlaying(false); return; }
    if (!engine.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain(); master.gain.value = 0;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass"; filter.frequency.value = 1600;
      filter.connect(master); master.connect(ctx.destination);
      engine.current = { ctx, master, filter, timer: null, step: 0 };
    }
    const e = engine.current;
    if (e.ctx.state === "suspended") void e.ctx.resume();
    e.master.gain.cancelScheduledValues(e.ctx.currentTime);
    e.master.gain.setTargetAtTime(0.16, e.ctx.currentTime, 0.12);
    e.step = 0;
    const tick = () => {
      const t = e.ctx.currentTime;
      const osc = e.ctx.createOscillator();
      osc.type = track.type; osc.frequency.value = track.notes[e.step % track.notes.length];
      const g = e.ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.5, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(g); g.connect(e.filter); osc.start(t); osc.stop(t + 0.55);
      if (e.step % 4 === 0) {
        const b = e.ctx.createOscillator();
        b.type = "sine"; b.frequency.value = track.bass;
        const bg = e.ctx.createGain();
        bg.gain.setValueAtTime(0, t);
        bg.gain.linearRampToValueAtTime(0.35, t + 0.03);
        bg.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
        b.connect(bg); bg.connect(e.filter); b.start(t); b.stop(t + 0.95);
      }
      e.step++;
    };
    tick();
    e.timer = window.setInterval(tick, track.dur);
    setPlaying(true);
  };

  const Icon = track.icon;
  return (
    <Tilt>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5"
        style={{ transform: "translateZ(30px)" }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${track.accent} opacity-40 pointer-events-none`} />
        <div className="relative flex items-center gap-4">
          <div className={`relative w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${track.accent} border border-white/15 flex items-center justify-center overflow-hidden`}>
            <motion.div animate={{ rotate: playing ? 360 : 0 }}
              transition={{ duration: 3, repeat: playing ? Infinity : 0, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-white/20" />
            <Icon className="w-6 h-6 text-white/90" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold truncate">{track.title}</p>
            <p className="text-white/40 text-xs mt-0.5">{track.sub}</p>
            <div className="mt-2.5 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-1000"
                style={{ width: `${Math.min((elapsed / 214) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_24px_rgba(251,191,36,0.35)] active:scale-90 transition-transform">
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex items-end gap-[3px] h-4">
              {[0, 1, 2, 3].map((b) => (
                <span key={b} className="w-[3px] h-full rounded-full bg-amber-400 origin-bottom"
                  style={{ animation: `eq 0.7s ease-in-out ${b * 0.13}s infinite`,
                    animationPlayState: playing ? "running" : "paused",
                    transform: playing ? undefined : "scaleY(0.25)" }} />
              ))}
            </div>
            <span className="text-[10px] text-white/35 tabular-nums">
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

/* ============================ CONFETTI ============================== */
function Confetti({ trigger }: { trigger: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!trigger) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const colors = ["#fbbf24", "#ffffff", "#a78bfa", "#f472b6", "#34d399", "#fde68a"];
    const parts = Array.from({ length: 240 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 140,
      y: canvas.height * 0.55,
      vx: (Math.random() - 0.5) * 20, vy: -Math.random() * 17 - 6,
      w: 6 + Math.random() * 8, h: 4 + Math.random() * 6,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      c: colors[(Math.random() * colors.length) | 0], life: 1,
    }));
    let raf = 0, last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min((t - last) / 16.6, 3); last = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of parts) {
        p.vy += 0.36 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        p.r += p.vr * dt; p.life -= 0.004 * dt;
        if (p.life <= 0 || p.y > canvas.height + 40) continue;
        alive = true;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      }
      raf = alive ? requestAnimationFrame(loop) : 0;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [trigger]);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[90]" />;
}

/* ============================= PAGE ================================= */
export default function BirthdayPage() {
  const [entered, setEntered] = useState(false);
  const [showEntrance, setShowEntrance] = useState(true);
  const [confetti, setConfetti] = useState(0);
  const [blown, setBlown] = useState(false);
  const [blowing, setBlowing] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const beamRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const nextBday = () => {
    const now = new Date();
    let d = new Date(now.getFullYear(), 10, 18);
    if (d.getTime() <= now.getTime()) d = new Date(now.getFullYear() + 1, 10, 18);
    return d;
  };
  const [target, setTarget] = useState(nextBday);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => { setNow(new Date()); setTarget(nextBday()); }, 1000);
    return () => clearInterval(iv);
  }, []);
  const diff = Math.max(target.getTime() - now.getTime(), 0);
  const cd = {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
  const level = target.getFullYear() - 2010;

  const blowTimer = useRef<number | null>(null);
  const startBlow = () => {
    if (blown) return;
    setBlowing(true);
    blowTimer.current = window.setTimeout(() => {
      setBlowing(false); setBlown(true); setConfetti((c) => c + 1);
    }, 900);
  };
  const cancelBlow = () => {
    setBlowing(false);
    if (blowTimer.current) window.clearTimeout(blowTimer.current);
  };

  return (
    <div className={`${playfair.variable} ${inter.variable} min-h-screen bg-black text-white overflow-x-hidden relative font-[family-name:var(--font-inter)]`}>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes eq { 0%, 100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-2deg); opacity: 1; }
          25% { transform: scale(1.1, 0.9) rotate(2deg); }
          50% { transform: scale(0.92, 1.12) rotate(-3deg); }
          75% { transform: scale(1.06, 0.94) rotate(1deg); }
        }
        @keyframes shine { from { background-position: 200% center; } to { background-position: -200% center; } }
        ::selection { background: #fbbf24; color: #000; }
      `}</style>

      <AnimatePresence>
        {showEntrance && <Entrance onDone={() => { setEntered(true); setShowEntrance(false); }} />}
      </AnimatePresence>

      {/* atmosphere */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(120,80,20,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(90,50,140,0.14),transparent_55%)]" />
      <FloatingLilies />
      <Spotlight />
      <div className="pointer-events-none fixed inset-0 z-[5] opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")` }} />
      <Confetti trigger={confetti} />

      {/* HERO */}
      <motion.section style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div style={{ rotate: beamRotate }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[-60, -40, -20, 0, 20, 40, 60].map((a) => (
            <div key={a} className="absolute top-1/2 left-1/2 h-[140vmax] w-px origin-top"
              style={{ transform: `rotate(${a}deg)`,
                background: "linear-gradient(to bottom, transparent, rgba(251,191,36,0.28), transparent)" }} />
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0 }}
          animate={entered ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 14 }} className="mb-6 relative">
          <div className="absolute inset-0 blur-2xl bg-amber-400/30 rounded-full" />
          <Crown className="w-12 h-12 text-amber-300 relative" />
        </motion.div>

        <div className="overflow-hidden">
          <motion.p initial={{ y: "110%" }} animate={entered ? { y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.8, ease: EASE }}
            className="tracking-[0.55em] text-amber-200/70 text-[10px] uppercase mb-4 pl-2">
            18 · 11 · 2010 — the legend begins
          </motion.p>
        </div>

        <h1 className={`${playfair.variable} font-[family-name:var(--font-playfair)] font-black leading-[0.95]`}>
          {["HAPPY", "BIRTHDAY"].map((word, wi) => (
            <span key={word} className="block text-[11vw] sm:text-5xl text-white/90">
              {word.split("").map((ch, i) => (
                <motion.span key={i} className="inline-block"
                  initial={{ opacity: 0, y: 70, rotateX: -80, filter: "blur(8px)" }}
                  animate={entered ? { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" } : {}}
                  transition={{ delay: 0.55 + wi * 0.35 + i * 0.06, duration: 0.7, ease: EASE }}>
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
          <span className="block mt-2 text-[19vw] sm:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500 drop-shadow-[0_0_35px_rgba(251,191,36,0.4)]">
            {"PRINCE".split("").map((ch, i) => (
              <motion.span key={i} className="inline-block"
                initial={{ opacity: 0, y: 110, scale: 0.6, filter: "blur(14px)" }}
                animate={entered ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ delay: 1.25 + i * 0.08, duration: 0.9, ease: EASE }}>
                {ch}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.div initial={{ opacity: 0 }} animate={entered ? { opacity: 1 } : {}} transition={{ delay: 2, duration: 1 }}
          className="mt-8 flex items-center gap-3 text-white/50 text-xs tracking-widest uppercase">
          <Flower2 className="w-4 h-4 text-violet-300" /> lilies, beats &amp; black tie energy <Flower2 className="w-4 h-4 text-violet-300" />
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="absolute bottom-8 flex flex-col items-center gap-1 text-amber-200/60">
          <span className="text-[10px] tracking-[0.4em] uppercase">scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.section>

      <Marquee />

      {/* PRINCE FILES */}
      <section className="relative z-10 px-6 py-24 max-w-md mx-auto">
        <Reveal>
          <p className="text-center tracking-[0.5em] text-amber-200/60 text-[10px] uppercase mb-3">classified</p>
          <h2 className={`${playfair.variable} font-[family-name:var(--font-playfair)] text-center text-4xl font-black mb-10`}>
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 animate-[shine_4s_linear_infinite] bg-[length:200%_auto]">Prince</span> Files
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Tilt>
            <div className="relative rounded-[2rem] border border-amber-200/20 bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-xl p-7 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-violet-600/20 blur-3xl" />
              <div className="relative" style={{ transform: "translateZ(40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] tracking-[0.35em] uppercase text-white/40">Dossier №16</span>
                  <Flower2 className="w-5 h-5 text-violet-300" />
                </div>
                {[
                  { k: "Name", v: "Prince" },
                  { k: "Born", v: "18 November 2010" },
                  { k: "Aura", v: "Pitch black, 24 karat" },
                  { k: "Flower", v: "Lily — obviously" },
                  { k: "Level", v: `${level} / ∞` },
                ].map((row) => (
                  <div key={row.k} className="flex justify-between items-baseline border-b border-white/10 py-3 last:border-0">
                    <span className="text-white/40 text-sm">{row.k}</span>
                    <span className={`${playfair.variable} font-[family-name:var(--font-playfair)] text-amber-100`}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Tilt>
        </Reveal>
        <Reveal delay={0.15} className="mt-10">
          <p className="text-center text-white/40 text-xs tracking-[0.3em] uppercase mb-4">countdown to the next celebration</p>
          <div className="grid grid-cols-4 gap-3">
            {[{ v: cd.d, l: "days" }, { v: cd.h, l: "hrs" }, { v: cd.m, l: "min" }, { v: cd.s, l: "sec" }].map((u) => (
              <div key={u.l} className="rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-center">
                <motion.div key={u.v} initial={{ scale: 1.25, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-black text-amber-300 tabular-nums">
                  {String(u.v).padStart(2, "0")}
                </motion.div>
                <div className="text-[9px] tracking-[0.25em] uppercase text-white/35 mt-1">{u.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PLAYLIST */}
      <section className="relative z-10 px-6 py-20 max-w-md mx-auto">
        <Reveal>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Music className="w-5 h-5 text-amber-300" />
            <p className="tracking-[0.5em] text-amber-200/60 text-[10px] uppercase">on repeat since 2010</p>
          </div>
          <h2 className={`${playfair.variable} font-[family-name:var(--font-playfair)] text-center text-4xl font-black mb-10`}>
            Prince&apos;s Playlist
          </h2>
        </Reveal>
        <div className="space-y-5">
          {TRACKS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.12}><TrackCard track={t} index={i} /></Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="text-center text-white/30 text-xs mt-6">tap play — a little synth tribute, made with love</p>
        </Reveal>
      </section>

      {/* THE WISH */}
      <section className="relative z-10 px-6 py-28 max-w-xl mx-auto text-center">
        <Reveal><Flower2 className="w-8 h-8 text-violet-300 mx-auto mb-8" /></Reveal>
        <Words
          text="Happy birthday, Prince. Sixteen years of you being the realest one in every room. May your year hit harder than your playlist, shine brighter than gold on black, and bloom like lilies in full glory. This one's for you, king."
          className={`${playfair.variable} font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl leading-relaxed text-white/90`}
        />
        <Reveal delay={0.2} className="mt-10">
          <p className="text-amber-200/60 text-xs tracking-[0.35em] uppercase">— your partner in everything</p>
        </Reveal>
      </section>

      {/* FINALE */}
      <section className="relative z-10 px-6 pb-32 pt-16 max-w-md mx-auto text-center">
        <Reveal>
          <h2 className={`${playfair.variable} font-[family-name:var(--font-playfair)] text-4xl font-black mb-2`}>Make a wish.</h2>
          <p className="text-white/40 text-sm mb-12">hold the flame to blow it out</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative mx-auto w-56 h-64 select-none touch-none cursor-pointer"
            onPointerDown={startBlow} onPointerUp={cancelBlow} onPointerLeave={cancelBlow}>
            <AnimatePresence>
              {!blown && (
                <motion.div exit={{ scale: 0, opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.5 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-12 z-10">
                  <motion.div animate={blowing ? { scale: 0.3, y: -14, opacity: 0.5 } : { scale: 1, y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: EASE }}>
                    <div className="absolute -inset-8 rounded-full bg-amber-400/40 blur-2xl animate-pulse" />
                    <div className="relative w-7 h-12 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-[50%/60%_60%_40%_40%] origin-bottom"
                      style={{ animation: "flicker 0.35s ease-in-out infinite" }} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-2.5 h-10 bg-gradient-to-b from-amber-200 to-amber-500 rounded-full" />
            <div className="absolute bottom-0 w-full">
              <div className="mx-auto w-44 h-16 rounded-t-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-amber-300/80 to-transparent" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute top-2 w-1.5 h-4 bg-gradient-to-b from-amber-200 to-amber-500 rounded-full"
                    style={{ left: `${12 + i * 19}%` }} />
                ))}
              </div>
              <div className="mx-auto w-56 h-14 rounded-t-xl bg-gradient-to-b from-zinc-700 to-zinc-900 border-x border-b border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-b from-violet-300/70 to-transparent" />
              </div>
              <div className="mx-auto w-64 h-3 rounded-full bg-gradient-to-b from-zinc-600 to-zinc-800 border border-white/10" />
            </div>
          </div>
        </Reveal>
        <AnimatePresence>
          {blown && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: EASE }} className="mt-12">
              <p className={`${playfair.variable} font-[family-name:var(--font-playfair)] text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400`}>
                Wish locked in.
              </p>
              <p className="text-white/50 mt-2 text-sm">Happy 16th, Prince. The best is literally next.</p>
              <button onClick={() => setConfetti((c) => c + 1)}
                className="mt-6 px-8 py-3 rounded-full bg-amber-400 text-black font-bold text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(251,191,36,0.4)] active:scale-95 transition-transform">
                Celebrate again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center">
        <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase">made in black &amp; gold — for the one and only Prince</p>
      </footer>
    </div>
  );
}
