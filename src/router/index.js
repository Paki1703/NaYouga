import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/ShopView.vue'),
    },
    {
      path: '/monitoring',
      name: 'monitoring',
      component: () => import('@/views/MonitoringView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
