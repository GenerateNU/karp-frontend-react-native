import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Event } from '@/types/api/event';
import { imageService } from '@/services/imageService';

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchImageUrl() {
      try {
        const url = await imageService.getImageUrl('event', event.id);
        setImagePreSignedUrl(url);
      } catch (err) {
        console.error('Failed to fetch image:', err);
      }
    }

    if (event.imageS3Key) {
      console.log('image key!');
      fetchImageUrl();
    }
  }, [event.id, event.imageS3Key]);

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
        {imagePreSignedUrl ? (
          <Image
            source={{ uri: imagePreSignedUrl }}
            className="h-full w-full"
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#eeeeee6b',
            }}
          />
        )}
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
          {/* <View className="rounded-xl bg-gray-100 px-2 py-1">
            <Text className="text-xs font-medium text-gray-600">
              {event.status}
            </Text>
          </View> */}

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
