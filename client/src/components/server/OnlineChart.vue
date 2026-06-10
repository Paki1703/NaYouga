<script setup lang="ts">
import { computed } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend)

const props = defineProps<{
  data24h: { time: string; players: number }[]
  data7d: { day: string; peak: number; average: number }[]
}>()

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#6b7280', font: { size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#6b7280', font: { size: 10 } }, beginAtZero: true },
  },
}

const lineData = computed(() => ({
  labels: props.data24h.map((d) => d.time),
  datasets: [{
    data: props.data24h.map((d) => d.players),
    borderColor: '#dc2626',
    backgroundColor: 'rgba(220,38,38,0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 4,
  }],
}))

const barData = computed(() => ({
  labels: props.data7d.map((d) => d.day),
  datasets: [
    { label: 'Пик', data: props.data7d.map((d) => d.peak), backgroundColor: 'rgba(220,38,38,0.6)', borderRadius: 4 },
    { label: 'Средний', data: props.data7d.map((d) => d.average), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
  ],
}))
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <div class="glass p-5">
      <h4 class="font-display text-sm font-bold uppercase tracking-wider text-gray-400">Онлайн за 24 часа</h4>
      <div class="mt-4 h-48"><Line :data="lineData" :options="chartOptions" /></div>
    </div>
    <div class="glass p-5">
      <h4 class="font-display text-sm font-bold uppercase tracking-wider text-gray-400">Онлайн за неделю</h4>
      <div class="mt-4 h-48"><Bar :data="barData" :options="{ ...chartOptions, plugins: { legend: { labels: { color: '#6b7280', font: { size: 10 } } } } }" /></div>
    </div>
  </div>
</template>
