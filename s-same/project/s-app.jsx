// ── Root app ─────────────────────────────────────────
const { useState: useApp, useEffect: useAppE } = React;

function App() {
  const [tickets, setTickets] = useApp(() =>
    window.SD.TICKETS.map(t => ({
      ...t,
      isUsed: t.isUsed || window.SD.isPast(t)
    }))
  );
  const [tab, setTab] = useApp('home');
  const [openTicket, setOpenTicket] = useApp(null);
  const [addOpen, setAddOpen] = useApp(false);
  const [tweaks, setTweaks] = useApp(() => ({...window.__S.tweaks}));

  useAppE(() => {
    window.__S.subs.push(setTweaks);
    return () => { window.__S.subs = window.__S.subs.filter(f => f !== setTweaks); };
  }, []);

  const handleAdd = (t) => {
    setTickets(prev => [t, ...prev]);
    setAddOpen(false);
    setTab('home');
  };

  return (
    <>
      {tab === 'home' && (
        <HomeScreen tickets={tickets} onOpen={setOpenTicket} onAdd={() => setAddOpen(true)} tweaks={tweaks} />
      )}
      {tab === 'library' && (
        <LibraryScreen tickets={tickets} onOpen={setOpenTicket} tweaks={tweaks} />
      )}

      <TabBar tab={tab} setTab={setTab} onAdd={() => setAddOpen(true)} />

      {openTicket && (
        <TicketDetail ticket={openTicket} onClose={() => setOpenTicket(null)} lang={tweaks.lang} />
      )}

      <AddSheet open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} lang={tweaks.lang} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
