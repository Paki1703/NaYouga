<script setup lang="ts">
import { Users } from 'lucide-vue-next'

defineProps<{ players: { name: string; playTime: number }[] }>()

function formatTime(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}ч ${m}м` : `${m}м`
}
</script>

<template>
  <div class="glass p-5">
    <h4 class="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-gray-400">
      <Users class="h-4 w-4" /> Игроки онлайн ({{ players.length }})
    </h4>
    <div v-if="players.length" class="mt-4 max-h-64 space-y-1 overflow-y-auto">
      <div v-for="(p, i) in players" :key="p.name + i"
        class="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5">
        <span class="text-gray-300">{{ p.name }}</span>
        <span class="text-xs text-gray-600">{{ formatTime(p.playTime) }}</span>
      </div>
    </div>
    <p v-else class="mt-4 text-sm text-gray-600">Нет игроков онлайн</p>
  </div>
</template>
