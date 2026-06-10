import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ServerInfo, ServerStatus, ProjectStats } from '@/types'
import { api } from '@/api/client'

export const useServersStore = defineStore('servers', () => {
  const servers = ref<ServerInfo[]>([])
  const statuses = ref<Record<string, ServerStatus>>({})
  const stats = ref<ProjectStats | null>(null)
  const loading = ref(false)
  let interval: ReturnType<typeof setInterval> | null = null

  async function fetch() {
    loading.value = true
    try {
      const data = await api.servers.list()
      servers.value = data.servers
      statuses.value = data.statuses
      stats.value = data.stats
    } finally { loading.value = false }
  }

  function startPolling(ms = 15000) {
    fetch()
    interval = setInterval(fetch, ms)
  }

  function stopPolling() {
    if (interval) { clearInterval(interval); interval = null }
  }

  return { servers, statuses, stats, loading, fetch, startPolling, stopPolling }
})
