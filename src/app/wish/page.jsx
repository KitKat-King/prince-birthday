"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import { triggerConfetti } from "@/components/shell/ConfettiCanvas";

const CANDLE_COUNT = 16;

export default function WishPage() {
  const [blown, setBlown] = useState(false);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wished, setWished] = useState(false);
  const raf = useRef(0);
  const progressRef = useRef(0);
  const last = useRef(0);

  const startHold = useCallback(() => {
    if (blown) return;
    setHolding(true);
    last.current = performance.now();
    raf.current = requestAnimationFrame(loop);
  }, [blown]);

  const stopHold = useCallback(() => {
    setHolding(false);
    cancelAnimationFrame(raf.current);
    raf.current = 0;
  }, []);

  const loop = useCallback(() => {
    const now = performance.now();
    const dt = (now - last.current) / 16;
    last.current = now;
    progressRef.current = Math.min(1, progressRef.current + dt * 0.1);
    setProgress(progressRef.current);
    if (progressRef.current >= 1 && !blown) {
      setBlown(true);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      triggerConfetti({ x: window.innerWidth / 2, y: window.innerHeight / 2, count: 300 });
    } else {
      raf.current = requestAnimationFrame(loop);
    }
  }, [blown]);

  useEffect(() => {
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <section className="cake-chapter relative min-h-screen p-[clamp(74px,12vw,150px)]_0 pt-[clamp(74px,12vw,150px)] overflow-hidden">
          <div className="cake-aura absolute left-[50%] top-[44%] w-[120vmin] h-[120vmin] -translate-x-[50%] -translate-y-[50%] rounded-full bg-[radial-gradient(circle,_rgba(255,155,212,0.14),transparent_62%)] blur-[30px]" />
          <div className="cake-sparks absolute inset-0 pointer-events-none" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="cake-spark absolute w-[2px] h-[8px] rounded-full bg-white/65 animate-[sparkFloat_5s_ease-in-out_infinite]" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }} />
          ))}

          <div className={`cake-stage relative flex items-center justify-center min-h-[400px] mb-[30px] ${blown ? "shake" : ""} animate-[cakeShake_0.8s_ease-out]`}>
            <div className="cake-halo absolute w-[min(340px,82vw)] aspect-[1] rounded-full border-[1px] border-dashed border-white/18 animate-[spin_34s_linear_infinite]" />

            <div className="cake relative w-[min(280px,74vw)] h-[292px] z-2">
              <div className="cake-tier tier-top absolute left-[50%] -translate-x-[50%] bottom-[154px] w-[56%] h-[62px] rounded-[12px]_12px_[8px]_[8px] bg-gradient-to-b from-[#3d2c52] via-[#261a36]_54% to-[#170f22] border border-white/10 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.55),inset_0_2px_0_rgba(255,255,255,0.14),0_16px_30px_rgba(0,0,0,0.45)] overflow-hidden">
                <div className="tier-icing absolute inset-0_0_auto_0 h-[20px] bg-gradient-to-b from-[#fdfaff] via-[#efe6ff]_48% to-[#d9c8f6] rounded-[12px]_12px_[46%]_[46%]_[12px]_[12px]_[42%]_[42%] shadow-[inset_0_-3px_6px_rgba(150,120,200,0.28)]" />
                <div className="drip absolute w-[9px] h-[15px] rounded-[0_0_99px_99px] bg-gradient-to-b from-[#efe6ff] to-[#d9c8f6] shadow-[0_2px_3px_rgba(150,120,200,0.25)] left-[12%] top-[14px]" />
                <div className="drip absolute w-[7px] h-[21px] rounded-[0_0_99px_99px] bg-gradient-to-b from-[#efe6ff] to-[#d9c8f6] shadow-[0_2px_3px_rgba(150,120,200,0.25)] left-[40%] top-[14px]" />
                <div className="drip absolute w-[9px] h-[12px] rounded-[0_0_99px_99px] bg-gradient-to-b from-[#efe6ff] to-[#d9c8f6] shadow-[0_2px_3px_rgba(150,120,200,0.25)] right-[14%] top-[14px]" />
                <div className="drip absolute w-[8px] h-[17px] rounded-[0_0_99px_99px] bg-gradient-to-b from-[#efe6ff] to-[#d9c8f6] shadow-[0_2px_3px_rgba(150,120,200,0.25)] right-[34%] top-[14px]" />
                <div className="sprinkle absolute w-[6px] h-[2px] rounded-full bg-[var(--pink)] left-[22%] top-[46%] rotate-[24deg]" />
                <div className="sprinkle absolute w-[6px] h-[2px] rounded-full bg-[var(--mint)] left-[48%] top-[58%] rotate-[-18deg]" />
                <div className="sprinkle absolute w-[6px] h-[2px] rounded-full bg-[var(--lilac)] left-[70%] top-[40%] rotate-[46deg]" />
              </div>
              <div className="cake-tier tier-mid absolute left-[50%] -translate-x-[50%] bottom-[88px] w-[78%] h-[68px] rounded-[12px]_12px_[8px]_[8px] bg-gradient-to-b from-[#3d2c52] via-[#261a36] to-[#170f22] border border-white/10 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.55),inset_0_2px_0_rgba(255,255,255,0.14),0_16px_30px_rgba(0,0,0,0.45)] overflow-hidden">
                <div className="tier-icing absolute inset-0_0_auto_0 h-[24px] bg-gradient-to-b from-[#fdfaff] via-[#efe6ff]_48% to-[#d9c8f6] rounded-[12px]_12px_[46%]_[46%]_[12px]_[12px]_[42%]_[42%] shadow-[inset_0_-3px_6px_rgba(150,120,200,0.28)]" />
                <div className="sprinkle absolute w-[6px] h-[2px] rounded-full bg-[var(--pink)] left-[30%] top-[50%]" />
                <div className="sprinkle absolute w-[6px] h-[2px] rounded-full bg-[var(--lilac)] left-[60%] top-[45%] rotate-[30deg]" />
              </div>
              <div className="cake-tier tier-bottom absolute left-[50%] -translate-x-[50%] bottom-[16px] w-[100%] h-[80px] rounded-[12px]_12px_[8px]_[8px] bg-gradient-to-b from-[#3d2c52] via-[#261a36]_54% to-[#170f22] border border-white/10 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.55),inset_0_2px_0_rgba(255,255,255,0.14),0_16px_30px_rgba(0,0,0,0.45)] overflow-hidden">
                <div className="tier-icing absolute inset-0_0_auto_0 h-[24px] bg-gradient-to-b from-[#fdfaff] via-[#efe6ff]_48% to-[#d9c8f6] rounded-[12px]_12px_[46%]_[46%]_[12px]_[12px]_[42%]_[42%] shadow-[inset_0_-3px_6px_rgba(150,120,200,0.28)]" />
                <div className="sprinkle absolute w-[6px] h-[2px] rounded-full bg-[var(--pink)] left-[15%] top-[55%]" />
                <div className="sprinkle absolute w-[6px] h-[2px] rounded-full bg-[var(--mint)] left-[45%] top-[62%] rotate-[-20deg]" />
                <div className="sprinkle absolute w-[6px] h-[2px] rounded-full bg-[var(--lilac)] left-[75%] top-[48%] rotate-[50deg]" />
              </div>
              <div className="cake-plate absolute left-[50%] bottom-[4px] -translate-x-[50%] w-[118%] h-[16px] rounded-full bg-gradient-to-b from-[#ded7ea] via-[#9b93ad]_46% to-[#4c4559] shadow-[0_14px_26px_rgba(0,0,0,0.6)]" />
              <div className="cake-number absolute left-[50%] bottom-[36px] -translate-x-[50%] font-[Anton] text-[30px] letter-spacing-[0.06em] text-[rgba(255,155,212,0.55)] shadow-[0_0_18px_rgba(255,155,212,0.5)]">16</div>
              <div className={`cake-flash absolute inset-0 z-[3] pointer-events-none opacity-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,0.9),rgba(255,155,212,0.4)_34%,transparent_68%)] mix-blend-screen transition-opacity duration-300 ${blown ? "on" : ""}`} />
              <div className="cake-banner absolute left-[50%] top-0 -translate-x-[50%] z-40 flex flex-col items-center gap-4 px-[18px] py-[10px] rounded-[10px] text-center bg-[rgba(10,8,14,0.82)] border border-[rgba(203,183,255,0.35)] backdrop-blur-[10px]">
                <span className="mono text-[5.5px] text-lilac tracking-widest">MAKE A WISH</span>
                <strong className="font-[Anton] text-[18px] md:text-26px letter-spacing-[0.02em] text-white">BLOW THE CANDLES</strong>
              </div>
            </div>

            <div className={`candle-grid absolute left-[50%] bottom-[210px] -translate-x-[50%] w-[60%] grid grid-cols-[repeat(8,1fr)] justify-center row-gap-[2px] ${blown ? "blown" : ""}`}>
              {[...Array(CANDLE_COUNT)].map((_, i) => (
                <div key={i} className={`candle relative w-[5px] h-[23px] rounded-full bg-gradient-to-b from-[#ffe7f4] via-[#ff9bd4]_58% to-[#cbb7ff] shadow-[inset_0_0_3px_rgba(255,255,255,0.7)] ${i % 3 === 0 ? "bg-gradient-to-b from-[#eafff6] via-[#a5f2d3]_58% to-[#8fd8f2]" : ""} ${i % 3 === 1 ? "bg-gradient-to-b from-[#f7f2ff] via-[#cbb7ff]_58% to-[#a98ee0]" : ""}`}>
                  <div className="wick absolute top-[-3px] left-[50%] w-[1px] h-[4px] bg-[#2a2020] -translate-x-[50%]" />
                  {!blown && (
                    <div className="flame absolute top-[-16px] left-[50%] w-[7px] h-[13px] -translate-x-[50%] origin-[50%_100%] rounded-[50%_50%_46%_46%]_[62%_62%_38%_38%] bg-[radial-gradient(circle_at_50%_72%,#fff_0_18%,#ffdcaa_38%,#ffb36b_62%,rgba(255,155,212,0.6)_84%,transparent_92%)] blur-[0.4px] shadow-[0_0_14px_3px_rgba(255,178,112,0.5)] animate-[flicker_0.42s_ease-in-out_infinite_alternate]" />
                  )}
                  {blown && (
                    <div className="smoke absolute top-[-18px] left-[50%] w-[6px] h-[6px] rounded-full bg-[rgba(220,214,235,0.55)] blur-[2px] -translate-x-[50%] opacity-100 animate-[smokeUp_1.8s_ease-out_forwards]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="wish-controls flex flex-col items-center gap-[22px]">
            <div className="blow-wrap flex flex-col items-center gap-[8px]">
              <button
                className={`blow-wrap relative w-[104px] h-[104px] rounded-full border-0 bg-transparent touch-none user-select-none grid place-items-center ${blown ? "opacity-50" : ""}`}
                onPointerDown={startHold}
                onPointerUp={stopHold}
                onPointerLeave={stopHold}
                onTouchStart={(e) => { e.preventDefault(); startHold(); }}
                onTouchEnd={stopHold}
                onTouchCancel={stopHold}
              >
                <svg className="blow-ring absolute inset-0 w-full h-full" viewBox="0 0 104 104">
                  <circle className="blow-track" cx={52} cy={52} r={48} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1.5} />
                  <circle className="blow-progress" cx={52} cy={52} r={48} fill="none" stroke="var(--pink)" strokeWidth={2.5} strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "52px 52px", strokeDashoffset: 301 - (301 * progress) / 100 }} />
                </svg>
                <div className={`blow-inner relative z-10 flex flex-col items-center gap-[3px] w-[82%] h-[82%] rounded-full bg-[radial-gradient(circle_at_36%_28%,_#2b2140,#100c18_74%)] border border-white/14 justify-center transition duration-300 ${blown ? "bg-[radial-gradient(circle_at_36%_28%,_#3b2a52,#171021_74%)] border-[rgba(165,242,211,0.4)]" : ""}`}>
                  <svg className={`w-[24px] h-[24px] text-pink-400 ${blown ? "text-mint" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5L12 2z" /></svg>
                  <b className="text-[7.5px] tracking-[0.1em] font-bold">{blown ? "WISH MADE" : "HOLD TO BLOW"}</b>
                  <small className="text-[5.5px] text-white/40 tracking-widest">{blown ? "Candles out" : "Hold to blow out all 16"}</small>
                </div>
              </button>
              <p className="blow-hint text-[5.5px] text-white/30 tracking-widest text-center">{blown ? "All candles blown — wish sent ✨" : "Press and hold to blow out the candles"}</p>
            </div>

            {!wished && (
              <div className="wish-ticket relative w-full max-w-[460px] p-[20px]_p_[20px]_pb-[16px] bg-gradient-to-br from-[#fdfbff] to-[#efe7fb] text-[#201530] rounded-[12px] shadow-[0_24px_46px_rgba(0,0,0,0.45)] border border-white/6 animate-in zoom-in duration-500">
                <div className="ticket-edge absolute inset-0_0_auto_0 h-[12px] bg-[radial-gradient(circle_at_6px_-2px,_transparent_6px,#efe7fb_6.5px)] bg-[size:12px_12px] bg-repeat-x rounded-[12px]_12px_0_0 opacity-100" />
                <p className="mono text-[5.5px] text-[#201530]/45 tracking-widest mb-4">YOUR BIRTHDAY WISH</p>
                <strong className="block mt-[2px] mb-[14px] font-[Playfair_Display] font-italic text-[18px] md:text-24px leading-[1.3] tracking-tighter text-[#2b1c40]">
                  I wish Prince stays legendary forever.
                </strong>
                <div className="ticket-foot flex items-center justify-between gap-[10px] border-t border-[#201530]/18 pt-[12px]">
                  <span className="script font-[Playfair_Display] font-italic text-[13px] text-[#201530]/60">With love,</span>
                  <span className="script font-[Playfair_Display] font-italic text-[13px] text-[#2b1c40]">Your Best Friend</span>
                </div>
              </div>
            )}
            {wished && (
              <div className="wish-ticket relative w-full max-w-[460px] p-[20px]_p_[20px]_pb-[16px] bg-gradient-to-br from-[#fdfbff] to-[#efe7fb] text-[#201530] rounded-[12px] shadow-[0_24px_46px_rgba(0,0,0,0.45)] border border-white/6 animate-in zoom-in duration-500">
                <p className="mono text-[5.5px] text-[#201530]/45 tracking-widest mb-4">WISH DELIVERED</p>
                <strong className="block mt-[2px] mb-[14px] font-[Playfair_Display] font-italic text-[18px] md:text-24px leading-[1.3] tracking-tighter text-[#2b1c40]">
                  Your wish has been blown into the universe. ✨
                </strong>
                <div className="ticket-foot flex items-center justify-between gap-[10px] border-t border-[#201530]/18 pt-[12px]">
                  <span className="script font-[Playfair_Display] font-italic text-[13px] text-[#201530]/60">Delivered</span>
                  <span className="script font-[Playfair_Display] font-italic text-[13px] text-[#2b1c40]">Just now</span>
                </div>
              </div>
            )}
          </div>

          <div className="cake-hint flex items-center gap-2 text-[5.5px] text-white/30 tracking-widest text-center mt-[8px]">
            <span>Press and hold</span>
          </div>
          <div className="cake-note flex items-center justify-center gap-[10px] mt-[30px]">
            <Lily className="cake-lily w-[28px] text-lilac opacity-65" />
            <p className="mb-0 text-[13px] leading-[1.5] text-white/60">Sixteen candles. <em className="text-lilac font-[Playfair_Display] font-italic">One wish.</em></p>
          </div>
        </section>
      </NavShell>
    </div>
  );
}

function Lily({ className = "", width = 28, height = 28 }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8Z" />
      <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4Z" />
    </svg>
  );
}
