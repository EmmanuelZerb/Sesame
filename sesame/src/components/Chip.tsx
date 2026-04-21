import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily } from '@/theme';

interface ChipProps {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

export function Chip({ active, onPress, children }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: active ? Colors.text1 : Colors.border,
          backgroundColor: active ? Colors.text1 : Colors.bgCard,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={[
          active ? FontFamily.semi : FontFamily.medium,
          { fontSize: 12, color: active ? '#fff' : Colors.text2 },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1.5,
  },
});
