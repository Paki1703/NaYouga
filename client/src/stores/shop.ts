import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, Category, ShopBanner } from '@/types'
import { api } from '@/api/client'

export const useShopStore = defineStore('shop', () => {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const banners = ref<ShopBanner[]>([])
  const loading = ref(false)

  async function fetch(params?: Record<string, string>) {
    loading.value = true
    try {
      const data = await api.products.list(params)
      products.value = data.products
      categories.value = data.categories
      banners.value = data.banners
    } finally { loading.value = false }
  }

  const popular = () => products.value.filter((p) => p.popular)
  const newest = () => products.value.filter((p) => p.isNew)
  const discounted = () => products.value.filter((p) => p.discount)

  return { products, categories, banners, loading, fetch, popular, newest, discounted }
})
