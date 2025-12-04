import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/Fonts';
import { Image } from 'expo-image';
import { imageService } from '@/services/imageService';
import { Colors } from '@/constants/Colors';
import { vendorService } from '@/services/vendorService';
import { Ionicons } from '@expo/vector-icons';

export interface CarouselItemProps {
  id: string;
  name: string;
  coins: number;
  index: number;
  count: number;
  imageS3Key?: string;
  vendorId?: string;
  onPress: (id: string) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  id,
  name,
  coins,
  index,
  count,
  imageS3Key,
  vendorId,
  onPress,
}) => {
  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(
    null
  );
  const [vendorName, setVendorName] = useState<string>('Unknown');

  useEffect(() => {
    async function fetchImageUrl() {
      try {
        const url = await imageService.getImageUrl('item', id);
        setImagePreSignedUrl(url);
      } catch (err) {
        console.error('Failed to fetch image:', err);
      }
    }

    if (imageS3Key) {
      console.log('Fetching image for item ID:', id);
      fetchImageUrl();
    }
  }, [id, imageS3Key]);

  useEffect(() => {
    async function fetchVendor() {
      if (!vendorId) return;
      try {
        const vendor = await vendorService.getVendorById(vendorId);
        if (vendor) {
          setVendorName(vendor.name);
        }
      } catch {
        // ignore
      }
    }
    fetchVendor();
  }, [vendorId]);

  return (
    <TouchableOpacity
      key={id}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          marginLeft: index === 0 ? 8 : 0,
          marginRight: index === count - 1 ? 8 : 16,
        },
      ]}
    >
      <View style={styles.card}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          {imagePreSignedUrl ? (
            <Image
              source={{ uri: imagePreSignedUrl }}
              style={styles.image}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]} />
          )}

          {/* Koins Badge */}
          <View style={styles.koinsBadge}>
            <Image
              source={require('@/assets/images/karp-coin.svg')}
              style={styles.coinIcon}
              contentFit="contain"
            />
            <Text style={styles.koinsText}>{coins} Koins</Text>
          </View>
        </View>

        {/* Bottom Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.itemName} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.vendorRow}>
            <Ionicons
              name="storefront-outline"
              size={14}
              color="#2D2D2D"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.vendorName} numberOfLines={1}>
              {vendorName}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container for spacing
  },
  card: {
    width: 240,
    height: 240,
    borderRadius: 20,
    backgroundColor: '#2D2D2D',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.primaryText,
  },
  imageSection: {
    width: '100%',
    height: 180,
    backgroundColor: '#ffffff',
    position: 'relative',
    padding: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderColor: '#FFFFFF',
  },
  placeholderImage: {
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  koinsBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE082', // Light yellow
    borderWidth: 1,
    borderColor: '#FFC107', // Darker yellow border
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  coinIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  koinsText: {
    fontFamily: Fonts.bold_700,
    fontSize: 12,
    color: '#2D2D2D',
  },
  navButton: {
    position: 'absolute',
    right: 12,
    top: 70, // Positioned in the middle of the image section
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB74D', // Light orange/yellow
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  infoSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  itemName: {
    fontFamily: Fonts.bold_700,
    fontSize: 18,
    color: '#2D2D2D',
    marginBottom: 4,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorName: {
    fontFamily: Fonts.regular_400,
    fontSize: 12,
    color: '#2D2D2D',
  },
});

export default CarouselItem;
