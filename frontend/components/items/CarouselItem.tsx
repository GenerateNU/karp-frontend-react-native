import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Fonts } from '@/constants/Fonts';
import { Image } from 'expo-image';

export interface CarouselItemProps {
  id: string;
  name: string;
  coins: number;
  index: number;
  count: number;
  onPress: (id: string) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  id,
  name,
  coins,
  index,
  count,
  onPress,
}) => (
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
      <Image
        source={{
          uri: 'https://tse1.mm.bing.net/th/id/OIP.OwbQJoh6_P_Jr7aaidhehAHaHa?cb=12&pid=Api&ucfimg=1',
        }}
        style={{ width: 180, height: 100, borderRadius: 8 }}
        contentFit="cover"
      />
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

export default CarouselItem;
