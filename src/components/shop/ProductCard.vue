<script setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: { type: Object, required: true },
})

const cart = useCartStore()

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price)
}
</script>

<template>
  <article class="card group flex flex-col overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
    <div class="relative flex h-36 items-center justify-center bg-surface-overlay">
      <span class="text-5xl transition-transform duration-300 group-hover:scale-110">{{ product.icon }}</span>
      <span
        v-if="product.popular"
        class="badge absolute right-3 top-3 bg-accent/20 text-accent"
      >
        Популярное
      </span>
    </div>

    <div class="flex flex-1 flex-col p-4">
      <h3 class="font-display text-lg font-semibold uppercase text-white">{{ product.name }}</h3>
      <p class="mt-1 flex-1 text-sm text-gray-500">{{ product.description }}</p>

      <div class="mt-4 flex items-center justify-between">
        <span class="font-display text-xl font-bold text-accent">{{ formatPrice(product.price) }} ₽</span>
        <button class="btn-primary text-xs" @click="cart.addItem(product)">
          В корзину
        </button>
      </div>
    </div>
  </article>
</template>
