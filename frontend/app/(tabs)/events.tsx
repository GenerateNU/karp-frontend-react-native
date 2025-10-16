import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Event, EventFilters } from '@/types/api/event';
import { eventService } from '@/services/eventService';
import { EventCard } from '@/components/EventCard';
import { FilterModal } from '@/components/FilterModal';
import { useRouter } from 'expo-router';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({});
  const [activeTab, setActiveTab] = useState<'events' | 'orgs'>('events');
  const router = useRouter();

  const loadEvents = useCallback(
    async (searchQuery?: string, filters?: EventFilters) => {
      try {
        setLoading(true);
        const fetchedEvents = await eventService.searchEvents(
          searchQuery?.trim() || '',
          filters
        );
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        Alert.alert('Error', 'Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents(searchQuery, filters);
    setRefreshing(false);
  }, [loadEvents, searchQuery, filters]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      loadEvents(query, filters);
    },
    [loadEvents, filters]
  );

  const handleApplyFilters = useCallback(
    (newFilters: EventFilters) => {
      setFilters(newFilters);
      loadEvents(searchQuery, newFilters);
    },
    [loadEvents, searchQuery]
  );

  const handleEventPress = useCallback((event: Event) => {
    console.log('Event pressed:', event);
    console.log('Navigating to event details for ID:', event.id);
    router.push(`/events/${event.id}/info`);
    // Alert.alert(
    //   event.name,
    //   `Status: ${event.status}\n\nStart: ${new Date(event.start_date_time).toLocaleString()}\nEnd: ${new Date(event.end_date_time).toLocaleString()}\nLocation: ${event.location || event.address}\nMax Volunteers: ${event.max_volunteers}\nCoins: ${event.coins}`,
    //   [{ text: 'OK' }]
    // );
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const renderEvent = ({ item }: { item: Event }) => (
    console.log('Rendering event:', item),
    (<EventCard event={item} onPress={handleEventPress} />)
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-10">
      <Text className="mb-1 text-lg font-semibold text-gray-600">
        No events found
      </Text>
      <Text className="text-sm text-gray-500">
        Try adjusting your search or filters
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pb-2 pt-4">
        <View className="mb-4 flex-row rounded-lg bg-gray-100 p-1">
          <Pressable
            className={`flex-1 items-center rounded-md px-4 py-2 ${
              activeTab === 'events' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('events')}
          >
            <Text
              className={`text-base font-medium ${
                activeTab === 'events'
                  ? 'font-semibold text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Events
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 items-center rounded-md px-4 py-2 ${
              activeTab === 'orgs' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('orgs')}
          >
            <Text
              className={`text-base font-medium ${
                activeTab === 'orgs'
                  ? 'font-semibold text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Orgs
            </Text>
          </Pressable>
        </View>

        <View className="mb-2">
          <View className="flex-row items-center rounded-lg bg-gray-50 px-3 py-2">
            <Ionicons
              name="search-outline"
              size={18}
              color="#4B5563"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 text-base text-gray-900"
              placeholder="Search for events..."
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            <Pressable className="p-1" onPress={() => setShowFilters(true)}>
              <Ionicons name="filter-outline" size={20} color="#4B5563" />
            </Pressable>
          </View>
        </View>
      </View>

      <View className="flex-1">
        {activeTab === 'events' ? (
          <>
            <Text className="mx-4 mb-2 text-lg font-semibold text-gray-900">
              Recommended Events:
            </Text>
            {loading ? (
              <LoadingScreen text="Loading events..." />
            ) : (
              <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#3B82F6"
                  />
                }
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={{ paddingBottom: 16 }}
              />
            )}
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-gray-600">
              Organizations coming soon!
            </Text>
          </View>
        )}
      </View>

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}
