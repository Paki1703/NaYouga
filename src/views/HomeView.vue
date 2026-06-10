<script setup>
import { onMounted, onUnmounted } from 'vue'
import { servers } from '@/data/servers'
import { products } from '@/data/products'
import { useServersStore } from '@/stores/servers'
import ServerCard from '@/components/server/ServerCard.vue'
import ProductCard from '@/components/shop/ProductCard.vue'

const serversStore = useServersStore()
const popularProducts = products.filter((p) => p.popular).slice(0, 3)

onMounted(() => serversStore.startPolling())
onUnmounted(() => serversStore.stopPolling())
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-surface-overlay via-surface to-surface" />
      <div
        class="absolute inset-0 opacity-20"
        style="background-image: radial-gradient(circle at 20% 50%, #c8a84b33 0%, transparent 50%), radial-gradient(circle at 80% 20%, #27ae6033 0%, transparent 40%);"
      />
      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="max-w-2xl">
          <p class="font-display text-sm font-semibold uppercase tracking-[0.3em] text-accent">DayZ Server</p>
          <h1 class="mt-3 font-display text-5xl font-bold uppercase leading-tight text-white sm:text-6xl lg:text-7xl">
            На Юга
          </h1>
          <p class="mt-6 text-lg text-gray-400">
            Выживай, сражайся, строй. Покупай внутриигровые предметы в магазине и следи за статусом серверов в реальном времени.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <RouterLink to="/shop" class="btn-primary">Перейти в магазин</RouterLink>
            <RouterLink to="/monitoring" class="btn-secondary">Мониторинг серверов</RouterLink>
          </div>
        </div>

        <div class="mt-16 grid gap-4 sm:grid-cols-3">
          <div class="card p-5 text-center">
            <p class="font-display text-3xl font-bold text-accent">60</p>
            <p class="mt-1 text-sm text-gray-500">Слотов на сервере</p>
          </div>
          <div class="card p-5 text-center">
            <p class="font-display text-3xl font-bold text-accent">24/7</p>
            <p class="mt-1 text-sm text-gray-500">Работа сервера</p>
          </div>
          <div class="card p-5 text-center">
            <p class="font-display text-3xl font-bold text-accent">PvP</p>
            <p class="mt-1 text-sm text-gray-500">Режим игры</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Servers preview -->
    <section class="border-t border-surface-border bg-surface-raised py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="section-title">Серверы</h2>
            <p class="mt-2 text-gray-500">Актуальный статус прямо сейчас</p>
          </div>
          <RouterLink to="/monitoring" class="text-sm text-accent hover:underline">Все серверы →</RouterLink>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <ServerCard
            v-for="server in servers"
            :key="server.id"
            :server="server"
            :status="serversStore.statuses[server.id]"
            :loading="serversStore.loading"
          />
        </div>
      </div>
    </section>

    <!-- Popular products -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="section-title">Популярное</h2>
            <p class="mt-2 text-gray-500">Самые востребованные товары</p>
          </div>
          <RouterLink to="/shop" class="text-sm text-accent hover:underline">Весь каталог →</RouterLink>
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            v-for="product in popularProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="border-t border-surface-border bg-surface-raised py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="section-title text-center">Как купить предмет</h2>
        <div class="mt-12 grid gap-8 md:grid-cols-3">
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 font-display text-xl font-bold text-accent">1</div>
            <h3 class="mt-4 font-display text-lg font-semibold uppercase text-white">Выбери товар</h3>
            <p class="mt-2 text-sm text-gray-500">Найди нужный предмет в магазине и добавь в корзину</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 font-display text-xl font-bold text-accent">2</div>
            <h3 class="mt-4 font-display text-lg font-semibold uppercase text-white">Оплати</h3>
            <p class="mt-2 text-sm text-gray-500">Укажи Steam ID и оплати удобным способом</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 font-display text-xl font-bold text-accent">3</div>
            <h3 class="mt-4 font-display text-lg font-semibold uppercase text-white">Получи в игре</h3>
            <p class="mt-2 text-sm text-gray-500">Предмет появится у тебя на сервере в течение 5 минут</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
