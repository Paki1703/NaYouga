<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const authError = ref('')

onMounted(async () => {
  await auth.fetchUser()

  if (route.query.auth === 'error') {
    const reason = route.query.reason
    authError.value =
      reason === 'steam_not_configured'
        ? 'Steam API Key не настроен на сервере. Добавьте STEAM_API_KEY в server/.env'
        : 'Не удалось войти через Steam. Попробуйте снова.'
    router.replace({ query: {} })
    setTimeout(() => { authError.value = '' }, 8000)
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <div
      v-if="authError"
      class="fixed left-1/2 top-20 z-[100] -translate-x-1/2 rounded-lg border border-red-500/30 bg-red-950/90 px-6 py-3 text-sm text-red-200 backdrop-blur-xl"
    >
      {{ authError }}
    </div>
    <AppHeader />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<style>
.page-enter-active, .page-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
