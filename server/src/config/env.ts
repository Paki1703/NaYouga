export const env = {
  port: Number(process.env.PORT) || 3001,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  sessionSecret: process.env.SESSION_SECRET || 'nayouga-dev-secret',
  steamApiKey: process.env.STEAM_API_KEY || '',
  steamRealm: process.env.STEAM_REALM || process.env.CLIENT_URL || 'http://localhost:5173',
  steamReturnUrl: process.env.STEAM_RETURN_URL || `${process.env.CLIENT_URL || 'http://localhost:5173'}/api/auth/steam/callback`,
  adminSteamIds: (process.env.ADMIN_STEAM_IDS || '').split(',').map((id) => id.trim()).filter(Boolean),
  isDev: process.env.NODE_ENV !== 'production',
}

const PLACEHOLDER_KEYS = new Set(['', 'localhost', 'your_steam_api_key'])

export function isSteamConfigured() {
  return Boolean(env.steamApiKey) && !PLACEHOLDER_KEYS.has(env.steamApiKey)
}
