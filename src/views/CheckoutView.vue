<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()

const steamId = ref('')
const nickname = ref('')
const serverId = ref('main')
const agreed = ref(false)
const submitted = ref(false)
const errors = ref({})

const servers = [
  { id: 'main', name: 'На Юга | Основной' },
  { id: 'hardcore', name: 'На Юга | Hardcore' },
]

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price)
}

function validate() {
  errors.value = {}

  if (!steamId.value.trim()) {
    errors.value.steamId = 'Укажите Steam ID'
  } else if (!/^\d{17}$/.test(steamId.value.trim())) {
    errors.value.steamId = 'Steam ID должен содержать 17 цифр'
  }

  if (!nickname.value.trim()) {
    errors.value.nickname = 'Укажите никнейм в игре'
  }

  if (!agreed.value) {
    errors.value.agreed = 'Необходимо согласие с правилами'
  }

  return Object.keys(errors.value).length === 0
}

function submit() {
  if (!validate()) return

  submitted.value = true
  cart.clearCart()

  setTimeout(() => {
    router.push('/shop')
  }, 4000)
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 class="section-title">Оформление заказа</h1>

    <div v-if="submitted" class="card mt-8 p-8 text-center">
      <p class="text-5xl">✅</p>
      <h2 class="mt-4 font-display text-2xl font-bold uppercase text-white">Заказ принят!</h2>
      <p class="mt-2 text-gray-500">
        Предметы будут выданы на сервере в течение 5 минут после оплаты.
        Сейчас это демо-режим — подключите платёжную систему на бэкенде.
      </p>
    </div>

    <template v-else>
      <div v-if="!cart.items.length" class="mt-16 text-center">
        <p class="text-gray-500">Корзина пуста</p>
        <RouterLink to="/shop" class="btn-primary mt-4 inline-flex">В магазин</RouterLink>
      </div>

      <form v-else class="mt-8 space-y-6" @submit.prevent="submit">
        <div class="card p-6">
          <h2 class="font-display text-sm font-semibold uppercase tracking-wider text-gray-400">Данные игрока</h2>

          <div class="mt-4 space-y-4">
            <div>
              <label class="mb-1.5 block text-sm text-gray-400">Steam ID (17 цифр)</label>
              <input
                v-model="steamId"
                type="text"
                placeholder="76561198000000000"
                class="input"
                :class="{ 'border-danger': errors.steamId }"
              />
              <p v-if="errors.steamId" class="mt-1 text-xs text-red-400">{{ errors.steamId }}</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm text-gray-400">Никнейм в игре</label>
              <input
                v-model="nickname"
                type="text"
                placeholder="Survivor"
                class="input"
                :class="{ 'border-danger': errors.nickname }"
              />
              <p v-if="errors.nickname" class="mt-1 text-xs text-red-400">{{ errors.nickname }}</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm text-gray-400">Сервер</label>
              <select v-model="serverId" class="input">
                <option v-for="s in servers" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="font-display text-sm font-semibold uppercase tracking-wider text-gray-400">Ваш заказ</h2>
          <ul class="mt-4 divide-y divide-surface-border">
            <li
              v-for="item in cart.items"
              :key="item.id"
              class="flex items-center justify-between py-3 text-sm"
            >
              <span class="text-gray-300">{{ item.icon }} {{ item.name }} × {{ item.quantity }}</span>
              <span class="text-accent">{{ formatPrice(item.price * item.quantity) }} ₽</span>
            </li>
          </ul>
          <div class="mt-4 flex justify-between border-t border-surface-border pt-4 text-lg font-semibold">
            <span class="text-white">Итого</span>
            <span class="text-accent">{{ formatPrice(cart.totalPrice) }} ₽</span>
          </div>
        </div>

        <label class="flex items-start gap-3 text-sm text-gray-500">
          <input v-model="agreed" type="checkbox" class="mt-1 accent-accent" />
          <span>
            Я согласен с правилами сервера и понимаю, что возврат средств возможен только при технических ошибках
          </span>
        </label>
        <p v-if="errors.agreed" class="text-xs text-red-400">{{ errors.agreed }}</p>

        <button type="submit" class="btn-primary w-full py-3 text-base">
          Оплатить {{ formatPrice(cart.totalPrice) }} ₽
        </button>

        <p class="text-center text-xs text-gray-600">
          Демо-режим. Для реальных платежей подключите ЮKassa или другую платёжную систему через бэкенд.
        </p>
      </form>
    </template>
  </div>
</template>
