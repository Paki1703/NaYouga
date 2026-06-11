import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import './style.css'

const pinia = createPinia()
const app = createApp(App).use(pinia)

const auth = useAuthStore()
await auth.fetchUser()

app.use(router).mount('#app')
