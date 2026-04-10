<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    @click="toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700
           dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200
           focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500
           transition-colors cursor-pointer"
  >
    <!-- Sun icon (shown in dark mode) -->
    <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
    <!-- Moon icon (shown in light mode) -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</template>
