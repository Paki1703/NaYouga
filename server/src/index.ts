import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { env, isSteamConfigured } from './config/env.js'
import { setupPassport, passport } from './passport/steam.js'
import authRoutes from './routes/auth.js'
import productsRoutes from './routes/products.js'
import serversRoutes from './routes/servers.js'
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'
import contentRoutes from './routes/content.js'

setupPassport()

const app = express()

app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(express.json())
app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.clientUrl.startsWith('https'),
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/servers', serversRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/content', contentRoutes)

app.get('/api/health', (_req, res) =>
  res.json({
    ok: true,
    project: 'На Юга',
    steamAuth: isSteamConfigured(),
  }),
)

app.listen(env.port, () => {
  console.log(`🎮 На Юга API → http://localhost:${env.port}`)
  if (isSteamConfigured()) {
    console.log(`🔐 Steam auth → ${env.steamReturnUrl}`)
  }
})
