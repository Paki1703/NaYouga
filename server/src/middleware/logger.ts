import type { Request, Response, NextFunction } from 'express'
import { addActionLog } from '../store/memory.js'

function safeStringify(obj: unknown, max = 1000) {
  try {
    const s = JSON.stringify(obj)
    return s.length > max ? s.slice(0, max) + '...': s
  } catch (e) {
    return String(obj)
  }
}

export default function actionLogger(req: Request, _res: Response, next: NextFunction) {
  try {
    const userId = (req.session as any)?.steamId || 'anon'
    const details = `${safeStringify(req.method + ' ' + req.originalUrl)} ${safeStringify(req.body || req.query || {})}`
    addActionLog(userId, `${req.method} ${req.path}`, details)
  } catch (e) {
    // ignore logging errors
  }
  next()
}
