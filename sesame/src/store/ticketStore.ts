import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Ticket } from '@/types';
import { MOCK_TICKETS } from '@/data/mockTickets';

const STORAGE_KEY = '@sesame_tickets';

export const TicketStore = {
  async getAll(): Promise<Ticket[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Ticket[];
    } catch {
      // corrupted data — reset to mock
    }
    return [...MOCK_TICKETS];
  },

  async save(tickets: Ticket[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  },

  async add(ticket: Ticket): Promise<Ticket[]> {
    const all = await this.getAll();
    const updated = [ticket, ...all];
    await this.save(updated);
    return updated;
  },

  async update(id: string, patch: Partial<Ticket>): Promise<Ticket[]> {
    const all = await this.getAll();
    const updated = all.map((t) =>
      t.id === id ? { ...t, ...patch } : t,
    );
    await this.save(updated);
    return updated;
  },

  async delete(id: string): Promise<Ticket[]> {
    const all = await this.getAll();
    const updated = all.filter((t) => t.id !== id);
    await this.save(updated);
    return updated;
  },

  async getById(id: string): Promise<Ticket | null> {
    const all = await this.getAll();
    return all.find((t) => t.id === id) ?? null;
  },
};
