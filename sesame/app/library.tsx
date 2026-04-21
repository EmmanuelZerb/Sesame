import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import type { Ticket } from '@/types';
import { TicketStore } from '@/store/ticketStore';
import { LibraryScreen } from '@/screens/LibraryScreen';
import { TabBar } from '@/components/TabBar';
import { TicketDetailScreen } from '@/screens/TicketDetailScreen';
import { AddTicketScreen } from '@/screens/AddTicketScreen';

export default function LibraryTab() {
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

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAF8' }}>
      <LibraryScreen tickets={tickets} onOpen={handleOpen} />

      {modal === 'detail' && selectedTicket && (
        <TicketDetailScreen
          ticket={selectedTicket}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'add' && (
        <AddTicketScreen
          onClose={() => setModal(null)}
          onAdd={handleAdd}
        />
      )}

      {modal === null && (
        <TabBar
          tab="library"
          setTab={() => router.push('/')}
          onAdd={() => setModal('add')}
        />
      )}
    </View>
  );
}
