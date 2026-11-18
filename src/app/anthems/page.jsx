"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import NavShell from "@/components/shell/NavShell";
import ConfettiCanvas from "@/components/shell/ConfettiCanvas";

const TRACKS = [
  { title: "Bairan", artist: "Original Mood Line", mood: "wistful" },
  { title: "Tere Aasa Pass Din Sara", artist: "Original Mood Line", mood: "warm" },
];

export default function AnthemsPage() {
  const [side, setSide] = useState("A");
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const audioRef = useRef(null);
  const [eq, setEq] = useState(0);

  useEffect(() => {
    audioRef.current = document.getElementById("anthem-audio");
    if (!playing || !audioRef.current) return;
    const raf = requestAnimationFrame(function loop() {
      setEq(0.3 + Math.random() * 0.7);
      requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const togglePlay = () => {
    setPlaying((p) => {
      if (!p && audioRef.current) audioRef.current.play().catch(() => {});
      if (p && audioRef.current) audioRef.current.pause();
      return !p;
    });
  };

  const track = TRACKS[trackIdx];

  return (
    <div className="page-wrap">
      <ConfettiCanvas />
      <NavShell>
        <section className="music relative min-h-screen py-[clamp(74px,12vw,150px)] pt-[clamp(74px,12vw,150px)]">
          <audio id="anthem-audio" src="/audio/bg.mp3" loop preload="none" />
          <div className="music-aura absolute left-[-22%] top-[22%] w-[56vmax] h-[56vmax] rounded-full bg-[radial-gradient(circle,_rgba(165,242,211,0.1),transparent_64%)] blur-[50px]" />
          <div className="music-stage grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-[clamp(16px,3vw,26px)] items-start w-full max-w-[1180px] mx-auto px-4 md:px-6">
            <div className="cassette-zone flex flex-col gap-[14px] order-1">
              <div className="side-tabs flex flex-col gap-[6px]">
                {["A", "B"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSide(s)}
                    className={`side-tab flex items-center justify-between gap-[10px] px-[10px] py-[12px] border border-white/10 rounded-[8px] bg-white/5 text-left transition ${side === s ? "bg-white/10 border-white/42" : ""}`}
                  >
                    <div className="flex flex-col">
                      <span className="mono text-[6px] text-white/40 tracking-widest">SIDE {s}</span>
                      <b className="text-[11px] font-medium text-white/60">{side === s ? "Now Playing" : "Standby"}</b>
                    </div>
                    <span className={`mono text-[6px] ${side === s ? "text-lilac" : "text-white/40"} tracking-widest`}>{s}</span>
                  </button>
                ))}
              </div>
              <div className="cassette-shell relative">
                <div className={`cassette relative rounded-[14px] p-[14px] bg-gradient-to-b from-[#2a2338] via-[#15111f] to-[#0d0a13] border border-white/14 shadow-[0_24px_50px_rgba(0,0,0,0.55)] ${side === "A" ? "" : "opacity-50"}`}>
                  <div className="cassette-top flex justify-between gap-2">
                    <span className="mono text-[5.5px] text-white/40 tracking-widest">SIDE {side}</span>
                    <span className={`mono text-[5.5px] ${side === "A" && playing ? "text-pink-400" : "text-white/40"} ${playing ? "animate-pulse" : ""}`}>{side === "A" ? "▶ PLAYING" : "⏹ STOPPED"}</span>
                  </div>
                  <div className="cassette-window relative mt-[14px] h-[74px] rounded-[8px] bg-gradient-to-b from-[#0a0810] to-[#161020] border border-white/10 flex items-center justify-center px-[22px] overflow-hidden">
                    <div className={`reel relative w-[46px] h-[46px] rounded-full bg-[radial-gradient(circle,_#2c2440_0_24%,#0e0b16_25%_100%)] border border-white/28 block ${playing ? "animate-[spin_3.2s_linear_infinite]" : ""}`} />
                    <div className="tape-line flex-1 h-[2px] mx-[8px] bg-gradient-to-r from-white/50 via-pink-400_50% opacity-60" />
                    <div className={`reel relative w-[46px] h-[46px] rounded-full bg-[radial-gradient(circle,_#2c2440_0_24%,#0e0b16_25%_100%)] border border-white/28 block ${playing ? "animate-[spin_3.2s_linear_infinite_reverse]" : ""}`} />
                  </div>
                  <div className="cassette-label border border-white/14 rounded-[6px] px-[10px] py-[10px] bg-white/10 text-[#1a1428] flex flex-col gap-[3px] mt-[10px]">
                    <span className="mono text-[5.5px] text-[#1a1428]/55 tracking-widest">NOW PLAYING</span>
                    <strong className="font-[Playfair_Display] font-italic text-[16px] leading-[1.1]">{track.title}</strong>
                    <span className="cassette-mood text-[5.5px] text-[#1a1428]/50">{track.mood}</span>
                  </div>
                  <div className="cassette-dots flex gap-[4px] mt-[10px]">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-[4px] h-[4px] rounded-full bg-white/28" />
                    ))}
                  </div>
                  <p className="cassette-note mt-[2px] text-[5.5px] text-white/40 tracking-widest text-center">Original mood lines only</p>
                </div>
              </div>
            </div>
            <div className="player relative rounded-[22px] p-[22px] grid grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] gap-[20px] items-center overflow-hidden bg-gradient-to-br from-[#1e1929] to-[#0d0b13] border border-white/13 shadow-[0_34px_70px_rgba(0,0,0,0.55)] order-2">
              <div className="player-gloss absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,_rgba(203,183,255,0.2),transparent_42%)]" />
              <div className="player-vinyl-zone relative aspect-[1] grid place-items-center">
                <div className={`vinyl relative w-full max-w-[210px] aspect-[1] rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_20px_44px_rgba(0,0,0,0.6)] border border-white/8 ${playing ? "animate-[spin_5.5s_linear_infinite]" : ""}`}>
                  <div className="vinyl-groove g1 absolute inset-[14%] rounded-full border border-white/7" />
                  <div className="vinyl-groove g2 absolute inset-[24%] rounded-full border border-white/14" />
                  <div className="vinyl-groove g3 absolute inset-[34%] rounded-full border border-white/5" />
                  <div className="vinyl-label absolute inset-[34%] rounded-full flex flex-col items-center justify-center gap-[1px] bg-[radial-gradient(circle_at_36%_28%,_#d9c8f6,#a98ee0_68%)] text-[#1b1230] shadow-[0_0_0_1px_rgba(255,255,255,0.2)]">
                    <b className="text-[10px] font-black tracking-widest">{track.title.slice(0, 1)}</b>
                    <em className="text-[5px] tracking-widest">{track.artist}</em>
                  </div>
                  <div className={`tonearm absolute top-[4%] right-[2%] w-[3px] h-[44%] bg-gradient-to-b from-white/85 to-white/25 rounded-[99px] origin-top rotate-[-24deg] transition-transform duration-700 cubic-bezier(0.34,1.4,0.64,1) shadow-[0_0_10px_rgba(255,255,255,0.22)] ${playing ? "rotate-[-6deg]" : ""}`}>
                    <div className="absolute bottom-[-5px] left-[-3px] w-[9px] h-[9px] rounded-[2px] bg-lilac" />
                  </div>
                </div>
              </div>
              <div className="player-main relative z-10 flex flex-col">
                <div className="player-live flex items-center gap-[6px] text-[5.5px] tracking-widest text-white/40">
                  <div className={`signal w-[5px] h-[5px] rounded-full bg-white/30 ${playing ? "bg-mint shadow-[0_0_8px_var(--tw-shadow-color)] animate-[pulseDot_1.4s_infinite]" : ""}`} />
                  <span>NOW PLAYING</span>
                </div>
                <h2 className="player-title mt-[8px] mb-[2px] font-[Anton] text-[26px] md:text-[40px] leading-[0.9] text-white">{track.title}</h2>
                <p className="player-sub mb-[14px] text-[6px] text-lilac tracking-widest">{track.artist}</p>
                <div className="equalizer flex items-end gap-[3px] h-[26px] mb-[16px]">
                  {[1,2,3,4,5,6,7,8].map((i) => (
                    <div key={i} className={`w-[2.5px] rounded-[99px] bg-white/16 transition-bg duration-300 ${playing ? "bg-gradient-to-t from-mint via-lilac animate-[eqBounce_0.9s_ease-in-out_infinite_alternate] style-[animation-delay:${i * 0.1}s]" : ""}`} />
                  ))}
                </div>
                <div className="player-progress relative h-[3px] rounded-full bg-white/12 cursor-pointer">
                  <div className="player-progress-fill absolute inset-0 auto 0 0 rounded-full bg-gradient-to-r from-lilac via-pink shadow-[0_0_10px_rgba(203,183,255,0.7)] w-[45%]" />
                  <div className="player-progress-knob absolute top-[50%] w-[8px] h-[8px] rounded-full bg-white shadow-[0_0_0_3px_rgba(203,183,255,0.3)] -translate-x-[50%] -translate-y-[50%] left-[45%]" />
                </div>
                <div className="player-controls flex items-center gap-[10px] mt-[16px]">
                  <button className="play-btn w-[46px] h-[46px] rounded-full bg-white text-[#14101c] grid place-items-center shadow-[0_8px_22px_rgba(0,0,0,0.4)] transition hover:scale-[1.06] hover:bg-lilac" onClick={togglePlay}>
                    {playing ? <Pause size={20} strokeWidth={2.5} /> : <Play size={20} strokeWidth={2.5} />}
                  </button>
                  <button className="side-btn flex items-center gap-[5px] border border-white/10 rounded-full px-[9px] py-[11px] text-[6px] tracking-widest text-white/40 hover:text-white hover:border-white/26 transition">
                    <SkipBack size={14} strokeWidth={2} /> <span className="text-[6px]">REPEAT</span>
                  </button>
                  <button className="side-btn flex items-center gap-[5px] border border-white/10 rounded-full px-[9px] py-[11px] text-[6px] tracking-widest text-white/40 hover:text-white hover:border-white/26 transition">
                    <SkipForward size={14} strokeWidth={2} /> <span className="text-[6px]">SIDE {side === "A" ? "B" : "A"}</span>
                  </button>
                  <span className="ml-auto player-time text-[7px] text-white/40">3:42 / 4:18</span>
                </div>
                <div className="player-island-hint absolute left-[22px] bottom-[8px] flex items-center gap-[4px] text-[5px] text-white/24 tracking-widest">
                  <Mic size={10} strokeWidth={2} /> LISTEN ON DEVICE
                </div>
              </div>
            </div>
          </div>
          <div className="music-footnote grid grid-cols-[auto_1fr_auto] gap-[14px] items-center mt-[26px] pt-[16px] border-t border-white/10 w-full max-w-[1180px] mx-auto px-4 md:px-6">
            <div className="mono flex items-center gap-[4px] text-[5.5px] text-white/40 tracking-widest"><span>🎵</span> NO BORROWED LYRICS</div>
            <p className="text-[10.5px] leading-[1.6] text-white/42 text-center">Original mood lines only — no borrowed lyrics or audio. Pure feeling.</p>
            <div className="mono flex items-center justify-end gap-[4px] text-[5.5px] text-white/40 tracking-widest">CHAPTER 03 · ANTHEMS</div>
          </div>
        </section>
      </NavShell>
    </div>
  );
}
