<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Coins, User, LogOut, Shield } from 'lucide-vue-next'
import { PROJECT_NAME } from '@/config'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()

const links = [
  { to: '/', label: 'Главная' },
  { to: '/shop', label: 'Магазин' },
  { to: '/monitoring', label: 'Мониторинг' },
  { to: '/about', label: 'О проекте' },
  { to: '/rules', label: 'Правила' },
]

function isActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/5 bg-graphite/80 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
      <RouterLink to="/" class="group flex items-center gap-3">
        <div class="relative flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 font-display text-lg font-bold text-accent transition-all group-hover:bg-accent/30 group-hover:shadow-lg group-hover:shadow-accent/20">
          Ю
          <div class="absolute inset-0 rounded-lg bg-accent/10 blur-md" />
        </div>
        <span class="hidden font-display text-xl font-bold uppercase tracking-widest text-white sm:block">{{ PROJECT_NAME }}</span>
      </RouterLink>

      <nav class="hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="link in links" :key="link.to" :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-all"
          :class="isActive(link.to) ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'"
        >{{ link.label }}</RouterLink>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <template v-if="auth.user">
          <div class="hidden items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 sm:flex">
            <Coins class="h-4 w-4 text-accent" />
            <span class="font-display text-sm font-bold text-accent">{{ auth.user.balance.toLocaleString('ru-RU') }}</span>
          </div>
          <RouterLink to="/profile" class="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2 py-1.5 transition-all hover:border-accent/30">
            <img :src="auth.user.avatar" class="h-7 w-7 rounded-md" alt="" />
            <span class="hidden text-sm font-medium text-gray-300 md:block">{{ auth.user.nickname }}</span>
          </RouterLink>
          <RouterLink v-if="auth.user.isAdmin" to="/admin" class="btn-ghost hidden !px-3 !py-1.5 sm:inline-flex">
            <Shield class="h-4 w-4" />
          </RouterLink>
          <button class="btn-ghost !px-2 !py-1.5" @click="auth.logout()"><LogOut class="h-4 w-4" /></button>
        </template>
        <button v-else class="btn-steam gap-2 !py-2" @click="auth.login()">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l5.5-9.5L16 9h-3v4h-2z"/></svg>
          <span class="hidden sm:inline">Войти через Steam</span>
          <span class="sm:hidden">Steam</span>
        </button>
      </div>
    </div>

    <nav class="flex border-t border-white/5 lg:hidden">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to"
        class="flex-1 py-2.5 text-center text-xs font-medium"
        :class="isActive(link.to) ? 'text-accent' : 'text-gray-500'"
      >{{ link.label }}</RouterLink>
    </nav>
  </header>
</template>
