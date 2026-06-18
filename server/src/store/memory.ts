import { v4 as uuid } from 'uuid'
import type { User, PromoCode, AdminLog, Purchase } from '../types.js'
import { products } from '../data/products.js'
import { loadState, saveState, type PersistedState } from './persistence.js'

const users = new Map<string, User>()

const seedPromocodes: PromoCode[] = [
  { code: 'NAYOUGA2026', reward: 500, maxUses: 100, usedCount: 12, active: true },
  { code: 'WELCOME100', reward: 100, maxUses: 1000, usedCount: 456, active: true },
  { code: 'VIPTEST', reward: 1000, maxUses: 10, usedCount: 3, active: false },
]
const promocodes = new Map<string, PromoCode>(seedPromocodes.map((p) => [p.code, p]))

const adminLogs: AdminLog[] = []
const actionLogs: AdminLog[] = []
const processedPaymentIds = new Set<string>()

let initialized = false
let saveScheduled = false

async function persist() {
  const state: PersistedState = {
    version: 1,
    users: Array.from(users.values()),
    promocodes: Array.from(promocodes.values()),
    adminLogs,
    actionLogs,
    processedPaymentIds: Array.from(processedPaymentIds),
  }
  await saveState(state)
}

function schedulePersist() {
  if (saveScheduled) return
  saveScheduled = true
  queueMicrotask(async () => {
    saveScheduled = false
    try {
      await persist()
    } catch (e) {
      console.error('Persist failed:', (e as Error).message)
    }
  })
}

export async function initStore() {
  if (initialized) return
  initialized = true
  const state = await loadState()
  if (!state) return

  for (const u of state.users) {
    if (u.banned === undefined) u.banned = false
    if (u.banUntil === undefined) u.banUntil = null
    users.set(u.steamId, u)
  }

  for (const p of state.promocodes) promocodes.set(p.code, p)

  for (const l of state.adminLogs) adminLogs.push(l)
  for (const l of state.actionLogs) actionLogs.push(l)
  for (const id of state.processedPaymentIds) processedPaymentIds.add(id)

  adminLogs.sort((a, b) => (a.date < b.date ? 1 : -1))
  actionLogs.sort((a, b) => (a.date < b.date ? 1 : -1))

  console.log(
    `💾 Store loaded: ${users.size} users, ${promocodes.size} promocodes, ${processedPaymentIds.size} processed payments`,
  )
}

export async function persistNow() {
  await persist()
}

export function getOrCreateUser(steamId: string, nickname: string, avatar: string, isAdmin = false): User {
  let user = users.get(steamId)
  if (!user) {
    user = {
      steamId,
      nickname,
      avatar,
      balance: 0,
      isAdmin,
      banned: false,
      banUntil: null,
      privileges: [],
      purchases: [],
      topups: [],
      promocodes: [],
      ownedItems: [],
    }
    users.set(steamId, user)
    schedulePersist()
  } else {
    user.nickname = nickname
    user.avatar = avatar
    user.isAdmin = isAdmin
    schedulePersist()
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
  schedulePersist()
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

  schedulePersist()
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
  schedulePersist()
  return { success: true, reward: promo.reward }
}

export function topupBalance(steamId: string, amount: number): { success: boolean; error?: string } {
  const user = users.get(steamId)
  if (!user) return { success: false, error: 'Пользователь не найден' }
  user.balance += amount
  user.topups.unshift({ id: uuid(), amount, method: 'Демо-пополнение', date: new Date().toISOString() })
  schedulePersist()
  return { success: true }
}

export function giveMoneyToUser(steamId: string, amount: number, reason: string): { success: boolean; error?: string; user?: User } {
  const user = users.get(steamId)
  if (!user) return { success: false, error: 'Пользователь не найден' }
  if (amount <= 0) return { success: false, error: 'Сумма должна быть больше нуля' }
  user.balance += amount
  user.topups.unshift({ id: uuid(), amount, method: reason || 'Выдача админом', date: new Date().toISOString() })
  schedulePersist()
  return { success: true, user }
}

export function deliverItem(steamId: string, itemId: string): boolean {
  const user = users.get(steamId)
  if (!user) return false
  const item = user.ownedItems.find((i) => i.id === itemId)
  if (!item || item.deliveredAt) return false
  item.deliveredAt = new Date().toISOString()
  schedulePersist()
  return true
}

export function getPromocodes(): PromoCode[] {
  return Array.from(promocodes.values())
}

export function getAdminLogs(): AdminLog[] {
  return adminLogs
}

export function getActionLogs(): AdminLog[] {
  return actionLogs
}

export function addActionLog(userId: string, action: string, details: string) {
  actionLogs.unshift({ id: uuid(), adminId: userId, action, details, date: new Date().toISOString() })
  if (actionLogs.length > 1000) actionLogs.length = 1000
  schedulePersist()
}

export function getAllLogs() {
  const combined = [...adminLogs, ...actionLogs].map((l) => ({ id: l.id, action: l.action, details: l.details, date: l.date }))
  combined.sort((a, b) => (a.date < b.date ? 1 : -1))
  return combined
}

export function addAdminLog(adminId: string, action: string, details: string) {
  adminLogs.unshift({ id: uuid(), adminId, action, details, date: new Date().toISOString() })
  if (adminLogs.length > 1000) adminLogs.length = 1000
  schedulePersist()
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

export function isPaymentProcessed(paymentId: string): boolean {
  return processedPaymentIds.has(paymentId)
}

export function markPaymentProcessed(paymentId: string) {
  if (!paymentId) return
  processedPaymentIds.add(paymentId)
  schedulePersist()
}

// ─── Admin user management ───────────────────────────────────────────

export function getAllUsers(): User[] {
  const now = Date.now()
  for (const u of users.values()) {
    if (u.banUntil && new Date(u.banUntil).getTime() <= now) {
      u.banUntil = null
      schedulePersist()
    }
  }
  return Array.from(users.values())
}

export function setUserBalance(steamId: string, balance: number): { success: boolean; error?: string; user?: User } {
  const user = users.get(steamId)
  if (!user) return { success: false, error: 'Пользователь не найден' }
  if (balance < 0) return { success: false, error: 'Баланс не может быть отрицательным' }
  user.balance = Math.round(balance)
  schedulePersist()
  return { success: true, user }
}

export function adjustBalance(steamId: string, amount: number): { success: boolean; error?: string; user?: User } {
  const user = users.get(steamId)
  if (!user) return { success: false, error: 'Пользователь не найден' }
  const newBalance = user.balance + amount
  if (newBalance < 0) return { success: false, error: 'Баланс не может быть отрицательным' }
  user.balance = Math.round(newBalance)
  schedulePersist()
  return { success: true, user }
}

export function banUser(steamId: string): { success: boolean; error?: string; user?: User } {
  const user = users.get(steamId)
  if (!user) return { success: false, error: 'Пользователь не найден' }
  if (user.isAdmin) return { success: false, error: 'Нельзя забанить администратора' }
  user.banned = true
  user.banUntil = null
  schedulePersist()
  return { success: true, user }
}

export function unbanUser(steamId: string): { success: boolean; error?: string; user?: User } {
  const user = users.get(steamId)
  if (!user) return { success: false, error: 'Пользователь не найден' }
  user.banned = false
  user.banUntil = null
  schedulePersist()
  return { success: true, user }
}

export function timebanUser(steamId: string, minutes: number): { success: boolean; error?: string; user?: User } {
  const user = users.get(steamId)
  if (!user) return { success: false, error: 'Пользователь не найден' }
  if (user.isAdmin) return { success: false, error: 'Нельзя забанить администратора' }
  user.banned = false
  user.banUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString()
  schedulePersist()
  return { success: true, user }
}

export function isUserBanned(steamId: string): { banned: boolean; reason?: string } {
  const user = users.get(steamId)
  if (!user) return { banned: false }
  if (user.banned) return { banned: true, reason: 'Аккаунт заблокирован' }
  if (user.banUntil) {
    const until = new Date(user.banUntil).getTime()
    if (until > Date.now()) {
      const mins = Math.ceil((until - Date.now()) / 60000)
      return { banned: true, reason: `Временный бан: осталось ${mins} мин.` }
    }
    user.banUntil = null
    schedulePersist()
  }
  return { banned: false }
}
