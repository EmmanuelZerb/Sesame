// ── Screens — Plus Jakarta Sans ──────────────────────
const { useState: useS, useEffect: useE, useMemo: useM, useRef: useR, useCallback: useCB } = React;

// ════════════════════════════════════════════════════
// HOME
// ════════════════════════════════════════════════════
function HomeScreen({ tickets, onOpen, onAdd, tweaks }) {
  const { lang } = tweaks;
  const [q, setQ] = useS('');
  const [filter, setFilter] = useS('all');
  const { TYPE_META } = SD;
  const now = new Date(); now.setHours(0,0,0,0);

  const filtered = useM(() =>
    tickets
      .filter(t => filter === 'all' || t.type === filter)
      .filter(t => {
        if (!q) return true;
        const s = q.toLowerCase();
        return t.title.toLowerCase().includes(s) || t.subtitle.toLowerCase().includes(s) || t.venue.toLowerCase().includes(s);
      }),
    [tickets, q, filter]
  );

  const upcoming = useM(() =>
    filtered.filter(t => !SD.isPast(t)).sort((a, b) => SD.parseDateStr(a.date) - SD.parseDateStr(b.date)),
    [filtered]
  );

  const allSorted = useM(() => {
    const fut = filtered.filter(t => !SD.isPast(t)).sort((a, b) => SD.parseDateStr(a.date) - SD.parseDateStr(b.date));
    const past = filtered.filter(t => SD.isPast(t)).sort((a, b) => SD.parseDateStr(b.date) - SD.parseDateStr(a.date));
    return [...fut, ...past];
  }, [filtered]);

  return (
    <div style={{
      position: 'absolute', inset: '0 0 80px 0',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg)',
    }}>
      {/* Fixed header area */}
      <div style={{ flexShrink: 0, paddingTop: 52 }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '12px 24px 0' }}>
          <h1 style={{ ...F.title, fontSize: 28, color: 'var(--text-1)', letterSpacing: '-.03em' }}>Sésame</h1>
          <span style={{ ...F.body, fontSize: 13, color: 'var(--text-2)' }}>
            {tickets.length} {tickets.length === 1 ? 'pass' : 'passes'}
          </span>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 24px 0' }}>
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder={lang === 'fr' ? 'Rechercher billets, lieux…' : 'Search tickets, venues…'}
          />
        </div>

        {/* Chips */}
        <div className="scroll" style={{ display: 'flex', gap: 7, padding: '10px 24px 2px', overflowX: 'auto' }}>
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>{lang === 'fr' ? 'Tous' : 'All'}</Chip>
          {Object.entries(TYPE_META).filter(([k]) => k !== 'other').map(([k, m]) => (
            <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>{lang === 'fr' ? m.labelFr : m.label}</Chip>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {tickets.length === 0
          ? <EmptyState onAdd={onAdd} lang={lang} />
          : <>
              {upcoming.length > 0 && (
                <div>
                  <SectionHead title={lang === 'fr' ? 'À venir' : 'Up next'} count={upcoming.length} />
                  <div className="scroll" style={{
                    display: 'flex', gap: 10,
                    padding: '0 0 4px',
                    paddingLeft: 32,
                    paddingRight: 'calc((100% - 272px) / 2)',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    scrollPaddingInline: '32px',
                  }}>
                    {upcoming.map(t => (
                      <CardLarge key={t.id} ticket={t} onClick={() => onOpen(t)} lang={lang} />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <SectionHead title={lang === 'fr' ? 'Tous les billets' : 'All tickets'} count={allSorted.length} />
                {allSorted.length === 0 && (
                  <p style={{ padding: '24px', ...F.body, fontSize: 14, color: 'var(--text-3)', textAlign: 'center' }}>
                    {lang === 'fr' ? `Aucun résultat pour "${q}"` : `No results for "${q}"`}
                  </p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 24px 24px' }}>
                  {allSorted.map(t => (
                    <CardCompact key={t.id} ticket={t} onClick={() => onOpen(t)} lang={lang} />
                  ))}
                </div>
              </div>
            </>
        }
      </div>
    </div>
  );
}

function EmptyState({ onAdd, lang }) {
  return (
    <div style={{ padding: '56px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center' }}>
      <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
        <rect x="12" y="22" width="86" height="50" rx="10" fill="var(--bg-subtle)" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="5 4"/>
        <rect x="24" y="36" width="34" height="6" rx="3" fill="var(--border)"/>
        <rect x="24" y="48" width="22" height="4" rx="2" fill="var(--border)" opacity=".6"/>
        <circle cx="80" cy="48" r="10" fill="none" stroke="var(--border)" strokeWidth="1.5"/>
        <path d="M77 48h6M80 45v6" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <div>
        <h3 style={{ ...F.title, fontSize: 20, color: 'var(--text-1)', marginBottom: 6 }}>
          {lang === 'fr' ? 'Votre Sésame est vide' : 'Your Sésame is empty'}
        </h3>
        <p style={{ ...F.body, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, maxWidth: 220 }}>
          {lang === 'fr' ? 'Ajoutez vos billets — vols, concerts, trains. Tout au même endroit.' : 'Add your tickets — flights, concerts, trains. All in one place.'}
        </p>
      </div>
      <button onClick={onAdd} style={{
        padding: '11px 18px', borderRadius: 11, background: 'var(--text-1)', border: 'none',
        color: '#fff', ...F.semi, fontSize: 13, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 7
      }}>
        <Icon.Plus s={15} c="#fff" />
        {lang === 'fr' ? 'Ajouter un billet' : 'Add a ticket'}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════
// TICKET DETAIL
// ════════════════════════════════════════════════════
function TicketDetail({ ticket, onClose, lang = 'fr' }) {
  const m = SD.TYPE_META[ticket.type];
  const badge = SD.urgencyBadge(ticket.date, ticket.isUsed);
  const sheetRef = useR(null);
  const startY = useR(null);

  const onTouchStart = useCB(e => { startY.current = e.touches[0].clientY; }, []);
  const onTouchMove = useCB(e => {
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0 && sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  }, []);
  const onTouchEnd = useCB(e => {
    const dy = e.changedTouches[0].clientY - startY.current;
    if (dy > 80) { onClose(); }
    else if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 200ms ease';
      sheetRef.current.style.transform = 'translateY(0)';
      setTimeout(() => { if (sheetRef.current) sheetRef.current.style.transition = ''; }, 210);
    }
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,25,22,0.28)', zIndex: 50, animation: 'fadeIn 200ms ease' }} />
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'var(--bg)',
          borderTopLeftRadius: 26, borderTopRightRadius: 26,
          zIndex: 60, maxHeight: '91%',
          display: 'flex', flexDirection: 'column',
          animation: 'sheetIn 300ms cubic-bezier(0.22,1,0.36,1)',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.1)'
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        <div className="scroll" style={{ overflowY: 'auto', padding: '4px 22px 32px', flex: 1 }}>
          {/* Color card */}
          <div style={{ background: m.bg, borderRadius: 18, padding: '18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              {typeIcon(ticket.type, 16, m.color)}
              <span style={{ ...F.semi, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: m.color }}>
                {lang === 'fr' ? m.labelFr : m.label}
              </span>
              {badge && <div style={{ marginLeft: 'auto' }}><Badge {...badge} /></div>}
            </div>
            <h1 style={{ ...F.title, fontSize: 24, letterSpacing: '-.025em', color: 'var(--text-1)', lineHeight: 1.1, marginBottom: 4 }}>
              {ticket.title}
            </h1>
            <p style={{ ...F.medium, fontSize: 13, color: m.color, marginBottom: 14 }}>{ticket.subtitle}</p>

            {/* Key info strip */}
            <div style={{
              background: 'rgba(255,255,255,0.72)', borderRadius: 12, padding: '11px 14px',
              display: 'flex', gap: 20, flexWrap: 'wrap'
            }}>
              <InfoChip label={lang === 'fr' ? 'Date' : 'Date'} value={`${SD.formatDay(ticket.date)} ${SD.formatMonth(ticket.date, lang)}`} />
              <InfoChip label={lang === 'fr' ? 'Heure' : 'Time'} value={ticket.time} />
              {ticket.gate && <InfoChip label={lang === 'fr' ? 'Porte' : 'Gate'} value={ticket.gate} />}
              {ticket.seat && <InfoChip label={lang === 'fr' ? 'Siège' : 'Seat'} value={ticket.seat} />}
            </div>
          </div>

          {/* QR */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 18, padding: '22px', marginBottom: 14,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
          }}>
            <Dash mx={0} />
            <QRCode seed={ticket.reference} size={196} />
            <span style={{ ...F.mono5, fontSize: 13, letterSpacing: '.08em', color: 'var(--text-1)' }}>{ticket.reference}</span>
            <Dash mx={0} />
          </div>

          {/* Details */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
            <DetailRow label={lang === 'fr' ? 'Date complète' : 'Full date'} value={SD.formatFull(ticket.date, lang)} />
            <Divider />
            <DetailRow label={lang === 'fr' ? 'Lieu' : 'Venue'} value={ticket.venue} />
            {ticket.seat && <><Divider /><DetailRow label={lang === 'fr' ? 'Siège' : 'Seat'} value={ticket.seat} /></>}
            {ticket.gate && <><Divider /><DetailRow label={lang === 'fr' ? 'Porte' : 'Gate'} value={ticket.gate} /></>}
            <Divider />
            <DetailRow label="Réf." value={ticket.reference} mono />
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ActionBtn icon="Sun">{lang === 'fr' ? 'Luminosité max' : 'Max brightness'}</ActionBtn>
            <ActionBtn icon="Share">{lang === 'fr' ? 'Partager' : 'Share'}</ActionBtn>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoChip({ label, value }) {
  return (
    <div>
      <div style={{ ...F.semi, fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 3 }}>{label}</div>
      <div style={{ ...F.title, fontSize: 15, color: 'var(--text-1)' }}>{value}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }} />;
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={{ padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <span style={{ ...F.body, fontSize: 13, color: 'var(--text-2)', flexShrink: 0 }}>{label}</span>
      <span style={{ ...(mono ? F.mono5 : F.semi), fontSize: mono ? 12 : 13, color: 'var(--text-1)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function ActionBtn({ icon, children }) {
  return (
    <button style={{
      padding: '12px', borderRadius: 12, border: '1.5px solid var(--border)',
      background: 'var(--bg-card)', ...F.medium, fontSize: 13, color: 'var(--text-1)',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7
    }}>
      {React.createElement(Icon[icon], { s: 15, c: 'currentColor' })}
      {children}
    </button>
  );
}

// ════════════════════════════════════════════════════
// ADD TICKET — 5-step
// ════════════════════════════════════════════════════
function AddSheet({ open, onClose, onAdd, lang = 'fr' }) {
  const { TYPE_META, inferType } = SD;
  const [step, setStep] = useS(1);
  const [type, setType] = useS('flight');
  const [title, setTitle] = useS('');
  const [subtitle, setSubtitle] = useS('');
  const [date, setDate] = useS('');
  const [time, setTime] = useS('20:00');
  const [venue, setVenue] = useS('');
  const [seat, setSeat] = useS('');
  const [gate, setGate] = useS('');
  const [reference, setReference] = useS('');
  const [scanning, setScanning] = useS(false);

  useE(() => {
    if (open) {
      setStep(1); setTitle(''); setSubtitle(''); setVenue(''); setSeat(''); setGate(''); setReference('');
      const d = new Date(Date.now() + 7 * 86400000);
      setDate(d.toISOString().slice(0, 10));
      setTime('20:00');
    }
  }, [open]);

  useE(() => { const t = inferType(title); if (t) setType(t); }, [title]);

  const preview = {
    id: '_p', type, title: title || (lang === 'fr' ? 'Nom de l\'événement' : 'Event name'),
    subtitle: subtitle || 'Subtitle', isUsed: false,
    date: date || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    time, venue: venue || 'Lieu', seat, gate,
    reference: reference || 'REF-0000', addedAt: ''
  };

  const canNext = () => step === 2 ? title.length > 0 : step === 3 ? date.length > 0 : true;

  const next = () => { if (step < 5) setStep(s => s + 1); };
  const back = () => { if (step > 1) setStep(s => s - 1); };
  const confirm = () => onAdd({ ...preview, id: 't' + Math.random().toString(36).slice(2, 9), reference: reference || 'VLT-' + Math.random().toString(36).slice(2, 8).toUpperCase() });

  const L = {
    fr: { next: 'Suivant', confirm: 'Ajouter à Sésame', type: 'Type de billet', event: 'Nom de l\'événement', sub: 'Sous-titre (optionnel)', details: 'Informations complémentaires', preview: 'Aperçu', venue: 'Lieu', seat: 'Siège (optionnel)', gate: 'Porte (optionnel)', ref: 'Référence (optionnel)' },
    en: { next: 'Next', confirm: 'Add to Sésame', type: 'Ticket type', event: 'Event name', sub: 'Subtitle (optional)', details: 'Additional details', preview: 'Preview', venue: 'Venue', seat: 'Seat (optional)', gate: 'Gate (optional)', ref: 'Reference (optional)' }
  }[lang];

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,25,22,0.28)', zIndex: 70, animation: 'fadeIn 200ms ease' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--bg)',
        borderTopLeftRadius: 26, borderTopRightRadius: 26,
        zIndex: 80, maxHeight: '91%',
        display: 'flex', flexDirection: 'column',
        animation: 'sheetIn 300ms cubic-bezier(0.22,1,0.36,1)',
        boxShadow: '0 -4px 40px rgba(0,0,0,0.1)'
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 22px 8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {step > 1 && (
              <button onClick={back} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', color: 'var(--text-2)' }}>
                <Icon.ChevL s={20} c="currentColor" />
              </button>
            )}
            <h2 style={{ ...F.title, fontSize: 18, color: 'var(--text-1)' }}>
              {lang === 'fr' ? 'Nouveau billet' : 'New ticket'}
            </h2>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-subtle)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.X s={15} c="var(--text-2)" />
          </button>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 10, flexShrink: 0 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 5, borderRadius: 3, background: i <= step ? 'var(--text-1)' : 'var(--border)', transition: 'all 200ms ease' }} />
          ))}
        </div>

        {/* Step content */}
        <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 22px', minHeight: 0 }}>
          {step === 1 && (
            <div style={{ animation: 'fadeUp .2s ease' }}>
              <p style={{ ...F.medium, fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>{L.type}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginBottom: 16 }}>
                {Object.entries(TYPE_META).map(([k, m]) => {
                  const active = type === k;
                  return (
                    <button key={k} onClick={() => setType(k)} style={{
                      padding: '13px 8px', borderRadius: 14,
                      border: `1.5px solid ${active ? 'var(--text-1)' : 'var(--border)'}`,
                      background: active ? m.bg : 'var(--bg-card)',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      transition: 'all 150ms ease'
                    }}>
                      {typeIcon(k, 19, active ? m.color : 'var(--text-3)')}
                      <span style={{ ...F[active ? 'semi' : 'body'], fontSize: 11, color: active ? 'var(--text-1)' : 'var(--text-2)' }}>
                        {lang === 'fr' ? m.labelFr : m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* Scanner button */}
              <div style={{ marginTop: 8 }}>
                <input
                  type="file"
                  accept="image/*"
                  id="scan-file"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setScanning(true);
                    try {
                      const reader = new FileReader();
                      reader.onload = async (evt) => {
                        const base64 = evt.target.result;
                        const prompt = `Analyze this ${lang === 'fr' ? TYPE_META[type].labelFr : TYPE_META[type].label} ticket image and extract:
- Event/destination title
- Subtitle (company, artist, flight number)
- Date (YYYY-MM-DD format)
- Time (HH:MM format)
- Venue/location
- Seat number (if visible)
- Gate/door (if visible)
- Reference/booking number

Return ONLY valid JSON: {"title":"...","subtitle":"...","date":"YYYY-MM-DD","time":"HH:MM","venue":"...","seat":"...","gate":"...","reference":"..."}
If a field is not found, use empty string.`;

                        try {
                          const result = await window.claude.complete({
                            messages: [
                              {
                                role: 'user',
                                content: [
                                  { type: 'image', source: { type: 'base64', media_type: file.type, data: base64.split(',')[1] } },
                                  { type: 'text', text: prompt }
                                ]
                              }
                            ]
                          });
                          const data = JSON.parse(result.replace(/```json\n?|\n?```/g, '').trim());
                          if (data.title) setTitle(data.title);
                          if (data.subtitle) setSubtitle(data.subtitle);
                          if (data.date) setDate(data.date);
                          if (data.time) setTime(data.time);
                          if (data.venue) setVenue(data.venue);
                          if (data.seat) setSeat(data.seat);
                          if (data.gate) setGate(data.gate);
                          if (data.reference) setReference(data.reference);
                          setStep(5); // Jump to preview
                        } catch (err) {
                          console.error('Scan error:', err);
                          alert(lang === 'fr' ? 'Erreur lors de l\'analyse. Réessayez ou saisissez manuellement.' : 'Scan error. Try again or enter manually.');
                        }
                      };
                      reader.readAsDataURL(file);
                    } finally {
                      setScanning(false);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => document.getElementById('scan-file').click()}
                  disabled={scanning}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 12,
                    border: '1.5px solid var(--border)',
                    background: scanning ? 'var(--bg-subtle)' : 'var(--bg-card)',
                    color: scanning ? 'var(--text-3)' : 'var(--text-1)',
                    ...F.semi, fontSize: 14, cursor: scanning ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 150ms ease'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  {scanning
                    ? (lang === 'fr' ? 'Analyse en cours…' : 'Scanning…')
                    : (lang === 'fr' ? 'Scanner mon billet' : 'Scan my ticket')}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: 'fadeUp .2s ease' }}>
              <FG label={L.event}><SF value={title} onChange={setTitle} placeholder={lang === 'fr' ? 'ex. Paris → Tokyo' : 'e.g. Paris → Tokyo'} large autoFocus /></FG>
              <FG label={L.sub}><SF value={subtitle} onChange={setSubtitle} placeholder={lang === 'fr' ? 'Compagnie, artiste…' : 'Company, artist…'} /></FG>
              {title && <div style={{ marginTop: 14 }}><CardCompact ticket={preview} lang={lang} /></div>}
            </div>
          )}

          {step === 3 && (
            <div style={{ animation: 'fadeUp .2s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 10 }}>
                <FG label={lang === 'fr' ? 'Date' : 'Date'}><SF type="date" value={date} onChange={setDate} /></FG>
                <FG label={lang === 'fr' ? 'Heure' : 'Time'}><SF type="time" value={time} onChange={setTime} /></FG>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ animation: 'fadeUp .2s ease' }}>
              <FG label={L.venue}><SF value={venue} onChange={setVenue} placeholder={lang === 'fr' ? 'Salle, gare, stade…' : 'Venue, station…'} /></FG>
              <FG label={L.seat}><SF value={seat} onChange={setSeat} placeholder={lang === 'fr' ? 'Rang, place…' : 'Row, seat…'} /></FG>
              {type === 'flight' && <FG label={L.gate}><SF value={gate} onChange={setGate} placeholder="ex. K42" /></FG>}
              <FG label={L.ref}><SF value={reference} onChange={setReference} placeholder={lang === 'fr' ? 'Laissez vide pour auto' : 'Auto if empty'} mono /></FG>
            </div>
          )}

          {step === 5 && (
            <div style={{ animation: 'fadeUp .2s ease' }}>
              <p style={{ ...F.medium, fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>{L.preview}</p>
              <CardLarge ticket={preview} lang={lang} />
            </div>
          )}
          <div style={{ height: 20 }} />
        </div>

        {/* CTA */}
        <div style={{ padding: '10px 22px 26px', flexShrink: 0, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={step === 5 ? confirm : next}
            disabled={!canNext()}
            style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: canNext() ? 'var(--text-1)' : 'var(--bg-subtle)',
              color: canNext() ? '#fff' : 'var(--text-3)',
              ...F.semi, fontSize: 15, cursor: canNext() ? 'pointer' : 'not-allowed',
              transition: 'all 150ms ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            {step === 5 ? <><Icon.Check s={15} c="currentColor" />{L.confirm}</> : <>{L.next}<Icon.ChevR s={15} c="currentColor" /></>}
          </button>
        </div>
      </div>
    </>
  );
}

function FG({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ ...F.semi, fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function SF({ value, onChange, placeholder, type = 'text', large, mono, autoFocus }) {
  return (
    <input
      type={type} value={value} placeholder={placeholder} autoFocus={autoFocus}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: large ? '14px' : '11px 13px',
        borderRadius: 11, border: '1.5px solid var(--border)',
        background: 'var(--bg-card)',
        ...(mono ? F.mono : large ? F.title : F.body),
        fontSize: large ? 17 : 14, color: 'var(--text-1)', colorScheme: 'light',
        transition: 'border-color 150ms'
      }}
      onFocus={e => e.currentTarget.style.borderColor = 'var(--text-1)'}
      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
    />
  );
}

// ════════════════════════════════════════════════════
// LIBRARY
// ════════════════════════════════════════════════════
function LibraryScreen({ tickets, onOpen, tweaks }) {
  const { lang } = tweaks;
  const { TYPE_META } = SD;
  const [showPast, setShowPast] = useS(false);

  const groups = useM(() => {
    const rel = tickets.filter(t => SD.isPast(t) === showPast);
    const g = {};
    rel.forEach(t => { g[t.type] = g[t.type] || []; g[t.type].push(t); });
    return Object.entries(g).sort((a, b) => b[1].length - a[1].length);
  }, [tickets, showPast]);

  return (
    <div style={{ position: 'absolute', inset: '0 0 80px 0', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, paddingTop: 52, padding: '52px 24px 0' }}>
        <div style={{ ...F.semi, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 3 }}>
          {lang === 'fr' ? 'BIBLIOTHÈQUE' : 'LIBRARY'}
        </div>
        <h1 style={{ ...F.title, fontSize: 26, color: 'var(--text-1)', letterSpacing: '-.025em', marginBottom: 14 }}>
          {showPast ? (lang === 'fr' ? 'Passés' : 'Past') : (lang === 'fr' ? 'À venir' : 'Upcoming')}
        </h1>

        {/* Toggle */}
        <div style={{ display: 'flex', padding: 3, background: 'var(--bg-subtle)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 6 }}>
          {[false, true].map(v => (
            <button key={String(v)} onClick={() => setShowPast(v)} style={{
              flex: 1, padding: '8px 0', border: 'none', borderRadius: 8,
              background: showPast === v ? 'var(--bg-card)' : 'transparent',
              color: showPast === v ? 'var(--text-1)' : 'var(--text-2)',
              ...F[showPast === v ? 'semi' : 'body'], fontSize: 13,
              cursor: 'pointer', transition: 'all 150ms',
              boxShadow: showPast === v ? '0 1px 4px rgba(0,0,0,0.07)' : 'none'
            }}>
              {v ? (lang === 'fr' ? 'Passés' : 'Past') : (lang === 'fr' ? 'À venir' : 'Upcoming')}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '10px 24px 24px' }}>
        {groups.length === 0 && (
          <p style={{ padding: '40px 0', textAlign: 'center', ...F.body, fontSize: 14, color: 'var(--text-3)' }}>
            {lang === 'fr' ? 'Aucun billet' : 'No tickets'}
          </p>
        )}
        {groups.map(([type, list], gi) => {
          const m = TYPE_META[type];
          return (
            <div key={type} style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {typeIcon(type, 15, m.color)}
                </div>
                <span style={{ ...F.semi, fontSize: 14, color: 'var(--text-1)' }}>{lang === 'fr' ? m.labelFr : m.label}</span>
                <span style={{ marginLeft: 'auto', ...F.mono, fontSize: 11, color: 'var(--text-3)' }}>{String(list.length).padStart(2, '0')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map(t => <CardCompact key={t.id} ticket={t} onClick={() => onOpen(t)} lang={lang} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, TicketDetail, AddSheet, LibraryScreen });
