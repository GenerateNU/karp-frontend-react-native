import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface SignUpFlowButtonProps {
  onPress: () => void;
  text: string;
  variant?: 'primary' | 'secondary' | 'fixed';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function SignUpFlowButton({
  onPress,
  text,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}: SignUpFlowButtonProps) {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button];

    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'fixed':
        baseStyle.push(styles.fixedButton);
        break;
    }

    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseTextStyle: TextStyle[] = [styles.buttonText];

    switch (variant) {
      case 'primary':
        baseTextStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseTextStyle.push(styles.secondaryText);
        break;
      case 'fixed':
        baseTextStyle.push(styles.fixedText);
        break;
    }

    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }

    if (textStyle) {
      baseTextStyle.push(textStyle);
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    width: '80%',
    height: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: Colors.light.fishBlue,
    marginTop: 8,
  },
  primaryText: {
    fontFamily: Fonts.bold_700_inter,
    color: Colors.light.text,
  },
  secondaryButton: {
    backgroundColor: Colors.light.transparent,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
  },
  secondaryText: {
    color: Colors.light.text,
  },
  fixedButton: {
    backgroundColor: Colors.light.fishBlue,
  },
  fixedText: {
    fontFamily: Fonts.bold_700_inter,
    color: Colors.light.text,
  },
  disabledButton: {
    backgroundColor: Colors.light.disabledButton,
    borderColor: Colors.light.disabledButton,
  },
  disabledText: {
    color: Colors.light.text,
    opacity: 0.6,
  },
});
