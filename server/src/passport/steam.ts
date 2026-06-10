import passport from 'passport'
import { Strategy as SteamStrategy } from 'passport-steam'
import { env, isSteamConfigured } from '../config/env.js'
import { getOrCreateUser, getUser } from '../store/memory.js'
import type { User } from '../types.js'

export function setupPassport() {
  if (!isSteamConfigured()) {
    console.warn('⚠️  STEAM_API_KEY не задан — Steam-авторизация недоступна')
    return
  }

  passport.use(
    new SteamStrategy(
      {
        returnURL: env.steamReturnUrl,
        realm: env.steamRealm,
        apiKey: env.steamApiKey,
      },
      (_identifier, profile, done) => {
        try {
          const steamId = profile.id
          const isAdmin = env.adminSteamIds.includes(steamId)
          const avatar =
            profile.photos?.[2]?.value ||
            profile._json?.avatarfull ||
            'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfbeb6b0a0877bcc475630ad407e_full.jpg'
          const nickname = profile.displayName || profile._json?.personaname || 'Survivor'

          const user = getOrCreateUser(steamId, nickname, avatar, isAdmin)
          done(null, user as Express.User)
        } catch (err) {
          done(err as Error)
        }
      },
    ),
  )

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.steamId)
  })

  passport.deserializeUser((steamId: string, done) => {
    const user = getUser(steamId)
    done(null, user as Express.User)
  })
}

export { passport }
