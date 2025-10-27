import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

interface PriceRangeSliderProps {
  onRangeChange: (min: number, max: number) => void;
  initialMin?: number;
  initialMax?: number;
  width?: number;
}

const SLIDER_WIDTH = 345;
const KNOB_SIZE = 22;
const BAR_HEIGHT = 7;
const STEP = 10;
const MAX_PRICE = 100;

export default function PriceRangeSlider({
  onRangeChange,
  initialMin = 0,
  initialMax = MAX_PRICE,
  width = SLIDER_WIDTH,
}: PriceRangeSliderProps) {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  const convertToPosition = (value: number) => {
    return (value / MAX_PRICE) * (width - KNOB_SIZE);
  };

  const convertToValue = (position: number) => {
    const rawValue = (position / (width - KNOB_SIZE)) * MAX_PRICE;
    const snapped = Math.round(rawValue / STEP) * STEP;
    return Math.max(0, Math.min(snapped, MAX_PRICE));
  };

  // Use Reanimated shared values instead of Animated.Value
  const minPos = useSharedValue(convertToPosition(initialMin));
  const maxPos = useSharedValue(convertToPosition(initialMax));

  const updateMinValue = (newValue: number) => {
    setMinValue(newValue);
    onRangeChange(newValue, maxValue);
  };

  const updateMaxValue = (newValue: number) => {
    setMaxValue(newValue);
    onRangeChange(minValue, newValue);
  };

  // Gesture for min knob
  const minGesture = Gesture.Pan()
    .onUpdate(event => {
      let newPosition = event.x - KNOB_SIZE / 2;
      newPosition = Math.max(0, Math.min(newPosition, width - KNOB_SIZE));
      newPosition = Math.min(newPosition, maxPos.value - KNOB_SIZE);

      minPos.value = newPosition;
    })
    .onEnd(() => {
      const newValue = convertToValue(minPos.value);
      runOnJS(updateMinValue)(newValue);
    });

  // Gesture for max knob
  const maxGesture = Gesture.Pan()
    .onUpdate(event => {
      let newPosition = event.x - KNOB_SIZE / 2;
      newPosition = Math.max(0, Math.min(newPosition, width - KNOB_SIZE));
      newPosition = Math.max(newPosition, minPos.value + KNOB_SIZE);

      maxPos.value = newPosition;
    })
    .onEnd(() => {
      const newValue = convertToValue(maxPos.value);
      runOnJS(updateMaxValue)(newValue);
    });

  // Animated styles
  const minKnobStyle = useAnimatedStyle(() => ({
    left: minPos.value,
  }));

  const maxKnobStyle = useAnimatedStyle(() => ({
    left: maxPos.value,
  }));

  const activeBarStyle = useAnimatedStyle(() => ({
    left: minPos.value,
    width: maxPos.value - minPos.value,
  }));

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width }]}>
        {/* Background bar */}
        <View style={styles.bar} />

        {/* Active range bar */}
        <Animated.View style={[styles.activeBar, activeBarStyle]} />

        {/* Min knob */}
        <GestureDetector gesture={minGesture}>
          <Animated.View style={[styles.knob, minKnobStyle]} />
        </GestureDetector>

        {/* Max knob */}
        <GestureDetector gesture={maxGesture}>
          <Animated.View style={[styles.knob, maxKnobStyle]} />
        </GestureDetector>
      </View>

      {/* Display current range */}
      <View style={styles.labels}>
        <Text style={styles.label}>${minValue}</Text>
        <Text style={styles.label}>
          ${maxValue}
          {maxValue === MAX_PRICE ? '+' : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    height: KNOB_SIZE,
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    left: KNOB_SIZE / 2,
    right: KNOB_SIZE / 2,
    top: (KNOB_SIZE - BAR_HEIGHT) / 2,
    height: BAR_HEIGHT,
    backgroundColor: '#D9D9D9',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  activeBar: {
    position: 'absolute',
    top: (KNOB_SIZE - BAR_HEIGHT) / 2,
    height: BAR_HEIGHT,
    backgroundColor: '#9D9D9D',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  knob: {
    position: 'absolute',
    top: 0,
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'black',
    zIndex: 1,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
