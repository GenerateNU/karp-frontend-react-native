import React, {
  useCallback,
  useRef,
  useMemo,
  useEffect,
  useState,
} from 'react';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Props {
  onClose?: () => void;
}

export default function ItemFilterDrawer({ onClose }: Props) {
  const isWeb = Platform.OS === 'web';

  const [BottomSheetComp, setBottomSheetComp] = useState<any>(null);
  const [BottomSheetViewComp, setBottomSheetViewComp] = useState<any>(null);

  useEffect(() => {
    if (!isWeb) {
      try {
        // avoid static analysis by Metro/webpack by using eval('require')

        const req: any = eval('require');
        const mod = req('@gorhom/bottom-sheet');
        setBottomSheetComp(mod.default || mod);
        setBottomSheetViewComp(mod.BottomSheetView || mod.BottomSheetView);
      } catch (err) {
        // package not available on this platform — fallback UI will be used
        console.log(err);
      }
    }
  }, [isWeb]);

  const sheetRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const handleSheetChange = useCallback(
    (index: number) => {
      // if sheet closes (some libs use -1 for closed) call onClose
      if (index === -1 && onClose) onClose();
    },
    [onClose]
  );

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close?.();
    if (onClose) onClose();
  }, [onClose]);

  const Container: any = isWeb ? View : GestureHandlerRootView;
  const BottomSheet = BottomSheetComp;
  const BottomSheetView = BottomSheetViewComp;

  return (
    <Container style={styles.container}>
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />

      {isWeb ? (
        <View style={styles.webFallback}>
          <Text>
            Bottom sheet not available on web. Use native device to view the
            drawer.
          </Text>
          <Button title="Dismiss" onPress={() => onClose && onClose()} />
        </View>
      ) : BottomSheet && BottomSheetView ? (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          onChange={handleSheetChange}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text>Filter options go here</Text>
            <Button title="Close" onPress={() => handleClosePress()} />
          </BottomSheetView>
        </BottomSheet>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Loading drawer...</Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  webFallback: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
});
