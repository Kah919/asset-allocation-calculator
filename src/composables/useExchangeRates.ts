import { ref, computed } from 'vue'
import type { ExchangeRates } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL as string
const MAX_RETRIES = 3
const RETRY_BASE_DELAY_MS = 1000

export function useExchangeRates() {
  const rates = ref<ExchangeRates | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  async function fetchWithRetry(attempt = 1): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/exchange-rates?currency=USD`)

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`)
      }

      const json = await res.json()
      rates.value = json.data.rates as ExchangeRates
      lastUpdated.value = new Date()
      error.value = null
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return fetchWithRetry(attempt + 1)
      }

      error.value =
        err instanceof Error
          ? err.message
          : 'Failed to fetch exchange rates. Please try again.'
    }
  }

  async function fetchRates(): Promise<void> {
    loading.value = true
    error.value = null
    await fetchWithRetry()
    loading.value = false
  }

  function getRate(symbol: string): number | null {
    if (!rates.value) return null
    const raw = rates.value[symbol]
    if (!raw) return null
    const parsed = parseFloat(raw)
    return isNaN(parsed) ? null : parsed
  }

  const hasRates = computed(() => rates.value !== null)

  return {
    rates,
    loading,
    error,
    lastUpdated,
    hasRates,
    fetchRates,
    getRate,
  }
}
