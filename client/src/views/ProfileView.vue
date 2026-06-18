<script setup lang="ts">
import { ref } from 'vue'
import { Coins, Gift, Package, CreditCard, Send, Ticket } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/api/client'
import GlassCard from '@/components/ui/GlassCard.vue'

const auth = useAuthStore()
const tab = ref('purchases')
const promoCode = ref('')
const topupAmount = ref(500)
const message = ref('')
const error = ref('')

const tabs = [
  { id: 'purchases', label: 'Покупки', icon: Package },
  { id: 'items', label: 'Товары', icon: Gift },
  { id: 'topups', label: 'Пополнения', icon: CreditCard },
  { id: 'promos', label: 'Промокоды', icon: Ticket },
  { id: 'privileges', label: 'Привилегии', icon: Coins },
]

async function activatePromo() {
  error.value = ''; message.value = ''
  try {
    const res = await api.user.promo(promoCode.value) as { reward: number; user: typeof auth.user }
    auth.setUser(res.user!)
    message.value = `+${res.reward} монет!`
    promoCode.value = ''
  } catch (e) { error.value = (e as Error).message }
}

async function topup() {
  error.value = ''; message.value = ''
  try {
    const res = await api.payments.create(topupAmount.value) as any
    const url = res.confirmationUrl || (res.payment && res.payment.confirmation && res.payment.confirmation.confirmation_url)
    if (url) {
      window.location.href = url
    } else {
      error.value = 'Не удалось создать платёж'
    }
  } catch (e) { error.value = (e as Error).message }
}

async function deliver(itemId: string) {
  try {
    const res = await api.user.deliver(itemId) as { user: typeof auth.user }
    auth.setUser(res.user!)
    message.value = 'Предмет передан на сервер!'
  } catch (e) { error.value = (e as Error).message }
}
</script>

<template>
  <div v-if="auth.user" class="mx-auto max-w-5xl px-4 py-10 lg:px-8">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
      <img :src="auth.user.avatar" class="h-20 w-20 rounded-xl border border-white/10" alt="" />
      <div>
        <h1 class="font-display text-3xl font-bold uppercase text-white">{{ auth.user.nickname }}</h1>
        <p class="text-sm text-gray-500">Steam ID: {{ auth.user.steamId }}</p>
        <p class="mt-1 font-display text-xl font-bold text-accent">{{ auth.user.balance.toLocaleString('ru-RU') }} монет</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      <GlassCard>
        <h3 class="font-display text-sm font-bold uppercase text-gray-400">Пополнение баланса</h3>
        <div class="mt-3 flex gap-2">
          <input v-model.number="topupAmount" type="number" class="input" min="100" step="100" />
          <button class="btn-primary shrink-0" @click="topup">Пополнить</button>
        </div>
        <p class="mt-2 text-xs text-gray-600">Оплата через ЮKassa. Введите сумму в рублях.</p>
      </GlassCard>
      <GlassCard>
        <h3 class="font-display text-sm font-bold uppercase text-gray-400">Промокод</h3>
        <div class="mt-3 flex gap-2">
          <input v-model="promoCode" type="text" placeholder="Введите код" class="input uppercase" />
          <button class="btn-primary shrink-0" @click="activatePromo">Активировать</button>
        </div>
      </GlassCard>
    </div>
    <p v-if="message" class="mt-3 text-sm text-green-400">{{ message }}</p>
    <p v-if="error" class="mt-3 text-sm text-red-400">{{ error }}</p>

    <!-- Tabs -->
    <div class="mt-8 flex gap-1 overflow-x-auto border-b border-white/5">
      <button v-for="t in tabs" :key="t.id"
        class="flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors"
        :class="tab === t.id ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-white'"
        @click="tab = t.id"
      ><component :is="t.icon" class="h-4 w-4" /> {{ t.label }}</button>
    </div>

    <div class="mt-6">
      <div v-if="tab === 'purchases'" class="space-y-2">
        <div v-for="p in auth.user.purchases" :key="p.id" class="glass flex items-center justify-between p-4 text-sm">
          <span class="text-gray-300">{{ p.productName }}</span>
          <span class="text-accent">{{ p.price }} {{ p.currency === 'rub' ? '₽' : 'монет' }}</span>
          <span class="text-xs text-gray-600">{{ new Date(p.date).toLocaleString('ru-RU') }}</span>
        </div>
        <p v-if="!auth.user.purchases.length" class="text-gray-600">Нет покупок</p>
      </div>

      <div v-if="tab === 'items'" class="space-y-2">
        <div v-for="item in auth.user.ownedItems" :key="item.id" class="glass flex items-center justify-between p-4 text-sm">
          <span class="text-gray-300">{{ item.name }}</span>
          <span v-if="item.deliveredAt" class="text-xs text-green-400">Выдано</span>
          <button v-else class="btn-primary !px-3 !py-1 text-xs" @click="deliver(item.id)">
            <Send class="h-3 w-3" /> На сервер
          </button>
        </div>
        <p v-if="!auth.user.ownedItems.length" class="text-gray-600">Нет товаров</p>
      </div>

      <div v-if="tab === 'topups'" class="space-y-2">
        <div v-for="t in auth.user.topups" :key="t.id" class="glass flex items-center justify-between p-4 text-sm">
          <span class="text-green-400">+{{ t.amount }} монет</span>
          <span class="text-gray-500">{{ t.method }}</span>
          <span class="text-xs text-gray-600">{{ new Date(t.date).toLocaleString('ru-RU') }}</span>
        </div>
      </div>

      <div v-if="tab === 'promos'" class="space-y-2">
        <div v-for="code in auth.user.promocodes" :key="code" class="glass p-4 font-mono text-sm text-accent">{{ code }}</div>
        <p v-if="!auth.user.promocodes.length" class="text-gray-600">Промокоды не использовались</p>
      </div>

      <div v-if="tab === 'privileges'" class="space-y-2">
        <div v-for="priv in auth.user.privileges" :key="priv.name" class="glass p-4 text-sm">
          <span class="text-white">{{ priv.name }}</span>
          <span class="ml-2 text-gray-500">до {{ new Date(priv.expiresAt).toLocaleDateString('ru-RU') }}</span>
        </div>
        <p v-if="!auth.user.privileges.length" class="text-gray-600">Нет активных привилегий</p>
      </div>
    </div>
  </div>
</template>
