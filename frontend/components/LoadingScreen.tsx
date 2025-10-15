import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

interface LoadingScreenProps {
  text?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  text = 'Loading...',
}) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.light.tint} />
      <ThemedText style={styles.loadingText}>{text}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
});
