<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price)
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 class="section-title">Корзина</h1>

    <div v-if="cart.items.length" class="mt-8 grid gap-8 lg:grid-cols-3">
      <div class="space-y-4 lg:col-span-2">
        <article
          v-for="item in cart.items"
          :key="item.id"
          class="card flex items-center gap-4 p-4"
        >
          <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-surface-overlay text-2xl">
            {{ item.icon }}
          </span>

          <div class="min-w-0 flex-1">
            <h3 class="font-display font-semibold uppercase text-white">{{ item.name }}</h3>
            <p class="text-sm text-accent">{{ formatPrice(item.price) }} ₽</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="flex h-8 w-8 items-center justify-center rounded border border-surface-border text-gray-400 hover:border-accent hover:text-accent"
              @click="cart.updateQuantity(item.id, item.quantity - 1)"
            >
              −
            </button>
            <span class="w-8 text-center text-sm font-semibold">{{ item.quantity }}</span>
            <button
              class="flex h-8 w-8 items-center justify-center rounded border border-surface-border text-gray-400 hover:border-accent hover:text-accent"
              @click="cart.updateQuantity(item.id, item.quantity + 1)"
            >
              +
            </button>
          </div>

          <button
            class="text-gray-600 transition-colors hover:text-red-400"
            title="Удалить"
            @click="cart.removeItem(item.id)"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </article>
      </div>

      <div class="card h-fit p-6">
        <h2 class="font-display text-lg font-semibold uppercase text-white">Итого</h2>

        <div class="mt-4 space-y-2 text-sm">
          <div class="flex justify-between text-gray-500">
            <span>Товаров</span>
            <span>{{ cart.totalItems }}</span>
          </div>
          <div class="flex justify-between border-t border-surface-border pt-2 text-lg font-semibold text-white">
            <span>Сумма</span>
            <span class="text-accent">{{ formatPrice(cart.totalPrice) }} ₽</span>
          </div>
        </div>

        <RouterLink to="/checkout" class="btn-primary mt-6 w-full">
          Оформить заказ
        </RouterLink>

        <button class="btn-secondary mt-3 w-full" @click="cart.clearCart()">
          Очистить корзину
        </button>
      </div>
    </div>

    <div v-else class="mt-16 text-center">
      <p class="text-5xl">🛒</p>
      <p class="mt-4 text-lg text-gray-500">Корзина пуста</p>
      <RouterLink to="/shop" class="btn-primary mt-6 inline-flex">
        Перейти в магазин
      </RouterLink>
    </div>
  </div>
</template>
