<script setup lang="ts">
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    role="alert"
    class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4
           dark:border-red-800 dark:bg-red-950"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-5 w-5 shrink-0 text-red-500 dark:text-red-400"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>

    <div class="flex-1">
      <p class="text-sm font-medium text-red-700 dark:text-red-300">Something went wrong</p>
      <p class="mt-0.5 text-sm text-red-600 dark:text-red-400">{{ message }}</p>
    </div>

    <button
      type="button"
      @click="emit('retry')"
      class="shrink-0 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700
             hover:bg-red-200 focus-visible:outline focus-visible:outline-2
             focus-visible:outline-red-500 dark:bg-red-900 dark:text-red-300
             dark:hover:bg-red-800 transition-colors cursor-pointer"
    >
      Retry
    </button>
  </div>
</template>
