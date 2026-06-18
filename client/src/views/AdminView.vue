<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { BarChart3, Package, Ticket, Newspaper, ScrollText, Gift, Users, Search } from 'lucide-vue-next'
import { api } from '@/api/client'
import type { User } from '@/types'
import GlassCard from '@/components/ui/GlassCard.vue'

const tab = ref('stats')
const stats = ref<Record<string, unknown> | null>(null)
const logs = ref<{ id: string; action: string; details: string; date: string }[]>([])
const promocodes = ref<{ code: string; reward: number; usedCount: number; maxUses: number; active: boolean }[]>([])
const products = ref<{ id: string; name: string; price: number }[]>([])

const users = ref<User[]>([])
const userSearch = ref('')
const userLoading = ref(false)
const userMessage = ref('')
const editingBalance = ref<Record<string, string>>({})

const filteredUsers = computed(() => {
  const q = userSearch.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((u) =>
    u.nickname.toLowerCase().includes(q) || u.steamId.includes(q),
  )
})

const tabs = [
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'users', label: 'Пользователи', icon: Users },
  { id: 'products', label: 'Товары', icon: Package },
  { id: 'promos', label: 'Промокоды', icon: Ticket },
  { id: 'news', label: 'Новости', icon: Newspaper },
  { id: 'logs', label: 'Логи', icon: ScrollText },
]

onMounted(async () => {
  stats.value = await api.admin.stats() as Record<string, unknown>
  const [l, p, pr] = await Promise.all([api.admin.logs(), api.admin.promocodes(), api.admin.products()])
  logs.value = (l as { logs: typeof logs.value }).logs
  promocodes.value = (p as { promocodes: typeof promocodes.value }).promocodes
  products.value = (pr as { products: typeof products.value }).products
})

async function fetchUsers() {
  userLoading.value = true
  try {
    const res = await api.admin.users()
    users.value = res.users
  } catch (e) {
    userMessage.value = `Ошибка: ${(e as Error).message}`
  } finally {
    userLoading.value = false
  }
}

async function loadUsersIfNeeded() {
  if (tab.value === 'users' && users.value.length === 0) {
    await fetchUsers()
  }
}

async function updatePrice(id: string, price: number) {
  await api.admin.updatePrice(id, price)
  const pr = await api.admin.products()
  products.value = (pr as { products: typeof products.value }).products
}

function userBanStatus(u: User): { label: string; color: string } {
  if (u.banned) return { label: 'Бан', color: 'text-red-400' }
  if (u.banUntil && new Date(u.banUntil).getTime() > Date.now()) {
    const mins = Math.ceil((new Date(u.banUntil).getTime() - Date.now()) / 60000)
    return { label: `Тбан ${mins}м`, color: 'text-orange-400' }
  }
  return { label: 'Активен', color: 'text-green-400' }
}

function flash(msg: string) {
  userMessage.value = msg
  setTimeout(() => { userMessage.value = '' }, 4000)
}

async function saveBalance(u: User) {
  const val = editingBalance.value[u.steamId]
  if (val == null || val === '') return
  const balance = Number(val)
  if (isNaN(balance) || balance < 0) { flash('Некорректный баланс'); return }
  try {
    await api.admin.setBalance(u.steamId, balance)
    u.balance = balance
    delete editingBalance.value[u.steamId]
    flash(`Баланс ${u.nickname} → ${balance} монет`)
  } catch (e) { flash(`Ошибка: ${(e as Error).message}`) }
}

async function addBalance(u: User, amount: number) {
  try {
    const res = await api.admin.adjustBalance(u.steamId, amount) as { user: User }
    u.balance = res.user.balance
    flash(`${amount > 0 ? '+' : ''}${amount} → ${u.nickname} (итог: ${u.balance})`)
  } catch (e) { flash(`Ошибка: ${(e as Error).message}`) }
}

async function banUser(u: User) {
  try {
    await api.admin.ban(u.steamId)
    u.banned = true; u.banUntil = null
    flash(`${u.nickname} забанен`)
  } catch (e) { flash(`Ошибка: ${(e as Error).message}`) }
}

async function unbanUser(u: User) {
  try {
    await api.admin.unban(u.steamId)
    u.banned = false; u.banUntil = null
    flash(`${u.nickname} разбанен`)
  } catch (e) { flash(`Ошибка: ${(e as Error).message}`) }
}

async function timebanUser(u: User) {
  try {
    const res = await api.admin.timeban(u.steamId, 10) as { user: User }
    u.banUntil = res.user.banUntil
    flash(`${u.nickname} забанен на 10 минут`)
  } catch (e) { flash(`Ошибка: ${(e as Error).message}`) }
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 lg:px-8">
    <h1 class="section-title">Админ-панель</h1>
    <p class="mt-2 text-gray-500">Управление проектом «На Юга»</p>

    <div class="mt-8 flex gap-1 overflow-x-auto border-b border-white/5">
      <button v-for="t in tabs" :key="t.id"
        class="flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors"
        :class="tab === t.id ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-white'"
        @click="tab = t.id; loadUsersIfNeeded()"
      ><component :is="t.icon" class="h-4 w-4" /> {{ t.label }}</button>
    </div>

    <div class="mt-6">
      <div v-if="tab === 'stats' && stats" class="grid gap-4 sm:grid-cols-3">
        <GlassCard><p class="text-xs uppercase text-gray-500">Продаж</p><p class="mt-1 font-display text-3xl font-bold text-white">{{ stats.totalSales }}</p></GlassCard>
        <GlassCard><p class="text-xs uppercase text-gray-500">Выручка (монеты)</p><p class="mt-1 font-display text-3xl font-bold text-accent">{{ stats.totalRevenue }}</p></GlassCard>
        <GlassCard><p class="text-xs uppercase text-gray-500">Пользователей</p><p class="mt-1 font-display text-3xl font-bold text-white">{{ stats.totalUsers }}</p></GlassCard>
      </div>

      <div v-if="tab === 'users'" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input v-model="userSearch" type="text" placeholder="Поиск по нику или Steam ID..." class="input !pl-10" />
          </div>
          <button class="btn-ghost" @click="fetchUsers" :disabled="userLoading">
            {{ userLoading ? '...' : 'Обновить' }}
          </button>
        </div>

        <div v-if="userMessage" class="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-300">{{ userMessage }}</div>

        <div class="space-y-2">
          <div v-for="u in filteredUsers" :key="u.steamId" class="glass flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <img :src="u.avatar" class="h-10 w-10 rounded-lg border border-white/10" alt="" />
              <div>
                <p class="font-semibold text-white">{{ u.nickname }}</p>
                <p class="text-xs text-gray-600 font-mono">{{ u.steamId }}</p>
              </div>
              <span v-if="u.isAdmin" class="rounded bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">ADMIN</span>
              <span :class="userBanStatus(u).color" class="text-xs font-semibold">{{ userBanStatus(u).label }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <div class="flex items-center gap-1">
                <input
                  :value="editingBalance[u.steamId] ?? u.balance"
                  @input="editingBalance[u.steamId] = ($event.target as HTMLInputElement).value"
                  type="number"
                  min="0"
                  class="input !w-24 !py-1.5"
                  placeholder="Баланс"
                />
                <button class="btn-primary !px-3 !py-1.5 text-xs" @click="saveBalance(u)">ОК</button>
              </div>
              <button class="btn-ghost !px-2 !py-1.5 text-xs" @click="addBalance(u, 100)" title="+100">+100</button>
              <button class="btn-ghost !px-2 !py-1.5 text-xs" @click="addBalance(u, 500)" title="+500">+500</button>
              <button class="btn-ghost !px-2 !py-1.5 text-xs" @click="addBalance(u, -100)" title="-100">-100</button>

              <div class="mx-1 h-6 w-px bg-white/10"></div>

              <button v-if="!u.banned && !(u.banUntil && new Date(u.banUntil).getTime() > Date.now())"
                class="btn-ghost !px-3 !py-1.5 text-xs !border-orange-500/30 !text-orange-400 hover:!bg-orange-500/10"
                @click="timebanUser(u)" title="Временный бан 10 мин">Тбан</button>
              <button v-if="!u.banned"
                class="btn-ghost !px-3 !py-1.5 text-xs !border-red-500/30 !text-red-400 hover:!bg-red-500/10"
                @click="banUser(u)">Бан</button>
              <button v-if="u.banned || (u.banUntil && new Date(u.banUntil).getTime() > Date.now())"
                class="btn-ghost !px-3 !py-1.5 text-xs !border-green-500/30 !text-green-400 hover:!bg-green-500/10"
                @click="unbanUser(u)">Разбан</button>
            </div>
          </div>
          <p v-if="!filteredUsers.length && !userLoading" class="text-gray-600 text-center py-8">Нет пользователей</p>
        </div>
      </div>

      <div v-if="tab === 'products'" class="space-y-2">
        <div v-for="p in products" :key="p.id" class="glass flex items-center justify-between p-4">
          <span class="text-gray-300">{{ p.name }}</span>
          <div class="flex items-center gap-2">
            <input type="number" :value="p.price" class="input !w-24" @change="updatePrice(p.id, Number(($event.target as HTMLInputElement).value))" />
            <span class="text-xs text-gray-600">монет</span>
          </div>
        </div>
      </div>

      <div v-if="tab === 'promos'" class="space-y-2">
        <div v-for="pc in promocodes" :key="pc.code" class="glass flex items-center justify-between p-4 text-sm">
          <span class="font-mono text-accent">{{ pc.code }}</span>
          <span class="text-gray-400">{{ pc.reward }} монет</span>
          <span class="text-gray-600">{{ pc.usedCount }}/{{ pc.maxUses }}</span>
          <span :class="pc.active ? 'text-green-400' : 'text-red-400'">{{ pc.active ? 'Активен' : 'Отключён' }}</span>
        </div>
      </div>

      <div v-if="tab === 'logs'" class="space-y-2">
        <div v-for="log in logs" :key="log.id" class="glass p-4 text-sm">
          <span class="text-accent">{{ log.action }}</span> — {{ log.details }}
          <span class="ml-2 text-xs text-gray-600">{{ new Date(log.date).toLocaleString('ru-RU') }}</span>
        </div>
        <p v-if="!logs.length" class="text-gray-600">Логов пока нет</p>
      </div>

      <div v-if="tab === 'news'" class="glass p-6 text-center text-gray-500">
        Управление новостями — подключите БД для полного CRUD
      </div>
    </div>
  </div>
</template>
