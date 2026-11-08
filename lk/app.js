(function () {
const {
  useState,
  useEffect,
  useRef
} = React;
const {
  loadState,
  LS_KEY,
  SEED_HISTORY,
  TARIFFS,
  authHeaders,
  LOGO,
  Header,
  Tabs,
  BalanceCard,
  TariffGrid,
  NotebookCard,
  HistoryList,
  ArchetypesTab,
  ArchetypeDetail,
  Toast,
  DreamChat,
  loadYooKassaWidgetScript,
  PaymentWidgetModal,
  SupportWidget,
  LegalFooter
} = window;
const API_BASE = window.AD_API_BASE;
const AUTH_INPUT_STYLE = {
  width: '100%',
  border: '1.5px solid rgba(196,181,232,0.28)',
  borderRadius: 12,
  padding: '12px 14px',
  fontSize: '1rem',
  fontFamily: 'var(--font-sans)',
  color: 'var(--text-strong)',
  background: 'rgba(18,23,43,0.5)',
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: 12,
  display: 'block'
};
function authButtonStyle(disabled) {
  return {
    width: '100%',
    background: 'var(--accent)',
    color: 'var(--accent-contrast)',
    border: 'none',
    borderRadius: 14,
    padding: '14px 20px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'var(--font-sans)',
    transition: 'opacity 0.15s'
  };
}
function mapAuthError(message) {
  if (!message) return 'Что-то пошло не так. Попробуйте ещё раз.';
  if (/already registered|already exists/i.test(message)) return 'Этот email уже зарегистрирован — попробуйте войти.';
  if (/Password should be at least/i.test(message)) return 'Пароль должен быть не короче 6 символов.';
  return message;
}
// Черновик сна, набранный на лендинге: уйдёт на сервер вместе с запросом ссылки,
// чтобы пережить смену браузера/устройства между отправкой email и кликом по ссылке.
function readLandingDraft() {
  try {
    const raw = localStorage.getItem('ad_landing_context');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.dream === 'string' && parsed.dream.trim() ? parsed.dream : null;
  } catch (e) {
    return null;
  }
}
function AuthShell(props) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(420px, 100%)',
      background: 'linear-gradient(135deg, rgba(168,140,220,0.28) 0%, rgba(143,214,232,0.18) 100%)',
      border: '1px solid rgba(196,181,232,0.45)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderRadius: 24,
      padding: '40px 36px',
      boxShadow: '0 0 80px rgba(168,140,220,0.35), 0 0 30px rgba(143,214,232,0.18), 0 24px 56px rgba(0,0,0,0.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO,
    alt: "",
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '1rem',
      color: 'var(--text-strong)'
    }
  }, "Анализ снов")), props.children, /*#__PURE__*/React.createElement(LegalFooter, null)));
}
function LoginScreen() {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('ad_last_email') || "";
    } catch (e) {
      return "";
    }
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  async function sendLink() {
    if (!email.trim() || !consent) return;
    adTrack('registration_started');
    setLoading(true);
    setError("");
    try {
      await window.ADAuth.requestOtp(email.trim(), window.location.origin + '/lk', readLandingDraft() || undefined);
      try {
        localStorage.setItem('ad_last_email', email.trim());
      } catch (e) {}
      setSent(true);
    } catch (err) {
      setError(mapAuthError(err.message));
    } finally {
      setLoading(false);
    }
  }
  const consentBlock = /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      margin: '2px 0 16px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: consent,
    onChange: e => setConsent(e.target.checked),
    style: {
      marginTop: 3,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      lineHeight: 1.45
    }
  }, "Я согласен(а) с ", /*#__PURE__*/React.createElement("a", {
    href: "/legal/consent.html",
    target: "_blank",
    rel: "noopener",
    style: {
      color: 'var(--text-link)'
    }
  }, "согласием на обработку персональных данных"), ", ", /*#__PURE__*/React.createElement("a", {
    href: "/legal/privacy.html",
    target: "_blank",
    rel: "noopener",
    style: {
      color: 'var(--text-link)'
    }
  }, "политикой обработки персональных данных"), " и ", /*#__PURE__*/React.createElement("a", {
    href: "/legal/terms.html",
    target: "_blank",
    rel: "noopener",
    style: {
      color: 'var(--text-link)'
    }
  }, "пользовательским соглашением")));
  const errorBlock = error && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      color: '#ff6b6b',
      fontSize: '0.88rem'
    }
  }, error);
  let content;
  if (sent) {
    content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: '0 0 12px',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--text-strong)'
      }
    }, "Ссылка отправлена"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 12px',
        color: 'var(--text-body)',
        lineHeight: 1.6
      }
    }, "Проверьте почту ", /*#__PURE__*/React.createElement("strong", null, email), " — там ссылка для входа. Откройте её с этого устройства."), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        color: 'var(--text-muted)',
        lineHeight: 1.45,
        fontSize: '0.85rem'
      }
    }, "Не видите письма? Проверьте папку «Спам» — иногда оно попадает туда."));
  } else {
    const disabled = loading || !email.trim() || !consent;
    content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: '0 0 8px',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--text-strong)'
      }
    }, "Вход по ссылке"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 24px',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
        fontSize: '0.95rem'
      }
    }, "Введите email — мы пришлём ссылку для входа. Без пароля."), /*#__PURE__*/React.createElement("input", {
      type: "email",
      placeholder: "ваш@email.com",
      value: email,
      onChange: e => setEmail(e.target.value),
      onKeyDown: e => {
        if (e.key === 'Enter') sendLink();
      },
      style: AUTH_INPUT_STYLE
    }), consentBlock, errorBlock, /*#__PURE__*/React.createElement("button", {
      onClick: sendLink,
      disabled,
      style: authButtonStyle(disabled)
    }, loading ? 'Отправляем…' : 'Отправить ссылку →'));
  }
  return /*#__PURE__*/React.createElement(AuthShell, null, content);
}
function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [previewSignedOut, setPreviewSignedOut] = useState(false);
  const initial = loadState();
  const [tab, setTab] = useState("cabinet");
  const [balance, setBalance] = useState(0);
  const [analyzeReady, setAnalyzeReady] = useState(false);
  const [subscription, setSubscription] = useState({
    isSubscribed: false,
    autoRenew: true
  });
  const [history, setHistory] = useState(SEED_HISTORY);
  const [archetypes, setArchetypes] = useState({
    symbols: [],
    connections: []
  });
  const [selectedArchetypeId, setSelectedArchetypeId] = useState(null);
  const [focusDreamId, setFocusDreamId] = useState(null);
  const [tariffs, setTariffs] = useState(TARIFFS);
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [pendingDream, setPendingDream] = useState("");
  const [paymentToken, setPaymentToken] = useState(null);
  const [pendingTariff, setPendingTariff] = useState(null);
  const registeredUserRef = useRef(null);
  // === PREVIEW MODE (временный обход авторизации для локального превью тёмной темы) ===
  const PREVIEW_USER = { id: 'preview-local', email: 'preview@local' };
  const PREVIEW_ON = false;
  const PREVIEW_MOCK_HISTORY = [{
    id: 'p-1',
    date: '2026-10-28',
    dream_title: 'Бесконечный коридор',
    dream_short: 'Я шёл по гостинице, где номера повторялись, и никак не мог найти свой. Ключ подходил ко всем дверям, но за каждой была чужая комната.',
    dream_description: 'Я шёл по гостинице, где номера повторялись, и никак не мог найти свой. Ключ подходил ко всем дверям, но за каждой была чужая комната.\n\nВ конце коридора стоял человек со спины, очень знакомый. Я окликнул — он обернулся, и это был я сам, но старше. Он улыбнулся и протянул второй ключ.\n\nЯ проснулся с чувством, что мне что-то передали, но не успел увидеть что.',
    insight: JSON.stringify({ insight: 'Коридор повторяющихся дверей — поиск устойчивой идентичности. Ключ, открывающий чужие комнаты, — ощущение, что вы справляетесь с ролями, которые вам не близки. Встреча со старшим собой указывает на потребность в опоре на внутренний авторитет, а не на внешние ориентиры.' })
  }, {
    id: 'p-2',
    date: '2026-10-21',
    dream_title: 'Море подо льдом',
    dream_short: 'Лёд был прозрачным, и я видел, как внизу течёт тёмная вода. Я знал, что не провалюсь, но боялся сделать шаг.',
    dream_description: 'Лёд был прозрачным, и я видел, как внизу течёт тёмная вода. Я знал, что не провалюсь, но боялся сделать шаг.\n\nПодо льдом медленно проплыла большая тень — не страшная, а скорее спокойная. Я проснулся, когда решил всё-таки шагнуть.',
    insight: JSON.stringify({ insight: 'Лёд над тёмной водой — тонкий слой контроля над сильными эмоциями. Вы чувствуете опору, но страх шага говорит о том, что контроль обходится дорогой ценой — вы не позволяете себе «течь». Тень внизу — не угроза, а та часть переживаний, которая ждёт признания.' })
  }, {
    id: 'p-3',
    date: '2026-10-14',
    dream_title: 'Дом без стен',
    dream_short: 'Мой дом стоял на поле, и у него не было наружных стен — только крыша на столбах. Ветер свободно гулял внутри, но мне было спокойно.',
    dream_description: 'Мой дом стоял на поле, и у него не было наружных стен — только крыша на столбах. Ветер свободно гулял внутри, но мне было спокойно.\n\nЯ накрывал на стол, и кто-то должен был прийти. Я не знал кто, но накрывал на двоих.',
    insight: JSON.stringify({ insight: 'Дом без стен — открытость границ и одновременно потребность в укрытии, которое не изолирует. Накрытый на двоих стол — готовность к встрече с чем-то ещё не названным. Сон указывает на переход от защиты к контакту.' })
  }];
  const PREVIEW_MOCK_ARCHETYPES = {
    symbols: [{
      id: 'self', name: 'Самость', is_revealed: true,
      description: 'Центр личности, вокруг которого выстраивается всё остальное. В снах приходит как фигура, объединяющая противоположности.',
      image_url: null, dreams: []
    }, {
      id: 'shadow', name: 'Тень', is_revealed: true,
      description: 'То, что вытеснено и не признано в себе. Часто является как незнакомец или пугающий образ.',
      image_url: null, dreams: [{ dream_id: 'p-1', manifestation: 'старший двойник в коридоре', date: '2026-10-28' }]
    }, {
      id: 'anima', name: 'Анима', is_revealed: true,
      description: 'Внутренний образ живой, эмоциональной части психики. Связывает с чувствами и смыслами.',
      image_url: null, dreams: [{ dream_id: 'p-2', manifestation: 'течение воды подо льдом', date: '2026-10-21' }]
    }, {
      id: 'persona', name: 'Персона', is_revealed: true,
      description: 'Маска, которую носим для мира. Повторяющиеся двери — её классический мотив.',
      image_url: null, dreams: [{ dream_id: 'p-1', manifestation: 'ключ, подходящий к чужим комнатам', date: '2026-10-28' }]
    }, {
      id: 'mother', name: 'Мать', is_revealed: false,
      description: 'Архетип питающей и поглощающей опоры. Ждёт проявления в ваших снах.',
      image_url: null, dreams: []
    }, {
      id: 'wise', name: 'Мудрец', is_revealed: false,
      description: 'Внутренний проводник и авторитет. Появляется, когда созревает готовность к решению.',
      image_url: null, dreams: []
    }, {
      id: 'child', name: 'Дитя', is_revealed: false,
      description: 'Образ начала и потенциала. Часто возвращается в моменты перестройки.',
      image_url: null, dreams: []
    }, {
      id: 'hero', name: 'Герой', is_revealed: false,
      description: 'Часть, берущая на себя действие и преодоление. Пока не проявился в снах.',
      image_url: null, dreams: []
    }],
    connections: [
      { a: 'self', b: 'shadow', strength: 0.8 },
      { a: 'self', b: 'anima', strength: 0.7 },
      { a: 'self', b: 'persona', strength: 0.6 },
      { a: 'shadow', b: 'persona', strength: 0.5 },
      { a: 'anima', b: 'shadow', strength: 0.4 }
    ]
  };
  // === /PREVIEW MODE ===
  useEffect(() => {
    if (!PREVIEW_ON) return;
    setBalance(3);
    setAnalyzeReady(true);
    setHistory(PREVIEW_MOCK_HISTORY);
    setArchetypes(PREVIEW_MOCK_ARCHETYPES);
    setSubscription({ isSubscribed: true, autoRenew: true });
  }, []);
  useEffect(() => {
    fetch(`${API_BASE}/tariffs/`).then(r => r.ok ? r.json() : null).then(data => {
      if (Array.isArray(data)) setTariffs(data);
      adTrack('pricing_viewed');
    }).catch(() => {});
  }, []);

  async function handleNewSession(session) {
    if (!session) {
      setUser(null);
      registeredUserRef.current = null;
      setAuthLoading(false);
      return;
    }
    const u = session.user;
    setUser(u);
    setAuthLoading(false);
    if (registeredUserRef.current !== u.id) {
      registeredUserRef.current = u.id;
      const token = session.access_token;
      (async () => {
        try {
          const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, 'X-Anon-Id': window.adGetAnonId() };
          const [regRes, balRes] = await Promise.all([
            fetch(`${API_BASE}/user/register`, { method: 'POST', headers }),
            fetch(`${API_BASE}/payment/balance`, { headers })
          ]);
          const data = regRes.ok ? await regRes.json() : null;
          if (data?.is_new_user) adTrack('registration_completed', {}, token);
          const balData = balRes.ok ? await balRes.json() : null;
          if (balData) setSubscription({
            isSubscribed: !!balData.is_subscribed,
            autoRenew: !!balData.subscription_auto_renew
          });
          if (data?.dreams_balance != null) setBalance(data.dreams_balance);
          setAnalyzeReady(true);
          if (localStorage.getItem('ad_payment_redirect')) {
            localStorage.removeItem('ad_payment_redirect');
            refreshBalanceAfterPayment(balData?.dreams_balance ?? 0);
          }
          const histRes = await fetch(`${API_BASE}/history/`, { headers });
          const hist = histRes.ok ? await histRes.json() : [];
          if (Array.isArray(hist)) setHistory(hist);
          // Черновик сна, начатый на лендинге или в чете раньше: восстанавливаем после
          // входа — в том числе на другом устройстве, где и открыли ссылку из письма.
          const draftRes = await fetch(`${API_BASE}/user/draft`, { headers });
          const draft = draftRes.ok ? await draftRes.json() : null;
          if (draft?.dream) {
            setPendingDream(draft.dream);
            setChatOpen(true);
          }
        } catch (e) {
          setAnalyzeReady(true);
        }
      })();
      loadArchetypes();
    }
  }

  useEffect(() => {
    let unsub = null;
    (async () => {
      // Проверяем токен из email-ссылки в URL hash
      const hashToken = window.ADAuth.parseHashToken();
      if (hashToken) {
        window.ADAuth.clearHash();
        try {
          const session = await window.ADAuth.verifyEmailToken(hashToken.token, hashToken.type);
          window.ADAuth.setSession(session);
        } catch (e) {
          // невалидная/устаревшая ссылка — просто показываем логин
        }
      }

      // Существующая сессия из localStorage
      const existing = window.ADAuth.getSession();
      if (PREVIEW_ON && !existing) {
        if (!previewSignedOut) {
          setUser(PREVIEW_USER);
          setAnalyzeReady(true);
        }
        setAuthLoading(false);
      } else if (existing) {
        // Если access-токен истёк, попробуем refresh
        const token = await window.ADAuth.getAccessToken();
        const s = window.ADAuth.getSession();
        if (s) handleNewSession(s);
        else setAuthLoading(false);
      } else {
        setAuthLoading(false);
      }

      // Подписка на смену сессии (refresh, logout, вход по ссылке)
      unsub = window.ADAuth.onSessionChange(function (s) {
        if (PREVIEW_ON && !s) {
          if (!previewSignedOut) {
            setUser(PREVIEW_USER);
            setAnalyzeReady(true);
          }
          setAuthLoading(false);
          return;
        }
        handleNewSession(s);
      });
    })();
    return () => { if (unsub) unsub(); };
  }, []);

  useEffect(() => {
    if (!user || !analyzeReady) return;
    try {
      const raw = localStorage.getItem('ad_landing_context');
      if (raw) {
        const {
          dream,
          ts
        } = JSON.parse(raw);
        if (Date.now() - ts < 600000) {
          setPendingDream(dream || "");
          setChatOpen(true);
        }
        localStorage.removeItem('ad_landing_context');
      }
    } catch (e) {}
  }, [user, analyzeReady]);
  if (authLoading) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-sans)'
    }
  }, "\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026");
  if (!user) return /*#__PURE__*/React.createElement(LoginScreen, null);
  function flash(msg) {
    setToast(msg);
    clearTimeout(window.__lkToast);
    window.__lkToast = setTimeout(() => setToast(""), 2600);
  }
  async function buyTariff(t) {
    try {
      const token = await window.ADAuth.getAccessToken();
      adTrack('tariff_selected', {
        tariff_id: t.id,
        price: t.price,
        currency: 'RUB'
      }, token);
      setPendingTariff(t);
      const isSubscription = t.type === "subscription";
      const url = isSubscription ? `${API_BASE}/payment/subscribe` : `${API_BASE}/payment/checkout`;
      let widgetAvailable = true;
      try {
        await loadYooKassaWidgetScript();
      } catch (e) {
        widgetAvailable = false;
      }
      const confirmationType = widgetAvailable ? 'embedded' : 'redirect';
      const body = isSubscription ? JSON.stringify({
        confirmation_type: confirmationType
      }) : JSON.stringify({
        tariff_id: t.id,
        confirmation_type: confirmationType
      });
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.confirmation_token) {
        setPaymentToken(data.confirmation_token);
      } else if (data.payment_url) {
        localStorage.setItem('ad_payment_redirect', '1');
        window.location.href = data.payment_url;
      }
    } catch (err) {
      flash('Ошибка при оплате, попробуй ещё раз');
    }
  }
  async function refreshBalanceAfterPayment(prevBalance, attempts = 6, delayMs = 1200) {
    const headers = await window.ADAuth.authHeaders();
    for (let i = 0; i < attempts; i++) {
      await new Promise(r => setTimeout(r, delayMs));
      try {
        const res = await fetch(`${API_BASE}/payment/balance`, {
          headers
        });
        if (res.ok) {
          const data = await res.json();
          setSubscription({
            isSubscribed: !!data.is_subscribed,
            autoRenew: !!data.subscription_auto_renew
          });
          setBalance(data.dreams_balance);
          if (data.dreams_balance !== prevBalance) return;
        }
      } catch (e) {}
    }
  }
  function onPaymentWidgetClose() {
    setPaymentToken(null);
  }
  async function onPaymentWidgetSuccess() {
    setPaymentToken(null);
    flash('Оплата прошла успешно!');
    const token = await window.ADAuth.getAccessToken();
    adTrack('payment_succeeded', {
      tariff_id: pendingTariff?.id,
      price: pendingTariff?.price,
      currency: 'RUB'
    }, token);
    setPendingTariff(null);
    refreshBalanceAfterPayment(balance);
  }
  async function getNotebook() {
    const token = await window.ADAuth.getAccessToken();
    adTrack('notebook_opened', {}, token);
    const a = document.createElement("a");
    a.href = "/workbook_analyse_dreams.pdf";
    a.download = "workbook_analyse_dreams.pdf";
    a.click();
  }
  async function signOut() {
    if (PREVIEW_ON) {
      setPreviewSignedOut(true);
      setUser(null);
      return;
    }
    await window.ADAuth.logout();
  }
  async function loadArchetypes() {
    const headers = await window.ADAuth.authHeaders();
    fetch(`${API_BASE}/symbols/archetypes`, {
      headers
    }).then(r => r.ok ? r.json() : null).then(data => {
      if (data && Array.isArray(data.symbols)) setArchetypes(data);
    }).catch(() => {});
  }
  function completeAnalysis() {
    window.ADAuth.authHeaders().then(headers => fetch(`${API_BASE}/history/`, {
      headers
    })).then(r => r.ok ? r.json() : []).then(data => {
      if (Array.isArray(data)) setHistory(data);
    }).catch(() => {});
    loadArchetypes();
  }
  async function startAnalysis() {
    const token = await window.ADAuth.getAccessToken();
    adTrack('dream_submitted', {
      channel: 'lk'
    }, token);
  }
  function updateBalance(b) {
    setBalance(b);
  }
  async function cancelSubscription() {
    if (!confirm("Отменить подписку? Текущий баланс разборов останется, но мы не будем списывать новый цикл, когда он закончится.")) return;
    try {
      const token = await window.ADAuth.getAccessToken();
      const res = await fetch(`${API_BASE}/payment/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error();
      setSubscription(s => ({
        ...s,
        autoRenew: false
      }));
      flash("Подписка отменена. Автопродление отключено.");
    } catch {
      flash("Не удалось отменить подписку, попробуй ещё раз");
    }
  }
  function changeTab(t) {
    setFocusDreamId(null);
    setTab(t);
  }
  function openDreamFromArchetype(dreamId) {
    setSelectedArchetypeId(null);
    setFocusDreamId(dreamId);
    setTab("history");
  }
  function goTopUp() {
    setChatOpen(false);
    setPendingDream("");
    setTab("cabinet");
    flash("Выберите пакет разборов");
  }
  function viewArchetypesFromChat() {
    setChatOpen(false);
    setPendingDream("");
    setTab("archetypes");
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442"
  }, /*#__PURE__*/React.createElement(Header, {
    email: user.email,
    onSignOut: signOut,
    onLogoClick: () => changeTab("cabinet")
  }), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: changeTab
  }), tab === "cabinet" ? /*#__PURE__*/React.createElement("div", {
    className: "lk-stack"
  }, /*#__PURE__*/React.createElement(BalanceCard, {
    balance: balance,
    subscription: subscription,
    onAnalyze: () => setChatOpen(true),
    analyzeReady: analyzeReady
  }), /*#__PURE__*/React.createElement(TariffGrid, {
    onBuy: buyTariff,
    tariffs: tariffs,
    subscription: subscription,
    onCancelSubscription: cancelSubscription
  }), /*#__PURE__*/React.createElement(NotebookCard, {
    onGet: getNotebook
  })) : tab === "archetypes" ? /*#__PURE__*/React.createElement(ArchetypesTab, {
    archetypes: archetypes.symbols,
    connections: archetypes.connections,
    onSelect: setSelectedArchetypeId,
    onModel: () => setChatOpen(true),
    analyzeReady: analyzeReady
  }) : /*#__PURE__*/React.createElement(HistoryList, {
    items: history,
    focusId: focusDreamId
  })), /*#__PURE__*/React.createElement(DreamChat, {
    open: chatOpen,
    balance: balance,
    onClose: () => {
      setChatOpen(false);
      setPendingDream("");
    },
    onStart: startAnalysis,
    onComplete: completeAnalysis,
    onGoTopUp: goTopUp,
    onBalanceUpdate: updateBalance,
    onViewArchetypes: viewArchetypesFromChat,
    initialDream: pendingDream,
    email: user.email,
    dreamsCompletedCount: history.length
  }), /*#__PURE__*/React.createElement(ArchetypeDetail, {
    symbol: archetypes.symbols.find(s => s.id === selectedArchetypeId),
    onClose: () => setSelectedArchetypeId(null),
    onOpenDream: openDreamFromArchetype
  }), /*#__PURE__*/React.createElement(PaymentWidgetModal, {
    token: paymentToken,
    onClose: onPaymentWidgetClose,
    onSuccess: onPaymentWidgetSuccess
  }), /*#__PURE__*/React.createElement(SupportWidget, null), /*#__PURE__*/React.createElement(Toast, {
    msg: toast
  }), /*#__PURE__*/React.createElement(LegalFooter, null));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})();