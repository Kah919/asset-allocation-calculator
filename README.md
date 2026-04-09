# CryptoSplit

A web app that calculates how much of each cryptocurrency to buy given a USD amount and a custom split ratio. Powered by live exchange rates from the Coinbase API.

## Features

- Live BTC/ETH exchange rates via Coinbase
- Configurable split ratio (e.g. 70/30) with auto-fill
- Results in both crypto units and USD equivalent
- Input validation with clear error messages
- Error handling with automatic retry (exponential backoff)
- Light/dark theme toggle, persisted across sessions
- Responsive layout for mobile and desktop
- Extensible crypto selector — adding new currencies is a one-line change

## Tech Stack

- [Vue 3](https://vuejs.org/) with `<script setup>` and Composition API
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) for unit testing

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Coinbase API base URL (`https://api.coinbase.com/v2`) |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── components/
│   ├── CryptoCalculator.vue   # Main form and calculation UI
│   ├── ResultCard.vue         # Reusable result display per crypto
│   ├── ThemeToggle.vue        # Light/dark mode toggle
│   └── ErrorBanner.vue        # Error display with retry action
├── composables/
│   └── useExchangeRates.ts    # Fetches rates, manages loading/error/retry
├── utils/
│   └── calculateSplit.ts      # Pure calculation logic (unit tested)
├── types/
│   └── index.ts               # Shared TypeScript types
├── App.vue
└── main.ts
```

## Adding a New Cryptocurrency

Open `src/components/CryptoCalculator.vue` and add an entry to `SUPPORTED_CRYPTOS`:

```ts
const SUPPORTED_CRYPTOS: CryptoOption[] = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' }, // add this
]
```

The dropdown, validation, and result cards all update automatically.
