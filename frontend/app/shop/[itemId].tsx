import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useItemDetail } from '@/hooks/useItemDetail';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ItemDetailLayout } from '@/components/shop/ItemDetailLayout';
import { imageService } from '@/services/imageService';
import { vendorService } from '@/services/vendorService';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export default function ItemDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  const {
    item,
    userCoins,
    hasOrdered,
    orderStatus,
    loading,
    orderLoading,
    placeOrder,
  } = useItemDetail(itemId);

  const hasEnoughCoins = userCoins >= (item?.price ?? 30);

  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(
    null
  );
  const [vendorName, setVendorName] = useState<string>('Store');

  useEffect(() => {
    async function fetchImageAndVendor() {
      if (!item) return;

      try {
        if (item.imageS3Key) {
          const url = await imageService.getImageUrl('item', item.id);
          setImagePreSignedUrl(url);
        }

        if (item.vendorId) {
          const vendor = await vendorService.getVendorById(item.vendorId);
          if (vendor) {
            setVendorName(vendor.name);
          }
        }
      } catch {
        // Failed to fetch image or vendor
      }
    }

    fetchImageAndVendor();
  }, [item]);

  if (loading) {
    return <LoadingScreen text="Loading item details..." />;
  }

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <ItemDetailLayout
      imageUrl={imagePreSignedUrl}
      itemName={item.name}
      itemPrice={item.price}
      vendorName={vendorName}
      description={item.description || ''}
      instructionsText="Go to store and show them this page to redeem item!"
      buttonConfig={
        hasOrdered
          ? {
              text: 'CLAIM',
              onPress: () => {},
              variant: 'redeemed',
            }
          : {
              text: `${item.price} coins`,
              onPress: placeOrder,
              loading: orderLoading,
              disabled: !hasEnoughCoins,
            }
      }
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.eggshellWhite,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.errorText,
    fontFamily: Fonts.regular_400,
  },
});
