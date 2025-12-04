import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Event } from '@/types/api/event';
import { imageService } from '@/services/imageService';

interface FeedCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

export function FeedCard({ event, onPress }: FeedCardProps) {
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

  const formatMonth = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', { month: 'short' });
  };

  const formatDay = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.getDate().toString();
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date
      .toLocaleString('en-US', {
        hour: 'numeric',
        hour12: true,
      })
      .toLowerCase();
  };

  const numCoins = event.coins;

  const numCoinIcons = (() => {
    if (numCoins <= 10) return 1;
    if (numCoins <= 30) return 2;
    if (numCoins <= 50) return 3;
    return 4;
  })();

  return (
    <Pressable
      className="mx-4 my-2.5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      onPress={() => onPress(event)}
      android_ripple={{ color: '#f0f0f0' }}
    >
      {/* Coins Badge - Top Right */}
      <View className="absolute right-4 top-4 z-10 flex-row items-center gap-1">
        {Array.from({ length: numCoinIcons }).map((_, idx) => (
          <Image
            key={idx}
            source={require('../assets/images/karp-coin.svg')}
            className="ml-1 h-5 w-5"
          />
        ))}
        <Text
          className="text-xs font-normal text-indigo-950"
          style={{ fontFamily: 'Inter' }}
        >
          {numCoins} Koins
        </Text>
      </View>

      {/* Event Details Section */}
      <View className="mt-6 inline-flex h-24 w-full items-start justify-start gap-5">
        <View className="relative h-24 flex-1">
          {/* Date Badge - Left Side with Background Image */}
          <View className="absolute left-0 top-0 h-28 w-24 overflow-hidden rounded-[9.86px]">
            {imagePreSignedUrl ? (
              <Image
                source={{ uri: imagePreSignedUrl }}
                className="h-full w-full"
                style={{ opacity: 1.0 }}
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full bg-indigo-950" />
            )}

            {/* Date Text Overlay */}
            <View className="absolute inset-0 flex items-center justify-center bg-indigo-950/20 px-5 py-3.5">
              <Text className="text-center">
                <Text
                  className="text-base font-bold text-white"
                  style={{ fontFamily: 'Ubuntu' }}
                >
                  {formatMonth(event.startDateTime)}
                  {'\n'}
                </Text>
                <Text
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: 'Ubuntu' }}
                >
                  {formatDay(event.startDateTime)}
                </Text>
              </Text>
            </View>
          </View>

          {/* Event Info - Right Side */}
          <View
            className="absolute top-0 inline-flex w-52 flex-col items-start justify-center gap-2.5"
            style={{ left: 90 }}
          >
            {/* Event Name */}
            <Text
              className="w-44 text-base font-bold text-indigo-950"
              style={{ fontFamily: 'Ubuntu' }}
              numberOfLines={2}
            >
              {event.name}
            </Text>

            {/* Location */}
            <View className="inline-flex flex-row items-center justify-start gap-2">
              <Image
                source={require('../assets/images/location-icon.svg')}
                className="ml-1 h-5 w-5"
              />
              <Text
                className="flex-1 text-sm font-normal text-indigo-950"
                style={{ fontFamily: 'Inter' }}
                numberOfLines={1}
              >
                {event.address}
              </Text>
            </View>

            {/* Time */}
            <View className="inline-flex flex-row items-center justify-start gap-2">
              <Image
                source={require('../assets/images/clock-icon.svg')}
                className="ml-1 h-5 w-5"
              />
              <Text
                className="text-sm font-normal text-indigo-950"
                style={{ fontFamily: 'Inter' }}
              >
                {formatTime(event.startDateTime)} to{' '}
                {formatTime(event.endDateTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* More Info Button - Bottom */}
      <View className="flex items-end justify-end">
        <Pressable className="mt-4 w-24 flex-row items-center justify-center gap-1 rounded-[9.86px] bg-amber-400 px-3 py-2">
          <Text
            className="text-xs font-normal text-indigo-950"
            style={{ fontFamily: 'Avenir' }}
          >
            More Info &gt;
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
