import type { UrgencyBadge, Ticket } from '@/types';

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDay(dateStr: string): string {
  return String(parseDateStr(dateStr).getDate()).padStart(2, '0');
}

export function formatMonth(dateStr: string, lang: 'fr' | 'en' = 'fr'): string {
  const d = parseDateStr(dateStr);
  return d
    .toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })
    .toUpperCase()
    .replace('.', '');
}

export function formatFull(
  dateStr: string,
  lang: 'fr' | 'en' = 'fr',
): string {
  const d = parseDateStr(dateStr);
  return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function urgencyBadge(
  dateStr: string,
  isUsed: boolean,
): UrgencyBadge {
  if (isUsed) return { text: 'USED', color: '#8A8780', bg: '#F2F1EE' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round(
    (parseDateStr(dateStr).getTime() - today.getTime()) / 86400000,
  );

  if (diff < 0) return { text: 'PASSED', color: '#B8B5AF', bg: '#F2F1EE' };
  if (diff === 0) return { text: 'TODAY', color: '#C0392B', bg: '#FDECEA' };
  if (diff === 1) return { text: 'TOMORROW', color: '#C0392B', bg: '#FDECEA' };
  if (diff <= 6) return { text: `IN ${diff}D`, color: '#7C5000', bg: '#FFF3E0' };
  return null;
}

export function isPast(ticket: Ticket): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return ticket.isUsed || parseDateStr(ticket.date) < today;
}

export function inferType(
  title: string,
): 'flight' | 'concert' | 'train' | 'sport' | 'theater' | null {
  const t = title.toLowerCase();
  if (/\u2192|->|flight|vol |cdg|lhr|jfk|nrt|dxb|\d{3}/.test(t)) return 'flight';
  if (/tgv|ter|inoui|sncf|intercit|train|eurostar/.test(t)) return 'train';
  if (/festival|concert|live|tour|dj|set|music/.test(t)) return 'concert';
  if (/psg|om|ol|ucl|ligue|match|foot|rugby|tennis|sport/.test(t)) return 'sport';
  if (/th\u00e9\u00e2tre|theater|op\u00e9ra|ballet|pi\u00e8ce|com\u00e9die/.test(t)) return 'theater';
  return null;
}
