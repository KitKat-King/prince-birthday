"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, MailOpen, Crown } from "lucide-react"

export default function MessageScreen() {
  const [opened, setOpened] = useState(false)

  return (
    <div className="bg-[#fff8fc] dark:bg-zinc-900/95 p-7 rounded-[50px] sm:rounded-[60px] drop-shadow-2xl border border-pink-100 dark:border-white/10 min-w-48 w-full max-w-110 relative flex flex-col items-center gap-4 my-6 transition-colors">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-1.5">
          <Crown size={13} />
          From The Heart
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          A Special Letter For Prince
        </h2>
        <p className="text-primary/70 dark:text-rose-300 text-xs md:text-sm font-semibold mt-1">
          {opened ? "✨ Scroll to read your message" : "💌 Tap envelope to open"}
        </p>
      </div>

      <div
        onClick={() => setOpened(!opened)}
        className="card relative h-72 sm:h-80 w-full rounded-[40px] overflow-hidden shadow-inner cursor-pointer transition-all bg-gradient-to-b from-white/90 to-pink-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center max-w-76 border border-pink-100 dark:border-white/10"
      >
        <div
          className={`cover ${
            opened ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
          } absolute inset-0 z-10 transition-all duration-700 ease-out bg-[#ffedea] dark:bg-zinc-800 flex flex-col items-center justify-center p-6`}
        >
          <MailOpen className="w-12 h-12 text-primary animate-bounce mb-2" />
          <p className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider">
            Tap To Open
          </p>
          <span className="text-[11px] text-foreground/60 mt-1 font-medium">
            For Prince · 18 Nov 2010
          </span>
        </div>

        <div className="relative px-6 py-4 h-60 overflow-y-auto text-foreground text-sm leading-relaxed space-y-3 font-medium">
          <p className="font-bold text-primary dark:text-rose-400 text-base">
            Happy 16th Birthday, Prince! 👑
          </p>
          <p>
            On <span className="font-semibold text-primary dark:text-white">18 November 2010</span>, the world gained someone truly legendary. You carry a rare confidence, steadfast loyalty, and a positive energy that elevates everyone around you. You make ordinary moments feel extraordinary.
          </p>
          <p>
            May this milestone year bring you fearless opportunities, wild success, unstoppable health, and memories that stay timeless forever. Keep staying true to who you are, keep dreaming big, and keep conquering like the king you are.
          </p>
          <p className="font-semibold text-primary dark:text-rose-300 pt-2 flex items-center gap-1.5">
            <span>Stay legendary forever. Happy Birthday!</span>
            <Heart size={14} className="fill-current text-rose-500" />
            <Sparkles size={14} className="text-amber-500" />
          </p>
        </div>
      </div>
    </div>
  )
}
