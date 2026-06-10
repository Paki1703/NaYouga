import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  function addItem(product) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeItem(productId) {
    items.value = items.value.filter((i) => i.id !== productId)
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((i) => i.id === productId)
    if (!item) return
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      item.quantity = quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
})
