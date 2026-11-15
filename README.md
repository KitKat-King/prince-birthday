# Prince — Chapter 16

A mobile-first, cinematic birthday film built for Prince. **THE ERA CUT**: loader → wax-seal unlock → six scenes → end credits.

## The film

- **SC.00 — The Seal.** Cinematic boot sequence with a live T‑minus countdown, then a press‑and‑hold wax seal that heats, cracks and takes over the screen.
- **SC.01 — Hero.** Kinetic `PRINCE / CHAPTER 16 / IT'S YOUR ERA` with scroll parallax, orbiting lilies and a velocity-reactive marquee.
- **SC.02 — The Dossier.** Pointer-tracked 3D ID card with a flip side of live "hours lived" data, holographic stamps and a line-drawn lily.
- **SC.03 — Anthems.** A visual mixtape for *Bairan* and *Tere Aasa Pass Din Sara*: cassette side flip, vinyl player, dynamic-island now-playing bar and a word-lit lyric card. Original mood lines only — no borrowed lyrics or audio.
- **SC.04 — The Reel.** Draggable polaroid stack, scratch-off gift card, contact-sheet film strip and two GIF projectors.
- **SC.05 — The Wish.** A sixteen-candle CSS cake with a hold-to-blow interaction, confetti/petal celebration and a wish ticket.
- **SC.06 — Legend.** `STAY LEGENDARY` end credits, a boarding-pass birthday pass with share/copy, a three-tap verified stamp and a post-credits deleted scene.

## Stack

HTML5, CSS3, JavaScript/JSX, React 19, Next.js 16, Tailwind CSS 4, Bootstrap grid, Framer Motion, anime.js, Lenis, Lucide React, Canvas Confetti.

## Interactions at a glance

- Press and hold the seal (~1.4s) or tap "instead"
- Flip the dossier card; drag the polaroid stack
- Scratch the silver card with a finger
- Play/pause the mixtape, flip sides, tap lyric lines to cue them
- Hold the wish button to blow out the candles
- Tap the boarding pass three times; tap the post-credits reel three times
- Sound toggle is interface-only Web Audio, off by default

## Local notes

- All motion respects `prefers-reduced-motion`.
- The build is a static export (`output: "export"`); no server runtime is required.

## Deployment

This repository is configured for Vercel. Pushes to `main` are built in Vercel's cloud; no local development server or local build is required for deployment.
