# Justworks FE — Claude Code Guide

## Project Overview

A Vue 3 + Vite + TypeScript web app that calculates cryptocurrency purchase amounts based on a USD total and a configurable split ratio. Exchange rates are fetched live from the Coinbase API.

## Tech Stack

- **Vue 3** — Composition API with `<script setup>` exclusively (no Options API)
- **TypeScript** — strict mode, all files typed
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
- **Vitest** — unit testing, separate `vitest.config.ts`
- **Vite** — build tool, config in `vite.config.ts`

## Project Structure

```
src/
├── components/       # UI components (Vue SFCs)
├── composables/      # Reusable stateful logic (useXxx convention)
├── utils/            # Pure functions — no Vue reactivity
├── types/            # Shared TypeScript interfaces
├── App.vue           # Root layout (header + main)
└── main.ts           # Entry point — applies saved dark mode theme
```

## Key Files

| File | Purpose |
|---|---|
| `src/types/index.ts` | All shared types: `CryptoOption`, `SplitAllocation`, `ExchangeRates` |
| `src/utils/calculateSplit.ts` | Core calculation logic — pure function, no side effects |
| `src/composables/useExchangeRates.ts` | Coinbase API fetch, retry logic, loading/error state |
| `src/components/CryptoCalculator.vue` | Main form — USD input, crypto selectors, split inputs |
| `src/components/ResultCard.vue` | Reusable result card, one per crypto allocation |

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (runs vue-tsc first)
npm run test         # Run unit tests once
npm run test:watch   # Run tests in watch mode
```

## Environment Variables

Stored in `.env` (gitignored — never commit). Use `.env.example` as the template.

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://api.coinbase.com/v2` |

`VITE_` prefix makes variables available in the browser bundle. If a secret API key is added in the future, it must go through a serverless proxy — never in a `VITE_` variable.

## Coding Conventions

- **Components**: PascalCase filenames, `<script setup lang="ts">` at the top
- **Composables**: `useXxx` naming, live in `src/composables/`
- **Pure logic**: goes in `src/utils/` — no Vue imports, fully unit-testable
- **Types**: defined in `src/types/index.ts`, imported where needed
- **Styling**: Tailwind utility classes only — no custom CSS except `src/style.css` (Tailwind import + theme transition)
- **Dark mode**: Tailwind `dark:` variant, toggled via `.dark` class on `<html>`, persisted in `localStorage`
- **Accessibility**: semantic HTML, `aria-label` on icon-only buttons, `role="alert"` on errors, `<fieldset>`/`<legend>` for grouped inputs

## Adding a New Cryptocurrency

Add one entry to `SUPPORTED_CRYPTOS` in `src/components/CryptoCalculator.vue`:

```ts
const SUPPORTED_CRYPTOS: CryptoOption[] = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' }, // add here
]
```

The dropdowns, swap-prevention logic, and result cards all update automatically.

## API

**Coinbase Exchange Rates**
```
GET https://api.coinbase.com/v2/exchange-rates?currency=USD
```
Returns rates as strings — each value is how much of that crypto you get per 1 USD.
The `getRate(symbol)` helper in `useExchangeRates.ts` parses and returns a `number | null`.

Fetch strategy: manual (user-triggered), up to 3 auto-retries with exponential backoff before surfacing an error.

## Testing

Unit tests live next to the file they test (`calculateSplit.test.ts`).
Only pure utility functions are unit-tested. The core candidate is `calculateSplit()`.

When adding new pure logic to `src/utils/`, add a corresponding `.test.ts` file.
