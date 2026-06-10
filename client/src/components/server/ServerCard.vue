<script setup lang="ts">
import { computed } from 'vue'
import { Copy, Clock, Wifi, Users, Map } from 'lucide-vue-next'
import type { ServerInfo, ServerStatus } from '@/types'
import GlassCard from '@/components/ui/GlassCard.vue'

const props = defineProps<{ server: ServerInfo; status?: ServerStatus; loading?: boolean }>()

const playerPercent = computed(() => {
  if (!props.status?.online) return 0
  return Math.round((props.status.players / props.status.maxPlayers) * 100)
})

const restartText = computed(() => {
  if (!props.status) return '—'
  const ms = props.status.restartIn
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}ч ${m}м`
})

function copyIp() {
  navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`)
}
</script>

<template>
  <GlassCard hover class="flex h-full flex-col gap-6 p-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <h3 class="font-display text-2xl font-bold uppercase text-white">{{ server.name }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-gray-400">{{ server.description }}</p>
      </div>
      <span v-if="status" class="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold"
        :class="status.online ? 'bg-green-500/15 text-green-300 ring-1 ring-green-500/30' : 'bg-red-500/15 text-red-300 ring-1 ring-red-500/30'">
        <span class="h-2 w-2 rounded-full" :class="status.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'" />
        {{ status.online ? 'Онлайн' : 'Оффлайн' }}
      </span>
      <div v-else class="h-10 w-20 animate-pulse rounded-lg bg-white/5" />
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Map -->
      <div class="rounded-lg bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
        <div class="flex items-center gap-2">
          <Map class="h-4 w-4 text-accent/70" />
          <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Карта</p>
        </div>
        <p class="mt-3 text-base font-semibold text-white">{{ server.map }}</p>
      </div>

      <!-- IP -->
      <div class="rounded-lg bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
        <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Адрес сервера</p>
        <div class="mt-3 flex items-center justify-between gap-2">
          <code class="font-mono text-sm font-semibold text-accent">{{ server.ip }}:{{ server.port }}</code>
          <button class="rounded p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-white" @click="copyIp" title="Скопировать">
            <Copy class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Restart -->
      <div class="rounded-lg bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
        <div class="flex items-center gap-2">
          <Clock class="h-4 w-4 text-yellow-500/70" />
          <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Рестарт</p>
        </div>
        <p class="mt-3 text-base font-semibold text-white">{{ restartText }}</p>
      </div>

      <!-- Players -->
      <div class="rounded-lg bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10 sm:col-span-2 lg:col-span-1">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-blue-500/70" />
          <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Игроки</p>
        </div>
        <div v-if="status" class="mt-3">
          <p class="font-display text-lg font-bold text-white"><span class="text-accent">{{ status.players }}</span> / {{ status.maxPlayers }}</p>
          <div class="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div class="h-full rounded-full bg-gradient-to-r from-accent via-accent-hover to-accent transition-all duration-500" :style="{ width: `${playerPercent}%` }" />
          </div>
          <p class="mt-2 text-xs text-gray-500">{{ playerPercent }}% заполнено</p>
        </div>
      </div>

      <!-- Ping -->
      <div class="rounded-lg bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10 sm:col-span-2 lg:col-span-1">
        <div class="flex items-center gap-2">
          <Wifi class="h-4 w-4 text-green-500/70" />
          <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Пинг</p>
        </div>
        <p v-if="status?.online" class="mt-3 text-base font-semibold text-white">{{ status.ping }} <span class="text-sm text-gray-500">мс</span></p>
        <p v-else class="mt-3 text-sm text-gray-600">—</p>
      </div>
    </div>

    <!-- Mods -->
    <div v-if="server.mods.length" class="border-t border-white/10 pt-5">
      <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-3">Модификации</p>
      <div class="flex flex-wrap gap-2">
        <span v-for="mod in server.mods" :key="mod" class="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent ring-1 ring-accent/30">{{ mod }}</span>
      </div>
    </div>
  </GlassCard>
</template>
