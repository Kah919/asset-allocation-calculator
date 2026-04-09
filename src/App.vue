<script setup lang="ts">
import CryptoCalculator from './components/CryptoCalculator.vue'
import ThemeToggle from './components/ThemeToggle.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">

    <!-- Top bar -->
    <header class="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span class="font-semibold text-slate-900 dark:text-white">CryptoSplit</span>
        </div>
        <ThemeToggle />
      </div>
    </header>

    <main>
      <CryptoCalculator />
    </main>

  </div>
</template>
