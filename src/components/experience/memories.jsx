"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ImageIcon, RotateCcw, Scissors, Sparkles } from "lucide-react";
import { Lily, Reveal, SectionHead } from "@/components/ui/motion-kit";
import { sfx, vibrate } from "@/lib/sfx";
import { EASE } from "@/lib/motion";

const MEMORIES = [
  { src: "/images/1.jpg", label: "the entrance", note: "Arrived and changed the temperature of the room.", time: "00:01:16:04" },
  { src: "/images/2.jpg", label: "the chaos", note: "The kind of laugh that becomes a story forever.", time: "00:04:16:08" },
  { src: "/images/3.jpg", label: "the calm", note: "Somehow the loudest person and the safest place.", time: "00:07:11:02" },
  { src: "/images/4.jpg", label: "the era", note: "Chapter sixteen looks ridiculously good on you.", time: "00:16:18:10" },
];

const STRIP = [
  { src: "/images/1.jpg", label: "entrance", time: "00:01" },
  { src: "/images/2.jpg", label: "chaos", time: "00:04" },
  { src: "/gifs/intro.gif", label: "opening scene", time: "00:08" },
  { src: "/images/3.jpg", label: "calm", time: "00:11" },
  { src: "/gifs/surprise.gif", label: "plot twist", time: "00:14" },
  { src: "/images/4.jpg", label: "the era", time: "00:16" },
];

function PolaroidStack() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(null);

  function dismiss(direction) {
    if (leaving) return;
    setLeaving(direction);
    vibrate(8);
    setTimeout(() => {
      setIndex((value) => Math.min(MEMORIES.length, value + 1));
      setLeaving(null);
    }, 320);
  }

  const finished = index >= MEMORIES.length;

  return (
    <div className="stack-zone">
      <div className="stack">
        {MEMORIES.map((memory, i) => {
          if (i < index) return null;
          const isTop = i === index;
          const depth = i - index;
          return (
            <motion.div
              key={memory.src}
              className={`polaroid ${isTop ? "is-top" : ""}`}
              style={{ zIndex: MEMORIES.length - i }}
              initial={false}
              animate={
                isTop && leaving
                  ? { x: leaving * 520, rotate: leaving * 26, opacity: 0 }
                  : { x: depth * 8, y: depth * 10, rotate: depth === 0 ? 0 : (i % 2 ? 4 : -3) * depth, opacity: 1 }
              }
              transition={{ duration: 0.32, ease: EASE.out }}
              drag={isTop && !leaving ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={(event, info) => {
                if (info.offset.x > 90 || info.velocity.x > 550) dismiss(1);
                if (info.offset.x < -90 || info.velocity.x < -550) dismiss(-1);
              }}
              whileDrag={{ cursor: "grabbing", scale: 1.02 }}
            >
              <div className="polaroid-photo">
                <img src={memory.src} alt={`Memory: ${memory.label}`} draggable="false" loading="lazy" />
                <span className="develop" aria-hidden="true" />
                <span className="polaroid-time mono">{memory.time}</span>
              </div>
              <div className="polaroid-foot">
                <span className="script">{memory.label}</span>
                {isTop && <span className="mono drag-hint">DRAG TO FLICK</span>}
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {finished && (
            <motion.div
              className="stack-finished"
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <span className="mono">ROLL 01</span>
              <strong>DEVELOPED.</strong>
              <p>All four frames are part of the era now.</p>
              <button
                type="button"
                className="mini-action mono"
                onClick={() => {
                  setIndex(0);
                  sfx.shutter();
                }}
              >
                <RotateCcw size={12} /> REWIND THE STACK
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="stack-meta">
        <span className="mono">
          FRAME {String(Math.min(index + 1, MEMORIES.length)).padStart(2, "0")} / {String(MEMORIES.length).padStart(2, "0")}
        </span>
        <p>{finished ? "Roll complete." : MEMORIES[Math.min(index, MEMORIES.length - 1)].note}</p>
        <div className="stack-dots" aria-hidden="true">
          {MEMORIES.map((memory, i) => (
            <i key={memory.src} className={i <= index ? "on" : ""} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScratchCard() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const strokes = useRef(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#e6e3ef");
    gradient.addColorStop(0.35, "#b9b3ca");
    gradient.addColorStop(0.55, "#f3f0fa");
    gradient.addColorStop(1, "#a69fbe");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 900; i += 1) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.16})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.4, 1.4);
    }

    ctx.strokeStyle = "rgba(80,64,110,.35)";
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    ctx.fillStyle = "#4a3f63";
    ctx.textAlign = "center";
    ctx.font = "600 13px ui-monospace, monospace";
    ctx.fillText("SCRATCH TO UNLOCK", width / 2, height / 2 - 8);
    ctx.font = "500 10px ui-monospace, monospace";
    ctx.fillText("PRINCE · CH.16", width / 2, height / 2 + 14);
    ctx.font = "500 9px ui-monospace, monospace";
    ctx.fillStyle = "rgba(74,63,99,.6)";
    ctx.fillText("USE A FINGER, NOT A FORK", width / 2, height / 2 + 36);
  }, []);

  function scratch(event) {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    strokes.current += 1;
    if (strokes.current > 34) {
      setRevealed(true);
      sfx.sparkle();
      vibrate([10, 30, 10]);
    }
  }

  return (
    <div className="scratch-shell">
      <div className="scratch-stage">
        <img src="/gifs/gift.gif" alt="A birthday gift animation" loading="lazy" />
        <span className="scratch-glow" aria-hidden="true" />
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className={`scratch-canvas ${revealed ? "revealed" : ""}`}
          onPointerDown={(event) => {
            drawing.current = true;
            event.currentTarget.setPointerCapture?.(event.pointerId);
            scratch(event);
          }}
          onPointerMove={(event) => {
            if (drawing.current) scratch(event);
          }}
          onPointerUp={() => {
            drawing.current = false;
          }}
          onPointerCancel={() => {
            drawing.current = false;
          }}
          aria-label="Scratch card to reveal a birthday message"
        />
      </div>
      <div className="scratch-copy">
        <span className="mono"><Scissors size={11} /> SEALED SCENE · 03</span>
        <h3>Scratch the silver. <em>Keep what&apos;s under it.</em></h3>
        <p>One small gift, one big feeling: this year is going to be ridiculous in the best way.</p>
        <button
          type="button"
          className="mini-action mono"
          onClick={() => {
            setRevealed(true);
            sfx.sparkle();
          }}
        >
          <Sparkles size={12} /> TAP TO REVEAL
        </button>
      </div>
    </div>
  );
}

export default function Memories() {
  return (
    <section className="memories" id="memories">
      <div className="memories-aura" aria-hidden="true" />
      <div className="wrap">
        <SectionHead
          light
          scene="SC.04"
          eyebrow="THE MEMORY REEL · ROLL 01"
          title="frames from"
          accent="the good stuff."
          copy="Four photos, three moving moments, one roll of film. Drag, scratch, scroll — this chapter is yours to develop."
        />

        <div className="memories-grid">
          <Reveal>
            <PolaroidStack />
          </Reveal>

          <Reveal delay={0.1}>
            <ScratchCard />
          </Reveal>
        </div>

        <Reveal>
          <div className="strip-head">
            <span className="mono"><ImageIcon size={12} /> CONTACT SHEET · 6 FRAMES</span>
            <span className="mono">DRAG / SCROLL →</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="filmstrip-wrap">
            <div className="filmstrip" role="list" aria-label="Photo film strip">
              <span className="sprockets top" aria-hidden="true" />
              {STRIP.map((frame) => (
                <figure className="frame" key={frame.src + frame.label} role="listitem">
                  <div className="frame-img">
                    <img src={frame.src} alt={frame.label} loading="lazy" />
                    <span className="frame-leak" aria-hidden="true" />
                  </div>
                  <figcaption className="mono">
                    <span>{frame.time}</span>
                    <span>{frame.label}</span>
                  </figcaption>
                </figure>
              ))}
              <span className="sprockets bottom" aria-hidden="true" />
            </div>
          </div>
        </Reveal>

        <div className="projector-row">
          <Reveal>
            <article className="projector p-intro">
              <div className="projector-gate">
                <img src="/gifs/intro.gif" alt="Intro animation" loading="lazy" />
                <span className="gate-leak" aria-hidden="true" />
                <span className="gate-reel mono">REC ● 00:00</span>
              </div>
              <div className="projector-meta">
                <span className="mono">SCENE 01 · THE OPENING</span>
                <h3>Every era starts with a little chaos.</h3>
                <p>This one started the second you walked in.</p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="projector p-surprise">
              <div className="projector-gate">
                <img src="/gifs/surprise.gif" alt="Surprise reaction animation" loading="lazy" />
                <span className="gate-leak alt" aria-hidden="true" />
                <span className="gate-reel mono">REC ● 00:14</span>
              </div>
              <div className="projector-meta">
                <span className="mono">SCENE 05 · THE PLOT TWIST</span>
                <h3>Nobody saw the plot twist coming.</h3>
                <p>That&apos;s the thing about your era — it keeps getting better.</p>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="memory-note">
            <Lily className="note-lily" />
            <p>Some days are only lived once.<br /><em>The best ones move in.</em></p>
            <span className="mono"><Heart size={11} /> ROLL 01 · PRINCE / CH.16</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
