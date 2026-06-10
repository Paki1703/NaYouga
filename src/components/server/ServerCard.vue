<script setup>
import { computed } from 'vue'
import ServerStatusBadge from './ServerStatusBadge.vue'

const props = defineProps({
  server: { type: Object, required: true },
  status: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const playerPercent = computed(() => {
  if (!props.status?.online) return 0
  return Math.round((props.status.players / props.status.maxPlayers) * 100)
})

function copyIp() {
  navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`)
}
</script>

<template>
  <article class="card overflow-hidden">
    <div class="border-b border-surface-border bg-surface-overlay px-5 py-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="font-display text-xl font-semibold uppercase text-white">{{ server.name }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ server.description }}</p>
        </div>
        <ServerStatusBadge v-if="status" :online="status.online" />
        <div v-else-if="loading" class="h-6 w-16 animate-pulse rounded-full bg-surface-border" />
      </div>
    </div>

    <div class="grid gap-4 p-5 sm:grid-cols-2">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Адрес</p>
        <div class="mt-1 flex items-center gap-2">
          <code class="font-mono text-sm text-accent">{{ server.ip }}:{{ server.port }}</code>
          <button
            class="rounded p-1 text-gray-500 transition-colors hover:bg-surface-overlay hover:text-white"
            title="Скопировать IP"
            @click="copyIp"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Карта</p>
        <p class="mt-1 text-sm text-white">{{ server.map }}</p>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Игроки</p>
        <div v-if="status" class="mt-1">
          <div class="flex items-baseline gap-1">
            <span class="text-lg font-bold text-white">{{ status.players }}</span>
            <span class="text-sm text-gray-500">/ {{ status.maxPlayers }}</span>
          </div>
          <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-border">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="playerPercent > 80 ? 'bg-warning' : 'bg-accent'"
              :style="{ width: `${playerPercent}%` }"
            />
          </div>
        </div>
        <div v-else class="mt-1 h-6 w-20 animate-pulse rounded bg-surface-border" />
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Пинг</p>
        <p v-if="status?.online" class="mt-1 text-sm text-white">{{ status.ping }} мс</p>
        <p v-else class="mt-1 text-sm text-gray-600">—</p>
      </div>
    </div>

    <div v-if="server.mods?.length" class="border-t border-surface-border px-5 py-3">
      <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">Моды</p>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <span
          v-for="mod in server.mods"
          :key="mod"
          class="rounded bg-surface-overlay px-2 py-0.5 text-xs text-gray-400"
        >
          {{ mod }}
        </span>
      </div>
    </div>
  </article>
</template>
