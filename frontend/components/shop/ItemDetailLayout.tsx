import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/components/common/BackHeader';
import { PageBackground } from '@/components/common/PageBackground';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface ItemDetailLayoutProps {
  imageUrl: string | null;
  itemName: string;
  itemPrice: number;
  vendorName: string;
  description: string;
  instructionsText?: string;
  orderId?: string; // Only provided from order/[orderId].tsx to show scan button
  buttonConfig: {
    text: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'order' | 'redeemed';
  };
}

export function ItemDetailLayout({
  imageUrl,
  itemName,
  itemPrice,
  vendorName,
  description,
  instructionsText = 'Go to store and show them this page to redeem item!',
  orderId,
  buttonConfig,
}: ItemDetailLayoutProps) {
  const router = useRouter();
  // Only show scan button when orderId is provided (from order/[orderId].tsx) AND variant is redeemed
  const showScanButton = buttonConfig?.variant === 'redeemed' && !!orderId;

  const handleScanPress = () => {
    if (orderId) {
      router.push(`/scan?type=item&orderId=${orderId}`);
    }
  };
  return (
    <PageBackground type="fishes" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <BackHeader />
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.itemImagePlaceholder}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}

          <View style={styles.titleRow}>
            <Text style={styles.itemTitle}>{itemName}</Text>
            <TouchableOpacity style={styles.shareButton}>
              <Image
                source={require('@/assets/images/share.png')}
                style={styles.shareIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Image
              source={require('@/assets/images/karp-coin.svg')}
              style={styles.coinIcon}
              contentFit="contain"
            />
            <Text style={styles.priceText}>{itemPrice} Koins</Text>
          </View>

          <Text style={styles.vendorName}>{vendorName}</Text>

          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Description:</Text>
            <Text style={styles.descriptionText}>
              {description ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac eros sed eros tincidunt pulvinar sed ac sem.'}
            </Text>
          </View>

          <Text style={styles.instructionsText}>{instructionsText}</Text>

          {buttonConfig && (
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                  buttonConfig.variant === 'redeemed' && styles.redeemedButton,
                  buttonConfig.disabled && styles.buttonDisabled,
                ]}
                onPress={buttonConfig.onPress}
                disabled={buttonConfig.disabled || buttonConfig.loading}
              >
                {buttonConfig.loading ? (
                  <ActivityIndicator color={Colors.light.white} />
                ) : (
                  <Text
                    style={[
                      styles.buttonText,
                      buttonConfig.variant === 'redeemed' &&
                        styles.redeemedButtonText,
                    ]}
                  >
                    {buttonConfig.text}
                  </Text>
                )}
              </TouchableOpacity>
              {showScanButton && (
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={handleScanPress}
                >
                  <Text style={styles.scanButtonText}>Scan QR Code</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </PageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    backgroundColor: Colors.light.transparent,
  },
  itemImage: {
    width: '100%',
    aspectRatio: 370 / 206,
    backgroundColor: Colors.light.formInputBackground,
  },
  itemImagePlaceholder: {
    width: '100%',
    aspectRatio: 370 / 206,
    backgroundColor: Colors.light.formInputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: Fonts.light_300,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
  },
  itemTitle: {
    fontFamily: Fonts.regular_400,
    fontSize: 32,
    color: Colors.light.primaryText,
    flex: 1,
  },
  shareButton: {
    padding: 8,
  },
  shareIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.light.primaryText,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
    gap: 8,
  },
  coinIcon: {
    width: 24,
    height: 24,
  },
  priceText: {
    fontFamily: Fonts.regular_400,
    fontSize: 18,
    color: Colors.light.primaryText,
  },
  vendorName: {
    fontFamily: Fonts.regular_400,
    fontSize: 20,
    color: Colors.light.primaryText,
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  descriptionSection: {
    paddingTop: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontFamily: Fonts.regular_400,
    fontSize: 18,
    color: Colors.light.primaryText,
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  instructionsText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.primaryText,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    backgroundColor: Colors.light.orderButton,
    borderRadius: 12,
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: Colors.light.disabledButton,
  },
  buttonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  redeemedButton: {
    backgroundColor: Colors.light.orderStatusPending,
  },
  redeemedButtonText: {
    color: Colors.light.white,
  },
  scanButton: {
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 14,
    backgroundColor: Colors.light.text,
    borderRadius: 12,
    minWidth: 200,
    marginTop: 12,
  },
  scanButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
