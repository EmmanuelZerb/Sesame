// ── Data layer ─────────────────────────────────

const TYPE_META = {
  flight:  { label: 'Flight',  labelFr: 'Vol',      icon: '✈', bg: 'var(--flight)',  color: 'var(--flight-text)' },
  concert: { label: 'Concert', labelFr: 'Concert',  icon: '♪', bg: 'var(--concert)', color: 'var(--concert-text)' },
  train:   { label: 'Train',   labelFr: 'Train',    icon: '⇄', bg: 'var(--train)',   color: 'var(--train-text)' },
  sport:   { label: 'Sport',   labelFr: 'Sport',    icon: '◉', bg: 'var(--sport)',   color: 'var(--sport-text)' },
  theater: { label: 'Theater', labelFr: 'Théâtre',  icon: '◈', bg: 'var(--theater)', color: 'var(--theater-text)' },
  other:   { label: 'Other',   labelFr: 'Autre',    icon: '◇', bg: 'var(--other)',   color: 'var(--other-text)' },
};

// Demo tickets — dates relative to April 2026
const TICKETS = [
  {
    id: '1', type: 'flight',
    title: 'Paris → New York', subtitle: 'AF 447 · Business',
    date: '2026-05-15', time: '10:45',
    venue: 'CDG Terminal 2E', seat: '3A', gate: 'K42',
    reference: 'XKPL29', isUsed: false, addedAt: '2026-03-10'
  },
  {
    id: '2', type: 'concert',
    title: 'Bicep — Live A/V', subtitle: 'Accor Arena',
    date: '2026-05-03', time: '21:00',
    venue: 'Accor Arena · Paris', seat: 'Fosse', gate: '',
    reference: 'TM-889234', isUsed: false, addedAt: '2026-03-22'
  },
  {
    id: '3', type: 'train',
    title: 'Paris → Lyon', subtitle: 'TGV Inoui 6621 · 1ère',
    date: '2026-04-28', time: '07:52',
    venue: 'Gare de Lyon', seat: 'Voiture 4 · 12A', gate: '',
    reference: 'SNCF-4421PL', isUsed: false, addedAt: '2026-03-15'
  },
  {
    id: '4', type: 'sport',
    title: 'PSG — Inter Milan', subtitle: 'UEFA Champions League',
    date: '2026-04-10', time: '21:00',
    venue: 'Parc des Princes · Paris', seat: 'Tribune Boulogne · K12', gate: '',
    reference: 'UEFA-8821X', isUsed: true, addedAt: '2026-02-28'
  },
  {
    id: '5', type: 'concert',
    title: 'Halcyon Festival · J2', subtitle: 'Plaine de jeux — Vincennes',
    date: '2026-06-21', time: '14:00',
    venue: 'Bois de Vincennes', seat: 'Général', gate: '',
    reference: 'HALC-DAY2-VIP', isUsed: false, addedAt: '2026-03-01'
  }
];

// ── Date helpers ────────────────────────────────
function parseDateStr(dateStr) {
  // parse YYYY-MM-DD without timezone shift
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDay(dateStr) {
  const d = parseDateStr(dateStr);
  return String(d.getDate()).padStart(2, '0');
}
function formatMonth(dateStr, lang='fr') {
  const d = parseDateStr(dateStr);
  return d.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' }).toUpperCase().replace('.','');
}
function formatFull(dateStr, lang='fr') {
  const d = parseDateStr(dateStr);
  return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

function urgencyBadge(dateStr, isUsed) {
  if (isUsed) return { text: 'USED', color: '#8A8780', bg: '#F2F1EE' };
  const today = new Date(); today.setHours(0,0,0,0);
  const d = parseDateStr(dateStr);
  const diff = Math.round((d - today) / 86400000);
  if (diff < 0) return { text: 'PASSED', color: '#B8B5AF', bg: '#F2F1EE' };
  if (diff === 0) return { text: 'TODAY', color: '#C0392B', bg: '#FDECEA' };
  if (diff === 1) return { text: 'TOMORROW', color: '#C0392B', bg: '#FDECEA' };
  if (diff <= 6) return { text: `IN ${diff}D`, color: '#7C5000', bg: '#FFF3E0' };
  return null;
}

function isPast(ticket) {
  const today = new Date(); today.setHours(0,0,0,0);
  return ticket.isUsed || parseDateStr(ticket.date) < today;
}

// Smart type detection from title
function inferType(title) {
  const t = title.toLowerCase();
  if (/→|->|flight|vol |cdg|lhr|jfk|nrt|dxb|\d{3}/.test(t)) return 'flight';
  if (/tgv|ter|inoui|sncf|intercit|train|eurostar/.test(t)) return 'train';
  if (/festival|concert|live|tour|dj|set|music/.test(t)) return 'concert';
  if (/psg|om|ol|ucl|ligue|match|foot|rugby|tennis|sport/.test(t)) return 'sport';
  if (/théâtre|theater|opéra|ballet|pièce|comédie/.test(t)) return 'theater';
  return null;
}

// Deterministic QR from seed
function makeQR(seed, n=21) {
  let h = 2166136261 >>> 0;
  for (let i=0; i<seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const rnd = () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 0xffffffff; };
  const g = Array.from({length:n}, () => Array.from({length:n}, () => rnd() > 0.5 ? 1 : 0));
  const finder = (r, c) => {
    for (let y=0;y<7;y++) for (let x=0;x<7;x++) {
      const on = x===0||x===6||y===0||y===6||(x>=2&&x<=4&&y>=2&&y<=4);
      if (r+y<n && c+x<n) g[r+y][c+x] = on ? 1 : 0;
    }
  };
  finder(0,0); finder(0,n-7); finder(n-7,0);
  return g;
}

window.SD = { TYPE_META, TICKETS, formatDay, formatMonth, formatFull, urgencyBadge, isPast, inferType, makeQR, parseDateStr };
