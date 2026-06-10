<script setup>
defineProps({
  online: { type: Boolean, default: false },
})
</script>

<template>
  <span
    class="badge"
    :class="online ? 'bg-success/20 text-green-400' : 'bg-danger/20 text-red-400'"
  >
    <span
      class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
      :class="online ? 'bg-green-400 animate-pulse' : 'bg-red-400'"
    />
    {{ online ? 'Онлайн' : 'Оффлайн' }}
  </span>
</template>
