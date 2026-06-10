export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: 'coins' | 'rub'
  category: string
  image: string
  contents?: string[]
  probabilities?: { item: string; chance: number }[]
  perks?: string[]
  tags: string[]
  popular?: boolean
  isNew?: boolean
  discount?: number
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface ShopBanner {
  id: string
  title: string
  subtitle: string
  color: string
  link: string
}

export interface ServerInfo {
  id: string
  name: string
  map: string
  ip: string
  port: number
  maxPlayers: number
  mods: string[]
  description: string
  restartIntervalHours: number
}

export interface ServerStatus {
  online: boolean
  players: number
  maxPlayers: number
  ping: number | null
  playersList: { name: string; playTime: number }[]
  restartIn: number
  onlineHistory24h: { time: string; players: number }[]
  onlineHistory7d: { day: string; peak: number; average: number }[]
}

export interface ProjectStats {
  online: number
  maxOnline: number
  totalPlayers: number
  lastWipe: string
  nextWipe: string
}

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  tag: string
}

export interface RuleSection {
  id: string
  title: string
  rules: { id: string; text: string }[]
}

export interface User {
  steamId: string
  nickname: string
  avatar: string
  balance: number
  isAdmin: boolean
  privileges: { name: string; expiresAt: string }[]
  purchases: Purchase[]
  topups: Topup[]
  promocodes: string[]
  ownedItems: OwnedItem[]
}

export interface Purchase {
  id: string
  productId: string
  productName: string
  price: number
  currency: string
  date: string
  status: string
}

export interface Topup {
  id: string
  amount: number
  method: string
  date: string
}

export interface OwnedItem {
  id: string
  name: string
  deliveredAt: string | null
  serverId: string
}

export interface AboutContent {
  history: string
  description: string
  features: { title: string; desc: string }[]
  mechanics: { title: string; desc: string }[]
  mods: string[]
}
