"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function Reveal({ children, delay = 0, className = "" }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 38, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}

export function TiltCard({ children, className = "" }) {
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-.5, .5], [10, -10]), { stiffness: 240, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-.5, .5], [-10, 10]), { stiffness: 240, damping: 20 });
  function move(e) { const box = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - box.left) / box.width - .5); my.set((e.clientY - box.top) / box.height - .5); }
  function leave() { mx.set(0); my.set(0); }
  return <motion.div className={`tilt-card ${className}`} style={{ rotateX, rotateY }} onPointerMove={move} onPointerLeave={leave}>{children}</motion.div>;
}

export function Lily({ className = "" }) {
  return <span className={`lily ${className}`} aria-hidden="true"><i/><i/><i/><i/><i/><b/></span>;
}
