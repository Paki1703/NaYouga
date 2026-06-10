<script setup lang="ts">
import type { ShopBanner } from '@/types'

defineProps<{ banner: ShopBanner }>()
</script>

<template>
  <RouterLink
    :to="banner.link"
    class="card-shine group relative flex h-36 flex-col justify-end overflow-hidden rounded-xl border border-white/5 p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 md:h-44"
    :class="`bg-gradient-to-br ${banner.color}`"
  >
    <div class="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-transparent" />
    <div class="relative">
      <h3 class="font-display text-xl font-bold uppercase text-white md:text-2xl">{{ banner.title }}</h3>
      <p class="mt-1 text-sm text-gray-400">{{ banner.subtitle }}</p>
      <span class="mt-3 inline-block text-xs font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">Подробнее →</span>
    </div>
  </RouterLink>
</template>
