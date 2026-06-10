const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Ошибка сервера' }))
    throw new Error(err.error || 'Ошибка сервера')
  }
  return res.json()
}

export const api = {
  auth: {
    me: () => request<{ user: import('@/types').User | null }>('/auth/me'),
    logout: () => request('/auth/logout', { method: 'POST' }),
    /** Редirect на Steam OpenID */
    steamUrl: '/api/auth/steam',
  },
  products: {
    list: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : ''
      return request<{ products: import('@/types').Product[]; categories: import('@/types').Category[]; banners: import('@/types').ShopBanner[] }>(`/products${q}`)
    },
    get: (id: string) => request<{ product: import('@/types').Product }>(`/products/${id}`),
  },
  servers: {
    list: () => request<{ servers: import('@/types').ServerInfo[]; statuses: Record<string, import('@/types').ServerStatus>; stats: import('@/types').ProjectStats }>('/servers'),
  },
  content: {
    news: () => request<{ news: import('@/types').NewsItem[] }>('/content/news'),
    rules: () => request<{ rules: import('@/types').RuleSection[] }>('/content/rules'),
    about: () => request<import('@/types').AboutContent>('/content/about'),
  },
  user: {
    purchase: (productId: string) => request('/user/purchase', { method: 'POST', body: JSON.stringify({ productId }) }),
    promo: (code: string) => request('/user/promo', { method: 'POST', body: JSON.stringify({ code }) }),
    topup: (amount: number) => request('/user/topup', { method: 'POST', body: JSON.stringify({ amount }) }),
    deliver: (itemId: string) => request('/user/deliver', { method: 'POST', body: JSON.stringify({ itemId }) }),
    openCase: (productId: string) => request<{ won: string; chance: number; user: import('@/types').User }>('/user/open-case', { method: 'POST', body: JSON.stringify({ productId }) }),
  },
  admin: {
    stats: () => request('/admin/stats'),
    logs: () => request('/admin/logs'),
    promocodes: () => request('/admin/promocodes'),
    products: () => request('/admin/products'),
    news: () => request('/admin/news'),
    giveMoney: (steamId: string, amount: number, reason: string) => request('/admin/give-money', { method: 'POST', body: JSON.stringify({ steamId, amount, reason }) }),
    updatePrice: (id: string, price: number) => request(`/admin/products/${id}/price`, { method: 'PUT', body: JSON.stringify({ price }) }),
  },
}
