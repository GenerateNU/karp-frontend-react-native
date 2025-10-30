import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Fonts } from '@/constants/Fonts';
import { Image } from 'expo-image';
import { imageService } from '@/services/imageService';

export interface CarouselItemProps {
  id: string;
  name: string;
  coins: number;
  index: number;
  count: number;
  imageS3Key?: string;
  onPress: (id: string) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  id,
  name,
  coins,
  index,
  count,
  imageS3Key,
  onPress,
}) => {
  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(
    null
  );

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

  return (
    <TouchableOpacity
      key={id}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
      style={{
        marginLeft: index === 0 ? 8 : 0,
        marginRight: index === count - 1 ? 8 : 16,
      }}
    >
      <ThemedView
        lightColor="#E5E5E5"
        darkColor="#E5E5E5"
        className="p2 rounded-xl shadow-md"
        style={{ width: 180, height: 160 }}
      >
        {/* Photo place holder*/}
        {imagePreSignedUrl ? (
          <Image
            source={{ uri: imagePreSignedUrl }}
            style={{ width: 180, height: 100, borderRadius: 8 }}
            contentFit="cover"
          />
        ) : (
          <ThemedView
            lightColor="#cccccc"
            darkColor="#444444"
            style={{ width: 180, height: 100, borderRadius: 8 }}
          />
        )}
        <ThemedText
          type="title"
          style={{
            textAlign: 'left',
            color: 'black',
            fontSize: 20,
            paddingLeft: 5,
            fontFamily: Fonts.regular_400,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </ThemedText>
        <ThemedView
          lightColor="#E5E5E5"
          darkColor="#E5E5E5"
          className="flex-row items-center justify-between"
          style={{ width: '100%' }}
        >
          <ThemedText
            type="subtitle"
            style={{
              color: 'black',
              textAlign: 'left',
              fontSize: 12,
              paddingLeft: 5,
              fontFamily: Fonts.regular_400,
            }}
          >
            Store
          </ThemedText>
          <ThemedText
            type="default"
            style={{
              color: 'black',
              textAlign: 'right',
              paddingRight: 5,
              fontFamily: Fonts.regular_400,
            }}
          >
            {coins} coins
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default CarouselItem;
