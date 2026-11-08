(function () {
  var API_BASE = window.AD_API_BASE;
  var LS_KEY = 'ad_auth_session';
  var REFRESH_LEEWAY_SECONDS = 60;

  var listeners = [];
  var session = loadSession();

  // Другая вкладка могла ротировать refresh-токен (он одноразовый) или выйти:
  // подхватываем сессию из localStorage, иначе наша вкладка потратит уже
  // отозванный токен и внезапно разлогинится. На смену присутствия сессии
  // (вход/выход в другой вкладке) оповещаем слушателей.
  window.addEventListener('storage', function (e) {
    if (e.key !== LS_KEY) return;
    var hadSession = !!session;
    session = loadSession();
    if (!!session !== hadSession) notify();
  });

  function loadSession() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (s && s.access_token) return s;
    } catch (e) {}
    return null;
  }

  function saveSession(s) {
    session = s;
    try {
      if (s) localStorage.setItem(LS_KEY, JSON.stringify(s));
      else localStorage.removeItem(LS_KEY);
    } catch (e) {}
    notify();
  }

  function notify() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](session); } catch (e) {}
    }
  }

  function isExpired(s) {
    if (!s || !s.expires_at) return true;
    return Date.now() / 1000 > (s.expires_at - REFRESH_LEEWAY_SECONDS);
  }

  var refreshing = null;
  function refresh() {
    if (refreshing) return refreshing;
    // Гонка с другой вкладкой: она могла обновить токены прямо перед нами —
    // берём свежие из localStorage, чтобы не потратить отозванный refresh-токен.
    var stored = loadSession();
    if (stored && session && stored.refresh_token !== session.refresh_token && !isExpired(stored)) {
      session = stored;
    }
    if (!session || !session.refresh_token) {
      refreshing = Promise.resolve(null);
      refreshing.then(function () { refreshing = null; });
      return refreshing;
    }
    var rt = session.refresh_token;
    refreshing = fetch(API_BASE + '/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt })
    }).then(function (res) {
      if (!res.ok) return null;
      return res.json();
    }).then(function (newSession) {
      if (newSession && newSession.access_token) {
        saveSession(newSession);
        return newSession;
      }
      saveSession(null);
      return null;
    }).catch(function () {
      saveSession(null);
      return null;
    }).then(function (r) { refreshing = null; return r; });
    return refreshing;
  }

  function getAccessToken() {
    if (!session) return Promise.resolve(null);
    if (isExpired(session)) return refresh().then(function (s) { return s ? s.access_token : null; });
    return Promise.resolve(session.access_token);
  }

  function authHeaders(token) {
    if (token) return Promise.resolve({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return getAccessToken().then(function (t) {
      var h = { 'Content-Type': 'application/json' };
      if (t) h['Authorization'] = 'Bearer ' + t;
      return h;
    });
  }

  function requestOtp(email, redirectTo, dream) {
    return fetch(API_BASE + '/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, redirect_to: redirectTo || (window.location.origin + '/lk'), dream: dream || null })
    }).then(function (res) {
      if (!res.ok) return res.json().catch(function () { return null; }).then(function (b) {
        throw new Error(window.AD_API_ERROR(res.status, b));
      });
      return res.json();
    }, function () {
      // fetch кидает TypeError с техническим текстом — пользователю он не нужен.
      throw new Error(window.AD_HTTP_ERROR(0));
    });
  }

  function verifyEmailToken(token, type) {
    return fetch(API_BASE + '/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, type: type })
    }).then(function (res) {
      if (!res.ok) return res.json().catch(function () { return null; }).then(function (b) {
        throw new Error(window.AD_API_ERROR(res.status, b));
      });
      return res.json();
    }, function () {
      throw new Error(window.AD_HTTP_ERROR(0));
    });
  }

  function logout() {
    var rt = session ? session.refresh_token : null;
    var p;
    if (rt) {
      p = fetch(API_BASE + '/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: rt })
      }).catch(function () {});
    } else {
      p = Promise.resolve();
    }
    saveSession(null);
    return p;
  }

  function onSessionChange(cb) {
    listeners.push(cb);
    return function () {
      var i = listeners.indexOf(cb);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  function parseHashToken() {
    var hash = window.location.hash || '';
    if (!hash) return null;
    var params = new URLSearchParams(hash.replace(/^#/, ''));
    var token = params.get('token');
    var type = params.get('type');
    if (token && type) return { token: token, type: type };
    return null;
  }

  function clearHash() {
    try {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (e) {}
  }

  window.ADAuth = {
    getSession: function () { return session; },
    setSession: saveSession,
    clearSession: function () { saveSession(null); },
    getAccessToken: getAccessToken,
    authHeaders: authHeaders,
    requestOtp: requestOtp,
    verifyEmailToken: verifyEmailToken,
    logout: logout,
    onSessionChange: onSessionChange,
    parseHashToken: parseHashToken,
    clearHash: clearHash,
    API_BASE: API_BASE
  };
})();