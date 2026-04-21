import React from 'react';
import { Svg, Circle, Path, Rect } from 'react-native-svg';
import type { TicketType } from '@/types';

interface TypeIconProps {
  type: TicketType;
  size?: number;
  color?: string;
}

export function TypeIcon({ type, size = 20, color = 'currentColor' }: TypeIconProps) {
  const s = size;
  const sw = s * 0.085;

  switch (type) {
    case 'flight':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <Path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3-3-.5c-.3 0-.7.1-.9.4l-.4.5c-.3.4-.2 1 .2 1.3L6 19l1.5 2.5c.3.4.9.5 1.3.2l.5-.4c.3-.2.4-.6.4-.9L9 17l3-2 3.7 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'concert':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <Path d="M9 18V5l12-2v13" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth={sw} />
          <Circle cx="18" cy="16" r="3" stroke={color} strokeWidth={sw} />
        </Svg>
      );
    case 'train':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="3" width="16" height="16" rx="2" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M4 11h16" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Circle cx="8.5" cy="15" r="1" fill={color} />
          <Circle cx="15.5" cy="15" r="1" fill={color} />
          <Path d="M8 19l-2 3M16 19l2 3" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'sport':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={sw} />
          <Path d="M12 3v4m0 10v4M3 12h4m10 0h4" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'theater':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <Path d="M3 6c0 8 4 14 9 14s9-6 9-14c0-1-1-2-2-2H5c-1 0-2 1-2 2z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="9" cy="10" r="1" fill={color} />
          <Circle cx="15" cy="10" r="1" fill={color} />
          <Path d="M9 14c1 1 5 1 6 0" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    default:
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="1" fill={color} />
          <Circle cx="12" cy="5" r="1" fill={color} />
          <Circle cx="12" cy="19" r="1" fill={color} />
        </Svg>
      );
  }
}
