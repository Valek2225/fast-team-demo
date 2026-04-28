# Т-Город × Т-Банк — финплан вариантов «виджета»

Standalone React (Vite + TypeScript) презентация по экономике вариантов
интеграции маскота Т-Города в Т-Банк. Делает то же, что и `.canvas.tsx`
артефакт в Cursor, но запускается отдельно и хостится одной командой
на Vercel.

## Локальный запуск

```bash
cd presentation
npm install
npm run dev
```

Откроется `http://localhost:5180/`.

## Сборка

```bash
npm run build
npm run preview
```

Сборка идёт в `dist/`.

## Деплой на Vercel

### Вариант 1 — через CLI (минута)

```bash
npm i -g vercel
cd presentation
vercel
```

CLI спросит:
- Set up and deploy `presentation`? **Y**
- Which scope? — выбираете свой аккаунт / команду.
- Link to existing project? **N**
- Project name? — например `t-gorod-finplan`.
- In which directory is your code located? **./**
- Framework preset — Vercel сам определит **Vite**, Enter.
- Override settings? **N**.

Через 30–60 сек получите ссылку вида
`https://t-gorod-finplan-<hash>.vercel.app`.

Чтобы запушить продакшн-версию: `vercel --prod`.

### Вариант 2 — через Git + Vercel Dashboard

1. Запушить эту папку как корень репозитория, либо ткнуть Vercel в
   подкаталог `presentation/`.
2. На https://vercel.com → **Add New Project** → выбрать репозиторий.
3. Root Directory: `presentation`.
4. Framework Preset: **Vite** (автодетект).
5. Build Command: `npm run build` (по умолчанию).
6. Output Directory: `dist` (по умолчанию).
7. Deploy.

При каждом push в основную ветку Vercel пересобирает прод; PR-ветки
получают preview-URL автоматически.

### Кастомный домен

В Vercel Dashboard → проект → **Domains** → добавить, например
`finplan.tcity.ru`, и привязать CNAME у регистратора.

## Структура

```
presentation/
├── index.html              # точка входа Vite
├── package.json            # минимум зависимостей: react, react-dom, vite
├── vite.config.ts
├── tsconfig.json
├── vercel.json             # фреймворк-преcет для Vercel + SPA rewrites
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx            # mount React + роутинг (/ vs /mobile)
    ├── App.tsx             # вся презентация (главная страница)
    ├── MobileDemo.tsx      # /mobile — статичный мокап iPhone-экранов
    └── styles.css          # тёмная тема, iPhone frame, маскот-блоки
```

## Роуты

- `/` — основная финплан-презентация (TopBar, секции).
- `/mobile` — Demo UI: два статичных iPhone-экрана (Заказ оформлен → Знакомство с Лисом Толей).
  В TopBar главной есть быстрая ссылка «Demo UI».

## Что внутри

Один компонент `App.tsx`, в нём — те же блоки, что и в Cursor canvas:

1. Шапка с ключевыми метриками (целевая база, активация, маржа, окупаемость).
2. Таблица готовности аудитории 14–35 справиться без курьера.
3. Раскладка стоимости разработки и инфраструктуры.
4. Сравнение цен на курьеров (Достависта / самозанятый / Сбер 60+).
5. Пять сценариев A–E с raw-цифрами.
6. ROI: средний чек × маржа × активация.
7. План к запуску по спринтам.
8. Риски экономики.

## Как обновить контент

Все цифры лежат прямо в `App.tsx` (компоненты `Stat`, `DataTable`,
`Callout`). Меняете значение → `vercel --prod` → новая версия.
