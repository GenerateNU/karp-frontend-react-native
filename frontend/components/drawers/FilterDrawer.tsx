import React, { useCallback, useRef, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Button } from '@/components/ui/Button';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/Colors';

interface FilterDrawerProps {
  onClose?: () => void;
  onApply: () => void;
  title?: string;
  isTwoSided?: boolean;
  sideOneLabel?: string;
  sideTwoLabel?: string;
  sideOneContent?: React.ReactNode;
  sideTwoContent?: React.ReactNode;
  contentStyle?: ViewStyle;
}

export default function FilterDrawer({
  onClose,
  onApply,
  title = 'Sort Filters By:',
  isTwoSided = false,
  sideOneLabel = 'Option 1',
  sideTwoLabel = 'Option 2',
  sideOneContent,
  sideTwoContent,
  contentStyle,
}: FilterDrawerProps) {
  const isWeb = Platform.OS === 'web';
  const [activeSide, setActiveSide] = useState<'one' | 'two'>('one');

  const sheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1 && onClose) onClose();
    },
    [onClose]
  );

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close?.();
    if (onClose) onClose();
  }, [onClose]);

  const handleApplyPress = useCallback(() => {
    onApply();
  }, [onApply]);

  const FilterToggle = () => (
    <View style={styles.toggleContainer}>
      <Pressable
        style={[
          styles.toggleOption,
          activeSide === 'one' && styles.toggleOptionActive,
        ]}
        onPress={() => setActiveSide('one')}
      >
        <Text style={styles.toggleText}>{sideOneLabel}</Text>
      </Pressable>
      <Pressable
        style={[
          styles.toggleOption,
          activeSide === 'two' && styles.toggleOptionActive,
        ]}
        onPress={() => setActiveSide('two')}
      >
        <Text style={styles.toggleText}>{sideTwoLabel}</Text>
      </Pressable>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {isWeb ? (
        <View style={styles.webFallback}>
          <Text>
            Bottom sheet not available on web. Use native device to view the
            drawer.
          </Text>
          <Button text="Dismiss" onPress={() => onClose && onClose()} />
        </View>
      ) : (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          index={0}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
          enableDynamicSizing={false}
          enableOverDrag={false}
          enablePanDownToClose={true}
          onChange={handleSheetChange}
          style={styles.bottomSheet}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
          >
            <Text style={styles.title}>{title}</Text>

            {isTwoSided && <FilterToggle />}

            <View style={[styles.content, contentStyle]}>
              {isTwoSided
                ? activeSide === 'one'
                  ? sideOneContent
                  : sideTwoContent
                : sideOneContent}
            </View>

            <View style={styles.buttonContainer}>
              <Button text="Close" onPress={handleClosePress} />
              <Button text="Apply" onPress={handleApplyPress} />
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: Colors.light.overlay,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetBackground: {
    backgroundColor: Colors.light.background,
  },
  handleIndicator: {
    backgroundColor: Colors.light.handleIndicatorGray,
    paddingTop: 8,
  },
  contentContainer: {
    flexDirection: 'column',
    gap: 11,
    padding: 36,
    paddingBottom: 50,
    alignItems: 'flex-start',
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  content: {
    width: '100%',
  },
  webFallback: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.white,
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: Colors.light.text,
    padding: 2,
    marginVertical: 10,
    width: '100%',
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.white,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  toggleOptionActive: {
    backgroundColor: Colors.light.toggleActiveBackground,
    elevation: 2,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
});
