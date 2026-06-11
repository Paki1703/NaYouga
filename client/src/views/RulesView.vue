<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search, ChevronDown } from 'lucide-vue-next'
import type { RuleSection } from '@/types'
import { api } from '@/api/client'

const sections = ref<RuleSection[]>([])
const search = ref('')
const openSections = ref<Set<string>>(new Set())

onMounted(async () => {
  const { rules } = await api.content.rules()
  sections.value = rules
  openSections.value.add(rules[0]?.id)
})

const filtered = computed(() => {
  if (!search.value.trim()) return sections.value
  const q = search.value.toLowerCase()
  return sections.value.map((s) => ({
    ...s,
    rules: s.rules.filter((r) => r.text.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)),
  })).filter((s) => s.rules.length > 0)
})

function toggle(id: string) {
  if (openSections.value.has(id)) openSections.value.delete(id)
  else openSections.value.add(id)
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 lg:px-8">
    <h1 class="section-title">ПРАВИЛА СЕРВЕРА</h1>
    <p class="mt-2 text-gray-500">Ознакомьтесь с правилами сервера перед игрой</p>

    <div class="relative mt-8">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
      <input v-model="search" type="search" placeholder="Поиск по правилам..." class="input !pl-10" />
    </div>

    <div class="mt-6 space-y-3">
      <div v-for="section in filtered" :key="section.id" class="glass overflow-hidden">
        <button class="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]" @click="toggle(section.id)">
          <h2 class="font-display text-lg font-bold uppercase text-white">{{ section.title }}</h2>
          <ChevronDown class="h-5 w-5 text-gray-500 transition-transform" :class="{ 'rotate-180': openSections.has(section.id) }" />
        </button>
        <div v-show="openSections.has(section.id)" class="border-t border-white/5 px-5 pb-5">
          <ol class="mt-4 space-y-3">
            <li v-for="(rule, i) in section.rules" :key="rule.id" class="flex gap-3 text-sm text-gray-400">
              <span v-if="!['intro', 'raids', 'admin', 'final'].includes(section.id)" class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10 text-xs font-bold text-accent">{{ i + 1 }}</span>
              <div class="prose prose-invert max-w-none" :class="['intro', 'raids', 'admin', 'final'].includes(section.id) ? 'pl-0' : ''" v-html="rule.text"></div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
