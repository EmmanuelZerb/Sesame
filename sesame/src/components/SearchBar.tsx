import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import { Colors, FontFamily, Spacing, Radius } from '@/theme';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginLeft: 13, marginRight: 9 }}>
        <Circle cx="11" cy="11" r="7" stroke={Colors.text3} strokeWidth={1.7} />
        <Path d="m21 21-4.3-4.3" stroke={Colors.text3} strokeWidth={1.7} strokeLinecap="round" />
      </Svg>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.text3}
        style={styles.input}
      />
      {value ? (
        <Pressable onPress={() => onChange('')} hitSlop={8}>
          <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" style={{ marginRight: 13 }}>
            <Path d="M18 6 6 18M6 6l12 12" stroke={Colors.text2} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </Pressable>
      ) : (
        <View style={{ width: 15 + 13 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSubtle,
    borderRadius: Radius.sm,
    height: 42,
  },
  input: {
    flex: 1,
    ...FontFamily.body,
    fontSize: 14,
    color: Colors.text1,
    paddingVertical: 0,
    height: 42,
  },
});
