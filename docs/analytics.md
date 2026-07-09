# Аналитика: adTrack и Яндекс.Метрика

## Как работает `adTrack`

Функция `adTrack(eventName, properties, authToken)` определена в [analytics.js](../analytics.js#L50-L71). При каждом вызове она делает две вещи одновременно:

1. **Пишет событие в Postgres** — отправляет `POST` на `https://api.analysedreams.com/events/track` с payload (event_name, anon_id, session_id, utm-метки, платформа, properties).
2. **Шлёт цель в Яндекс.Метрику** — вызывает `window.ym(METRIKA_ID, 'reachGoal', eventName, properties)`.

Счётчик Метрики (id `110182660`) подключён в [index.html](../index.html#L8-L19).

## Проблема

Договаривались только на 2 цели в Метрике: **регистрация** и **оплата**.

Но `reachGoal` сейчас вызывается на **каждое** событие через `adTrack`, без разделения. Список всех событий, которые сейчас улетают в Метрику как цели:

- `session_started`
- `login_clicked`
- `guide_clicked`
- `lk_clicked`
- `landing_viewed`
- `try_free_clicked`
- `dream_submitted`
- `continue_to_lk_clicked`
- `registration_started`
- `pricing_viewed`
- `registration_completed` — целевое событие "регистрация"
- `tariff_selected`
- `payment_succeeded` — целевое событие "оплата"
- `notebook_opened`
- `survey_rated`
- `survey_feedback_submitted`
- `summary_requested`

Т.е. из 17 событий реально нужными целями должны быть только `registration_completed` и `payment_succeeded`, а `reachGoal` уходит по всем.
