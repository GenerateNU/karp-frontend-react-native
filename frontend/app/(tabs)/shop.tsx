/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { debounce } from 'lodash';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CarouselItem from '@/components/items/CarouselItem';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useLocation } from '@/context/LocationContext';
import { itemService } from '@/services/itemService';
import { volunteerService } from '@/services/volunteerService';
import { vendorService, Vendor } from '@/services/vendorService';
import { LoadingScreen } from '@/components/LoadingScreen';
import SearchInputWithFilter from '@/components/SearchInputWithFilter';
import ItemFilterDrawer from '@/components/drawers/ItemFilterDrawer';
import { ShopItem } from '@/types/api/item';
import { Volunteer } from '@/types/api/volunteer';

type SearchCategory = 'items' | 'vendors';

export interface ItemFilters {
  priceRange: { min: number; max: number };
  category: string;
}

export default function StoreScreen() {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<SearchCategory>('items');
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profile = useProfile();
  const [filters, setFilters] = useState<ItemFilters>({
    priceRange: { min: 0, max: 10000 },
    category: '',
  });
  const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(
    null
  );

  const router = useRouter();
  const { user } = useAuth();
  const { locationFilter, clearLocationFilter } = useLocation();

  const mapItemsWithVendors = useCallback(
    (itemsResponse: any[], vendorsResponse: Vendor[]): ShopItem[] => {
      const vendorMap = new Map<string, string>();
      vendorsResponse.forEach((vendor: Vendor) => {
        vendorMap.set(vendor.id, vendor.name);
      });

      return (Array.isArray(itemsResponse) ? itemsResponse : []).map(
        (raw: {
          id: string;
          name?: string;
          vendorName?: string;
          vendorId?: string;
          price?: number;
          imageS3Key?: string;
        }) => {
          // Get vendor name from the map, fallback to raw.vendorName, then vendorId, then 'Unknown'
          const vendorName =
            raw.vendorId && vendorMap.has(raw.vendorId)
              ? vendorMap.get(raw.vendorId)!
              : (raw.vendorName ?? raw.vendorId ?? 'Unknown');

          return {
            id: raw.id,
            name: raw.name ?? 'Unnamed',
            store: vendorName,
            coins: raw.price ?? 0,
            imageS3Key: raw.imageS3Key || undefined,
            vendorId: raw.vendorId,
          };
        }
      );
    },
    []
  );

  // Load items with search (background, no loading state to prevent reload)
  const loadItemsWithSearch = useCallback(
    async (searchQuery: string, category: SearchCategory) => {
      try {
        // Build search filter - use vendor_search for vendors, search_text for items
        const apiFilters =
          category === 'vendors'
            ? { vendor_search: searchQuery }
            : { search_text: searchQuery };

        const [itemsResponse, vendorsResponse] = await Promise.all([
          itemService.getAllItems(apiFilters, locationFilter),
          vendorService.getAllVendors(),
        ]);

        const mapped = mapItemsWithVendors(itemsResponse, vendorsResponse);
        setItems(mapped);
        console.log('Filtered items loaded:', mapped.length);
      } catch (e) {
        console.error('Error loading filtered items:', e);
        // Don't show alert for search errors, just log
      }
    },
    [locationFilter, mapItemsWithVendors]
  );

  // Load all items without search (background, no loading state)
  const loadAllItems = useCallback(async () => {
    try {
      const [itemsResponse, vendorsResponse] = await Promise.all([
        itemService.getAllItems(undefined, locationFilter),
        vendorService.getAllVendors(),
      ]);

      const mapped = mapItemsWithVendors(itemsResponse, vendorsResponse);
      setItems(mapped);
      console.log('All items loaded:', mapped.length);
    } catch (e) {
      console.error('Error loading items:', e);
      // Don't show alert for background loads, just log
    }
  }, [locationFilter, mapItemsWithVendors]);

  // Initial load and refresh (shows loading state)
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsResponse, vendorsResponse] = await Promise.all([
        itemService.getAllItems(undefined, locationFilter),
        vendorService.getAllVendors(),
      ]);

      const mapped = mapItemsWithVendors(itemsResponse, vendorsResponse);
      setItems(mapped);
      console.log('Mapped items:', mapped.length, 'items loaded');
    } catch (e) {
      console.error('Error loading items:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      Alert.alert(
        'Error',
        `Failed to load items. Please try again.\n\n${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  }, [locationFilter, mapItemsWithVendors]);

  // Debounce search text for smooth filtering (600ms delay)
  const debouncedSetSearch = useRef(
    debounce((text: string) => {
      setDebouncedSearchText(text);
    }, 600)
  ).current;

  // Update debounced search when searchText changes
  useEffect(() => {
    debouncedSetSearch(searchText);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchText, debouncedSetSearch]);

  // Load items from API when debounced search text changes (background, no reload)
  useEffect(() => {
    if (debouncedSearchText.trim()) {
      loadItemsWithSearch(debouncedSearchText, selectedCategory);
    } else {
      loadAllItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText]);

  useEffect(() => {
    if (debouncedSearchText.trim()) {
      loadItemsWithSearch(debouncedSearchText, selectedCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    const fetchVolunteer = async () => {
      let volunteerData: Volunteer | null = null;
      if (user?.entityId) {
        try {
          volunteerData = await volunteerService.getSelf();
          setCurrentVolunteer(volunteerData);
        } catch (err) {
          console.error('Error fetching current volunteer:', err);
        }
      }

      await loadItems();
    };
    fetchVolunteer();
  }, [loadItems, profile.volunteer?.experience]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Price range filter
      const matchesPrice =
        item.coins >= filters.priceRange.min &&
        item.coins <= filters.priceRange.max;

      // Category filter (if you have categories in your data)
      const matchesCategory =
        !filters.category ||
        item.name.toLowerCase().includes(filters.category.toLowerCase());

      return matchesPrice && matchesCategory;
    });
  }, [items, filters]);

  const handlePress = (itemId: string) => {
    router.push(`/shop/${itemId}`);
  };

  const handleCategoryChange = (category: SearchCategory) => {
    setSelectedCategory(category);
  };

  const handleApplyFilters = (newFilters: ItemFilters) => {
    setFilters(newFilters);
    setDrawerOpen(false);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadItems();
    } finally {
      setRefreshing(false);
    }
  }, [loadItems]);

  if (loading) {
    return <LoadingScreen text="Loading items..." />;
  }

  return (
    <>
      <ParallaxScrollView
        backgroundType="bubbles"
        headerBackgroundColor={{ light: '#8ecde8', dark: '#8ecde8' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        headerImage={
          <ThemedView
            lightColor={Colors.light.transparent}
            darkColor={Colors.light.transparent}
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
              lightColor={Colors.light.transparent}
              darkColor={Colors.light.transparent}
              className="mt-6 w-full flex-row items-center justify-between px-6"
            >
              <ThemedText
                type="subtitle"
                style={{
                  color: Colors.light.primaryText,
                  fontSize: 20,
                  fontFamily: Fonts.medium_500,
                }}
              >
                Level {currentVolunteer?.currentLevel ?? 0}
              </ThemedText>

              <ThemedText
                type="subtitle"
                style={{
                  color: Colors.light.primaryText,
                  fontSize: 20,
                  fontFamily: Fonts.medium_500,
                }}
              >
                {currentVolunteer?.coins ?? 0} koins
              </ThemedText>

              <TouchableOpacity
                onPress={() => router.push('/shop/history')}
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
          lightColor={Colors.light.transparent}
          darkColor={Colors.light.transparent}
          className="flex-1 px-4"
          style={{ paddingBottom: 110 }}
        >
          <SearchInputWithFilter
            value={searchText}
            onChangeText={setSearchText}
            onFilterPress={() => setDrawerOpen(true)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {locationFilter && (
            <ThemedView
              className="mb-2 flex-row items-center justify-between rounded-lg bg-blue-100 p-2"
              style={{ marginTop: 8 }}
            >
              <ThemedText
                style={{
                  color: 'black',
                  fontSize: 12,
                  fontFamily: Fonts.regular_400,
                }}
              >
                📍 Filtering within {locationFilter.radiusKm}km
              </ThemedText>
              <TouchableOpacity
                onPress={() => {
                  clearLocationFilter();
                }}
              >
                <ThemedText
                  style={{
                    color: '#3B82F6',
                    fontSize: 12,
                    fontFamily: Fonts.medium_500,
                  }}
                >
                  Clear
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}

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
            {locationFilter ? `Items near you` : 'Popular in Boston'}
          </ThemedText>
          {(() => {
            const popularItems = filteredItems;
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
                    vendorId={item.vendorId}
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
            const sweetItems = filteredItems;
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
                    vendorId={item.vendorId}
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
            const spreeItems = filteredItems;
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
                    vendorId={item.vendorId}
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
