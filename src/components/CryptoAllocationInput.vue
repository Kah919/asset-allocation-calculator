<script setup lang="ts">
import { computed } from 'vue'
import type { CryptoOption } from '../types'

const props = defineProps<{
  label: string
  selectId: string
  percentId: string
  options: CryptoOption[]
  selectedSymbol: string
  percent: string
}>()

const emit = defineEmits<{
  'update:percent': [value: string]
  'change-crypto': [event: Event]
}>()

const selectedName = computed(() =>
  props.options.find((c) => c.symbol === props.selectedSymbol)?.name ?? props.selectedSymbol
)
</script>

<template>
  <div class="space-y-2">
    <label :for="selectId" class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {{ label }}
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="selectedSymbol"
        @change="emit('change-crypto', $event)"
        class="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-8
               text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2
               focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700
               dark:text-white cursor-pointer"
      >
        <option v-for="crypto in options" :key="crypto.symbol" :value="crypto.symbol">
          {{ crypto.symbol }} — {{ crypto.name }}
        </option>
      </select>
      <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>

    <div class="relative">
      <input
        :id="percentId"
        :value="percent"
        @input="emit('update:percent', ($event.target as HTMLInputElement).value)"
        type="number"
        min="0"
        max="100"
        step="any"
        placeholder="0"
        :aria-label="`${selectedName} percentage`"
        class="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10
               text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2
               focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700
               dark:text-white"
      />
      <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500">%</span>
    </div>
  </div>
</template>
