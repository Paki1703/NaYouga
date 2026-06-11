function cleanEnv(value: string | undefined): string {
  return (value ?? '').trim().replace(/^["']|["']$/g, '')
}

function cleanUrl(value: string | undefined, fallback: string): string {
  const url = cleanEnv(value) || fallback
  return url.replace(/\/+$/, '')
}

const clientUrl = cleanUrl(process.env.CLIENT_URL, 'http://localhost:5173')

export const env = {
  port: Number(process.env.PORT) || 3001,
  clientUrl,
  sessionSecret: cleanEnv(process.env.SESSION_SECRET) || 'nayouga-dev-secret',
  steamApiKey: cleanEnv(process.env.STEAM_API_KEY),
  steamRealm: cleanUrl(process.env.STEAM_REALM, clientUrl),
  steamReturnUrl: cleanUrl(process.env.STEAM_RETURN_URL, `${clientUrl}/api/auth/steam/callback`),
  adminSteamIds: cleanEnv(process.env.ADMIN_STEAM_IDS)
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean),
  isDev: process.env.NODE_ENV !== 'production',
}

const PLACEHOLDER_KEYS = new Set(['', 'localhost', 'your_steam_api_key'])

export function isSteamConfigured() {
  return Boolean(env.steamApiKey) && !PLACEHOLDER_KEYS.has(env.steamApiKey)
}
