# SkyFitnessPro

Frontend-приложение для онлайн-курсов тренировок: просмотр курсов, добавление в профиль, прохождение уроков и сохранение прогресса.

## Технологии

- `React 19`, `TypeScript`, `Vite`
- `React Router`
- `Tailwind CSS v4` (через CSS modules + `@apply`)
- `Jest` + `Testing Library`

## Требования

- `Node.js` 20+
- запущенный backend `webdev-hw-api` с API `fitness`
- запущенный `MongoDB` для backend-проекта

## Быстрый старт

1. Установить зависимости:

```bash
npm install
```

2. Проверить `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/fitness
```

3. Запустить frontend:

```bash
npm run dev
```

4. Открыть приложение:

- [http://localhost:5173](http://localhost:5173)

## Backend (локально)

Приложение ожидает API на `http://localhost:3000/api/fitness`.

Пример запуска backend `webdev-hw-api`:

```bash
cd ../webdev-hw-api
npm install
npm run init-db
npm run dev
```

## Скрипты

- `npm run dev` — запуск dev-сервера
- `npm run build` — production-сборка
- `npm run preview` — предпросмотр сборки
- `npm run lint` — ESLint
- `npm run typecheck` — проверка TypeScript
- `npm run test` — запуск unit-тестов (Jest)

## Тестирование

В проекте добавлены unit-тесты ключевой бизнес-логики:

- `src/shared/mappers/courseMapper.test.ts`
  - маппинг API-модели курса в доменную модель
  - нормализация уровней сложности
  - выбор цвета баннера и fallback
- `src/shared/auth/storage.test.ts`
  - чтение/запись токена в `localStorage`
  - обработка некорректных данных
  - удаление токена при logout

Запуск:

```bash
npm run test
```

## Структура проекта

- `src/app` — корневое приложение и роутинг
- `src/pages` — страницы (`/`, `/courses/:courseId`, `/profile`, `/workouts/:workoutId`)
- `src/components` — UI и feature-компоненты
- `src/shared/api` — HTTP-клиент и API-слой
- `src/shared/auth` — хранение токена и auth-контекст
- `src/shared/mappers` — бизнес-мапперы данных API -> UI

## Деплой

Проект деплоится на Vercel.

Прод-обновление:

```bash
npx vercel --prod --yes
```
