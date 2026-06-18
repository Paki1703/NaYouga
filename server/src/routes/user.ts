import { Router } from 'express'
import { requireAuth, requireNotBanned } from '../middleware/auth.js'
import { promoLimiter } from '../middleware/rateLimit.js'
import { activatePromo, deliverItem, getUser, purchaseProduct } from '../store/memory.js'
import { products } from '../data/products.js'

const router = Router()

router.post('/purchase', requireNotBanned, (req, res) => {
  const { productId } = req.body
  const result = purchaseProduct(req.session.steamId!, productId)
  if (!result.success) return res.status(400).json({ error: result.error })
  res.json({ purchase: result.purchase, user: getUser(req.session.steamId!) })
})

router.post('/promo', promoLimiter, requireNotBanned, (req, res) => {
  const { code } = req.body
  const result = activatePromo(req.session.steamId!, String(code ?? '').slice(0, 64))
  if (!result.success) return res.status(400).json({ error: result.error })
  res.json({ reward: result.reward, user: getUser(req.session.steamId!) })
})

router.post('/deliver', requireAuth, (req, res) => {
  const { itemId } = req.body
  const ok = deliverItem(req.session.steamId!, itemId)
  if (!ok) return res.status(400).json({ error: 'Не удалось выдать' })
  res.json({ user: getUser(req.session.steamId!) })
})

router.post('/open-case', requireNotBanned, (req, res) => {
  const { productId } = req.body
  const product = products.find((p) => p.id === productId && p.category === 'cases')
  if (!product?.probabilities) return res.status(400).json({ error: 'Не кейс' })

  const purchaseResult = purchaseProduct(req.session.steamId!, productId)
  if (!purchaseResult.success) return res.status(400).json({ error: purchaseResult.error })

  const roll = Math.random() * 100
  let cumulative = 0
  let won = product.probabilities[0]
  for (const prob of product.probabilities) {
    cumulative += prob.chance
    if (roll <= cumulative) { won = prob; break }
  }

  res.json({ won: won.item, chance: won.chance, user: getUser(req.session.steamId!) })
})

export default router
