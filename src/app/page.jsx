"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, CakeSlice, Crown, Disc3, Flower2, Gem, Heart, Music2, Pause, Play, Sparkles, Star } from "lucide-react";
import { Lily, Reveal, TiltCard } from "@/components/ui/motion-kit";

const particles = Array.from({ length: 26 }, (_, i) => i);
const memories = ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.jpg"];
const tracks = ["Bairan", "Tere Aasa Pass Din Sara"];

function launchCelebration() {
  const end = Date.now() + 1100;
  const timer = setInterval(() => {
    confetti({ particleCount: 18, startVelocity: 28, spread: 100, origin: { x: Math.random(), y: .65 }, colors: ["#d8c7ff", "#fff8e7", "#adffdd", "#ff86c8"] });
    if (Date.now() > end) clearInterval(timer);
  }, 130);
}

function Jukebox() {
  const [playing, setPlaying] = useState(false); const [track, setTrack] = useState(0);
  return <div className="jukebox"><div className={`record ${playing ? "record-on" : ""}`}><Disc3/><span>PRINCE<br/>CH.16</span></div><div className="track-meta"><p><b className={playing ? "signal" : ""}/>NOW IN THE AIR</p><h3>{tracks[track]}</h3><div className="equalizer">{particles.slice(0, 18).map(i => <i key={i} className={playing ? "equalize" : ""} style={{ height: `${8 + (i % 5) * 4}px`, animationDelay: `${i * .04}s` }}/>)}</div><button onClick={() => setTrack((track + 1) % tracks.length)}>change the vibe ↗</button></div><button className="player-button" onClick={() => setPlaying(!playing)} aria-label="Toggle visual music player">{playing ? <Pause fill="currentColor"/> : <Play fill="currentColor"/>}</button></div>;
}

export default function BirthdayPage() {
  const [open, setOpen] = useState(false); const [wish, setWish] = useState(false);
  return <main className="experience">
    <AnimatePresence>{!open && <motion.section className="vault" exit={{ opacity: 0, scale: 1.18, filter: "blur(20px)" }} transition={{ duration: .95, ease: [0.7, 0, .84, 0] }}><div className="vault-lines"/>{particles.map(i => <span className="vault-spark" key={i} style={{ "--x": `${(i * 31) % 100}%`, "--y": `${(i * 17) % 100}%`, "--d": `${i * .11}s` }}/>) }<motion.div className="unlock" initial={{ opacity: 0, scale: .68 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 1.5 }}><Crown/><p>PRIVATE BIRTHDAY TRANSMISSION</p><h1>PRINCE<span>16</span></h1><div className="seal"><i/> 18 · 11 · 2010 <i/></div><button onClick={() => setOpen(true)}>unlock your chapter <Sparkles size={16}/></button></motion.div></motion.section>}</AnimatePresence>

    <div className="floating-lilies">{Array.from({ length: 11 }, (_, i) => <Lily key={i} className={`drift lily-${i}`}/>)}</div>
    <section className="hero"><div className="hero-grid"/><div className="spotlight"/><motion.div className="hero-copy" initial={{ opacity: 0, y: 40 }} animate={{ opacity: open ? 1 : 0, y: open ? 0 : 40 }} transition={{ delay: .45, duration: 1, ease: [0.16, 1, .3, 1] }}><p className="eyebrow"><Sparkles size={13}/> THE BIRTHDAY EDITION</p><h2>it&apos;s<br/><em>your era.</em></h2><p>One more orbit around the sun. A whole new level of being unforgettable.</p><div className="level-chip"><CakeSlice size={15}/> CHAPTER SIXTEEN UNLOCKED</div></motion.div><div className="scroll-cue">SCROLL TO ENTER <ArrowDown size={16}/></div></section>
    <div className="ticker"><div>PRINCE&apos;S DAY <b>✦</b> STAY LEGENDARY <b>✦</b> PRINCE&apos;S DAY <b>✦</b> STAY LEGENDARY <b>✦</b></div></div>

    <section className="chapter dossier"><Reveal><p className="eyebrow"><Crown size={13}/> THE ROYAL DOSSIER</p><h2 className="chapter-title">main character<br/><em>energy.</em></h2></Reveal><div className="dossier-grid"><Reveal delay={.06}><TiltCard className="identity-card"><span className="micro">SUBJECT_001</span><div className="mini-orbit"/><h3>PRINCE</h3><p>Made for bright entrances, good stories, and the kind of energy people remember.</p><div className="date-stat"><b>18</b><span>NOVEMBER<br/>2010</span></div><Gem/></TiltCard></Reveal><Reveal delay={.14}><TiltCard className="lily-card"><Lily className="hero-lily"/><span className="micro">SIGNATURE SYMBOL</span><h3>Lily<br/>coded.</h3><p>Soft power. Rare energy. Impossible to ignore.</p></TiltCard></Reveal></div></section>

    <section className="chapter music-zone"><Reveal><div className="heading-row"><div><p className="eyebrow"><Music2 size={13}/> THE SOUNDTRACK</p><h2 className="chapter-title">press<br/><em>play.</em></h2></div><span className="track-count">02 ANTHEMS</span></div></Reveal><Reveal delay={.1}><Jukebox/></Reveal><Reveal delay={.12}><div className="lyric-film"><div className="film-visual"><img src="/images/cover.webp" alt="Prince birthday memory"/><span className="film-shade"/></div><div><span className="micro">A MOMENT IN MOTION</span><h3>Every beat gets<br/>its own <em>scene.</em></h3><p>A cinematic layer of soft-focus memories, glowing typography and lily line-art—made to move like a lyric video, without borrowing lyrics.</p></div></div></Reveal></section>

    <section className="chapter memories"><Reveal><p className="eyebrow"><Heart size={13}/> THE MEMORY REEL</p><h2 className="chapter-title">frames from<br/><em>the good stuff.</em></h2></Reveal><div className="memory-stack">{memories.map((src, i) => <Reveal key={src} delay={i * .07} className={`memory m${i}`}><TiltCard><div className="photo-wrap"><img src={src} alt={`Memory ${i + 1} with Prince`}/><span>{String(i + 1).padStart(2, "0")}</span></div></TiltCard></Reveal>)}</div><Reveal><p className="memory-note">Some days are only lived once.<br/>The best ones become part of you forever.</p></Reveal></section>

    <section className="chapter milestones"><Reveal><p className="eyebrow"><Star size={13}/> A VERY GOOD YEAR</p><h2 className="chapter-title">sixteen looks<br/><em>iconic on you.</em></h2></Reveal><div className="milestone-list">{[["01", "More laughter", "The loud, breathless, can’t-stop kind."], ["02", "Bigger dreams", "Every wild idea deserves a real shot."], ["03", "Your people", "The ones who will always cheer for you."]].map(([num, title, text], i) => <Reveal delay={i * .08} key={num}><article><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div><Sparkles/></article></Reveal>)}</div></section>

    <section className="final-chapter"><div className="final-aura"/><Reveal><p className="eyebrow">FROM YOUR BEST FRIEND</p><h2>stay<br/><em>legendary.</em></h2><p>May this year be louder, brighter and more you than every year before it. Here&apos;s to your next big adventure, Prince.</p><button className="wish-button" onClick={() => { setWish(true); launchCelebration(); }}>{wish ? "wish sent ✦" : "make a birthday wish"}</button>{wish && <motion.div className="wish-stars" initial={{ opacity: 0, scale: .5 }} animate={{ opacity: 1, scale: 1 }}>✦ ✦ ✦</motion.div>}<small>PRINCE / 18 NOVEMBER / CHAPTER 16</small></Reveal></section>
  </main>;
}
