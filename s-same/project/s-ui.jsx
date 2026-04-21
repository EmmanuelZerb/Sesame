// ── Shared UI primitives — Plus Jakarta Sans ─────────
const { useState, useEffect, useMemo, useRef, useCallback } = React;

const F = {
  title:  { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700 },
  semi:   { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 600 },
  body:   { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 400 },
  medium: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 500 },
  mono:   { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400 },
  mono5:  { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 },
};

// ── Icons ─────────────────────────────────────────────
const Icon = {
  Plane:   ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3-3-.5c-.3 0-.7.1-.9.4l-.4.5c-.3.4-.2 1 .2 1.3L6 19l1.5 2.5c.3.4.9.5 1.3.2l.5-.4c.3-.2.4-.6.4-.9L9 17l3-2 3.7 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>,
  Music:   ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Train:   ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><circle cx="8.5" cy="15" r="1"/><circle cx="15.5" cy="15" r="1"/><path d="M8 19l-2 3M16 19l2 3"/></svg>,
  Sport:   ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v4m0 10v4M3 12h4m10 0h4"/></svg>,
  Theater: ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6c0 8 4 14 9 14s9-6 9-14c0-1-1-2-2-2H5c-1 0-2 1-2 2z"/><circle cx="9" cy="10" r="1" fill={c}/><circle cx="15" cy="10" r="1" fill={c}/><path d="M9 14c1 1 5 1 6 0"/></svg>,
  Other:   ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
  Search:  ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus:    ({s=24,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  ChevR:   ({s=18,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>,
  ChevL:   ({s=18,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6"/></svg>,
  X:       ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Home:    ({s=22,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>,
  Archive: ({s=22,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="5" rx="1"/><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M10 13h4"/></svg>,
  Sun:     ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  Share:   ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 8l5-5 5 5M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/></svg>,
  Check:   ({s=20,c='currentColor'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
};

const typeIcon = (type, s=20, c='currentColor') => {
  const map = { flight: Icon.Plane, concert: Icon.Music, train: Icon.Train, sport: Icon.Sport, theater: Icon.Theater, other: Icon.Other };
  return React.createElement(map[type] || Icon.Other, { s, c });
};

// ── Badge ─────────────────────────────────────────────
function Badge({ text, color, bg }) {
  return (
    <span style={{ ...F.mono5, fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color, background: bg, padding: '3px 7px', borderRadius: 6, whiteSpace: 'nowrap' }}>
      {text}
    </span>
  );
}

// ── Dashed divider ────────────────────────────────────
function Dash({ mx = -20 }) {
  return <div style={{ height: 1, margin: `0 ${mx}px`, backgroundImage: 'repeating-linear-gradient(90deg, var(--border) 0 5px, transparent 5px 10px)' }} />;
}

// ── Large TicketCard ──────────────────────────────────
function CardLarge({ ticket, onClick, lang = 'fr' }) {
  const m = SD.TYPE_META[ticket.type];
  const badge = SD.urgencyBadge(ticket.date, ticket.isUsed);
  const past = SD.isPast(ticket);

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        width: 272, flexShrink: 0,
        background: m.bg, borderRadius: 20,
        padding: '18px 18px 16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        cursor: 'pointer', opacity: past ? 0.55 : 1,
        transition: 'transform 150ms ease',
        scrollSnapAlign: 'start', userSelect: 'none',
      }}
      onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Type row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {typeIcon(ticket.type, 16, m.color)}
          <span style={{ ...F.semi, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: m.color }}>
            {lang === 'fr' ? m.labelFr : m.label}
          </span>
        </div>
        {/* Date box */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '5px 9px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ ...F.title, fontSize: 20, color: 'var(--text-1)', lineHeight: 1 }}>{SD.formatDay(ticket.date)}</div>
          <div style={{ ...F.semi, fontSize: 9, letterSpacing: '.1em', color: 'var(--text-2)', marginTop: 1, textTransform: 'uppercase' }}>{SD.formatMonth(ticket.date, lang)}</div>
        </div>
      </div>

      {/* Title */}
      <div style={{ ...F.title, fontSize: 20, color: 'var(--text-1)', lineHeight: 1.15, marginBottom: 3 }}>{ticket.title}</div>
      <div style={{ ...F.medium, fontSize: 12, color: m.color, marginBottom: 16 }}>{ticket.subtitle}</div>

      <Dash />

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 6 }}>
        <div style={{ ...F.medium, fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 11 }}>🕐</span>
          <span>{ticket.time}</span>
          <span style={{ color: 'var(--text-3)' }}>·</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.venue.split('·')[0].trim()}</span>
        </div>
        {badge && <Badge {...badge} />}
      </div>
    </div>
  );
}

// ── Compact TicketCard ────────────────────────────────
function CardCompact({ ticket, onClick, lang = 'fr' }) {
  const m = SD.TYPE_META[ticket.type];
  const badge = SD.urgencyBadge(ticket.date, ticket.isUsed);
  const past = SD.isPast(ticket);

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '13px 14px',
        background: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border)',
        cursor: 'pointer', opacity: past ? 0.5 : 1,
        transition: 'transform 150ms ease', userSelect: 'none',
      }}
      onPointerDown={e => e.currentTarget.style.transform = 'scale(0.99)'}
      onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Icon */}
      <div style={{ width: 42, height: 42, flexShrink: 0, background: m.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {typeIcon(ticket.type, 19, m.color)}
      </div>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...F.semi, fontSize: 14, color: 'var(--text-1)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
          <span style={{ ...F.semi, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: m.color }}>{lang === 'fr' ? m.labelFr : m.label}</span>
          <span style={{ color: 'var(--text-3)', fontSize: 11 }}>·</span>
          <span style={{ ...F.body, fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subtitle}</span>
        </div>
      </div>
      {/* Date + badge */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...F.title, fontSize: 17, color: 'var(--text-1)', lineHeight: 1 }}>{SD.formatDay(ticket.date)}</div>
          <div style={{ ...F.semi, fontSize: 9, letterSpacing: '.08em', color: 'var(--text-2)', textTransform: 'uppercase' }}>{SD.formatMonth(ticket.date, lang)}</div>
        </div>
        {badge && <Badge {...badge} />}
      </div>
    </div>
  );
}

// ── Search bar ────────────────────────────────────────
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 13px', background: 'var(--bg-subtle)', borderRadius: 12 }}>
      <Icon.Search s={16} c="var(--text-3)" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, border: 'none', background: 'transparent', ...F.body, fontSize: 14, color: 'var(--text-1)' }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{ background: 'none', border: 'none', display: 'flex', color: 'var(--text-2)', padding: 0 }}>
          <Icon.X s={15} c="currentColor" />
        </button>
      )}
    </div>
  );
}

// ── Filter chip ───────────────────────────────────────
function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 13px', borderRadius: 999,
      border: `1.5px solid ${active ? 'var(--text-1)' : 'var(--border)'}`,
      background: active ? 'var(--text-1)' : 'var(--bg-card)',
      color: active ? '#fff' : 'var(--text-2)',
      ...F[active ? 'semi' : 'medium'], fontSize: 12,
      whiteSpace: 'nowrap', cursor: 'pointer',
      transition: 'all 150ms ease'
    }}>{children}</button>
  );
}

// ── Section header ────────────────────────────────────
function SectionHead({ title, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 10px' }}>
      <span style={{ ...F.semi, fontSize: 15, color: 'var(--text-1)' }}>{title}</span>
      <span style={{ ...F.mono, fontSize: 11, color: 'var(--text-3)' }}>{String(count).padStart(2, '0')}</span>
    </div>
  );
}

// ── Bottom tab bar ─────────────────────────────────────
function TabBar({ tab, setTab, onAdd }) {
  const T = ({ id, icon, label }) => {
    const active = tab === id;
    return (
      <button onClick={() => setTab(id)} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 3, paddingTop: 10, paddingBottom: 0,
        background: 'none', border: 'none',
        borderTop: `2px solid ${active ? 'var(--text-1)' : 'transparent'}`,
        color: active ? 'var(--text-1)' : 'var(--text-3)',
        ...F[active ? 'semi' : 'body'], fontSize: 10, cursor: 'pointer',
        transition: 'color 150ms',
      }}>
        {React.createElement(Icon[icon], { s: 21, c: 'currentColor' })}
        {label}
      </button>
    );
  };

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 80, background: 'rgba(250,250,248,0.96)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'flex-start',
      paddingBottom: 14, zIndex: 20
    }}>
      <T id="home" icon="Home" label="Sésame" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
        <button
          onClick={onAdd}
          aria-label="Ajouter un billet"
          style={{
            width: 46, height: 46, borderRadius: '50%',
            background: 'var(--text-1)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', marginBottom: 2,
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            transition: 'transform 150ms ease'
          }}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Icon.Plus s={22} c="#fff" />
        </button>
        <span style={{ ...F.body, fontSize: 10, color: 'var(--text-3)' }}>Ajouter</span>
      </div>
      <T id="library" icon="Archive" label="Archive" />
    </div>
  );
}

// ── QR Code ───────────────────────────────────────────
function QRCode({ seed, size = 200 }) {
  const grid = useMemo(() => SD.makeQR(seed), [seed]);
  const n = grid.length;
  const cell = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', borderRadius: 6 }}>
      <rect width={size} height={size} fill="#fff"/>
      {grid.map((row, y) => row.map((v, x) => v
        ? <rect key={`${x}-${y}`} x={x*cell} y={y*cell} width={cell-0.3} height={cell-0.3} fill="#1A1916"/>
        : null
      ))}
    </svg>
  );
}

Object.assign(window, { F, Icon, typeIcon, Badge, Dash, CardLarge, CardCompact, SearchBar, Chip, SectionHead, TabBar, QRCode });
