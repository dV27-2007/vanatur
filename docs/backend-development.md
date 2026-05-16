# Backend Development Guide

Это актуальная памятка по backend-архитектуре `VANATUR`.

## Текущая идея

Backend работает только с `PostgreSQL` как с runtime-storage.

Это значит:

- `site-content` хранится в базе
- `inquiries` хранятся в базе
- `data/` не участвует в обычной работе сервера

Если нужно перенести starye JSON dannye, eto delaetsya otdel'noy migracionnoy komandoy, a ne bootstrap-ом runtime.

## Слои

### `config`

- загрузка `.env`
- сбор `Settings`
- базовые app constants

### `db`

- подключение к `PostgreSQL`
- создание базы при необходимости
- создание таблиц

### `models/`

- доменные модели
- отдельные файлы под сущности

Сейчас там есть:

- `models/site_content.py`
- `models/inquiry.py`

### `schemas`

- нормализация входных данных
- серверная валидация

### `crud`

- SQL-операции
- чтение и запись сущностей

### `routes`

- публичные routes
- admin routes

### `http`

- request context
- json/text responses
- общие HTTP helper-ы

## Почему `models/` как папка лучше

Потому что дальше backend будет расти, и один `models.py` быстро превратится в мусорный склад.

Папка `models/` позволяет:

- держать каждую сущность отдельно
- проще расширять структуру
- не смешивать модели контента, заявок и будущих admin-сущностей

## Про `data/`

`data/` больше не является частью runtime backend.

Это только источник для ручной миграции:

```bash
npm run db:migrate-data
```

После этого реальные данные должны жить уже только в `PostgreSQL`.

## Поток старта

При запуске:

1. `server.py` вызывает `backend.app.run()`
2. `Settings.from_root()` загружает `.env`
3. `DatabaseManager` читает `DATABASE_URL`
4. backend пытается подключиться к целевой базе
5. если базы нет, пытается создать её
6. создаёт таблицы
7. поднимает HTTP server

Bootstrap больше не тянет данные из `data/` автоматически.

## Когда использовать миграцию из `data/`

Только если у тебя уже есть старые JSON:

- `data/site-content.json`
- `data/inquiries.json`

И ты хочешь один раз загрузить их в `PostgreSQL`.

Для этого есть:

```bash
npm run db:migrate-data
```

## Как правильно добавлять новую сущность

Если появится новая доменная сущность:

1. создай модель в `backend/models/`
2. добавь schema/validation в `backend/schemas.py` или отдельный schema-module
3. добавь CRUD-функции в `backend/crud/`
4. добавь route в `backend/routes/`

## Что не надо делать

- не возвращать runtime storage в JSON
- не писать SQL прямо в routes
- не складывать все модели обратно в один файл
- не делать seed из `data/` во время обычного старта backend

## Следующий хороший шаг

Следующий сильный этап для проекта:

1. login/logout для admin
2. editor контента через `PUT /api/admin/site-content`
3. список заявок из `app_inquiries`
4. upload картинок
5. audit trail изменений
