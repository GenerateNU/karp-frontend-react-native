import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { checkIn } from '@/services/registrationService';

const { width, height } = Dimensions.get('window');

export default function CheckInScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (permission?.granted) {
      setShowCamera(true);
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      // Parse QR code data - expecting JSON format with event_id and qr_token
      let eventId: string;
      let qrToken: string;

      try {
        const parsed = JSON.parse(data);
        eventId = parsed.event_id || parsed.eventId;
        qrToken = parsed.qr_token || parsed.qrToken;
      } catch {
        // If not JSON, try to extract from URL or other formats
        // For now, assume the data itself might be structured differently
        // You may need to adjust this based on your QR code format
        throw new Error(
          'Invalid QR code format. Expected JSON with event_id and qr_token.'
        );
      }

      if (!eventId || !qrToken) {
        throw new Error('QR code missing required data: event_id and qr_token');
      }

      await checkIn(eventId, qrToken);

      Alert.alert('Success', 'Check-in successful!', [
        {
          text: 'OK',
          onPress: () => {
            setScanned(false);
            setIsProcessing(false);
            router.back();
          },
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Check-in failed';
      Alert.alert('Check-in Failed', message, [
        {
          text: 'Try Again',
          onPress: () => {
            setScanned(false);
            setIsProcessing(false);
          },
        },
      ]);
    }
  };

  const handleRequestPermission = async () => {
    const { granted } = await requestPermission();
    if (granted) {
      setShowCamera(true);
    } else {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access to scan QR codes.',
        [{ text: 'OK' }]
      );
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

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        {/* Background Image */}
        <Image
          source={require('../assets/backgrounds/check-in.svg')}
          style={styles.backgroundImage}
          contentFit="cover"
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Check-in</Text>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.instructionText}>
              Camera permission is required to scan QR codes
            </Text>
            <Pressable
              style={styles.cameraButton}
              onPress={handleRequestPermission}
            >
              <Text style={styles.cameraButtonText}>Enable Camera</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!showCamera) {
    return (
      <View style={styles.container}>
        {/* Background Image */}
        <Image
          source={require('../assets/backgrounds/check-in.svg')}
          style={styles.backgroundImage}
          contentFit="cover"
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Check-in</Text>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.instructionText}>Scan QR code to Check In</Text>
            <Pressable
              style={styles.cameraButton}
              onPress={() => setShowCamera(true)}
            >
              <Text style={styles.cameraButtonText}>Open camera</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                setShowCamera(false);
                setScanned(false);
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>

          <View style={styles.scannerContainer}>
            <Text style={styles.scannerTitle}>Scan QR code</Text>
            <View style={styles.scannerFrame}>
              <View style={styles.scannerCorner} />
              <View style={[styles.scannerCorner, styles.topRight]} />
              <View style={[styles.scannerCorner, styles.bottomLeft]} />
              <View style={[styles.scannerCorner, styles.bottomRight]} />
            </View>
            {isProcessing && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
    padding: 20,
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
  },
  instructionText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
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
  camera: {
    flex: 1,
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scannerTitle: {
    fontFamily: Fonts.bold_700,
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
  },
  scannerCorner: {
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
  topRight: {
    top: -2,
    right: -2,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: -2,
    top: 'auto',
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
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
