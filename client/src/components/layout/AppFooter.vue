<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Skull, Heart, Shield, Swords, MessageSquare } from 'lucide-vue-next'
import { PROJECT_NAME, DISCORD_URL, SERVER_IP } from '@/config'

// Интерактивная статистика выживания
const survivorStats = ref({
  survived: 8420,
  killed: 12847,
  deathRate: 60,
})

const stats = ref([
  { icon: Heart, label: 'Выживших', value: 0, color: 'text-green-400' },
  { icon: Skull, label: 'Погибло', value: 0, color: 'text-red-400' },
  { icon: Swords, label: 'PvP убийств', value: 0, color: 'text-orange-400' },
])

onMounted(() => {
  // Анимируем счётчики
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 0.3
    if (progress >= 1) {
      progress = 1
      clearInterval(interval)
    }
    stats.value[0].value = Math.floor(survivorStats.value.survived * progress)
    stats.value[1].value = Math.floor(survivorStats.value.killed * progress)
    stats.value[2].value = Math.floor(survivorStats.value.killed * 0.65 * progress)
  }, 50)
})
</script>

<template>
  <footer class="border-t border-white/5 bg-gradient-to-b from-graphite-light to-graphite-dark">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <!-- Stats Section -->
      <div class="grid gap-6 py-12 sm:grid-cols-3">
        <div v-for="stat in stats" :key="stat.label" class="group rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
          <div class="flex items-center gap-3 mb-4">
            <div class="rounded-lg bg-white/5 p-2 group-hover:bg-white/10 transition-colors">
              <component :is="stat.icon" class="h-5 w-5" :class="stat.color" />
            </div>
            <p class="text-sm text-gray-400">{{ stat.label }}</p>
          </div>
          <p class="font-display text-3xl font-bold text-white">{{ stat.value.toLocaleString('ru-RU') }}</p>
        </div>
      </div>

      <!-- Main Footer -->
      <div class="border-t border-white/10 py-12">
        <div class="grid gap-10 md:grid-cols-4">
          <!-- Branding -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 font-display text-lg font-bold text-accent">
                Ю
              </div>
              <h3 class="font-display text-2xl font-bold uppercase tracking-wider text-white">{{ PROJECT_NAME }}</h3>
            </div>
            <p class="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
              Присоединяйся к премиальному PvP проекту. Выживай, строй, сражайся с друзьями и кланом. Каждый день — новые опасности.
            </p>
            <div class="mt-6 flex gap-3">
              <a :href="DISCORD_URL" target="_blank" class="inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20 ring-1 ring-indigo-500/30">
                <MessageSquare class="h-4 w-4" />
                Discord
              </a>
              <button class="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/20 ring-1 ring-accent/30">
                <Swords class="h-4 w-4" />
                Начать игру
              </button>
            </div>
          </div>

          <!-- Navigation -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-widest text-accent mb-4">Навигация</h4>
            <ul class="space-y-2.5">
              <li><RouterLink to="/monitoring" class="text-sm text-gray-400 transition-colors hover:text-white hover:translate-x-1 inline-block">→ Мониторинг</RouterLink></li>
              <li><RouterLink to="/shop" class="text-sm text-gray-400 transition-colors hover:text-white hover:translate-x-1 inline-block">→ Магазин</RouterLink></li>
              <li><RouterLink to="/rules" class="text-sm text-gray-400 transition-colors hover:text-white hover:translate-x-1 inline-block">→ Правила</RouterLink></li>
              <li><RouterLink to="/about" class="text-sm text-gray-400 transition-colors hover:text-white hover:translate-x-1 inline-block">→ О проекте</RouterLink></li>
            </ul>
          </div>

          <!-- Server Info -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-widest text-accent mb-4">Сервер</h4>
            <div class="space-y-3">
              <div class="rounded-lg bg-white/5 p-3 backdrop-blur-sm">
                <p class="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Адрес</p>
                <code class="font-mono text-sm font-semibold text-accent break-all">{{ SERVER_IP }}</code>
              </div>
              <p class="text-xs text-gray-500">
                <span class="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse mr-2" />
                Сейчас онлайн: <span class="text-green-400 font-semibold">127 игроков</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10 py-6 text-center">
        <p class="text-xs text-gray-600">
          &copy; {{ new Date().getFullYear() }} <span class="text-gray-400 font-semibold">{{ PROJECT_NAME }}</span>. 
          DayZ — торговая марка <a href="https://www.bohemia.net/" target="_blank" class="text-accent hover:underline">Bohemia Interactive</a>
        </p>
        <p class="mt-2 text-xs text-gray-700">Выживание — это стиль жизни</p>
      </div>
    </div>
  </footer>
</template>
