<script setup>
import { onMounted, onUnmounted } from 'vue'
import { servers } from '@/data/servers'
import { useServersStore } from '@/stores/servers'
import ServerCard from '@/components/server/ServerCard.vue'

const serversStore = useServersStore()

onMounted(() => serversStore.startPolling(15000))
onUnmounted(() => serversStore.stopPolling())

function refresh() {
  serversStore.fetchStatuses()
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="section-title">Мониторинг</h1>
        <p class="mt-2 text-gray-500">Статус серверов обновляется автоматически каждые 15 секунд</p>
      </div>
      <button
        class="btn-secondary"
        :disabled="serversStore.loading"
        @click="refresh"
      >
        <svg
          class="h-4 w-4"
          :class="{ 'animate-spin': serversStore.loading }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
        Обновить
      </button>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <ServerCard
        v-for="server in servers"
        :key="server.id"
        :server="server"
        :status="serversStore.statuses[server.id]"
        :loading="serversStore.loading"
      />
    </div>

    <div class="card mt-8 p-5">
      <h3 class="font-display text-sm font-semibold uppercase tracking-wider text-gray-400">Как подключиться</h3>
      <ol class="mt-3 list-inside list-decimal space-y-2 text-sm text-gray-500">
        <li>Открой DayZ → Серверы → Прямое подключение</li>
        <li>Введи IP и порт сервера (кнопка копирования рядом с адресом)</li>
        <li>Убедись, что установлены все моды из списка</li>
        <li>Наслаждайся игрой на «На Юга»!</li>
      </ol>
    </div>
  </div>
</template>
