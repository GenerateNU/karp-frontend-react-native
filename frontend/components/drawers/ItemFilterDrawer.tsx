import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import FilterDrawer from './FilterDrawer';
import { ItemFilters } from '@/app/(tabs)/shop';
import LocationMapFilter from '../LocationMapFilter';
import RangeSlider from '../RangeSlider';
import { Colors } from '@/constants/Colors';
import { ITEM_FILTER_OPTIONS } from '@/constants/FilterOptions';
import { Fonts } from '@/constants/Fonts';
import { useLocation } from '@/context/LocationContext';

interface Props {
  currentFilters: ItemFilters;
  onApplyFilters: (filters: ItemFilters) => void;
  onClose?: () => void;
}

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
}

function RadioButton({ selected, onPress }: RadioButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.radioButtonContainer}>
      <View
        style={[styles.radioButton, selected && styles.radioButtonSelected]}
      >
        {selected && <View style={styles.radioButtonInner} />}
      </View>
    </Pressable>
  );
}

export default function ItemFilterDrawer({
  currentFilters,
  onApplyFilters,
  onClose,
}: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string>(
    currentFilters.category
  );
  // Initialize with full range to encompass entire bar
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 10000,
  });
  const { clearLocationFilter } = useLocation();

  const handleClear = () => {
    setSelectedFilter('');
    setPriceRange({ min: 0, max: 10000 });
    clearLocationFilter();
    onApplyFilters({
      priceRange: { min: 0, max: 10000 },
      category: '',
    });
  };

  const handleApply = () => {
    const newFilters: ItemFilters = {
      priceRange,
      category: selectedFilter,
    };
    onApplyFilters(newFilters);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const CategoryContent = (
    <View style={styles.categoryContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Filters</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.filterList}>
        {ITEM_FILTER_OPTIONS.map(option => {
          const isSelected = selectedFilter === option;
          const displayText =
            option === 'GIFT CARDS'
              ? 'Gift Cards'
              : option === 'OFFERS'
                ? 'Offers'
                : option === 'LOCAL'
                  ? 'Local'
                  : option === 'FOOD'
                    ? 'Food'
                    : option;
          return (
            <View key={option} style={styles.filterRow}>
              <Text style={styles.filterText}>{displayText}</Text>
              <RadioButton
                selected={isSelected}
                onPress={() => setSelectedFilter(isSelected ? '' : option)}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.costSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Filter by Cost</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.sliderContainer}>
          <RangeSlider
            minValue={priceRange.min / 100}
            maxValue={priceRange.max / 100}
            minimumValue={0}
            maximumValue={100}
            onValueChange={(min, max) => {
              handlePriceRangeChange(min * 100, max * 100);
            }}
            step={1}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0</Text>
            <Text style={styles.sliderLabel}>100+</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const LocationContent = (
    <LocationMapFilter
      onApply={() => {
        handleApply();
        if (onClose) {
          onClose();
        }
      }}
    />
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
      customButtons={
        <View style={styles.buttonContainer}>
          <Pressable style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </Pressable>
          <Pressable style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.buttonText}>Apply</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  categoryContent: {
    width: '100%',
    gap: 15,
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 11,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    fontFamily: Fonts.regular_400,
    marginBottom: 11,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.light.text,
    opacity: 0.2,
  },
  filterList: {
    width: '100%',
    gap: 11,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  filterText: {
    fontSize: 16,
    color: Colors.light.primaryText,
    fontFamily: Fonts.regular_400,
  },
  radioButtonContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primaryText,
    backgroundColor: Colors.light.eggshellWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.light.primaryText,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.primaryText,
  },
  costSection: {
    width: '100%',
    marginTop: 15,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 15,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  sliderLabel: {
    fontSize: 12,
    color: Colors.light.primaryText,
    fontFamily: Fonts.regular_400,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 22,
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: Colors.light.fishBlue,
    borderRadius: 16.333,
    paddingHorizontal: 21,
    paddingVertical: 10,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  applyButton: {
    backgroundColor: Colors.light.fishBlue,
    borderRadius: 16.333,
    paddingHorizontal: 21,
    paddingVertical: 10,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    fontFamily: Fonts.regular_400,
  },
});
