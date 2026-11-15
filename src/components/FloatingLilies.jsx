"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

function LilySvg({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lilyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
        </linearGradient>
      </defs>
      <path
        d="M32 58c-8-9-13-18-13-27 0-11 6-21 13-27 7 6 13 16 13 27 0 9-5 18-13 27z"
        fill="url(#lilyGrad)"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M32 6v52" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

export default function FloatingLilies() {
  const lilies = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${(i * 7 + (i % 3) * 5) % 94}%`,
        top: `${(i * 12 + (i % 4) * 8) % 92}%`,
        size: 20 + ((i * 6) % 30),
        delay: (i % 6) * 0.7,
        duration: 8 + (i % 5) * 1.8,
        opacity: 0.12 + ((i % 4) * 0.05),
      })),
    []
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {lilies.map((lily) => (
        <motion.div
          key={lily.id}
          className="absolute text-primary/40 dark:text-white/20"
          style={{
            left: lily.left,
            top: lily.top,
            width: lily.size,
            height: lily.size,
            opacity: lily.opacity,
          }}
          initial={{ y: 20, rotate: -10 }}
          animate={{
            y: [-18, 18, -18],
            x: [-8, 8, -8],
            rotate: [-12, 12, -12],
          }}
          transition={{
            duration: lily.duration,
            delay: lily.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <LilySvg className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  )
}
