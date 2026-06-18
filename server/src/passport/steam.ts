import passport from 'passport'
import { Strategy as SteamStrategy } from 'passport-steam'
import { env, isSteamConfigured } from '../config/env.js'
import { getOrCreateUser, getUser } from '../store/memory.js'

const STEAM_ID_FROM_IDENTIFIER = /steamcommunity\.com\/openid\/id\/(\d+)/
const DEFAULT_AVATAR =
  'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfbeb6b0a0877bcc475630ad407e_full.jpg'

interface SteamProfile {
  nickname: string
  avatar: string
}

async function fetchSteamPlayer(steamId: string): Promise<SteamProfile> {
  // 1. Try Steam Web API (if key configured)
  if (env.steamApiKey) {
    try {
      const url = new URL('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/')
      url.searchParams.set('key', env.steamApiKey)
      url.searchParams.set('steamids', steamId)

      const res = await fetch(url)
      if (res.ok) {
        const data = (await res.json()) as {
          response?: { players?: { steamid: string; personaname?: string; avatarfull?: string }[] }
        }
        const player = data.response?.players?.[0]
        if (player) {
          return {
            nickname: player.personaname || 'Survivor',
            avatar: player.avatarfull || DEFAULT_AVATAR,
          }
        }
      }
    } catch {
      // fall through to XML
    }
  }

  // 2. Fallback: Steam Community XML profile (no API key needed)
  const xmlUrl = `https://steamcommunity.com/profiles/${steamId}/?xml=1`
  const res = await fetch(xmlUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NaYougaBot/1.0)' },
  })
  if (!res.ok) throw new Error(`Steam XML profile returned ${res.status}`)

  const xml = await res.text()
  const nickMatch = /<steamID><!\[CDATA\[([^\]]*)\]\]><\/steamID>/.exec(xml)
  const avatarMatch = /<avatarFull><!\[CDATA\[([^\]]*)\]\]><\/avatarFull>/.exec(xml)
  const nick = nickMatch?.[1]?.trim()

  if (!nick) throw new Error('Steam XML не вернул никнейм — профиль может быть приватным')

  return {
    nickname: nick,
    avatar: avatarMatch?.[1]?.trim() || DEFAULT_AVATAR,
  }
}

export function setupPassport() {
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.steamId)
  })

  passport.deserializeUser((steamId: string, done) => {
    const user = getUser(steamId)
    done(null, user as Express.User)
  })

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
            const isAdmin = env.adminSteamIds.includes(steamId)

            // Profile (nickname/avatar) — пробуем Steam API, затем XML (без ключа).
            // SteamID уже проверен OpenID — это и есть аутентификация.
            let avatar = DEFAULT_AVATAR
            let nickname = 'Survivor'
            try {
              const profile = await fetchSteamPlayer(steamId)
              avatar = profile.avatar
              nickname = profile.nickname
            } catch (profileErr) {
              const msg = profileErr instanceof Error ? profileErr.message : String(profileErr)
              console.warn(`⚠️  Steam profile fetch failed: ${msg}. Auth continues with SteamID ${steamId}.`)
            }

            const user = getOrCreateUser(steamId, nickname, avatar, isAdmin)
            done(null, user as Express.User)
          } catch (err) {
            done(err as Error)
          }
        })()
      },
    ),
  )
}

export { passport }
