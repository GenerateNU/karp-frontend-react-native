import React, { useEffect, useMemo, useState } from 'react';
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
import ItemFilterDrawer from '../../components/ItemFilterDrawer';

type ShopItem = { id: string; name: string; store: string; coins: number };

export default function StoreScreen() {
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const { volunteer, token } = useAuth();

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        if (!token) return;
        const response = await itemService.getAllItems();
        const mapped: ShopItem[] = (
          Array.isArray(response) ? response : []
        ).map((raw: any) => ({
          id: raw.id || raw._id || raw.item_id,
          name: raw.name ?? 'Unnamed',
          store: raw.vendor_name ?? raw.vendor_id ?? 'Unknown',
          coins: raw.price ?? raw.coins ?? 0,
        }));
        setItems(mapped);
      } catch (e) {
        Alert.alert('Error', `Failed to load items. Please try again ${e}.`);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [token]);

  const filteredItems = useMemo(
    () =>
      items.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [items, searchText]
  );

  const handlePress = (itemId: string) => {
    router.push(`/shop/${itemId}`);
  };

  if (loading) {
    return <LoadingScreen text="Loading items..." />;
  }

  return (
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
                backgroundColor: 'rgba(12, 120, 128, 0.5)', // semi-dark circle
                paddingHorizontal: 10, // allow text to fit
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

        {/* Popular in Boston */}
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

        {/* Rewards */}
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
      {/* render drawer only when requested */}
      {drawerOpen && <ItemFilterDrawer onClose={() => setDrawerOpen(false)} />}
    </ParallaxScrollView>
  );
}
