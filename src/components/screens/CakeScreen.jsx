"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Flame, MoveRight, Crown } from "lucide-react"
import Button from "../Button"

const confettiColors = [
  "#f43f5e",
  "#fb7185",
  "#ffd166",
  "#a855f7",
  "#ffffff",
  "#38bdf8",
]

export default function CakeScreen({ onNext }) {
  const [lit, setLit] = useState(false)

  const lightCandle = () => {
    if (lit) return
    setLit(true)
    setTimeout(() => burst(), 400)
    setTimeout(() => burst(), 1200)
  }

  const burst = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: confettiColors,
      })
    } catch (e) {
      // safe fallback
    }
  }

  return (
    <div className="bg-[#fff8fc] dark:bg-zinc-900/95 p-7 rounded-[50px] sm:rounded-[60px] drop-shadow-2xl border border-rose-100 dark:border-white/10 min-w-48 w-full max-w-110 relative flex flex-col items-center gap-4 my-6 transition-colors">
      <motion.div
        className="relative z-10 left-0 w-full text-center text-3xl md:text-4xl font-extrabold text-secondary dark:text-rose-400 drop-shadow leading-tight px-4 will-change-transform"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={lit ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: lit ? 0.3 : 0 }}
      >
        <span className="inline-flex items-center gap-2">
          Happy Birthday, Prince! 👑
        </span>
      </motion.div>

      <div className="relative flex flex-col items-center gap-8 w-full">
        <div className="relative h-72 bg-gradient-to-b from-white/90 to-rose-200 dark:from-zinc-800 dark:to-zinc-900 w-full flex items-end justify-center rounded-[40px] shadow-inner pb-10 overflow-hidden">
          <Cake lit={lit} />
        </div>

        <AnimatePresence mode="wait">
          {!lit ? (
            <motion.div
              key="light"
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Button onClick={lightCandle} className="bg-[#ffccd3] dark:bg-rose-500/80 text-secondary dark:text-white font-bold">
                <Flame size={18} className="mb-0.5" />
                Light the Candle
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="next"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 1.5 } }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Button onClick={onNext} className="bg-[#ffccd3] dark:bg-rose-500/80 text-secondary dark:text-white font-bold">
                Next
                <MoveRight size={18} className="mt-0.5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Cake({ lit }) {
  return (
    <div className="flex flex-col items-center">
      <div className="cake">
        <div className="plate"></div>
        <div className="layer layer-bottom"></div>
        <div className="layer layer-middle"></div>
        <div className="layer layer-top"></div>
        <div className="icing"></div>
        <div className="drip drip1"></div>
        <div className="drip drip2"></div>
        <div className="drip drip3"></div>
        <div className="candle">
          {lit && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.2, y: 10 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              className="flame"
            />
          )}
        </div>
      </div>
    </div>
  )
}