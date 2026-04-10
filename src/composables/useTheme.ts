import { ref } from 'vue'

export const THEME_STORAGE_KEY = 'theme'

export function useTheme() {
  const isDark = ref(localStorage.getItem(THEME_STORAGE_KEY) === 'dark')

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem(THEME_STORAGE_KEY, isDark.value ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, toggle }
}
