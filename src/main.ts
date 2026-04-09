import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Apply saved theme before first paint to avoid flash
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
}

createApp(App).mount('#app')
