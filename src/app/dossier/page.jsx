"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import { Lily } from "@/components/ui/motion-kit";

export default function DossierPage() {
  const [flipped, setFlipped] = useState(false);
  const [pointerX, setPointerX] = useState(0);
  const [pointerY, setPointerY] = useState(0);

  const hoursLived = Math.floor((Date.now() - new Date("2005-11-18").getTime()) / 3600000);

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <section className="dossier relative min-h-screen p-[clamp(74px,12vw,150px)]_0 pt-[clamp(74px,12vw,150px)]" onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPointerX(((e.clientX - rect.left) / rect.width - 0.5) * 20);
          setPointerY(((e.clientY - rect.top) / rect.height - 0.5) * 20);
        }}>
          <div className="dossier-aura absolute right-[-18%] top-[10%] w-[60vmax] h-[60vmax] rounded-full bg-[conic-gradient(from_40deg,_rgba(122,82,194,0.16),rgba(255,155,212,0.08),transparent_60%)] blur-[60px]" />
          <div className="dossier-grid relative z-10 w-full max-w-[1180px] mx-auto gap-4 px-4 md:px-6 perspective-[1300px]">
            <div className="flip-wrap relative" style={{ transform: `perspective(1400px) rotateX(${pointerY * 0.1}deg) rotateY(${-pointerX * 0.1}deg)` }}>
              <div className="flip-tilt h-full" style={{ transform: `rotateX(${-pointerY * 0.05}deg) rotateY(${pointerX * 0.05}deg)` }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="id-card relative inset-0 rounded-[26px] p-[26px] border border-white/16 overflow-hidden bg-gradient-to-br from-[#241c36]_60% to-[#120f1b] shadow-[0_30px_70px_rgba(0,0,0,0.55)] cursor-pointer backface-hidden flex flex-col"
                  style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
                  onClick={() => setFlipped(!flipped)}
                >
                  {!flipped && (
                    <>
                      <div className="id-top relative z-10 flex justify-between gap-2 text-[7px] text-white/40">
                        <span>CLEARANCE</span>
                        <span className="text-mint">LEVEL-16</span>
                      </div>
                      <div className="id-holo absolute top-[-35%] left-[-25%] w-[80%] aspect-[1] bg-[conic-gradient(from_90deg,_transparent,rgba(203,183,255,0.28),transparent_40%)] blur-[20px] animate-[spin_14s_linear_infinite]" />
                      <div className="id-crest relative z-10 mt-[44px] flex items-center gap-2 text-lilac text-[8px]">
                        <Lily width={14} height={14} />
                        <span>DEPARTMENT OF CELEBRATION</span>
                      </div>
                      <h1 className="id-name relative z-10 mt-2 font-[Anton] text-[46px] md:text-76px leading-[0.86] text-white">PRINCE</h1>
                      <p className="id-tagline relative z-10 mt-1 max-w-[250px] text-[13px] leading-[1.55] text-white/60">Chapter 16 — It's Your Era</p>
                      <div className="id-meta relative z-10 mt-auto pt-[16px] flex gap-[26px] border-t border-white/10">
                        <div>
                          <span className="block text-[6px] text-white/30 tracking-widest mb-1">BORN</span>
                          <b className="block text-[12px] font-bold">18.11.2005</b>
                        </div>
                        <div>
                          <span className="block text-[6px] text-white/30 tracking-widest mb-1">ERA</span>
                          <b className="block script text-[18px] text-lilac">THE ERA CUT</b>
                        </div>
                        <div>
                          <span className="block text-[6px] text-white/30 tracking-widest mb-1">HOURS LIVED</span>
                          <b className="block text-[30px] md:text-46px font-mono leading-[1] text-white shadow-[0_0_24px_rgba(203,183,255,0.35)]">{hoursLived.toLocaleString()}</b>
                        </div>
                      </div>
                      <div className="id-stripes absolute right-[-34px] bottom-[72px] w-[150px] h-[44px] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.5)_0_2px,transparent_2px_5px)] rotate-[-24deg] opacity-22" />
                      <div className="id-flip-hint absolute right-20 bottom-18 z-20 flex items-center gap-1 text-[6px] text-white/40">
                        <span>TAP TO FLIP</span>
                      </div>
                    </>
                  )}
                  {flipped && (
                    <>
                      <div className="back-holes relative z-10 mt-[34px]">
                        <div className="mono text-[6.5px] text-white/40 tracking-widest mb-2">HOURS LIVED</div>
                        <strong className="block mt-[6px] font-mono text-[30px] md:text-46px leading-[1] text-white shadow-[0_0_24px_rgba(203,183,255,0.35)]">{hoursLived.toLocaleString()}</strong>
                        <span className="back-sub block mt-1 text-lilac text-[6px]">that's a lot of legendary</span>
                      </div>
                      <div className="back-facts mt-auto flex flex-col gap-[9px] relative z-10">
                        <div className="flex items-center gap-2 text-[7px] text-white/60"><span className="w-3 h-3 rounded-full bg-lilac" /> STORIES TOLD</div>
                        <div className="flex items-center gap-2 text-[7px] text-white/60"><span className="w-3 h-3 rounded-full bg-mint" /> WISHES MADE</div>
                        <div className="flex items-center gap-2 text-[7px] text-white/60"><span className="w-3 h-3 rounded-full bg-pink-400" /> CAKES BLOWN</div>
                      </div>
                      <blockquote className="back-quote relative z-10 mt-[16px] mb-[30px] max-w-[260px] font-[Playfair_Display] font-italic text-[17px] leading-[1.35] text-white/78">
                        "The best chapters are the ones we write together."
                      </blockquote>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
            <div className="lily-panel relative min-h-[520px] rounded-[26px] p-[26px] border border-white/13 bg-gradient-to-br from-[#2d2344]_0% to-[#151020]_66% shadow-[0_30px_70px_rgba(0,0,0,0.45)] flex flex-col">
              <div className="lily-panel-glow absolute right-[-30%] bottom-[-30%] w-[80%] aspect-[1] rounded-full bg-[radial-gradient(circle,_rgba(255,155,212,0.22),transparent_62%)] blur-[20px]" />
              <div className="lily-hero absolute right-16 top-38 w-[96px] md:w-128 text-lilac opacity-90 animate-[spin_30s_linear_infinite]">
                <Lily />
              </div>
              <h2 className="lily-title relative z-10 mt-[150px] font-[Anton] text-[42px] md:text-62px leading-[0.88] text-white">The Dossier</h2>
              <p className="lily-copy relative z-10 max-w-[250px] text-[13px] leading-[1.6] text-white/60">
                A classified profile of Prince — compiled from moments, laughter, and every era we've shared.
              </p>
              <div className="lily-chips relative z-10 mt-auto flex flex-wrap gap-2 pt-[18px]">
                <span className="mini-chip inline-flex items-center gap-1 border border-white/10 rounded-full px-[8px] py-[2] text-[6px] tracking-widest text-white/60"><span className="w-2 h-2 rounded-full bg-mint" /></span>
                <span className="mini-chip inline-flex items-center gap-1 border border-white/10 rounded-full px-[8px] py-[2] text-[6px] tracking-widest text-white/60"><span className="w-2 h-2 rounded-full bg-pink-400" /></span>
                <span className="mini-chip inline-flex items-center gap-1 border border-white/10 rounded-full px-[8px] py-[2] text-[6px] tracking-widest text-white/60"><span className="w-2 h-2 rounded-full bg-lilac" /></span>
              </div>
            </div>
          </div>
        </section>
      </NavShell>
    </div>
  );
}
