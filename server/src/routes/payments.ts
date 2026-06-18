import { Router } from 'express'
import { requireAuth, requireNotBanned } from '../middleware/auth.js'
import { env } from '../config/env.js'
import { topupBalance, addActionLog, getUser, isPaymentProcessed, markPaymentProcessed, persistNow } from '../store/memory.js'

const router = Router()

// Create payment via YooKassa
router.post('/create', requireNotBanned, async (req, res) => {
  const { amount } = req.body
  const steamId = req.session.steamId!
  if (!amount || Number(amount) < 1) return res.status(400).json({ error: 'Некорректная сумма' })

  if (!env.yookassaShopId || !env.yookassaSecret) {
    return res.status(503).json({ error: 'Платежи временно недоступны. Обратитесь к администратору.' })
  }

  try {
    const body = {
      amount: { value: String(Number(amount).toFixed(2)), currency: 'RUB' },
      confirmation: { type: 'redirect', return_url: `${env.clientUrl}/payment/success` },
      capture: true,
      description: `Topup for ${steamId}`,
      metadata: { steamId },
    }

    const resp = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(env.yookassaShopId + ':' + env.yookassaSecret).toString('base64'),
      },
      body: JSON.stringify(body),
    })

    const data = await resp.json()
    if (!resp.ok) return res.status(500).json({ error: 'Payment creation failed', details: data })

    const url = data.confirmation?.confirmation_url || data.confirmation?.url || (data.confirmation && data.confirmation.type === 'redirect' && data.confirmation.return_url)
    addActionLog(steamId, 'Topup initiated', `amount=${amount} paymentId=${data.id}`)
    res.json({ payment: data, confirmationUrl: url })
  } catch (e) {
    res.status(500).json({ error: 'Ошибка создания платежа' })
  }
})

// Webhook endpoint for YooKassa
router.post('/webhook', async (req, res) => {
  // Verify YooKassa Basic auth when configured; reject spoofed webhooks
  if (env.yookassaShopId && env.yookassaSecret) {
    const header = req.headers.authorization
    if (!header || !header.toLowerCase().startsWith('basic ')) {
      addActionLog('system', 'Webhook rejected', 'missing Basic auth')
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const received = Buffer.from(header.slice(6), 'base64').toString('utf8')
    const expected = `${env.yookassaShopId}:${env.yookassaSecret}`
    if (received !== expected) {
      addActionLog('system', 'Webhook rejected', 'bad credentials')
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const event = req.body
  try {
    if (event && event.event && event.event === 'payment.succeeded') {
      const payment = event.data.object || event.object || event.data || {}
      const amount = Number((payment.amount && payment.amount.value) || payment.amount)
      const steamId = (payment.metadata && payment.metadata.steamId) || (payment.description && String(payment.description).replace(/^Topup for /, ''))
      const paymentId = String(payment.id || payment.payment_id || '')

      if (paymentId && isPaymentProcessed(paymentId)) {
        addActionLog('system', 'Webhook duplicate skipped', `paymentId=${paymentId}`)
        return res.status(200).json({ ok: true, duplicate: true })
      }

      if (steamId && amount) {
        topupBalance(steamId, Math.round(amount))
        if (paymentId) markPaymentProcessed(paymentId)
        addActionLog(steamId, 'Topup completed', `+${amount} монет paymentId=${paymentId}`)
        await persistNow()
      } else {
        addActionLog('system', 'Webhook payment succeeded', `missing steamId or amount: ${JSON.stringify(payment)}`)
      }
    }
  } catch (e) {
    // swallow
  }
  res.status(200).json({ ok: true })
})

export default router
