<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import type { Product } from '@/types'
import { api } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuthStore()
const phase = ref<'preview' | 'spinning' | 'result'>('preview')
const won = ref('')
const chance = ref(0)
const error = ref('')

async function open() {
  phase.value = 'spinning'
  error.value = ''
  try {
    await new Promise((r) => setTimeout(r, 2000))
    const res = await api.user.openCase(props.product.id)
    won.value = res.won
    chance.value = res.chance
    auth.setUser(res.user)
    phase.value = 'result'
  } catch (e) {
    error.value = (e as Error).message
    phase.value = 'preview'
  }
}
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" @click.self="emit('close')">
    <div class="glass relative mx-4 w-full max-w-md p-6 glow-red animate-fade-in">
      <button class="absolute right-4 top-4 text-gray-500 hover:text-white" @click="emit('close')"><X class="h-5 w-5" /></button>

      <h3 class="font-display text-2xl font-bold uppercase text-white">{{ product.name }}</h3>

      <div v-if="phase === 'preview'" class="mt-4">
        <p class="text-sm text-gray-400">Вероятности выпадения:</p>
        <ul class="mt-3 space-y-2">
          <li v-for="p in product.probabilities" :key="p.item" class="flex justify-between text-sm">
            <span class="text-gray-300">{{ p.item }}</span>
            <span class="font-display font-bold text-accent">{{ p.chance }}%</span>
          </li>
        </ul>
        <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
        <button class="btn-primary mt-6 w-full" @click="open">Открыть за {{ product.price }} монет</button>
      </div>

      <div v-else-if="phase === 'spinning'" class="mt-8 flex flex-col items-center py-8">
        <div class="h-24 w-24 animate-spin rounded-full border-4 border-accent/20 border-t-accent" />
        <p class="mt-4 font-display text-lg text-white">Открываем...</p>
      </div>

      <div v-else class="mt-6 text-center">
        <p class="text-6xl animate-float">🎉</p>
        <p class="mt-4 text-sm text-gray-400">Вы выиграли:</p>
        <p class="mt-2 font-display text-2xl font-bold text-accent text-glow">{{ won }}</p>
        <p class="mt-1 text-xs text-gray-500">Шанс: {{ chance }}%</p>
        <button class="btn-primary mt-6 w-full" @click="emit('close')">Отлично!</button>
      </div>
    </div>
  </div>
</template>
