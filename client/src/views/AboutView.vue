<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AboutContent } from '@/types'
import { api } from '@/api/client'
import GlassCard from '@/components/ui/GlassCard.vue'

const content = ref<AboutContent | null>(null)
onMounted(async () => { content.value = await api.content.about() })
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-10 lg:px-8">
    <h1 class="section-title">О проекте</h1>

    <template v-if="content">
      <GlassCard class="mt-8">
        <h2 class="font-display text-lg font-bold uppercase text-accent">История</h2>
        <p class="mt-3 leading-relaxed text-gray-400">{{ content.history }}</p>
      </GlassCard>

      <GlassCard class="mt-6">
        <h2 class="font-display text-lg font-bold uppercase text-accent">Описание</h2>
        <p class="mt-3 leading-relaxed text-gray-400">{{ content.description }}</p>
      </GlassCard>

      <h2 class="section-title mt-12">Особенности</h2>
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard v-for="f in content.features" :key="f.title" hover :padding="true">
          <h3 class="font-display font-bold uppercase text-white">{{ f.title }}</h3>
          <p class="mt-2 text-sm text-gray-500">{{ f.desc }}</p>
        </GlassCard>
      </div>

      <h2 class="section-title mt-12">Игровые механики</h2>
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <GlassCard v-for="m in content.mechanics" :key="m.title" hover :padding="true">
          <h3 class="font-display font-bold uppercase text-white">{{ m.title }}</h3>
          <p class="mt-2 text-sm text-gray-500">{{ m.desc }}</p>
        </GlassCard>
      </div>

      <h2 class="section-title mt-12">Модификации</h2>
      <div class="mt-6 flex flex-wrap gap-2">
        <span v-for="mod in content.mods" :key="mod" class="glass rounded-lg px-4 py-2 text-sm text-gray-400">{{ mod }}</span>
      </div>
    </template>
  </div>
</template>
