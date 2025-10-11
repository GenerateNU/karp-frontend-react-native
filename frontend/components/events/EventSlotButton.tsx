import { Colors } from '@/constants/Colors';
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/Fonts';
interface EventSlotButtonProps {
  text: string;
  selected: boolean;
  type: 'date' | 'time';
  onPress: () => void;
}

export function EventSlotButton({
  text,
  type,
  selected,
  onPress,
}: EventSlotButtonProps) {
  const formattedText =
    type === 'date' ? text.split('-').slice(1, 3).join('/') : text.slice(0, 5);

  return (
    <Pressable
      style={[styles.button, selected && styles.selectedButton]}
      onPress={onPress}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {formattedText}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    width: 61.869,
    height: 19.592,
    padding: 1.031,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10.311,
    flexShrink: 0,
    borderRadius: 10.311,
    borderColor: Colors.light.text,
    borderWidth: 0.516,
  },
  selectedButton: {
    backgroundColor: Colors.light.selectedSlotBackground,
  },
  text: {
    fontFamily: Fonts.light_300,
    fontSize: 12,
    color: Colors.light.text,
  },
  selectedText: {
    color: Colors.light.selectedSlotText,
  },
});
