import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ImageBackground } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { checkIn, checkOut } from '@/services/registrationService';
import { orderService } from '@/services/orderService';

export type QRScannerType = 'check-in' | 'checkout' | 'item';

interface QRScannerProps {
  type: QRScannerType;
  orderId?: string; // Required when type is 'item'
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function QRScanner({
  type,
  orderId,
  onSuccess,
  onCancel,
}: QRScannerProps) {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);

  const actionLabel =
    type === 'check-in'
      ? 'Check-in'
      : type === 'checkout'
        ? 'Check-out'
        : 'Scan Item';

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // Use ref to prevent multiple simultaneous scans (before state updates)
    if (isProcessingRef.current || scanned || isProcessing) return;

    // Immediately set ref to prevent any other scans
    isProcessingRef.current = true;
    setScanned(true);
    setIsProcessing(true);

    try {
      // Parse QR code data - expecting JSON format with event_id and qr_token
      let eventId: string = '';
      let qrToken: string = '';
      let parsed: any;

      try {
        // Try parsing the data directly first
        parsed = JSON.parse(data);

        // If the result is still a string, it's double-encoded - parse again
        if (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
          } catch (secondParseError) {
            console.warn(
              'Second JSON parse failed, using first parse result:',
              {
                firstParse: parsed,
                secondParseError,
              }
            );
          }
        }
      } catch (parseError) {
        console.error('QR code parsing error:', {
          data,
          parseError,
        });
        const expectedFormat =
          type === 'item'
            ? 'Expected JSON with item_id and qr_token.'
            : 'Expected JSON with event_id and qr_token.';
        throw new Error(`Invalid QR code format. ${expectedFormat}`);
      }

      // For item scanning, we need item_id and qr_token from QR code, plus orderId from props
      // For check-in/checkout, we need both event_id and qr_token
      if (type === 'item') {
        const itemIdFromQR = parsed.item_id || parsed.itemId || '';
        qrToken = parsed.qr_token || parsed.qrToken || '';

        if (
          !itemIdFromQR ||
          typeof itemIdFromQR !== 'string' ||
          itemIdFromQR.trim().length === 0
        ) {
          console.error('Invalid item_id:', { itemIdFromQR, parsed });
          throw new Error('QR code missing or invalid item_id');
        }

        if (
          !qrToken ||
          typeof qrToken !== 'string' ||
          qrToken.trim().length === 0
        ) {
          console.error('Invalid qr_token:', { qrToken, parsed });
          throw new Error('QR code missing or invalid qr_token');
        }

        // Store itemId for later use after expiration check
        eventId = itemIdFromQR; // Reuse eventId variable to store itemId for item scanning
      } else {
        eventId = parsed.event_id || parsed.eventId || '';
        qrToken = parsed.qr_token || parsed.qrToken || '';

        if (
          !eventId ||
          typeof eventId !== 'string' ||
          eventId.trim().length === 0
        ) {
          console.error('Invalid event_id:', { eventId, parsed });
          throw new Error('QR code missing or invalid event_id');
        }

        if (
          !qrToken ||
          typeof qrToken !== 'string' ||
          qrToken.trim().length === 0
        ) {
          console.error('Invalid qr_token:', { qrToken, parsed });
          throw new Error('QR code missing or invalid qr_token');
        }
      }

      // Optional: Check if QR code has expired
      if (parsed.expires_at) {
        const expiresAt = new Date(parsed.expires_at);
        const now = new Date();
        if (expiresAt < now) {
          throw new Error(
            'This QR code has expired. Please request a new one.'
          );
        }
      }

      // Call the appropriate function based on type
      if (type === 'check-in') {
        await checkIn(eventId, qrToken);
      } else if (type === 'checkout') {
        await checkOut(eventId, qrToken);
      } else if (type === 'item') {
        // For item scanning, eventId contains itemId from QR code
        if (!orderId) {
          throw new Error('Order ID is required for item scanning');
        }
        await orderService.scanOrder(orderId, eventId, qrToken);
      }

      // If item scan was successful, trigger a refresh of order data
      if (type === 'item') {
      }

      Alert.alert('Success', `${actionLabel} successful!`, [
        {
          text: 'OK',
          onPress: () => {
            isProcessingRef.current = false;
            setScanned(false);
            setIsProcessing(false);
            if (onSuccess) {
              onSuccess();
            } else {
              router.back();
            }
          },
        },
      ]);
    } catch (error) {
      console.error(`${actionLabel} error:`, error);
      const message =
        error instanceof Error ? error.message : `${actionLabel} failed`;
      Alert.alert(`${actionLabel} Failed`, message, [
        {
          text: 'Try Again',
          onPress: () => {
            isProcessingRef.current = false;
            setScanned(false);
            setIsProcessing(false);
          },
        },
      ]);
    }
  };

  const handleRequestPermission = async () => {
    const { granted } = await requestPermission();
    if (!granted) {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access to scan QR codes.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.text} />
        </View>
      </View>
    );
  }

  const backgroundImage =
    type === 'check-in'
      ? require('../assets/images/swimming-bg-checkin.png')
      : type === 'checkout'
        ? require('../assets/images/swimming-bg-checkout.png')
        : require('../assets/images/swimming-bg-checkin.png'); // We can make a item bg later

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      contentFit="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>{actionLabel}</Text>

        {/* Card with Camera */}
        <View style={styles.card}>
          {!permission.granted ? (
            <>
              <Text style={styles.instructionText}>
                Camera permission is required to scan QR codes
              </Text>
              <Pressable
                style={styles.cameraButton}
                onPress={handleRequestPermission}
              >
                <Text style={styles.cameraButtonText}>Enable Camera</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.cameraView}
                facing="back"
                onBarcodeScanned={
                  scanned || isProcessing ? undefined : handleBarCodeScanned
                }
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
              />
              <View style={styles.scannerOverlay}>
                <View style={styles.scannerFrame}>
                  <View style={styles.topLeftScannerCorner} />
                  <View style={styles.topRightScannerCorner} />
                  <View style={styles.bottomLeftScannerCorner} />
                  <View style={styles.bottomRightScannerCorner} />
                </View>
                {isProcessing && (
                  <View style={styles.processingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.processingText}>Processing...</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  backText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.text,
  },
  title: {
    fontFamily: Fonts.bold_700,
    fontSize: 48,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 30,
    borderRadius: 20,
    padding: 0,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  instructionText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
    padding: 20,
  },
  cameraButton: {
    backgroundColor: '#4AA9E8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cameraButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 18,
    color: '#fff',
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cameraView: {
    width: '100%',
    height: '100%',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrame: {
    width: 200,
    height: 200,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
  },
  topLeftScannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4AA9E8',
    borderWidth: 3,
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
  },
  topRightScannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4AA9E8',
    borderWidth: 3,
    top: -2,
    right: -2,
    left: 'auto',
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 20,
  },
  bottomLeftScannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4AA9E8',
    borderWidth: 3,
    bottom: -2,
    top: 'auto',
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 20,
  },
  bottomRightScannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4AA9E8',
    borderWidth: 3,
    bottom: -2,
    right: -2,
    top: 'auto',
    left: 'auto',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 20,
  },
  processingContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  processingText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
