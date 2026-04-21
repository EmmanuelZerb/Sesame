// Ticket data + gradient schema + demo seed

const TYPE_META = {
  flight:  { label: 'Flight',   icon: 'Plane',  gradient: ['#1a6fc4', '#06b6d4'], glow: 'rgba(6,182,212,0.45)' },
  concert: { label: 'Concert',  icon: 'Music',  gradient: ['#7c3aed', '#ec4899'], glow: 'rgba(236,72,153,0.45)' },
  train:   { label: 'Train',    icon: 'Train',  gradient: ['#059669', '#0d9488'], glow: 'rgba(13,148,136,0.45)' },
  sport:   { label: 'Sport',    icon: 'Ball',   gradient: ['#ea580c', '#dc2626'], glow: 'rgba(220,38,38,0.45)' },
  theater: { label: 'Theater',  icon: 'Mask',   gradient: ['#d97706', '#b45309'], glow: 'rgba(217,119,6,0.45)' },
  other:   { label: 'Other',    icon: 'Grid',   gradient: ['#64748b', '#334155'], glow: 'rgba(100,116,139,0.35)' },
};

// Demo seed — dates relative to "now" so the app always has upcoming/past mix
const now = Date.now();
const D = (days, h=20, m=0) => {
  const d = new Date(now + days * 86400000);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const DEMO_TICKETS = [
  {
    id: 't1',
    type: 'concert',
    title: 'Midnight Oscillations',
    subtitle: 'Obscura Live Tour',
    date: D(12, 20, 30),
    time: '20:30',
    venue: 'Halle Klingenthal · Berlin',
    seat: 'Floor · GA · Ring 2',
    gate: '',
    reference: 'CNC-8847-291K',
    isUsed: false,
    addedAt: D(-20)
  },
  {
    id: 't2',
    type: 'flight',
    title: 'CDG → HND',
    subtitle: 'Aurora Airlines · AR 218',
    date: D(3, 11, 45),
    time: '11:45',
    venue: 'Charles de Gaulle, Terminal 2E',
    seat: '14A · Window',
    gate: 'Gate K62',
    reference: 'AR218-PNR-9XK4TZ',
    isUsed: false,
    addedAt: D(-10)
  },
  {
    id: 't3',
    type: 'sport',
    title: 'Ravens vs Ironside FC',
    subtitle: 'Continental League · Semi-final',
    date: D(28, 19, 0),
    time: '19:00',
    venue: 'Stade Lumière · Lyon',
    seat: 'Tribune Est · Row 14 · Seat 22',
    gate: 'Porte B · Block 118',
    reference: 'RAV-IRN-SF-4411',
    isUsed: false,
    addedAt: D(-5)
  },
  {
    id: 't4',
    type: 'train',
    title: 'Paris → Zürich',
    subtitle: 'Lyria 9217 · 1st Class',
    date: D(7, 8, 12),
    time: '08:12',
    venue: 'Gare de Lyon · Hall 2',
    seat: 'Coach 12 · Seat 43',
    gate: '',
    reference: 'LYR-9217-042',
    isUsed: false,
    addedAt: D(-15)
  },
  {
    id: 't5',
    type: 'concert',
    title: 'Halcyon Festival — Day 2',
    subtitle: 'Weekend Pass',
    date: D(-6, 14, 0),
    time: '14:00',
    venue: 'Parc des Expositions · Marseille',
    seat: 'General Admission',
    gate: 'West Entry',
    reference: 'HAL26-WE-551',
    isUsed: true,
    addedAt: D(-60)
  },
  {
    id: 't6',
    type: 'theater',
    title: 'The Seagull',
    subtitle: 'By Anton Chekhov · New Stage',
    date: D(45, 19, 30),
    time: '19:30',
    venue: 'Théâtre du Rivage · Bordeaux',
    seat: 'Orchestra · Row C · Seat 9',
    gate: '',
    reference: 'SGL-R2-C09',
    isUsed: false,
    addedAt: D(-2)
  }
];

// Pseudo-random deterministic QR pattern from reference string
function generateQRPattern(seed, size=25) {
  // Simple hash
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = (h ^ seed.charCodeAt(i)) * 16777619;
    h = h >>> 0;
  }
  // PRNG
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 0xFFFFFFFF;
  };
  const grid = [];
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      row.push(rand() > 0.52 ? 1 : 0);
    }
    grid.push(row);
  }
  // Stamp position markers (top-left, top-right, bottom-left)
  const stampFinder = (ox, oy) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const on = (x===0||x===6||y===0||y===6) || (x>=2 && x<=4 && y>=2 && y<=4);
      grid[oy+y][ox+x] = on ? 1 : 0;
    }
  };
  stampFinder(0, 0);
  stampFinder(size-7, 0);
  stampFinder(0, size-7);
  return grid;
}

// Date formatting
function formatDate(iso) {
  const d = new Date(iso);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const weekday = d.toLocaleString('en-US', { weekday: 'short' });
  return { month, day, weekday, full: `${weekday}, ${month} ${day}` };
}

function daysUntil(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.round((d - now) / 86400000);
  return diff;
}

function relativeLabel(iso) {
  const d = daysUntil(iso);
  if (d < 0) return `${Math.abs(d)}d ago`;
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  if (d < 7) return `In ${d} days`;
  if (d < 30) return `In ${Math.round(d/7)}w`;
  return `In ${Math.round(d/30)}mo`;
}

function greeting(style, name) {
  if (style === 'short') return `Hey, ${name}`;
  if (style === 'vault') return `Welcome back, ${name}`;
  const h = new Date().getHours();
  if (h < 5) return `Late night, ${name}`;
  if (h < 12) return `Good morning, ${name}`;
  if (h < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

window.VAULT_DATA = { TYPE_META, DEMO_TICKETS, generateQRPattern, formatDate, daysUntil, relativeLabel, greeting };
