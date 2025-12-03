import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { QRScanner, QRScannerType } from '@/components/QRScanner';

export default function ScanScreen() {
  const { type, orderId } = useLocalSearchParams<{
    type?: string;
    orderId?: string;
  }>();

  // Determine scanner type
  let scannerType: QRScannerType = 'check-in';
  if (type === 'checkout') {
    scannerType = 'checkout';
  } else if (type === 'item') {
    scannerType = 'item';
  }

  return <QRScanner type={scannerType} orderId={orderId} />;
}
