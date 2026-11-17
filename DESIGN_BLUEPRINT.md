# 🎂 PRINCE BIRTHDAY — MASTERPIECE REDESIGN BLUEPRINT

**Repo:** `https://github.com/KitKat-King/prince-birthday`
**Status:** Committed to `main`
**Approach:** Separate pages per scene, no scrolling, multi-theme palettes, shadcn CLI components

---

## 1. Design Philosophy

A birthday masterpiece for Prince — cinematic, joyful, multi-palette, zero-scroll. Each scene is its own page, navigated by big, inviting CTAs. Visual language pulls from all 4 demo sites (V3 dark rose, V3-light cream, V4 gold/navy, V5 pin-lock pink) plus fresh 2026 trends: glassmorphism, gradient mesh, kinetic typography, floating elements, confetti bursts, and shadcn/accent motion components.

---

## 2. Site Architecture — Separate Pages (No Scrolling)

```
/prince-birthday
├── /                    → Landing / PIN Lock (V5 style)
├── /loader              → Countdown boot sequence (V3 SC.00)
├── /seal                → Wax seal unlock (V3 SC.00b)
├── /hero                → "It's Your Era" kinetic title (V3 SC.01 + V4 gold)
├── /dossier             → 3D flip ID card + dossier (V3 SC.02)
├── /anthems             → Cassette / vinyl music player (V3 SC.03)
├── /memories            → Polaroid stack + scratch card + film strip (V3 SC.04)
├── /wish                → 16-candle cake + wish ticket (V3 SC.05)
├── /legend              → End credits + boarding pass (V3 SC.06)
└── /surprise            → Post-credits deleted scene + gift (V3 SC.07)
```

Each page:
- Fills the viewport (no scroll)
- Has a CTA to the next page (`next`) and optionally back (`prev`)
- Uses a shared navigation shell (top bar with page indicator, bottom with prev/next)
- Respects `prefers-reduced-motion`

---

## 3. Theme Palettes (6 varieties, user-selectable)

Stored as Tailwind CSS variables in `globals.css`, switched via a theme toggle in the nav shell.

### Theme A — "Midnight Rose" (V3 dark)
| Token | Value |
|-------|-------|
| Background | `gradient(to-tr, from-rose-950/40 via-black to-rose-950/40)` |
| Primary | `#f472b6` (pink-400) |
| Secondary | `#a78bfa` (purple-400) |
| Accent | `#fa85ff` (fuchsia-400) |
| Font | Shantell Sans + Dancing Script |

### Theme B — "Cream Blush" (V3-light)
| Token | Value |
|-------|-------|
| Background | `#fefaff` |
| Primary | `#973b88` |
| Secondary | `#9b3c49` |
| Accent | `#594ba0` |
| Font | Shantell Sans + Comfortaa |

### Theme C — "Gold Navy" (V4)
| Token | Value |
|-------|-------|
| Background | `#05093d` (deep navy) |
| Primary | `#e7cfa1` (gold) |
| Secondary | `#c28e54` (gold deep) |
| Accent | `#f3d5b0` (gold light) |
| Font | Quicksand |

### Theme D — "Pink Lock" (V5)
| Token | Value |
|-------|-------|
| Background | `gradient(135deg, #fff0f5, #fdf3f4, #fff5f8)` |
| Primary | `#ff2357` (rose-600) |
| Secondary | `#f6339a` (pink-500) |
| Accent | `#fb64b6` (pink-400) |
| Font | Dancing Script + Shantell Sans |

### Theme E — "Electric Neon"
| Token | Value |
|-------|-------|
| Background | `#0a0a0a` |
| Primary | `#00f2ff` (cyan) |
| Secondary | `#bc13fe` (violet) |
| Accent | `#ff0055` (red) |
| Font | Anton |

### Theme F — "Sunset Dream"
| Token | Value |
|-------|-------|
| Background | `gradient(#ffeef8, #fceff9, #ffebe9)` |
| Primary | `#ff9a9e` |
| Secondary | `#fecfef` |
| Accent | `#ffecd2` |
| Font | Dancing Script + Shantell Sans |

---

## 4. shadcn CLI Component Plan (Extreme Usage)

| Component | Source | Usage |
|-----------|--------|-------|
| `button` | shadcn | All CTAs |
| `card` | shadcn | Dossier card, tribute, wish ticket |
| `sheet` | shadcn | Mobile nav shell, surprise modal |
| `dialog` | shadcn | Seal crack modal, gift reveal |
| `popover` | shadcn | Theme picker |
| `separator` | shadcn | Section dividers |
| `@magicui/blur-fade` | Magic UI | Hero background fade |
| `@magicui/sparkles` | Magic UI | Celebration sparkles |
| `@magicui/glare` | Magic UI | Card gloss |
| `@magicui/marquee` | Magic UI | Velocity marquee |
| `@aceternity/3d-marquee` | Aceternity | Rotating title text |
| `@aceternity/spotlight-card` | Aceternity | Hero spotlight effect |
| `@aceternity/beam-background` | Aceternity | Background light beams |
| `@skiper-ui/skiper40` | Skiper UI | Surprise/reveal pages |
| `motion-primitives` | shadcn | Page transitions |

---

## 5. Page-by-Page Design Specs

### / — PIN Lock (V5)
- Glass card center, pink gradient bg
- Bear mascot floating (gift.gif)
- 6 heart PIN dots, delete key, wrong-code shake
- Confetti on success → navigate to `/loader`

### /loader — Countdown (V3)
- Dark rose gradient, grid overlay
- Vault dial, scan lines, T-minus countdown 3→0
- "Crafting your special moment…" kinetic type
- Auto-advance to `/seal`

### /seal — Wax Unlock (V3)
- Press-and-hold seal (~1.4s), heats, cracks, bursts
- Beams, lilies drifting, "instead" skip link
- On unlock → `/hero`

### /hero — Kinetic Title (V3 + V4)
- `PRINCE / CHAPTER 16 / IT'S YOUR ERA`
- Gold ring accent (V4), gold balloons bottom (V4)
- Floating bear (V5), orbiting lilies, velocity marquee
- Orbit ring with lily + stars

### /dossier — Flip ID Card (V3)
- Pointer-tracked 3D card, flip side with "hours lived"
- Holographic stamps, line-drawn lily
- Redacted facts panel

### /anthems — Music Player (V3)
- Cassette side flip, vinyl player
- Dynamic island now-playing bar
- Word-lit lyric card (original mood lines only)

### /memories — Photo Reel (V3)
- Draggable polaroid stack (4 photos from public/images)
- Scratch-off gift card
- Contact-sheet film strip
- Two GIF projectors

### /wish — Candle Cake (V3)
- 16-candle CSS cake, hold-to-blow
- Confetti + petal celebration
- Wish ticket

### /legend — End Credits (V3)
- `STAY LEGENDARY` kinetic title
- Boarding-pass birthday pass (share/copy)
- Three-tap verified stamp
- Post-credits deleted scene

### /surprise — Gift Modal (V3 SC.07)
- Gift box tap → surprise modal
- "Lots of love for you ❤️"
- Replay → back to `/pin`

---

## 6. Shared Shell Components

- **Nav shell** (top): page indicator dots, theme picker, sound toggle
- **Page transition** (bottom): prev/next arrows, progress bar
- **Toast**: notifications
- **Confetti canvas**: full-screen burst on transitions

---

## 7. Assets

| Asset | Source | Use |
|-------|--------|-----|
| `public/gifs/gift.gif` | Existing | Bear mascot, gift |
| `public/gifs/intro.gif` | Existing | Intro topper |
| `public/gifs/surprise.gif` | Existing | Surprise modal |
| `public/images/1-4.jpg` | Existing | Photo carousel |
| `public/images/cover.webp` | Existing | Flip card cover, OG image |
| `audio/bg.mp3` | To add | Looping background music |
| Fonts | Google Fonts | Shantell Sans, Dancing Script, Comfortaa, Quicksand, Anton, DM Sans/Mono, Playfair Display |

---

## 8. Implementation Order

1. ✅ `components.json` with 3 registries (done)
2. ✅ `.cursor/mcp.json` with shadcn + Aceternity MCP (done)
3. ✅ Shared shell + theme system (done)
4. ✅ All pages built: `/pin` → `/loader` → `/seal` → `/hero` → `/dossier` → `/anthems` → `/memories` → `/wish` → `/legend` → `/surprise` (done)
5. ✅ shadcn UI components built manually (button, card, dialog, sheet) (done)
6. ✅ Committed and pushed to `main` (done)

---

## 9. What's NOT in scope (per rules)

- No local dev server or build
- No Netlify, no pnpm
- No new repository
- Changes committed directly to existing repo, pushed to main
