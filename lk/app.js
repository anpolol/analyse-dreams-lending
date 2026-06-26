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
  CancelSubscriptionLink,
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
    const {
      error: err
    } = await window._supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin + '/lk'
      }
    });
    setLoading(false);
    if (err) setError(err.message);else {
      try {
        localStorage.setItem('ad_last_email', email.trim());
      } catch (e) {}
      setSent(true);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-wash)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(420px, 100%)',
      background: 'var(--surface-raised)',
      borderRadius: 24,
      padding: '40px 36px',
      boxShadow: 'var(--shadow-xl)'
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
  }, "\u0410\u043D\u0430\u043B\u0438\u0437 \u0441\u043D\u043E\u0432")), sent ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 12px',
      fontSize: '1.25rem',
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, "\u0421\u0441\u044B\u043B\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--text-body)',
      lineHeight: 1.6
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u043E\u0447\u0442\u0443 ", /*#__PURE__*/React.createElement("strong", null, email), " \u2014 \u0442\u0430\u043C \u0441\u0441\u044B\u043B\u043A\u0430 \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430. \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0435\u0451 \u0441 \u044D\u0442\u043E\u0433\u043E \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: '1.25rem',
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, "\u0412\u043E\u0439\u0442\u0438 \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      color: 'var(--text-muted)',
      lineHeight: 1.5,
      fontSize: '0.95rem'
    }
  }, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 email \u2014 \u043C\u044B \u043F\u0440\u0438\u0448\u043B\u0451\u043C \u0441\u0441\u044B\u043B\u043A\u0443. \u0411\u0435\u0437 \u043F\u0430\u0440\u043E\u043B\u044F."), /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "\u0432\u0430\u0448@email.com",
    value: email,
    onChange: e => setEmail(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') sendLink();
    },
    style: {
      width: '100%',
      border: '1.5px solid var(--border-subtle)',
      borderRadius: 12,
      padding: '12px 14px',
      fontSize: '1rem',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-strong)',
      background: 'var(--paper-000)',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: 12,
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("label", {
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
  }, "согласием на обработку персональных данных"), " и ", /*#__PURE__*/React.createElement("a", {
    href: "/legal/privacy.html",
    target: "_blank",
    rel: "noopener",
    style: {
      color: 'var(--text-link)'
    }
  }, "политикой обработки персональных данных"))), error && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      color: '#c0392b',
      fontSize: '0.88rem'
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    onClick: sendLink,
    disabled: loading || !email.trim() || !consent,
    style: {
      width: '100%',
      background: 'var(--navy-800)',
      color: 'var(--paper-050)',
      border: 'none',
      borderRadius: 14,
      padding: '14px 20px',
      fontSize: '1rem',
      fontWeight: 700,
      cursor: loading || !email.trim() || !consent ? 'not-allowed' : 'pointer',
      opacity: loading || !email.trim() || !consent ? 0.5 : 1,
      fontFamily: 'var(--font-sans)',
      transition: 'opacity 0.15s'
    }
  }, loading ? 'Отправляем…' : 'Отправить ссылку →')), /*#__PURE__*/React.createElement(LegalFooter, null)));
}
function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
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
  useEffect(() => {
    fetch('https://api.analysedreams.com/tariffs/').then(r => r.ok ? r.json() : null).then(data => {
      if (Array.isArray(data)) setTariffs(data);
      adTrack('pricing_viewed');
    }).catch(() => {});
  }, []);
  useEffect(() => {
    window._supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const {
      data: {
        subscription
      }
    } = window._supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.access_token) {
        const token = session.access_token;
        (async () => {
          try {
            const [regRes, balRes] = await Promise.all([authHeaders(token).then(headers => fetch('https://api.analysedreams.com/user/register', {
              method: 'POST',
              headers: Object.assign({}, headers, {
                'X-Anon-Id': window.adGetAnonId()
              })
            })), authHeaders(token).then(headers => fetch('https://api.analysedreams.com/payment/balance', {
              headers
            }))]);
            const data = regRes.ok ? await regRes.json() : null;
            if (data?.is_new_user) adTrack('registration_completed', {}, token);
            const balData = balRes.ok ? await balRes.json() : null;
            if (balData) setSubscription({
              isSubscribed: !!balData.is_subscribed,
              autoRenew: !!balData.subscription_auto_renew
            });
            if (data?.dreams_balance != null) setBalance(data.dreams_balance);
            setAnalyzeReady(true);
            const histRes = await fetch('https://api.analysedreams.com/history/', {
              headers: await authHeaders(token)
            });
            const hist = histRes.ok ? await histRes.json() : [];
            if (Array.isArray(hist)) setHistory(hist);
          } catch (e) {
            setAnalyzeReady(true);
          }
        })();
        loadArchetypes();
      }
    });
    return () => subscription.unsubscribe();
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
      background: 'var(--bg-wash)',
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
      const {
        data: {
          session
        }
      } = await window._supabase.auth.getSession();
      adTrack('tariff_selected', {
        tariff_id: t.id,
        price: t.price,
        currency: 'RUB'
      }, session?.access_token);
      setPendingTariff(t);
      const isSubscription = t.type === "subscription";
      const url = isSubscription ? 'https://api.analysedreams.com/payment/subscribe' : 'https://api.analysedreams.com/payment/checkout';
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
          'Authorization': `Bearer ${session.access_token}`
        },
        body
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.confirmation_token) {
        setPaymentToken(data.confirmation_token);
      } else if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (err) {
      flash('Ошибка при оплате, попробуй ещё раз');
    }
  }
  async function refreshBalanceAfterPayment(prevBalance, attempts = 6, delayMs = 1200) {
    const {
      data: {
        session
      }
    } = await window._supabase.auth.getSession();
    const headers = await authHeaders(session.access_token);
    for (let i = 0; i < attempts; i++) {
      await new Promise(r => setTimeout(r, delayMs));
      try {
        const res = await fetch('https://api.analysedreams.com/payment/balance', {
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
    const {
      data: {
        session
      }
    } = await window._supabase.auth.getSession();
    adTrack('payment_succeeded', {
      tariff_id: pendingTariff?.id,
      price: pendingTariff?.price,
      currency: 'RUB'
    }, session?.access_token);
    setPendingTariff(null);
    refreshBalanceAfterPayment(balance);
  }
  async function getNotebook() {
    const {
      data: {
        session
      }
    } = await window._supabase.auth.getSession();
    adTrack('notebook_opened', {}, session?.access_token);
    const a = document.createElement("a");
    a.href = "/workbook_analyse_dreams.pdf";
    a.download = "workbook_analyse_dreams.pdf";
    a.click();
  }
  async function signOut() {
    await window._supabase.auth.signOut();
  }
  function loadArchetypes() {
    authHeaders().then(headers => fetch('https://api.analysedreams.com/symbols/archetypes', {
      headers
    })).then(r => r.ok ? r.json() : null).then(data => {
      if (data && Array.isArray(data.symbols)) setArchetypes(data);
    }).catch(() => {});
  }
  function completeAnalysis() {
    authHeaders().then(headers => fetch('https://api.analysedreams.com/history/', {
      headers
    })).then(r => r.ok ? r.json() : []).then(data => {
      if (Array.isArray(data)) setHistory(data);
    }).catch(() => {});
    loadArchetypes();
  }
  function startAnalysis() {}
  function updateBalance(b) {
    setBalance(b);
  }
  async function cancelSubscription() {
    if (!confirm("Отменить подписку? Текущий баланс разборов останется, но мы не будем списывать новый цикл, когда он закончится.")) return;
    try {
      const {
        data: {
          session
        }
      } = await window._supabase.auth.getSession();
      const res = await fetch('https://api.analysedreams.com/payment/subscription/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
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
    onSignOut: signOut
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
    tariffs: tariffs
  }), /*#__PURE__*/React.createElement(NotebookCard, {
    onGet: getNotebook
  }), subscription.isSubscribed && subscription.autoRenew && /*#__PURE__*/React.createElement(CancelSubscriptionLink, {
    onCancel: cancelSubscription
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
