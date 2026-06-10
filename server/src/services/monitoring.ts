import type { ServerInfo, ServerStatus } from '../types.js'

const MOCK_NAMES = [
  'Survivor_42', 'HunterPro', 'BanditKing', 'MedicOne', 'Sniper_Elite',
  'FarmerJoe', 'BuilderMax', 'RaidBoss', 'Scavenger', 'NightWolf',
  'ChernoRunner', 'LivoniaGhost', 'AmmoDealer', 'BaseDefender', 'LootGoblin',
]

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateHistory24h(currentPlayers: number) {
  const history = []
  const now = new Date()
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    const variance = randomInt(-15, 15)
    history.push({
      time: time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      players: Math.max(0, Math.min(100, currentPlayers + variance + randomInt(-10, 10))),
    })
  }
  return history
}

function generateHistory7d() {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  return days.map((day) => ({
    day,
    peak: randomInt(40, 97),
    average: randomInt(20, 60),
  }))
}

export function generateServerStatus(server: ServerInfo): ServerStatus {
  const online = Math.random() > 0.03
  const players = online ? randomInt(5, server.maxPlayers) : 0
  const playerCount = online ? randomInt(3, Math.min(players, 15)) : 0

  const playersList = Array.from({ length: playerCount }, (_, i) => ({
    name: MOCK_NAMES[i % MOCK_NAMES.length] + (i > 14 ? `_${i}` : ''),
    playTime: randomInt(5, 480),
  }))

  const restartMs = server.restartIntervalHours * 3600000
  const elapsed = Date.now() % restartMs
  const restartIn = restartMs - elapsed

  return {
    online,
    players,
    maxPlayers: server.maxPlayers,
    ping: online ? randomInt(18, 85) : null,
    playersList,
    restartIn,
    onlineHistory24h: generateHistory24h(players),
    onlineHistory7d: generateHistory7d(),
  }
}
