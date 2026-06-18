<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import GlassCard from '@/components/ui/GlassCard.vue'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await auth.fetchUser()
})
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-10 text-center">
    <GlassCard>
      <div class="p-10">
        <CheckCircle class="mx-auto h-16 w-16 text-green-400" />
        <h1 class="mt-6 font-display text-3xl font-bold uppercase text-white">Оплата прошла успешно</h1>
        <p class="mt-3 text-sm text-gray-500">Баланс будет обновлён в личном кабинете.</p>
        <div class="mt-8 flex justify-center gap-3">
          <button class="btn-primary" @click="router.push('/profile')">В личный кабинет</button>
          <button class="btn-ghost" @click="router.push('/')">На главную</button>
        </div>
      </div>
    </GlassCard>
  </div>
</template>
