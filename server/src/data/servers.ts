import type { ServerInfo } from '../types.js'

export const servers: ServerInfo[] = [
  {
    id: 'main',
    name: 'На Юга | Основной',
    map: 'Chernarus Plus',
    ip: '185.0.0.0',
    port: 2302,
    maxPlayers: 100,
    mods: ['CF', 'VPPAdminTools', 'BaseBuildingPlus', 'CodeLock'],
    description: 'PvP сервер с полной экономикой и строительством. Каждый сам за себя, но с поддержкой Пати мода для игры с друзьями и кланом.',
    restartIntervalHours: 4,
  },
  {
    id: 'hardcore',
    name: 'На Юга | Hardcore',
    map: 'Livonia',
    ip: '185.0.0.0',
    port: 2402,
    maxPlayers: 60,
    mods: ['CF', 'HardcoreSurvival'],
    description: 'Хардкорный PvP режим с увеличенной сложностью выживания. Пати мод для командной игры.',
    restartIntervalHours: 6,
  },
]

export const projectStats = {
  online: 0,
  maxOnline: 100,
  totalPlayers: 12847,
  lastWipe: '2026-05-15',
  nextWipe: '2026-07-15',
}
