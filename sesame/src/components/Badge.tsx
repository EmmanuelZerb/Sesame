import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { FontFamily } from '@/theme';

interface BadgeProps {
  text: string;
  color: string;
  bg: string;
}

export function Badge({ text, color, bg }: BadgeProps) {
  return (
    <Text style={[styles.badge, { color, backgroundColor: bg }]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    fontFamily: FontFamily.mono5,
    fontSize: 9,
    letterSpacing: 0.72,
    textTransform: 'uppercase' as const,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
