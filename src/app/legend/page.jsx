"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Share2, Sparkles } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import { triggerConfetti } from "@/components/shell/ConfettiCanvas";

export default function LegendPage() {
  const [verified, setVerified] = useState(0);
  const [copied, setCopied] = useState(false);
  const [replaying, setReplaying] = useState(false);

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <section className="finale relative min-h-screen p-[clamp(74px,12vw,150px)]_0 pt-[clamp(74px,12vw,150px)]_0 overflow-hidden">
          <div className="finale-aura absolute left-[50%] top-0 w-[130vmin] h-[90vmin] -translate-x-[50%] pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,_rgba(203,183,255,0.28),transparent_62%)] blur-[24px]" />
          <div className="finale-grid absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px] mask-[radial-gradient(ellipse_at_50%_20%,_#000_0,transparent_70%)]" />

          <div className="finale-hero relative z-10 text-center px-[clamp(20px,6vw,72px)]">
            <div className="eyebrow flex justify-center mb-2">
              <span className="mono text-[6px] text-lilac tracking-widest">END CREDITS</span>
            </div>
            <h1 className="finale-title font-[Anton] font-normal leading-[0.8] text-[clamp(52px,15vw,152px)] tracking-[0.01em] uppercase flex flex-col items-center text-white">
              <span className="legendary-word font-theme">
                <span className="kinetic-inner bg-[linear-gradient(100deg,#fff_0%,#d6c6ff_30%,#ff9bd4_62%,#a5f2d3_100%)] bg-clip-text text-transparent">
                  STAY LEGENDARY
                </span>
              </span>
            </h1>
            <p className="finale-sub mt-[18px] text-[6px] text-white/40 tracking-widest">CHAPTER 16 · COMPLETE</p>
          </div>

          <div className="finale-content relative z-10 grid grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] gap-[clamp(20px,4vw,34px)] max-w-[1080px] mx-auto mt-[clamp(38px,7vw,62px)] px-[clamp(20px,6vw,72px)]">
            <div className="tribute border border-white/10 rounded-[18px] p-[22px] bg-[linear-gradient(158deg,rgba(255,255,255,0.06),rgba(255,255,255,0.012))] backdrop-blur-[8px]">
              <div className="tribute-head flex items-center justify-between pb-[12px] mb-[14px] border-b border-white/10">
                <span className="tribute-head mono text-[5.5px] text-lilac tracking-widest">TRIBUTE</span>
                <span className="tribute-head text-pink-400"><Sparkles size={14} strokeWidth={2} /></span>
              </div>
              <p className="tribute-body text-[13.5px] leading-[1.75] text-white/72">
                Prince — you've turned every ordinary moment into something extraordinary. Chapter 16 isn't just another year; it's proof that you keep getting better, brighter, and more unforgettable. Stay legendary.
              </p>
              <p className="tribute-close mt-[12px] font-[Playfair_Display] font-italic text-[17px] text-lilac">— Your Best Friend</p>
              <div className="tribute-sign mt-[20px] mb-[4px] font-[Playfair_Display] font-italic text-[22px] text-white">With all my love,</p>
              <span className="tribute-date text-[5.5px] text-white/40 tracking-widest">18.11.2026</span>
            </div>

            <div className="pass-wrap flex flex-col gap-[12px]">
              <div className="birthday-pass relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#fdfbff] via-[#f0e9fc]_52% to-[#e2d7f6] text-[#1d1429] p-[18px]_p_[18px]_pb-[14px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] cursor-pointer group" onClick={() => setVerified((v) => (v + 1) % 3)}>
                <div className="pass-top flex items-flex-start justify-between gap-10 relative z-10">
                  <div className="pass-brand flex flex-col gap-[3px]">
                    <span className="pass-brand mono text-[5px] text-[#1d1429]/44 tracking-widest">ERA CUT AIRLINES</span>
                    <strong className="font-[Anton] text-[17px] tracking-[0.06em] text-[#241733"]>PRINCE</strong>
                  </div>
                  <div className="pass-lily w-[26px] text-[#7a52c2]"><Sparkles size={26} strokeWidth={2} /></div>
                </div>
                <div className="pass-divider relative flex items-center mx-[-18px] my-[12px] h-[12px]">
                  <div className="dash flex-1 h-[1px] bg-[repeating-linear-gradient(90deg,rgba(29,20,41,0.28)_0_5px,transparent_5px_10px)]" />
                  <div className="notch absolute w-[22px] h-[22px] rounded-full bg-[#050408] top-[50%] -translate-y-[50%] left-[-11px]" />
                  <div className="notch absolute w-[22px] h-[22px] rounded-full bg-[#050408] top-[50%] -translate-y-[50%] right-[-11px]" />
                </div>
                <div className="pass-body relative z-10 grid grid-cols-[repeat(4,minmax(0,1fr))] gap-[10px]_gap-[6px]">
                  <div className="pass-field flex flex-col gap-[2px] min-w-0">
                    <span className="pass-field mono text-[4.5px] text-[#1d1429]/42 tracking-widest">NAME</span>
                    <b className="text-[11px] font-[800] tracking-[0.02em] whitespace-nowrap truncate">PRINCE</b>
                  </div>
                  <div className="pass-field wide flex flex-col gap-[2px] grid-col-[span_2]">
                    <span className="pass-field mono text-[4.5px] text-[#1d1429]/42 tracking-widest">DESTINATION</span>
                    <b className="text-[11px] font-[800] tracking-[0.02em] whitespace-nowrap truncate">CHAPTER 16</b>
                  </div>
                  <div className="pass-field flex flex-col gap-[2px]">
                    <span className="pass-field mono text-[4.5px] text-[#1d1429]/42 tracking-widest">DATE</span>
                    <b className="text-[11px] font-[800] tracking-[0.02em] whitespace-nowrap truncate">18.11</b>
                  </div>
                  <div className="pass-field flex flex-col gap-[2px]">
                    <span className="pass-field mono text-[4.5px] text-[#1d1429]/42 tracking-widest">ERA</span>
                    <b className="text-[11px] font-[800] tracking-[0.02em] whitespace-nowrap truncate">LEGENDARY</b>
                  </div>
                </div>
                <div className="pass-bottom relative z-10 flex items-center gap-[10px] mt-[12px] pt-[11px] border-t border-[#1d1429]/20">
                  <div className="qr w-[44px] h-[44px] shrink-0 p-[3px] grid grid-cols-[repeat(6,1fr)] grid-rows-[repeat(6,1fr)] gap-[1px] bg-white rounded-[3px]">
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36].map((_, i) => (
                      <div key={i} className={`w-full h-full rounded-[0.5px] bg-[#1d1429]/10 ${i % 3 === 0 ? "bg-[#241733]" : ""}`} />
                    ))}
                  </div>
                  <div className="pass-meta flex flex-col gap-[2px] min-w-0">
                    <span className="pass-meta mono text-[4.5px] text-[#1d1429]/42 tracking-widest leading-[1.5]">BOARDING TIME</span>
                    <span className="script font-[Playfair_Display] font-italic text-[12px] text-[#4b3570"]>NOW</span>
                  </div>
                  <div className="pass-qr-icon ml-auto text-[#1d1429]/40 shrink-0"><Share2 size={16} strokeWidth={2} /></div>
                </div>
                <div className="pass-barcode relative z-10 h-[26px] mt-[10px] bg-[repeating-linear-gradient(90deg,#241733_0_1px,transparent_1px_3px,#241733_3px_4px,transparent_4px_8px)] opacity-72" />
                <div className="pass-code relative z-10 block mt-[5px] text-[5px] text-[#1d1429]/50 tracking-[0.22em"]>ERA-16-2026-PRINCE</div>
                <div className={`pass-verified absolute right-[12px] bottom-[58px] z-30 inline-flex items-center gap-[4px] px-[5px] py-[9px] rounded-[4px] text-[10px] font-[900] tracking-[0.1em] bg-white/55 mix-blend-multiply ${verified >= 3 ? "border-green-500 text-green-700" : "border-[#b3402f] text-[#b3402f]"}`}>
                  <span>VERIFIED</span>
                  <Sparkles size={10} strokeWidth={2} />
                </div>
                <div className="pass-actions flex gap-[8px] flex-wrap mt-[4px]">
                  <button className="flex items-center gap-2 border border-white/30 rounded-full px-[4px] py-[2] text-[5px] text-[#1d1429]/60 hover:bg-white/40 transition">
                    <Copy size={12} strokeWidth={2} /> COPY
                  </button>
                  <button className="flex items-center gap-2 border border-white/30 rounded-full px-[4px] py-[2] text-[5px] text-[#1d1429]/60 hover:bg-white/40 transition">
                    <Share2 size={12} strokeWidth={2} /> SHARE
                  </button>
                </div>
              </div>
              <p className="pass-hint text-[5px] text-white/28 tracking-widest text-center mt-[2px]">Tap the pass three times to verify</p>
            </div>
          </div>

          <div className="credits relative z-10 max-w-[1080px] mx-auto mt-[clamp(40px,7vw,66px)] px-[clamp(20px,6vw,72px)]">
            <div className="credits-head flex justify-between gap-10 pb-[10px] border-b border-white/10">
              <span className="credits-head mono text-[5.5px] text-white/40 tracking-widest">PRODUCTION</span>
            </div>
            <div className="credits-grid grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[1px] bg-white/10 m-[1px] border border-white/10 border-t-0">
              {[
                { role: "FILM BY", name: "YOUR BEST FRIEND" },
                { role: "STARRING", name: "PRINCE" },
                { role: "CHAPTER", name: "16 · IT'S YOUR ERA" },
                { role: "MUSIC", name: "ORIGINAL MOOD" },
                { role: "DESIGN", name: "ERA CUT STUDIO" },
                { role: "YEAR", name: "2026" },
              ].map((c, i) => (
                <div key={i} className="credit bg-[#08070c] p-[14px]_[12px] min-h-[74px] flex flex-col gap-[5px]">
                  <span className="mono text-[5px] text-white/40 tracking-widest">{c.role}</span>
                  <b className="text-[10.5px] font-[700] tracking-[0.02em] text-white leading-[1.35]">{c.name}</b>
                </div>
              ))}
            </div>
            <div className="credits-thanks flex items-center gap-[12px] mt-[22px]">
              <LilyCredits className="credits-lily w-[30px] text-lilac opacity-75 shrink-0" />
              <p className="mb-0 font-[Playfair_Display] font-italic text-[14px] leading-[1.4] text-white/60">Thank you for being part of Chapter 16.</p>
            </div>
          </div>

          <div className="post-credits relative z-10 flex flex-col items-center gap-[12px] mt-[44px] px-[clamp(20px,6vw,72px)]">
            <button className="reel-btn inline-flex items-center gap-[7px] bg-transparent border border-white/10 rounded-full px-[9px] py-[14px] text-white/40 transition hover:border-white/26 hover:text-white" onClick={() => { triggerConfetti({ count: 150 }); setReplaying(true); setTimeout(() => setReplaying(false), 800); }}>
              <Sparkles size={20} strokeWidth={2} className="animate-[spin_9s_linear_infinite]" />
              <span className="reel-btn mono text-[5.5px] tracking-widest">REPLAY FILM</span>
            </button>
            <div className="deleted-scene max-w-[460px] p-[18px]_p_[20px] text-center border border-[rgba(203,183,255,0.34)] dashed rounded-[12px] bg-[rgba(203,183,255,0.05)]">
              <span className="deleted-scene mono text-[5px] text-lilac tracking-widest">POST-CREDITS SCENE</span>
              <p className="mt-[2px] mb-[2px] font-[Playfair_Display] font-italic text-[15px] leading-[1.5] text-white/78">The best part is still ahead...</p>
              <span className="script font-[Playfair_Display] font-italic text-[12px] text-white/40">Stay tuned for Chapter 17</span>
            </div>
            <button className="replay-btn inline-flex items-center gap-7 bg-white text-[#07070a] border-0 rounded-full px-[12px] py-[18px] font-mono text-[7px] tracking-[0.16em] transition hover:bg-lilac hover:-translate-y-[2px]" onClick={() => setReplaying(true)}>
              <ArrowIcon size={20} strokeWidth={2} /> REPLAY
            </button>
          </div>
        </section>
      </NavShell>
    </div>
  );
}

function LilyCredits({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M12 2c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8Z" />
      <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4Z" />
    </svg>
  );
}

function ArrowIcon({ size = 20, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg size={size} strokeWidth={strokeWidth} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
