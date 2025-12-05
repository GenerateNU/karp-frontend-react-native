import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Share,
  FlatList,
  StyleSheet,
  Linking,
} from 'react-native';
import { PageBackground } from './common/PageBackground';
import { Ionicons } from '@expo/vector-icons';
import { Organization } from '@/types/api/organization';
import { Calendar } from '@/components/Calendar';
import { eventService } from '@/services/eventService';
import { Event } from '@/types/api/event';
import { imageService } from '@/services/imageService';
import { useRouter } from 'expo-router';
import { EventCard } from './EventCard';
import { Image } from 'expo-image';

interface OrgSelectProps {
  visible: boolean;
  organization: Organization | null;
  onClose: () => void;
}

function OrgSelect({ visible, organization, onClose }: OrgSelectProps) {
  const router = useRouter();
  const [orgEvents, setOrgEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(
    null
  );

  const [showFullCalendar, setShowFullCalendar] = useState(false); // ⭐ ADDED

  useEffect(() => {
    const fetchOrgEvents = async () => {
      if (!organization?.id) return;
      try {
        setEventsLoading(true);
        const events = await eventService.getEventsByOrganization(
          organization.id
        );
        setOrgEvents(events || []);
        const todayKey = new Date().toISOString().slice(0, 10);
        const hasToday = (events || []).some(
          ev =>
            new Date(ev.startDateTime).toISOString().slice(0, 10) === todayKey
        );
        if (hasToday) {
          setSelectedDate(todayKey);
        } else if ((events || []).length > 0) {
          setSelectedDate(
            new Date(events[0].startDateTime).toISOString().slice(0, 10)
          );
        }
      } catch (error) {
        console.error('Failed to fetch organization events', error);
        setOrgEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    if (visible) fetchOrgEvents();
  }, [visible, organization?.id]);

  useEffect(() => {
    async function fetchImage() {
      if (!organization?.id) return;
      try {
        const url = await imageService.getImageUrl(
          'organization',
          organization.id
        );
        setImagePreSignedUrl(url);
      } catch (err) {
        console.error('Failed to fetch image:', err);
      }
    }
    console.log(organization);
    if (organization?.imageS3Key) fetchImage();
  }, [organization?.imageS3Key, organization?.id]);

  const markedDates = useMemo(() => {
    const marks = orgEvents.reduce<Record<string, any>>((acc, ev) => {
      const key = new Date(ev.startDateTime).toISOString().slice(0, 10);
      acc[key] = { ...(acc[key] || {}), marked: true };
      return acc;
    }, {});
    if (selectedDate) {
      marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true };
    }
    return marks;
  }, [orgEvents, selectedDate]);

  const filteredEvents = useMemo(() => {
    return orgEvents.filter(
      ev =>
        new Date(ev.startDateTime).toISOString().slice(0, 10) === selectedDate
    );
  }, [orgEvents, selectedDate]);

  const handleEventPress = useCallback((event: Event) => {
    console.log('Event pressed:', event);
    console.log('Navigating to event details for ID:', event.id);
    onClose();
    setShowFullCalendar(false);
    router.push(`/events/${event.id}/info`);
  }, []);

  const renderEvent = ({ item }: { item: Event }) => (
    console.log('Rendering event:', item),
    (<EventCard event={item} onPress={handleEventPress} />)
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${organization?.name}! ${organization?.description || ''}`,
        title: organization?.name,
        url: 'https://www.google.com/search?q=' + organization?.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDateHeading = (key: string) =>
    new Date(key + 'T00:00:00').toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  if (!organization) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <PageBackground type="fishes" style={{ flex: 1 }} contentPosition="top">
        {/* full calendar of events */}
        {showFullCalendar ? (
          <View className="flex-1 px-5 pt-5">
            <Pressable
              className="mb-4 flex-row items-center"
              onPress={() => setShowFullCalendar(false)}
            >
              <Ionicons name="arrow-back" size={24} />
              <Text className="ml-2 text-lg font-medium">Back</Text>
            </Pressable>

            <Text className="font-ubuntu mb-4 text-center text-3xl font-bold text-gray-900">
              Event Dates:
            </Text>

            <Calendar
              onDayPress={d => setSelectedDate(d.dateString)}
              markedDates={markedDates}
            />

            <View className="mt-6 flex-1 border-t border-gray-200 pt-4">
              <Text className="mb-3 text-xl font-semibold text-gray-900">
                {formatDateHeading(selectedDate)}
              </Text>

              {eventsLoading ? (
                <Text className="text-base text-gray-600">Loading events…</Text>
              ) : filteredEvents.length === 0 ? (
                <Text className="text-base text-gray-600">
                  No events on this day.
                </Text>
              ) : (
                <FlatList
                  data={filteredEvents}
                  keyExtractor={ev => ev.id.toString()}
                  style={{ flexGrow: 1 }}
                  nestedScrollEnabled
                  contentContainerStyle={{ paddingBottom: 16 }}
                  renderItem={renderEvent}
                />
              )}
            </View>
          </View>
        ) : (
          /* Org info */
          <>
            <ScrollView className="flex-1">
              <View className="border-b border-gray-200 px-5 pb-3 pt-4">
                {imagePreSignedUrl ? (
                  <Image
                    source={{ uri: imagePreSignedUrl }}
                    style={styles.eventImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.eventImage, styles.imagePlaceholder]} />
                )}

                <View className="mt-[27px] flex-row items-center justify-between">
                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#1D0F48',
                      fontFamily: 'Ubuntu',
                      fontSize: 48,
                      fontWeight: '700',
                      lineHeight: 60,
                    }}
                  >
                    {organization.name}
                  </Text>

                  <Pressable
                    className="rounded-lg border border-gray-300 p-2"
                    onPress={handleShare}
                  >
                    <Ionicons name="share-outline" size={20} color="#4B5563" />
                  </Pressable>
                </View>
              </View>

              <View className="px-5">
                <View className="mt-5">
                  <Text
                    style={{
                      marginBottom: 8,
                      fontSize: 18,
                      lineHeight: 19,
                      fontWeight: '700',
                      color: '#1D0F48',
                      fontFamily: 'Inter',
                    }}
                  >
                    About Us:
                  </Text>
                  <Text
                    style={{
                      marginBottom: 8,
                      fontSize: 16,
                      lineHeight: 19,
                      color: '#1D0F48',
                      fontFamily: 'Inter',
                    }}
                  >
                    {organization.description || 'No description provided.'}
                  </Text>
                </View>

                {(organization as any).website ? (
                  <View className="mt-4">
                    <Text
                      style={{
                        marginBottom: 8,
                        fontSize: 18,
                        lineHeight: 19,
                        fontWeight: '700',
                        color: '#1D0F48',
                        fontFamily: 'Inter',
                      }}
                    >
                      Website:
                    </Text>
                    <Text
                      style={styles.website}
                      onPress={() => {
                        if (organization.website) {
                          const url = organization.website.startsWith('http')
                            ? organization.website
                            : `https://${organization.website}`;
                          Linking.openURL(url);
                        }
                      }}
                    >
                      {organization.website}
                    </Text>
                  </View>
                ) : null}

                <View className="mt-4">
                  <Text
                    style={{
                      marginBottom: 8,
                      fontSize: 18,
                      lineHeight: 19,
                      fontWeight: '700',
                      color: '#1D0F48',
                      fontFamily: 'Inter',
                    }}
                  >
                    Location:
                  </Text>
                  <Text
                    style={{
                      marginBottom: 8,
                      fontSize: 16,
                      lineHeight: 19,
                      color: '#1D0F48',
                      fontFamily: 'Inter',
                    }}
                  >
                    {organization.address}
                  </Text>
                </View>

                <View className="mt-8 items-center px-6">
                  <Pressable
                    className="w-[195px] items-center rounded-[16.333px] bg-[#74C0EB] px-[35px] py-3"
                    onPress={() => setShowFullCalendar(true)}
                  >
                    <Text className="text-center font-[Inter] text-[18px] font-bold text-[#1D0F48]">
                      Events Calendar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </>
        )}
        <View className="border-t border-gray-200 px-5 py-4">
          <Pressable
            className="items-center rounded-lg bg-gray-900 py-3"
            onPress={() => {
              onClose();
              setShowFullCalendar(false);
            }}
          >
            <Text className="text-base font-semibold text-white">Close</Text>
          </Pressable>
        </View>
      </PageBackground>
    </Modal>
  );
}

export { OrgSelect };

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
  },
  eventImage: {
    width: '100%',
    height: 168,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    backgroundColor: '#E5E5E5',
  },
  website: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 19,
    color: '#1D0F48',
    fontFamily: 'Inter',
    textDecorationLine: 'underline', // makes it visually clear it’s clickable
    color: '#1D4ED8', // optional: make it look like a link
  },
});
