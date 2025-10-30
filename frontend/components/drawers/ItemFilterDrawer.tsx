import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import PriceRangeInput from '../PriceRangeInput';
import { ITEM_FILTER_OPTIONS } from '../../constants/FilterOptions';
import FilterDrawer from './FilterDrawer';
import { ItemFilters } from '@/app/(tabs)/shop';

interface Props {
  currentFilters: ItemFilters;
  onApplyFilters: (filters: ItemFilters) => void;
  onClose?: () => void;
}

export default function ItemFilterDrawer({
  currentFilters,
  onApplyFilters,
  onClose,
}: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string>(
    currentFilters.category
  );
  const [priceRange, setPriceRange] = useState(currentFilters.priceRange);

  const handleApply = () => {
    const newFilters: ItemFilters = {
      priceRange,
      category: selectedFilter,
      location: '',
    };
    onApplyFilters(newFilters);
  };

  const CategoryContent = (
    <>
      <Text style={styles.sectionTitle}>Filters:</Text>
      <View style={styles.filterContainer}>
        {ITEM_FILTER_OPTIONS.map(option => (
          <Pressable
            key={option}
            style={[
              styles.filterOption,
              selectedFilter === option && styles.filterOptionActive,
            ]}
            onPress={() =>
              setSelectedFilter(selectedFilter === option ? '' : option)
            }
          >
            <Text
              style={[
                styles.filterOptionText,
                selectedFilter === option && styles.filterOptionTextActive,
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
          onMinChange={(min: number) => setPriceRange({ ...priceRange, min })}
          onMaxChange={(max: number) => setPriceRange({ ...priceRange, max })}
        />
      </View>
    </>
  );

  const LocationContent = (
    <>
      <Text style={styles.sectionTitle}>Location Filters:</Text>
      <View style={styles.locationContainer}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.locationButtons}>
            <Pressable style={styles.locationButton}>
              <Text style={styles.locationButtonText}>Use my location</Text>
            </Pressable>
            <Pressable style={styles.locationButton}>
              <Text style={styles.locationButtonText}>Edit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <FilterDrawer
      onClose={onClose}
      onApply={handleApply}
      title="Sort Filters By:"
      isTwoSided={true}
      sideOneLabel="Category"
      sideTwoLabel="Location"
      sideOneContent={CategoryContent}
      sideTwoContent={LocationContent}
    />
  );
}

const styles = StyleSheet.create({
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
    width: '100%',
  },
  priceRangeContainer: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
