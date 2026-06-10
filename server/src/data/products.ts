import type { Product } from '../types.js'

export const categories = [
  { id: 'all', name: 'Все', icon: '🏪' },
  { id: 'transport_civilian', name: 'Гражданские авто', icon: '🚗' },
  { id: 'transport_offroad', name: 'Внедорожники', icon: '🛻' },
  { id: 'transport_cargo', name: 'Грузовой транспорт', icon: '🚛' },
  { id: 'building', name: 'Строительство', icon: '🏗️' },
  { id: 'locks', name: 'Замки и защита', icon: '🔒' },
  { id: 'kits', name: 'Наборы', icon: '📦' },
  { id: 'vip', name: 'Привилегии', icon: '⭐' },
  { id: 'cases', name: 'Кейсы', icon: '🎰' },
  { id: 'packs', name: 'Паки', icon: '💎' },
]

export const products: Product[] = [
  // Transport civilian
  { id: 'vaz2107', name: 'ВАЗ 2107', description: 'Классический советский седан. Надёжный стартовый транспорт.', price: 149, currency: 'coins', category: 'transport_civilian', image: '🚗', tags: ['transport'], popular: true },
  { id: 'vaz2109', name: 'ВАЗ 2109', description: 'Компактный хэтчбек для быстрого перемещения по карте.', price: 149, currency: 'coins', category: 'transport_civilian', image: '🚗', tags: ['transport'] },
  { id: 'golf_mk2', name: 'Golf MK2', description: 'Легендарный немецкий хэтчбек с отличной управляемостью.', price: 199, currency: 'coins', category: 'transport_civilian', image: '🚙', tags: ['transport'], isNew: true },
  { id: 'bmw_e30', name: 'BMW E30', description: 'Спортивный седан для ценителей скорости и стиля.', price: 199, currency: 'coins', category: 'transport_civilian', image: '🏎️', tags: ['transport'] },
  { id: 'bmw_e39', name: 'BMW E39', description: 'Премиальный седан бизнес-класса.', price: 249, currency: 'coins', category: 'transport_civilian', image: '🚘', tags: ['transport'], popular: true },

  // Offroad
  { id: 'niva', name: 'Niva', description: 'Легендарный внедорожник для любого бездорожья.', price: 249, currency: 'coins', category: 'transport_offroad', image: '🛻', tags: ['transport'] },
  { id: 'uaz', name: 'UAZ', description: 'Проходимый внедорожник с высокой грузоподъёмностью.', price: 299, currency: 'coins', category: 'transport_offroad', image: '🚐', tags: ['transport'], popular: true },
  { id: 'defender', name: 'Defender', description: 'Британский внедорожник премиум-класса.', price: 399, currency: 'coins', category: 'transport_offroad', image: '🛞', tags: ['transport'] },
  { id: 'land_cruiser', name: 'Land Cruiser', description: 'Топовый внедорожник для самых сложных условий.', price: 499, currency: 'coins', category: 'transport_offroad', image: '🚙', tags: ['transport'], isNew: true },

  // Cargo
  { id: 'gazel', name: 'ГАЗель', description: 'Грузовой фургон для перевозки лута и ресурсов.', price: 499, currency: 'coins', category: 'transport_cargo', image: '🚐', tags: ['transport'] },
  { id: 'ural', name: 'Урал', description: 'Тяжёлый грузовик для клановых операций.', price: 899, currency: 'coins', category: 'transport_cargo', image: '🚛', tags: ['transport'] },
  { id: 'kamaz', name: 'КамАЗ', description: 'Максимальная грузоподъёмность на сервере.', price: 999, currency: 'coins', category: 'transport_cargo', image: '🚛', tags: ['transport'], popular: true },

  // Building
  { id: 'starter_build', name: 'Стартовый строительный набор', description: 'Всё необходимое для начала строительства базы.', price: 99, currency: 'coins', category: 'building', image: '🪵', tags: ['building'], contents: ['Доски ×50', 'Гвозди ×500'], popular: true },
  { id: 'small_base', name: 'Маленькая база', description: 'Комплект для небольшого укрытия на 2-3 человека.', price: 299, currency: 'coins', category: 'building', image: '🏠', tags: ['building'] },
  { id: 'large_base', name: 'Большая база', description: 'Полноценная база с укреплениями и воротами.', price: 699, currency: 'coins', category: 'building', image: '🏰', tags: ['building'], popular: true },
  { id: 'clan_base', name: 'Клановая база', description: 'Максимальный комплект для кланового строительства.', price: 1499, currency: 'coins', category: 'building', image: '🏯', tags: ['building'] },

  // Locks
  { id: 'codelock', name: 'Кодовый замок', description: 'Защита дверей и ворот 4-значным кодом.', price: 79, currency: 'coins', category: 'locks', image: '🔐', tags: ['locks'] },
  { id: 'lock_set', name: 'Комплект замков', description: '5 кодовых замков со скидкой.', price: 199, currency: 'coins', category: 'locks', image: '🔒', tags: ['locks'], discount: 20 },
  { id: 'base_protection', name: 'Усиленная защита базы', description: 'Дополнительные укрепления и противовзломные системы.', price: 399, currency: 'coins', category: 'locks', image: '🛡️', tags: ['locks'] },

  // Kits
  { id: 'newbie_kit', name: 'Набор новичка', description: 'Стартовый набор для комфортного начала игры.', price: 99, currency: 'coins', category: 'kits', image: '🎒', tags: ['kits'], contents: ['Консервы', 'Вода', 'Нож', 'Бинты'], popular: true },
  { id: 'builder_kit', name: 'Набор строителя', description: 'Расширенный набор для строительства.', price: 299, currency: 'coins', category: 'kits', image: '🔨', tags: ['kits'] },
  { id: 'hunter_kit', name: 'Набор охотника', description: 'Оружие и снаряжение для охоты.', price: 249, currency: 'coins', category: 'kits', image: '🏹', tags: ['kits'] },
  { id: 'farmer_kit', name: 'Набор фермера', description: 'Семена, инструменты и удобрения.', price: 199, currency: 'coins', category: 'kits', image: '🌾', tags: ['kits'], isNew: true },

  // VIP
  { id: 'vip', name: 'VIP', description: 'Привилегии на 30 дней.', price: 299, currency: 'rub', category: 'vip', image: '⭐', tags: ['vip'], perks: ['Приоритет очереди', 'Цветной ник', 'Дополнительные ежедневные награды'], popular: true },
  { id: 'premium', name: 'PREMIUM', description: 'Максимальные привилегии на 30 дней.', price: 499, currency: 'rub', category: 'vip', image: '👑', tags: ['vip', 'premium'], perks: ['Всё из VIP', 'Дополнительные лимиты транспорта', 'Дополнительные лимиты строительства'] },

  // Cases
  { id: 'case_transport', name: 'Кейс транспорта', description: 'Шанс выиграть транспорт любого класса.', price: 149, currency: 'coins', category: 'cases', image: '🎰', tags: ['cases'], probabilities: [
    { item: 'ВАЗ 2107', chance: 35 }, { item: 'Golf MK2', chance: 25 }, { item: 'Niva', chance: 20 }, { item: 'UAZ', chance: 12 }, { item: 'Land Cruiser', chance: 8 },
  ]},
  { id: 'case_building', name: 'Кейс строительства', description: 'Строительные наборы и материалы.', price: 149, currency: 'coins', category: 'cases', image: '🏗️', tags: ['cases'], probabilities: [
    { item: 'Стартовый набор', chance: 40 }, { item: 'Маленькая база', chance: 30 }, { item: 'Большая база', chance: 20 }, { item: 'Клановая база', chance: 10 },
  ]},
  { id: 'case_luck', name: 'Кейс удачи', description: 'Случайные ценные предметы.', price: 199, currency: 'coins', category: 'cases', image: '🍀', tags: ['cases'], probabilities: [
    { item: 'Набор новичка', chance: 30 }, { item: 'Кодовый замок ×3', chance: 25 }, { item: 'Набор охотника', chance: 25 }, { item: 'VIP 7 дней', chance: 15 }, { item: '1000 монет', chance: 5 },
  ]},
  { id: 'case_weapons', name: 'Кейс оружия', description: 'Оружие и боеприпасы.', price: 249, currency: 'coins', category: 'cases', image: '🔫', tags: ['cases'], isNew: true, probabilities: [
    { item: 'Пистолет + патроны', chance: 35 }, { item: 'Дробовик', chance: 25 }, { item: 'AKM', chance: 20 }, { item: 'M4-A1', chance: 12 }, { item: 'SVD', chance: 8 },
  ]},

  // Packs
  { id: 'bronze_pack', name: 'Bronze Pack', description: 'Базовый набор для старта.', price: 299, currency: 'coins', category: 'packs', image: '🥉', tags: ['packs'], contents: ['Набор новичка', 'ВАЗ 2107', 'Кодовый замок', '500 монет'] },
  { id: 'silver_pack', name: 'Silver Pack', description: 'Расширенный набор выживальщика.', price: 499, currency: 'coins', category: 'packs', image: '🥈', tags: ['packs'], contents: ['Набор строителя', 'Golf MK2', 'Комплект замков', '1000 монет'], popular: true },
  { id: 'gold_pack', name: 'Gold Pack', description: 'Премиальный набор для серьёзной игры.', price: 799, currency: 'coins', category: 'packs', image: '🥇', tags: ['packs'], contents: ['Большая база', 'Niva', 'Набор охотника', 'VIP 7 дней', '2000 монет'] },
  { id: 'platinum_pack', name: 'Platinum Pack', description: 'Максимальный набор для кланов.', price: 1499, currency: 'coins', category: 'packs', image: '💎', tags: ['packs'], contents: ['Клановая база', 'Land Cruiser', 'Усиленная защита', 'PREMIUM 7 дней', '5000 монет'], isNew: true },
]

export const shopBanners = [
  { id: '1', title: 'Скидка 20% на замки', subtitle: 'Только эту неделю', color: 'from-red-600/40 to-orange-600/20', link: '/shop?category=locks' },
  { id: '2', title: 'Новый Platinum Pack', subtitle: 'Максимальный набор для кланов', color: 'from-purple-600/40 to-red-600/20', link: '/shop?category=packs' },
  { id: '3', title: 'Кейс оружия', subtitle: 'Новинка в магазине', color: 'from-red-800/40 to-gray-900/40', link: '/shop?category=cases' },
]
