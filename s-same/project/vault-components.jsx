// Core components: TicketCard, QR, Chip, PhoneFrame pieces
const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ---- TicketCard ----
// Physical-feeling card: gradient fill, perforated edge between header and footer,
// embossed reference in mono, small glow bloom behind it
function TicketCard({ ticket, variant='list', style, cardStyle='gradient', onClick }) {
  const { TYPE_META, formatDate, relativeLabel } = window.VAULT_DATA;
  const meta = TYPE_META[ticket.type] || TYPE_META.other;
  const Icon = Ic[meta.icon];
  const dt = formatDate(ticket.date);
  const rel = relativeLabel(ticket.date);

  const [g1, g2] = meta.gradient;

  // Style variants
  const bg = cardStyle === 'mono'
    ? 'linear-gradient(135deg, #1a1a24 0%, #0f0f17 100%)'
    : cardStyle === 'embossed'
      ? `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`
      : `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`;

  const isLarge = variant === 'large';

  return (
    <div
      onClick={onClick}
      className="ticket-card"
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: isLarge ? 24 : 20,
        padding: isLarge ? 22 : 16,
        background: bg,
        color: '#fff',
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: isLarge ? 200 : 104,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: ticket.isUsed ? 0.55 : 1,
        boxShadow: ticket.isUsed
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : `0 18px 40px -12px ${meta.glow}, 0 4px 20px rgba(0,0,0,0.4)`,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
        ...style
      }}
    >
      {/* Embossed foil sheen */}
      {cardStyle === 'embossed' && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
          mixBlendMode: 'overlay'
        }} />
      )}

      {/* subtle pattern */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 40%)',
        pointerEvents: 'none'
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 2, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: isLarge ? 38 : 32, height: isLarge ? 38 : 32,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.25)'
          }}>
            <Icon size={isLarge ? 20 : 17} c="#fff" />
          </div>
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.8)'
            }}>
              {meta.label}
            </div>
            {!isLarge && (
              <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 15, marginTop: 2, lineHeight: 1.2 }}>
                {ticket.title}
              </div>
            )}
          </div>
        </div>

        {/* Date block */}
        <div style={{
          textAlign: 'right',
          padding: '4px 10px',
          background: 'rgba(0,0,0,0.22)',
          borderRadius: 10,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <div style={{ fontFamily: 'Sora', fontSize: isLarge ? 22 : 16, fontWeight: 700, lineHeight: 1 }}>{dt.day}</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.85, marginTop: 2 }}>{dt.month}</div>
        </div>
      </div>

      {/* Large variant — title block */}
      {isLarge && (
        <div style={{ position: 'relative', zIndex: 2, marginTop: 20 }}>
          <h2 style={{ fontFamily: 'Sora', fontSize: 26, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {ticket.title}
          </h2>
          <div style={{ fontSize: 13, opacity: 0.82, marginTop: 4 }}>{ticket.subtitle}</div>
        </div>
      )}

      {/* Footer — perforated divider + meta */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: isLarge ? 16 : 12 }}>
        {/* Perforation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 10,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', left: -28, top: '50%', transform: 'translateY(-50%)',
            width: 16, height: 16, borderRadius: '50%',
            background: '#0A0A0F'
          }} />
          <div style={{
            position: 'absolute', right: -28, top: '50%', transform: 'translateY(-50%)',
            width: 16, height: 16, borderRadius: '50%',
            background: '#0A0A0F'
          }} />
          <div style={{
            flex: 1, height: 1,
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 4px, transparent 4px 9px)'
          }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, opacity: 0.85, minWidth: 0 }}>
            <Ic.Clock size={13} c="rgba(255,255,255,0.85)" />
            <span>{ticket.time}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.venue.split('·')[0].trim()}</span>
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            padding: '3px 8px',
            background: ticket.isUsed ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.18)',
            borderRadius: 6,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            {ticket.isUsed ? 'Used' : rel}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- QR Code SVG ----
function QRCode({ seed, size=220 }) {
  const grid = useMemo(() => window.VAULT_DATA.generateQRPattern(seed, 25), [seed]);
  const cell = size / 25;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8 }}>
      <rect width={size} height={size} fill="#fff" />
      {grid.map((row, y) => row.map((v, x) => v ? (
        <rect key={`${x}-${y}`} x={x*cell} y={y*cell} width={cell} height={cell} fill="#0A0A0F" />
      ) : null))}
    </svg>
  );
}

// ---- Chip (filter) ----
function Chip({ active, onClick, children, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 999,
        border: '1px solid',
        borderColor: active ? 'rgba(108,99,255,0.6)' : 'var(--border-subtle)',
        background: active ? 'rgba(108,99,255,0.18)' : 'var(--bg-card)',
        color: active ? '#fff' : 'var(--text-secondary)',
        fontFamily: 'DM Sans',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease'
      }}
    >
      {Icon && <Icon size={14} c={active ? '#fff' : 'currentColor'} />}
      {children}
    </button>
  );
}

// ---- Bottom Tab Bar ----
function TabBar({ tab, setTab, onAdd }) {
  const Tab = ({ id, icon: Icon, label }) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: '8px 0',
          background: 'transparent',
          border: 'none',
          color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
          cursor: 'pointer',
          transition: 'color 0.2s ease',
          position: 'relative'
        }}
      >
        <Icon size={22} c="currentColor" />
        <div style={{
          fontFamily: 'DM Sans',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.04em'
        }}>{label}</div>
        {active && (
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 26, height: 2, borderRadius: 2,
            background: 'var(--accent-primary)',
            boxShadow: '0 0 10px var(--accent-primary)'
          }} />
        )}
      </button>
    );
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: 88,
      paddingBottom: 22,
      background: 'linear-gradient(180deg, rgba(10,10,15,0) 0%, rgba(10,10,15,0.92) 30%, rgba(10,10,15,0.98) 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 20
    }}>
      <Tab id="home" icon={Ic.Home} label="Sésame" />
      <div style={{ width: 60 }} />
      <Tab id="categories" icon={Ic.Grid} label="Library" />
      {/* Center FAB */}
      <button
        onClick={onAdd}
        aria-label="Add ticket"
        style={{
          position: 'absolute',
          left: '50%', bottom: 32,
          transform: 'translateX(-50%)',
          width: 56, height: 56,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, #8B5CF6 100%)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(108,99,255,0.55), 0 0 0 6px rgba(108,99,255,0.1)',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'translateX(-50%) scale(0.92)'}
        onMouseUp={e => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
      >
        <Ic.Plus size={26} c="#fff" />
      </button>
    </div>
  );
}

Object.assign(window, { TicketCard, QRCode, Chip, TabBar });
