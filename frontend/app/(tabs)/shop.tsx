import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Fonts } from '@/constants/Fonts';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getAllItems } from '@/services/itemService';
import { LoadingScreen } from '@/components/LoadingScreen';

type ShopItem = { id: string; name: string; store: string; coins: number };

export default function StoreScreen() {
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        if (!token) return;
        const response = await getAllItems(token);
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

  const renderItem = ({ item }: { item: ShopItem }) => (
    <TouchableOpacity
      key={item.id}
      className="mx-4"
      onPress={() => handlePress(item.id)}
      activeOpacity={0.8}
    >
      <ThemedView
        lightColor="#E5E5E5"
        darkColor="#E5E5E5"
        className="p2 rounded-xl shadow-md"
        style={{ width: 180, height: 160 }}
      >
        {/* Photo place holder*/}
        <ThemedView
          className="mb-2 w-full rounded-md bg-gray-400"
          style={{ width: 180, height: 100 }}
          lightColor="#D3D3D3"
          darkColor="#D3D3D3"
        />
        <ThemedText
          type="title"
          style={{
            textAlign: 'left',
            color: 'black',
            fontSize: 20,
            paddingLeft: 5,
            fontFamily: Fonts.regular_400,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </ThemedText>
        <ThemedView
          lightColor="#E5E5E5"
          darkColor="#E5E5E5"
          className="flex-row items-center justify-between"
          style={{ width: '100%' }}
        >
          <ThemedText
            type="subtitle"
            style={{
              color: 'black',
              textAlign: 'left',
              fontSize: 12,
              paddingLeft: 5,
              fontFamily: Fonts.regular_400,
            }}
          >
            Store
          </ThemedText>
          <ThemedText
            type="default"
            style={{
              color: 'black',
              textAlign: 'right',
              paddingRight: 5,
              fontFamily: Fonts.regular_400,
            }}
          >
            {item.coins} coins
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

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
              500 coins
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
        <TextInput
          className="my-4 h-10 rounded-lg border border-gray-400 bg-gray-100 px-3 text-black"
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
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
        <FlatList
          horizontal
          data={filteredItems.slice(0, 3)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 20 }}
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
          Sweet Treats
        </ThemedText>
        <FlatList
          horizontal
          data={filteredItems.slice(2, 5)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 20 }}
        />

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
        <FlatList
          horizontal
          data={filteredItems.slice(3, 6)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 20 }}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}
