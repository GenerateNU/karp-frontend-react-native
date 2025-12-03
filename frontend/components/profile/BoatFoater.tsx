import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const FOOTER_HEIGHT = 100;
export { FOOTER_HEIGHT };

export function BoatFooter() {
  let tabBarHeight = 0;

  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (e) {
    tabBarHeight = 0;
  }

  const bottomOffset = tabBarHeight - 250;

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      <Image
        source={require('@/assets/images/boat-footer.png')}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: -50,
    height: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  image: {
    width: 500,
    height: 500,
  },
});
