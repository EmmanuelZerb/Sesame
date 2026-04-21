import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, Spacing } from '@/theme';

interface SectionHeadProps {
  title: string;
  count: number;
}

export function SectionHead({ title, count }: SectionHeadProps) {
  return (
    <View style={styles.row}>
      <Text style={[FontFamily.semi, { fontSize: 15, color: Colors.text1 }]}>
        {title}
      </Text>
      <Text style={[FontFamily.mono, { fontSize: 11, color: Colors.text3 }]}>
        {String(count).padStart(2, '0')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 20,
    paddingBottom: 10,
  },
});
