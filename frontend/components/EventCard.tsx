import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Event } from '@/types/api/event';

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Pressable
      className="mx-4 my-2 overflow-hidden rounded-xl bg-white shadow-sm"
      onPress={() => onPress(event)}
      android_ripple={{ color: '#f0f0f0' }}
    >
      <View className="h-40 bg-gray-100">
        <View className="h-full w-full items-center justify-center bg-gray-200">
          <Text className="text-3xl">📅</Text>
        </View>
      </View>

      <View className="p-4">
        <Text
          className="mb-1 text-lg font-semibold text-gray-900"
          numberOfLines={2}
        >
          {event.name}
        </Text>

        {/* <Text className="mb-3 text-sm text-gray-600" numberOfLines={1}>
          Organization ID: {event.organization_id}
        </Text> */}

        <View className="mb-3">
          <Text className="mb-1 text-sm text-gray-700">
            {formatDateTime(event.startDateTime)}
          </Text>

          <View className="flex-row items-center">
            <Text className="mr-1 text-xs">📍</Text>
            <Text className="flex-1 text-sm text-gray-600" numberOfLines={1}>
              {event.address}
            </Text>
          </View>
        </View>

        <View className="mb-2 flex-row items-center justify-between">
          <View className="rounded-xl bg-gray-100 px-2 py-1">
            <Text className="text-xs font-medium text-gray-600">
              {event.status}
            </Text>
          </View>

          <View className="rounded-xl bg-green-100 px-2 py-1">
            <Text className="text-xs font-semibold text-green-800">
              {event.coins} coins
            </Text>
          </View>
        </View>

        <View className="mt-1">
          <Text className="text-xs text-gray-600">
            Max volunteers: {event.maxVolunteers}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
