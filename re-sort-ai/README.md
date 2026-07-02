# ReSort AI (TrashAI)

**Point your camera at any object — AI instantly tells you where it goes.**

ReSort AI is an AI-powered waste-sorting assistant. Take a photo or show an item to your camera and the app
identifies it, determines its material, and tells you which bin it belongs in, whether it needs prep before
recycling, and how to reduce your environmental footprint.

## The problem

Recycling rules are confusing and differ from city to city, country to country. The same plastic item might be
recyclable in one place and not in another. That uncertainty leads people to either sort incorrectly or not sort
at all. ReSort AI removes that uncertainty and makes the eco-friendly choice instant and intuitive.

## Features

### AI object recognition
Take a photo or use live video — the system identifies the object (bottle, paper, battery, food, etc.), analyzes
its material (plastic, glass, metal, organic), and reports the AI's confidence.

### Sorting recommendations
Which bin to use (plastic, organic, paper, or hazardous), whether the item needs to be washed or prepped, and
whether it's recyclable at all.

### Eco insights
Decomposition time in nature, environmental impact, and whether the item can be reused, for every scanned item.

### Smart Reuse Ideas
AI suggests how to turn an item into something new — for example, bottle → lamp, jar → planter — along with DIY tips.

### History & stats
Every scanned object, how much plastic has been saved, how much has been recycled, and weekly/monthly charts.

### Gamification
XP for every correct scan, levels (Eco Beginner → Eco Hero), badges ("Plastic Saver", "Zero Waste Starter"), and
daily challenges.

### AI Eco Assistant (chat)
A chat assistant that answers questions like "where do I throw away batteries?" or "how do I reduce waste at home?"

### Live camera mode
Real-time object recognition right in the browser, with an instant tip overlaid on the image.

### Multilingual
English, Ukrainian, and more, with automatic detection of the user's language.

### Fast Scan Mode
A no-frills quick mode that just says where to throw an item — for instant use in real life.

## Tech stack

- **Frontend:** [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com), [Geist](https://vercel.com/font) font, [lucide-react](https://lucide.dev) icons
- **AI:** OpenAI's Chat Completions API (a vision-capable model, e.g. `gpt-4o-mini`) for object recognition,
  sorting guidance, reuse ideas, and the Eco Assistant chat

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your OpenAI API key. Open `.env.local` (already created, git-ignored) and paste your key from
   [platform.openai.com/api-keys](https://platform.openai.com/api-keys):

   ```
   OPENAI_API_KEY=sk-...
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or
[http://localhost:3000/scan](http://localhost:3000/scan) to try the live scanner and Eco Assistant chat.

## Pages

| Route       | Status      | Description                                   |
| ----------- | ----------- | ---------------------------------------------- |
| `/`         | Live        | Marketing landing page                         |
| `/scan`     | Live        | Camera/upload scanner + Eco Assistant chat      |
| `/profile`  | Placeholder | Account, eco level, and XP (UI stub)            |
| `/history`  | Placeholder | Scan history and recycling stats (UI stub)      |
| `/awards`   | Placeholder | Badges and challenges (UI stub)                 |

## Project structure

```
app/
  layout.tsx              # root layout, fonts, metadata, theme init script
  page.tsx                 # landing page composition
  globals.css               # design tokens, light/dark theme
  scan/page.tsx              # live scan page (camera/upload + AI results + chat)
  profile/page.tsx            # profile placeholder page
  history/page.tsx             # history placeholder page
  awards/page.tsx               # awards placeholder page
  api/scan/route.ts               # calls OpenAI to analyze a scanned image
  api/chat/route.ts                # calls OpenAI for the Eco Assistant chat
  lib/                               # shared types + OpenAI/image/bin helpers
  components/
    layout/                           # Navbar, Footer, ThemeToggle
    landing/                           # marketing sections (Hero, Features, ...)
    scan/                               # ScanWorkspace, EcoChat
    ui/                                  # shared primitives (Reveal, ProgressBar, BinLegend, ComingSoon)
```

## Status

Built for a hackathon. The landing page, the live scanner, and the Eco Assistant chat are wired up to OpenAI.
Profile, history, and awards are placeholder pages awaiting backend/auth work.