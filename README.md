<div align="center">

# Katha Management App

Daily financial tracking workspace tailored for community saving circles (kathas) and self-help groups.

</div>

## Overview

The application helps coordinators monitor daily deposits, payouts, and emerging insights across multiple kathas. All activity is stored locally in the browser so you can prototype safely before wiring up a backend.

Core dashboard areas:

- **Summary cards** surface net balance, cumulative contributions, payouts, and today’s cashflow.
- **Ledger capture form** records deposits, withdrawals, expenses, and income against any katha.
- **Smart insights** highlight standout transactions, healthiest kathas, and busy cashflow days.
- **Katha snapshots** show group-level balances, savings progress, and member counts.
- **Daily ledger** groups entries by date with type filters, quick search, and inline removal.

Seed data loads on first visit to demonstrate flows. Subsequent edits persist to `localStorage`.

## Getting Started

```bash
npm install
npm run dev
# open http://localhost:3000
```

To build and serve the production bundle:

```bash
npm run build
npm start
```

## Project Structure

```
src/
├─ app/
│  ├─ layout.tsx       # Global layout, metadata, font wiring
│  ├─ page.tsx         # Main dashboard logic
│  └─ globals.css      # Tailwind setup & design tokens
├─ components/         # UI building blocks (forms, insights, cards)
├─ data/seed.ts        # First-run sample kathas + ledger entries
├─ hooks/              # Local storage persistence helper
└─ lib/                # Shared utilities (formatters, ID helper)
```

## Scripts

- `npm run dev` – Launch the development server.
- `npm run lint` – Lint with the Next.js ESLint config.
- `npm run build` – Create an optimized production build.
- `npm start` – Run the production server (after `npm run build`).

## Tech Stack

- **Next.js 16 (App Router)** for routing and build tooling.
- **React 18** client components for interactive state.
- **TypeScript** with strict typing.
- **Tailwind CSS** (via `@tailwindcss/postcss`) for styling.
- **LocalStorage** persistence powered by a reusable hook.

## Data & Persistence

All bookkeeping lives client-side. Clear your browser storage to reset the workspace to the seeds defined in `src/data/seed.ts`. The synchronization logic is in `src/hooks/usePersistentState.ts`—swap it out when you connect to an API or database.

## Deployment

The project is optimized for Vercel. Run `npm run build` locally before deploying to confirm everything compiles cleanly.

---

Crafted to bring daily transparency to cooperative savings groups.
