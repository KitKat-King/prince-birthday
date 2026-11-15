"use client"

import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-fade"
import { Mail, Camera } from "lucide-react"
import Button from "../Button"

const photos = [
  { src: "/images/1.jpg", caption: "The Boss Vibes 👑" },
  { src: "/images/2.jpg", caption: "Timeless Moments ✨" },
  { src: "/images/3.jpg", caption: "Pure Golden Energy 🌟" },
  { src: "/images/4.jpg", caption: "Making Memories Together 🖤" },
]

export default function PhotosScreen({ onNext }) {
  return (
    <div className="bg-[#fff8fc] dark:bg-zinc-900/95 p-7 rounded-[50px] sm:rounded-[60px] drop-shadow-2xl border border-violet-100 dark:border-white/10 min-w-48 w-full max-w-110 relative flex flex-col items-center gap-4 my-6 transition-colors">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-1.5">
          <Camera size={13} />
          Prince's Memories
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-accent">
          Some Sweet Moments
        </h2>
        <p className="text-xs md:text-sm text-accent/70 mt-1 font-medium">
          (Swipe or watch for more memories)
        </p>
      </div>

      <div className="relative p-5 sm:p-6 bg-gradient-to-b from-white/90 to-violet-200 dark:from-zinc-800 dark:to-zinc-900 w-full rounded-[40px] flex items-end justify-center shadow-inner overflow-hidden">
        <div className="w-full flex justify-center">
          <Swiper
            effect="fade"
            modules={[EffectFade, Autoplay]}
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            className="w-56 h-72 sm:w-64 sm:h-80"
          >
            {photos.map((item, i) => (
              <SwiperSlide key={i}>
                <motion.div className="h-full w-full rounded-3xl flex flex-col items-center justify-center">
                  <div className="relative h-[85%] w-full rounded-2xl overflow-hidden shadow-md bg-black/5">
                    <img
                      loading="lazy"
                      src={item.src}
                      alt={`Memory ${i + 1}`}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-accent/90 dark:text-violet-300">
                    {item.caption}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="mt-2 flex justify-center">
        <Button onClick={onNext} className="bg-[#ddd6ff] dark:bg-accent/80 text-accent dark:text-white font-bold">
          <Mail size={18} /> Open My Message
        </Button>
      </div>
    </div>
  )
}
