// Screens: Home, Detail, Add, Categories, Settings

// ---- Home ----
function HomeScreen({ tickets, onOpen, onAdd, tweaks }) {
  const { TYPE_META, greeting } = window.VAULT_DATA;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [greetMsg] = useState(() => greeting(tweaks.greetingStyle, tweaks.userName));

  const now = Date.now();
  const filtered = useMemo(() => {
    return tickets
      .filter(t => filter === 'all' || t.type === filter)
      .filter(t => {
        if (!query) return true;
        const q = query.toLowerCase();
        return t.title.toLowerCase().includes(q)
          || t.venue.toLowerCase().includes(q)
          || t.subtitle.toLowerCase().includes(q)
          || TYPE_META[t.type]?.label.toLowerCase().includes(q);
      });
  }, [tickets, query, filter]);

  const upcoming = filtered.filter(t => !t.isUsed && new Date(t.date).getTime() > now)
    .sort((a,b) => new Date(a.date) - new Date(b.date));
  const all = filtered.sort((a,b) => new Date(a.date) - new Date(b.date));

  const initials = tweaks.userName.slice(0, 2).toUpperCase();

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 54,
      paddingBottom: 88
    }}>
      {/* Header */}
      <div style={{ padding: '16px 22px 12px', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: 4
            }}>
              SÉSAME · {String(tickets.length).padStart(2,'0')} PASSES
            </div>
            <h1 style={{
              fontFamily: 'Sora',
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>{greetMsg}</h1>
          </div>
          <div style={{
            width: 42, height: 42,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Sora',
            fontWeight: 600,
            fontSize: 14,
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 20px rgba(108,99,255,0.3)'
          }}>{initials}</div>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '11px 14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 14,
          backdropFilter: 'blur(10px)'
        }}>
          <Ic.Search size={18} c="var(--text-secondary)" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tickets, venues, events…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'DM Sans',
              fontSize: 14
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
              <Ic.X size={16} c="currentColor" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="scroll" style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        padding: '4px 22px 12px',
        flexShrink: 0
      }}>
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
        {Object.entries(TYPE_META).filter(([k]) => k !== 'other').map(([k, m]) => (
          <Chip key={k} active={filter === k} onClick={() => setFilter(k)} icon={Ic[m.icon]}>
            {m.label}
          </Chip>
        ))}
        <Chip active={filter === 'other'} onClick={() => setFilter('other')} icon={Ic.Grid}>Other</Chip>
      </div>

      {/* Body */}
      <div className="scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>
        {tickets.length === 0 ? (
          <EmptyState onAdd={onAdd} />
        ) : (
          <>
            {/* Upcoming carousel */}
            {upcoming.length > 0 && (
              <div style={{ animation: 'fadeInUp 0.6s 0.05s both ease' }}>
                <SectionHeader title="Up next" count={upcoming.length} />
                <div className="scroll" style={{
                  display: 'flex',
                  gap: 14,
                  padding: '0 22px 8px',
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory'
                }}>
                  {upcoming.slice(0, 5).map((t, i) => (
                    <div key={t.id} style={{
                      width: 300,
                      flexShrink: 0,
                      scrollSnapAlign: 'start',
                      animation: `fadeInUp 0.5s ${0.1 + i*0.06}s both ease`
                    }}>
                      <TicketCard
                        ticket={t}
                        variant="large"
                        cardStyle={tweaks.cardStyle}
                        onClick={() => onOpen(t)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All tickets */}
            <div style={{ marginTop: 4, animation: 'fadeInUp 0.6s 0.12s both ease' }}>
              <SectionHeader title="All tickets" count={all.length} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 22px' }}>
                {all.map((t, i) => (
                  <div key={t.id} style={{ animation: `fadeInUp 0.4s ${0.05 + i*0.03}s both ease` }}>
                    <TicketCard
                      ticket={t}
                      cardStyle={tweaks.cardStyle}
                      onClick={() => onOpen(t)}
                    />
                  </div>
                ))}
                {all.length === 0 && (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: 13
                  }}>
                    No tickets match "{query}"
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      padding: '18px 22px 12px'
    }}>
      <h3 style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</h3>
      <div style={{
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        color: 'var(--text-tertiary)',
        letterSpacing: '0.1em'
      }}>{String(count).padStart(2,'0')}</div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div style={{
      padding: '48px 32px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20
    }}>
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
        <defs>
          <linearGradient id="vg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#FF6584" stopOpacity="0.4"/>
          </linearGradient>
        </defs>
        <rect x="24" y="40" width="92" height="58" rx="10" fill="none" stroke="url(#vg)" strokeWidth="1.5" strokeDasharray="4 4"/>
        <rect x="34" y="52" width="40" height="6" rx="2" fill="rgba(255,255,255,0.1)"/>
        <rect x="34" y="64" width="28" height="4" rx="2" fill="rgba(255,255,255,0.06)"/>
        <circle cx="100" cy="69" r="12" stroke="url(#vg)" strokeWidth="1.2" fill="none"/>
      </svg>
      <div>
        <h3 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Votre Sésame est vide</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5, maxWidth: 240 }}>
          Add your first ticket — flights, concerts, games. Everything in one place.
        </p>
      </div>
      <button onClick={onAdd} style={{
        padding: '11px 20px',
        borderRadius: 12,
        border: 'none',
        background: 'var(--accent-primary)',
        color: '#fff',
        fontFamily: 'DM Sans',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }}>
        <Ic.Plus size={16} c="#fff" /> Add a ticket
      </button>
    </div>
  );
}

// ---- Detail View ----
function TicketDetail({ ticket, onBack }) {
  const { TYPE_META, formatDate, relativeLabel } = window.VAULT_DATA;
  const meta = TYPE_META[ticket.type];
  const Icon = Ic[meta.icon];
  const dt = formatDate(ticket.date);
  const [g1, g2] = meta.gradient;
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  const onScroll = () => setScrollY(scrollRef.current?.scrollTop || 0);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'var(--bg-primary)',
      zIndex: 60,
      animation: 'fadeIn 0.25s ease'
    }}>
      {/* Gradient backdrop (parallax) */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 420,
        background: `linear-gradient(180deg, ${g1} 0%, ${g2} 60%, transparent 100%)`,
        opacity: 0.9,
        transform: `translateY(${-scrollY * 0.3}px)`,
        transition: 'transform 0.05s linear',
        willChange: 'transform'
      }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 420,
        background: 'linear-gradient(180deg, transparent 50%, var(--bg-primary) 100%)'
      }} />

      {/* Header controls */}
      <div style={{
        position: 'absolute',
        top: 54, left: 0, right: 0,
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        <button onClick={onBack} style={{
          width: 38, height: 38,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Ic.ArrowLeft size={20} c="#fff" />
        </button>
        <button aria-label="Share" style={{
          width: 38, height: 38,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Ic.Share size={18} c="#fff" />
        </button>
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} onScroll={onScroll} className="scroll" style={{
        position: 'relative',
        height: '100%',
        overflowY: 'auto',
        paddingTop: 108,
        paddingBottom: 40,
        zIndex: 5
      }}>
        {/* Type label */}
        <div style={{ padding: '0 28px', animation: 'fadeInUp 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: 9,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon size={17} c="#fff" />
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)'
            }}>
              {meta.label} · {ticket.isUsed ? 'USED' : relativeLabel(ticket.date)}
            </div>
          </div>

          <h1 style={{
            fontFamily: 'Sora',
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.08,
            marginBottom: 8,
            color: '#fff'
          }}>{ticket.title}</h1>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)' }}>{ticket.subtitle}</div>
        </div>

        {/* Date & venue stacked */}
        <div style={{ padding: '28px 28px 0', animation: 'fadeInUp 0.5s 0.05s both ease' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 12
          }}>
            <DetailTile icon={Ic.Calendar} label="Date" value={dt.full} />
            <DetailTile icon={Ic.Clock} label="Time" value={ticket.time} />
          </div>
          <DetailTile icon={Ic.Pin} label="Venue" value={ticket.venue} />
          {ticket.seat && <div style={{ marginTop: 12 }}><DetailTile icon={Ic.Wallet} label="Seat" value={ticket.seat} /></div>}
          {ticket.gate && <div style={{ marginTop: 12 }}><DetailTile icon={Ic.Chevron} label="Gate" value={ticket.gate} /></div>}
        </div>

        {/* QR Code card */}
        <div style={{ padding: '24px 28px 0', animation: 'fadeInUp 0.5s 0.12s both ease' }}>
          <div style={{
            padding: 24,
            borderRadius: 22,
            background: '#fff',
            position: 'relative',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)',
            overflow: 'hidden'
          }}>
            {/* Perforated edges */}
            <div style={{
              position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)',
              width: 20, height: 20, borderRadius: '50%', background: 'var(--bg-primary)'
            }} />
            <div style={{
              position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
              width: 20, height: 20, borderRadius: '50%', background: 'var(--bg-primary)'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <QRCode seed={ticket.reference} size={200} />
              <div style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 13,
                color: '#0A0A0F',
                letterSpacing: '0.08em',
                fontWeight: 500
              }}>
                {ticket.reference}
              </div>
              <div style={{
                width: '100%',
                height: 1,
                background: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0 4px, transparent 4px 9px)'
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#666',
                fontSize: 11,
                fontFamily: 'JetBrains Mono',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                <Ic.Sparkle size={12} c="#FFD166" />
                Scan at entry
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '20px 28px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, animation: 'fadeInUp 0.5s 0.18s both ease' }}>
          <ActionButton icon={Ic.Wallet}>Add to Wallet</ActionButton>
          <ActionButton icon={Ic.Share}>Share</ActionButton>
        </div>
      </div>
    </div>
  );
}

function DetailTile({ icon: Icon, label, value }) {
  return (
    <div style={{
      padding: 14,
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 14,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        color: 'var(--text-tertiary)',
        fontFamily: 'JetBrains Mono',
        fontSize: 10,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: 6
      }}>
        <Icon size={12} c="currentColor" /> {label}
      </div>
      <div style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{value}</div>
    </div>
  );
}

function ActionButton({ icon: Icon, children }) {
  return (
    <button style={{
      padding: '14px 12px',
      borderRadius: 14,
      border: '1px solid var(--border-strong)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(10px)',
      color: 'var(--text-primary)',
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 13,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      transition: 'all 0.2s ease'
    }}>
      <Icon size={16} c="currentColor" /> {children}
    </button>
  );
}

// ---- Add Ticket Modal ----
function AddTicketSheet({ open, onClose, onAdd, tweaks }) {
  const { TYPE_META } = window.VAULT_DATA;
  const [type, setType] = useState('concert');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('20:00');
  const [venue, setVenue] = useState('');
  const [seat, setSeat] = useState('');
  const [gate, setGate] = useState('');
  const [reference, setReference] = useState('');

  useEffect(() => {
    if (open) {
      // Prefill
      const d = new Date(Date.now() + 7*86400000);
      setDate(d.toISOString().slice(0,10));
    }
  }, [open]);

  const preview = {
    id: 'preview',
    type,
    title: title || 'Event title',
    subtitle: subtitle || 'Subtitle / artist',
    date: date ? new Date(`${date}T${time}:00`).toISOString() : new Date(Date.now() + 7*86400000).toISOString(),
    time,
    venue: venue || 'Venue · City',
    seat,
    gate,
    reference: reference || 'PREVIEW-0000',
    isUsed: false,
    addedAt: new Date().toISOString()
  };

  const canSubmit = title && date && venue;

  const submit = () => {
    if (!canSubmit) return;
    onAdd({
      ...preview,
      id: 't' + Math.random().toString(36).slice(2, 10),
      reference: reference || `VLT-${Math.random().toString(36).slice(2,10).toUpperCase()}`,
    });
    // reset
    setTitle(''); setSubtitle(''); setVenue(''); setSeat(''); setGate(''); setReference('');
  };

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 70,
          animation: 'fadeIn 0.25s ease'
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '88%',
        background: 'var(--bg-primary)',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        border: '1px solid var(--border-subtle)',
        borderBottom: 'none'
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '8px 22px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 600 }}>New Ticket</h2>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Ic.X size={18} />
          </button>
        </div>

        {/* Scroll body */}
        <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 22px 16px' }}>
          {/* Live preview */}
          <div style={{ marginBottom: 22 }}>
            <TicketCard ticket={preview} variant="large" cardStyle={tweaks.cardStyle} />
          </div>

          {/* Type selector */}
          <FieldLabel>Type</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
            {Object.entries(TYPE_META).map(([k, m]) => {
              const I = Ic[m.icon];
              const active = type === k;
              return (
                <button key={k} onClick={() => setType(k)} style={{
                  padding: '12px 8px',
                  borderRadius: 12,
                  border: '1px solid',
                  borderColor: active ? 'transparent' : 'var(--border-subtle)',
                  background: active ? `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})` : 'var(--bg-card)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  fontFamily: 'DM Sans',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.2s ease'
                }}>
                  <I size={18} c={active ? '#fff' : 'currentColor'} />
                  {m.label}
                </button>
              );
            })}
          </div>

          <FieldLabel>Event name *</FieldLabel>
          <Input value={title} onChange={setTitle} placeholder="e.g. Arctic Winds — Live" />

          <FieldLabel>Subtitle</FieldLabel>
          <Input value={subtitle} onChange={setSubtitle} placeholder="Tour / Artist / Flight number" />

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10 }}>
            <div>
              <FieldLabel>Date *</FieldLabel>
              <Input type="date" value={date} onChange={setDate} />
            </div>
            <div>
              <FieldLabel>Time</FieldLabel>
              <Input type="time" value={time} onChange={setTime} />
            </div>
          </div>

          <FieldLabel>Venue *</FieldLabel>
          <Input value={venue} onChange={setVenue} placeholder="Venue · City" />

          <FieldLabel>Seat</FieldLabel>
          <Input value={seat} onChange={setSeat} placeholder="Optional" />

          {type === 'flight' && (
            <>
              <FieldLabel>Gate</FieldLabel>
              <Input value={gate} onChange={setGate} placeholder="e.g. K62" />
            </>
          )}

          <FieldLabel>Reference</FieldLabel>
          <Input value={reference} onChange={setReference} placeholder="Auto-generated if empty" mono />

          <div style={{ height: 12 }} />
        </div>

        {/* Footer CTA */}
        <div style={{
          padding: '14px 22px 26px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(10,10,15,0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={submit}
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              border: 'none',
              background: canSubmit ? 'linear-gradient(135deg, var(--accent-primary), #8B5CF6)' : 'var(--bg-card)',
              color: canSubmit ? '#fff' : 'var(--text-tertiary)',
              fontFamily: 'DM Sans',
              fontWeight: 600,
              fontSize: 15,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              boxShadow: canSubmit ? '0 10px 30px rgba(108,99,255,0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Ajouter à Sésame
          </button>
        </div>
      </div>
    </>
  );
}

function FieldLabel({ children }) {
  return <div style={{
    fontFamily: 'JetBrains Mono',
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    marginBottom: 6,
    marginTop: 14
  }}>{children}</div>;
}

function Input({ value, onChange, placeholder, type='text', mono }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '12px 14px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        color: 'var(--text-primary)',
        fontFamily: mono ? 'JetBrains Mono' : 'DM Sans',
        fontSize: 14,
        outline: 'none',
        transition: 'border-color 0.2s ease',
        colorScheme: 'dark'
      }}
      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
    />
  );
}

// ---- Categories / Library ----
function CategoriesScreen({ tickets, onOpen, tweaks }) {
  const { TYPE_META } = window.VAULT_DATA;
  const [showPast, setShowPast] = useState(false);
  const now = Date.now();

  const grouped = useMemo(() => {
    const g = {};
    tickets.forEach(t => {
      const isPast = t.isUsed || new Date(t.date).getTime() < now;
      if (isPast !== showPast) return;
      g[t.type] = g[t.type] || [];
      g[t.type].push(t);
    });
    return g;
  }, [tickets, showPast]);

  const entries = Object.entries(grouped).sort((a,b) => b[1].length - a[1].length);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 54, paddingBottom: 88 }}>
      <div style={{ padding: '16px 22px 12px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          marginBottom: 4
        }}>LIBRARY · BY CATEGORY</div>
        <h1 style={{ fontFamily: 'Sora', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
          {showPast ? 'Past tickets' : 'Your collection'}
        </h1>
      </div>

      {/* Toggle */}
      <div style={{ padding: '8px 22px 14px' }}>
        <div style={{
          display: 'flex',
          padding: 4,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12
        }}>
          {[
            { k: false, label: 'Upcoming' },
            { k: true, label: 'Past' }
          ].map(opt => (
            <button key={String(opt.k)} onClick={() => setShowPast(opt.k)} style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: 9,
              background: showPast === opt.k ? 'var(--bg-glass)' : 'transparent',
              color: showPast === opt.k ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'DM Sans',
              fontWeight: 500,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 22px 24px' }}>
        {entries.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            No {showPast ? 'past' : 'upcoming'} tickets
          </div>
        )}
        {entries.map(([type, list], idx) => {
          const m = TYPE_META[type];
          const I = Ic[m.icon];
          return (
            <div key={type} style={{ marginBottom: 22, animation: `fadeInUp 0.4s ${idx*0.05}s both ease` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <I size={15} c="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 600 }}>{m.label}</div>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-tertiary)' }}>
                  {String(list.length).padStart(2,'0')}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {list.map(t => (
                  <TicketCard key={t.id} ticket={t} cardStyle={tweaks.cardStyle} onClick={() => onOpen(t)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, TicketDetail, AddTicketSheet, CategoriesScreen });
