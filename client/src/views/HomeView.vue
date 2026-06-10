<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Users, Zap, Shield, Coins, Wrench, RefreshCw } from 'lucide-vue-next'
import { PROJECT_NAME, PROJECT_TAGLINE, DISCORD_URL, SERVER_IP } from '@/config'
import { api } from '@/api/client'
import { useServersStore } from '@/stores/servers'
import { useShopStore } from '@/stores/shop'
import StatCard from '@/components/ui/StatCard.vue'
import ServerCard from '@/components/server/ServerCard.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import type { NewsItem } from '@/types'

const serversStore = useServersStore()
const shopStore = useShopStore()
const news = ref<NewsItem[]>([])

const benefits = [
  { title: 'Высокий FPS', desc: 'Оптимизированный сервер', icon: Zap },
  { title: 'Администрация', desc: 'Активная модерация 16/7', icon: Shield },
  { title: 'Экономика', desc: 'Трейдеры и магазин', icon: Coins },
  { title: 'Уникальные моды', desc: 'Собственные доработки', icon: Wrench },
  { title: 'Обновления', desc: 'Еженедельные патчи', icon: RefreshCw },
]

onMounted(async () => {
  serversStore.startPolling(30000)
  await shopStore.fetch()
  const { news: n } = await api.content.news()
  news.value = n
})
onUnmounted(() => serversStore.stopPolling())
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero-bg relative flex min-h-[90vh] items-center">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.08),transparent_60%)]" />
      <div class="relative mx-auto w-full max-w-7xl px-4 py-20 lg:px-8">
        <p class="animate-slide-up font-display text-sm font-semibold uppercase tracking-[0.4em] text-accent">DayZ</p>
        <h1 class="animate-slide-up mt-2 font-display text-5xl font-bold uppercase leading-none text-white sm:text-7xl lg:text-8xl text-glow" style="animation-delay:0.1s">
          {{ PROJECT_NAME }}
        </h1>
        <p class="animate-slide-up mt-4 max-w-lg text-lg text-gray-400" style="animation-delay:0.2s">{{ PROJECT_TAGLINE }}</p>

        <div class="animate-slide-up mt-8 flex flex-wrap gap-3" style="animation-delay:0.3s">
          <a :href="`steam://connect/${SERVER_IP}`" class="btn-primary">Начать играть</a>
          <a :href="DISCORD_URL" target="_blank" class="btn-ghost">Discord</a>
          <RouterLink to="/shop" class="btn-ghost">Магазин</RouterLink>
        </div>

        <div v-if="serversStore.stats" class="animate-slide-up mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" style="animation-delay:0.4s">
          <StatCard label="Онлайн" :value="serversStore.stats.online" :icon="Users" />
          <StatCard label="Макс. онлайн" :value="serversStore.stats.maxOnline" />
          <StatCard label="Игроков всего" :value="serversStore.stats.totalPlayers.toLocaleString('ru-RU')" />
          <StatCard label="Последний вайп" :value="new Date(serversStore.stats.lastWipe).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })" />
          <StatCard label="Следующий вайп" :value="new Date(serversStore.stats.nextWipe).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })" />
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="border-t border-white/5 bg-graphite-light py-16">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 class="section-title text-center">Преимущества</h2>
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div v-for="b in benefits" :key="b.title" class="glass-hover card-shine p-5 text-center">
            <component :is="b.icon" class="mx-auto h-8 w-8 text-accent" />
            <h3 class="mt-3 font-display text-sm font-bold uppercase text-white">{{ b.title }}</h3>
            <p class="mt-1 text-xs text-gray-500">{{ b.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- News -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 class="section-title">Новости</h2>
        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <article v-for="item in news" :key="item.id" class="glass-hover card-shine p-5">
            <span class="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-accent">{{ item.tag }}</span>
            <h3 class="mt-3 font-display text-lg font-bold text-white">{{ item.title }}</h3>
            <p class="mt-2 text-sm text-gray-500">{{ item.excerpt }}</p>
            <p class="mt-3 text-xs text-gray-600">{{ new Date(item.date).toLocaleDateString('ru-RU') }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Servers preview -->
    <section class="border-t border-white/5 bg-graphite-light py-16">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <div class="flex items-end justify-between">
          <h2 class="section-title">Серверы</h2>
          <RouterLink to="/monitoring" class="text-sm text-accent hover:underline">Подробнее →</RouterLink>
        </div>
        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <ServerCard v-for="s in serversStore.servers" :key="s.id" :server="s" :status="serversStore.statuses[s.id]" />
        </div>
      </div>
    </section>

    <!-- Popular shop -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <div class="flex items-end justify-between">
          <h2 class="section-title">Популярное в магазине</h2>
          <RouterLink to="/shop" class="text-sm text-accent hover:underline">Весь каталог →</RouterLink>
        </div>
        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="p in shopStore.popular().slice(0, 4)" :key="p.id" :product="p" />
        </div>
      </div>
    </section>
  </div>
</template>
