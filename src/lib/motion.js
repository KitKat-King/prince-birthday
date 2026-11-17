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
