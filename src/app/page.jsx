"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun, RotateCcw } from "lucide-react"
import LoaderScreen from "@/components/screens/LoaderScreen"
import IntroScreen from "@/components/screens/IntroScreen"
import CakeScreen from "@/components/screens/CakeScreen"
import PhotosScreen from "@/components/screens/PhotosScreen"
import MessageScreen from "@/components/screens/MessageScreen"
import FloatingLilies from "@/components/FloatingLilies"
import MusicPlayer from "@/components/MusicPlayer"

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const screens = [
    <LoaderScreen key="loader" onDone={() => setCurrentScreen(1)} />,
    <IntroScreen key="intro" onNext={() => setCurrentScreen(2)} />,
    <CakeScreen key="cake" onNext={() => setCurrentScreen(3)} />,
    <PhotosScreen key="photos" onNext={() => setCurrentScreen(4)} />,
    <MessageScreen key="message" />,
  ]

  return (
    <main className="min-h-screen overflow-hidden relative bg-background text-foreground transition-colors duration-300">
      {/* Background Floating Lilies */}
      <FloatingLilies />

      {/* Floating Music Player */}
      <MusicPlayer />

      {/* Theme Toggle Button */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-full backdrop-blur-xl bg-card/80 border border-primary/20 dark:border-white/10 text-foreground hover:scale-105 active:scale-95 shadow-lg transition"
        >
          {theme === "dark" ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-indigo-600" />
          )}
        </button>
      </div>

      {/* Main Interactive Screen Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center w-full"
          >
            {screens[currentScreen]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots & Restart (visible after loader) */}
      {currentScreen > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-card/75 border border-primary/15 dark:border-white/10 shadow-lg">
          {screens.slice(1).map((_, i) => {
            const stepIndex = i + 1
            return (
              <button
                key={stepIndex}
                onClick={() => setCurrentScreen(stepIndex)}
                aria-label={`Go to step ${stepIndex}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentScreen === stepIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-foreground/30 hover:bg-foreground/50"
                }`}
              />
            )
          })}
          {currentScreen > 1 && (
            <button
              onClick={() => setCurrentScreen(1)}
              title="Restart from Intro"
              className="ml-2 p-1 text-foreground/60 hover:text-foreground active:scale-90 transition"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      )}

      {/* Watermark tribute for Prince */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="fixed bottom-4 right-4 text-[11px] sm:text-xs text-foreground/40 pointer-events-none z-30 font-medium tracking-wide"
      >
        Prince · 18.11.2010 👑
      </motion.div>
    </main>
  )
}
