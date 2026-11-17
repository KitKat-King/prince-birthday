# Prince — Chapter 16 (Masterpiece Build)

A mobile-first, cinematic birthday film built for Prince. **THE ERA CUT**: PIN unlock → wax-seal loader → six scenes → end credits.

Built as a **masterpiece** combining UI research from four birthday demo sites (V3, V3-Light, V4, V5 demos) into one cohesive experience:

| Scene | What it is | Inspired by |
|-------|-----------|-------------|
| **SC.00 — PIN Gate** | 6-digit secret-code keypad on a glass card with floating bear, bunting flags, and looping audio | V5 demo |
| **SC.00 — Loader** | Cinematic boot sequence with T‑minus countdown, vault dial, and scan lines | Existing |
| **SC.00b — Unlock** | Press-and-hold wax seal that heats, cracks, and bursts open | Existing |
| **SC.01 — Hero** | Kinetic `PRINCE / CHAPTER 16 / IT'S YOUR ERA` with gold ring, V4 gold balloons, floating bear, orbiting lilies, velocity marquee | V3 + V4 |
| **SC.02 — Dossier** | Pointer-tracked 3D ID card with flip side, holographic stamps, line-drawn lily | Existing |
| **SC.03 — Anthems** | Visual mixtape: cassette side flip, vinyl player, dynamic-island now-playing bar, word-lit lyric card | Existing |
| **SC.04 — The Reel** | Draggable polaroid stack, scratch-off gift card, contact-sheet film strip, two GIF projectors | Existing |
| **SC.05 — The Wish** | Sixteen-candle CSS cake with hold-to-blow, confetti, wish ticket | Existing |
| **SC.06 — Legend** | `STAY LEGENDARY` end credits, boarding-pass birthday pass, three-tap verified stamp, post-credits deleted scene | Existing |

## New in this build

- **PIN lock screen** (`src/components/experience/pin-lock.jsx`) — 6-digit code entry (`123456` / `1234567`), heart-shaped PIN dots, delete key, wrong-code shake, confetti celebration on success
- **V4 gold accents** — gold ring, gold gradient balloons, navy + gold color tokens
- **V5 elements** — floating bear mascot, glass-morphism card, bunting flags, `Dancing Script` + `Shantell Sans` display fonts
- **Component registries** — `components.json` with shadcn/ui, Magic UI, Aceternity UI, Skiper UI registries
- **MCP config** — `.cursor/mcp.json` for shadcn + Aceternity MCP servers
- **GSAP** added to the stack for advanced motion

## Stack

Next.js 16 (App Router, static export), React 19, Tailwind CSS 4, Framer Motion, GSAP, Lenis, Lucide React, Canvas Confetti, Bootstrap grid.

## Registries (`components.json`)

```json
"registries": {
  "@magicui": "https://magicui.design/r/{name}.json",
  "@aceternity": "https://ui.aceternity.com/registry/{name}.json",
  "@skiper-ui": "https://skiper-ui.com/r/{name}.json"
}
```

Install via shadcn CLI when needed:
```
npx shadcn@latest add @magicui/blur-fade
npx shadcn@latest add @skiper-ui/skiper40
```

## MCP (`.cursor/mcp.json`)

Configures shadcn and Aceternity UI MCP servers so AI agents can search and install animated components (Spotlight, Sparkles, BlurFade, 3D Card Stack, Image Trail/Reveal) directly.

## Deployment

This repository is configured for Vercel. Pushes to `main` are built and deployed automatically — no local dev server or local build required.

```
git add -A
git commit -m "feat: masterpiece build — PIN gate, V4 gold accents, V5 bear, registries + MCP"
git push origin main
```

## Assets

`public/images/` and `public/gifs/` are preserved. The PIN screen reuses `public/gifs/gift.gif` for the floating bear.
