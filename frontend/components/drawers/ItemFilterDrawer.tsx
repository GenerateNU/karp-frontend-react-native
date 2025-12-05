import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import PriceRangeInput from '../PriceRangeInput';
import { ITEM_FILTER_OPTIONS } from '@/constants/FilterOptions';
import FilterDrawer from './FilterDrawer';
import { ItemFilters } from '@/app/(tabs)/shop';
import LocationMapFilter from '../LocationMapFilter';
import { Colors } from '@/constants/Colors';

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

  const LocationContent = <LocationMapFilter />;

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
    borderColor: Colors.light.filterBorder,
    backgroundColor: Colors.light.formInputBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    borderColor: Colors.light.filterBlue,
    backgroundColor: Colors.light.filterActiveBackground,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.light.filterText,
  },
  filterOptionTextActive: {
    color: Colors.light.filterBlue,
  },
});
