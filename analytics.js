(function () {
  var TRACK_URL = 'https://api.analysedreams.com/events/track';
  var METRIKA_ID = 110182660;

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getAnonId() {
    try {
      var id = localStorage.getItem('ad_anon_id');
      if (!id) { id = uuid(); localStorage.setItem('ad_anon_id', id); }
      return id;
    } catch (e) { return null; }
  }

  function getSessionId() {
    try {
      var id = sessionStorage.getItem('ad_session_id');
      if (!id) { id = uuid(); sessionStorage.setItem('ad_session_id', id); }
      return id;
    } catch (e) { return null; }
  }

  function getUtm() {
    try {
      var stored = localStorage.getItem('ad_utm');
      if (stored) return JSON.parse(stored);
      var params = new URLSearchParams(window.location.search);
      var utm = {
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
      };
      if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
        localStorage.setItem('ad_utm', JSON.stringify(utm));
      }
      return utm;
    } catch (e) { return {}; }
  }

  function getPlatform() {
    return /Mobi|Android/i.test(navigator.userAgent) ? 'mobile_web' : 'desktop_web';
  }

  var ymClientId = null;

  function getYmUidFromCookie() {
    try {
      var match = document.cookie.match(/(?:^|; )_ym_uid=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    } catch (e) { return null; }
  }

  function initYmClientId() {
    try {
      if (typeof window.ym === 'function') {
        window.ym(METRIKA_ID, 'getClientID', function (clientID) {
          if (clientID) ymClientId = clientID;
        });
      }
    } catch (e) {}
  }
  initYmClientId();

  function adTrack(eventName, properties, authToken) {
    if (typeof window.ym === 'function') {
      try { window.ym(METRIKA_ID, 'reachGoal', eventName, properties || {}); } catch (e) {}
    }

    var utm = getUtm();
    var payload = {
      event_name: eventName,
      anon_id: getAnonId(),
      session_id: getSessionId(),
      client_id: ymClientId || getYmUidFromCookie(),
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      platform: getPlatform(),
      properties: properties || {},
    };
    var headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
    try {
      fetch(TRACK_URL, { method: 'POST', headers: headers, body: JSON.stringify(payload), keepalive: true }).catch(function () {});
    } catch (e) {}
  }

  window.adTrack = adTrack;
  window.adGetAnonId = getAnonId;

  try {
    if (!sessionStorage.getItem('ad_session_started')) {
      sessionStorage.setItem('ad_session_started', '1');
      adTrack('session_started', {});
    }
  } catch (e) {}
})();
