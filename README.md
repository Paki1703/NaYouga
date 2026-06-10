# На Юга — DayZ Server Platform

Премиальный сайт для DayZ-сервера: магазин, мониторинг, личный кабинет, админ-панель.

## Стек

| Frontend | Backend |
|----------|---------|
| Vue 3 + TypeScript | Node.js + Express + TypeScript |
| Vite | In-memory store (готово к замене на БД) |
| Tailwind CSS | Session auth (Steam-ready) |
| Pinia, Vue Router | REST API |
| Chart.js | |

## Запуск

```bash
# Установка (PowerShell — используйте npm.cmd)
npm.cmd install
cd client && npm.cmd install
cd ../server && npm.cmd install

# Запуск frontend + backend
cd ..
npm.cmd run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Hero, статистика, преимущества, новости |
| `/shop` | Маркетплейс с категориями, кейсами, паками |
| `/monitoring` | Серверы, графики, список игроков |
| `/about` | О проекте, механики, моды |
| `/rules` | Правила с поиском и аккордеоном |
| `/profile` | Личный кабинет (только свой аккаунт) |
| `/admin` | Админ-панель |

## Авторизация через Steam

1. Получите **Steam Web API Key**: https://steamcommunity.com/dev/apikey  
   (Domain Name: `localhost` для разработки или ваш домен)

2. Скопируйте конфиг:
   ```bash
   cp server/.env.example server/.env
   ```

3. Заполните `server/.env`:
   ```env
   STEAM_API_KEY=ваш_ключ
   STEAM_REALM=http://localhost12345:5173
   STEAM_RETURN_URL=http://localhost12345:5173/api/auth/steam/callback
   ADMIN_STEAM_IDS=ваш_steam_id64
   ```

   **Domain Name в Steam:** `localhost12345`

   Добавьте в файл hosts (`C:\Windows\System32\drivers\etc\hosts`):
   ```
   127.0.0.1 localhost12345
   ```

   Открывайте сайт только по адресу: **http://localhost12345:5173** (не localhost:5173)

4. Узнайте свой Steam ID64: https://steamid.io/

**Как это работает:** кнопка «Войти через Steam» → Steam OpenID → callback → сессия → редирект в `/profile`.

**Production:** замените URL на ваш домен:
```env
CLIENT_URL=https://nayouga.ru
STEAM_REALM=https://nayouga.ru
STEAM_RETURN_URL=https://nayouga.ru/api/auth/steam/callback
SESSION_SECRET=длинная_случайная_строка
```

**Dev без ключа:** `POST /api/auth/login/dev` (только NODE_ENV ≠ production)

## Промокоды (демо)

- `NAYOUGA2026` — 500 монет
- `WELCOME100` — 100 монет

## Структура

```
client/          Vue 3 + TypeScript frontend
server/          Express API
  src/data/      Товары, серверы, правила, новости
  src/routes/    API endpoints
  src/store/     In-memory хранилище
```

## Настройка

- Товары: `server/src/data/products.ts`
- Серверы: `server/src/data/servers.ts`
- Название: `client/src/config.ts`
- Discord/IP: `client/src/config.ts`

## Следующие шаги

1. PostgreSQL / MongoDB вместо in-memory
2. ЮKassa для оплаты
3. Steam Server Query для мониторинга
4. Выдача предметов через мод на сервере
