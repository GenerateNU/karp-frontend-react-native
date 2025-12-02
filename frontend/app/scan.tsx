import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { QRScanner, QRScannerType } from '@/components/QRScanner';

export default function CheckInScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();

  // Default to 'check-in' if no type is provided
  const scannerType: QRScannerType =
    type === 'checkout' ? 'checkout' : 'check-in';

  return <QRScanner type={scannerType} />;
}
