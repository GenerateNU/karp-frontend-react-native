import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack , useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/profileService';
import { Event as EventType } from '@/types/api/event';
import { EventCard } from '@/components/EventCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { BackHeader } from '@/components/common/BackHeader';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export default function PastEventsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPastEvents = async (isRefresh = false) => {
    if (!user?.entityId) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const pastEvents = await profileService.getPastEvents(user.entityId);
      setEvents(pastEvents);
    } catch (error) {
      console.error('Error loading past events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPastEvents();
  }, [user?.entityId]);

  if (loading) {
    return <LoadingScreen text="Loading past events..." />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <BackHeader />
        <View style={styles.header}>
          <Text style={styles.title}>Past Events</Text>
        </View>
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={event => router.push(`/events/${event.id}/info`)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadPastEvents(true)}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No past events yet. Complete your first event to see it here!
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.eggshellWhite,
  },
  header: {
    paddingHorizontal: 34,
    paddingVertical: 16,
  },
  title: {
    fontFamily: Fonts.regular_400,
    fontSize: 32,
    color: Colors.light.text,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    paddingHorizontal: 32,
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
