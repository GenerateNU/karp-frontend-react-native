import React, { PropsWithChildren } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

export function ScreenBackground({ children }: PropsWithChildren) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/background-tall.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
