"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextReveal({
  text,
  className,
  delay = 0,
}) {
  const words = text.split(" ");

  return (
    <h2 className={cn("overflow-hidden leading-tight", className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: delay + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}
