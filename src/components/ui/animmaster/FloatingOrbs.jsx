"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FloatingOrbs({ className }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden z-0",
        className
      )}
    >
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-pink-500/25 to-purple-600/25 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -50, 0],
          scale: [1, 0.85, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-indigo-500/20 to-rose-500/20 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 40, -60, 0],
          y: [0, -30, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-gradient-to-r from-amber-400/15 to-violet-500/15 blur-3xl"
      />
    </div>
  );
}
