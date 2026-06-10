<script setup lang="ts">
import { ref } from 'vue'
import { ShoppingCart, Sparkles } from 'lucide-vue-next'
import type { Product } from '@/types'
import { api } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import CaseModal from './CaseModal.vue'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ purchased: [] }>()

const auth = useAuthStore()
const buying = ref(false)
const error = ref('')
const showCase = ref(false)

function formatPrice(p: Product) {
  return p.currency === 'rub' ? `${p.price} ₽` : `${p.price} монет`
}

async function buy() {
  if (!auth.user) { auth.login(); return }
  if (props.product.category === 'cases') { showCase.value = true; return }

  buying.value = true
  error.value = ''
  try {
    const res = await api.user.purchase(props.product.id) as { user: typeof auth.user }
    auth.setUser(res.user!)
    emit('purchased')
  } catch (e) { error.value = (e as Error).message }
  finally { buying.value = false }
}
</script>

<template>
  <article class="glass-hover card-shine group flex flex-col overflow-hidden">
    <div class="relative flex h-40 items-center justify-center bg-gradient-to-b from-white/[0.02] to-transparent">
      <span class="text-6xl transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">{{ product.image }}</span>
      <div class="absolute left-3 top-3 flex gap-1.5">
        <span v-if="product.popular" class="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">Хит</span>
        <span v-if="product.isNew" class="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-green-400">New</span>
        <span v-if="product.discount" class="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-400">-{{ product.discount }}%</span>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-4">
      <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-600">{{ product.category.replace(/_/g, ' ') }}</p>
      <h3 class="mt-1 font-display text-lg font-bold uppercase text-white">{{ product.name }}</h3>
      <p class="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500">{{ product.description }}</p>

      <ul v-if="product.contents" class="mt-2 space-y-0.5">
        <li v-for="c in product.contents" :key="c" class="text-[11px] text-gray-600">• {{ c }}</li>
      </ul>

      <ul v-if="product.perks" class="mt-2 space-y-0.5">
        <li v-for="p in product.perks" :key="p" class="flex items-center gap-1 text-[11px] text-gray-400">
          <Sparkles class="h-3 w-3 text-accent" /> {{ p }}
        </li>
      </ul>

      <div class="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <span class="font-display text-xl font-bold text-accent">{{ formatPrice(product) }}</span>
        <button class="btn-primary !px-4 !py-2 text-xs" :disabled="buying" @click="buy">
          <ShoppingCart class="h-3.5 w-3.5" />
          {{ product.category === 'cases' ? 'Открыть' : 'Купить' }}
        </button>
      </div>
      <p v-if="error" class="mt-1 text-xs text-red-400">{{ error }}</p>
    </div>
  </article>

  <CaseModal v-if="showCase" :product="product" @close="showCase = false" />
</template>
