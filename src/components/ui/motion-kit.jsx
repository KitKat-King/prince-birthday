import * as React from "react";
import { motion } from "framer-motion";

export function Lily({ className = "", width = 24, height = 24, ...props }) {
  return (
    <motion.svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2c-4.5 0-8 3.5-8 8s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8Z" />
      <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4Z" />
    </motion.svg>
  );
}

export function KineticLetters({ text = "", delay = 0, ...props }) {
  return (
    <motion.span
      className="kinetic"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      {...props}
    >
      {text
        .split("")
        .map((char, i) => (
          <motion.span
            key={i}
            className="kinetic-letter"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 + delay, duration: 0.5, ease: "easeOut" }}
          >
            <motion.span className="kinetic-inner" display="inline-block">
              {char}
            </motion.span>
          </motion.span>
        ))}
    </motion.span>
  );
}

export function VelocityMarquee({ children, ...props }) {
  return (
    <motion.div
      className="marquee-track"
      animate={{ x: [-100, 0] }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      {...props}
    >
      <div className="marquee-inner">{children}</div>
    </motion.div>
  );
}
