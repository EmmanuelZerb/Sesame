import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import type { Ticket, TicketType } from '@/types';
import { TYPE_META } from '@/data/typeMeta';
import { Colors, FontFamily, Spacing } from '@/theme';
import { isPast } from '@/utils/dateHelpers';
import { CardCompact } from '@/components/CardCompact';
import { TypeIcon } from '@/components/TypeIcon';
import { TabBar } from '@/components/TabBar';

interface LibraryScreenProps {
  tickets: Ticket[];
  onOpen: (ticket: Ticket) => void;
  lang?: 'fr' | 'en';
}

export function LibraryScreen({ tickets, onOpen, lang = 'fr' }: LibraryScreenProps) {
  const [showPast, setShowPast] = useState(false);

  const groups = useMemo(() => {
    const rel = tickets.filter((t) => isPast(t) === showPast);
    const g: Record<string, Ticket[]> = {};
    rel.forEach((t) => {
      if (!g[t.type]) g[t.type] = [];
      g[t.type].push(t);
    });
    return Object.entries(g).sort((a, b) => b[1].length - a[1].length) as [TicketType, Ticket[]][];
  }, [tickets, showPast]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={[FontFamily.semi, { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: Colors.text3 }]}>
          {lang === 'fr' ? 'BIBLIOTH\u00c8QUE' : 'LIBRARY'}
        </Text>
        <Text style={[FontFamily.title, { fontSize: 26, color: Colors.text1, letterSpacing: -0.5, marginBottom: 14 }]}>
          {showPast ? (lang === 'fr' ? 'Pass\u00e9s' : 'Past') : (lang === 'fr' ? '\u00c0 venir' : 'Upcoming')}
        </Text>

        {/* Toggle */}
        <View style={styles.toggle}>
          {([false, true] as const).map((v) => (
            <Pressable
              key={String(v)}
              onPress={() => setShowPast(v)}
              style={[
                styles.toggleBtn,
                showPast === v && styles.toggleBtnActive,
              ]}
            >
              <Text style={[
                showPast === v ? FontFamily.semi : FontFamily.body,
                { fontSize: 13, color: showPast === v ? Colors.text1 : Colors.text2 },
              ]}>
                {v ? (lang === 'fr' ? 'Pass\u00e9s' : 'Past') : (lang === 'fr' ? '\u00c0 venir' : 'Upcoming')}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {groups.length === 0 && (
          <Text style={[FontFamily.body, { fontSize: 14, color: Colors.text3, textAlign: 'center', paddingVertical: 40 }]}>
            {lang === 'fr' ? 'Aucun billet' : 'No tickets'}
          </Text>
        )}
        {groups.map(([type, list]) => {
          const m = TYPE_META[type];
          return (
            <View key={type} style={styles.group}>
              <View style={styles.groupHeader}>
                <View style={[styles.groupIcon, { backgroundColor: m.bg }]}>
                  <TypeIcon type={type} size={15} color={m.color} />
                </View>
                <Text style={[FontFamily.semi, { fontSize: 14, color: Colors.text1 }]}>
                  {lang === 'fr' ? m.labelFr : m.label}
                </Text>
                <Text style={[FontFamily.mono, { fontSize: 11, color: Colors.text3, marginLeft: 'auto' }]}>
                  {String(list.length).padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.groupList}>
                {list.map((t) => (
                  <CardCompact key={t.id} ticket={t} onPress={() => onOpen(t)} lang={lang} />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: Spacing.screen,
  },
  toggle: {
    flexDirection: 'row',
    padding: 3,
    backgroundColor: Colors.bgSubtle,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 6,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.bgCard,
  },
  body: {
    flex: 1,
  },
  group: {
    marginBottom: 22,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 9,
    paddingHorizontal: Spacing.screen,
  },
  groupIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupList: {
    gap: 8,
    paddingHorizontal: Spacing.screen,
  },
});
