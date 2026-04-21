import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '@/theme';

interface QRCodeViewProps {
  value: string;
  size?: number;
}

export function QRCodeView({ value, size = 200 }: QRCodeViewProps) {
  return (
    <QRCode
      value={value}
      size={size}
      color={Colors.text1}
      backgroundColor="#FFFFFF"
      quietZone={2}
    />
  );
}
