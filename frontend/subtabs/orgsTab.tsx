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
} from 'react-native';
import { Organization, OrgFilters } from '@/types/api/organization';
import { orgService } from '@/services/organizationService';
import { OrgCard } from '@/components/OrgCard';
import { FilterModal } from '@/components/FilterModal';
// import { useRouter } from 'expo-router';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';

export default function OrgsScreen() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OrgFilters>({});
  //   const [activeTab, setActiveTab] = useState<'events' | 'orgs'>('events');
  // const router = useRouter();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOrganizations = useCallback(
    async (searchQuery?: string, filters?: OrgFilters) => {
      try {
        setLoading(true);
        const fetchedOrgs = await orgService.getAllOrganizations(filters);
        setOrganizations(fetchedOrgs);
      } catch (error) {
        console.error('Error loading organizations:', error);
        Alert.alert('Error', 'Failed to load organizations. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleRefresh = useCallback(async () => {
    console.log(searchQuery, filters);
    setSearchQuery(searchQuery);
    setRefreshing(true);
    await loadOrganizations(searchQuery, filters);
    setRefreshing(false);
  }, [loadOrganizations, searchQuery, filters]);

  //   const handleSearch = useCallback(
  //     (query: string) => {
  //       setSearchQuery(query);
  //       if (searchDebounceRef.current) {
  //         clearTimeout(searchDebounceRef.current);
  //       }
  //       searchDebounceRef.current = setTimeout(() => {
  //         loadEvents(query, filters);
  //       }, 400);
  //     },
  //     [loadEvents, filters]
  //   );

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const handleApplyFilters = useCallback(
    (newFilters: OrgFilters) => {
      setFilters(newFilters);
      loadOrganizations(searchQuery, newFilters);
    },
    [loadOrganizations, searchQuery]
  );

  //   const handleOrgPress = useCallback((organization: Organization) => {
  //     console.log('Event pressed:', event);
  //     console.log('Navigating to event details for ID:', organization.id);
  //     router.push(`/orgs/${organization.id}/info`);
  //     // Alert.alert(
  //     //   event.name,
  //     //   `Status: ${event.status}\n\nStart: ${new Date(event.start_date_time).toLocaleString()}\nEnd: ${new Date(event.end_date_time).toLocaleString()}\nLocation: ${event.location || event.address}\nMax Volunteers: ${event.max_volunteers}\nCoins: ${event.coins}`,
  //     //   [{ text: 'OK' }]
  //     // );
  //   }, []);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const renderOrganization = ({ item }: { item: Organization }) => (
    console.log('Rendering organization:', item),
    (<OrgCard organization={item} />)
  ); // onPress={handleOrgPress}

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
              placeholder="Search for organizations..."
              value={searchQuery}
              //   onChangeText={handleSearch}
              returnKeyType="search"
            />
            <Pressable className="p-1" onPress={() => setShowFilters(true)}>
              <Ionicons name="filter-outline" size={20} color="#4B5563" />
            </Pressable>
          </View>
        </View>
      </View>

      <View className="flex-1">
        <Text className="mx-4 mb-2 text-lg font-semibold text-gray-900">
          Recommended Organizations:
        </Text>
        {loading ? (
          <LoadingScreen text="Loading events..." />
        ) : (
          <FlatList
            data={organizations}
            renderItem={renderOrganization}
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
