// Main App — composition, routing, state
const { useState: useStateRoot, useEffect: useEffectRoot } = React;

function App() {
  const [tickets, setTickets] = useStateRoot(() => window.VAULT_DATA.DEMO_TICKETS.map(t => ({
    ...t,
    isUsed: t.isUsed || new Date(t.date).getTime() < Date.now()
  })));
  const [tab, setTab] = useStateRoot('home');
  const [openTicket, setOpenTicket] = useStateRoot(null);
  const [addOpen, setAddOpen] = useStateRoot(false);
  const [tweaks, setTweaks] = useStateRoot(window.__vault.tweaks);

  useEffectRoot(() => {
    return window.__vault.subscribe(setTweaks);
  }, []);

  const handleAdd = (t) => {
    setTickets(prev => [...prev, t]);
    setAddOpen(false);
    setTab('home');
  };

  return (
    <>
      {tab === 'home' && (
        <HomeScreen
          tickets={tickets}
          onOpen={setOpenTicket}
          onAdd={() => setAddOpen(true)}
          tweaks={tweaks}
        />
      )}
      {tab === 'categories' && (
        <CategoriesScreen tickets={tickets} onOpen={setOpenTicket} tweaks={tweaks} />
      )}

      <TabBar tab={tab} setTab={setTab} onAdd={() => setAddOpen(true)} />

      {openTicket && (
        <TicketDetail
          ticket={openTicket}
          onBack={() => setOpenTicket(null)}
        />
      )}

      <AddTicketSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
        tweaks={tweaks}
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
