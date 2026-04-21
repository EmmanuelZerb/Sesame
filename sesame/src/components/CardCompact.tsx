import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Ticket } from '@/types';
import { getTypeMeta } from '@/data/typeMeta';
import { FontFamily, Spacing, Radius, Colors } from '@/theme';
import { formatDay, formatMonth, urgencyBadge, isPast } from '@/utils/dateHelpers';
import { Badge } from '@/components/Badge';
import { TypeIcon } from '@/components/TypeIcon';

interface CardCompactProps {
  ticket: Ticket;
  onPress: () => void;
  lang?: 'fr' | 'en';
}

export function CardCompact({ ticket, onPress, lang = 'fr' }: CardCompactProps) {
  const m = getTypeMeta(ticket.type);
  const badge = urgencyBadge(ticket.date, ticket.isUsed);
  const past = isPast(ticket);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.99 }] },
        { opacity: past ? 0.5 : 1 },
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: m.bg }]}>
        <TypeIcon type={ticket.type} size={19} color={m.color} />
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={[FontFamily.semi, { fontSize: 14, color: Colors.text1 }]} numberOfLines={1}>
          {ticket.title}
        </Text>
        <View style={styles.subRow}>
          <Text style={[FontFamily.semi, { fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', color: m.color }]}>
            {lang === 'fr' ? m.labelFr : m.label}
          </Text>
          <Text style={{ fontSize: 11, color: Colors.text3 }}>{'\u00b7'}</Text>
          <Text style={[FontFamily.body, { fontSize: 12, color: Colors.text2 }]} numberOfLines={1}>
            {ticket.subtitle}
          </Text>
        </View>
      </View>

      {/* Date + badge */}
      <View style={styles.rightBlock}>
        <View style={styles.dateBox}>
          <Text style={[FontFamily.title, { fontSize: 17, color: Colors.text1, lineHeight: 17 }]}>
            {formatDay(ticket.date)}
          </Text>
          <Text style={[FontFamily.semi, { fontSize: 9, letterSpacing: 0.8, color: Colors.text2, textTransform: 'uppercase' }]}>
            {formatMonth(ticket.date, lang)}
          </Text>
        </View>
        {badge ? <Badge text={badge.text} color={badge.color} bg={badge.bg} /> : <View style={{ height: 18 }} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: 13,
    paddingVertical: 14,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightBlock: {
    alignItems: 'flex-end',
    gap: 5,
  },
  dateBox: {
    alignItems: 'center',
  },
});
