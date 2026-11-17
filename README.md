# Prince — Chapter 16 (Masterpiece Build)

A mobile-first, cinematic birthday film built for Prince. **THE ERA CUT**: PIN unlock → wax-seal loader → six scenes → end credits.

Built as a **masterpiece** combining UI research from four birthday demo sites (V3, V3-Light, V4, V5 demos) into one cohesive experience:

| Route | Scene | Inspired by |
|-------|-------|-------------|
| `/` | **PIN Lock** — 6-digit secret-code keypad on glass card with bear mascot | V5 demo |
| `/loader` | **Countdown Boot** — vault dial, scan lines, T-minus countdown | V3 demo |
| `/seal` | **Wax Seal** — press-and-hold (~1.4s), heats, cracks, bursts | V3 demo |
| `/hero` | **Kinetic Title** — `PRINCE / CHAPTER 16 / IT'S YOUR ERA` with gold ring, gold balloons, floating bear | V3 + V4 demos |
| `/dossier` | **3D Flip ID Card** — pointer-tracked flip, holographic stamps, hours-lived counter | V3 demo |
| `/anthems` | **Music Mixtape** — cassette side flip, vinyl player, dynamic-island now-playing bar | V3 demo |
| `/memories` | **Photo Reel** — draggable polaroid stack, scratch-off card, film strip, GIF projectors | V3 demo |
| `/wish` | **16-Candle Cake** — hold-to-blow, confetti burst, wish ticket | V3 demo |
| `/legend` | **End Credits** — `STAY LEGENDARY`, boarding-pass pass, 3-tap verified stamp | V3 demo |
| `/surprise` | **Gift Finale** — gift tap → surprise modal, replay | V3 SC.07 |

## New in this build

- **PIN lock screen** (`src/components/experience/pin-lock.jsx`) — 6-digit code entry (`123456` / `1234567`), heart-shaped PIN dots, delete key, wrong-code shake, confetti celebration on success
- **V4 gold accents** — gold ring, gold gradient balloons, navy + gold color tokens
- **V5 elements** — floating bear mascot, glass-morphism card, bunting flags, `Dancing Script` + `Shantell Sans` display fonts
- **Component registries** — `components.json` with shadcn/ui, Magic UI, Aceternity UI, Skiper UI registries
- **MCP config** — `.cursor/mcp.json` for shadcn + Aceternity MCP servers
- **GSAP** added to the stack for advanced motion
- **shadcn/ui components** — button, card, dialog, sheet built manually (registry fetch restricted on Termux)

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

Vercel project settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `out`
- **Install Command**: `npm install`

```
git add -A
git commit -m "feat: masterpiece birthday build"
git push origin main
```

## Assets

`public/images/` and `public/gifs/` are preserved. The PIN screen reuses `public/gifs/gift.gif` for the floating bear.
