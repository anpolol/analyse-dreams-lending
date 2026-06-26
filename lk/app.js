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
const AUTH_INPUT_STYLE = {
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
};
function authButtonStyle(disabled) {
  return {
    width: '100%',
    background: 'var(--navy-800)',
    color: 'var(--paper-050)',
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
function authLinkButtonStyle() {
  return {
    background: 'none',
    border: 'none',
    color: 'var(--text-link)',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'var(--font-sans)',
    fontSize: 'inherit'
  };
}
function mapAuthError(message) {
  if (!message) return 'Что-то пошло не так. Попробуйте ещё раз.';
  if (/Invalid login credentials/i.test(message)) return 'Неверный email или пароль.';
  if (/already registered|already exists/i.test(message)) return 'Этот email уже зарегистрирован — попробуйте войти.';
  if (/Password should be at least/i.test(message)) return 'Пароль должен быть не короче 6 символов.';
  return message;
}
function AuthShell(props) {
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
  }, "Анализ снов")), props.children, /*#__PURE__*/React.createElement(LegalFooter, null)));
}
function LoginScreen() {
  const [mode, setMode] = useState('password'); // 'password' | 'magiclink'
  const [authAction, setAuthAction] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('ad_last_email') || "";
    } catch (e) {
      return "";
    }
  });
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  function switchMode(next) {
    setMode(next);
    setError("");
    setSent(false);
    setResetSent(false);
  }
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
    if (err) setError(mapAuthError(err.message));else {
      try {
        localStorage.setItem('ad_last_email', email.trim());
      } catch (e) {}
      setSent(true);
    }
  }
  async function submitPassword() {
    if (!email.trim() || !password || authAction === 'signup' && !consent) return;
    setLoading(true);
    setError("");
    if (authAction === 'signin') {
      const {
        error: err
      } = await window._supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      setLoading(false);
      if (err) setError(mapAuthError(err.message));else {
        try {
          localStorage.setItem('ad_last_email', email.trim());
        } catch (e) {}
      }
    } else {
      adTrack('registration_started');
      const {
        data,
        error: err
      } = await window._supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin + '/lk'
        }
      });
      setLoading(false);
      if (err) setError(mapAuthError(err.message));else {
        try {
          localStorage.setItem('ad_last_email', email.trim());
        } catch (e) {}
        if (!data.session) setSent(true);
      }
    }
  }
  async function sendReset() {
    if (!email.trim()) {
      setError('Введите email, чтобы восстановить пароль');
      return;
    }
    setLoading(true);
    setError("");
    const {
      error: err
    } = await window._supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + '/lk'
    });
    setLoading(false);
    if (err) setError(mapAuthError(err.message));else setResetSent(true);
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
  }, "согласием на обработку персональных данных"), " и ", /*#__PURE__*/React.createElement("a", {
    href: "/legal/privacy.html",
    target: "_blank",
    rel: "noopener",
    style: {
      color: 'var(--text-link)'
    }
  }, "политикой обработки персональных данных")));
  const errorBlock = error && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      color: '#c0392b',
      fontSize: '0.88rem'
    }
  }, error);
  let content;
  if (resetSent) {
    content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: '0 0 12px',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--text-strong)'
      }
    }, "Письмо отправлено"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 20px',
        color: 'var(--text-body)',
        lineHeight: 1.6
      }
    }, "Проверьте почту ", /*#__PURE__*/React.createElement("strong", null, email), " — там ссылка для восстановления пароля."), /*#__PURE__*/React.createElement("button", {
      onClick: () => switchMode('password'),
      style: authLinkButtonStyle()
    }, "← Назад ко входу"));
  } else if (sent) {
    const isSignup = mode === 'password' && authAction === 'signup';
    content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: '0 0 12px',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--text-strong)'
      }
    }, isSignup ? "Подтвердите почту" : "Ссылка отправлена"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        color: 'var(--text-body)',
        lineHeight: 1.6
      }
    }, "Проверьте почту ", /*#__PURE__*/React.createElement("strong", null, email), isSignup ? " — перейдите по ссылке в письме, чтобы подтвердить регистрацию." : " — там ссылка для входа. Откройте её с этого устройства."));
  } else {
    const toggle = /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        background: 'var(--bg-wash)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => switchMode('password'),
      style: {
        flex: 1,
        border: 'none',
        borderRadius: 9,
        padding: '8px 0',
        fontSize: '0.88rem',
        fontWeight: 700,
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        background: mode === 'password' ? 'var(--navy-800)' : 'transparent',
        color: mode === 'password' ? 'var(--paper-050)' : 'var(--text-muted)',
        transition: 'background 0.15s, color 0.15s'
      }
    }, "Пароль"), /*#__PURE__*/React.createElement("button", {
      onClick: () => switchMode('magiclink'),
      style: {
        flex: 1,
        border: 'none',
        borderRadius: 9,
        padding: '8px 0',
        fontSize: '0.88rem',
        fontWeight: 700,
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        background: mode === 'magiclink' ? 'var(--navy-800)' : 'transparent',
        color: mode === 'magiclink' ? 'var(--paper-050)' : 'var(--text-muted)',
        transition: 'background 0.15s, color 0.15s'
      }
    }, "Ссылка на почту"));
    if (mode === 'password') {
      const disabled = loading || !email.trim() || !password || authAction === 'signup' && !consent;
      content = /*#__PURE__*/React.createElement(React.Fragment, null, toggle, /*#__PURE__*/React.createElement("h2", {
        style: {
          margin: '0 0 8px',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-strong)'
        }
      }, authAction === 'signin' ? "Войти в кабинет" : "Создать аккаунт"), /*#__PURE__*/React.createElement("p", {
        style: {
          margin: '0 0 24px',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          fontSize: '0.95rem'
        }
      }, "Введите email и пароль."), /*#__PURE__*/React.createElement("input", {
        type: "email",
        placeholder: "ваш@email.com",
        value: email,
        onChange: e => setEmail(e.target.value),
        onKeyDown: e => {
          if (e.key === 'Enter') submitPassword();
        },
        style: AUTH_INPUT_STYLE
      }), /*#__PURE__*/React.createElement("input", {
        type: "password",
        placeholder: "пароль",
        value: password,
        onChange: e => setPassword(e.target.value),
        onKeyDown: e => {
          if (e.key === 'Enter') submitPassword();
        },
        style: AUTH_INPUT_STYLE
      }), authAction === 'signup' ? consentBlock : null, errorBlock, /*#__PURE__*/React.createElement("button", {
        onClick: submitPassword,
        disabled,
        style: authButtonStyle(disabled)
      }, loading ? 'Секунду…' : authAction === 'signin' ? 'Войти' : 'Зарегистрироваться'), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 14,
          fontSize: '0.85rem'
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => {
          setAuthAction(authAction === 'signin' ? 'signup' : 'signin');
          setError("");
        },
        style: authLinkButtonStyle()
      }, authAction === 'signin' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'), authAction === 'signin' ? /*#__PURE__*/React.createElement("button", {
        onClick: sendReset,
        style: authLinkButtonStyle()
      }, "Забыли пароль?") : null));
    } else {
      const disabled = loading || !email.trim() || !consent;
      content = /*#__PURE__*/React.createElement(React.Fragment, null, toggle, /*#__PURE__*/React.createElement("h2", {
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
      }, "Введите email — мы пришлём ссылку. Без пароля."), /*#__PURE__*/React.createElement("input", {
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
  }
  return /*#__PURE__*/React.createElement(AuthShell, null, content);
}
function SetNewPasswordScreen(props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  async function submit() {
    if (password.length < 6) {
      setError('Пароль должен быть не короче 6 символов');
      return;
    }
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    setError("");
    const {
      error: err
    } = await window._supabase.auth.updateUser({
      password
    });
    setLoading(false);
    if (err) setError(mapAuthError(err.message));else setDone(true);
  }
  const disabled = loading || !password || !confirm;
  const content = done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 12px',
      fontSize: '1.25rem',
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, "Пароль обновлён"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 20px',
      color: 'var(--text-body)',
      lineHeight: 1.6
    }
  }, "Теперь можно входить с новым паролем."), /*#__PURE__*/React.createElement("button", {
    onClick: props.onDone,
    style: authButtonStyle(false)
  }, "Перейти в кабинет")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: '1.25rem',
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, "Новый пароль"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      color: 'var(--text-muted)',
      lineHeight: 1.5,
      fontSize: '0.95rem'
    }
  }, "Придумайте новый пароль для входа."), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "новый пароль",
    value: password,
    onChange: e => setPassword(e.target.value),
    style: AUTH_INPUT_STYLE
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "повторите пароль",
    value: confirm,
    onChange: e => setConfirm(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') submit();
    },
    style: AUTH_INPUT_STYLE
  }), error && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      color: '#c0392b',
      fontSize: '0.88rem'
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    disabled,
    style: authButtonStyle(disabled)
  }, loading ? 'Сохраняем…' : 'Сохранить пароль'));
  return /*#__PURE__*/React.createElement(AuthShell, null, content);
}
function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
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
      if (_event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
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
  if (passwordRecovery) return /*#__PURE__*/React.createElement(SetNewPasswordScreen, {
    onDone: () => setPasswordRecovery(false)
  });
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
