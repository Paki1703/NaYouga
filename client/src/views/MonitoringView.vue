<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import { useServersStore } from '@/stores/servers'
import ServerCard from '@/components/server/ServerCard.vue'
import OnlineChart from '@/components/server/OnlineChart.vue'
import PlayerList from '@/components/server/PlayerList.vue'

const store = useServersStore()
const selectedServer = ref('main')

onMounted(() => store.startPolling(15000))
onUnmounted(() => store.stopPolling())

const currentStatus = () => store.statuses[selectedServer.value]
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="section-title">Мониторинг</h1>
        <p class="mt-2 text-gray-500">Автообновление каждые 15 секунд</p>
      </div>
      <button class="btn-ghost" :disabled="store.loading" @click="store.fetch()">
        <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': store.loading }" /> Обновить
      </button>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <ServerCard v-for="s in store.servers" :key="s.id" :server="s" :status="store.statuses[s.id]" :loading="store.loading" />
    </div>

    <!-- Server tabs -->
    <div class="mt-10 flex gap-2">
      <button v-for="s in store.servers" :key="s.id"
        class="rounded-lg border px-4 py-2 text-sm font-semibold transition-all"
        :class="selectedServer === s.id ? 'border-accent bg-accent/10 text-accent' : 'border-white/5 text-gray-500 hover:text-white'"
        @click="selectedServer = s.id"
      >{{ s.name }}</button>
    </div>

    <div v-if="currentStatus()" class="mt-6 space-y-6">
      <OnlineChart :data24h="currentStatus()!.onlineHistory24h" :data7d="currentStatus()!.onlineHistory7d" />
      <PlayerList :players="currentStatus()!.playersList" />
    </div>
  </div>
</template>
