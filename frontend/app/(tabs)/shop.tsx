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
  View,
  Dimensions,
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
    priceRange: { min: 0, max: 2000 },
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

  // Shared function to load items based on search state
  const loadItemsBasedOnSearch = useCallback(() => {
    if (debouncedSearchText.trim()) {
      loadItemsWithSearch(debouncedSearchText, selectedCategory);
    } else {
      loadAllItems();
    }
  }, [
    debouncedSearchText,
    selectedCategory,
    loadItemsWithSearch,
    loadAllItems,
  ]);

  // Load items from API when debounced search text changes (background, no reload)
  useEffect(() => {
    loadItemsBasedOnSearch();
  }, [debouncedSearchText, loadItemsBasedOnSearch]);

  // Reload items when category changes (only if there's a search query)
  useEffect(() => {
    if (debouncedSearchText.trim()) {
      loadItemsWithSearch(debouncedSearchText, selectedCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Handle location filter changes with background load (no loading screen)
  useEffect(() => {
    loadItemsBasedOnSearch();
  }, [locationFilter, loadItemsBasedOnSearch]);

  // Initial load - only run on mount and when volunteer experience changes
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload when volunteer experience changes
  useEffect(() => {
    if (hasInitialized.current && profile.volunteer?.experience !== undefined) {
      loadItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.volunteer?.experience]);

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

  // useFocusEffect(
  //   useCallback(() => {
  //     refreshProfile();  // pulls latest XP, coins, level
  //   }, [])
  // );

  if (loading) {
    return <LoadingScreen text="Loading items..." />;
  }

  return (
    <>
      <ParallaxScrollView
        backgroundType="bubbles"
        headerBackgroundColor={{
          light: Colors.light.fishBlue,
          dark: Colors.light.fishBlue,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.light.filterBlue}
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
              style={{ fontFamily: Fonts.bold_700 }}
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
                  backgroundColor: Colors.light.semiTransparentTeal,
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
        >
          <SearchInputWithFilter
            value={searchText}
            onChangeText={setSearchText}
            onFilterPress={() => setDrawerOpen(true)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <ThemedText
            className="mb-2 text-lg font-bold text-black"
            style={{
              color: Colors.light.primaryText,
              textAlign: 'left',
              marginTop: 4,
              fontFamily: Fonts.bold_700,
              fontSize: 20,
            }}
          >
            {locationFilter ? `Items near you` : 'Popular near you'}
          </ThemedText>
          {(() => {
            const popularItems = filteredItems;
            const screenWidth = Dimensions.get('window').width;
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
                  flexGrow: popularItems.length === 0 ? 1 : 0,
                  justifyContent:
                    popularItems.length === 0 ? 'center' : 'flex-start',
                }}
                ListEmptyComponent={
                  <View
                    style={{
                      width: screenWidth - 32,
                      height: 173,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}
                  >
                    <ThemedText
                      style={{
                        fontFamily: Fonts.bold_700,
                        fontSize: 24,
                        color: Colors.light.textSecondary,
                        textAlign: 'center',
                        marginBottom: 5,
                      }}
                    >
                      Oops—no gifts here yet!
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontFamily: Fonts.light_300,
                        fontSize: 16,
                        color: Colors.light.textSecondary,
                        textAlign: 'center',
                        lineHeight: 17,
                        width: 220,
                      }}
                    >
                      Go volunteer and come back to see what pops up.
                    </ThemedText>
                  </View>
                }
              />
            );
          })()}

          <ThemedText
            className="mb-2 text-lg font-bold text-black"
            style={{
              color: Colors.light.primaryText,
              textAlign: 'left',
              marginTop: 4,
              fontFamily: Fonts.bold_700,
              fontSize: 20,
            }}
          >
            Sweet Treats
          </ThemedText>
          {(() => {
            const sweetItems = filteredItems;
            const screenWidth = Dimensions.get('window').width;
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
                  flexGrow: sweetItems.length === 0 ? 1 : 0,
                  justifyContent:
                    sweetItems.length === 0 ? 'center' : 'flex-start',
                }}
                ListEmptyComponent={
                  <View
                    style={{
                      width: screenWidth - 32,
                      height: 173,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}
                  >
                    <ThemedText
                      style={{
                        fontFamily: Fonts.bold_700,
                        fontSize: 24,
                        color: Colors.light.textSecondary,
                        textAlign: 'center',
                        marginBottom: 5,
                      }}
                    >
                      Oops—no gifts here yet!
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontFamily: Fonts.light_300,
                        fontSize: 16,
                        color: Colors.light.textSecondary,
                        textAlign: 'center',
                        lineHeight: 17,
                        width: 220,
                      }}
                    >
                      Go volunteer and come back to see what pops up.
                    </ThemedText>
                  </View>
                }
              />
            );
          })()}

          <ThemedText
            className="mb-2 text-lg font-bold text-black"
            style={{
              color: Colors.light.primaryText,
              textAlign: 'left',
              marginTop: 4,
              fontFamily: Fonts.bold_700,
              fontSize: 20,
            }}
          >
            Gift Cards
          </ThemedText>
          {(() => {
            const spreeItems = filteredItems;
            const screenWidth = Dimensions.get('window').width;
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
                  flexGrow: spreeItems.length === 0 ? 1 : 0,
                  justifyContent:
                    spreeItems.length === 0 ? 'center' : 'flex-start',
                }}
                ListEmptyComponent={
                  <View
                    style={{
                      width: screenWidth - 32,
                      height: 173,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}
                  >
                    <ThemedText
                      style={{
                        fontFamily: Fonts.bold_700,
                        fontSize: 24,
                        color: Colors.light.textSecondary,
                        textAlign: 'center',
                        marginBottom: 5,
                      }}
                    >
                      Oops—no gifts here yet!
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontFamily: Fonts.light_300,
                        fontSize: 16,
                        color: Colors.light.textSecondary,
                        textAlign: 'center',
                        lineHeight: 17,
                        width: 220,
                      }}
                    >
                      Go volunteer and come back to see what pops up.
                    </ThemedText>
                  </View>
                }
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
