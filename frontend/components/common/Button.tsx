import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  buttonsStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  text,
  onPress,
  loading = false,
  disabled = false,
  buttonsStyle,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, buttonsStyle]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[styles.text, textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16.333,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.buttonBackground,
    width: 163.333,
    height: 49,
    flexShrink: 0,
  },
  text: {
    fontSize: 20,
    color: Colors.light.text,
    fontFamily: 'JosefinSans_400Regular',
    fontStyle: 'normal',
    fontWeight: '400',
    textAlign: 'center',
  },
});
