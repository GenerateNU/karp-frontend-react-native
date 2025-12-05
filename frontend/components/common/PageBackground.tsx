import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ImageBackground, ImageContentPosition } from 'expo-image';
import { Colors } from '@/constants/Colors';

type BackgroundType = 'fishes' | 'waves' | 'bubbles' | 'default' | string;

interface PageBackgroundProps {
  type?: BackgroundType;
  children: React.ReactNode;
  style?: ViewStyle;
  contentPosition?: ImageContentPosition;
}

const backgroundImages: Record<string, any> = {
  fishes: require('@/assets/images/fishes-bg.png'),
  waves: require('@/assets/images/waves-bg.png'),
  bubbles: require('@/assets/images/bubbles-bg.png'),
  default: null,
};

export function PageBackground({
  type = 'default',
  children,
  style,
  contentPosition = 'top center',
}: PageBackgroundProps) {
  const backgroundImage = backgroundImages[type];

  if (!backgroundImage) {
    return (
      <ImageBackground
        source={null}
        style={[styles.container, style]}
        contentFit="cover"
        contentPosition={contentPosition}
      >
        {children}
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.container, style]}
      contentFit="cover"
      contentPosition={contentPosition}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.light.eggshellWhite,
  },
});
