import { Router } from 'express'
import { servers, projectStats } from '../data/servers.js'
import { generateServerStatus } from '../services/monitoring.js'

const router = Router()

router.get('/', (_req, res) => {
  const statuses: Record<string, ReturnType<typeof generateServerStatus>> = {}
  let totalOnline = 0

  for (const server of servers) {
    const status = generateServerStatus(server)
    statuses[server.id] = status
    totalOnline += status.players
  }

  res.json({
    servers,
    statuses,
    stats: { ...projectStats, online: totalOnline },
  })
})

router.get('/:id', (req, res) => {
  const server = servers.find((s) => s.id === req.params.id)
  if (!server) return res.status(404).json({ error: 'Не найдено' })
  res.json({ server, status: generateServerStatus(server) })
})

export default router
