import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Path, Rect } from 'react-native-svg';
import { Colors, FontFamily } from '@/theme';

interface TabBarProps {
  tab: 'home' | 'library';
  setTab: (tab: 'home' | 'library') => void;
  onAdd: () => void;
}

export function TabBar({ tab, setTab, onAdd }: TabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.bar}>
        <TabItem id="home" label="Sesame" active={tab === 'home'} onPress={() => setTab('home')} />
        <View style={styles.centerButton}>
          <Pressable
            onPress={onAdd}
            style={({ pressed }) => [
              styles.fab,
              pressed && { transform: [{ scale: 0.9 }] },
            ]}
            hitSlop={8}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
          </Pressable>
          <Text style={[FontFamily.body, { fontSize: 10, color: Colors.text3, marginTop: 2 }]}>
            Ajouter
          </Text>
        </View>
        <TabItem id="library" label="Archive" active={tab === 'library'} onPress={() => setTab('library')} />
      </View>
    </SafeAreaView>
  );
}

function TabItem({
  id,
  label,
  active,
  onPress,
}: {
  id: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
    >
      {id === 'home' ? (
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"
            stroke={active ? Colors.text1 : Colors.text3}
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
          <Rect x="2" y="4" width="20" height="5" rx="1" stroke={active ? Colors.text1 : Colors.text3} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" stroke={active ? Colors.text1 : Colors.text3} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M10 13h4" stroke={active ? Colors.text1 : Colors.text3} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}
      <Text
        style={[
          active ? FontFamily.semi : FontFamily.body,
          { fontSize: 10, color: active ? Colors.text1 : Colors.text3, marginTop: 3 },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'rgba(250,250,248,0.96)',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 8,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 2,
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  tabActive: {
    borderTopColor: Colors.text1,
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 0,
  },
  fab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.text1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});
