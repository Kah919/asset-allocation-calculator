<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useExchangeRates } from '../composables/useExchangeRates'
import { calculateSplit } from '../utils/calculateSplit'
import type { CryptoOption, SplitAllocation } from '../types'
import ResultCard from './ResultCard.vue'
import ErrorBanner from './ErrorBanner.vue'

// ─── Supported cryptocurrencies ────────────────────────────────────────────
// To add more in the future, just append to this array.
const SUPPORTED_CRYPTOS: CryptoOption[] = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
]

// ─── Exchange rates ─────────────────────────────────────────────────────────
const { loading, error, lastUpdated, fetchRates, getRate } = useExchangeRates()

onMounted(() => fetchRates())

// Seconds since last update for display
const secondsSinceUpdate = ref<number | null>(null)
let ticker: ReturnType<typeof setInterval> | null = null

watch(lastUpdated, (val) => {
  if (ticker) clearInterval(ticker)
  if (!val) return
  ticker = setInterval(() => {
    secondsSinceUpdate.value = Math.floor((Date.now() - val.getTime()) / 1000)
  }, 1000)
}, { immediate: true })

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return null
  const s = secondsSinceUpdate.value ?? 0
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
})

// ─── Form state ─────────────────────────────────────────────────────────────
const totalUsd = ref<string>('')
const selectedA = ref<CryptoOption>(SUPPORTED_CRYPTOS[0])
const selectedB = ref<CryptoOption>(SUPPORTED_CRYPTOS[1])
const percentA = ref<string>('70')
const percentB = ref<string>('30')

// Sync percentB whenever percentA changes
watch(percentA, (val) => {
  const n = parseFloat(val)
  if (!isNaN(n) && n >= 0 && n <= 100) {
    percentB.value = String(parseFloat((100 - n).toFixed(2)))
  }
})

// Sync percentA whenever percentB changes
watch(percentB, (val) => {
  const n = parseFloat(val)
  if (!isNaN(n) && n >= 0 && n <= 100) {
    percentA.value = String(parseFloat((100 - n).toFixed(2)))
  }
})

// Prevent selecting the same crypto for both slots
function onSelectA(event: Event) {
  const symbol = (event.target as HTMLSelectElement).value
  const found = SUPPORTED_CRYPTOS.find((c) => c.symbol === symbol)
  if (!found) return
  if (found.symbol === selectedB.value.symbol) {
    selectedB.value = selectedA.value
  }
  selectedA.value = found
}

function onSelectB(event: Event) {
  const symbol = (event.target as HTMLSelectElement).value
  const found = SUPPORTED_CRYPTOS.find((c) => c.symbol === symbol)
  if (!found) return
  if (found.symbol === selectedA.value.symbol) {
    selectedA.value = selectedB.value
  }
  selectedB.value = found
}

// ─── Validation ──────────────────────────────────────────────────────────────
const validationError = ref<string | null>(null)

function validate(): boolean {
  const usd = parseFloat(totalUsd.value)
  const pA = parseFloat(percentA.value)
  const pB = parseFloat(percentB.value)

  if (!totalUsd.value || isNaN(usd)) {
    validationError.value = 'Please enter a valid USD amount.'
    return false
  }
  if (usd <= 0) {
    validationError.value = 'USD amount must be greater than zero.'
    return false
  }
  if (isNaN(pA) || isNaN(pB)) {
    validationError.value = 'Both percentage fields must be filled in.'
    return false
  }
  if (pA < 0 || pB < 0) {
    validationError.value = 'Percentages cannot be negative.'
    return false
  }
  const sum = parseFloat((pA + pB).toFixed(2))
  if (sum !== 100) {
    validationError.value = `Percentages must sum to 100% (currently ${sum}%).`
    return false
  }
  if (selectedA.value.symbol === selectedB.value.symbol) {
    validationError.value = 'Please select two different cryptocurrencies.'
    return false
  }

  validationError.value = null
  return true
}

// ─── Results ─────────────────────────────────────────────────────────────────
const results = ref<SplitAllocation[] | null>(null)

function calculate() {
  if (!validate()) return

  const rateA = getRate(selectedA.value.symbol)
  const rateB = getRate(selectedB.value.symbol)

  if (rateA === null || rateB === null) {
    validationError.value = 'Exchange rates not available. Please refresh rates first.'
    return
  }

  results.value = calculateSplit({
    totalUsd: parseFloat(totalUsd.value),
    allocations: [
      { crypto: selectedA.value, percentage: parseFloat(percentA.value), ratePerDollar: rateA },
      { crypto: selectedB.value, percentage: parseFloat(percentB.value), ratePerDollar: rateB },
    ],
  })
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">

    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Crypto Split Calculator</h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400">
        Enter your holdings and split ratio to see how much of each crypto to buy.
      </p>
    </div>

    <!-- API error -->
    <ErrorBanner
      v-if="error"
      :message="error"
      @retry="fetchRates"
    />

    <!-- Form -->
    <form
      @submit.prevent="calculate"
      novalidate
      aria-label="Crypto split calculator"
      class="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm
             dark:border-slate-700 dark:bg-slate-800"
    >
      <!-- USD Amount -->
      <div>
        <label for="usd-amount" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Total holdings (USD)
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500">
            $
          </span>
          <input
            id="usd-amount"
            v-model="totalUsd"
            type="number"
            min="0"
            step="any"
            placeholder="10000"
            autocomplete="off"
            :aria-invalid="!!validationError"
            class="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-8 pr-4
                   text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none
                   focus:ring-2 focus:ring-blue-500/20
                   dark:border-slate-600 dark:bg-slate-700 dark:text-white
                   dark:placeholder-slate-500 dark:focus:border-blue-400"
          />
        </div>
      </div>

      <!-- Crypto selectors + split inputs -->
      <fieldset>
        <legend class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Allocation split
        </legend>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <!-- Crypto A -->
          <div class="space-y-2">
            <label for="crypto-a" class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Crypto A
            </label>
            <select
              id="crypto-a"
              :value="selectedA.symbol"
              @change="onSelectA"
              class="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3
                     text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2
                     focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700
                     dark:text-white cursor-pointer"
            >
              <option v-for="crypto in SUPPORTED_CRYPTOS" :key="crypto.symbol" :value="crypto.symbol">
                {{ crypto.symbol }} — {{ crypto.name }}
              </option>
            </select>

            <div class="relative">
              <input
                id="percent-a"
                v-model="percentA"
                type="number"
                min="0"
                max="100"
                step="any"
                :aria-label="`${selectedA.name} percentage`"
                class="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10
                       text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700
                       dark:text-white"
              />
              <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500">%</span>
            </div>
          </div>

          <!-- Crypto B -->
          <div class="space-y-2">
            <label for="crypto-b" class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Crypto B
            </label>
            <select
              id="crypto-b"
              :value="selectedB.symbol"
              @change="onSelectB"
              class="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3
                     text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2
                     focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700
                     dark:text-white cursor-pointer"
            >
              <option v-for="crypto in SUPPORTED_CRYPTOS" :key="crypto.symbol" :value="crypto.symbol">
                {{ crypto.symbol }} — {{ crypto.name }}
              </option>
            </select>

            <div class="relative">
              <input
                id="percent-b"
                v-model="percentB"
                type="number"
                min="0"
                max="100"
                step="any"
                :aria-label="`${selectedB.name} percentage`"
                class="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10
                       text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700
                       dark:text-white"
              />
              <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500">%</span>
            </div>
          </div>
        </div>
      </fieldset>

      <!-- Validation error -->
      <p v-if="validationError" role="alert" class="text-sm text-red-600 dark:text-red-400">
        {{ validationError }}
      </p>

      <!-- Rates status + Calculate -->
      <div class="flex items-center justify-between gap-4">
        <p class="text-xs text-slate-400 dark:text-slate-500">
          <template v-if="loading">Fetching rates…</template>
          <template v-else-if="lastUpdatedLabel">Rates updated {{ lastUpdatedLabel }}</template>
          <template v-else>Rates not loaded</template>
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="fetchRates"
            :disabled="loading"
            :title="'Refresh exchange rates'"
            class="rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium
                   text-slate-600 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-blue-500 disabled:opacity-50 transition-colors
                   dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
          >
            Refresh rates
          </button>

          <button
            type="submit"
            :disabled="loading || !!error"
            class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white
                   hover:bg-blue-700 focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-blue-500 disabled:cursor-not-allowed
                   disabled:opacity-50 transition-colors cursor-pointer"
          >
            <span v-if="loading">Loading…</span>
            <span v-else>Calculate</span>
          </button>
        </div>
      </div>
    </form>

    <!-- Results -->
    <div v-if="results">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          v-for="alloc in results"
          :key="alloc.crypto.symbol"
          :allocation="alloc"
        />
      </div>

      <p class="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
        Based on rates from {{ lastUpdated?.toLocaleTimeString() }}
      </p>
    </div>

  </div>
</template>
