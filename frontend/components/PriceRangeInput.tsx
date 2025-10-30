import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface PriceRangeInputProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

const STEP = 10;
const MIN_PRICE = 0;
const MAX_PRICE = 100;

export default function PriceRangeInput({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: PriceRangeInputProps) {
  const incrementMin = () => {
    const newValue = Math.min(minValue + STEP, maxValue - STEP);
    if (newValue <= MAX_PRICE) {
      onMinChange(newValue);
    }
  };

  const decrementMin = () => {
    const newValue = Math.max(minValue - STEP, MIN_PRICE);
    onMinChange(newValue);
  };

  const incrementMax = () => {
    const newValue = Math.min(maxValue + STEP, MAX_PRICE);
    onMaxChange(newValue);
  };

  const decrementMax = () => {
    const newValue = Math.max(maxValue - STEP, minValue + STEP);
    if (newValue >= MIN_PRICE) {
      onMaxChange(newValue);
    }
  };

  return (
    <View style={styles.container}>
      {/* Min Value Control */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Min</Text>
        <View style={styles.controlBox}>
          <Pressable
            style={styles.button}
            onPress={decrementMin}
            disabled={minValue <= MIN_PRICE}
          >
            <Text
              style={[
                styles.buttonText,
                minValue <= MIN_PRICE && styles.buttonDisabled,
              ]}
            >
              −
            </Text>
          </Pressable>

          <View style={styles.valueBox}>
            <Text style={styles.valueText}>${minValue}</Text>
          </View>

          <Pressable
            style={styles.button}
            onPress={incrementMin}
            disabled={minValue >= maxValue - STEP}
          >
            <Text
              style={[
                styles.buttonText,
                minValue >= maxValue - STEP && styles.buttonDisabled,
              ]}
            >
              +
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Separator */}
      <Text style={styles.separator}>to</Text>

      {/* Max Value Control */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Max</Text>
        <View style={styles.controlBox}>
          <Pressable
            style={styles.button}
            onPress={decrementMax}
            disabled={maxValue <= minValue + STEP}
          >
            <Text
              style={[
                styles.buttonText,
                maxValue <= minValue + STEP && styles.buttonDisabled,
              ]}
            >
              −
            </Text>
          </Pressable>

          <View style={styles.valueBox}>
            <Text style={styles.valueText}>
              ${maxValue}
              {maxValue === MAX_PRICE ? '+' : ''}
            </Text>
          </View>

          <Pressable
            style={styles.button}
            onPress={incrementMax}
            disabled={maxValue >= MAX_PRICE}
          >
            <Text
              style={[
                styles.buttonText,
                maxValue >= MAX_PRICE && styles.buttonDisabled,
              ]}
            >
              +
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  inputGroup: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  controlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  buttonDisabled: {
    color: '#9CA3AF',
    opacity: 0.5,
  },
  valueBox: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  separator: {
    fontSize: 20,
    color: '#9CA3AF',
    marginHorizontal: 4,
  },
});
