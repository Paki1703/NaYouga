import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { env, isSteamConfigured, validateEnv } from './config/env.js'
import { setupPassport, passport } from './passport/steam.js'
import authRoutes from './routes/auth.js'
import productsRoutes from './routes/products.js'
import serversRoutes from './routes/servers.js'
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'
import contentRoutes from './routes/content.js'
import paymentsRoutes from './routes/payments.js'
import actionLogger from './middleware/logger.js'
import { apiLimiter, authLimiter, paymentsLimiter } from './middleware/rateLimit.js'
import { initStore } from './store/memory.js'

setupPassport()

const app = express()

app.set('trust proxy', 1)
app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(express.json())
app.use('/api', apiLimiter)
app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.clientUrl.startsWith('https'),
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
)
app.use(passport.initialize())
app.use(passport.session())
app.use(actionLogger)

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/servers', serversRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentsLimiter, paymentsRoutes)
app.use('/api/content', contentRoutes)

app.get('/api/health', (_req, res) =>
  res.json({
    ok: true,
    project: 'На Юга',
    steamAuth: isSteamConfigured(),
  }),
)

app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'На Юга API', health: '/api/health' })
})

async function start() {
  validateEnv()
  await initStore()

  const server = app.listen(env.port, '0.0.0.0', () => {
    console.log(`🎮 На Юга API → port ${env.port} (PORT=${process.env.PORT ?? 'not set'})`)
    if (isSteamConfigured()) {
      console.log(`🔐 Steam auth → ${env.steamReturnUrl}`)
    } else {
      console.warn('⚠️  STEAM_API_KEY не задан — добавьте переменные в Railway → Variables')
    }
  })

  server.on('error', (err) => {
    console.error('Server failed to start:', err)
    process.exit(1)
  })
}

void start()
