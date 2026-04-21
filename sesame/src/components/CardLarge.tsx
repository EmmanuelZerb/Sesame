import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import type { Ticket } from '@/types';
import { getTypeMeta } from '@/data/typeMeta';
import { FontFamily, Spacing, Radius, cardShadow, Colors } from '@/theme';
import { formatDay, formatMonth, urgencyBadge, isPast } from '@/utils/dateHelpers';
import { Badge } from '@/components/Badge';
import { TypeIcon } from '@/components/TypeIcon';

interface CardLargeProps {
  ticket: Ticket;
  onPress: () => void;
  lang?: 'fr' | 'en';
}

export function CardLarge({ ticket, onPress, lang = 'fr' }: CardLargeProps) {
  const m = getTypeMeta(ticket.type);
  const badge = urgencyBadge(ticket.date, ticket.isUsed);
  const past = isPast(ticket);
  const venueShort = ticket.venue.split('\u00b7')[0].trim();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: m.bg, opacity: past ? 0.55 : 1 },
        pressed && { transform: [{ scale: 0.97 }] },
        cardShadow(past),
      ]}
    >
      {/* Type row + date box */}
      <View style={styles.topRow}>
        <View style={styles.typeRow}>
          <TypeIcon type={ticket.type} size={16} color={m.color} />
          <Text style={[FontFamily.semi, styles.typeLabel, { color: m.color }]}>
            {lang === 'fr' ? m.labelFr : m.label}
          </Text>
        </View>
        <View style={styles.dateBox}>
          <Text style={[FontFamily.title, { fontSize: 20, color: Colors.text1, lineHeight: 20 }]}>
            {formatDay(ticket.date)}
          </Text>
          <Text style={[FontFamily.semi, { fontSize: 9, letterSpacing: 1, color: Colors.text2, textTransform: 'uppercase', marginTop: 1 }]}>
            {formatMonth(ticket.date, lang)}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={[FontFamily.title, { fontSize: 20, color: Colors.text1, lineHeight: 23, marginBottom: 3 }]}>
        {ticket.title}
      </Text>
      <Text style={[FontFamily.medium, { fontSize: 12, color: m.color, marginBottom: 16 }]}>
        {ticket.subtitle}
      </Text>

      {/* Dashed divider */}
      <View style={[styles.dash, { borderColor: Colors.border }]} />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={{ fontSize: 11 }}>{'\u23F0'}</Text>
          <Text style={[FontFamily.medium, { fontSize: 12, color: Colors.text2 }]}>{ticket.time}</Text>
          <Text style={{ fontSize: 11, color: Colors.text3 }}>{'\u00b7'}</Text>
          <Text style={[FontFamily.medium, { fontSize: 12, color: Colors.text2 }]} numberOfLines={1}>{venueShort}</Text>
        </View>
        {badge ? <Badge text={badge.text} color={badge.color} bg={badge.bg} /> : <View />}
      </View>
    </Pressable>
  );
}

const CARD_WIDTH = 272;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: Radius.card,
    padding: 18,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  dateBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  dash: {
    height: 1,
    marginHorizontal: -18,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    gap: 6,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
});
