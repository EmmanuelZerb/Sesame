import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import type { Ticket } from '@/types';
import { TicketStore } from '@/store/ticketStore';
import { HomeScreen } from '@/screens/HomeScreen';
import { TabBar } from '@/components/TabBar';

export default function HomeTab() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [modal, setModal] = useState<'detail' | 'add' | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    TicketStore.getAll().then(setTickets);
  }, []);

  const handleOpen = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModal('detail');
  }, []);

  const handleAdd = useCallback(async (ticket: Ticket) => {
    const updated = await TicketStore.add(ticket);
    setTickets(updated);
    setModal(null);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const updated = await TicketStore.delete(id);
    setTickets(updated);
    setModal(null);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAF8' }}>
      <HomeScreen
        tickets={tickets}
        onOpen={handleOpen}
        onAdd={() => setModal('add')}
      />

      {modal === 'detail' && selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setModal(null)}
          onDelete={handleDelete}
        />
      )}

      {modal === 'add' && (
        <AddTicketModal
          onClose={() => setModal(null)}
          onAdd={handleAdd}
        />
      )}

      {modal === null && (
        <TabBar
          tab="home"
          setTab={() => router.push('/library')}
          onAdd={() => setModal('add')}
        />
      )}
    </View>
  );
}

/* Inline modal wrappers to avoid circular imports with screens */

import { TicketDetailScreen } from '@/screens/TicketDetailScreen';
import { AddTicketScreen } from '@/screens/AddTicketScreen';

function TicketDetailModal({ ticket, onClose, onDelete }: {
  ticket: Ticket;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  return <TicketDetailScreen ticket={ticket} onClose={onClose} />;
}

function AddTicketModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (ticket: Ticket) => void;
}) {
  return <AddTicketScreen onClose={onClose} onAdd={onAdd} />;
}
