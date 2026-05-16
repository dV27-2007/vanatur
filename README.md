# VANATUR

Многостраничный сайт `VANATUR` на `HTML/CSS/JS` с backend на `Python` и `PostgreSQL`.

## Главное

- runtime-данные сайта живут в `PostgreSQL`
- backend больше не использует `data/` как рабочее хранилище
- `data/` нужна только для отдельной миграции старых JSON в базу
- backend разделён по слоям: `config`, `db`, `models`, `schemas`, `crud`, `routes`, `http`
- `DATABASE_URL` читается из `.env`
- если база из `DATABASE_URL` ещё не существует, backend пытается создать её сам

## Быстрый старт

1. Установи зависимости:

```bash
python3 -m pip install -r requirements.txt
```

2. Проверь `.env`.

Локальный dev-вариант уже задан:

```text
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/vanatur
ADMIN_API_KEY=admin
```

3. Создай базу и таблицы:

```bash
npm run db:bootstrap
```

4. Если хочешь перенести starye JSON dannye iz `data/` v bazu:

```bash
npm run db:migrate-data
```

5. Zapusti proekt:

```bash
npm run dev
```

Ili:

```bash
npm start
```

Сайт откроется на:

```text
http://127.0.0.1:3000
```

## Структура backend

```text
backend/
├── app.py
├── config.py
├── db.py
├── http.py
├── postgres_store.py
├── schemas.py
├── crud/
│   ├── inquiries.py
│   └── site_content.py
├── models/
│   ├── __init__.py
│   ├── inquiry.py
│   ├── shared.py
│   └── site_content.py
├── routes/
│   ├── admin.py
│   └── public.py
└── utils/
    └── env.py
```

## Что за что отвечает

- `server.py`
  Тонкий entrypoint, только запуск приложения.
- `backend/config.py`
  Загружает `.env` и собирает настройки.
- `backend/db.py`
  Подключение к `PostgreSQL`, создание базы, bootstrap таблиц.
- `backend/models/`
  Доменные модели сайта и заявок.
- `backend/schemas.py`
  Нормализация и валидация входных payload.
- `backend/crud/`
  SQL-операции и работа с таблицами.
- `backend/routes/`
  HTTP-обработчики публичных и admin routes.
- `backend/http.py`
  Request/response helper-ы.
- `scripts/migrate_data_to_postgres.py`
  Отдельная one-time migraciya iz `data/` v bazu.

## PostgreSQL

Сейчас backend использует две таблицы:

- `app_site_content`
  Хранит основной `site-content` как `JSONB`.
- `app_inquiries`
  Хранит заявки как отдельные строки.

## API

Публичные routes:

- `GET /api/site-content`
- `POST /api/inquiries`
- `GET /api/status`
- `GET /booking`

Admin-ready routes:

- `GET /api/admin/site-content`
- `PUT /api/admin/site-content`
- `GET /api/admin/inquiries?limit=200`

Для admin-routes нужен заголовок:

```text
X-Admin-Key: <ADMIN_API_KEY>
```

## Про папку `data/`

Папка `data/` больше не является runtime-storage backend-а.

Сейчас она нужна только если ты хочешь:

- перенести старый `site-content.json` в `PostgreSQL`
- перенести старый `inquiries.json` в `PostgreSQL`

Для этого есть отдельная команда:

```bash
npm run db:migrate-data
```

## Frontend

Каждая страница имеет свой HTML и page-script:

- `index.html` -> `public/js/home.js`
- `restaurant.html` -> `public/js/restaurant.js`
- `menu.html` -> `public/js/menu.js`
- `events.html` -> `public/js/events.js`
- `hotel.html` -> `public/js/hotel.js`
- `suites.html` -> `public/js/suites.js`
- `sauna.html` -> `public/js/sauna.js`
- `contact.html` -> `public/js/contact.js`
- `admin.html` -> `public/js/admin.js`

## Dev watcher

`npm run dev` sledit za:

- `server.py`
- `backend/`
- `public/`
- `scripts/`
- `.env`
- `.env.example`
- `requirements.txt`
- `package.json`

## Дальше

Эта архитектура уже готова для:

- настоящей admin-auth
- editor-а контента
- просмотра заявок из базы
- upload-а картинок
- audit trail для admin-изменений

## Backend-разработка

Подробная памятка лежит здесь:

- [docs/backend-development.md](docs/backend-development.md)
