"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import NextChapter from "@/components/shell/NextChapter";
import { triggerConfetti } from "@/components/shell/ConfettiCanvas";
import { setProgress } from "@/lib/progress";

const PHOTOS = ["/images/lyric-1.webp", "/images/lyric-2.webp", "/images/lyric-3.webp", "/images/lyric-4.webp"];
const TIMES = ["15:04", "15:12", "15:26", "15:38"];
const CAPTIONS = ["Cloudy skies, bright mood", "Park royalty", "Stylish by the tree", "Golden hour energy"];

export default function MemoriesPage() {
  const [dismissed, setDismissed] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const swipingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ x: 0, y: 0 });
  const dismissedRef = useRef(0);

  useEffect(() => { dismissedRef.current = dismissed; }, [dismissed]);

  const completeReel = () => {
    setProgress(7);
    triggerConfetti({ count: 90 });
  };

  useEffect(() => {
    const move = (e) => {
      if (!swipingRef.current) return;
      const p = e.touches ? e.touches[0] : e;
      dragRef.current = {
        x: p.clientX - startRef.current.x,
        y: (p.clientY - startRef.current.y) * 0.25,
      };
      setDrag({ ...dragRef.current });
    };
    const up = () => {
      if (!swipingRef.current) return;
      swipingRef.current = false;
      const dx = dragRef.current.x;
      dragRef.current = { x: 0, y: 0 };
      setDrag({ x: 0, y: 0 });
      if (Math.abs(dx) > 70 && dismissedRef.current < PHOTOS.length) {
        const next = dismissedRef.current + 1;
        dismissedRef.current = next;
        setDismissed(next);
        if (next >= PHOTOS.length) completeReel();
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, []);

  const onDown = (e) => {
    if (dismissedRef.current >= PHOTOS.length) return;
    const p = e.touches ? e.touches[0] : e;
    startRef.current = { x: p.clientX, y: p.clientY };
    dragRef.current = { x: 0, y: 0 };
    swipingRef.current = true;
  };

  const replay = () => {
    dismissedRef.current = 0;
    setDismissed(0);
    setDrag({ x: 0, y: 0 });
  };

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <section className="memories relative min-h-screen py-[clamp(74px,12vw,150px)] pt-[clamp(74px,12vw,150px)] overflow-hidden">
          <div className="memories-aura absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(60,34,96,0.14)_1px,transparent_1px)] bg-[size:18px_18px] opacity-4 mask-[radial-gradient(ellipse_at_50%_40%,_#000_0,transparent_78%)]" />
          <div className="memories-grid relative z-10 grid grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)] gap-[22px] w-full max-w-[1180px] mx-auto px-4 md:px-6">
            <div className="stack-zone flex flex-col gap-[16px]">
              <div className="stack relative h-[396px]">
                {PHOTOS.map((src, i) => {
                  const isTop = i === dismissed;
                  const gone = i < dismissed;
                  if (gone) return null;
                  return (
                  <motion.div
                    key={i}
                    className={`polaroid absolute inset-x-0 top-0 w-full max-w-[320px] mx-auto rounded-[4px] bg-[#fffdf9] p-[11px] shadow-[0_18px_34px_rgba(52,28,84,0.22)] ${isTop ? "is-top cursor-grab touch-none" : "pointer-events-none"} ${swipingRef.current ? "cursor-grabbing" : ""}`}
                    style={{
                      zIndex: PHOTOS.length - i,
                      transform: isTop
                        ? `rotate(${(i - (PHOTOS.length - 1)) * 2 + drag.x * 0.04}deg) translate(${drag.x}px, ${drag.y + i * 8}px)`
                        : `rotate(${(i - (PHOTOS.length - 1)) * 2}deg) translateY(${i * 8}px)`,
                    }}
                    onPointerDown={isTop ? onDown : undefined}
                    onTouchStart={isTop ? onDown : undefined}
                  >
                    <div className="polaroid-photo relative overflow-hidden rounded-[2px] aspect-[4/4.35] bg-[#ded6ee]">
                      <img src={src} alt={`Memory ${i + 1}`} className="w-full h-full object-cover" style={{ filter: "saturate(0.92) contrast(1.02)" }} />
                      <div className="develop absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(255,255,255,0.42),transparent_48%)]" />
                      <span className="polaroid-time absolute right-[6px] bottom-[5px] text-[5.5px] text-white/90 tracking-widest bg-[#0c0814]/50 px-[2px] py-[2px] rounded-[2px]">{TIMES[i]}</span>
                    </div>
                    <div className="polaroid-foot flex items-center justify-between gap-6 px-[3px] py-[9px] pb-[11px]">
                      <span className="script font-[Playfair_Display] font-italic text-[17px] text-[#33234c]">{CAPTIONS[i]}</span>
                      <span className="drag-hint text-[5px] text-[#33234c]/40 tracking-widest">{i === dismissed ? "swipe →" : "drag"}</span>
                    </div>
                  </motion.div>
                  );
                })}
                <div className={`stack-finished absolute inset-[22%_6%_auto] z-10 bg-[#fffdf9] rounded-[4px] p-[22px_18px] text-center shadow-[0_18px_34px_rgba(52,28,84,0.24)] ${dismissed >= PHOTOS.length ? "" : "is-hidden"}`}>
                  <span className="stack-finished mono text-[6px] text-[#33234c]/50 tracking-widest">REEL COMPLETE</span>
                  <strong className="block mt-[6px] font-[Anton] text-[30px] text-[#2b1c40]">MEMORIES SAVED</strong>
                  <p className="mt-[2px] mb-[14px] text-[11.5px] leading-[1.55] text-[#2b1c40]/60">You made it through every moment. Replay to relive them.</p>
                  <button className="mini-action inline-flex items-center gap-2 border border-[#2b1c40]/20 rounded-full px-[10px] py-[2px] text-[6px] tracking-widest text-[#4b3570] hover:bg-[#241a33] hover:text-white transition mx-auto" onClick={replay}>
                    <Sparkles size={14} strokeWidth={2} /> REPLAY
                  </button>
                </div>
              </div>
              <div className="stack-meta max-w-[320px] w-full mx-auto">
                <div className="stack-meta mono text-[5.5px] text-[#33234c]/45 tracking-widest">CHAPTER 04 · THE REEL</div>
                <p className="mt-[6px] mb-[8px] text-[11.5px] leading-[1.5] text-[#2b1c40]/66">A scrapbook of the moments that made Chapter 16 unforgettable.</p>
                <div className="stack-dots flex gap-[5px]">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`w-[16px] h-[2px] rounded-full bg-[#33234c]/16 transition ${i === 0 ? "bg-[#6d4fa8]" : ""}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative flex items-end">
              <div className="scratch-shell w-full max-w-[320px] mx-auto">
                <div className="scratch-stage relative rounded-[12px] overflow-hidden aspect-[1] bg-[#e7e1f4]">
                  <img src="/images/scrapbook.webp" alt="Scratch reveal" className="w-full h-full object-cover" />
                  <div className="scratch-glow absolute inset-0 pointer-events-none z-1 bg-[radial-gradient(circle_at_50%_40%,_rgba(255,155,212,0.18),transparent_62%)]" />
                  <canvas className="scratch-canvas absolute inset-0 w-full h-full z-[2] cursor-grab touch-none" width="320" height="320" />
                </div>
                <div className="scratch-copy px-[14px] pt-[14px] pb-[4px]">
                  <div className="scratch-copy mono flex items-center gap-2 text-[5.5px] text-[#33234c]/50 tracking-widest">SCRATCH TO REVEAL</div>
                  <h3 className="mt-[8px] mb-[8px] text-[19px] leading-[1.2] tracking-tighter text-[#241733]">A Gift for Prince</h3>
                  <p className="mb-[12px] text-[11.5px] leading-[1.6] text-[#2b1c40]/60">Scratch the silver to uncover your birthday message.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-[46px]">
            <div className="strip-head flex justify-between gap-10 mb-[12px] pb-[10px] border-b border-[#33234c]/16">
              <span className="strip-head mono flex items-center gap-2 text-[5.5px] text-[#33234c]/50 tracking-widest">CONTACT SHEET</span>
              <span className="strip-head mono flex items-center gap-2 text-[5.5px] text-[#33234c]/50 tracking-widest">4 FRAMES</span>
            </div>
            <div className="filmstrip-wrap overflow-x-auto overflow-y-hidden pb-[6px]">
              <div className="filmstrip relative flex gap-[6px] w-max-content px-[26px] py-[26px] bg-[#16111f] rounded-[6px]">
                <div className="sprockets absolute left-0 right-0 h-[12px] bg-[radial-gradient(circle,_rgba(247,242,255,0.28)_0_3px,transparent_3.5px)] bg-[size:18px_12px] bg-repeat-x bg-[4px_center] top-[3px]" />
                <div className="sprockets absolute left-0 right-0 h-[12px] bg-[radial-gradient(circle,_rgba(247,242,255,0.28)_0_3px,transparent_3.5px)] bg-[size:18px_12px] bg-repeat-x bg-[4px_center] bottom-[3px]" />
                {PHOTOS.map((src, i) => (
                  <div key={i} className="frame w-[138px] shrink-0">
                    <div className="frame-img relative overflow-hidden rounded-[2px] aspect-[4/5] bg-[#241b33]">
                      <img src={src} alt={`Frame ${i + 1}`} className="w-full h-full object-cover" style={{ filter: "saturate(0.8)" }} />
                      <div className="frame-leak absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,_transparent_60%,rgba(22,17,31,0.75))] shadow-[inset_0_0_22px_rgba(255,155,212,0.16)]" />
                    </div>
                    <figcaption className="flex justify-between gap-4 mt-[5px]">
                      <span className="mono text-[5px] tracking-widest text-white/45 uppercase">{CAPTIONS[i]}</span>
                      <span className="mono text-[5px] text-lilac/75 tracking-widest uppercase">{TIMES[i]}</span>
                    </figcaption>
                  </div>
                ))}
              </div>
            </div>
            <div className="projector-row grid grid-cols-[1fr_1fr] gap-[18px] mt-[26px]">
              {[
                { id: "intro", title: "The Intro", src: "/gifs/intro.gif" },
                { id: "surprise", title: "The Surprise", src: "/gifs/surprise.gif" },
              ].map((proj) => (
                <div key={proj.id} className="projector flex flex-col rounded-[16px] overflow-hidden bg-[#fffdf9] shadow-[0_18px_34px_rgba(52,28,84,0.16)] border border-[#33234c]/8">
                  <div className={`projector-gate relative overflow-hidden bg-[#191223] grid place-items-center min-h-[196px] ${proj.id === "intro" ? "aspect-[4/3.1]" : "aspect-[4/3.1]"}`}>
                    <img src={proj.src} alt={proj.title} className="w-full h-full object-cover" />
                    <div className="gate-leak absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_24%_20%,_rgba(255,155,212,0.32),transparent_54%)] bg-[linear-gradient(180deg,_transparent_55%,rgba(17,12,24,0.7)) mix-blend-screen" />
                    <div className="gate-reel absolute left-[10px] top-[9px] text-[5.5px] text-white/85 tracking-widest bg-[#0c0814]/50 px-[3px] py-[2px] rounded-[2px]">ROLL {proj.id.toUpperCase()}</div>
                  </div>
                  <div className="projector-meta px-[14px] py-[15px] pb-[16px]">
                    <span className="projector-meta mono text-[5.5px] text-[#7a52c2] tracking-widest">PROJECTOR · {proj.id.toUpperCase()}</span>
                    <h3 className="mt-[6px] mb-[5px] text-[15px] leading-[1.28] tracking-tighter text-[#241733]">{proj.title}</h3>
                    <p className="mb-0 text-[11px] leading-[1.55] text-[#2b1c40]/60">A moving memory from Chapter 16.</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="memory-note flex flex-col items-center gap-[8px] mt-[44px] text-center">
              <Lily className="note-lily w-[34px] text-[#7a52c2] opacity-80" />
              <p className="mb-0 text-[14px] leading-[1.5] text-[#241733]/80">Every frame is a page in your story.</p>
              <p className="script font-[Playfair_Display] font-italic text-[12px] text-[#6d4fa8]">Keep remembering.</p>
              <div className="memory-note mono flex items-center gap-2 text-[5.5px] text-[#33234c]/40 tracking-widest">CHAPTER 04 · END</div>
            </div>
          </div>
        </section>
        <NextChapter to="/wish" label="The Candle" tone={{ a: "#22d3ee", b: "#3ddc97" }} />
      </NavShell>
    </div>
  );
}

function Lily({ className = "", width = 24, height = 24 }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8Z" />
      <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4Z" />
    </svg>
  );
}
