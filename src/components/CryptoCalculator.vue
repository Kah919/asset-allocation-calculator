<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useExchangeRates } from '../composables/useExchangeRates'
import { calculateSplit } from '../utils/calculateSplit'
import { validateCalculatorInput } from '../utils/validateCalculatorInput'
import type { CryptoOption, SplitAllocation } from '../types'
import ResultCard from './ResultCard.vue'
import ErrorBanner from './ErrorBanner.vue'
import CryptoAllocationInput from './CryptoAllocationInput.vue'

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
const percentA = ref<string>('')
const percentB = ref<string>('')

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
function onSelectCrypto(slot: 'A' | 'B', event: Event) {
  const symbol = (event.target as HTMLSelectElement).value
  const found = SUPPORTED_CRYPTOS.find((c) => c.symbol === symbol)
  if (!found) return
  if (slot === 'A') {
    if (found.symbol === selectedB.value.symbol) selectedB.value = selectedA.value
    selectedA.value = found
  } else {
    if (found.symbol === selectedA.value.symbol) selectedA.value = selectedB.value
    selectedB.value = found
  }
}

// ─── Validation ──────────────────────────────────────────────────────────────
const validationError = ref<string | null>(null)

function validate(): boolean {
  validationError.value = validateCalculatorInput({
    totalUsd: totalUsd.value,
    percentA: percentA.value,
    percentB: percentB.value,
    symbolA: selectedA.value.symbol,
    symbolB: selectedB.value.symbol,
  })
  return validationError.value === null
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
      <p class="text-slate-500 dark:text-slate-400">
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
          Investable Assets (USD)
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
            placeholder="0.00"
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
          Allocation Split
        </legend>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CryptoAllocationInput
            label="Crypto A"
            select-id="crypto-a"
            percent-id="percent-a"
            :options="SUPPORTED_CRYPTOS"
            :selected-symbol="selectedA.symbol"
            v-model:percent="percentA"
            @change-crypto="onSelectCrypto('A', $event)"
          />
          <CryptoAllocationInput
            label="Crypto B"
            select-id="crypto-b"
            percent-id="percent-b"
            :options="SUPPORTED_CRYPTOS"
            :selected-symbol="selectedB.symbol"
            v-model:percent="percentB"
            @change-crypto="onSelectCrypto('B', $event)"
          />
        </div>
      </fieldset>

      <!-- Validation error -->
      <p v-if="validationError" role="alert" class="text-sm text-red-600 dark:text-red-400">
        {{ validationError }}
      </p>

      <!-- Rates status + Calculate -->
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-slate-400 dark:text-slate-500">
          <template v-if="loading">Fetching rates…</template>
          <template v-else-if="lastUpdatedLabel">Rates updated {{ lastUpdatedLabel }}</template>
          <template v-else>Rates not loaded</template>
        </p>

        <div class="flex items-center gap-2 sm:ml-auto sm:shrink-0">
          <button
            type="button"
            @click="fetchRates"
            :disabled="loading"
            :title="'Refresh exchange rates'"
            class="rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium
                   text-slate-600 hover:bg-slate-50 focus-visible:outline-2
                   focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors dark:border-slate-600 dark:text-slate-300
                   dark:hover:bg-slate-700 cursor-pointer"
          >
            Refresh Rates
          </button>

          <button
            type="submit"
            :disabled="loading || !!error"
            class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white
                   hover:bg-blue-700 focus-visible:outline-2
                   focus-visible:outline-blue-500 disabled:cursor-not-allowed
                   disabled:opacity-50 transition-colors cursor-pointer"
          >
            Calculate
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
