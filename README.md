# Кабинет заказов

Веб-приложение для управления заказами на Angular 20.

## Требования

- Node.js 18+
- npm 9+

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера (http://localhost:4200)
npm start

# Запуск mock API (http://localhost:3001)
npm run api

# Сборка production
npm run build

# Unit тесты
npm test

# E2E тесты
npm run e2e
```

## Mock API

Проект использует json-server для имитации бэкенда. Данные хранятся в `db.json`.

```bash
npm run api
```

API доступен на `http://localhost:3001` с эндпоинтами:
- `GET/PUT/DELETE /orders/:id` - работа с заказами
- `GET /orders` - список заказов

## Архитектура

Проект построен по feature-first принципу: каждая функциональная область (auth, orders) изолирована в своей директории со своими компонентами, сервисами и моделями. Общая инфраструктура (guards, interceptors, базовые сервисы) вынесена в core/.

Для управления состоянием используются Angular Signals. Реализован паттерн stale-while-revalidate: при возврате на список заказов сразу показываются закэшированные данные, параллельно идёт запрос за свежими. Это убирает лишние задержки и дублирование запросов.

Все компоненты standalone, используется новый синтаксис @if/@for. Формы реактивные с валидацией. При редактировании заказа применяется optimistic update с откатом при ошибке.

## Структура проекта

```
src/app/
├── core/           # Guards, interceptors, общие сервисы
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
└── features/       # Функциональные модули
    ├── auth/       # Авторизация
    └── orders/     # Список и детали заказов
```

## Стек

- Angular 20.3
- PrimeNG 20.3
- TypeScript 5.9 (strict mode)
- Cypress 15.6 (e2e)
- Jasmine + Karma (unit)
