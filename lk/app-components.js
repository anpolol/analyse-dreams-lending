(function () {
/* global React, DesignSystem_041ca9 */
// Личный кабинет «Анализ снов» — sections & guided dream-dialogue.
const {
  Button,
  GhostButton,
  Eyebrow,
  Badge,
  Card,
  Input,
  Sparkle
} = window.DesignSystem_041ca9;
const {
  useState,
  useEffect,
  useLayoutEffect,
  useRef
} = React;
const IMG = "..";
const DECOR = "..";
const LS_KEY = "ad_lk_state_v1";
const TARIFFS = [];
const SEED_HISTORY = [];
function loadState() {
  return {};
}

// Prefer inlined data-URI assets (for offline/standalone), fall back to file paths.
function assetUrl(key, fallback) {
  return typeof window !== "undefined" && window.AD_ASSETS && window.AD_ASSETS[key] || fallback;
}
const LOGO = assetUrl("logo", "/logo.jpeg");
function DecorImg({
  k,
  size,
  opacity = 0.9,
  style = {}
}) {
  const keyMap = {
    "dotted-l": "starL",
    "dotted-m": "starM",
    "dotted-s": "starS",
    "sparkle": "sparkle"
  };
  const fbMap = {
    "dotted-l": DECOR + "/Str Union_L.PNG",
    "dotted-m": DECOR + "/Str Union_m.PNG",
    "dotted-s": DECOR + "/Str Union_s.PNG",
    "sparkle": DECOR + "/Vector_star.PNG"
  };
  return /*#__PURE__*/React.createElement("img", {
    src: assetUrl(keyMap[k], fbMap[k]),
    alt: "",
    "aria-hidden": "true",
    style: {
      display: "block",
      width: size,
      height: "auto",
      opacity,
      pointerEvents: "none",
      ...style
    }
  });
}
function plural(n, one, few, many) {
  const m10 = n % 10,
    m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

/* ---------- Legal footer ---------- */
function LegalFooter() {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 24,
      textAlign: "center",
      fontSize: "0.82rem",
      color: "var(--text-faint)",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "/legal/privacy.html",
    target: "_blank",
    rel: "noopener",
    style: {
      color: "inherit"
    }
  }, "Политика обработки персональных данных"), " · ", /*#__PURE__*/React.createElement("a", {
    href: "/legal/consent.html",
    target: "_blank",
    rel: "noopener",
    style: {
      color: "inherit"
    }
  }, "Согласие на обработку персональных данных"), " · ", /*#__PURE__*/React.createElement("a", {
    href: "/legal/terms.html",
    target: "_blank",
    rel: "noopener",
    style: {
      color: "inherit"
    }
  }, "Пользовательское соглашение"), " · ", /*#__PURE__*/React.createElement("a", {
    href: "/legal/tariffs.html",
    target: "_blank",
    rel: "noopener",
    style: {
      color: "inherit"
    }
  }, "Тарифы"), " · По всем вопросам: ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:info@analysedreams.com",
    style: {
      color: "inherit"
    }
  }, "info@analysedreams.com"));
}

/* ---------- Header ---------- */
function Header({
  email,
  onSignOut
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 14,
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 11,
      fontWeight: 700,
      fontSize: "1.1rem",
      color: "var(--text-strong)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO,
    alt: "",
    style: {
      width: 34,
      height: 34,
      borderRadius: 999,
      objectFit: "cover"
    }
  }), "\u0410\u043D\u0430\u043B\u0438\u0437 \u0441\u043D\u043E\u0432"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 14px",
      borderRadius: 999,
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      fontSize: "0.9rem",
      color: "var(--text-body)",
      fontWeight: 600
    }
  }, email), /*#__PURE__*/React.createElement(GhostButton, {
    size: "sm",
    onClick: onSignOut
  }, "\u0412\u044B\u0439\u0442\u0438")));
}

/* ---------- Tabs ---------- */
function Tabs({
  value,
  onChange
}) {
  const items = [{
    id: "cabinet",
    label: "Кабинет"
  }, {
    id: "archetypes",
    label: "Созвездие архетипов"
  }, {
    id: "history",
    label: "История"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: 4,
      padding: 4,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      marginBottom: 28
    }
  }, items.map(it => {
    const active = value === it.id;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onChange(it.id),
      style: {
        border: "none",
        cursor: "pointer",
        padding: "10px 22px",
        borderRadius: "var(--radius-sm)",
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: "0.95rem",
        transition: "all 160ms var(--ease-out)",
        background: active ? "var(--navy-800)" : "transparent",
        color: active ? "var(--paper-050)" : "var(--text-muted)",
        boxShadow: active ? "var(--shadow-sm)" : "none"
      }
    }, it.label);
  }));
}

/* ---------- Archetypes / Constellation ---------- */
// Small fixed dots scattered inside a locked card to sell the "night sky" veil look.
const VEIL_DOTS = [{
  left: "14%",
  top: "20%"
}, {
  right: "16%",
  top: "30%"
}, {
  right: "20%",
  bottom: "18%"
}, {
  left: "22%",
  bottom: "14%"
}];

// The card itself — image area + name + (locked) description — all sitting on one
// solid backing panel, so it reads as a distinct tile even when the constellation
// scatters cards close together.
const CARD_W = 200;
function ArchetypeCard({
  symbol,
  onSelect,
  cardRef
}) {
  const [hover, setHover] = useState(false);
  const locked = !symbol.is_revealed;
  return /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      boxSizing: "border-box",
      width: CARD_W,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 14,
      borderRadius: "var(--radius-xl)",
      background: locked ? "var(--navy-800)" : "var(--paper-000)",
      border: locked ? "1.5px dashed rgba(249,255,255,0.32)" : "1px solid var(--border-subtle)",
      boxShadow: hover ? "var(--shadow-xl)" : "var(--shadow-lg)",
      transform: hover ? "translateY(-5px) scale(1.03)" : "none",
      transition: "transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onSelect(symbol.id),
    title: symbol.name,
    style: {
      position: "relative",
      width: "100%",
      height: 150,
      padding: 0,
      overflow: "hidden",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      border: "none",
      background: locked ? "rgba(249,255,255,0.06)" : "var(--paper-050)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, locked ? /*#__PURE__*/React.createElement(React.Fragment, null, VEIL_DOTS.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      ...d,
      width: 3,
      height: 3,
      borderRadius: 999,
      background: "rgba(249,255,255,0.4)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--cyan-300)",
      fontSize: "1.7rem"
    }
  }, "\u2726")) : symbol.image_url ? /*#__PURE__*/React.createElement("img", {
    src: symbol.image_url,
    alt: "",
    draggable: false,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--navy-800)",
      fontSize: "1.7rem"
    }
  }, "\u2726")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      flex: 1,
      minWidth: 0,
      fontWeight: 800,
      fontSize: "1rem",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: locked ? "rgba(249,255,255,0.95)" : "var(--text-strong)"
    }
  }, symbol.name), !locked && symbol.dreams.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: "0.78rem",
      fontWeight: 700,
      color: "var(--navy-800)",
      background: "var(--cyan-300)",
      borderRadius: 999,
      padding: "3px 9px"
    }
  }, "\u2726 ", symbol.dreams.length)), locked && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      height: 56,
      color: "rgba(249,255,255,0.55)",
      fontSize: "0.84rem",
      lineHeight: 1.4,
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }
  }, symbol.description));
}

// Decorative-only slot: hints that more (unnamed) archetypes wait beyond the named set.
function MysteryArchetypeCard() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      boxSizing: "border-box",
      width: CARD_W,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 14,
      borderRadius: "var(--radius-xl)",
      background: "var(--navy-800)",
      border: "1.5px dashed rgba(143,214,232,0.65)",
      boxShadow: "var(--shadow-glow)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: 150,
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      background: "rgba(249,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, VEIL_DOTS.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      ...d,
      width: 3,
      height: 3,
      borderRadius: 999,
      background: "rgba(249,255,255,0.4)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(249,255,255,0.6)",
      fontSize: "1.7rem",
      fontWeight: 800
    }
  }, "?")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 800,
      fontSize: "1rem",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: "rgba(249,255,255,0.95)"
    }
  }, "\u0421\u043A\u0440\u044B\u0442\u044B\u0439 \u0430\u0440\u0445\u0435\u0442\u0438\u043F"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      height: 56,
      overflow: "hidden",
      color: "rgba(249,255,255,0.55)",
      fontSize: "0.84rem",
      lineHeight: 1.4
    }
  }, "\u041F\u043E\u044F\u0432\u0438\u0442\u0441\u044F, \u043A\u043E\u0433\u0434\u0430 \u0441\u043D\u044B \u0434\u0430\u0434\u0443\u0442 \u0431\u043E\u043B\u044C\u0448\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u0430."));
}

// Places cards in concentric rings around the origin (the Self card's slot), evenly
// spaced so nothing overlaps the center or its neighbours on first load. Once a ring
// is full, the next one starts further out. Returns offsets relative to the center,
// plus the bounding size needed so the outermost ring stays fully on-canvas.
function ringPositions(count) {
  const CARD_SPACING = 240,
    FIRST_RADIUS = 260,
    RING_GROWTH = 240;
  const positions = [];
  let placed = 0,
    ring = 0,
    maxRadius = FIRST_RADIUS;
  while (placed < count) {
    const radius = FIRST_RADIUS + ring * RING_GROWTH;
    const capacity = Math.max(1, Math.floor(2 * Math.PI * radius / CARD_SPACING));
    const inRing = Math.min(capacity, count - placed);
    for (let i = 0; i < inRing; i++) {
      const angle = 2 * Math.PI * i / inRing - Math.PI / 2;
      positions.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      });
    }
    maxRadius = radius;
    placed += inRing;
    ring++;
  }
  const size = (maxRadius + CARD_W + 60) * 2;
  return {
    positions,
    size
  };
}

// localStorage key for user-arranged card positions — keeps the constellation
// layout how each visitor left it, scoped to this browser only.
const ARCHETYPE_POSITIONS_KEY = "archetypePositions";
function ConstellationGraph({
  symbols,
  connections,
  onSelect
}) {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const [lines, setLines] = useState([]);
  const [grabbing, setGrabbing] = useState(false);
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0
  });
  const cardDrag = useRef({
    active: false,
    moved: false,
    id: null,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0
  });
  const [customPos, setCustomPos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ARCHETYPE_POSITIONS_KEY) || "{}");
    } catch {
      return {};
    }
  });

  // The Self ("Самость") is the central archetype in Jungian theory — it's pinned
  // in the middle of the sky and excluded from the scatter/drag logic that applies
  // to every other card.
  const selfSymbol = symbols.find(s => s.name === "Самость");
  const otherSymbols = symbols.filter(s => s !== selfSymbol);
  const {
    positions: ringOffsets,
    size
  } = ringPositions(otherSymbols.length + 1);
  const width = size,
    height = size;
  const selfPos = {
    x: width / 2,
    y: height / 2
  };
  const positions = ringOffsets.map(o => ({
    x: selfPos.x + o.x,
    y: selfPos.y + o.y
  }));
  const mysteryPos = positions[otherSymbols.length];
  useLayoutEffect(() => {
    function measure() {
      const containerEl = containerRef.current;
      if (!containerEl) return;
      const containerRect = containerEl.getBoundingClientRect();
      const centers = {};
      Object.keys(cardRefs.current).forEach(id => {
        const el = cardRefs.current[id];
        if (!el) return;
        const r = el.getBoundingClientRect();
        centers[id] = {
          x: r.left + r.width / 2 - containerRect.left,
          y: r.top + r.height / 2 - containerRect.top
        };
      });
      setLines(connections.map(c => {
        const a = centers[c.a],
          b = centers[c.b];
        return a && b ? {
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          strength: c.strength
        } : null;
      }).filter(Boolean));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [symbols, connections, customPos]);

  // Per-card drag-to-place — only for mouse users (touch keeps the native sky
  // scroll above). Stops propagation so the sky's own pan-drag doesn't also
  // fire when grabbing a card.
  function onCardPointerDown(e, id, basePos) {
    if (e.pointerType === "touch") return;
    if (e.button !== undefined && e.button !== 0) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const current = customPos[id] || basePos;
    cardDrag.current = {
      active: true,
      moved: false,
      id,
      startX: e.clientX,
      startY: e.clientY,
      baseX: current.x,
      baseY: current.y
    };
  }
  function onCardPointerMove(e) {
    const d = cardDrag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX,
      dy = e.clientY - d.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    if (d.moved) {
      setCustomPos(prev => ({
        ...prev,
        [d.id]: {
          x: d.baseX + dx,
          y: d.baseY + dy
        }
      }));
    }
  }
  function onCardPointerUp() {
    const d = cardDrag.current;
    if (d.active && d.moved) {
      setCustomPos(prev => {
        try {
          localStorage.setItem(ARCHETYPE_POSITIONS_KEY, JSON.stringify(prev));
        } catch {}
        return prev;
      });
    }
    d.active = false;
  }

  // Drag-to-pan the sky for mouse users — grab anywhere (including on a card)
  // and slide to reveal archetypes scattered further out. Touch is left to the
  // browser's native two-axis scrolling (smooth, with inertia, and it chains
  // to the page once the sky's own scroll is exhausted) — adding our own JS
  // panning on top of that just fights the browser and feels janky.
  function onPointerDown(e) {
    if (e.pointerType === "touch") return;
    if (e.button !== undefined && e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop
    };
    setGrabbing(true);
  }
  function onPointerMove(e) {
    const d = drag.current;
    if (!d.active) return;
    const el = scrollRef.current;
    const dx = e.clientX - d.startX,
      dy = e.clientY - d.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    if (d.moved) {
      el.scrollLeft = d.scrollLeft - dx;
      el.scrollTop = d.scrollTop - dy;
    }
  }
  function onPointerUp() {
    drag.current.active = false;
    setGrabbing(false);
  }
  function onClickCapture(e) {
    if (drag.current.moved || cardDrag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
      cardDrag.current.moved = false;
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    onPointerLeave: onPointerUp,
    onPointerCancel: onPointerUp,
    onClickCapture: onClickCapture,
    style: {
      width: "100vw",
      marginLeft: "calc(50% - 50vw)",
      marginRight: "calc(50% - 50vw)",
      marginBottom: -80,
      borderRadius: 0,
      overflow: "auto",
      touchAction: "auto",
      userSelect: "none",
      cursor: grabbing ? "grabbing" : "grab",
      background: "radial-gradient(circle at 30% 20%, rgba(143,214,232,0.18), transparent 55%), linear-gradient(160deg, var(--navy-900), var(--navy-800))",
      boxShadow: "var(--shadow-xl)",
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    style: {
      position: "relative",
      width,
      minHeight: height,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(DecorImg, {
    k: "dotted-s",
    size: 20,
    opacity: 0.4,
    style: {
      position: "absolute",
      left: "4%",
      top: "8%"
    }
  }), /*#__PURE__*/React.createElement(DecorImg, {
    k: "dotted-s",
    size: 16,
    opacity: 0.3,
    style: {
      position: "absolute",
      right: "5%",
      bottom: "10%"
    }
  }), /*#__PURE__*/React.createElement("svg", {
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none"
    }
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: l.x1,
    y1: l.y1,
    x2: l.x2,
    y2: l.y2,
    stroke: "rgba(143,214,232,0.5)",
    strokeWidth: Math.min(1 + l.strength * 0.6, 4)
  }))), otherSymbols.map((s, i) => {
    const pos = customPos[s.id] || positions[i];
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      onPointerDown: e => onCardPointerDown(e, s.id, positions[i]),
      onPointerMove: onCardPointerMove,
      onPointerUp: onCardPointerUp,
      onPointerCancel: onCardPointerUp,
      style: {
        position: "absolute",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        cursor: "grab"
      }
    }, /*#__PURE__*/React.createElement(ArchetypeCard, {
      symbol: s,
      onSelect: onSelect,
      cardRef: el => {
        cardRefs.current[s.id] = el;
      }
    }));
  }), selfSymbol && /*#__PURE__*/React.createElement("div", {
    key: selfSymbol.id,
    style: {
      position: "absolute",
      left: selfPos.x,
      top: selfPos.y,
      transform: "translate(-50%, -50%)",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(ArchetypeCard, {
    symbol: selfSymbol,
    onSelect: onSelect,
    cardRef: el => {
      cardRefs.current[selfSymbol.id] = el;
    }
  })), (() => {
    const pos = customPos.mystery || mysteryPos;
    return /*#__PURE__*/React.createElement("div", {
      onPointerDown: e => onCardPointerDown(e, "mystery", mysteryPos),
      onPointerMove: onCardPointerMove,
      onPointerUp: onCardPointerUp,
      onPointerCancel: onCardPointerUp,
      style: {
        position: "absolute",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        cursor: "grab"
      }
    }, /*#__PURE__*/React.createElement(MysteryArchetypeCard, null));
  })()));
}
function ArchetypesTab({
  archetypes,
  connections,
  onSelect,
  onModel,
  analyzeReady
}) {
  const total = archetypes.length;
  const revealed = archetypes.filter(s => s.is_revealed).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 16,
      alignItems: "flex-end",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "\u041A\u0430\u0440\u0442\u0430 \u0441\u043D\u043E\u0432"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 0",
      fontSize: "clamp(1.3rem, 2.4vw, 1.8rem)",
      fontWeight: 800,
      letterSpacing: "-0.01em",
      color: "var(--text-strong)"
    }
  }, "\u0421\u043E\u0437\u0432\u0435\u0437\u0434\u0438\u0435 \u0430\u0440\u0445\u0435\u0442\u0438\u043F\u043E\u0432"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      color: "var(--text-muted)"
    }
  }, "\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u043E ", revealed, " \u0430\u0440\u0445\u0435\u0442\u0438\u043F\u043E\u0432")), /*#__PURE__*/React.createElement(Button, {
    onClick: onModel,
    disabled: !analyzeReady,
    style: {
      background: "var(--navy-800)",
      color: "var(--cyan-300)",
      fontSize: "1.1rem",
      fontWeight: 800,
      padding: "18px 32px",
      boxShadow: "var(--shadow-xl)"
    }
  }, analyzeReady ? "Разобрать сон →" : "Готовим аккаунт…")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-faint)",
      fontSize: "0.85rem"
    }
  }, "\u041A\u0430\u0436\u0434\u044B\u0439 \u0440\u0430\u0437\u0431\u043E\u0440 \u0441\u043D\u0430 \u043C\u043E\u0436\u0435\u0442 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u0430\u0440\u0445\u0435\u0442\u0438\u043F \u0438 \u0441\u0432\u044F\u0437\u0430\u0442\u044C \u0435\u0433\u043E \u0441 \u0443\u0436\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043D\u044B\u043C\u0438."), total === 0 ? /*#__PURE__*/React.createElement(Card, {
    variant: "soft",
    style: {
      textAlign: "center",
      padding: 48
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-muted)"
    }
  }, "\u0421\u043E\u0437\u0432\u0435\u0437\u0434\u0438\u0435 \u043F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u043E \u2014 \u043E\u043D\u043E \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u0441\u043D\u0430.")) : /*#__PURE__*/React.createElement(ConstellationGraph, {
    symbols: archetypes,
    connections: connections,
    onSelect: onSelect
  }));
}
function DreamHistoryRow({
  d,
  onOpen
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpen(d.dream_id),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      textAlign: "left",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      padding: "14px 16px",
      borderRadius: 14,
      background: hover ? "var(--cyan-100)" : "var(--paper-100)",
      boxShadow: hover ? "var(--shadow-sm)" : "none",
      transform: hover ? "translateX(2px)" : "none",
      transition: "background 160ms var(--ease-out), transform 160ms var(--ease-out), box-shadow 160ms var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      width: 28,
      height: 28,
      borderRadius: 999,
      background: "var(--cyan-300)",
      color: "var(--navy-800)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.85rem"
    }
  }, "\u2726"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 700,
      color: "var(--text-strong)",
      fontSize: "0.92rem",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }
  }, d.manifestation || d.dream_title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "0.75rem",
      color: "var(--text-faint)"
    }
  }, formatDate(d.date)))));
}
function ArchetypeDetail({
  symbol,
  onClose,
  onOpenDream
}) {
  if (!symbol) return null;
  const locked = !symbol.is_revealed;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 90,
      background: "rgba(11,20,38,0.62)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "min(480px, 100%)",
      maxHeight: "min(640px, 90vh)",
      overflowY: "auto",
      background: "var(--surface-soft)",
      borderRadius: 24,
      boxShadow: "var(--shadow-xl)",
      padding: "24px 26px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    style: {
      position: "absolute",
      top: -14,
      right: -14,
      border: "none",
      background: "var(--surface-soft)",
      boxShadow: "var(--shadow-md)",
      width: 32,
      height: 32,
      borderRadius: "50%",
      cursor: "pointer",
      fontSize: 16,
      lineHeight: 1
    }
  }, "\xD7"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: 200,
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      marginBottom: 18,
      background: locked ? "radial-gradient(circle at 30% 20%, rgba(143,214,232,0.18), transparent 55%), linear-gradient(160deg, var(--navy-900), var(--navy-800))" : "var(--paper-000)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, locked ? /*#__PURE__*/React.createElement(React.Fragment, null, VEIL_DOTS.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      ...d,
      width: 3,
      height: 3,
      borderRadius: 999,
      background: "rgba(249,255,255,0.4)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--cyan-300)",
      fontSize: "2rem"
    }
  }, "\u2726")) : symbol.image_url ? /*#__PURE__*/React.createElement("img", {
    src: symbol.image_url,
    alt: "",
    draggable: false,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--navy-800)",
      fontSize: "2rem"
    }
  }, "\u2726")), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 10px",
      fontSize: "1.3rem",
      fontWeight: 800,
      color: "var(--text-strong)"
    }
  }, symbol.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 18px",
      color: "var(--text-body)",
      lineHeight: 1.6
    }
  }, symbol.description), locked ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderRadius: 14,
      background: "var(--paper-100)",
      border: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-muted)",
      lineHeight: 1.5
    }
  }, "\u042D\u0442\u043E\u0442 \u0430\u0440\u0445\u0435\u0442\u0438\u043F \u0435\u0449\u0451 \u043D\u0435 \u043F\u0440\u043E\u044F\u0432\u0438\u043B\u0441\u044F \u0432 \u0432\u0430\u0448\u0438\u0445 \u0441\u043D\u0430\u0445. \u0420\u0430\u0437\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043E\u043D \u2014 \u0438, \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u043E\u043D \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0441\u044F.")) : symbol.dreams.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 10px",
      fontSize: "0.75rem",
      fontWeight: 800,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-strong)"
    }
  }, "\u0421\u043D\u044B, \u0433\u0434\u0435 \u043F\u0440\u043E\u044F\u0432\u0438\u043B\u0441\u044F"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, symbol.dreams.map((d, i) => /*#__PURE__*/React.createElement(DreamHistoryRow, {
    key: i,
    d: d,
    onOpen: onOpenDream
  }))))));
}

/* ---------- Balance ---------- */
function BalanceCard({
  balance,
  subscription,
  onAnalyze,
  analyzeReady
}) {
  const subscribed = subscription.isSubscribed && subscription.autoRenew;
  return /*#__PURE__*/React.createElement(Card, {
    variant: "night",
    padding: 0,
    style: {
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(DecorImg, {
    k: "dotted-l",
    size: 200,
    opacity: 0.5,
    style: {
      position: "absolute",
      right: -20,
      top: -30
    }
  }), /*#__PURE__*/React.createElement(DecorImg, {
    k: "sparkle",
    size: 42,
    opacity: 0.8,
    style: {
      position: "absolute",
      right: 150,
      top: 38
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "34px 36px",
      display: "flex",
      flexWrap: "wrap",
      gap: 24,
      alignItems: "flex-end",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "onDark"
  }, subscribed ? "Подписка активна" : "Ваш баланс"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      fontSize: "clamp(2.6rem, 6vw, 3.6rem)",
      fontWeight: 800,
      lineHeight: 0.9,
      letterSpacing: "-0.02em",
      color: "var(--paper-050)"
    }
  }, !analyzeReady ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "1.4rem",
      fontWeight: 700,
      color: "rgba(249,255,255,0.7)"
    }
  }, "\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026") : /*#__PURE__*/React.createElement("span", null, balance, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "1.4rem",
      fontWeight: 700,
      color: "rgba(249,255,255,0.7)"
    }
  }, plural(balance, "разбор", "разбора", "разборов")))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      color: "rgba(249,255,255,0.66)",
      fontSize: "0.95rem",
      maxWidth: "30rem",
      lineHeight: 1.45
    }
  }, subscribed ? "Когда разборы закончатся, мы автоматически продлим подписку и добавим ещё 30 разборов." : subscription.isSubscribed ? "Автопродление отключено — когда разборы закончатся, подписка не продлится." : "1 разбор — это целая беседа о сне: задавайте вопросы и отвечайте на встречные, пока не придёте к инсайту.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onAnalyze,
    disabled: !analyzeReady,
    style: {
      background: "var(--cyan-300)",
      color: "var(--navy-800)",
      fontSize: "1.1rem",
      fontWeight: 800,
      padding: "18px 32px",
      boxShadow: "var(--shadow-glow)"
    }
  }, analyzeReady ? "Разобрать сон →" : "Готовим аккаунт…"))));
}

/* ---------- Tariffs ---------- */
function TariffGrid({
  onBuy,
  tariffs
}) {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "\u041F\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0431\u0430\u043B\u0430\u043D\u0441",
    title: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0430\u0440\u0438\u0444"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
      gap: 18
    }
  }, tariffs.map(t => /*#__PURE__*/React.createElement(TariffCard, {
    key: t.id,
    t: t,
    onBuy: onBuy
  }))));
}
function CancelSubscriptionLink({
  onCancel
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      border: "1.5px solid var(--danger-500)",
      background: "rgba(194,86,107,0.08)",
      color: "var(--danger-500)",
      fontWeight: 700,
      fontSize: "0.95rem",
      padding: "12px 22px",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0443"));
}
function TariffCard({
  t,
  onBuy
}) {
  const [hover, setHover] = useState(false);
  const isSubscription = t.type === "subscription";
  return /*#__PURE__*/React.createElement("article", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      background: "var(--surface-raised)",
      borderRadius: "var(--radius-2xl)",
      padding: "26px 24px 24px",
      boxShadow: t.popular || isSubscription ? "var(--shadow-lg)" : "var(--shadow-sm)",
      border: isSubscription ? "1.5px solid var(--cyan-400)" : t.popular ? "1.5px solid var(--cyan-400)" : "1px solid var(--border-subtle)",
      transform: hover ? "translateY(-3px)" : "none",
      transition: "transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out)",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, isSubscription && /*#__PURE__*/React.createElement(Badge, {
    variant: "cyan",
    style: {
      position: "absolute",
      top: -12,
      left: 24
    }
  }, "\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430"), !isSubscription && t.popular && /*#__PURE__*/React.createElement(Badge, {
    variant: "cyan",
    style: {
      position: "absolute",
      top: -12,
      left: 24
    }
  }, "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0439"), !isSubscription && t.best && /*#__PURE__*/React.createElement(Badge, {
    variant: "cream",
    style: {
      position: "absolute",
      top: -12,
      left: 24
    }
  }, "\u0412\u044B\u0433\u043E\u0434\u043D\u043E"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "2.6rem",
      fontWeight: 800,
      lineHeight: 0.9,
      letterSpacing: "-0.02em",
      color: "var(--text-strong)"
    }
  }, t.count), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      color: "var(--text-muted)",
      fontWeight: 600
    }
  }, isSubscription ? `${plural(t.count, "разбор", "разбора", "разборов")} в месяц` : plural(t.count, "разбор", "разбора", "разборов"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 2px",
      fontSize: "1.5rem",
      fontWeight: 800,
      color: "var(--text-strong)"
    }
  }, t.price, " \u20BD"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "0.82rem",
      color: "var(--text-faint)",
      fontWeight: 600
    }
  }, t.note)), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "sm",
    onClick: () => onBuy(t)
  }, isSubscription ? "Подписаться" : "Купить"));
}

/* ---------- Notebook product (free) ---------- */
function NotebookCard({
  onGet
}) {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "\u0422\u0435\u0442\u0440\u0430\u0434\u044C",
    title: "\u0421\u0430\u043C\u043E\u0441\u0442\u043E\u044F\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u0431\u043E\u0440"
  }), /*#__PURE__*/React.createElement(Card, {
    variant: "raised",
    padding: 0,
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(220px, 320px) 1fr",
      gap: 0
    },
    className: "nb-grid"
  }, /*#__PURE__*/React.createElement("img", {
    src: assetUrl("image4", IMG + "/image_4.PNG"),
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      minHeight: 230,
      objectFit: "cover",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "28px 30px",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)",
      fontWeight: 800,
      lineHeight: 0.98,
      letterSpacing: "-0.01em",
      color: "var(--text-strong)"
    }
  }, "\u0422\u0435\u0442\u0440\u0430\u0434\u044C \xB7 8 \u0442\u0435\u0445\u043D\u0438\u043A \u0441\u0430\u043C\u043E\u0441\u0442\u043E\u044F\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0440\u0430\u0437\u0431\u043E\u0440\u0430"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      color: "var(--text-muted)",
      lineHeight: 1.45,
      maxWidth: "34rem"
    }
  }, "\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u0443\u043F\u0440\u0430\u0436\u043D\u0435\u043D\u0438\u044F \u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u044B, \u0447\u0442\u043E\u0431\u044B \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0442\u044C \u0441\u043D\u044B \u0441\u0430\u043C\u043E\u043C\u0443 \u2014 \u0433\u043B\u0443\u0431\u0436\u0435, \u0442\u043E\u0447\u043D\u0435\u0435 \u0438 \u0431\u0435\u0437 \xAB\u043E\u0431\u0449\u0438\u0445 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439\xBB.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      display: "flex",
      flexWrap: "wrap",
      gap: 14,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onGet
  }, "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0442\u0435\u0442\u0440\u0430\u0434\u044C"))))));
}

/* ---------- Section head ---------- */
function SectionHead({
  eyebrow,
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 0",
      fontSize: "clamp(1.3rem, 2.4vw, 1.8rem)",
      fontWeight: 800,
      letterSpacing: "-0.01em",
      color: "var(--text-strong)"
    }
  }, title));
}

/* ---------- History ---------- */
function HistoryList({
  items,
  focusId
}) {
  if (!items.length) {
    return /*#__PURE__*/React.createElement(Card, {
      variant: "soft",
      style: {
        textAlign: "center",
        padding: 48
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        color: "var(--text-muted)"
      }
    }, "\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0432\u0430\u0448\u0438 \u0440\u0430\u0437\u0431\u043E\u0440\u044B \u0441\u043D\u043E\u0432."));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, items.map(it => /*#__PURE__*/React.createElement(HistoryItem, {
    key: it.id,
    it: it,
    focusId: focusId
  })));
}
function HistoryItem({
  it,
  focusId
}) {
  const [open, setOpen] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (focusId === it.id) {
      setOpen(true);
      if (wrapRef.current) wrapRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [focusId]);
  const focused = focusId === it.id;
  const insightText = (() => {
    try {
      const p = JSON.parse(it.insight);
      return p.insight || it.insight;
    } catch (e) {
      return it.insight;
    }
  })();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: wrapRef
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "night",
    padding: 0,
    style: {
      position: "relative",
      overflow: "hidden",
      background: "radial-gradient(circle at 22% 10%, rgba(143,214,232,0.3), transparent 55%), linear-gradient(160deg, var(--navy-800), var(--navy-700))",
      boxShadow: focused ? "0 0 0 2px var(--cyan-400), 0 0 36px rgba(143,214,232,0.5)" : "var(--shadow-lg)"
    }
  }, /*#__PURE__*/React.createElement(DecorImg, {
    k: "dotted-l",
    size: 160,
    opacity: 0.28,
    style: {
      position: "absolute",
      right: -30,
      top: -30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "28px 30px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.78rem",
      fontWeight: 700,
      color: "rgba(249,255,255,0.55)",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      flexShrink: 0
    }
  }, formatDate(it.date)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "1.3rem",
      fontWeight: 800,
      color: "var(--paper-050)"
    }
  }, it.dream_title)), /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(true),
    onMouseEnter: () => setPreviewHover(true),
    onMouseLeave: () => setPreviewHover(false),
    style: {
      margin: "0 0 16px",
      padding: "14px 16px",
      borderRadius: 14,
      cursor: "pointer",
      background: previewHover ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.18)",
      transition: "background 160ms var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "rgba(249,255,255,0.85)",
      lineHeight: 1.6,
      fontSize: "1.02rem"
    }
  }, it.dream_short)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      borderRadius: 16,
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.16)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 8px",
      fontSize: "0.78rem",
      fontWeight: 800,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--cyan-300)",
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2726"), "\u0418\u043D\u0441\u0430\u0439\u0442"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--paper-050)",
      lineHeight: 1.6,
      fontWeight: 500,
      fontSize: "1.05rem"
    }
  }, insightText))))), open && /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(false),
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 90,
      background: "rgba(11,20,38,0.7)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "min(560px, 100%)",
      maxHeight: "min(640px, 90vh)",
      overflowY: "auto",
      overflowX: "hidden",
      background: "radial-gradient(circle at 22% 8%, rgba(143,214,232,0.3), transparent 55%), linear-gradient(160deg, var(--navy-800), var(--navy-700))",
      borderRadius: 24,
      boxShadow: "var(--shadow-xl)",
      padding: "26px 28px"
    }
  }, /*#__PURE__*/React.createElement(DecorImg, {
    k: "dotted-l",
    size: 160,
    opacity: 0.22,
    style: {
      position: "absolute",
      right: -30,
      top: -30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.78rem",
      fontWeight: 700,
      color: "rgba(249,255,255,0.55)",
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, formatDate(it.date)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "4px 0 0",
      fontSize: "1.3rem",
      fontWeight: 800,
      color: "var(--paper-050)"
    }
  }, it.dream_title)), /*#__PURE__*/React.createElement("p", {
    style: {
      position: "relative",
      margin: 0,
      color: "rgba(249,255,255,0.85)",
      lineHeight: 1.6,
      whiteSpace: "pre-wrap"
    }
  }, it.dream_description))));
}
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 6px",
      fontSize: "0.78rem",
      fontWeight: 800,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-strong)"
    }
  }, label), children);
}

/* ---------- Dream dialogue engine ---------- */
const API_BASE = 'https://api.analysedreams.com';
async function authHeaders(token) {
  if (!token) {
    const {
      data: {
        session
      }
    } = await window._supabase.auth.getSession();
    token = session?.access_token;
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}
async function callAnalyse(apiMsgs, isEnded) {
  const res = await fetch(`${API_BASE}/analyse/run`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({
      dream_title: '',
      is_ended: isEnded,
      messages: apiMsgs
    })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.detail || `HTTP ${res.status}`), {
      status: res.status
    });
  }
  return res.json();
}
function Bubble({
  from,
  children
}) {
  const isBot = from === "bot";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: isBot ? "flex-start" : "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "84%",
      padding: "12px 16px",
      borderRadius: isBot ? "6px 18px 18px 18px" : "18px 6px 18px 18px",
      background: isBot ? "var(--paper-000)" : "var(--navy-800)",
      color: isBot ? "var(--text-body)" : "var(--paper-050)",
      boxShadow: "var(--shadow-sm)",
      fontSize: "0.95rem",
      lineHeight: 1.45
    }
  }, children));
}
function MarkdownText({
  text
}) {
  const html = DOMPurify.sanitize(marked.parse(text || ""));
  return /*#__PURE__*/React.createElement("div", {
    className: "md-content",
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}
function InsightBubble({
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--navy-800)",
      color: "var(--paper-050)",
      borderRadius: "6px 18px 18px 18px",
      padding: "16px 18px",
      boxShadow: "var(--shadow-md)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 8px",
      fontSize: "0.74rem",
      fontWeight: 800,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--cyan-300)",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2726"), "\u0418\u043D\u0441\u0430\u0439\u0442"), /*#__PURE__*/React.createElement(MarkdownText, {
    text: text
  }));
}

// Depth indicator — dots fill as the dialogue moves toward the insight.
function DepthMeter({
  stage
}) {
  const total = 4;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5
    }
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: i < stage ? "var(--cyan-300)" : "rgba(249,255,255,0.25)",
      transition: "background 240ms var(--ease-out)"
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.78rem",
      color: "rgba(249,255,255,0.7)"
    }
  }, stage >= total ? "инсайт найден" : "путь к инсайту"));
}
function SurveyWidget({
  dreamsCompleted
}) {
  const [rating, setRating] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [commentSent, setCommentSent] = useState(false);
  const FACES = ["😞", "😕", "😐", "🙂", "😍"];
  async function rate(value) {
    setRating(value);
    const {
      data: {
        session
      }
    } = await window._supabase.auth.getSession();
    adTrack('survey_rated', {
      rating: value,
      dreams_completed: dreamsCompleted
    }, session?.access_token);
  }
  async function sendComment() {
    if (!comment.trim()) return;
    const {
      data: {
        session
      }
    } = await window._supabase.auth.getSession();
    adTrack('survey_feedback_submitted', {
      comment: comment.trim(),
      dreams_completed: dreamsCompleted
    }, session?.access_token);
    setCommentSent(true);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      paddingTop: 12,
      borderTop: "1px solid var(--border-subtle)",
      width: "100%"
    }
  }, rating == null ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 8px",
      fontSize: "0.82rem",
      color: "var(--text-muted)"
    }
  }, "\u041A\u0430\u043A \u0432\u0430\u043C \u044D\u0442\u043E\u0442 \u0440\u0430\u0437\u0431\u043E\u0440?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 10
    }
  }, FACES.map((face, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => rate(i + 1),
    "aria-label": `Оценка ${i + 1}`,
    style: {
      border: "none",
      background: "transparent",
      fontSize: "1.5rem",
      cursor: "pointer",
      lineHeight: 1,
      padding: 4
    }
  }, face)))) : commentSent ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "0.82rem",
      color: "var(--text-muted)"
    }
  }, "\u0421\u043F\u0430\u0441\u0438\u0431\u043E!") : showComment ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Input, {
    multiline: true,
    rows: 2,
    maxLength: 500,
    value: comment,
    placeholder: "\u0427\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0432\u0438\u0434\u0435\u0442\u044C \u0435\u0449\u0451?",
    onChange: e => setComment(e.target.value),
    style: {
      width: "100%"
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: sendComment
  }, "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowComment(true),
    style: {
      border: "none",
      background: "transparent",
      color: "var(--text-link)",
      fontSize: "1rem",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      padding: 0
    }
  }, "\u0421\u043F\u0430\u0441\u0438\u0431\u043E! \u0425\u043E\u0442\u0438\u0442\u0435 \u0447\u0442\u043E-\u0442\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C? \u2192"));
}
function DreamChat({
  open,
  balance,
  onClose,
  onStart,
  onComplete,
  onGoTopUp,
  onBalanceUpdate,
  onViewArchetypes,
  initialDream,
  email,
  dreamsCompletedCount = 0
}) {
  const greeting = {
    from: "bot",
    node: /*#__PURE__*/React.createElement("span", null, "\u041F\u0440\u0438\u0432\u0435\u0442! \u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438\u0442\u0435 \u0441\u0432\u043E\u0439 \u0441\u043E\u043D \u0432 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u0445 \u2014 \u0430 \u0434\u0430\u043B\u044C\u0448\u0435 \u043C\u044B \u0440\u0430\u0437\u0431\u0435\u0440\u0451\u043C \u0435\u0433\u043E \u0432 \u0434\u0438\u0430\u043B\u043E\u0433\u0435: \u044F \u0431\u0443\u0434\u0443 \u0437\u0430\u0434\u0430\u0432\u0430\u0442\u044C \u0432\u043E\u043F\u0440\u043E\u0441\u044B, \u0432\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043E\u0442\u0432\u0435\u0447\u0430\u0442\u044C \u0438\u043B\u0438 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0442\u044C \u0432 \u043E\u0442\u0432\u0435\u0442, \u043F\u043E\u043A\u0430 \u043D\u0435 \u043F\u0440\u0438\u0434\u0451\u043C \u043A \u0438\u043D\u0441\u0430\u0439\u0442\u0443.")
  };
  const [msgs, setMsgs] = useState([greeting]);
  const [apiMsgs, setApiMsgs] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);
  const [entry, setEntry] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const scroller = useRef(null);
  useEffect(() => {
    if (open) {
      setMsgs([greeting]);
      setText(initialDream || "");
      setTyping(false);
      setStage(0);
      setDone(false);
      setEntry(null);
      setApiMsgs([]);
      setErrMsg("");
    }
  }, [open]);
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [msgs, typing]);
  if (!open) return null;
  const noBalance = balance <= 0 && stage === 0;
  const showSurvey = dreamsCompletedCount === 0 || (dreamsCompletedCount + 1) % 5 === 0;
  async function runTurn(newApiMsgs, isEnded) {
    setTyping(true);
    try {
      const data = await callAnalyse(newApiMsgs, isEnded);
      setTyping(false);
      const result = data.result;
      let botText = result.messages[result.messages.length - 1].content;
      try {
        const p = JSON.parse(botText);
        if (p.insight) botText = p.insight;
      } catch (e) {}
      setApiMsgs([...newApiMsgs, {
        role: 'assistant',
        content: botText
      }]);
      const isInsight = isEnded || newApiMsgs.length >= 7;
      if (isInsight) {
        setMsgs(m => [...m, {
          from: "bot",
          node: /*#__PURE__*/React.createElement(InsightBubble, {
            text: botText
          })
        }]);
        setStage(4);
        setDone(true);
        onComplete({
          ...(entry || {}),
          title: result.dream_title || todayLabel(),
          insight: botText
        });
        if (onBalanceUpdate) onBalanceUpdate(data.dreams_balance);
      } else {
        setMsgs(m => [...m, {
          from: "bot",
          node: /*#__PURE__*/React.createElement(MarkdownText, {
            text: botText
          })
        }]);
        setStage(s => s + 1);
      }
    } catch (err) {
      setTyping(false);
      console.error("analyse/run error:", err);
      if (err.status === 402) onGoTopUp();else setErrMsg(err.message || "Ошибка соединения с сервером. Попробуйте ещё раз.");
    }
  }
  function send() {
    const value = text.trim();
    if (!value || typing || done) return;
    if (stage === 0 && balance <= 0) return;
    const newApiMsgs = [...apiMsgs, {
      role: 'user',
      content: value
    }];
    setApiMsgs(newApiMsgs);
    setMsgs(m => [...m, {
      from: "me",
      node: /*#__PURE__*/React.createElement("span", null, value)
    }]);
    setText("");
    if (stage === 0) {
      onStart();
      setEntry({
        id: Date.now(),
        date: todayLabel(),
        dream: value
      });
    }
    runTurn(newApiMsgs, false);
  }
  async function summarizeNow() {
    if (typing || done || stage === 0) return;
    const {
      data: {
        session
      }
    } = await window._supabase.auth.getSession();
    adTrack('summary_requested', {}, session?.access_token);
    runTurn(apiMsgs, true);
  }
  const hasSent = msgs.some(m => m.from === "me");
  return /*#__PURE__*/React.createElement("div", {
    onClick: hasSent ? undefined : onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 95,
      background: "rgba(11,20,38,0.62)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "min(480px, 100%)",
      height: "min(700px, 92vh)",
      background: "var(--surface-soft)",
      borderRadius: 28,
      overflow: "hidden",
      boxShadow: "var(--shadow-xl)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 18px",
      background: "var(--navy-800)",
      color: "#f9ffff"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO,
    alt: "",
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 700
    }
  }, "\u0420\u0430\u0437\u0431\u043E\u0440 \u0441\u043D\u0430"), stage === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "0.8rem",
      color: "rgba(249,255,255,0.7)"
    }
  }, "\u0412 \u0431\u0430\u043B\u0430\u043D\u0441\u0435: ", balance, " ", plural(balance, "разбор", "разбора", "разборов")) : /*#__PURE__*/React.createElement(DepthMeter, {
    stage: stage
  })), !hasSent ? /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    style: {
      background: "rgba(255,255,255,0.1)",
      border: "none",
      color: "#f9ffff",
      width: 32,
      height: 32,
      borderRadius: 999,
      cursor: "pointer",
      fontSize: 18,
      lineHeight: 1
    }
  }, "\xD7") : !done && /*#__PURE__*/React.createElement("button", {
    onClick: summarizeNow,
    "aria-label": "\u0414\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E, \u043F\u043E\u0434\u0432\u0435\u0434\u0438 \u0438\u0442\u043E\u0433",
    style: {
      background: "rgba(255,255,255,0.1)",
      border: "none",
      color: "#f9ffff",
      width: 32,
      height: 32,
      borderRadius: 999,
      cursor: "pointer",
      fontSize: 18,
      lineHeight: 1
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    ref: scroller,
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement(Bubble, {
    key: i,
    from: m.from
  }, m.node)), typing && /*#__PURE__*/React.createElement(Bubble, {
    from: "bot"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)"
    }
  }, "\u043F\u0435\u0447\u0430\u0442\u0430\u0435\u0442\u2026")), errMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      borderRadius: 12,
      background: "rgba(194,86,107,0.10)",
      border: "1px solid rgba(194,86,107,0.3)",
      color: "var(--danger-500)",
      fontSize: "0.86rem",
      lineHeight: 1.4
    }
  }, "\u26A0 ", errMsg)), noBalance ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      borderTop: "1px solid var(--border-subtle)",
      background: "var(--paper-050)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      alignItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-muted)",
      fontSize: "0.92rem"
    }
  }, "\u0420\u0430\u0437\u0431\u043E\u0440\u044B \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438\u0441\u044C. \u041F\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0431\u0430\u043B\u0430\u043D\u0441, \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C \u0431\u0435\u0441\u0435\u0434\u0443."), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: onGoTopUp
  }, "\u041F\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0431\u0430\u043B\u0430\u043D\u0441")) : done ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      borderTop: "1px solid var(--border-subtle)",
      background: "var(--paper-050)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-muted)",
      fontSize: "0.92rem"
    }
  }, "\u0420\u0430\u0437\u0431\u043E\u0440 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u0418\u0441\u0442\u043E\u0440\u0438\u044E."), /*#__PURE__*/React.createElement("button", {
    onClick: onViewArchetypes,
    style: {
      width: "100%",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 16px",
      borderRadius: 16,
      border: "1px solid var(--cyan-400)",
      background: "var(--navy-800)",
      boxShadow: "var(--shadow-glow)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      width: 32,
      height: 32,
      borderRadius: 999,
      background: "var(--cyan-300)",
      color: "var(--navy-800)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1rem"
    }
  }, "\u2726"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontWeight: 700,
      color: "var(--paper-050)",
      fontSize: "0.92rem"
    }
  }, "\u0417\u0430\u0433\u043B\u044F\u043D\u0443\u0442\u044C \u0432 \xAB\u0421\u043E\u0437\u0432\u0435\u0437\u0434\u0438\u0435 \u0430\u0440\u0445\u0435\u0442\u0438\u043F\u043E\u0432\xBB"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: "rgba(249,255,255,0.66)",
      fontSize: "0.82rem",
      marginTop: 2
    }
  }, "\u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u043F\u043E\u0441\u043B\u0435 \u044D\u0442\u043E\u0433\u043E \u0441\u043D\u0430 \u0442\u0430\u043C \u0440\u0430\u0441\u043A\u0440\u044B\u043B\u0441\u044F \u043D\u043E\u0432\u044B\u0439 \u0430\u0440\u0445\u0435\u0442\u0438\u043F")), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--cyan-300)",
      fontSize: "1.1rem"
    }
  }, "\u2192")), showSurvey && /*#__PURE__*/React.createElement(SurveyWidget, {
    dreamsCompleted: dreamsCompletedCount + 1
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: onClose
  }, "\u0413\u043E\u0442\u043E\u0432\u043E")) : /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-subtle)",
      background: "var(--paper-050)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    multiline: true,
    rows: 1,
    maxLength: 1000,
    value: text,
    placeholder: stage === 0 ? "Опишите свой сон…" : "Ответьте или задайте свой вопрос…",
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    style: {
      flex: 1,
      minHeight: 48
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: send,
    style: {
      minHeight: 48
    }
  }, "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C")), /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: "flex-end",
      fontSize: "0.72rem",
      color: text.length >= 1000 ? "var(--danger-500)" : "var(--text-muted)"
    }
  }, text.length, "/1000"), stage >= 1 && /*#__PURE__*/React.createElement("button", {
    onClick: summarizeNow,
    style: {
      width: "100%",
      boxSizing: "border-box",
      marginTop: 2,
      padding: "10px 14px",
      borderRadius: 12,
      border: "none",
      background: "var(--navy-800)",
      color: "var(--paper-050)",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: "0.86rem",
      cursor: "pointer"
    }
  }, "\u0414\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E, \u043F\u043E\u0434\u0432\u0435\u0434\u0438 \u0438\u0442\u043E\u0433 \u2192")))));
}
function todayLabel() {
  const M = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const d = new Date();
  return d.getDate() + " " + M[d.getMonth()];
}
function formatDate(raw) {
  const M = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.getDate() + " " + M[d.getMonth()] + " " + d.getFullYear();
}

/* ---------- Toast ---------- */
function Toast({
  msg
}) {
  if (!msg) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      left: "50%",
      bottom: 32,
      transform: "translateX(-50%)",
      zIndex: 80,
      background: "var(--navy-800)",
      color: "var(--paper-050)",
      padding: "14px 22px",
      borderRadius: 999,
      boxShadow: "var(--shadow-lg)",
      fontWeight: 600,
      fontSize: "0.95rem",
      display: "inline-flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--cyan-300)"
    }
  }, "\u2726"), msg);
}
function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  function close() {
    setOpen(false);
    setText("");
    setSent(false);
    setError("");
  }
  async function send() {
    if (!text.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/feedback/`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({
          message: text.trim()
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch (e) {
      setError('Не удалось отправить, попробуйте ещё раз');
    } finally {
      setSending(false);
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(true),
    "aria-label": "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443",
    style: {
      position: "fixed",
      right: 24,
      bottom: 24,
      zIndex: 70,
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 52,
      padding: "0 18px 0 16px",
      borderRadius: 26,
      border: "none",
      cursor: "pointer",
      background: "var(--navy-800)",
      color: "var(--paper-050)",
      fontSize: "0.95rem",
      fontWeight: 700,
      boxShadow: "var(--shadow-lg)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "1.2rem"
    }
  }, "\u2726"), "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043D\u0430\u043C"), open && /*#__PURE__*/React.createElement("div", {
    onClick: close,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 95,
      background: "rgba(11,20,38,0.7)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "relative",
      width: "min(420px, 100%)",
      background: "var(--surface-raised)",
      borderRadius: 24,
      boxShadow: "var(--shadow-xl)",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: close,
    "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    style: {
      position: "absolute",
      top: 10,
      right: 12,
      border: "none",
      background: "transparent",
      fontSize: "1.4rem",
      lineHeight: 1,
      cursor: "pointer",
      color: "var(--text-muted)"
    }
  }, "\xD7"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 8px",
      fontSize: "1.1rem",
      fontWeight: 800,
      color: "var(--text-strong)"
    }
  }, "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430"), sent ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-body)",
      lineHeight: 1.6
    }
  }, "\u0421\u043F\u0430\u0441\u0438\u0431\u043E! \u041C\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u0438 \u043E\u0442\u0432\u0435\u0442\u0438\u043C \u0432\u0430\u043C \u043D\u0430 \u043F\u043E\u0447\u0442\u0443.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 14px",
      color: "var(--text-muted)",
      fontSize: "0.92rem"
    }
  }, "\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441 \u2014 \u043E\u0442\u0432\u0435\u0442\u0438\u043C \u043D\u0430 \u0432\u0430\u0448\u0443 \u043F\u043E\u0447\u0442\u0443."), /*#__PURE__*/React.createElement(Input, {
    multiline: true,
    rows: 4,
    maxLength: 2000,
    value: text,
    placeholder: "\u0427\u0442\u043E \u0441\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C?",
    onChange: e => setText(e.target.value),
    style: {
      width: "100%",
      marginBottom: 12
    }
  }), error && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 12px",
      color: "#c0392b",
      fontSize: "0.88rem"
    }
  }, error), /*#__PURE__*/React.createElement(Button, {
    onClick: send,
    disabled: sending || !text.trim(),
    fullWidth: true
  }, sending ? 'Отправка…' : 'Отправить')))));
}
let _ykWidgetScriptPromise = null;
function loadYooKassaWidgetScript() {
  if (window.YooMoneyCheckoutWidget) return Promise.resolve();
  if (_ykWidgetScriptPromise) return _ykWidgetScriptPromise;
  _ykWidgetScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
    script.onload = resolve;
    script.onerror = () => {
      _ykWidgetScriptPromise = null;
      reject(new Error('YooKassa widget script failed to load'));
    };
    document.head.appendChild(script);
  });
  return _ykWidgetScriptPromise;
}
function PaymentWidgetModal({
  token,
  onClose,
  onSuccess
}) {
  const widgetRef = useRef(null);
  useEffect(() => {
    if (!token || !window.YooMoneyCheckoutWidget) return;
    const widget = new window.YooMoneyCheckoutWidget({
      confirmation_token: token,
      return_url: window.location.origin + '/lk',
      error_callback: () => onClose()
    });
    widgetRef.current = widget;
    widget.render('yk-payment-widget');
    widget.on('success', () => {
      onSuccess();
      widget.destroy();
    });
    widget.on('fail', () => {
      onClose();
      widget.destroy();
    });
    return () => widget.destroy();
  }, [token]);
  if (!token) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 95,
      background: "rgba(11,20,38,0.7)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "relative",
      width: "min(480px, 100%)",
      maxHeight: "90vh",
      overflowY: "auto",
      background: "var(--surface-raised)",
      borderRadius: 24,
      boxShadow: "var(--shadow-xl)",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
    style: {
      position: "absolute",
      top: 10,
      right: 12,
      border: "none",
      background: "transparent",
      fontSize: "1.4rem",
      lineHeight: 1,
      cursor: "pointer",
      color: "var(--text-muted)"
    }
  }, "\xD7"), /*#__PURE__*/React.createElement("div", {
    id: "yk-payment-widget"
  })));
}
Object.assign(window, {
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
});
})();
