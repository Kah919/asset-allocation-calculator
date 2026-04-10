import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { THEME_STORAGE_KEY } from './composables/useTheme'

// Apply saved theme before first paint to avoid flash
if (localStorage.getItem(THEME_STORAGE_KEY) === 'dark') {
  document.documentElement.classList.add('dark')
}

createApp(App).mount('#app')
