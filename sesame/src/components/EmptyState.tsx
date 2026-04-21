import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Svg, Rect, Circle, Path } from 'react-native-svg';
import { FontFamily, Colors, Radius } from '@/theme';
import { TypeIcon } from './TypeIcon';

interface EmptyStateProps {
  onAdd: () => void;
  lang?: 'fr' | 'en';
}

export function EmptyState({ onAdd, lang = 'fr' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Svg width={110} height={90} viewBox="0 0 110 90" fill="none">
        <Rect x="12" y="22" width="86" height="50" rx="10" fill={Colors.bgSubtle} stroke={Colors.border} strokeWidth="1.5" strokeDasharray="5 4" />
        <Rect x="24" y="36" width="34" height="6" rx="3" fill={Colors.border} />
        <Rect x="24" y="48" width="22" height="4" rx="2" fill={Colors.border} opacity="0.6" />
        <Circle cx="80" cy="48" r="10" fill="none" stroke={Colors.border} strokeWidth="1.5" />
        <Path d="M77 48h6M80 45v6" stroke={Colors.border} strokeWidth="1.5" strokeLinecap="round" />
      </Svg>

      <View style={styles.textBlock}>
        <Text style={[FontFamily.title, { fontSize: 20, color: Colors.text1, marginBottom: 6 }]}>
          {lang === 'fr' ? 'Votre Sesame est vide' : 'Your Sesame is empty'}
        </Text>
        <Text style={[FontFamily.body, { fontSize: 13, color: Colors.text2, lineHeight: 20, maxWidth: 220 }]}>
          {lang === 'fr'
            ? 'Ajoutez vos billets \u2014 vols, concerts, trains. Tout au m\u00eame endroit.'
            : 'Add your tickets \u2014 flights, concerts, trains. All in one place.'}
        </Text>
      </View>

      <Pressable
        onPress={onAdd}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
      >
        <TypeIcon type="other" size={15} color="#fff" />
        <Text style={[FontFamily.semi, { fontSize: 13, color: '#fff', marginLeft: 7 }]}>
          {lang === 'fr' ? 'Ajouter un billet' : 'Add a ticket'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 56,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 18,
  },
  textBlock: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: Radius.input,
    backgroundColor: Colors.text1,
  },
});
