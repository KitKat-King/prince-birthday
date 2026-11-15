/**
 * Shared motion language for the Chapter 16 film.
 * One source of truth for easing, springs and reusable variants.
 */

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.76, 0, 0.24, 1],
  back: [0.34, 1.56, 0.64, 1],
  soft: [0.25, 0.1, 0.25, 1],
};

export const SPRING = {
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 },
  snap: { type: "spring", stiffness: 420, damping: 28 },
  bouncy: { type: "spring", stiffness: 320, damping: 16 },
  molasses: { type: "spring", stiffness: 60, damping: 20 },
};

export const VIEWPORT = { once: true, amount: 0.2 };

export const fadeUp = (delay = 0, distance = 40) => ({
  initial: { opacity: 0, y: distance, filter: "blur(12px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: VIEWPORT,
  transition: { duration: 0.9, delay, ease: EASE.out },
});

export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: VIEWPORT,
  transition: { duration: 1, delay, ease: EASE.out },
});

export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.82, filter: "blur(14px)" },
  whileInView: { opacity: 1, scale: 1, filter: "blur(0px)" },
  viewport: VIEWPORT,
  transition: { ...SPRING.soft, delay },
});

export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const riseChild = {
  hidden: { opacity: 0, y: 34, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE.out },
  },
};

export const slamChild = {
  hidden: { opacity: 0, y: 90, rotateX: -55, scale: 1.15 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { ...SPRING.bouncy, duration: 0.9 },
  },
};

export const letterStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
};

export const letterRise = {
  hidden: { opacity: 0, y: "60%", rotate: 6 },
  show: {
    opacity: 1,
    y: "0%",
    rotate: 0,
    transition: { duration: 0.8, ease: EASE.out },
  },
};

export const tapPulse = {
  whileTap: { scale: 0.94 },
  whileHover: { scale: 1.03 },
  transition: SPRING.snap,
};

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
