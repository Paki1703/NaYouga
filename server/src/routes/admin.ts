import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import { addAdminLog, getAdminLogs, getPromocodes, getSalesStats, giveMoneyToUser, getAllLogs, getAllUsers, setUserBalance, adjustBalance, banUser, unbanUser, timebanUser } from '../store/memory.js'
import { products } from '../data/products.js'
import { news } from '../data/news.js'

const router = Router()
router.use(requireAdmin)

router.get('/stats', (_req, res) => {
  res.json(getSalesStats())
})

router.get('/logs', (_req, res) => {
  res.json({ logs: getAllLogs() })
})

router.get('/promocodes', (_req, res) => {
  res.json({ promocodes: getPromocodes() })
})

router.get('/products', (_req, res) => {
  res.json({ products })
})

router.get('/news', (_req, res) => {
  res.json({ news })
})

router.get('/users', (_req, res) => {
  res.json({ users: getAllUsers() })
})

router.put('/users/:steamId/balance', (req, res) => {
  const { steamId } = req.params
  const { balance } = req.body
  if (balance == null || Number(balance) < 0) return res.status(400).json({ error: 'Некорректный баланс' })
  const result = setUserBalance(steamId, Number(balance))
  if (!result.success) return res.status(400).json({ error: result.error })
  addAdminLog(req.session.steamId!, 'Изменение баланса', `${steamId} → ${balance} монет`)
  res.json({ success: true, user: result.user })
})

router.post('/users/:steamId/adjust', (req, res) => {
  const { steamId } = req.params
  const { amount } = req.body
  if (!amount || Number(amount) === 0) return res.status(400).json({ error: 'Укажите сумму' })
  const result = adjustBalance(steamId, Number(amount))
  if (!result.success) return res.status(400).json({ error: result.error })
  addAdminLog(req.session.steamId!, 'Корректировка баланса', `${amount > 0 ? '+' : ''}${amount} → ${steamId} (итог: ${result.user!.balance})`)
  res.json({ success: true, user: result.user })
})

router.post('/users/:steamId/ban', (req, res) => {
  const { steamId } = req.params
  const result = banUser(steamId)
  if (!result.success) return res.status(400).json({ error: result.error })
  addAdminLog(req.session.steamId!, 'Бан пользователя', `${steamId} забанен`)
  res.json({ success: true, user: result.user })
})

router.post('/users/:steamId/unban', (req, res) => {
  const { steamId } = req.params
  const result = unbanUser(steamId)
  if (!result.success) return res.status(400).json({ error: result.error })
  addAdminLog(req.session.steamId!, 'Разбан пользователя', `${steamId} разбанен`)
  res.json({ success: true, user: result.user })
})

router.post('/users/:steamId/timeban', (req, res) => {
  const { steamId } = req.params
  const { minutes } = req.body
  const mins = Number(minutes) || 10
  const result = timebanUser(steamId, mins)
  if (!result.success) return res.status(400).json({ error: result.error })
  addAdminLog(req.session.steamId!, 'Временный бан', `${steamId} забанен на ${mins} мин.`)
  res.json({ success: true, user: result.user })
})

router.put('/products/:id/price', (req, res) => {
  const product = products.find((p) => p.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Не найдено' })
  product.price = Number(req.body.price)
  addAdminLog(req.session.steamId!, 'Изменение цены', `${product.name} → ${product.price}`)
  res.json({ product })
})

router.post('/deliver-manual', (req, res) => {
  const { steamId, itemName } = req.body
  addAdminLog(req.session.steamId!, 'Ручная выдача', `${itemName} → ${steamId}`)
  res.json({ ok: true })
})

router.post('/give-money', (req, res) => {
  const { steamId, amount, reason } = req.body
  if (!steamId || !amount) return res.status(400).json({ error: 'Укажите steamId и amount' })
  const result = giveMoneyToUser(steamId, Number(amount), reason || 'Выдача админом')
  if (!result.success) return res.status(400).json({ error: result.error })
  addAdminLog(req.session.steamId!, 'Выдача денег', `${amount} монет → ${steamId} (${reason || 'Выдача админом'})`)
  res.json({ success: true, user: result.user })
})

export default router
