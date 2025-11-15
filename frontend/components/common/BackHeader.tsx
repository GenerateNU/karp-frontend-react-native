import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

interface BackHeaderProps {
  onBack?: () => void;
  style?: ViewStyle;
}

export const BackHeader: React.FC<BackHeaderProps> = ({ onBack, style }) => {
  return (
    <View style={[styles.headerRow, style]}>
      <Pressable
        onPress={() => {
          if (onBack) onBack();
          else router.back();
        }}
        style={styles.backButtonContainer}
      >
        <Image
          source={require('@/assets/images/back-arrow.svg')}
          style={styles.backButtonIcon}
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 6,
    paddingLeft: 12,
  },
  backButtonContainer: {
    padding: 8,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
});
