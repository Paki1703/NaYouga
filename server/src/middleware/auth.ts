import type { Request, Response, NextFunction } from 'express'
import { getUser } from '../store/memory.js'

declare module 'express-session' {
  interface SessionData {
    steamId?: string
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.steamId) return res.status(401).json({ error: 'Не авторизован' })
  next()
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.steamId) return res.status(401).json({ error: 'Не авторизован' })
  const user = getUser(req.session.steamId)
  if (!user?.isAdmin) return res.status(403).json({ error: 'Нет доступа' })
  next()
}
