import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface SignUpFlowInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export function SignUpFlowInput({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  style,
  ...props
}: SignUpFlowInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TextInput
        style={[styles.input, error && styles.inputError, inputStyle, style]}
        placeholderTextColor={Colors.light.icon}
        {...props}
      />

      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: Colors.light.white,
    color: Colors.light.text,
  },
  inputError: {
    borderColor: Colors.light.errorText,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.errorText,
    marginTop: 4,
  },
});
