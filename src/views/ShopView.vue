<script setup>
import { computed, ref } from 'vue'
import { categories, products } from '@/data/products'
import ProductCard from '@/components/shop/ProductCard.vue'
import CategoryFilter from '@/components/shop/CategoryFilter.vue'

const activeCategory = ref('all')
const searchQuery = ref('')

const filteredProducts = computed(() => {
  let result = products

  if (activeCategory.value !== 'all') {
    result = result.filter((p) => p.category === activeCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    )
  }

  return result
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="section-title">Магазин</h1>
      <p class="mt-2 text-gray-500">Внутриигровые предметы для сервера «На Юга»</p>
    </div>

    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <CategoryFilter
        :categories="categories"
        :active="activeCategory"
        @update:active="activeCategory = $event"
      />
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Поиск товаров..."
        class="input sm:max-w-xs"
      />
    </div>

    <div v-if="filteredProducts.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <div v-else class="py-20 text-center">
      <p class="text-gray-500">Ничего не найдено. Попробуйте другой запрос.</p>
    </div>
  </div>
</template>
