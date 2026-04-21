import type { TicketType, TypeMeta } from '@/types';

export const TYPE_META: Record<TicketType, TypeMeta> = {
  flight:  { label: 'Flight',  labelFr: 'Vol',     bg: '#D4E8F5', color: '#0B3D5C' },
  concert: { label: 'Concert', labelFr: 'Concert', bg: '#EFE0F5', color: '#4A1D6E' },
  train:   { label: 'Train',   labelFr: 'Train',   bg: '#D5EDE4', color: '#0D4A2E' },
  sport:   { label: 'Sport',   labelFr: 'Sport',   bg: '#FDECD5', color: '#6B3000' },
  theater: { label: 'Theater', labelFr: 'Theatre', bg: '#FDF5D5', color: '#5C4500' },
  other:   { label: 'Other',   labelFr: 'Autre',   bg: '#E8E6E1', color: '#5D5A56' },
};

export function getTypeMeta(type: TicketType): TypeMeta {
  return TYPE_META[type];
}
