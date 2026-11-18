"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Crown, Fingerprint, Sparkles, Star } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import NextChapter from "@/components/shell/NextChapter";
import { Lily } from "@/components/ui/motion-kit";

const BORN = Date.UTC(2005, 10, 18);

function useLived() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);
  const ms = Math.max(0, now - BORN);
  return {
    hours: Math.floor(ms / 3600000),
    days: Math.floor(ms / 86400000),
    minutes: Math.floor(ms / 60000),
  };
}

const TRAITS = [
  ["CLASSIFIED TRAIT", "Effortlessly impossible to forget"],
  ["EARLY PREDICTION", "Main character, confirmed"],
  ["KNOWN ALIAS", "The Birthday Prince"],
];

const PROFILE = [
  ["ALIAS", "Prince of the group chat"],
  ["SUPERPOWER", "Making any room louder"],
  ["OBSESSED WITH", "Birthday season, obviously"],
  ["CURRENT STATUS", "Only getting started"],
];

export default function DossierPage() {
  const [flipped, setFlipped] = useState(false);
  const [pointerX, setPointerX] = useState(0);
  const [pointerY, setPointerY] = useState(0);
  const { hours, days, minutes } = useLived();

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <section
          className="dossier relative min-h-screen py-[clamp(74px,12vw,150px)] pt-[clamp(74px,12vw,150px)] overflow-hidden"
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setPointerX(((e.clientX - rect.left) / rect.width - 0.5) * 20);
            setPointerY(((e.clientY - rect.top) / rect.height - 0.5) * 20);
          }}
        >
          <div className="dossier-aura absolute right-[-18%] top-[10%] w-[60vmax] h-[60vmax] rounded-full bg-[conic-gradient(from_40deg,_rgba(122,82,194,0.16),rgba(255,155,212,0.08),transparent_60%)] blur-[60px]" />
          <div className="dossier-grid relative z-10 w-full max-w-[1180px] mx-auto gap-4 px-4 md:px-6 perspective-[1300px]">
            <div className="flip-wrap relative" style={{ transform: `perspective(1400px) rotateX(${pointerY * 0.1}deg) rotateY(${-pointerX * 0.1}deg)` }}>
              <div className="flip-tilt h-full" style={{ transform: `rotateX(${-pointerY * 0.05}deg) rotateY(${pointerX * 0.05}deg)` }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="id-card relative inset-0 rounded-[26px] p-[22px] md:p-[26px] border border-white/16 overflow-hidden bg-gradient-to-br from-[#241c36] 60% to-[#120f1b] shadow-[0_30px_70px_rgba(0,0,0,0.55)] cursor-pointer flex flex-col"
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

                      <div className="relative z-10 mt-[26px] flex items-start gap-[14px]">
                        <div className="id-photo relative shrink-0 w-[74px] md:w-[88px] aspect-[3/3.4] rounded-[12px] overflow-hidden border border-white/25 shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
                          <img src="/images/lyric-3.webp" alt="Prince ID portrait" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(160deg,rgba(255,45,120,0.28),transparent_55%)]" />
                          <span className="absolute left-[4px] bottom-[4px] mono text-[5px] text-white/90 tracking-widest bg-[#0c0814]/55 px-[3px] py-[1px] rounded-[2px]">ID · PHOTO</span>
                        </div>
                        <div className="min-w-0">
                          <div className="id-crest flex items-center gap-2 text-lilac text-[8px]">
                            <Lily width={14} height={14} />
                            <span>DEPARTMENT OF CELEBRATION</span>
                          </div>
                          <h1 className="id-name mt-2 font-[Anton] text-[40px] md:text-[66px] leading-[0.86] text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d78] via-[#a855f7] to-[#ffd166]">PRINCE</h1>
                          <p className="id-tagline mt-1 max-w-[250px] text-[12px] leading-[1.5] text-white/60">Chapter 16 — It&apos;s Your Era</p>
                        </div>
                      </div>

                      <div className="id-traits relative z-10 mt-[14px] flex flex-wrap gap-[6px]">
                        {["MAIN CHARACTER", "BIRTHDAY ERA", "LOUD LAUGHER"].map((t, i) => (
                          <span key={t} className={`trait-chip ${i === 0 ? "is-pink" : i === 1 ? "is-violet" : "is-gold"}`}>
                            {i === 0 ? <Star size={9} /> : i === 1 ? <Sparkles size={9} /> : <Crown size={9} />}
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="id-meta relative z-10 mt-auto pt-[14px] flex gap-[18px] md:gap-[26px] border-t border-dashed border-white/12">
                        <div>
                          <span className="block text-[6px] text-white/30 tracking-widest mb-1">BORN</span>
                          <b className="block text-[12px] font-bold">18.11.2005</b>
                        </div>
                        <div>
                          <span className="block text-[6px] text-white/30 tracking-widest mb-1">ERA</span>
                          <b className="block script text-[15px] md:text-[18px] text-lilac">THE ERA CUT</b>
                        </div>
                        <div>
                          <span className="block text-[6px] text-white/30 tracking-widest mb-1">HOURS LIVED</span>
                          <b className="block text-[24px] md:text-[38px] font-mono leading-[1] text-white shadow-[0_0_24px_rgba(203,183,255,0.35)]">{hours.toLocaleString()}</b>
                        </div>
                      </div>

                      <div className="id-stripes absolute right-[-34px] bottom-[72px] w-[150px] h-[44px] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.5)_0_2px,transparent_2px_5px)] rotate-[-24deg] opacity-22" />
                      <div className="stamp stamp-approved">
                        APPROVED<small>CH.16</small>
                      </div>
                      <div className="id-flip-hint absolute right-16 bottom-14 z-20 flex items-center gap-1 text-[6px] text-white/40">
                        <Fingerprint size={10} strokeWidth={2} />
                        <span>TAP TO FLIP</span>
                      </div>
                    </>
                  )}

                  {flipped && (
                    <>
                      <div className="back-holes relative z-10 mt-[26px]">
                        <div className="mono text-[6.5px] text-white/40 tracking-widest mb-2">HOURS LIVED</div>
                        <strong className="block mt-[6px] font-mono text-[30px] md:text-[40px] leading-[1] text-transparent bg-clip-text bg-gradient-to-r from-[#3ddc97] to-[#22d3ee] drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]">
                          {hours.toLocaleString()}
                        </strong>
                        <span className="back-sub block mt-1 text-lilac text-[6px]">that&apos;s a lot of legendary</span>
                      </div>

                      <div className="back-stats relative z-10 mt-[14px] grid grid-cols-3 gap-[10px]">
                        <div className="back-stat">
                          <span className="back-stat-num font-mono text-[16px] md:text-[20px] text-[#ffd166]">{days.toLocaleString()}</span>
                          <span className="back-stat-label mono text-[5px] tracking-widest text-white/40">DAYS</span>
                        </div>
                        <div className="back-stat">
                          <span className="back-stat-num font-mono text-[16px] md:text-[20px] text-[#3ddc97]">{(minutes / 1000).toFixed(1)}K</span>
                          <span className="back-stat-label mono text-[5px] tracking-widest text-white/40">MINUTES</span>
                        </div>
                        <div className="back-stat">
                          <span className="back-stat-num font-mono text-[16px] md:text-[20px] text-[#22d3ee]">12,480</span>
                          <span className="back-stat-label mono text-[5px] tracking-widest text-white/40">LAUGHS</span>
                        </div>
                      </div>

                      <div className="back-redacted relative z-10 mt-[14px] flex flex-col gap-[8px]">
                        {TRAITS.map(([k, v]) => (
                          <div key={k} className="redacted-row">
                            <span className="redacted-label mono text-[5.5px] tracking-widest text-[#ff5da2]">{k}</span>
                            <span className="redacted-text text-[11px] leading-[1.4] text-white/75">{v}</span>
                          </div>
                        ))}
                      </div>

                      <div className="back-facts mt-auto flex flex-col gap-[8px] relative z-10 pt-[12px]">
                        {[
                          ["STORIES TOLD", "#cbb7ff"],
                          ["WISHES MADE", "#a5f2d3"],
                          ["CAKES BLOWN", "#ff9bd4"],
                        ].map(([label, color]) => (
                          <div key={label} className="flex items-center gap-2 text-[7px] text-white/60">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
                            {label}
                          </div>
                        ))}
                      </div>

                      <div className="back-sign relative z-10 mt-[12px] text-right">
                        <span className="script font-[Playfair_Display] italic text-[15px] text-white/70">— your best friend</span>
                      </div>

                      <div className="stamp stamp-verified">
                        VERIFIED<small>LVL-16</small>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>

            <div className="lily-panel relative min-h-[520px] rounded-[26px] p-[22px] md:p-[26px] border border-white/13 bg-gradient-to-br from-[#2d2344] to-[#151020] 66% shadow-[0_30px_70px_rgba(0,0,0,0.45)] flex flex-col overflow-hidden">
              <div className="lily-panel-glow absolute right-[-30%] bottom-[-30%] w-[80%] aspect-[1] rounded-full bg-[radial-gradient(circle,_rgba(255,155,212,0.22),transparent_62%)] blur-[20px]" />
              <div className="lily-panel-tape absolute left-[18px] top-[-10px] w-[86px] h-[26px] bg-[rgba(255,209,102,0.32)] rotate-[-6deg] rounded-[2px] backdrop-blur-[2px]" />
              <div className="lily-hero absolute right-14 top-[26px] w-[88px] md:w-[112px] text-lilac opacity-90 animate-[spin_30s_linear_infinite]">
                <Lily />
              </div>

              <div className="profile-head relative z-10 mt-[86px] md:mt-[120px]">
                <span className="profile-kicker mono text-[6px] text-[#ffd166] tracking-widest">FILE · CHAPTER 16 · DECLASSIFIED</span>
                <h2 className="lily-title relative z-10 mt-[8px] font-[Anton] text-[40px] md:text-[56px] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d78] via-[#fb64b6] to-[#a855f7]">
                  The Dossier
                </h2>
                <p className="lily-copy relative z-10 max-w-[280px] text-[12px] leading-[1.6] text-white/60 mt-[10px]">
                  A classified profile of Prince — compiled from moments, laughter, and every era we&apos;ve shared.
                </p>
              </div>

              <div className="profile-rows relative z-10 mt-[18px] flex flex-col">
                {PROFILE.map(([k, v], i) => (
                  <div key={k} className="profile-row">
                    <span className="profile-key mono text-[5.5px] tracking-widest text-white/38">{k}</span>
                    <span className={`profile-val text-[11px] leading-[1.4] ${i % 2 ? "text-[#a5f2d3]" : "text-white/82"}`}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="lily-foot relative z-10 mt-auto pt-[16px] flex items-end justify-between gap-3">
                <div className="mini-polaroid w-[92px] md:w-[104px] shrink-0 rotate-[-5deg] rounded-[4px] bg-[#fffdf9] p-[6px] pb-[16px] shadow-[0_14px_26px_rgba(0,0,0,0.35)]">
                  <div className="overflow-hidden rounded-[2px] aspect-[3/3.4] bg-[#ded6ee]">
                    <img src="/images/lyric-4.webp" alt="Prince polaroid" className="w-full h-full object-cover" />
                  </div>
                  <span className="block mt-[5px] text-center script font-[Playfair_Display] italic text-[10px] text-[#33234c]">the birthday boy</span>
                </div>
                <div className="flex flex-col items-end gap-[6px]">
                  <div className="lily-chips flex flex-wrap justify-end gap-2">
                    <span className="mini-chip inline-flex items-center gap-1 border border-white/10 rounded-full px-[8px] py-[2px] text-[6px] tracking-widest text-white/60">
                      <BadgeCheck size={9} strokeWidth={2.4} className="text-[#3ddc97]" /> LEVEL-16 CLEARED
                    </span>
                    <span className="mini-chip inline-flex items-center gap-1 border border-white/10 rounded-full px-[8px] py-[2px] text-[6px] tracking-widest text-white/60">
                      <Sparkles size={9} strokeWidth={2.4} className="text-[#ffd166]" /> ONE OF ONE
                    </span>
                  </div>
                  <span className="barcode block w-[120px] h-[22px] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.75)_0_1px,transparent_1px_3px,rgba(255,255,255,0.75)_3px_4px,transparent_4px_7px)] opacity-40" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <NextChapter to="/anthems" label="Mixtape" tone={{ a: "#a855f7", b: "#22d3ee" }} />
      </NavShell>
    </div>
  );
}
