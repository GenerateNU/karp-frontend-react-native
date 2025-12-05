import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  SafeAreaView,
  Alert,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Event,
  EventFilters,
  EventSortOption,
  EVENT_SORT_OPTIONS,
} from '@/types/api/event';
import { eventService } from '@/services/eventService';
import { EventCard } from '@/components/EventCard';
import { useRouter } from 'expo-router';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { useEventFilters } from '@/context/EventFiltersContext';
import { Colors } from '@/constants/Colors';

const SORT_LABELS: Record<EventSortOption, string> = {
  recommendations: 'Recommendations',
  been_before: 'Been Before',
  new_additions: 'New Additions',
  coins_low_to_high: 'Koins: Lowest to Highest',
  coins_high_to_low: 'Koins: Highest to Lowest',
};

export default function EventsScreen() {
  const { locationFilter } = useLocation();
  const { volunteer } = useAuth();
  const { filters, setFilters } = useEventFilters();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadEvents = useCallback(
  async (searchQuery?: string, filters?: EventFilters) => {
    try {
      setLoading(true);
      const volunteerId = volunteer?.id;

      let adjustedFilters = filters;
      if ((filters?.sort_by === 'recommendations' && !volunteerId)) {
        adjustedFilters = { ...filters, sort_by: undefined };
        setFilters(adjustedFilters);
      }
      
      const fetchedEvents = await eventService.getAllEvents(
        searchQuery,
        adjustedFilters,
        locationFilter,
        volunteerId
      );
      const futureEvents = fetchedEvents.filter(
        event => new Date(event.startDateTime).getTime() > Date.now()
      );
      setEvents(futureEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  },
  [locationFilter, volunteer]
);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents(searchQuery, filters);
    setRefreshing(false);
  }, [loadEvents, searchQuery, filters]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      searchDebounceRef.current = setTimeout(() => {
        loadEvents(query, filters);
      }, 400);
    },
    [loadEvents, filters]
  );

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    loadEvents(searchQuery, filters);
  }, [filters, searchQuery, loadEvents]);

  const handleEventPress = useCallback(
    (event: Event) => {
      router.push(`/events/${event.id}/info`);
    },
    [router]
  );
  const handleSortPress = useCallback(
    (sortOption: EventSortOption) => {
      const newFilters: EventFilters = {
        ...filters,
        sort_by: filters.sort_by === sortOption ? undefined : sortOption,
      };
      if (filters.sort_by === sortOption) {
        delete newFilters.sort_by;
      }
      setFilters(newFilters);
    },
    [filters, setFilters]
  );

  useEffect(() => {
    loadEvents(searchQuery, filters);
  }, [filters, loadEvents, searchQuery]);

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
      <View className="pb-2 pt-4">
        {/* <View className="mb-4 flex-row rounded-lg bg-gray-100 p-1">
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
        </View> */}

        <View className="mb-2 px-6">
          <View style={styles.searchBarContainer}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#6B7280"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for events..."
              placeholderTextColor={Colors.light.primaryText}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            <Pressable
              style={styles.filterButton}
              onPress={() => router.push('/events/filters')}
            >
              <Ionicons
                name="options-outline"
                size={18}
                color={Colors.light.primaryText}
              />
            </Pressable>
          </View>
        </View>

        {/* Sort Options Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortPillsContainer}
          className="mb-2"
        >
          {EVENT_SORT_OPTIONS.filter(sortOption => {
            // Hide recommendations if user not logged in
            if (sortOption === 'recommendations' && !volunteer?.id) {
              return false;
            }
            return true;
          }).map(sortOption => {
            const isSelected = filters.sort_by === sortOption;
             return (
            <Pressable
              key={sortOption}
              onPress={() => handleSortPress(sortOption)}
              style={[styles.sortPill, isSelected && styles.sortPillSelected]}
            >
              <Text
                style={[
                  styles.sortPillText,
                  isSelected && styles.sortPillTextSelected,
                ]}
              >
                {SORT_LABELS[sortOption]}
            </Text>
        </Pressable>
      );
    })}
        </ScrollView>
      </View>

      <View className="flex-1">
        <>
          <Text className="mx-4 mb-2 text-lg font-semibold text-gray-900">
            Upcoming Events:
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
              contentContainerStyle={{ paddingBottom: 75 }}
            />
          )}
        </>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.searchBarBorder,
    borderRadius: 999, // Very rounded for pill shape
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.primaryText,
    padding: 0, // Remove default padding
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.primaryText,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sortPillsContainer: {
    paddingHorizontal: 4,
    gap: 8,
  },
  sortPill: {
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.searchBarBorder,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortPillSelected: {
    backgroundColor: Colors.light.moreInfoButton,
    borderColor: Colors.light.primaryText,
  },
  sortPillText: {
    fontSize: 14,
    color: Colors.light.primaryText,
  },
  sortPillTextSelected: {
    fontWeight: '600',
  },
});
