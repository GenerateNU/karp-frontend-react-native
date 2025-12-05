import React, { useCallback } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

interface RangeSliderProps {
  minValue: number;
  maxValue: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange: (min: number, max: number) => void;
  step?: number;
}

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

export default function RangeSlider({
  minValue,
  maxValue,
  minimumValue,
  maximumValue,
  onValueChange,
  step = 1,
}: RangeSliderProps) {
  const sliderWidth = useSharedValue(0);
  const range = maximumValue - minimumValue;

  // Convert values to positions (0 to sliderWidth)
  const minPosition = useSharedValue(0);
  const maxPosition = useSharedValue(0);

  // Track starting positions for gestures
  const minStartX = useSharedValue(0);
  const maxStartX = useSharedValue(100);

  const updatePositions = useCallback(() => {
    if (sliderWidth.value > 0) {
      minPosition.value =
        ((minValue - minimumValue) / range) * sliderWidth.value;
      maxPosition.value =
        ((maxValue - minimumValue) / range) * sliderWidth.value;
    }
  }, [minValue, maxValue, minimumValue, maximumValue, range]);

  // Update positions when props change
  React.useEffect(() => {
    updatePositions();
  }, [minValue, maxValue, updatePositions]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    sliderWidth.value = width;
    updatePositions();
  };

  const updateValues = useCallback(
    (minPos: number, maxPos: number, width: number) => {
      if (width === 0) return;
      const newMin = Math.round((minPos / width) * range + minimumValue);
      const newMax = Math.round((maxPos / width) * range + minimumValue);

      const clampedMin = Math.max(
        minimumValue,
        Math.min(newMin, newMax - step)
      );
      const clampedMax = Math.min(
        maximumValue,
        Math.max(newMax, newMin + step)
      );

      onValueChange(clampedMin, clampedMax);
    },
    [range, minimumValue, maximumValue, step, onValueChange]
  );

  // Min thumb gesture
  const minGesture = Gesture.Pan()
    .onStart(() => {
      minStartX.value = minPosition.value;
    })
    .onUpdate(e => {
      'worklet';
      const width = sliderWidth.value;
      if (width === 0) return;
      const newPosition = Math.max(
        0,
        Math.min(
          minStartX.value + e.translationX,
          maxPosition.value - THUMB_SIZE
        )
      );
      minPosition.value = newPosition;
      runOnJS(updateValues)(newPosition, maxPosition.value, width);
    })
    .onEnd(() => {
      minPosition.value = withSpring(minPosition.value);
    });

  // Max thumb gesture
  const maxGesture = Gesture.Pan()
    .onStart(() => {
      maxStartX.value = maxPosition.value;
    })
    .onUpdate(e => {
      'worklet';
      const width = sliderWidth.value;
      if (width === 0) return;
      const newPosition = Math.min(
        width,
        Math.max(
          maxStartX.value + e.translationX,
          minPosition.value + THUMB_SIZE
        )
      );
      maxPosition.value = newPosition;
      runOnJS(updateValues)(minPosition.value, newPosition, width);
    })
    .onEnd(() => {
      maxPosition.value = withSpring(maxPosition.value);
    });

  const minThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: minPosition.value }],
  }));

  const maxThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: maxPosition.value }],
  }));

  const activeTrackStyle = useAnimatedStyle(() => {
    const left = minPosition.value + THUMB_SIZE / 2;
    const width = maxPosition.value - minPosition.value;
    return {
      left,
      width,
    };
  });

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View style={styles.track}>
        <Animated.View style={[styles.activeTrack, activeTrackStyle]} />
      </View>
      <GestureDetector gesture={minGesture}>
        <Animated.View style={[styles.thumb, minThumbStyle]}>
          <View style={styles.thumbInner} />
        </Animated.View>
      </GestureDetector>
      <GestureDetector gesture={maxGesture}>
        <Animated.View style={[styles.thumb, maxThumbStyle]}>
          <View style={styles.thumbInner} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    width: '100%',
    height: TRACK_HEIGHT,
    backgroundColor: Colors.light.sliderGray,
    borderRadius: TRACK_HEIGHT / 2,
    position: 'absolute',
  },
  activeTrack: {
    height: TRACK_HEIGHT,
    backgroundColor: Colors.light.fishBlue,
    borderRadius: TRACK_HEIGHT / 2,
    position: 'absolute',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.light.white,
    borderWidth: 2,
    borderColor: Colors.light.sliderGray,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -THUMB_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.sliderGray,
  },
});
