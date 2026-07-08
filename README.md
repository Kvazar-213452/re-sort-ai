# ReSort AI

ReSort AI is a web app that identifies an object from a photo and instantly tells you which bin it belongs in and how to dispose of it correctly.

## Demo

Live demo: [re-sort-ai.vercel.app](https://re-sort-ai.vercel.app/)

Test account:
- Email: `test@gmail.com`
- Password: `12345678`

## Problem

People often don't know how to properly sort waste or recycle items. Even small disposal mistakes add up to significant environmental impact over time. This is made worse by the fact that sorting rules differ from city to city and country to country — a plastic item that's recyclable in one place might just be regular trash in another. That uncertainty makes it hard for people to make the right eco-friendly decision quickly and confidently.

## Description

ReSort AI removes that uncertainty with AI. The user takes a photo of an object (or uploads an image) — the system identifies it with a vision model and returns:

- the object's name and material;
- the correct bin (plastic / paper / organic / hazardous / general waste);
- whether it needs to be rinsed/cleaned before disposal;
- decomposition time and environmental impact;
- a reuse/DIY idea;
- an XP reward — the more harmful it would be to sort the item incorrectly, the more XP the scan is worth.

On top of that, there's a chat with an "Eco Assistant" for recycling questions, a map of real recycling drop-off points, and daily eco challenges with rewards.

## Key features

- **Object scanning (AI vision)** — the photo is analyzed by a vision-capable GPT model that returns JSON with the waste category, confidence score, material, decomposition time, environmental impact, and a reuse idea. Supports a fast (`fast`) and a detailed (`full`) analysis mode.
- **Duplicate-scan protection** — every image is hashed (SHA-256); re-scanning the same photo doesn't award XP twice.
- **Scan history** — every scan is stored in MongoDB along with its result and awarded XP; includes stats and the ability to continue chatting about a specific scan ("what else can I do with this item?").
- **Eco Assistant (chat)** — a dedicated chatbot that answers questions about recycling and reducing household waste, referencing the color-coded bin system (blue = plastic, yellow = paper, green = organic, red = hazardous).
- **Recycling point map** — an interactive map (Leaflet/OpenStreetMap) showing real sorting containers across several German cities (Berlin, Munich, Hamburg, Cologne, Frankfurt, Leipzig); data is fetched via the Overpass API and cached in the database.
- **Daily challenges** — a new task appears every day (e.g. "scan N items"), with progress tracking, day streaks, and a 7-day completion history; finishing it awards bonus XP.
- **XP, ranks and leaderboard** — every unique scan and completed challenge earns XP; users climb ranks (Seedling → Sprout → Eco Explorer → Green Guardian → Eco Hero → Planet Protector) and see their standing on the leaderboard.
- **Authentication** — email/password sign-up and login (bcrypt-hashed passwords), session handled via a JWT stored in an httpOnly cookie.
- **User profile** — XP, current rank, progress toward the next rank, and personal scan stats.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js Route Handlers (`src/app/api/**`) — REST API on the same server |
| AI layer | OpenAI Chat Completions API with image (vision) support, default model `gpt-4o-mini` |
| Map / geodata | Leaflet + React-Leaflet, container data from the Overpass API (OpenStreetMap) |
| Database | MongoDB (official `mongodb` driver) |
| Auth | JWT sessions (`jose`) in an httpOnly cookie, password hashing with `bcryptjs` |
| Icons | lucide-react |

## Challenges faced

One of the biggest challenges was ensuring accurate classification of real-world objects under different lighting and angles, and turning complex sorting rules into short, clear answers. Another was balancing speed and reliability — the AI response needs to feel instant while still being accurate.

## Final thoughts

ReSort AI is a step toward making eco-friendly decisions automatic: less confusion when sorting waste, more actual recycling.
