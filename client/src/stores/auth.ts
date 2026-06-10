import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { api } from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  async function fetchUser() {
    loading.value = true
    try {
      const { user: u } = await api.auth.me()
      user.value = u
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  function login() {
    window.location.href = api.auth.steamUrl
  }

  async function logout() {
    await api.auth.logout()
    user.value = null
  }

  function setUser(u: User) {
    user.value = u
  }

  return { user, loading, fetchUser, login, logout, setUser }
})
