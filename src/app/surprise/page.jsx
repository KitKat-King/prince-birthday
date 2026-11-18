"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";
import { triggerConfetti } from "@/components/shell/ConfettiCanvas";

export default function SurprisePage() {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = document.getElementById("surprise-audio");
  }, []);

  const openGift = () => {
    if (opened) return;
    setOpened(true);
    triggerConfetti({ x: window.innerWidth / 2, y: window.innerHeight / 2, count: 300 });
    audioRef.current?.play().catch(() => {});
  };

  const replayAll = () => {
    setOpened(false);
    setTimeout(() => { window.location.href = "/pin/"; }, 900);
  };

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <section className="surprise relative min-h-screen py-[clamp(74px,12vw,150px)] pt-[clamp(74px,12vw,150px)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(203,183,255,0.15),transparent_60%)]" />
          <audio id="surprise-audio" loop preload="none">
            <source src="/audio/bg.mp3" type="audio/mpeg" />
          </audio>

          <div className="relative z-10 flex flex-col items-center max-w-[560px] w-full px-4 md:px-6">
            <h2 className="text-[32px] md:text-5xl font-[Anton] font-normal text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-400 drop-shadow-[0_0_30px_rgba(236,72,153,0.25)] mb-6 tracking-[0.02em]">
              One Last Thing…
            </h2>

            <div className="relative mb-[32px]">
              <button
                className="relative w-[44px] md:w-[52px] h-[44px] md:h-[52px] rounded-full border-[4px] border-white shadow-[0_0_15px_rgba(244,114,182,0.8)] flex items-center justify-center hover:scale-105 transition-transform duration-300 active:scale-95 group"
                onClick={openGift}
                disabled={opened}
              >
                <img src="/gifs/gift.gif" alt="Gift box" className="w-[40px] md:w-[48px] h-[40px] md:h-[48px] object-cover rounded-full" />
                {!opened && (
                  <div className="absolute -bottom-[2px] -right-[2px] w-[12px] h-[12px] bg-white/80 rounded-full border border-pink-500 flex items-center justify-center text-[7px] font-bold text-pink-600 animate-pulse">
                    🎁
                  </div>
                )}
              </button>
              {!opened && (
                <p className="mt-[6px] text-xl md:text-2xl font-semibold text-pink-200/90 drop-shadow animate-[float_5s_ease-in-out_infinite]">Tap the gift</p>
              )}
            </div>

            {opened && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 z-40 grid place-items-center bg-black/65 backdrop-blur-lg"
              >
                <motion.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10 max-w-[512px] rounded-[26px] p-[24px] text-center bg-gradient-to-br from-rose-950 via-purple-950 to-indigo-950 border border-pink-300/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                >
                  <img src="/gifs/surprise.gif" alt="surprise" className="mx-auto w-[44px] md:w-[52px] object-cover rounded-full mb-[8px]" />
                  <p className="surprise-lily text-[18px] md:text-2xl font-semibold text-pink-300 mt-[2px] drop-shadow-xl">Lots of love for you ❤️</p>
                  <p className="surprise-msg text-[18px] md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-purple-200 drop-shadow-xl mt-[5px]">
                    Once again, Happy Birthday! Hope you loved your surprise.
                  </p>
                  <div className="mt-[6px] flex justify-center">
                    <button
                      className="cta-btn inline-flex items-center gap-2 px-[40px] py-[16px] bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white font-semibold text-lg rounded-full shadow-[0_0_28px_rgba(244,114,182,0.35)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-95"
                      onClick={replayAll}
                    >
                      <ArrowRight size={20} strokeWidth={2} /> Replay
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>

          <p className="pin-foot fixed bottom-4 right-4 text-sm text-black/40 font-light tracking-widest">anujbuilds.in</p>
        </section>
      </NavShell>
    </div>
  );
}
