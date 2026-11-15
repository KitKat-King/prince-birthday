"use client"

import { motion } from "framer-motion"
import { Gift, Sparkles } from "lucide-react"
import Button from "../Button"

export default function IntroScreen({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="bg-[#fff8fc] dark:bg-zinc-900/95 p-7 rounded-[50px] sm:rounded-[60px] drop-shadow-2xl border border-pink-100 dark:border-white/10 min-w-48 w-full max-w-110 relative flex flex-col items-center gap-4 transition-colors"
    >
      <div className="relative h-44 md:h-52 bg-gradient-to-b from-white/90 to-pink-200 dark:from-zinc-800 dark:to-zinc-900 w-full rounded-[40px] flex items-end justify-center shadow-inner overflow-hidden">
        <img
          loading="lazy"
          src="/gifs/intro.gif"
          alt="Cute Intro GIF"
          className="w-26 md:w-32 mb-2"
        />
      </div>

      <div className="text-center px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles size={13} />
          18 Nov 2010
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold text-primary drop-shadow leading-tight will-change-transform"
          style={{
            filter: "drop-shadow(0 0 16px rgba(255,105,180,0.35))",
          }}
        >
          A Legend Was Born Today!
        </h1>
        <p className="mt-3 text-foreground font-medium will-change-transform text-sm md:text-base leading-relaxed">
          Happy Birthday, <span className="font-bold text-primary dark:text-white">Prince</span>! 👑 Sixteen years of greatness. A special surprise is ready for you...
        </p>
      </div>

      <div className="mt-2">
        <Button
          onClick={() => {
            onNext?.()
          }}
          className="bg-[#f1caeb] dark:bg-primary/80 text-primary dark:text-white font-bold"
        >
          <Gift size={20} />
          Start the surprise
        </Button>
      </div>
    </motion.div>
  )
}
