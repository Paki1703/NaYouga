<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{ label: string; value: string | number; icon?: Component }>()
</script>

<template>
  <div class="glass-hover card-shine p-4 text-center">
    <component :is="icon" v-if="icon" class="mx-auto mb-2 h-5 w-5 text-accent" />
    <p class="font-display text-2xl font-bold text-white md:text-3xl">{{ value }}</p>
    <p class="mt-1 text-xs uppercase tracking-wider text-gray-500">{{ label }}</p>
  </div>
</template>
