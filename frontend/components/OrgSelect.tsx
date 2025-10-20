import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Linking,
  Image,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Organization } from '@/types/api/organization';
import { Calendar } from '@/components/Calendar';
import { eventService } from '@/services/eventService';
import { Event } from '@/types/api/event';

interface OrgSelectProps {
  visible: boolean;
  organization: Organization | null;
  onClose: () => void;
}

function OrgSelect({ visible, organization, onClose }: OrgSelectProps) {
  if (!organization) return null;

  const [orgEvents, setOrgEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    const fetchOrgEvents = async () => {
      if (!organization?.id) return;
      try {
        setEventsLoading(true);
        const events = await eventService.getEventsByOrganization(
          organization.id
        );
        setOrgEvents(events || []);
        // Initialize selectedDate to today if it has events, else first event date
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

  const openWebsite = () => {
    if (organization?.location && (organization as any).website) {
      const url = (organization as any).website as string;
      if (url) Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    }
  };

  const handleShare = async () => {
    try {
      const shareContent = {
        message: `Check out ${organization.name}! ${organization.description || ''}`,
        title: organization.name,
        url:
          (organization as any).website ||
          'https://www.google.com/search?q=' + organization.name,
      };

      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

  const formatDateHeading = (key: string) =>
    new Date(key + 'T00:00:00').toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1">
          <View className="border-b border-gray-200 px-5 pb-3 pt-4">
            <View className="mb-3 h-80 overflow-hidden rounded-xl bg-gray-100">
              <Image
                source={{
                  uri:
                    organization.imageUrl ||
                    'https://www.pointsoflight.org/wp-content/uploads/2021/03/AdobeStock_289737123-scaled.jpeg',
                }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-row items-center justify-between">
              <Text
                className="text-3xl font-extrabold text-gray-900"
                numberOfLines={2}
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
              <Text className="mb-2 text-lg font-semibold text-gray-900">
                About Us:
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                {organization.description || 'No description provided.'}
              </Text>
            </View>

            {(organization as any).website ? (
              <View className="mt-4">
                <Text className="text-base font-medium text-gray-900">
                  Website: {(organization as any).website}
                </Text>
              </View>
            ) : null}

            <View className="mt-4">
              {(organization as any).pointOfContact ? (
                <Text className="mb-1 text-base font-medium text-gray-900">
                  Point of Contact: {(organization as any).pointOfContact}
                </Text>
              ) : null}
              <Text className="text-base font-medium text-gray-900">
                Location: {organization.address}
              </Text>
            </View>

            <View className="mt-8">
              <Text className="mb-3 text-xl font-bold text-gray-900">
                Upcoming Events:
              </Text>
              <Calendar
                onDayPress={d => setSelectedDate(d.dateString)}
                markedDates={markedDates}
              />

              <View className="mt-6 border-t border-gray-200 pt-4">
                <Text className="mb-3 text-lg font-semibold text-gray-900">
                  {formatDateHeading(selectedDate)}
                </Text>
                {eventsLoading ? (
                  <Text className="text-base text-gray-600">
                    Loading events…
                  </Text>
                ) : filteredEvents.length === 0 ? (
                  <Text className="text-base text-gray-600">
                    No events on this day for this organization.
                  </Text>
                ) : (
                  filteredEvents.map(ev => (
                    <View
                      key={ev.id}
                      className="mb-4 flex-row items-start gap-3"
                    >
                      <View className="h-8 w-16 rounded-md bg-gray-300" />
                      <View className="flex-1">
                        <Text className="text-base font-medium text-gray-900">
                          {ev.name}
                        </Text>
                        <Text className="mt-2 text-xs text-gray-600">
                          Times:
                        </Text>
                        <View className="mt-1 flex-row flex-wrap gap-2">
                          {[
                            `${formatTime(ev.startDateTime)}`,
                            `${formatTime(ev.endDateTime)}`,
                          ].map((t, idx) => (
                            <View
                              key={`${ev.id}-${idx}`}
                              className="rounded-md border border-gray-300 px-3 py-1"
                            >
                              <Text className="text-xs text-gray-700">{t}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="border-t border-gray-200 px-5 py-4">
          <Pressable
            className="items-center rounded-lg bg-gray-900 py-3"
            onPress={onClose}
          >
            <Text className="text-base font-semibold text-white">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export { OrgSelect };
