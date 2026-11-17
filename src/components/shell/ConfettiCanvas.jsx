"use client";

import { useEffect, useRef } from "react";

export default function ConfettiCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(0);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5;
        p.alpha -= 0.015;
        p.size *= 0.96;
        if (p.alpha > 0 && p.size > 0.5) alive = true;
        else particlesRef.current.splice(i, 1);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame++;
      if (alive && frame < 700) animRef.current = requestAnimationFrame(animate);
      else {
        cancelAnimationFrame(animRef.current);
        animRef.current = 0;
      }
    }

    window.addEventListener("prince-confetti", (e) => {
      const { x = window.innerWidth / 2, y = window.innerHeight / 2, count = 200, colors } = e.detail || {};
      const palette = colors || ["#FF3CAC", "#F687B3", "#D8B4FE", "#C084FC", "#F472B6"];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 0.5) * 18 - 4,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: Math.random() * 7 + 4,
          alpha: 1,
        });
      }
      if (!animRef.current) animate();
    });

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-20 pointer-events-none" />;
}

export function triggerConfetti({ x, y, count = 200, colors } = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("prince-confetti", {
      detail: { x, y, count, colors },
    })
  );
}
