import React, { useCallback, useRef, useMemo, useState } from 'react';
import { StyleSheet, View, Text, Platform, Pressable } from 'react-native';
import { Button } from './common/Button';
import PriceRangeInput from './PriceRangeInput';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/Colors';
import { ItemFilters } from '@/app/(tabs)/shop';

interface Props {
  currentFilters: ItemFilters;
  onApplyFilters: (filters: ItemFilters) => void;
  onClose?: () => void;
}

const FILTER_OPTIONS = ['LOCAL', 'FOOD', 'GIFT CARDS'];

export default function ItemFilterDrawer({
  currentFilters,
  onApplyFilters,
  onClose,
}: Props) {
  const isWeb = Platform.OS === 'web';

  const [selectedFilter, setSelectedFilter] = useState<string>(
    currentFilters.category
  );
  const [priceRange, setPriceRange] = useState(currentFilters.priceRange);
  const [filtersBy, setFiltersBy] = useState<'Category' | 'Location'>(
    'Category'
  );

  const sheetRef = useRef<any>(null);
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
    const newFilters: ItemFilters = {
      priceRange,
      category: selectedFilter,
      location: '',
    };
    onApplyFilters(newFilters);
  }, [priceRange, selectedFilter, onApplyFilters]);

  const FilterToggle = () => (
    <View style={styles.toggleContainer}>
      <Pressable
        style={[
          styles.toggleOption,
          filtersBy === 'Category' && styles.toggleOptionActive,
        ]}
        onPress={() => setFiltersBy('Category')}
      >
        <Text style={styles.toggleText}>Category</Text>
      </Pressable>
      <Pressable
        style={[
          styles.toggleOption,
          filtersBy === 'Location' && styles.toggleOptionActive,
        ]}
        onPress={() => setFiltersBy('Location')}
      >
        <Text style={styles.toggleText}>Location</Text>
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
          backgroundStyle={{ backgroundColor: Colors.light.background }}
          handleIndicatorStyle={{ backgroundColor: '#999', paddingTop: 8 }}
          enableDynamicSizing={false}
          enableOverDrag={false}
          enablePanDownToClose={true}
          onChange={handleSheetChange}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
        >
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
                      style={[
                        styles.filterOption,
                        selectedFilter === option && styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        setSelectedFilter(
                          selectedFilter === option ? '' : option
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedFilter === option &&
                            styles.filterOptionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.sectionTitle}>Filter by Cost:</Text>
                <View style={styles.priceRangeContainer}>
                  <PriceRangeInput
                    minValue={priceRange.min}
                    maxValue={priceRange.max}
                    onMinChange={min => setPriceRange({ ...priceRange, min })}
                    onMaxChange={max => setPriceRange({ ...priceRange, max })}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Location Filters:</Text>
                <View style={styles.locationContainer}>
                  <View style={styles.mapPlaceholder}>
                    <View style={styles.locationButtons}>
                      <Pressable style={styles.locationButton}>
                        <Text style={styles.locationButtonText}>
                          Use my location
                        </Text>
                      </Pressable>
                      <Pressable style={styles.locationButton}>
                        <Text style={styles.locationButtonText}>Edit</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </>
            )}

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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  priceRangeContainer: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
    alignSelf: 'flex-start',
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
    backgroundColor: 'white',
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
    backgroundColor: '#EDECEC',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleText: {
    fontSize: 14,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  filterOption: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  filterOptionTextActive: {
    color: '#3B82F6',
  },
  locationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mapPlaceholder: {
    width: '100%',

    aspectRatio: 4 / 3,
    backgroundColor: '#F3F2F2',
    borderRadius: 8,
    position: 'relative',
  },
  locationButtons: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'center',
  },
  locationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationButtonText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
});
