import React, { useState, useEffect } from 'react';
import {
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Fonts } from '@/constants/Fonts';
import { useAuth } from '@/context/AuthContext';
import { itemService, ItemFilters } from '@/services/itemService';
import { Item } from '@/types/api/item';

// Default city for now - could be fetched from user location later
const USER_CITY = 'Boston';

export default function StoreScreen() {
  const { isAuthenticated, token } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [popularItems, setPopularItems] = useState<Item[]>([]);
  const [sweetTreats, setSweetTreats] = useState<Item[]>([]);
  const [shoppingSpree, setShoppingSpree] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch Popular in [city] - items with matching location
        const popularFilters: ItemFilters = {
          location: USER_CITY,
          status: 'ACTIVE',
        };
        const popular = await itemService.getAllItems(token, popularFilters);
        setPopularItems(popular || []);

        // Fetch Sweet Treats - items with Sweet, Treat, or Candy tags
        const sweetFilters: ItemFilters = {
          tags: ['Sweet', 'Treat', 'Candy'],
          status: 'ACTIVE',
        };
        const sweet = await itemService.getAllItems(token, sweetFilters);
        setSweetTreats(sweet || []);

        // Fetch Shopping Spree - items with Shopping, Clothes, Discounts, or Mall tags
        const shoppingFilters: ItemFilters = {
          tags: ['Shopping', 'Clothes', 'Discounts', 'Mall'],
          status: 'ACTIVE',
        };
        const shopping = await itemService.getAllItems(token, shoppingFilters);
        setShoppingSpree(shopping || []);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [isAuthenticated, token]);

  const handlePress = (itemId: string) => {
    throw new Error(`handlePress not implemented for item: ${itemId}`);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      key={item.id}
      className="mx-2"
      onPress={() => handlePress(item.id)}
      activeOpacity={0.8}
    >
      <ThemedView
        lightColor="#E5E5E5"
        darkColor="#E5E5E5"
        className="p2 rounded-xl shadow-md"
        style={{ width: 180, height: 180 }}
      >
        {/* Photo place holder*/}
        <ThemedView
          className="mb-2 w-full rounded-md bg-gray-400"
          style={{ width: 180, height: 100 }}
          lightColor="#D3D3D3"
          darkColor="#D3D3D3"
        />
        <ThemedText
          type="subtitle"
          style={{
            textAlign: 'left',
            color: 'black',
            fontSize: 16,
            paddingLeft: 5,
            fontFamily: Fonts.regular_400,
          }}
        >
          {item.name}
        </ThemedText>
        {item.description && (
          <ThemedText
            type="default"
            style={{
              color: 'black',
              textAlign: 'left',
              fontSize: 11,
              paddingLeft: 5,
              paddingTop: 2,
              paddingBottom: 2,
              fontFamily: Fonts.regular_400,
            }}
            numberOfLines={2}
          >
            {item.description}
          </ThemedText>
        )}
        <ThemedView
          lightColor="#E5E5E5"
          darkColor="#E5E5E5"
          className="flex-row items-center justify-between"
          style={{ width: '100%', marginTop: 'auto' }}
        >
          <ThemedText
            type="default"
            style={{
              color: 'black',
              textAlign: 'left',
              fontSize: 12,
              paddingLeft: 5,
              fontFamily: Fonts.regular_400,
            }}
          >
            {item.vendor_name || 'Store'}
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
            {item.price} coins
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

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

        {loading ? (
          <ThemedView className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#8ecde8" />
          </ThemedView>
        ) : (
          <>
            {/* Popular in [city] */}
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
              Popular in {USER_CITY}
            </ThemedText>
            {popularItems.length > 0 ? (
              <FlatList
                horizontal
                data={popularItems.filter(
                  item =>
                    searchText === '' ||
                    item.name.toLowerCase().includes(searchText.toLowerCase())
                )}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 8,
                  marginBottom: 20,
                }}
              />
            ) : (
              <ThemedText
                style={{ paddingLeft: 8, color: '#999', marginBottom: 20 }}
              >
                No items available in {USER_CITY}
              </ThemedText>
            )}

            {/* Sweet Treats */}
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
            {sweetTreats.length > 0 ? (
              <FlatList
                horizontal
                data={sweetTreats.filter(
                  item =>
                    searchText === '' ||
                    item.name.toLowerCase().includes(searchText.toLowerCase())
                )}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 8,
                  marginBottom: 20,
                }}
              />
            ) : (
              <ThemedText
                style={{ paddingLeft: 8, color: '#999', marginBottom: 20 }}
              >
                No sweet treats available
              </ThemedText>
            )}

            {/* Shopping Spree */}
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
            {shoppingSpree.length > 0 ? (
              <FlatList
                horizontal
                data={shoppingSpree.filter(
                  item =>
                    searchText === '' ||
                    item.name.toLowerCase().includes(searchText.toLowerCase())
                )}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 8,
                  marginBottom: 20,
                }}
              />
            ) : (
              <ThemedText
                style={{ paddingLeft: 8, color: '#999', marginBottom: 20 }}
              >
                No shopping items available
              </ThemedText>
            )}
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}
