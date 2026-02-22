# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack at localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
npm run start     # Start production server
```

No test suite is configured.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for layout/utility classes
- **MUI v7** (`@mui/material`, `@mui/icons-material`) for icon buttons and UI components
- **Framer Motion** for score animations (`useMotionValue`, `useTransform`, `animate`)
- **Geist** fonts via `next/font/google`

## Architecture

This is a single-page memory matching game. All game logic lives in `src/app/page.tsx` (client component). The only reusable component is `src/components/Button.tsx`, which renders an individual card.

**Game logic overview (`page.tsx`):**
- 12 cards: pairs of numbers 1–6, shuffled with Fisher-Yates on mount and restart
- State arrays are indexed 0–11; card `id` prop is 1–12 (offset by 1 in `handleClick`)
- Match gives +6 points; mismatch gives -1 and flips cards back after 500ms
- Final score = score − elapsed time in seconds (animated countdown with Framer Motion)
- `gameOver` triggers when all 12 `success` flags are true

**Key state:**
- `isRevealed[]` — whether each card is face-up
- `selectedIndices[]` — up to 2 currently flipped card indices
- `error[]` / `success[]` — visual feedback states per card
- `elapsedTime` — seconds since game start, used as time penalty
