import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servers as serverList } from '@/data/servers'

function generateMockStatus(server) {
  const online = Math.random() > 0.05
  const players = online ? Math.floor(Math.random() * server.maxPlayers) : 0
  return {
    online,
    players,
    maxPlayers: server.maxPlayers,
    ping: online ? Math.floor(Math.random() * 80) + 20 : null,
    version: '1.26.0',
    lastUpdated: new Date(),
  }
}

export const useServersStore = defineStore('servers', () => {
  const statuses = ref({})
  const loading = ref(false)
  let intervalId = null

  async function fetchStatuses() {
    loading.value = true
    await new Promise((r) => setTimeout(r, 400))

    const updated = {}
    for (const server of serverList) {
      updated[server.id] = generateMockStatus(server)
    }
    statuses.value = updated
    loading.value = false
  }

  function startPolling(intervalMs = 30000) {
    fetchStatuses()
    intervalId = setInterval(fetchStatuses, intervalMs)
  }

  function stopPolling() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  return {
    statuses,
    loading,
    fetchStatuses,
    startPolling,
    stopPolling,
  }
})
