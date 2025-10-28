import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MyFishModal } from './MyFishModal';


export function FishTank() {
  const [showFishModal, setShowFishModal] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={() => setShowFishModal(true)}>
          <Image
            source={require('@/assets/images/fish-tank.png')}
            style={styles.fishTankImage}
            contentFit="contain"
          />
        </Pressable>
      </View>

      <MyFishModal
        visible={showFishModal}
        onClose={() => setShowFishModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  fishTankImage: {
    width: 268,
    height: 190,
  },
});