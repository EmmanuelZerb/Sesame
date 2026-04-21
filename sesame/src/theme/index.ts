import { Platform } from 'react-native';

export const Colors = {
  bg: '#FAFAF8',
  bgCard: '#FFFFFF',
  bgSubtle: '#F2F1EE',
  border: '#E8E6E1',
  text1: '#1A1916',
  text2: '#8A8780',
  text3: '#B8B5AF',

  flight:  { bg: '#D4E8F5', text: '#0B3D5C' },
  concert: { bg: '#EFE0F5', text: '#4A1D6E' },
  train:   { bg: '#D5EDE4', text: '#0D4A2E' },
  sport:   { bg: '#FDECD5', text: '#6B3000' },
  theater: { bg: '#FDF5D5', text: '#5C4500' },
  other:   { bg: '#E8E6E1', text: '#5D5A56' },
} as const;

export const FontFamily = {
  title:  Platform.select({ ios: 'PlusJakartaSans-Bold', android: 'PlusJakartaSans_Bold', default: 'PlusJakartaSans-Bold' }),
  semi:   Platform.select({ ios: 'PlusJakartaSans-SemiBold', android: 'PlusJakartaSans_SemiBold', default: 'PlusJakartaSans-SemiBold' }),
  medium: Platform.select({ ios: 'PlusJakartaSans-Medium', android: 'PlusJakartaSans_Medium', default: 'PlusJakartaSans-Medium' }),
  body:   Platform.select({ ios: 'PlusJakartaSans-Regular', android: 'PlusJakartaSans_Regular', default: 'PlusJakartaSans-Regular' }),
  mono:   Platform.select({ ios: 'IBMPlexMono-Regular', android: 'IBMPlexMono_Regular', default: 'IBMPlexMono-Regular' }),
  mono5:  Platform.select({ ios: 'IBMPlexMono-Medium', android: 'IBMPlexMono_Medium', default: 'IBMPlexMono-Medium' }),
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screen: 24,
} as const;

export const Radius = {
  card: 20,
  sm: 12,
  chip: 999,
  input: 11,
} as const;

export function cardShadow(past: boolean) {
  if (past) return {};
  return {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
      },
      android: {
        elevation: 3,
      },
    }),
  };
}
