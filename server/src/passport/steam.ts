import passport from 'passport'
import { Strategy as SteamStrategy } from 'passport-steam'
import { env, isSteamConfigured } from '../config/env.js'
import { getOrCreateUser, getUser } from '../store/memory.js'

const STEAM_ID_FROM_IDENTIFIER = /steamcommunity\.com\/openid\/id\/(\d+)/
const DEFAULT_AVATAR =
  'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfbeb6b0a0877bcc475630ad407e_full.jpg'

async function fetchSteamPlayer(steamId: string) {
  const url = new URL('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/')
  url.searchParams.set('key', env.steamApiKey)
  url.searchParams.set('steamids', steamId)

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Steam API ответил с кодом ${res.status}`)
  }

  const data = (await res.json()) as {
    response?: { players?: { steamid: string; personaname?: string; avatarfull?: string }[] }
  }
  const player = data.response?.players?.[0]
  if (!player) {
    throw new Error('Steam API не вернул профиль игрока — проверьте STEAM_API_KEY')
  }
  return player
}

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
        // passport-steam передаёт в Steam API полный OpenID URL вместо SteamID64 — получаем профиль сами
        profile: false,
      },
      (identifier, _profile, done) => {
        void (async () => {
          try {
            const match = STEAM_ID_FROM_IDENTIFIER.exec(identifier)
            if (!match) {
              return done(new Error('Некорректный Steam OpenID identifier'))
            }

            const steamId = match[1]
            const player = await fetchSteamPlayer(steamId)
            const isAdmin = env.adminSteamIds.includes(steamId)
            const avatar = player.avatarfull || DEFAULT_AVATAR
            const nickname = player.personaname || 'Survivor'

            const user = getOrCreateUser(steamId, nickname, avatar, isAdmin)
            done(null, user as Express.User)
          } catch (err) {
            done(err as Error)
          }
        })()
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
