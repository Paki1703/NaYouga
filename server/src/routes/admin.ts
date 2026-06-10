import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import { addAdminLog, getAdminLogs, getPromocodes, getSalesStats, giveMoneyToUser } from '../store/memory.js'
import { products } from '../data/products.js'
import { news } from '../data/news.js'

const router = Router()
router.use(requireAdmin)

router.get('/stats', (_req, res) => {
  res.json(getSalesStats())
})

router.get('/logs', (_req, res) => {
  res.json({ logs: getAdminLogs() })
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
