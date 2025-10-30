import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { FlatList, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CarouselItem from '@/components/items/CarouselItem';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Fonts } from '@/constants/Fonts';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { itemService } from '@/services/itemService';
import { LoadingScreen } from '@/components/LoadingScreen';
import SearchInputWithFilter from '@/components/SearchInputWithFilter';
import ItemFilterDrawer from '../../components/drawers/ItemFilterDrawer';
import { ShopItem } from '@/types/api/item';
export interface ItemFilters {
  priceRange: { min: number; max: number };
  category: string;
  location: string;
}

export default function StoreScreen() {
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ItemFilters>({
    priceRange: { min: 0, max: 100 },
    category: '',
    location: '',
  });

  const router = useRouter();
  const { volunteer, token } = useAuth();

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      if (!token) return;
      const response = await itemService.getAllItems();
      const mapped: ShopItem[] = (Array.isArray(response) ? response : []).map(
        (raw: any) => ({
          id: raw.id,
          name: raw.name ?? 'Unnamed',
          store: raw.vendor_name ?? raw.vendor_id ?? 'Unknown',
          coins: raw.price ?? 0,
          imageS3Key: raw.imageS3Key || null,
        })
      );
      setItems(mapped);
      console.log('Loaded items:', mapped);
    } catch (e) {
      Alert.alert('Error', `Failed to load items. Please try again ${e}.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      // Price range filter
      const matchesPrice =
        item.coins >= filters.priceRange.min &&
        item.coins <= filters.priceRange.max;

      // Category filter (if you have categories in your data)
      const matchesCategory =
        !filters.category ||
        item.name.toLowerCase().includes(filters.category.toLowerCase());

      return matchesSearch && matchesPrice && matchesCategory;
    });
  }, [items, searchText, filters]);

  const handlePress = (itemId: string) => {
    router.push(`/shop/${itemId}`);
  };

  const handleApplyFilters = (newFilters: ItemFilters) => {
    setFilters(newFilters);
    setDrawerOpen(false);
  };

  if (loading) {
    return <LoadingScreen text="Loading items..." />;
  }

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#8ecde8', dark: '#8ecde8' }}
        headerImage={
          <ThemedView
            lightColor="#8ecde8"
            darkColor="#8ecde8"
            className="flex-1 items-center justify-end pb-5"
          >
            <ThemedText
              type="title"
              className="text-center text-3xl font-extrabold text-white"
              style={{ fontFamily: Fonts.regular_400 }}
            >
              Gift Shop
            </ThemedText>

            <ThemedView
              lightColor="#8ecde8"
              darkColor="#8ecde8"
              className="mt-6 w-full flex-row items-center justify-between px-6"
            >
              <ThemedText
                type="subtitle"
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontFamily: Fonts.medium_500,
                }}
              >
                Level 10
              </ThemedText>

              <ThemedText
                type="subtitle"
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontFamily: Fonts.medium_500,
                }}
              >
                {volunteer?.coins ?? 0} coins
              </ThemedText>

              <TouchableOpacity
                onPress={() => {
                  throw new Error('History button not implemented yet');
                }}
                style={{
                  backgroundColor: 'rgba(12, 120, 128, 0.5)',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ThemedText
                  type="subtitle"
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontFamily: Fonts.medium_500,
                  }}
                >
                  History &gt;
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        }
      >
        <ThemedView
          lightColor="#F2F2F2"
          darkColor="#FFFFF"
          className="flex-1 px-4"
        >
          <SearchInputWithFilter
            value={searchText}
            onChangeText={setSearchText}
            onFilterPress={() => setDrawerOpen(true)}
          />

          <ThemedText
            className="mb-2 text-lg font-bold text-black"
            style={{
              color: 'black',
              textAlign: 'left',
              marginTop: 4,
              fontFamily: Fonts.regular_400,
              fontSize: 20,
            }}
          >
            Popular in Boston
          </ThemedText>
          {(() => {
            const popularItems = filteredItems.slice(0, 3);
            return (
              <FlatList
                horizontal
                data={popularItems}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                  <CarouselItem
                    id={item.id}
                    name={item.name}
                    coins={item.coins}
                    index={index}
                    count={popularItems.length}
                    imageS3Key={item.imageS3Key}
                    onPress={handlePress}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginBottom: 20,
                }}
              />
            );
          })()}

          <ThemedText
            className="mb-2 text-lg font-bold text-black"
            style={{
              color: 'black',
              textAlign: 'left',
              marginTop: 4,
              fontFamily: Fonts.regular_400,
              fontSize: 20,
            }}
          >
            Sweet Treats
          </ThemedText>
          {(() => {
            const sweetItems = filteredItems.slice(2, 5);
            return (
              <FlatList
                horizontal
                data={sweetItems}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                  <CarouselItem
                    id={item.id}
                    name={item.name}
                    coins={item.coins}
                    index={index}
                    count={sweetItems.length}
                    imageS3Key={item.imageS3Key}
                    onPress={handlePress}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginBottom: 20,
                }}
              />
            );
          })()}

          <ThemedText
            className="mb-2 text-lg font-bold text-black"
            style={{
              color: 'black',
              textAlign: 'left',
              marginTop: 4,
              fontFamily: Fonts.regular_400,
              fontSize: 20,
            }}
          >
            Shopping Spree
          </ThemedText>
          {(() => {
            const spreeItems = filteredItems.slice(3, 6);
            return (
              <FlatList
                horizontal
                data={spreeItems}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                  <CarouselItem
                    id={item.id}
                    name={item.name}
                    coins={item.coins}
                    index={index}
                    count={spreeItems.length}
                    imageS3Key={item.imageS3Key}
                    onPress={handlePress}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginBottom: 20,
                }}
              />
            );
          })()}
        </ThemedView>
      </ParallaxScrollView>

      {drawerOpen && (
        <ItemFilterDrawer
          currentFilters={filters}
          onApplyFilters={handleApplyFilters}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
