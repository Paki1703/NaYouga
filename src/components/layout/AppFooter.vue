<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-surface-border bg-surface-raised">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <h3 class="font-display text-lg font-bold uppercase tracking-wide text-white">На Юга</h3>
          <p class="mt-2 text-sm text-gray-500">
            DayZ сервер с уникальным геймплеем, активным комьюнити и честной экономикой.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Навигация</h4>
          <ul class="mt-3 space-y-2 text-sm">
            <li><RouterLink to="/shop" class="text-gray-500 hover:text-accent">Магазин</RouterLink></li>
            <li><RouterLink to="/monitoring" class="text-gray-500 hover:text-accent">Мониторинг</RouterLink></li>
            <li><RouterLink to="/cart" class="text-gray-500 hover:text-accent">Корзина</RouterLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Контакты</h4>
          <ul class="mt-3 space-y-2 text-sm text-gray-500">
            <li>Discord: <a href="https://discord.gg/" class="text-accent hover:underline">discord.gg/nayouga</a></li>
            <li>IP: <span class="font-mono text-gray-400">185.0.0.0:2302</span></li>
          </ul>
        </div>
      </div>

      <div class="mt-8 border-t border-surface-border pt-6 text-center text-xs text-gray-600">
        &copy; {{ year }} На Юга. DayZ является торговой маркой Bohemia Interactive.
      </div>
    </div>
  </footer>
</template>
