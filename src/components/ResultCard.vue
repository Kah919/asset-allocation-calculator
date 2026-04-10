<script setup lang="ts">
import type { SplitAllocation } from '../types'

defineProps<{
  allocation: SplitAllocation
}>()

function formatCrypto(amount: number): string {
  if (amount === 0) return '0'
  if (amount >= 1) return amount.toLocaleString(undefined, { maximumFractionDigits: 6 })
  return amount.toLocaleString(undefined, { maximumFractionDigits: 8 })
}

function formatUsd(amount: number): string {
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>

<template>
  <article
    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm
           dark:border-slate-700 dark:bg-slate-800"
    :aria-label="`${allocation.crypto.name} allocation result`"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {{ allocation.crypto.name }}
        </p>
        <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {{ formatCrypto(allocation.cryptoAmount) }}
          <span class="text-lg font-semibold text-slate-500 dark:text-slate-400">
            {{ allocation.crypto.symbol }}
          </span>
        </p>
      </div>

      <div class="text-right">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Allocation
        </p>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
          {{ allocation.percentage }}%
        </p>
      </div>
    </div>

    <div class="mt-4 border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between text-sm">
      <span class="text-slate-500 dark:text-slate-400">USD Value</span>
      <span class="font-medium text-slate-700 dark:text-slate-300">
        {{ formatUsd(allocation.usdAmount) }}
      </span>
    </div>

    <div class="mt-1 flex justify-between text-sm">
      <span class="text-slate-500 dark:text-slate-400">Rate</span>
      <span class="font-medium text-slate-700 dark:text-slate-300">
        {{ formatCrypto(allocation.ratePerDollar) }} {{ allocation.crypto.symbol }} / USD
      </span>
    </div>
  </article>
</template>
