<script setup lang="ts">
defineProps<{ hover?: boolean; padding?: boolean }>()
</script>

<template>
  <div :class="[hover ? 'glass-hover card-shine' : 'glass', padding !== false && 'p-5']">
    <slot />
  </div>
</template>
