import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';

type SearchCategory = 'items' | 'vendors';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
  selectedCategory: SearchCategory;
  setSelectedCategory: (category: SearchCategory) => void;
  onCategoryChange?: (category: SearchCategory) => void;
}

export default function SearchInputWithFilter({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Type to search...',
  onCategoryChange,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const categoryOptions: { value: SearchCategory; label: string }[] = [
    { value: 'items', label: 'Items' },
    { value: 'vendors', label: 'Vendors' },
  ];

  const handleCategorySelect = (category: SearchCategory) => {
    setSelectedCategory(category);
    setShowDropdown(false);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const currentCategoryLabel =
    categoryOptions.find(opt => opt.value === selectedCategory)?.label ||
    'Search for items';

  return (
    <>
      <View style={styles.outerContainer}>
        <View style={styles.searchBarContainer}>
          {/* Search Icon */}
          <Ionicons
            name="search"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />

          {/* Category Selector */}
          <View style={styles.categorySelectorContainer}>
            <Pressable
              style={styles.categorySelector}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.categoryText}>{currentCategoryLabel}</Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color="#1D0F48"
                style={styles.dropdownIcon}
              />
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Search Input */}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
        </View>

        {/* Filter Button (Outside) */}
        <Pressable style={styles.filterButton} onPress={onFilterPress}>
          <Image
            source={require('../assets/images/filters-icon.svg')}
            style={styles.filterIcon}
            contentFit="contain"
          />
        </Pressable>
      </View>

      {/* Modal with Overlay and Dropdown */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.modalContent}>
            {/* Dropdown Menu positioned relative to search bar */}
            <View style={styles.dropdownMenuContainer}>
              <View style={styles.dropdownMenu}>
                {categoryOptions.map(option => (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      selectedCategory === option.value &&
                        styles.dropdownItemActive,
                    ]}
                    onPress={() => handleCategorySelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedCategory === option.value &&
                          styles.dropdownItemTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 12,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  categorySelectorContainer: {
    position: 'relative',
    marginRight: 8,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: Fonts.regular_400,
    fontSize: 14,
    color: '#1D0F48', // Dark purple
    marginRight: 4,
  },
  dropdownIcon: {
    marginLeft: 2,
  },
  dropdownMenuContainer: {
    position: 'absolute',
    top: 255,
    left: 26,
    zIndex: 1000,
  },
  dropdownMenu: {
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemActive: {
    backgroundColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontFamily: Fonts.regular_400,
    fontSize: 14,
    color: '#1D0F48',
  },
  dropdownItemTextActive: {
    fontFamily: Fonts.medium_500,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular_400,
    color: '#000000',
    padding: 0,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    marginLeft: 8,
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: '#1D0F48', // Dark purple
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    flex: 1,
  },
});
