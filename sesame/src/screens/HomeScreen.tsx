import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { Ticket, TicketType } from '@/types';
import { TYPE_META } from '@/data/typeMeta';
import { Colors, FontFamily, Spacing } from '@/theme';
import { parseDateStr, isPast } from '@/utils/dateHelpers';
import { SearchBar } from '@/components/SearchBar';
import { Chip } from '@/components/Chip';
import { SectionHead } from '@/components/SectionHead';
import { CardLarge } from '@/components/CardLarge';
import { CardCompact } from '@/components/CardCompact';
import { EmptyState } from '@/components/EmptyState';
import { TabBar } from '@/components/TabBar';

interface HomeScreenProps {
  tickets: Ticket[];
  onOpen: (ticket: Ticket) => void;
  onAdd: () => void;
  lang?: 'fr' | 'en';
}

export function HomeScreen({ tickets, onOpen, onAdd, lang = 'fr' }: HomeScreenProps) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<TicketType | 'all'>('all');

  const filtered = useMemo(
    () =>
      tickets
        .filter((t) => filter === 'all' || t.type === filter)
        .filter((t) => {
          if (!q) return true;
          const s = q.toLowerCase();
          return (
            t.title.toLowerCase().includes(s) ||
            t.subtitle.toLowerCase().includes(s) ||
            t.venue.toLowerCase().includes(s)
          );
        }),
    [tickets, q, filter],
  );

  const upcoming = useMemo(
    () =>
      filtered
        .filter((t) => !isPast(t))
        .sort((a, b) => parseDateStr(a.date).getTime() - parseDateStr(b.date).getTime()),
    [filtered],
  );

  const allSorted = useMemo(() => {
    const fut = filtered
      .filter((t) => !isPast(t))
      .sort((a, b) => parseDateStr(a.date).getTime() - parseDateStr(b.date).getTime());
    const past = filtered
      .filter((t) => isPast(t))
      .sort((a, b) => parseDateStr(b.date).getTime() - parseDateStr(a.date).getTime());
    return [...fut, ...past];
  }, [filtered]);

  return (
    <View style={styles.root}>
      {/* Fixed header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[FontFamily.title, { fontSize: 28, color: Colors.text1, letterSpacing: -0.5 }]}>
            Sesame
          </Text>
          <Text style={[FontFamily.body, { fontSize: 13, color: Colors.text2 }]}>
            {tickets.length} {tickets.length === 1 ? 'pass' : 'passes'}
          </Text>
        </View>

        <View style={{ paddingHorizontal: Spacing.screen, paddingTop: Spacing.md }}>
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder={lang === 'fr' ? 'Rechercher billets, lieux\u2026' : 'Search tickets, venues\u2026'}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <Chip active={filter === 'all'} onPress={() => setFilter('all')}>
            {lang === 'fr' ? 'Tous' : 'All'}
          </Chip>
          {(Object.keys(TYPE_META) as TicketType[])
            .filter((k) => k !== 'other')
            .map((k) => (
              <Chip key={k} active={filter === k} onPress={() => setFilter(k)}>
                {lang === 'fr' ? TYPE_META[k].labelFr : TYPE_META[k].label}
              </Chip>
            ))}
        </ScrollView>
      </View>

      {/* Scrollable body */}
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {tickets.length === 0 ? (
          <EmptyState onAdd={onAdd} lang={lang} />
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <SectionHead
                  title={lang === 'fr' ? '\u00c0 venir' : 'Up next'}
                  count={upcoming.length}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={282}
                  decelerationRate="fast"
                  contentContainerStyle={styles.carousel}
                >
                  {upcoming.map((t) => (
                    <CardLarge
                      key={t.id}
                      ticket={t}
                      onPress={() => onOpen(t)}
                      lang={lang}
                    />
                  ))}
                </ScrollView>
              </>
            )}

            <SectionHead
              title={lang === 'fr' ? 'Tous les billets' : 'All tickets'}
              count={allSorted.length}
            />
            {allSorted.length === 0 && (
              <Text style={[FontFamily.body, { fontSize: 14, color: Colors.text3, textAlign: 'center', paddingVertical: 24 }]}>
                {lang === 'fr' ? `Aucun r\u00e9sultat pour "${q}"` : `No results for "${q}"`}
              </Text>
            )}
            <View style={styles.list}>
              {allSorted.map((t) => (
                <CardCompact
                  key={t.id}
                  ticket={t}
                  onPress={() => onOpen(t)}
                  lang={lang}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const CARD_WIDTH = 272;
const CARD_GAP = 10;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingTop: 52,
    backgroundColor: Colors.bg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
  },
  chipsRow: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 10,
    paddingBottom: 2,
    gap: 7,
  },
  body: {
    flex: 1,
  },
  carousel: {
    paddingLeft: Spacing.screen,
    paddingRight: 16,
    gap: CARD_GAP,
  },
  list: {
    gap: 8,
    paddingHorizontal: Spacing.screen,
  },
});
