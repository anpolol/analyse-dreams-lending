// Единый адрес API для всех страниц (лендинг, lk, legal). Подключать первым —
// раньше analytics.js / auth.js / app*.js. Локально бэкенд поднят в docker на
// порту 8100, в проде API живёт на api.analysedreams.com.
//
// Окружение определяем по хосту страницы: localhost / 127.* / голый IP
// (например, телефон в той же сети открывает http://192.168.x.x:8080) —
// локальный бэкенд, любой домен — продовый.
(function () {
  var host = window.location.hostname;
  var isLocal = host === 'localhost' || host === '::1' || host.indexOf('127.') === 0 || /^\d+\.\d+\.\d+\.\d+$/.test(host);
  window.AD_API_BASE = isLocal
    ? window.location.protocol + '//' + host + ':8100'
    : 'https://api.analysedreams.com';

  // Человекочитаемые сообщения об ошибках API — один источник для всех страниц:
  // вместо «HTTP 500» / «Internal Server Error» / отвалившейся сети — понятный текст.
  // Серверные detail'ы авторизации уже на русском, их пропускаем как есть (AD_API_ERROR);
  // технические тексты разбора переведены в DETAIL_RU.
  var DETAIL_RU = {
    'Previous message is still being processed': 'Предыдущее сообщение ещё обрабатывается — подождите пару секунд.',
    'Dialog already completed': 'Этот разбор уже завершён.',
    'Dialog not found': 'Разбор не найдён — начните новый.',
    'New dialog must start with a message': 'Сначала опишите сон и отправьте его.',
    'Message is required': 'Введите сообщение.'
  };

  window.AD_HTTP_ERROR = function (status) {
    if (status === 0) return 'Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз.';
    if (status === 401) return 'Сессия истекла — войдите заново.';
    if (status === 403) return 'Недостаточно прав для этого действия.';
    if (status === 404) return 'Запись не найдена — возможно, она уже удалена.';
    if (status === 409) return 'Действие уже выполняется — подождите пару секунд.';
    if (status === 422) return 'Проверьте правильность заполненных полей.';
    if (status === 429) return 'Слишком много запросов — подождите немного и попробуйте снова.';
    return 'Что-то пошло не так на сервере. Попробуйте ещё раз.';
  };

  window.AD_API_ERROR = function (status, body) {
    var detail = body && body.detail;
    if (typeof detail === 'string') {
      if (DETAIL_RU[detail]) return DETAIL_RU[detail];
      // «Internal Server Error» — технический текст, дальше статус скажет больше.
      if (detail !== 'Internal Server Error') return detail;
    }
    return window.AD_HTTP_ERROR(status);
  };
})();
