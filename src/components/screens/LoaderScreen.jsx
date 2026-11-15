"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"

export default function LoaderScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone?.()
    }, 2800)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center will-change-transform text-center px-4"
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 6, -6, 0],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl md:text-7xl will-change-transform filter drop-shadow-lg"
      >
        🎂
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
        className="my-4 text-xl md:text-2xl font-bold text-foreground"
      >
        Loading Prince’s birthday surprise...
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-foreground/60"
      >
        <span>18</span>
        <span>·</span>
        <span>11</span>
        <span>·</span>
        <span>2010</span>
      </motion.div>
    </motion.div>
  )
}
