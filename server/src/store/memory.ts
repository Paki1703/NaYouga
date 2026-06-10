import { v4 as uuid } from 'uuid'
import type { User, PromoCode, AdminLog, Purchase } from '../types.js'
import { products } from '../data/products.js'

const users = new Map<string, User>()
const promocodes = new Map<string, PromoCode>([
  ['NAYOUGA2026', { code: 'NAYOUGA2026', reward: 500, maxUses: 100, usedCount: 12, active: true }],
  ['WELCOME100', { code: 'WELCOME100', reward: 100, maxUses: 1000, usedCount: 456, active: true }],
  ['VIPTEST', { code: 'VIPTEST', reward: 1000, maxUses: 10, usedCount: 3, active: false }],
])
const adminLogs: AdminLog[] = []

export function getOrCreateUser(steamId: string, nickname: string, avatar: string, isAdmin = false): User {
  let user = users.get(steamId)
  if (!user) {
    user = {
      steamId,
      nickname,
      avatar,
      balance: 0,
      isAdmin,
      privileges: [],
      purchases: [],
      topups: [],
      promocodes: [],
      ownedItems: [],
    }
    users.set(steamId, user)
  } else {
    user.nickname = nickname
    user.avatar = avatar
    user.isAdmin = isAdmin
  }
  return user
}

export function getUser(steamId: string): User | undefined {
  return users.get(steamId)
}

export function updateUser(steamId: string, data: Partial<User>): User | undefined {
  const user = users.get(steamId)
  if (!user) return undefined
  Object.assign(user, data)
  return user
}

export function purchaseProduct(steamId: string, productId: string): { success: boolean; error?: string; purchase?: Purchase } {
  const user = users.get(steamId)
  const product = products.find((p) => p.id === productId)
  if (!user || !product) return { success: false, error: 'Не найдено' }

  if (product.currency === 'coins' && user.balance < product.price) {
    return { success: false, error: 'Недостаточно монет' }
  }

  const purchase: Purchase = {
    id: uuid(),
    productId: product.id,
    productName: product.name,
    price: product.price,
    currency: product.currency,
    date: new Date().toISOString(),
    status: 'completed',
  }

  if (product.currency === 'coins') {
    user.balance -= product.price
  }

  user.purchases.unshift(purchase)
  user.ownedItems.unshift({
    id: uuid(),
    name: product.name,
    deliveredAt: null,
    serverId: 'main',
  })

  return { success: true, purchase }
}

export function activatePromo(steamId: string, code: string): { success: boolean; error?: string; reward?: number } {
  const user = users.get(steamId)
  const promo = promocodes.get(code.toUpperCase())
  if (!user) return { success: false, error: 'Пользователь не найден' }
  if (!promo || !promo.active) return { success: false, error: 'Промокод недействителен' }
  if (promo.usedCount >= promo.maxUses) return { success: false, error: 'Промокод исчерпан' }
  if (user.promocodes.includes(code.toUpperCase())) return { success: false, error: 'Промокод уже использован' }

  promo.usedCount++
  user.balance += promo.reward
  user.promocodes.push(code.toUpperCase())
  return { success: true, reward: promo.reward }
}

export function topupBalance(steamId: string, amount: number): { success: boolean; error?: string } {
  const user = users.get(steamId)
  if (!user) return { success: false, error: 'Пользователь не найден' }
  user.balance += amount
  user.topups.unshift({ id: uuid(), amount, method: 'Демо-пополнение', date: new Date().toISOString() })
  return { success: true }
}

export function giveMoneyToUser(steamId: string, amount: number, reason: string): { success: boolean; error?: string; user?: User } {
  const user = users.get(steamId)
  if (!user) return { success: false, error: 'Пользователь не найден' }
  if (amount <= 0) return { success: false, error: 'Сумма должна быть больше нуля' }
  user.balance += amount
  user.topups.unshift({ id: uuid(), amount, method: reason || 'Выдача админом', date: new Date().toISOString() })
  return { success: true, user }
}

export function deliverItem(steamId: string, itemId: string): boolean {
  const user = users.get(steamId)
  if (!user) return false
  const item = user.ownedItems.find((i) => i.id === itemId)
  if (!item || item.deliveredAt) return false
  item.deliveredAt = new Date().toISOString()
  return true
}

export function getPromocodes(): PromoCode[] {
  return Array.from(promocodes.values())
}

export function getAdminLogs(): AdminLog[] {
  return adminLogs
}

export function addAdminLog(adminId: string, action: string, details: string) {
  adminLogs.unshift({ id: uuid(), adminId, action, details, date: new Date().toISOString() })
}

export function getSalesStats() {
  const allPurchases = Array.from(users.values()).flatMap((u) => u.purchases)
  const totalRevenue = allPurchases.filter((p) => p.currency === 'coins').reduce((s, p) => s + p.price, 0)
  const totalSales = allPurchases.length
  const byProduct: Record<string, number> = {}
  for (const p of allPurchases) {
    byProduct[p.productName] = (byProduct[p.productName] || 0) + 1
  }
  return { totalRevenue, totalSales, byProduct, totalUsers: users.size }
}
