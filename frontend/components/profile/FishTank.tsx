import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export function FishTank() {
  return (
    <View style={styles.container}>
      <View style={styles.tank}>
        <View style={styles.water}>
        </View>
        <View style={styles.base} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  tank: {
    width: 268,
    height: 190,
    backgroundColor: "#D9D9D9",
  },
  water: {
    height: 170,
    backgroundColor: Colors.light.fishTankWater,
    position: 'relative',
  },
  base: {
    height: 20,
    backgroundColor: Colors.light.fishTankBase
  },
});