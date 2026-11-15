"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, SkipForward, Music } from "lucide-react"

const TRACKS = [
  { title: "Bairan", artist: "Prince's Birthday Anthem", duration: "3:42" },
  { title: "Tere Aasa Pass Din Sara", artist: "Prince's Birthday Anthem", duration: "4:08" },
]

export default function MusicPlayer() {
  const [activeTrack, setActiveTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [minimized, setMinimized] = useState(false)

  const track = TRACKS[activeTrack]

  const nextTrack = () => {
    setActiveTrack((prev) => (prev + 1) % TRACKS.length)
  }

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-40 flex justify-end pointer-events-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="backdrop-blur-xl bg-card/85 border border-primary/20 dark:border-white/10 shadow-xl rounded-full px-4 py-2 flex items-center gap-3 max-w-full"
      >
        {/* Equalizer animation */}
        <div className="flex items-center gap-0.5 h-4 w-4 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 bg-primary rounded-full"
              animate={
                isPlaying
                  ? { height: ["4px", "14px", "6px", "16px", "4px"] }
                  : { height: "4px" }
              }
              transition={{
                duration: 0.6 + i * 0.15,
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Track Info */}
        <div className="min-w-0 max-w-[140px] sm:max-w-[200px]">
          <p className="text-xs font-bold text-foreground truncate">{track.title}</p>
          <p className="text-[10px] text-foreground/60 truncate">{track.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 ml-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            className="p-1.5 rounded-full bg-primary text-white hover:opacity-90 active:scale-95 transition"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
          </button>
          <button
            onClick={nextTrack}
            aria-label="Next track"
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-foreground transition active:scale-95"
          >
            <SkipForward size={13} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
