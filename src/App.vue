<script setup lang="ts">
import CryptoCalculator from './components/CryptoCalculator.vue'
import ThemeToggle from './components/ThemeToggle.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">

    <header class="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <span class="font-semibold text-slate-900 dark:text-white">Asset Allocation Calculator</span>
        <ThemeToggle />
      </div>
    </header>

    <main>
      <CryptoCalculator />
    </main>

  </div>
</template>
