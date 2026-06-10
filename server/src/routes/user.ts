import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { activatePromo, deliverItem, getUser, purchaseProduct, topupBalance } from '../store/memory.js'
import { products } from '../data/products.js'

const router = Router()

router.post('/purchase', requireAuth, (req, res) => {
  const { productId } = req.body
  const result = purchaseProduct(req.session.steamId!, productId)
  if (!result.success) return res.status(400).json({ error: result.error })
  res.json({ purchase: result.purchase, user: getUser(req.session.steamId!) })
})

router.post('/promo', requireAuth, (req, res) => {
  const { code } = req.body
  const result = activatePromo(req.session.steamId!, code)
  if (!result.success) return res.status(400).json({ error: result.error })
  res.json({ reward: result.reward, user: getUser(req.session.steamId!) })
})

router.post('/topup', requireAuth, (req, res) => {
  const { amount } = req.body
  if (!amount || amount < 1) return res.status(400).json({ error: 'Некорректная сумма' })
  const result = topupBalance(req.session.steamId!, Number(amount))
  if (!result.success) return res.status(400).json({ error: result.error })
  res.json({ user: getUser(req.session.steamId!) })
})

router.post('/deliver', requireAuth, (req, res) => {
  const { itemId } = req.body
  const ok = deliverItem(req.session.steamId!, itemId)
  if (!ok) return res.status(400).json({ error: 'Не удалось выдать' })
  res.json({ user: getUser(req.session.steamId!) })
})

router.post('/open-case', requireAuth, (req, res) => {
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
