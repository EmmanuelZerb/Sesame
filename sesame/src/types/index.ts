export type TicketType =
  | 'flight'
  | 'concert'
  | 'train'
  | 'sport'
  | 'theater'
  | 'other';

export interface Ticket {
  id: string;
  type: TicketType;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  seat: string;
  gate: string;
  reference: string;
  isUsed: boolean;
  addedAt: string;
  attachedFile?: {
    type: string;
    base64: string;
    name: string;
  } | null;
}

export interface TypeMeta {
  label: string;
  labelFr: string;
  bg: string;
  color: string;
}

export interface UrgencyBadge {
  text: string;
  color: string;
  bg: string;
} | null;
