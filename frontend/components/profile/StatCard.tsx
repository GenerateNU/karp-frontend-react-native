import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface StatCardProps {
  title: string;
  value: string;
  onPress?: () => void;
}

export function StatCard({ title, value, onPress }: StatCardProps) {
  const Component = onPress ? Pressable : View;

  return (
    <Component
      onPress={onPress}
      style={[styles.card, onPress && styles.pressable]}
    >
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '45%',
    height: 88,
    backgroundColor: Colors.light.eggshellWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  pressable: {
    opacity: 1,
  },
  value: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'left',
  },
});
