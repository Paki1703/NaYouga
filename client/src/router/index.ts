import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/shop', name: 'shop', component: () => import('@/views/ShopView.vue') },
    { path: '/monitoring', name: 'monitoring', component: () => import('@/views/MonitoringView.vue') },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
    { path: '/rules', name: 'rules', component: () => import('@/views/RulesView.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { auth: true } },
    { path: '/admin', name: 'admin', component: () => import('@/views/AdminView.vue'), meta: { admin: true } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.auth || to.meta.admin) {
    if (!auth.user && !auth.loading) {
      await auth.fetchUser()
    }
    if (to.meta.auth && !auth.user) return '/'
    if (to.meta.admin && !auth.user?.isAdmin) return '/'
  }
})

export default router
