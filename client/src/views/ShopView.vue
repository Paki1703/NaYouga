<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { useShopStore } from '@/stores/shop'
import ShopBanner from '@/components/shop/ShopBanner.vue'
import ProductCard from '@/components/shop/ProductCard.vue'

const route = useRoute()
const shop = useShopStore()
const activeCategory = ref('all')
const search = ref('')

const filtered = computed(() => {
  let list = shop.products
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }
  return list
})

onMounted(async () => {
  if (route.query.category) activeCategory.value = String(route.query.category)
  await shop.fetch(activeCategory.value !== 'all' ? { category: activeCategory.value } : undefined)
})

watch(activeCategory, async (cat) => {
  await shop.fetch(cat !== 'all' ? { category: cat } : undefined)
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <h1 class="section-title">Магазин</h1>
    <p class="mt-2 text-gray-500">Игровой маркетплейс сервера «На Юга»</p>

    <!-- Banners -->
    <div class="mt-8 grid gap-4 md:grid-cols-3">
      <ShopBanner v-for="b in shop.banners" :key="b.id" :banner="b" />
    </div>

    <!-- Sections -->
    <div v-if="activeCategory === 'all'" class="mt-10 space-y-10">
      <section v-if="shop.popular().length">
        <h2 class="font-display text-lg font-bold uppercase tracking-wider text-white">Популярное</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="p in shop.popular().slice(0, 4)" :key="p.id" :product="p" />
        </div>
      </section>
      <section v-if="shop.newest().length">
        <h2 class="font-display text-lg font-bold uppercase tracking-wider text-white">Новинки</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="p in shop.newest()" :key="p.id" :product="p" />
        </div>
      </section>
      <section v-if="shop.discounted().length">
        <h2 class="font-display text-lg font-bold uppercase tracking-wider text-white">Скидки</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="p in shop.discounted()" :key="p.id" :product="p" />
        </div>
      </section>
    </div>

    <!-- Filters -->
    <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap gap-2">
        <button v-for="cat in shop.categories" :key="cat.id"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all"
          :class="activeCategory === cat.id ? 'border-accent bg-accent/10 text-accent' : 'border-white/5 text-gray-500 hover:border-white/10 hover:text-white'"
          @click="activeCategory = cat.id"
        >{{ cat.icon }} {{ cat.name }}</button>
      </div>
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
        <input v-model="search" type="search" placeholder="Поиск товаров..." class="input !pl-10 sm:w-64" />
      </div>
    </div>

    <!-- Grid -->
    <div v-if="shop.loading" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 8" :key="i" class="h-72 animate-pulse rounded-xl bg-white/5" />
    </div>
    <div v-else-if="filtered.length" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
    </div>
    <p v-else class="mt-16 text-center text-gray-500">Товары не найдены</p>
  </div>
</template>
