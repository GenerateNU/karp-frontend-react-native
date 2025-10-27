import React, { useCallback, useRef, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Platform,
  Pressable,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/Colors';

interface Props {
  onClose?: () => void;
}

const FILTER_OPTIONS = ['LOCAL', 'FOOD', 'GIFT CARDS'];

export default function ItemFilterDrawer({ onClose }: Props) {
  const isWeb = Platform.OS === 'web';

  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [filtersBy, setFiltersBy] = useState<'Category' | 'Location'>(
    'Category'
  );

  const sheetRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  // Start at index 0 (smallest height) when mounting

  const handleSheetChange = useCallback(
    (index: number) => {
      // if sheet closes (some libs use -1 for closed) call onClose
      if (index === -1 && onClose) onClose();
    },
    [onClose]
  );

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close?.();
    if (onClose) onClose();
  }, [onClose]);
  const FilterToggle = () => (
    <View style={styles.toggleContainer}>
      <Pressable
        style={[
          styles.toggleOption,
          filtersBy === 'Category' && styles.toggleOptionActive,
        ]}
        onPress={() => setFiltersBy('Category')}
      >
        <Text
          style={[
            styles.toggleText,
            filtersBy === 'Category' && styles.toggleTextActive,
          ]}
        >
          Category
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.toggleOption,
          filtersBy === 'Location' && styles.toggleOptionActive,
        ]}
        onPress={() => setFiltersBy('Location')}
      >
        <Text
          style={[
            styles.toggleText,
            filtersBy === 'Location' && styles.toggleTextActive,
          ]}
        >
          Location
        </Text>
      </Pressable>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Remove test buttons as they're not needed in production */}

      {isWeb ? (
        <View style={styles.webFallback}>
          <Text>
            Bottom sheet not available on web. Use native device to view the
            drawer.
          </Text>
          <Button title="Dismiss" onPress={() => onClose && onClose()} />
        </View>
      ) : (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          index={0}
          backgroundStyle={{ backgroundColor: Colors.light.background }}
          handleIndicatorStyle={{ backgroundColor: '#999', paddingTop: 8 }}
          enableDynamicSizing={false}
          enableOverDrag={true}
          enablePanDownToClose={true}
          onChange={handleSheetChange}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
        >
          {/* Use a scroll-capable content container so long content is visible and the sheet can size/scroll correctly */}
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
          >
            <Text style={styles.title}>Sort Filters By:</Text>
            <FilterToggle />

            {filtersBy === 'Category' ? (
              <>
                <Text style={styles.sectionTitle}>Filters:</Text>
                <View style={styles.filterContainer}>
                  {FILTER_OPTIONS.map(option => (
                    <Pressable
                      key={option}
                      className={`w-100 rounded-lg border px-3 py-2 ${
                        selectedFilter === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-100'
                      }`}
                      onPress={() =>
                        setSelectedFilter(
                          selectedFilter === option ? '' : option
                        )
                      }
                    >
                      <Text
                        className={`text-sm ${
                          selectedFilter === option
                            ? 'text-blue-500'
                            : 'text-gray-600'
                        }`}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.sectionTitle}>Filter by Cost:</Text>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Location Filters:</Text>
                <View style={styles.filterContainer}>
                  <Text>this is where the location filters will go</Text>
                </View>
              </>
            )}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Close" onPress={() => handleClosePress()} />
              <Button title="Apply" onPress={() => handleClosePress()} />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 11,
    padding: 36,
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingBottom: 50,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
  },
  filterContainer: {
    gap: 15,
    marginBottom: 16,
  },
  webFallback: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDECEC',
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: 'black',
    padding: 2,
    marginVertical: 10,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOptionActive: {
    backgroundColor: '#3B82F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleText: {
    fontSize: 14,
    color: '#6B7280',
  },
  toggleTextActive: {
    color: 'white',
    fontWeight: '600',
  },
});
