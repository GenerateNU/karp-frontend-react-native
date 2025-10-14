import React, { useState } from 'react';
import { FlatList, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const STORE_ITEMS = [
  { id: '1', name: 'Cookie', store: 'Crumbl', coins: 150 },
  { id: '2', name: 'Hot Dog', store: 'Costco', coins: 120 },
  { id: '3', name: '$5 Gift Card', store: 'Pavement', coins: 100 },
  { id: '4', name: 'Free Plant', store: 'Plant Store', coins: 200 },
  { id: '5', name: 'Free Drink', store: 'Coffee Shop', coins: 50 },
  { id: '6', name: 'Free Shirt', store: 'Shirt Store', coins: 180 },
];

export default function StoreScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredItems = STORE_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePress = (itemId: string) => {
    throw new Error(`handlePress not implemented for item: ${itemId}`);
  };

  const renderItem = ({ item }: { item: (typeof STORE_ITEMS)[0] }) => (
    <TouchableOpacity
      key={item.id}
      className="mx-1 w-[40%]" // closer together
      onPress={() => handlePress(item.id)}
      activeOpacity={0.8}
    >
      <ThemedView
        lightColor="#FFFFFF"
        darkColor="#FFFFFF"
        className="items-center rounded-xl p-2 shadow-md"
      >
        <ThemedView
          className="mb-2 h-20 w-full rounded-md bg-gray-300"
          lightColor="#D0D0D0"
          darkColor="#D0D0D0"
        />
        <ThemedText
          type="subtitle"
          className="text-center text-base font-semibold text-black"
        >
          {item.name}
        </ThemedText>
        <ThemedText
          type="subtitle"
          className="text-center text-base font-semibold text-black"
        >
          {item.store}
        </ThemedText>
        <ThemedText
          type="body"
          className="mt-1 text-center text-base font-bold text-black"
        >
          {item.coins} coins
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1E90FF', dark: '#1E90FF' }}
      headerImage={
        <ThemedView
          lightColor="#1E90FF"
          darkColor="#1E90FF"
          className="flex-1 items-center justify-end pb-10"
        >
          <ThemedText
            type="title"
            className="text-center text-3xl font-extrabold text-white"
          >
            Gift Shop
          </ThemedText>
        </ThemedView>
      }
    >
      <ThemedView
        lightColor="#FFFFFF"
        darkColor="#FFFFFF"
        className="flex-1 px-4"
      >
        <TextInput
          className="my-4 h-10 rounded-lg border border-gray-400 bg-gray-100 px-3 text-black"
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />

        {[0, 1, 2].map(index => (
          <FlatList
            key={index}
            horizontal
            data={filteredItems}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4, marginBottom: 20 }}
          />
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}
