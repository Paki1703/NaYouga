<script setup>
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const cart = useCartStore()

const links = [
  { to: '/', label: 'Главная' },
  { to: '/shop', label: 'Магазин' },
  { to: '/monitoring', label: 'Мониторинг' },
]

function isActive(path) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-surface-border bg-surface/90 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="group flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-md bg-accent/20 text-lg font-bold text-accent transition-colors group-hover:bg-accent/30">
          Ю
        </div>
        <div>
          <span class="font-display text-xl font-bold uppercase tracking-wider text-white">На Юга</span>
          <span class="hidden text-xs text-gray-500 sm:block">DayZ Server</span>
        </div>
      </RouterLink>

      <nav class="hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
          :class="isActive(link.to)
            ? 'bg-accent/10 text-accent'
            : 'text-gray-400 hover:bg-surface-overlay hover:text-white'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-3">
        <RouterLink
          to="/cart"
          class="relative flex items-center gap-2 rounded-md border border-surface-border bg-surface-overlay px-3 py-2 text-sm transition-colors hover:border-accent/50"
        >
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <span class="hidden sm:inline">Корзина</span>
          <span
            v-if="cart.totalItems > 0"
            class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-surface"
          >
            {{ cart.totalItems }}
          </span>
        </RouterLink>

        <a
          href="https://discord.gg/"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary hidden text-sm sm:inline-flex"
        >
          Discord
        </a>
      </div>
    </div>

    <nav class="flex border-t border-surface-border md:hidden">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex-1 py-2.5 text-center text-xs font-medium transition-colors"
        :class="isActive(link.to) ? 'text-accent' : 'text-gray-500'"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>
</template>
