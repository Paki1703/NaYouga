import type { Request, Response, NextFunction } from 'express'
import { addActionLog } from '../store/memory.js'

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
const SKIP_PATHS = new Set(['/api/health', '/api/auth/me', '/api/auth/logout'])

function safeStringify(obj: unknown, max = 1000) {
  try {
    const s = JSON.stringify(obj)
    return s.length > max ? s.slice(0, max) + '...' : s
  } catch (e) {
    return String(obj)
  }
}

export default function actionLogger(req: Request, _res: Response, next: NextFunction) {
  try {
    if (!MUTATING.has(req.method) || SKIP_PATHS.has(req.path)) {
      return next()
    }
    const userId = req.session?.steamId || 'anon'
    const details = `${safeStringify(req.body || {})}`
    addActionLog(userId, `${req.method} ${req.path}`, details)
  } catch (e) {
    // ignore logging errors
  }
  next()
}
