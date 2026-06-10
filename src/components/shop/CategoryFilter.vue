<script setup>
defineProps({
  categories: { type: Array, required: true },
  active: { type: String, required: true },
})

defineEmits(['update:active'])
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="rounded-full border px-4 py-1.5 text-sm font-medium transition-all"
      :class="active === cat.id
        ? 'border-accent bg-accent/10 text-accent'
        : 'border-surface-border text-gray-400 hover:border-gray-600 hover:text-white'"
      @click="$emit('update:active', cat.id)"
    >
      {{ cat.name }}
    </button>
  </div>
</template>
