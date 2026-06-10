import { Router } from 'express'
import { env, isSteamConfigured } from '../config/env.js'
import { passport } from '../passport/steam.js'
import { getOrCreateUser, getUser } from '../store/memory.js'

const router = Router()

router.get('/me', (req, res) => {
  const steamId = req.session!.steamId
  if (!steamId) {
    return res.json({ user: null })
  }
  const user = getUser(steamId)
  if (!user) {
    return res.json({ user: null })
  }
  res.json({ user })
})

router.get('/steam', (req, res, next) => {
  if (!isSteamConfigured()) {
    return res.status(503).json({
      error: 'Steam API Key не настроен. Добавьте STEAM_API_KEY в server/.env',
    })
  }
  passport.authenticate('steam')(req, res, next)
})

router.get('/steam/callback', (req, res, next) => {
  if (!isSteamConfigured()) {
    return res.redirect(`${env.clientUrl}/?auth=error&reason=steam_not_configured`)
  }

  passport.authenticate('steam', (err: Error | null, user: Express.User | false | undefined) => {
    if (err || !user) {
      console.error('Steam auth error:', err?.message || 'No user returned')
      return res.redirect(`${env.clientUrl}/?auth=error`)
    }

    // Сохраняем steamId в session
    req.session!.steamId = user.steamId
    req.session!.save((saveErr) => {
      if (saveErr) {
        console.error('Session save error:', saveErr.message)
        return res.redirect(`${env.clientUrl}/?auth=error`)
      }
      // Перенаправляем на профиль - фронтенд автоматически загрузит данные из /api/auth/me
      res.redirect(`${env.clientUrl}/profile`)
    })
  })(req, res, next)
})

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' })
    res.json({ ok: true })
  })
})

// Только для локальной разработки без Steam API Key
if (env.isDev) {
  router.post('/login/dev', (req, res) => {
    const steamId = '76561198000000001'
    const isAdmin = env.adminSteamIds.length === 0 || env.adminSteamIds.includes(steamId)
    const user = getOrCreateUser(
      steamId,
      'DevPlayer',
      'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfbeb6b0a0877bcc475630ad407e_full.jpg',
      isAdmin,
    )
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' })
      res.json({ user })
    })
  })
}

export default router
