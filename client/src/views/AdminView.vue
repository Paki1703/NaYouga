<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BarChart3, Package, Ticket, Newspaper, ScrollText, Gift } from 'lucide-vue-next'
import { api } from '@/api/client'
import GlassCard from '@/components/ui/GlassCard.vue'

const tab = ref('stats')
const stats = ref<Record<string, unknown> | null>(null)
const logs = ref<{ id: string; action: string; details: string; date: string }[]>([])
const promocodes = ref<{ code: string; reward: number; usedCount: number; maxUses: number; active: boolean }[]>([])
const products = ref<{ id: string; name: string; price: number }[]>([])

// Форма выдачи денег
const moneyForm = ref({
  steamId: '',
  amount: 0,
  reason: '',
})
const moneyLoading = ref(false)
const moneyMessage = ref('')

const tabs = [
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'products', label: 'Товары', icon: Package },
  { id: 'money', label: 'Выдача денег', icon: Gift },
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

async function updatePrice(id: string, price: number) {
  await api.admin.updatePrice(id, price)
  const pr = await api.admin.products()
  products.value = (pr as { products: typeof products.value }).products
}

async function giveMoney() {
  if (!moneyForm.value.steamId || !moneyForm.value.amount) {
    moneyMessage.value = 'Заполните все поля'
    return
  }
  
  moneyLoading.value = true
  try {
    await api.admin.giveMoney(moneyForm.value.steamId, moneyForm.value.amount, moneyForm.value.reason)
    moneyMessage.value = `✅ Успешно выдано ${moneyForm.value.amount} монет игроку ${moneyForm.value.steamId}`
    moneyForm.value = { steamId: '', amount: 0, reason: '' }
    setTimeout(() => { moneyMessage.value = '' }, 5000)
  } catch (err) {
    moneyMessage.value = `❌ Ошибка: ${(err as Error).message}`
  } finally {
    moneyLoading.value = false
  }
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
        @click="tab = t.id"
      ><component :is="t.icon" class="h-4 w-4" /> {{ t.label }}</button>
    </div>

    <div class="mt-6">
      <div v-if="tab === 'stats' && stats" class="grid gap-4 sm:grid-cols-3">
        <GlassCard><p class="text-xs uppercase text-gray-500">Продаж</p><p class="mt-1 font-display text-3xl font-bold text-white">{{ stats.totalSales }}</p></GlassCard>
        <GlassCard><p class="text-xs uppercase text-gray-500">Выручка (монеты)</p><p class="mt-1 font-display text-3xl font-bold text-accent">{{ stats.totalRevenue }}</p></GlassCard>
        <GlassCard><p class="text-xs uppercase text-gray-500">Пользователей</p><p class="mt-1 font-display text-3xl font-bold text-white">{{ stats.totalUsers }}</p></GlassCard>
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

      <div v-if="tab === 'money'" class="glass max-w-2xl p-6">
        <h3 class="text-xl font-bold text-white mb-6">Выдать деньги игроку</h3>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-2">Steam ID</label>
            <input 
              v-model="moneyForm.steamId" 
              type="text" 
              placeholder="76561198123456789"
              class="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-600 focus:border-accent focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-400 mb-2">Сумма (монет)</label>
              <input 
                v-model.number="moneyForm.amount" 
                type="number" 
                placeholder="1000"
                class="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-600 focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-400 mb-2">Причина (опционально)</label>
              <input 
                v-model="moneyForm.reason" 
                type="text" 
                placeholder="Бонус, компенсация..."
                class="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-600 focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button 
          @click="giveMoney"
          :disabled="moneyLoading"
          class="w-full rounded-lg bg-accent px-6 py-3 font-semibold text-graphite transition-all hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ moneyLoading ? 'Обработка...' : 'Выдать деньги' }}
        </button>

        <div v-if="moneyMessage" class="mt-4 rounded-lg border p-4" :class="moneyMessage.includes('✅') ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'">
          {{ moneyMessage }}
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
